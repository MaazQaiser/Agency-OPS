"use client";

import { useCallback, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  importSubmissionTypes,
  type ImportJob,
  type ImportJobStatus,
} from "@/data/intakeForms";
import { cn } from "@/lib/cn";
import { useToast } from "@/hooks/useToast";

type ImportSubmissionModalProps = {
  open: boolean;
  onClose: () => void;
};

const statusClass: Record<ImportJobStatus, string> = {
  queued: "badge-violet",
  processing: "badge-blue",
  completed: "badge-green",
  failed: "badge-red",
};

export function ImportSubmissionModal({ open, onClose }: ImportSubmissionModalProps) {
  const toast = useToast();
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [activeType, setActiveType] = useState<string | null>(null);

  const simulateImport = useCallback(
    (typeId: string, fileName: string) => {
      const jobId = `import-${Date.now()}`;
      const newJob: ImportJob = {
        id: jobId,
        fileName,
        type: importSubmissionTypes.find((t) => t.id === typeId)?.label ?? typeId,
        status: "queued",
        progress: 0,
        startedAt: "Just now",
      };
      setJobs((prev) => [newJob, ...prev]);

      let progress = 0;
      const interval = window.setInterval(() => {
        progress += 22;
        setJobs((prev) =>
          prev.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  status: progress < 100 ? "processing" : "completed",
                  progress: Math.min(progress, 100),
                }
              : j,
          ),
        );
        if (progress >= 100) {
          window.clearInterval(interval);
          toast.success(`${fileName} imported — review fields in New Submission`);
        }
      }, 400);
    },
    [toast],
  );

  const handleFileSelect = (typeId: string, accept: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) simulateImport(typeId, file.name);
    };
    input.click();
  };

  if (!open) return null;

  return (
    <div className="va-ops-drawer-root intake-import-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close import modal" onClick={onClose} />
      <div className="intake-import-modal" role="dialog" aria-modal="true" aria-label="Import submission">
        <header className="intake-import-modal-header">
          <div>
            <h2>Import Submission</h2>
            <p>Upload intake data from external sources — fields map to New Submission.</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </header>

        <div className="intake-import-types">
          {importSubmissionTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              className={cn("intake-import-type-card", activeType === type.id && "active")}
              onClick={() => {
                setActiveType(type.id);
                handleFileSelect(type.id, type.accept);
              }}
            >
              <AppIcon name={type.icon} size={20} strokeWidth={2} />
              <span className="intake-import-type-label">{type.label}</span>
              <span className="intake-import-type-desc">{type.description}</span>
              <span className="intake-import-type-accept">Accepts: {type.accept}</span>
            </button>
          ))}
        </div>

        {jobs.length > 0 && (
          <section className="intake-import-jobs" aria-label="Import status">
            <h3>Import Status</h3>
            <ul>
              {jobs.map((job) => (
                <li key={job.id} className="intake-import-job">
                  <div className="intake-import-job-top">
                    <span className="intake-import-job-name">{job.fileName}</span>
                    <span className={cn("badge", statusClass[job.status])}>{job.status}</span>
                  </div>
                  <span className="intake-import-job-meta">{job.type} · {job.startedAt}</span>
                  {job.status === "processing" && (
                    <div className="intake-import-job-bar">
                      <div className="intake-import-job-fill" style={{ width: `${job.progress}%` }} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
