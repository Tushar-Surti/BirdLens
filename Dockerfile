# BirdLens ML Backend
# Both image (EfficientNet-B0) and audio (LightBirdNet) models in one container

FROM python:3.11-slim

# System deps:
#   libsndfile1  - required by librosa for audio decoding
#   ffmpeg       - required by librosa for mp3/ogg/etc. support
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies first (layer-cached unless requirements change)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy ML inference source code
COPY src/ ./src/

# Copy trained model checkpoints (~25 MB total)
COPY models/ ./models/

# Copy FastAPI application
COPY backend/ ./backend/

# Make birdlens package importable
ENV PYTHONPATH=/app/src
# Disable numba JIT to prevent memory spike on first librosa call
ENV NUMBA_DISABLE_JIT=1

EXPOSE 7860

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
