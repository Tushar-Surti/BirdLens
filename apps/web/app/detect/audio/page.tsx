import type { Metadata } from "next";

import { AudioDetectionExperience } from "@/components/detection/audio-detection-experience";
import { Container } from "@/components/layout/container";
import { MotionReveal } from "@/components/ui/motion-reveal";

export const metadata: Metadata = {
  title: "Audio Detection | BirdLens",
  description: "Upload a bird audio clip and preview BirdLens acoustic species detection."
};

export default function AudioDetectionPage() {
  return (
    <>
      <section className="pb-12 pt-16 sm:pb-16 sm:pt-20">
        <Container>
          <MotionReveal className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[rgba(183,152,102,0.8)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                Audio Detection
              </p>
            </div>
            <h1 className="font-display text-5xl leading-[0.92] tracking-[-0.045em] text-[var(--color-text)] sm:text-[4.4rem]">
              A refined acoustic workflow for bird call recognition.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              Upload a bird audio clip to preview how BirdLens can present audio-led detection in a
              calm, high-end interface that respects both signal quality and interpretability.
            </p>
          </MotionReveal>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24">
        <Container>
          <AudioDetectionExperience />
        </Container>
      </section>
    </>
  );
}
