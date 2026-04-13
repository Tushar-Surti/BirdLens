import { audioPredictionLibrary } from "@/lib/site-data";

import { DetectionWorkbench } from "./detection-workbench";

export function AudioDetectionExperience() {
  return (
    <DetectionWorkbench
      mode="audio"
      uploadTitle="Upload a bird audio clip"
      uploadDescription="Submit a short recording of a bird call or song. Cleaner clips with a dominant vocal line will create a more legible acoustic result state."
      accept="audio/wav,audio/mpeg,audio/ogg,audio/flac,audio/x-m4a,audio/mp4"
      helperText="Supported formats include WAV, MP3, OGG, FLAC, and M4A. Short clips with minimal human noise or overlapping calls are ideal."
      supportedFormats={["WAV / MP3 / OGG / FLAC", "Short field recordings", "Dominant vocal signal"]}
      previewType="audio"
      actionLabel="Run Audio Detection"
      predictions={audioPredictionLibrary}
      facts={[
        { label: "Input", value: "Uploaded call or song clip" },
        { label: "Model focus", value: "Cadence, pitch contour, phrase shape" },
        { label: "Output", value: "Species shortlist + confidence" }
      ]}
      insights={[
        {
          title: "Best acoustic cues",
          description:
            "Repeated phrases, tonal rise or fall, rhythm stability, and dominant frequency regions influence the acoustic readout most strongly."
        },
        {
          title: "When confidence improves",
          description:
            "Predictions benefit from clips with a clear foreground call and a narrower sound scene rather than layered dawn chorus recordings."
        },
        {
          title: "How to read the result",
          description:
            "Treat the top match as a leading hypothesis and compare nearby alternatives against habitat, timing, and observer notes."
        }
      ]}
      recorderPlaceholder={{
        title: "Live recording can slot in here next.",
        description:
          "The interface reserves space for browser-based capture without disrupting the premium layout. When the backend is ready, this block can evolve into a direct record-and-detect flow.",
        items: ["Browser capture", "Noise trimming", "Live inference state"]
      }}
    />
  );
}
