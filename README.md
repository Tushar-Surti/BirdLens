# BirdLens

BirdLens is a bird species detection project for Indian birds with two modalities:

- Vision: bird image classification and detection
- Audio: bird sound detection and classification

The repository now includes both the research assets and a premium frontend experience built with Next.js, Tailwind CSS, and TypeScript.

## Repository Layout

```text
BirdLens/
├── apps/
│   └── web/               # Next.js frontend for the BirdLens product experience
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

## Frontend

The website lives in `apps/web` and includes:

- Homepage with premium landing sections
- Detection mode selection flow
- Image detection page with upload, preview, loading, and result states
- Audio detection page with upload, playback, recording placeholder, loading, and result states

To run the frontend locally:

```bash
cd apps/web
npm install
npm run dev
```

## Datasets

Datasets are downloaded from Kaggle inside the notebooks and are not stored in this repository.

- Vision notebook: `ichhadhari/indian-birds`
- Audio notebook: `soumendraprasad/sound-of-114-species-of-birds-till-2022`

## Notes

- The vision notebook saves its checkpoint and final weights inside `models/vision/`.
- The audio notebook saves its trained weights inside `models/audio/`.
- The frontend currently uses polished placeholder predictions until a live inference backend is connected.
