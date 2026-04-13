"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AudioLines, ImageIcon, Sparkles } from "lucide-react";

import { PredictionSession } from "@/lib/site-data";

import { SurfaceCard } from "../ui/surface-card";

type PredictionPanelProps = {
  mode: "image" | "audio";
  selectedFile: File | null;
  isLoading: boolean;
  result: PredictionSession | null;
};

const loadingLines = [0, 0.08, 0.16];

export function PredictionPanel({
  mode,
  selectedFile,
  isLoading,
  result
}: PredictionPanelProps) {
  const icon = mode === "image" ? <ImageIcon size={18} /> : <AudioLines size={18} />;

  return (
    <SurfaceCard className="sticky top-28 overflow-hidden p-6 sm:p-7">
      <div className="absolute left-0 right-0 top-0 h-px gold-line" />
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <span className="text-[var(--color-forest)]">{icon}</span>
          Prediction Result
        </div>
        <span className="rounded-full bg-[rgba(23,52,42,0.06)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-olive)]">
          Demo Output
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5 py-12"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[rgba(23,52,42,0.08)] bg-[rgba(23,52,42,0.06)] text-[var(--color-forest)]">
              <Sparkles size={20} />
            </div>
            <div className="space-y-3">
              <h3 className="font-display text-[2rem] leading-none tracking-[-0.04em] text-[var(--color-text)]">
                Ready when your input is.
              </h3>
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                Upload a {mode === "image" ? "bird image" : "bird audio clip"} to preview the
                premium result state, including confidence, alternatives, and concise scientific
                framing.
              </p>
            </div>
          </motion.div>
        ) : isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 py-10"
          >
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                Analysis In Progress
              </p>
              <h3 className="font-display text-[2rem] leading-none tracking-[-0.04em] text-[var(--color-text)]">
                Reviewing the strongest species signals.
              </h3>
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                {mode === "image"
                  ? "Evaluating visual markers such as color distribution, silhouette, and visible field traits."
                  : "Scanning phrase structure, vocal cadence, and dominant acoustic contours."}
              </p>
            </div>

            <div className="space-y-4">
              {loadingLines.map((delay, index) => (
                <motion.div
                  key={delay}
                  className="overflow-hidden rounded-full bg-[rgba(23,52,42,0.08)]"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: [0.45, 1, 0.45] }}
                  transition={{ repeat: Infinity, duration: 1.4, delay }}
                  style={{ height: index === 0 ? 12 : 8 }}
                >
                  <motion.div
                    className="h-full rounded-full bg-[rgba(23,52,42,0.18)]"
                    initial={{ width: "20%" }}
                    animate={{ width: ["20%", "68%", "44%"] }}
                    transition={{ repeat: Infinity, duration: 2.1, delay }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : result ? (
          <motion.div
            key={result.primary.species}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 py-8"
          >
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-champagne)]">
                  {result.headline}
                </p>
                <h3 className="mt-3 font-display text-[2.6rem] leading-none tracking-[-0.05em] text-[var(--color-text)]">
                  {result.primary.species}
                </h3>
              </div>

              <div className="rounded-[22px] border border-[rgba(23,52,42,0.08)] bg-[rgba(255,255,255,0.58)] p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-olive)]">
                      Confidence
                    </p>
                    <p className="mt-2 font-display text-[2.2rem] leading-none tracking-[-0.05em] text-[var(--color-text)]">
                      {result.primary.confidence.toFixed(1)}%
                    </p>
                  </div>
                  <p className="max-w-[220px] text-right text-sm leading-6 text-[var(--color-muted)]">
                    {selectedFile.name}
                  </p>
                </div>
                <div className="mt-4 h-2 rounded-full bg-[rgba(23,52,42,0.08)]">
                  <motion.div
                    className="h-full rounded-full bg-[var(--color-forest)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.primary.confidence}%` }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              <p className="text-sm leading-7 text-[var(--color-muted)]">{result.summary}</p>
              <p className="text-sm leading-7 text-[var(--color-text)]">{result.primary.note}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {result.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[20px] border border-[rgba(23,52,42,0.08)] bg-[rgba(255,255,255,0.52)] px-4 py-4"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-olive)]">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-text)]">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                  Alternative Species
                </p>
                <p className="text-sm text-[var(--color-muted)]">Ranked shortlist</p>
              </div>
              <div className="space-y-4">
                {result.alternatives.map((candidate, index) => (
                  <div key={candidate.species} className="space-y-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">
                          {candidate.species}
                        </p>
                        <p className="text-xs leading-5 text-[var(--color-muted)]">
                          {candidate.note}
                        </p>
                      </div>
                      <p className="text-sm text-[var(--color-text)]">
                        {candidate.confidence.toFixed(1)}%
                      </p>
                    </div>
                    <div className="h-1.5 rounded-full bg-[rgba(23,52,42,0.08)]">
                      <motion.div
                        className="h-full rounded-full bg-[rgba(53,84,72,0.92)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${candidate.confidence}%` }}
                        transition={{
                          duration: 0.6,
                          delay: 0.15 + index * 0.08,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[22px] border border-[rgba(23,52,42,0.08)] bg-[rgba(23,52,42,0.04)] p-5">
              <p className="text-sm leading-7 text-[var(--color-muted)]">{result.caution}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SurfaceCard>
  );
}
