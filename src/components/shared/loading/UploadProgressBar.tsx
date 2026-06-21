"use client";

import { cn } from "@/lib/cn";

export type UploadPhase = "uploading" | "processing" | "completed" | "failed";

type UploadProgressBarProps = {
  fileName: string;
  progress: number;
  phase: UploadPhase;
  className?: string;
};

const phaseLabels: Record<UploadPhase, string> = {
  uploading: "Uploading",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};

export function UploadProgressBar({ fileName, progress, phase, className }: UploadProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div
      className={cn("ops-upload-progress", `ops-upload-${phase}`, className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${phaseLabels[phase]} ${fileName}`}
    >
      <div className="ops-upload-progress-header">
        <span className="ops-upload-file-name">{fileName}</span>
        <span className="ops-upload-phase">{phaseLabels[phase]}</span>
      </div>
      <div className="ops-upload-track">
        <div
          className="ops-upload-fill"
          style={{ width: phase === "completed" ? "100%" : `${clamped}%` }}
        />
      </div>
      {phase !== "failed" && phase !== "completed" && (
        <span className="ops-upload-percent">{clamped}%</span>
      )}
    </div>
  );
}
