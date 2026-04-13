import { howItWorksSteps } from "@/lib/site-data";

import { Container } from "../layout/container";
import { MotionReveal } from "../ui/motion-reveal";
import { SectionHeading } from "../ui/section-heading";
import { SurfaceCard } from "../ui/surface-card";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-divider py-20 sm:py-24">
      <Container className="space-y-12">
        <MotionReveal>
          <SectionHeading
            eyebrow="How It Works"
            title="A short, deliberate path from input to answer."
            description="The interface keeps the workflow calm and legible: upload once, review a refined result, and move forward with confidence."
          />
        </MotionReveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {howItWorksSteps.map((step, index) => (
            <MotionReveal key={step.step} delay={index * 0.08}>
              <SurfaceCard className="h-full p-7 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-champagne)]">
                  {step.step}
                </p>
                <h3 className="mt-6 font-display text-[2rem] leading-none tracking-[-0.04em] text-[var(--color-text)]">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
                  {step.description}
                </p>
              </SurfaceCard>
            </MotionReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
