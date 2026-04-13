import Link from "next/link";
import { ArrowUpRight, AudioLines, Camera } from "lucide-react";

import { DetectionMode, detectionModes } from "@/lib/site-data";

import { buttonVariants } from "../ui/button";
import { MotionReveal } from "../ui/motion-reveal";
import { SurfaceCard } from "../ui/surface-card";

function ModeIcon({ icon }: Pick<DetectionMode, "icon">) {
  if (icon === "audio") {
    return <AudioLines size={20} />;
  }

  return <Camera size={20} />;
}

type DetectionModeGridProps = {
  modes?: DetectionMode[];
};

export function DetectionModeGrid({ modes = detectionModes }: DetectionModeGridProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {modes.map((mode, index) => (
        <MotionReveal key={mode.href} delay={index * 0.08}>
          <SurfaceCard className="group h-full p-7 sm:p-8">
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                    {mode.eyebrow}
                  </p>
                  <h3 className="font-display text-3xl leading-none tracking-[-0.03em] text-[var(--color-text)] sm:text-[2.2rem]">
                    {mode.title}
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(23,52,42,0.08)] bg-[rgba(23,52,42,0.06)] text-[var(--color-forest)]">
                  <ModeIcon icon={mode.icon} />
                </div>
              </div>

              <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-muted)]">
                {mode.description}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {mode.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-[20px] border border-[rgba(23,52,42,0.08)] bg-[rgba(255,255,255,0.52)] px-4 py-4 text-sm leading-6 text-[var(--color-text)]"
                  >
                    {highlight}
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm leading-6 text-[var(--color-muted)]">{mode.footnote}</p>

              <div className="mt-8 pt-6">
                <Link
                  href={mode.href}
                  className={buttonVariants({
                    variant: "secondary",
                    className:
                      "group/cta w-full justify-between rounded-[20px] border-[rgba(23,52,42,0.12)] px-5"
                  })}
                >
                  Open {mode.title}
                  <ArrowUpRight
                    size={16}
                    className="transition duration-200 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </SurfaceCard>
        </MotionReveal>
      ))}
    </div>
  );
}
