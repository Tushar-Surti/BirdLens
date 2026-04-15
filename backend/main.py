"""FastAPI backend for BirdLens ML inference."""

from __future__ import annotations

import asyncio
import os
import tempfile
import urllib.request
from contextlib import asynccontextmanager
from pathlib import Path

import uvicorn
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from birdlens.audio.infer import run_inference as audio_inference
from birdlens.vision.infer import run_inference as vision_inference

REPO_ROOT = Path(__file__).resolve().parents[1]
IMAGE_MODEL_PATH = REPO_ROOT / "models" / "vision" / "indian_birds_image_classifier.pth"
AUDIO_MODEL_PATH = REPO_ROOT / "models" / "audio" / "bird_classifier_full.pth"

PING_INTERVAL = 10 * 60  # 10 minutes — keeps Render free tier awake


async def _self_ping() -> None:
    """Ping own /health endpoint every 10 min to prevent Render free-tier sleep."""
    port = os.environ.get("PORT", "8000")
    url = f"http://localhost:{port}/health"
    while True:
        await asyncio.sleep(PING_INTERVAL)
        try:
            urllib.request.urlopen(url, timeout=10)
        except Exception:
            pass  # ignore — server may still be starting up


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(_self_ping())
    yield
    task.cancel()


app = FastAPI(title="BirdLens API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
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
        result = vision_inference(tmp_path, IMAGE_MODEL_PATH, top_k=5)
        return result
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
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
        result = audio_inference(tmp_path, AUDIO_MODEL_PATH, top_k=5)
        return result
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        tmp_path.unlink(missing_ok=True)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
