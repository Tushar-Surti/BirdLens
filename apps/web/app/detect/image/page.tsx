import type { Metadata } from "next";

import { ImageDetectionExperience } from "@/components/detection/image-detection-experience";
import { Container } from "@/components/layout/container";
import { MotionReveal } from "@/components/ui/motion-reveal";

export const metadata: Metadata = {
  title: "Image Detection | BirdLens",
  description: "Upload a bird image and preview BirdLens visual species detection."
};

export default function ImageDetectionPage() {
  return (
    <>
      <section className="pb-12 pt-16 sm:pb-16 sm:pt-20">
        <Container>
          <MotionReveal className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[rgba(183,152,102,0.8)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                Image Detection
              </p>
            </div>
            <h1 className="font-display text-5xl leading-[0.92] tracking-[-0.045em] text-[var(--color-text)] sm:text-[4.4rem]">
              A premium visual workflow for bird image inference.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              Upload a bird photograph to preview how BirdLens can present image-based species
              detection with clarity, confidence, and product-grade restraint.
            </p>
          </MotionReveal>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24">
        <Container>
          <ImageDetectionExperience />
        </Container>
      </section>
    </>
  );
}
