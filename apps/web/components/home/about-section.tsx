import Link from "next/link";

import { aboutStats } from "@/lib/site-data";

import { Container } from "../layout/container";
import { buttonVariants } from "../ui/button";
import { MotionReveal } from "../ui/motion-reveal";
import { SurfaceCard } from "../ui/surface-card";

export function AboutSection() {
  return (
    <section id="about" className="section-divider py-20 sm:py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <MotionReveal className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[rgba(183,152,102,0.8)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                About BirdLens
              </p>
            </div>
            <h2 className="font-display text-4xl leading-[0.94] tracking-[-0.04em] text-[var(--color-text)] sm:text-5xl lg:text-[4.2rem]">
              A flagship interface for a serious bird detection project.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              The platform combines deep-learning experimentation with a product-quality frontend
              so bird species detection feels trustworthy, elegant, and ready to evolve beyond a
              notebook-only workflow.
            </p>
            <Link href="/detect" className={buttonVariants({ variant: "secondary" })}>
              Explore Detection Flow
            </Link>
          </MotionReveal>

          <MotionReveal delay={0.08}>
            <SurfaceCard className="p-7 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {aboutStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[22px] border border-[rgba(23,52,42,0.08)] bg-[rgba(255,255,255,0.5)] px-5 py-5"
                  >
                    <p className="font-display text-[2.4rem] leading-none tracking-[-0.04em] text-[var(--color-text)]">
                      {stat.value}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[22px] border border-[rgba(23,52,42,0.08)] bg-[rgba(23,52,42,0.04)] p-5">
                <p className="text-sm leading-7 text-[var(--color-muted)]">
                  The current frontend uses carefully designed placeholder inference states until a
                  live prediction API is connected. The interaction model, layout system, and
                  result presentation are ready for production integration.
                </p>
              </div>
            </SurfaceCard>
          </MotionReveal>
        </div>
      </Container>
    </section>
  );
}
