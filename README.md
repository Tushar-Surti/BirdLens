---
title: BirdLens API
emoji: 🐦
colorFrom: green
colorTo: blue
sdk: docker
pinned: false
---

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
- `notebooks/audio/bird_sound_classifier.ipynb`
- `models/vision/indian_birds_image_classifier.pth`
- `models/audio/bird_classifier_full.pth`
- `models/audio/label_encoder.pkl`

## Frontend

The website lives in `apps/web` and includes:

- Homepage with premium landing sections
- Detection mode selection flow
- Image detection page with upload, preview, loading, and result states
- Audio detection page with upload, playback, recording placeholder, loading, and result states

## Run The App

Detection now uses live backend routes:

- Audio: `apps/web/app/api/detect/audio/route.ts` -> `src/birdlens/audio/infer.py`
- Image: `apps/web/app/api/detect/image/route.ts` -> `src/birdlens/vision/infer.py`

1. Open a terminal at the repository root.
2. Activate the conda environment:

```bash
conda activate birdlens
```

3. Install Python dependencies (from the current repo file name):

```bash
pip install -r requiremnts.tcxt
```

4. Install frontend dependencies and start the app:

```bash
cd apps/web
npm install
npm run dev
```

5. Open `http://localhost:3000`.

Optional: if backend routes cannot find Python automatically, set this before `npm run dev`:

```bash
set AUDIO_PYTHON_PATH=C:/Users/tusha/miniconda3/envs/birdlens/python.exe
set IMAGE_PYTHON_PATH=C:/Users/tusha/miniconda3/envs/birdlens/python.exe
```

## Datasets

Datasets are downloaded from Kaggle inside the notebooks and are not stored in this repository.

- Vision notebook: `ichhadhari/indian-birds`
- Audio notebook: `soumendraprasad/sound-of-114-species-of-birds-till-2022`

## Notes

- The vision notebook saves its checkpoint and final weights inside `models/vision/`.
- The audio notebook saves its trained weights inside `models/audio/`.
- Image detection is wired to live model inference via the backend API route.
- Audio detection is wired to live model inference via the backend API route.
