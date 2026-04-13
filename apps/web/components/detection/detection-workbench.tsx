"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";

import { PredictionSession } from "@/lib/site-data";
import { pickIndexedItem } from "@/lib/utils";

import { Button } from "../ui/button";
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
  }

  function handleRunDetection() {
    if (!selectedFile || isLoading) {
      return;
    }

    setIsLoading(true);
    setResult(null);

    timerRef.current = setTimeout(() => {
      startTransition(() => {
        setResult(pickIndexedItem(predictions, selectedFile.name));
        setIsLoading(false);
      });
    }, 1500);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_420px] xl:items-start">
      <div className="space-y-6">
        <FileUploadPanel
          title={uploadTitle}
          description={uploadDescription}
          accept={accept}
          helperText={helperText}
          supportedFormats={supportedFormats}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          previewType={previewType}
          onFileSelect={handleFileSelect}
          onClear={handleClear}
        />

        <div className="flex flex-col gap-4 rounded-[28px] border border-[rgba(23,52,42,0.08)] bg-[rgba(255,255,255,0.46)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
              Run Inference
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              This frontend currently uses placeholder predictions until the live model endpoint is
              connected.
            </p>
          </div>
          <Button
            className="min-w-[180px]"
            disabled={!selectedFile || isLoading}
            onClick={handleRunDetection}
          >
            {isLoading ? "Analyzing..." : actionLabel}
          </Button>
        </div>

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

      <div className="space-y-6">
        <PredictionPanel
          mode={mode}
          selectedFile={selectedFile}
          isLoading={isLoading}
          result={result}
        />

        <SurfaceCard className="p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
            Detection Notes
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
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

          <div className="mt-6 space-y-5">
            {insights.map((insight) => (
              <div key={insight.title} className="space-y-2">
                <h3 className="text-sm font-medium text-[var(--color-text)]">{insight.title}</h3>
                <p className="text-sm leading-7 text-[var(--color-muted)]">{insight.description}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
