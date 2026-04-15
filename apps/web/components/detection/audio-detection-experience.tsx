import { audioPredictionLibrary } from "@/lib/site-data";

import { DetectionWorkbench } from "./detection-workbench";

export function AudioDetectionExperience() {
  return (
    <DetectionWorkbench
      mode="audio"
      uploadTitle="Upload a bird audio clip"
      uploadDescription="Upload a field recording and BirdLens will process a 5-second mono window using the updated LightBirdNet acoustic pipeline for top-species ranking."
      accept="audio/wav,audio/mpeg,audio/ogg,audio/flac,audio/x-m4a,audio/mp4"
      helperText="Supported formats: WAV, MP3, OGG, FLAC, and M4A. Audio is resampled to 22.05 kHz, converted to mono, and normalized into a 128x128 log-Mel window."
      supportedFormats={[
        "WAV / MP3 / OGG / FLAC / M4A",
        "Auto pad/trim to 5 seconds",
        "Top-5 ranked species output"
      ]}
      previewType="audio"
      actionLabel="Run Audio Detection"
      predictions={audioPredictionLibrary}
      facts={[
        { label: "Input", value: "Single uploaded recording (5s analysis window)" },
        { label: "Model", value: "LightBirdNet (log-Mel spectrogram classifier)" },
        { label: "Output", value: "Top-5 species probabilities" }
      ]}
      insights={[
        {
          title: "Preprocessing behavior",
          description:
            "Clips are converted to mono at 22.05 kHz, then represented as 128-bin log-Mel spectrograms to keep inference consistent across uploads."
        },
        {
          title: "When confidence improves",
          description:
            "Predictions improve when one bird is dominant in the foreground and environmental noise does not mask repeated phrase structure."
        },
        {
          title: "How to read the result",
          description:
            "Read the top match as the leading hypothesis, then compare the remaining ranked candidates against location, season, and behavior notes."
        }
      ]}
      recorderPlaceholder={{
        title: "Live recording can slot in here next.",
        description:
          "The interface reserves space for browser capture so an end-to-end record-and-detect flow can be added after the production inference endpoint is connected.",
        items: ["Browser capture", "5s preview window", "Live top-5 inference state"]
      }}
    />
  );
}
