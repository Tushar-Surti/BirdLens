import { multimodalReasons } from "@/lib/site-data";

import { Container } from "../layout/container";
import { MotionReveal } from "../ui/motion-reveal";
import { SurfaceCard } from "../ui/surface-card";

export function WhyMultimodalSection() {
  return (
    <section className="section-divider py-20 sm:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <MotionReveal className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[rgba(183,152,102,0.8)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                Why Multimodal Detection
              </p>
            </div>
            <h2 className="font-display text-4xl leading-[0.94] tracking-[-0.04em] text-[var(--color-text)] sm:text-5xl lg:text-[4.2rem]">
              Bird identification is rarely neat. The product should respect that.
            </h2>
            <p className="max-w-xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              BirdLens is built for real field conditions where some observations begin with a
              photograph, others with a call, and many with imperfect evidence that still deserves
              a thoughtful result experience.
            </p>
          </MotionReveal>

          <div className="grid gap-5">
            {multimodalReasons.map((reason, index) => (
              <MotionReveal key={reason.title} delay={index * 0.08}>
                <SurfaceCard className="p-6 sm:p-7">
                  <h3 className="font-display text-[2rem] leading-none tracking-[-0.035em] text-[var(--color-text)]">
                    {reason.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
                    {reason.description}
                  </p>
                </SurfaceCard>
              </MotionReveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
