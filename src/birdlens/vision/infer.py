"""Command-line image inference for BirdLens vision checkpoint."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
from torchvision import models, transforms

DEFAULT_IMAGE_SIZE = 224
DEFAULT_TOP_K = 5
NORMALIZE_MEAN = [0.485, 0.456, 0.406]
NORMALIZE_STD = [0.229, 0.224, 0.225]


def default_model_path() -> Path:
    repo_root = Path(__file__).resolve().parents[3]
    return repo_root / "models" / "vision" / "indian_birds_image_classifier.pth"


def build_model(num_classes: int) -> nn.Module:
    model = models.efficientnet_b0(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.4),
        nn.Linear(in_features, 512),
        nn.ReLU(),
        nn.Dropout(p=0.3),
        nn.Linear(512, num_classes),
    )
    return model


def preprocess_image(image_path: Path, image_size: int) -> torch.Tensor:
    image = Image.open(image_path).convert("RGB")
    tfms = transforms.Compose(
        [
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize(NORMALIZE_MEAN, NORMALIZE_STD),
        ]
    )
    return tfms(image).unsqueeze(0)


def run_inference(image_path: Path, model_path: Path, top_k: int) -> dict[str, Any]:
    if not image_path.exists():
        raise FileNotFoundError(f"Image file not found: {image_path}")

    if not model_path.exists():
        raise FileNotFoundError(f"Model checkpoint not found: {model_path}")

    checkpoint = torch.load(str(model_path), map_location="cpu", weights_only=False)

    classes = checkpoint.get("classes")
    if not classes:
        raise ValueError("Checkpoint does not contain class labels.")

    num_classes = int(checkpoint.get("num_classes", len(classes)))

    model = build_model(num_classes)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()

    x = preprocess_image(image_path, DEFAULT_IMAGE_SIZE)
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
        "model": "EfficientNet-B0",
        "top_k": k,
        "image_size": DEFAULT_IMAGE_SIZE,
        "predictions": predictions,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run BirdLens image inference.")
    parser.add_argument("--image-path", required=True, help="Path to input image file.")
    parser.add_argument("--model-path", default=str(default_model_path()), help="Path to checkpoint file.")
    parser.add_argument("--top-k", type=int, default=DEFAULT_TOP_K, help="Number of top predictions to return.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    try:
        result = run_inference(Path(args.image_path), Path(args.model_path), args.top_k)
        print(json.dumps(result))
        return 0
    except Exception as exc:  # noqa: BLE001
        error_payload = {"error": str(exc)}
        print(json.dumps(error_payload), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
