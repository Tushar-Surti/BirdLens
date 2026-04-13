# BirdLens

BirdLens is a bird detection project that is being organized for two tracks:

- Vision: bird image classification and detection
- Audio: bird sound detection and classification

The repo currently contains training notebooks and model artifacts for both image and audio classification.

## Repository Layout

```text
BirdLens/
├── models/
│   ├── audio/              # Audio model artifacts
│   └── vision/             # Image model artifacts
├── notebooks/
│   ├── audio/              # Audio training notebooks
│   └── vision/             # Image training notebooks
└── src/
    └── birdlens/
        ├── audio/          # Audio pipeline code
        └── vision/         # Vision pipeline code
```

## Current Files

- `notebooks/vision/indian_birds_image_training.ipynb`
- `notebooks/audio/bird_species_audio_training.ipynb`
- `models/vision/indian_birds_image_classifier.pth`
- `models/audio/bird_species_audio_classifier.pth`

## Datasets

Datasets are downloaded from Kaggle inside the notebooks and are not stored in this repository.

- Vision notebook: `ichhadhari/indian-birds`
- Audio notebook: `soumendraprasad/sound-of-114-species-of-birds-till-2022`

## Notes

- The vision notebook saves its checkpoint and final weights inside `models/vision/`.
- The audio notebook saves its trained weights inside `models/audio/`.
