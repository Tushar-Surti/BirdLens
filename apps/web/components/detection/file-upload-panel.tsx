"use client";

import { AudioLines, ImageIcon, RefreshCcw, Trash2, Upload } from "lucide-react";
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
  onFileSelect: (file: File) => void;
  onClear: () => void;
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
  onFileSelect,
  onClear
}: FileUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];

    if (!file) {
      return;
    }

    onFileSelect(file);
    setIsDragging(false);
  }

  return (
    <SurfaceCard className="p-6 sm:p-8">
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

      <div className="space-y-5">
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
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            handleFiles(event.dataTransfer.files);
          }}
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

        {selectedFile ? (
          <div className="rounded-[28px] border border-[rgba(23,52,42,0.08)] bg-[rgba(255,255,255,0.56)] p-5 sm:p-6">
            <div className="flex flex-col gap-4 border-b border-[rgba(23,52,42,0.08)] pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-olive)]">
                  Selected File
                </p>
                <h3 className="mt-2 text-lg font-medium text-[var(--color-text)]">
                  {selectedFile.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {formatBytes(selectedFile.size)}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" onClick={openPicker}>
                  <RefreshCcw size={15} />
                  Replace
                </Button>
                <Button variant="tertiary" size="sm" onClick={onClear}>
                  <Trash2 size={15} />
                  Remove
                </Button>
              </div>
            </div>

            {previewUrl ? (
              <div className="mt-5 overflow-hidden rounded-[24px] border border-[rgba(23,52,42,0.08)] bg-[rgba(244,238,226,0.72)]">
                {previewType === "image" ? (
                  <img
                    src={previewUrl}
                    alt="Uploaded bird preview"
                    className="h-[320px] w-full object-cover"
                  />
                ) : (
                  <div className="space-y-6 p-5 sm:p-6">
                    <div className="flex items-end gap-2">
                      {waveformBars.map((height, index) => (
                        <span
                          key={`${height}-${index}`}
                          className="block w-full rounded-full bg-[rgba(23,52,42,0.12)]"
                          style={{ height: `${height}px` }}
                        />
                      ))}
                    </div>
                    <audio controls src={previewUrl} />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ) : null}

        <p className="text-sm leading-7 text-[var(--color-muted)]">{helperText}</p>
      </div>
    </SurfaceCard>
  );
}
