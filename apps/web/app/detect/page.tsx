import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DetectionModeGrid } from "@/components/detection/detection-mode-grid";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { MotionReveal } from "@/components/ui/motion-reveal";
import { SurfaceCard } from "@/components/ui/surface-card";

export const metadata: Metadata = {
  title: "Choose Detection Mode | BirdLens",
  description: "Select image or audio detection in the BirdLens multimodal experience."
};

export default function DetectionModePage() {
  return (
    <>
      <section className="pb-12 pt-16 sm:pb-16 sm:pt-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <MotionReveal className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[rgba(183,152,102,0.8)]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                  Detection Selection
                </p>
              </div>
              <h1 className="font-display text-5xl leading-[0.92] tracking-[-0.045em] text-[var(--color-text)] sm:text-[4.4rem]">
                Choose the strongest cue from your sighting.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
                Begin with the evidence you have right now: a bird image or an audio clip. Each
                mode routes into a dedicated experience designed around that input type.
              </p>
            </MotionReveal>

            <MotionReveal delay={0.08}>
              <SurfaceCard className="p-6 sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                  Recommended Flow
                </p>
                <div className="mt-5 space-y-4 text-sm leading-7 text-[var(--color-muted)]">
                  <p>Use image detection when you have a strong photograph or cropped field frame.</p>
                  <p>Use audio detection when the call is cleaner than the view.</p>
                  <p>Results are presented as a scientific shortlist with confidence-led emphasis.</p>
                </div>
                <Link
                  href="/detect/image"
                  className={buttonVariants({
                    variant: "secondary",
                    className: "mt-6 w-full justify-between rounded-[20px] px-5"
                  })}
                >
                  Go straight to image detection
                  <ArrowRight size={16} />
                </Link>
              </SurfaceCard>
            </MotionReveal>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24">
        <Container>
          <DetectionModeGrid />
        </Container>
      </section>
    </>
  );
}
