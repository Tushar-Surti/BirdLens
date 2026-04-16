"""FastAPI backend for BirdLens ML inference."""

from __future__ import annotations

import asyncio
import os
import tempfile
import urllib.request
from contextlib import asynccontextmanager
from pathlib import Path

import torch
import torch.nn.functional as F
import uvicorn
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from birdlens.audio.infer import LightBirdNet, load_mel
from birdlens.vision.infer import build_model, preprocess_image

REPO_ROOT = Path(__file__).resolve().parents[1]
IMAGE_MODEL_PATH = REPO_ROOT / "models" / "vision" / "indian_birds_image_classifier.pth"
AUDIO_MODEL_PATH = REPO_ROOT / "models" / "audio" / "bird_classifier_full.pth"

PING_INTERVAL = 10 * 60  # 10 minutes


# ── Models loaded once at startup, reused for every request ─────────────────
class _Cache:
    vision_model = None
    vision_classes: list = []
    audio_model = None
    audio_classes: list = []
    audio_sr: int = 22050
    audio_duration: int = 5
    audio_img_size: int = 128


cache = _Cache()


def _load_vision() -> None:
    checkpoint = torch.load(str(IMAGE_MODEL_PATH), map_location="cpu", weights_only=False)
    classes = list(checkpoint["classes"])
    model = build_model(len(classes))
    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()
    cache.vision_model = model
    cache.vision_classes = classes
    print(f"Vision model loaded — {len(classes)} classes")


def _load_audio() -> None:
    checkpoint = torch.load(str(AUDIO_MODEL_PATH), map_location="cpu", weights_only=False)
    classes = list(checkpoint["classes"])
    num_classes = int(checkpoint.get("num_classes", len(classes)))
    model = LightBirdNet(num_classes)
    model.load_state_dict(checkpoint["state_dict"])
    model.eval()
    cache.audio_model = model
    cache.audio_classes = classes
    cache.audio_sr = int(checkpoint.get("sr", 22050))
    cache.audio_duration = int(checkpoint.get("duration", 5))
    cache.audio_img_size = int(checkpoint.get("img_size", 128))
    print(f"Audio model loaded — {len(classes)} classes")


async def _self_ping() -> None:
    """External-facing ping is handled by UptimeRobot. This is a fallback."""
    port = os.environ.get("PORT", "7860")
    url = f"http://localhost:{port}/health"
    while True:
        await asyncio.sleep(PING_INTERVAL)
        try:
            urllib.request.urlopen(url, timeout=10)
        except Exception:
            pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    _load_vision()
    _load_audio()
    task = asyncio.create_task(_self_ping())
    yield
    task.cancel()


app = FastAPI(title="BirdLens API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/detect/image")
async def detect_image(file: UploadFile = File(...)) -> dict:
    suffix = Path(file.filename or "image.jpg").suffix or ".jpg"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(await file.read())
        tmp_path = Path(tmp.name)

    try:
        x = preprocess_image(tmp_path, 224)
        with torch.inference_mode():
            probs = F.softmax(cache.vision_model(x), dim=1).squeeze(0).cpu().numpy()

        classes = cache.vision_classes
        top_idx = probs.argsort()[::-1][: min(5, len(classes))]
        return {
            "model": "EfficientNet-B0",
            "top_k": len(top_idx),
            "image_size": 224,
            "predictions": [
                {"species": classes[i], "confidence": round(float(probs[i] * 100), 2)}
                for i in top_idx
            ],
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        tmp_path.unlink(missing_ok=True)


@app.post("/detect/audio")
async def detect_audio(file: UploadFile = File(...)) -> dict:
    suffix = Path(file.filename or "audio.wav").suffix or ".wav"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(await file.read())
        tmp_path = Path(tmp.name)

    try:
        mel = load_mel(
            tmp_path,
            sample_rate=cache.audio_sr,
            duration=cache.audio_duration,
            image_size=cache.audio_img_size,
        )
        x = torch.from_numpy(mel).unsqueeze(0).unsqueeze(0)
        with torch.inference_mode():
            probs = F.softmax(cache.audio_model(x), dim=1).squeeze(0).cpu().numpy()

        classes = cache.audio_classes
        top_idx = probs.argsort()[::-1][: min(5, len(classes))]
        return {
            "model": "LightBirdNet",
            "top_k": len(top_idx),
            "window_seconds": cache.audio_duration,
            "sample_rate": cache.audio_sr,
            "image_size": cache.audio_img_size,
            "predictions": [
                {"species": classes[i], "confidence": round(float(probs[i] * 100), 2)}
                for i in top_idx
            ],
        }
    except Exception as exc:
        import traceback
        print(f"AUDIO ERROR: {exc}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        tmp_path.unlink(missing_ok=True)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
