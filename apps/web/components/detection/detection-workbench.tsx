"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { PredictionSession } from "@/lib/site-data";
import { pickIndexedItem } from "@/lib/utils";

import { SurfaceCard } from "../ui/surface-card";
import { FileUploadPanel } from "./file-upload-panel";
import { PredictionPanel } from "./prediction-panel";

type InsightItem = {
  title: string;
  description: string;
};

type FactItem = {
  label: string;
  value: string;
};

type RecorderPlaceholder = {
  title: string;
  description: string;
  items: string[];
};

type DetectionWorkbenchProps = {
  mode: "image" | "audio";
  uploadTitle: string;
  uploadDescription: string;
  accept: string;
  helperText: string;
  supportedFormats: string[];
  previewType: "image" | "audio";
  actionLabel: string;
  predictions: PredictionSession[];
  facts: FactItem[];
  insights: InsightItem[];
  recorderPlaceholder?: RecorderPlaceholder;
};

type AudioInferenceCandidate = {
  species: string;
  confidence: number;
};

type AudioInferenceResponse = {
  model: string;
  top_k: number;
  window_seconds: number;
  sample_rate: number;
  image_size: number;
  predictions: AudioInferenceCandidate[];
};

type ImageInferenceCandidate = {
  species: string;
  confidence: number;
};

type ImageInferenceResponse = {
  model: string;
  top_k: number;
  image_size: number;
  predictions: ImageInferenceCandidate[];
};

function prettifySpeciesName(species: string): string {
  return species.replace(/_sound$/i, "").replace(/[_-]/g, " ").trim();
}

function toAudioPredictionSession(payload: AudioInferenceResponse, fileName: string): PredictionSession {
  const ranked = payload.predictions;
  const [best] = ranked;
  const alternatives = ranked.slice(1);

  const primarySpecies = prettifySpeciesName(best?.species ?? "Unknown species");
  const primaryConfidence = Number.isFinite(best?.confidence) ? best.confidence : 0;

  return {
    headline: "Live acoustic inference complete",
    summary: `The uploaded clip is most consistent with ${primarySpecies} based on the current ${payload.model} checkpoint.`,
    primary: {
      species: primarySpecies,
      confidence: primaryConfidence,
      note: `Top-ranked match from live model inference on ${fileName}.`
    },
    alternatives: alternatives.map((item) => ({
      species: prettifySpeciesName(item.species),
      confidence: item.confidence,
      note: "Alternative candidate from the same top-k inference pass."
    })),
    metrics: [
      { label: "Window", value: `${payload.window_seconds.toFixed(1)}s` },
      { label: "Sample rate", value: `${payload.sample_rate} Hz mono` },
      { label: "Feature map", value: `${payload.image_size}x${payload.image_size} log-Mel` }
    ],
    caution:
      "Confidence can distribute across acoustically similar species; validate using habitat, season, and observer context."
  };
}

function toImagePredictionSession(payload: ImageInferenceResponse, fileName: string): PredictionSession {
  const ranked = payload.predictions;
  const [best] = ranked;
  const alternatives = ranked.slice(1);

  const primarySpecies = prettifySpeciesName(best?.species ?? "Unknown species");
  const primaryConfidence = Number.isFinite(best?.confidence) ? best.confidence : 0;

  return {
    headline: "Live visual inference complete",
    summary: `The uploaded image is most consistent with ${primarySpecies} based on the current ${payload.model} checkpoint.`,
    primary: {
      species: primarySpecies,
      confidence: primaryConfidence,
      note: `Top-ranked match from live model inference on ${fileName}.`
    },
    alternatives: alternatives.map((item) => ({
      species: prettifySpeciesName(item.species),
      confidence: item.confidence,
      note: "Alternative candidate from the same top-k inference pass."
    })),
    metrics: [
      { label: "Input size", value: `${payload.image_size}x${payload.image_size}` },
      { label: "Model", value: payload.model },
      { label: "Output", value: `Top-${payload.top_k} ranked species` }
    ],
    caution:
      "Visually similar species can share plumage and silhouette cues; validate with location, season, and behavior context."
  };
}

export function DetectionWorkbench({
  mode,
  uploadTitle,
  uploadDescription,
  accept,
  helperText,
  supportedFormats,
  previewType,
  actionLabel,
  predictions,
  facts,
  insights,
  recorderPlaceholder
}: DetectionWorkbenchProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionSession | null>(null);
  const [inferenceError, setInferenceError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function runDetection(file: File) {
    if (isLoading) return;

    setIsLoading(true);
    setResult(null);
    setInferenceError(null);

    if (mode === "audio") {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/detect/audio", {
          method: "POST",
          body: formData
        });

        const payload = (await response.json()) as AudioInferenceResponse | { error?: string };

        if (!response.ok || !("predictions" in payload)) {
          const errorMessage =
            "error" in payload && payload.error ? payload.error : "Audio inference failed.";
          throw new Error(errorMessage);
        }

        startTransition(() => {
          setResult(toAudioPredictionSession(payload, file.name));
          setIsLoading(false);
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unable to run live audio inference.";
        setInferenceError(errorMessage);
        setIsLoading(false);
      }

      return;
    }

    if (mode === "image") {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/detect/image", {
          method: "POST",
          body: formData
        });

        const payload = (await response.json()) as ImageInferenceResponse | { error?: string };

        if (!response.ok || !("predictions" in payload)) {
          const errorMessage =
            "error" in payload && payload.error ? payload.error : "Image inference failed.";
          throw new Error(errorMessage);
        }

        startTransition(() => {
          setResult(toImagePredictionSession(payload, file.name));
          setIsLoading(false);
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unable to run live image inference.";
        setInferenceError(errorMessage);
        setIsLoading(false);
      }

      return;
    }

    timerRef.current = setTimeout(() => {
      startTransition(() => {
        setResult(pickIndexedItem(predictions, file.name));
        setIsLoading(false);
      });
    }, 1500);
  }

  function handleFileSelect(file: File) {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setIsLoading(false);
    setInferenceError(null);

    runDetection(file);
  }

  function handleClear() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setIsLoading(false);
    setInferenceError(null);
  }

  return (
    <>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_420px]">
      <div className="flex flex-col gap-6">
        <FileUploadPanel
          title={uploadTitle}
          description={uploadDescription}
          accept={accept}
          helperText={helperText}
          supportedFormats={supportedFormats}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          previewType={previewType}
          isLoading={isLoading}
          inferenceError={inferenceError}
          onFileSelect={handleFileSelect}
          onClear={handleClear}
          onRerun={() => selectedFile && runDetection(selectedFile)}
        />

        {recorderPlaceholder ? (
          <SurfaceCard className="p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                  Recording UI Placeholder
                </p>
                <h3 className="mt-3 font-display text-[2rem] leading-none tracking-[-0.04em] text-[var(--color-text)]">
                  {recorderPlaceholder.title}
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(23,52,42,0.08)] bg-[rgba(23,52,42,0.06)] text-[var(--color-forest)]">
                <Mic size={18} />
              </div>
            </div>
            <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
              {recorderPlaceholder.description}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {recorderPlaceholder.items.map((item) => (
                <div
                  key={item}
                  className="rounded-[20px] border border-[rgba(23,52,42,0.08)] bg-[rgba(255,255,255,0.5)] px-4 py-4 text-sm leading-6 text-[var(--color-text)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </SurfaceCard>
        ) : null}
      </div>

      <div>
        <PredictionPanel
          mode={mode}
          selectedFile={selectedFile}
          isLoading={isLoading}
          result={result}
        />
      </div>
    </div>

    {/* Alternative Species — full width, only when results are available */}
    <AnimatePresence>
      {result && result.alternatives.length > 0 ? (
        <motion.div
          key="alternatives"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <SurfaceCard className="mt-6 p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                Alternative Species
              </p>
              <p className="text-sm text-[var(--color-muted)]">Ranked shortlist</p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {result.alternatives.map((candidate, index) => (
                <div
                  key={candidate.species}
                  className="rounded-[20px] border border-[rgba(23,52,42,0.08)] bg-[rgba(255,255,255,0.52)] p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug text-[var(--color-text)]">
                      {candidate.species}
                    </p>
                    <p className="shrink-0 text-sm font-semibold text-[var(--color-text)]">
                      {candidate.confidence.toFixed(1)}%
                    </p>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-[rgba(23,52,42,0.08)]">
                    <motion.div
                      className="h-full rounded-full bg-[rgba(53,84,72,0.85)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${candidate.confidence}%` }}
                      transition={{ duration: 0.6, delay: 0.1 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">
                    {candidate.note}
                  </p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </motion.div>
      ) : null}
    </AnimatePresence>

    {/* Detection Notes — full width below both columns */}
    <SurfaceCard className="mt-6 p-6 sm:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
        Detection Notes
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-[20px] border border-[rgba(23,52,42,0.08)] bg-[rgba(255,255,255,0.52)] px-4 py-4"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-olive)]">
              {fact.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text)]">{fact.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {insights.map((insight) => (
          <div key={insight.title} className="space-y-2">
            <h3 className="text-sm font-medium text-[var(--color-text)]">{insight.title}</h3>
            <p className="text-sm leading-7 text-[var(--color-muted)]">{insight.description}</p>
          </div>
        ))}
      </div>
    </SurfaceCard>
    </>
  );
}
