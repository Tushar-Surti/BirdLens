"""Command-line audio inference for BirdLens LightBirdNet checkpoint."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

import librosa
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

DEFAULT_SR = 22050
DEFAULT_DURATION = 5
DEFAULT_IMAGE_SIZE = 128
DEFAULT_N_MELS = 128
DEFAULT_N_FFT = 1024
DEFAULT_HOP_LENGTH = 512
DEFAULT_TOP_K = 5


class DepthwiseSepConv(nn.Module):
    """Depthwise-separable convolution block used in LightBirdNet."""

    def __init__(self, in_ch: int, out_ch: int, stride: int = 1) -> None:
        super().__init__()
        self.dw = nn.Sequential(
            nn.Conv2d(in_ch, in_ch, 3, stride=stride, padding=1, groups=in_ch, bias=False),
            nn.BatchNorm2d(in_ch),
            nn.ReLU6(inplace=True),
        )
        self.pw = nn.Sequential(
            nn.Conv2d(in_ch, out_ch, 1, bias=False),
            nn.BatchNorm2d(out_ch),
            nn.ReLU6(inplace=True),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.pw(self.dw(x))


class LightBirdNet(nn.Module):
    """Lightweight CNN model architecture from the audio notebook."""

    def __init__(self, num_classes: int) -> None:
        super().__init__()
        self.stem = nn.Sequential(
            nn.Conv2d(1, 32, 3, stride=2, padding=1, bias=False),
            nn.BatchNorm2d(32),
            nn.ReLU6(inplace=True),
        )

        self.blocks = nn.Sequential(
            DepthwiseSepConv(32, 64, stride=1),
            DepthwiseSepConv(64, 128, stride=2),
            DepthwiseSepConv(128, 128, stride=1),
            DepthwiseSepConv(128, 256, stride=2),
            DepthwiseSepConv(256, 256, stride=1),
            DepthwiseSepConv(256, 512, stride=2),
            *[DepthwiseSepConv(512, 512, stride=1) for _ in range(3)],
            DepthwiseSepConv(512, 512, stride=2),
        )

        self.pool = nn.AdaptiveAvgPool2d(1)
        self.drop = nn.Dropout(0.3)
        self.fc = nn.Linear(512, num_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.stem(x)
        x = self.blocks(x)
        x = self.pool(x).flatten(1)
        x = self.drop(x)
        return self.fc(x)


def default_model_path() -> Path:
    repo_root = Path(__file__).resolve().parents[3]
    return repo_root / "models" / "audio" / "bird_classifier_full.pth"


def load_mel(
    audio_path: Path,
    *,
    sample_rate: int,
    duration: int,
    image_size: int,
    n_mels: int = DEFAULT_N_MELS,
    n_fft: int = DEFAULT_N_FFT,
    hop_length: int = DEFAULT_HOP_LENGTH,
) -> np.ndarray:
    y, _ = librosa.load(str(audio_path), sr=sample_rate, mono=True)
    target_len = sample_rate * duration

    if len(y) < target_len:
        y = np.pad(y, (0, target_len - len(y)))
    else:
        y = y[:target_len]

    mel = librosa.feature.melspectrogram(
        y=y,
        sr=sample_rate,
        n_mels=n_mels,
        n_fft=n_fft,
        hop_length=hop_length,
    )

    log_mel = librosa.power_to_db(mel, ref=np.max)
    tensor = torch.from_numpy(log_mel).float().unsqueeze(0).unsqueeze(0)
    resized = F.interpolate(tensor, size=(image_size, image_size), mode="bilinear", align_corners=False)

    arr = resized.squeeze(0).squeeze(0).numpy()
    arr = (arr - arr.min()) / (arr.max() - arr.min() + 1e-8)
    return arr.astype(np.float32)


def run_inference(audio_path: Path, model_path: Path, top_k: int) -> dict[str, Any]:
    if not audio_path.exists():
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    if not model_path.exists():
        raise FileNotFoundError(f"Model checkpoint not found: {model_path}")

    checkpoint = torch.load(str(model_path), map_location="cpu", weights_only=False)

    classes = checkpoint.get("classes")
    if not classes:
        raise ValueError("Checkpoint does not contain class labels.")

    num_classes = int(checkpoint.get("num_classes", len(classes)))
    sample_rate = int(checkpoint.get("sr", DEFAULT_SR))
    duration = int(checkpoint.get("duration", DEFAULT_DURATION))
    image_size = int(checkpoint.get("img_size", DEFAULT_IMAGE_SIZE))

    model = LightBirdNet(num_classes)
    model.load_state_dict(checkpoint["state_dict"])
    model.eval()

    mel = load_mel(audio_path, sample_rate=sample_rate, duration=duration, image_size=image_size)

    x = torch.from_numpy(mel).unsqueeze(0).unsqueeze(0)
    with torch.no_grad():
        logits = model(x)
        probs = F.softmax(logits, dim=1).squeeze(0).cpu().numpy()

    k = max(1, min(top_k, len(classes)))
    top_idx = probs.argsort()[::-1][:k]

    predictions = [
        {
            "species": str(classes[i]),
            "confidence": round(float(probs[i] * 100.0), 2),
        }
        for i in top_idx
    ]

    return {
        "model": "LightBirdNet",
        "top_k": k,
        "window_seconds": duration,
        "sample_rate": sample_rate,
        "image_size": image_size,
        "predictions": predictions,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run BirdLens audio inference.")
    parser.add_argument("--audio-path", required=True, help="Path to input audio file.")
    parser.add_argument("--model-path", default=str(default_model_path()), help="Path to checkpoint file.")
    parser.add_argument("--top-k", type=int, default=DEFAULT_TOP_K, help="Number of top predictions to return.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    try:
        result = run_inference(Path(args.audio_path), Path(args.model_path), args.top_k)
        print(json.dumps(result))
        return 0
    except Exception as exc:  # noqa: BLE001
        error_payload = {
            "error": str(exc),
        }
        print(json.dumps(error_payload), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
