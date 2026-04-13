# BirdLens

BirdLens is a bird detection project that is being organized for two tracks:

- Vision: bird image classification and detection
- Audio: bird sound detection and classification

The repo currently contains the image training notebook and trained model, with matching space reserved for the upcoming audio work.

## Repository Layout

```text
BirdLens/
├── data/                    # Local datasets and generated data (ignored by git)
├── models/
│   ├── audio/              # Future audio models
│   └── vision/             # Current image model artifacts
├── notebooks/
│   ├── audio/              # Future audio notebooks
│   └── vision/             # Current image training notebooks
└── src/
    └── birdlens/
        ├── audio/          # Future audio pipeline code
        └── vision/         # Future vision pipeline code
```

## Current Files

- `notebooks/vision/indian_birds_image_training.ipynb`
- `models/vision/indian_birds_image_classifier.pth`

## Notes

- The training notebook now saves checkpoints and final weights inside `models/vision/`.
- Keep datasets in `data/` so large downloaded files stay out of version control.
