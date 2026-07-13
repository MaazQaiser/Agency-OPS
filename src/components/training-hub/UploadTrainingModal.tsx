"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import {
  trainingDepartmentOptions,
  validateUploadTraining,
  type UploadTrainingPayload,
} from "@/data/trainingHubActions";

type UploadTrainingModalProps = {
  open: boolean;
  onClose: () => void;
  onPublish: (payload: UploadTrainingPayload, file: File) => void;
};

const emptyForm: UploadTrainingPayload = {
  title: "",
  description: "",
  department: "",
  tags: "",
  duration: "",
};

export function UploadTrainingModal({ open, onClose, onPublish }: UploadTrainingModalProps) {
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setForm(emptyForm);
    setFile(null);
    setError(null);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handlePublish = async () => {
    const validation = validateUploadTraining(form, file);
    if (!validation.ok) {
      setError(validation.error ?? "Unable to publish training.");
      return;
    }
    if (!file) return;

    const toastId = toast.processing("Uploading training…");
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    onPublish(form, file);
    toast.update(toastId, toastMessages.training.uploaded, "success");
    onClose();
  };

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close upload training modal" onClick={onClose} />
      <div className="va-ops-modal" role="dialog" aria-modal="true" aria-label="Upload training">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Upload Training</h2>
            <p className="va-ops-modal-subtitle">Add a file or video resource to the Insurance Town training library.</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-modal-body">
          <label className="intake-form-field">
            <span className="intake-form-label">Upload File / Video *</span>
            <input
              className="intake-form-input"
              type="file"
              accept="video/*,.pdf,.doc,.docx,application/pdf"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setError(null);
              }}
            />
          </label>

          <label className="intake-form-field">
            <span className="intake-form-label">Resource Title *</span>
            <input
              className="intake-form-input"
              value={form.title}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, title: e.target.value }));
                setError(null);
              }}
              placeholder="e.g. Commercial Quote Follow-Up Script"
            />
          </label>

          <label className="intake-form-field">
            <span className="intake-form-label">Description</span>
            <textarea
              className="intake-form-input intake-form-textarea"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief summary of this training resource"
            />
          </label>

          <label className="intake-form-field">
            <span className="intake-form-label">Department *</span>
            <select
              className="intake-form-input"
              value={form.department}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, department: e.target.value }));
                setError(null);
              }}
            >
              <option value="">Select department</option>
              {trainingDepartmentOptions.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </label>

          <label className="intake-form-field">
            <span className="intake-form-label">Tags</span>
            <input
              className="intake-form-input"
              value={form.tags}
              onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g. Quoting, Follow-Up, Commercial"
            />
          </label>

          <label className="intake-form-field">
            <span className="intake-form-label">Duration *</span>
            <input
              className="intake-form-input"
              value={form.duration}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, duration: e.target.value }));
                setError(null);
              }}
              placeholder="e.g. 8 min"
            />
          </label>

          {error && <div className="add-market-alert add-market-alert-error">{error}</div>}
        </div>

        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={handlePublish}>
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
