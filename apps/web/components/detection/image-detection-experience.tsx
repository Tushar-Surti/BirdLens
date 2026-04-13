import { imagePredictionLibrary } from "@/lib/site-data";

import { DetectionWorkbench } from "./detection-workbench";

export function ImageDetectionExperience() {
  return (
    <DetectionWorkbench
      mode="image"
      uploadTitle="Upload a bird image"
      uploadDescription="Use a clean image with a visible bird subject. Full-body views, clear head profiles, and stable natural light will generally produce the most informative result."
      accept="image/png,image/jpeg,image/webp"
      helperText="Supported formats: JPG, PNG, and WEBP. Higher-contrast crops and single-subject frames work best for the current visual workflow."
      supportedFormats={["JPG / PNG / WEBP", "Single bird frame", "Clear head or body view"]}
      previewType="image"
      actionLabel="Run Image Detection"
      predictions={imagePredictionLibrary}
      facts={[
        { label: "Input", value: "Single uploaded bird photo" },
        { label: "Model focus", value: "Plumage, silhouette, posture" },
        { label: "Output", value: "Species shortlist + confidence" }
      ]}
      insights={[
        {
          title: "Best visual cues",
          description:
            "Head pattern, beak profile, wing bars, crest shape, and body proportions tend to be the most decisive traits."
        },
        {
          title: "When confidence improves",
          description:
            "Predictions are stronger when the bird is isolated from heavy foliage and the crop avoids strong motion blur."
        },
        {
          title: "How to read the result",
          description:
            "Use the leading prediction and nearby alternatives together, especially when multiple species share similar coloration."
        }
      ]}
    />
  );
}
