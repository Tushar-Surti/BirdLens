"use client";

import { AudioLines, ImageIcon, RefreshCcw, RotateCcw, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { formatBytes } from "@/lib/utils";

import { Button } from "../ui/button";
import { SurfaceCard } from "../ui/surface-card";

type FileUploadPanelProps = {
  title: string;
  description: string;
  accept: string;
  helperText: string;
  supportedFormats: string[];
  selectedFile: File | null;
  previewUrl: string | null;
  previewType: "image" | "audio";
  isLoading: boolean;
  inferenceError: string | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  onRerun: () => void;
};

const waveformBars = [34, 62, 48, 80, 40, 56, 72, 44, 60, 36, 69, 52];

export function FileUploadPanel({
  title,
  description,
  accept,
  helperText,
  supportedFormats,
  selectedFile,
  previewUrl,
  previewType,
  isLoading,
  inferenceError,
  onFileSelect,
  onClear,
  onRerun
}: FileUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    onFileSelect(file);
    setIsDragging(false);
  }

  return (
    <SurfaceCard className="flex h-full flex-col overflow-hidden">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {/* ── IMAGE PREVIEW (replaces the drop zone once a file is chosen) ── */}
      {selectedFile && previewUrl ? (
        <>
          {previewType === "image" ? (
            <div
              className="group relative min-h-[280px] flex-1 cursor-pointer"
              onClick={openPicker}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            >
              <img
                src={previewUrl}
                alt="Uploaded bird preview"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* hover overlay — invite to swap */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[rgba(23,52,42,0.52)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.14)] text-white backdrop-blur-sm">
                  <Upload size={18} />
                </div>
                <p className="text-sm font-medium text-white">Replace image</p>
              </div>
              {/* loading pulse overlay */}
              {isLoading ? (
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[rgba(23,52,42,0.6)] to-transparent p-5">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </span>
                    <p className="text-sm font-medium text-white">Analyzing…</p>
                  </div>
                </div>
              ) : null}
              {isDragging ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-none border-2 border-dashed border-white bg-[rgba(23,52,42,0.4)]">
                  <p className="text-sm font-medium text-white">Drop to replace</p>
                </div>
              ) : null}
            </div>
          ) : (
            /* AUDIO: keep a compact waveform block at the top */
            <div className="border-b border-[rgba(23,52,42,0.08)] bg-[rgba(244,238,226,0.72)] p-5 sm:p-6">
              <div className="flex items-end gap-2">
                {waveformBars.map((height, index) => (
                  <span
                    key={`${height}-${index}`}
                    className="block w-full rounded-full bg-[rgba(23,52,42,0.14)]"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
              <audio controls src={previewUrl} className="mt-4 w-full" />
            </div>
          )}

          {/* ── FILE META + ACTIONS bar ── */}
          <div className="shrink-0 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--color-text)]">
                  {selectedFile.name}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                  {formatBytes(selectedFile.size)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!isLoading ? (
                  <Button variant="secondary" size="sm" onClick={onRerun}>
                    <RotateCcw size={13} />
                    Re-run
                  </Button>
                ) : null}
                <Button variant="secondary" size="sm" onClick={openPicker} disabled={isLoading}>
                  <RefreshCcw size={13} />
                  Replace
                </Button>
                <Button variant="tertiary" size="sm" onClick={onClear} disabled={isLoading}>
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>

            {inferenceError ? (
              <p className="mt-3 text-sm text-[rgb(145,69,45)]">{inferenceError}</p>
            ) : null}
          </div>
        </>
      ) : (
        /* ── EMPTY STATE: drop zone + header ── */
        <div className="space-y-5 p-6 sm:p-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
              Upload Input
            </p>
            <h2 className="mt-3 font-display text-[2.3rem] leading-none tracking-[-0.04em] text-[var(--color-text)]">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {supportedFormats.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[rgba(23,52,42,0.08)] bg-[rgba(255,255,255,0.5)] px-4 py-2 text-sm text-[var(--color-text)]"
              >
                {item}
              </span>
            ))}
          </div>

          <div
            className={`rounded-[28px] border border-dashed px-6 py-10 sm:px-8 sm:py-12 ${
              isDragging
                ? "border-[rgba(23,52,42,0.26)] bg-[rgba(23,52,42,0.06)]"
                : "border-[rgba(23,52,42,0.14)] bg-[rgba(255,255,255,0.44)]"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          >
            <div className="mx-auto flex max-w-xl flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[rgba(23,52,42,0.08)] bg-[rgba(23,52,42,0.06)] text-[var(--color-forest)]">
                {previewType === "image" ? <ImageIcon size={22} /> : <AudioLines size={22} />}
              </div>
              <h3 className="mt-6 font-display text-[2rem] leading-none tracking-[-0.04em] text-[var(--color-text)]">
                Drag and drop your {previewType === "image" ? "bird image" : "audio clip"}
              </h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-[var(--color-muted)] sm:text-base">
                Or choose a file manually for a premium preview of the BirdLens detection flow.
              </p>
              <Button className="mt-6" variant="secondary" onClick={openPicker}>
                <Upload size={16} />
                Choose File
              </Button>
            </div>
          </div>

          <p className="text-sm leading-7 text-[var(--color-muted)]">{helperText}</p>
        </div>
      )}
    </SurfaceCard>
  );
}
