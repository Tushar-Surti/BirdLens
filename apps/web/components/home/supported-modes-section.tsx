import { supportedModeHighlights } from "@/lib/site-data";

import { Container } from "../layout/container";
import { MotionReveal } from "../ui/motion-reveal";
import { SectionHeading } from "../ui/section-heading";
import { SurfaceCard } from "../ui/surface-card";

export function SupportedModesSection() {
  return (
    <section className="section-divider py-20 sm:py-24">
      <Container className="space-y-12">
        <MotionReveal>
          <SectionHeading
            eyebrow="Supported Detection Modes"
            title="Refined outputs, grounded interactions."
            description="Each mode keeps the experience restrained and readable so results feel credible, not noisy."
          />
        </MotionReveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {supportedModeHighlights.map((item, index) => (
            <MotionReveal key={item.title} delay={index * 0.08}>
              <SurfaceCard className="h-full p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                  Mode Highlight
                </p>
                <h3 className="mt-5 font-display text-[2rem] leading-none tracking-[-0.04em] text-[var(--color-text)]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-[var(--color-text)]">{item.caption}</p>
                <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">{item.note}</p>
              </SurfaceCard>
            </MotionReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
