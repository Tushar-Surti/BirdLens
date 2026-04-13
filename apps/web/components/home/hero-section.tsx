"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, AudioLines, Camera, Sparkles } from "lucide-react";
import { useRef } from "react";

import { aboutStats } from "@/lib/site-data";

import { Container } from "../layout/container";
import { buttonVariants } from "../ui/button";
import { MotionReveal } from "../ui/motion-reveal";
import { SurfaceCard } from "../ui/surface-card";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  const leftY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 72]);
  const leftOpacity = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.82]);
  const rightY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 104]);
  const rightRotate = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -1.25]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 48]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.42, reduceMotion ? 0.42 : 0.14]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-4rem] top-14 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(183,152,102,0.12)_0%,rgba(183,152,102,0.02)_42%,transparent_72%)] blur-3xl"
        style={{ y: glowY, opacity: glowOpacity }}
      />
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:items-end">
          <motion.div style={{ y: leftY, opacity: leftOpacity }}>
            <MotionReveal className="space-y-8 pt-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(23,52,42,0.1)] bg-[rgba(255,255,255,0.44)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-champagne)]" />
                Premium Multimodal Bird Detection
              </div>

              <div className="space-y-6">
                <h1 className="font-display text-[3.35rem] leading-[0.92] tracking-[-0.045em] text-[var(--color-text)] sm:text-[4.4rem] lg:text-[5.75rem]">
                  Identify Indian birds through sight and song.
                </h1>
                <p className="max-w-2xl text-balance text-lg leading-8 text-[var(--color-muted)] sm:text-xl">
                  BirdLens brings image and audio inference into one calm, product-quality
                  interface for species recognition that feels precise, credible, and field-ready.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/detect" className={buttonVariants({ className: "min-w-[184px]" })}>
                  Start Detection
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/#how-it-works"
                  className={buttonVariants({
                    variant: "secondary",
                    className: "min-w-[184px]"
                  })}
                >
                  Learn More
                </Link>
              </div>

              <div className="grid gap-4 pt-3 sm:grid-cols-3">
                {aboutStats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    className="rounded-[24px] border border-[rgba(23,52,42,0.08)] bg-[rgba(255,255,255,0.46)] px-5 py-4"
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="font-display text-[2rem] leading-none tracking-[-0.04em] text-[var(--color-text)]">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </MotionReveal>
          </motion.div>

          <motion.div style={{ y: rightY, rotate: rightRotate, transformOrigin: "50% 0%" }}>
            <MotionReveal delay={0.08}>
              <div className="mx-auto w-full max-w-[620px] space-y-5 lg:mx-0">
                <SurfaceCard className="relative overflow-hidden p-7 sm:p-8">
                <div className="absolute left-0 right-0 top-0 h-px gold-line" />
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                      Field Session Preview
                    </p>
                    <h2 className="mt-3 font-display text-[2.3rem] leading-none tracking-[-0.04em] text-[var(--color-text)]">
                      A refined detection experience, not a dashboard.
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(23,52,42,0.08)] bg-[rgba(23,52,42,0.06)] text-[var(--color-forest)]">
                    <Sparkles size={18} />
                  </div>
                </div>

                <div className="mt-8 grid items-stretch gap-4 md:grid-cols-[1.05fr_0.95fr]">
                  <div className="rounded-[24px] border border-[rgba(23,52,42,0.08)] bg-[rgba(255,255,255,0.52)] p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)]">
                        <Camera size={15} className="text-[var(--color-forest)]" />
                        Image Inference
                      </div>
                      <span className="rounded-full bg-[rgba(23,52,42,0.08)] px-3 py-1 text-xs text-[var(--color-forest)]">
                        94.2%
                      </span>
                    </div>
                    <p className="mt-6 font-display text-[2rem] leading-none tracking-[-0.04em] text-[var(--color-text)]">
                      Indian Roller
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                      Plumage contrast, head profile, and perched stance produced the strongest
                      visual agreement.
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[rgba(23,52,42,0.08)] bg-[rgba(255,255,255,0.52)] p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)]">
                        <AudioLines size={15} className="text-[var(--color-forest)]" />
                        Audio Inference
                      </div>
                      <span className="rounded-full bg-[rgba(23,52,42,0.08)] px-3 py-1 text-xs text-[var(--color-forest)]">
                        Live sample
                      </span>
                    </div>
                    <p className="mt-6 font-display text-[2rem] leading-none tracking-[-0.04em] text-[var(--color-text)]">
                      Asian Koel
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                      Phrase repetition and tonal rise aligned with the dominant acoustic signature.
                    </p>
                    <div className="mt-6 space-y-3">
                      {[88, 62, 34].map((value, index) => (
                        <div key={value} className="space-y-2">
                          <div className="h-1.5 rounded-full bg-[rgba(23,52,42,0.08)]">
                            <motion.div
                              className="h-full rounded-full bg-[var(--color-forest)]"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${value}%` }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.8,
                                delay: 0.18 + index * 0.08,
                                ease: [0.16, 1, 0.3, 1]
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {["Image upload", "Audio upload", "Scientific result cards"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[rgba(23,52,42,0.08)] px-4 py-2 text-sm text-[var(--color-text)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </SurfaceCard>

                <div className="flex lg:justify-end">
                  <SurfaceCard className="w-full max-w-[280px] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                    Crafted Flow
                  </p>
                  <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
                    <p>Choose modality.</p>
                    <p>Upload the cleanest cue.</p>
                    <p>Review a concise, confidence-led shortlist.</p>
                  </div>
                  </SurfaceCard>
                </div>
              </div>
            </MotionReveal>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
