"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  trainingDepartmentOptions,
  validateAddNewResource,
  type AddNewResourcePayload,
} from "@/data/trainingHubActions";

type AddNewResourceModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: AddNewResourcePayload) => void;
};

const emptyForm: AddNewResourcePayload = {
  title: "",
  externalUrl: "",
  description: "",
  department: "",
  duration: "",
  tags: "",
};

export function AddNewResourceModal({ open, onClose, onSave }: AddNewResourceModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setForm(emptyForm);
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

  const handleSave = () => {
    const validation = validateAddNewResource(form);
    if (!validation.ok) {
      setError(validation.error ?? "Unable to save resource.");
      return;
    }

    onSave(form);
    onClose();
  };

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close add resource modal" onClick={onClose} />
      <div className="va-ops-modal" role="dialog" aria-modal="true" aria-label="Add new resource">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Add New Resource</h2>
            <p className="va-ops-modal-subtitle">Link an external resource to the Insurance Town training library.</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-modal-body">
          <label className="intake-form-field">
            <span className="intake-form-label">Resource Title *</span>
            <input
              className="intake-form-input"
              value={form.title}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, title: e.target.value }));
                setError(null);
              }}
              placeholder="e.g. Producer Renewal Script"
            />
          </label>

          <label className="intake-form-field">
            <span className="intake-form-label">External URL *</span>
            <input
              className="intake-form-input"
              type="url"
              value={form.externalUrl}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, externalUrl: e.target.value }));
                setError(null);
              }}
              placeholder="https://..."
            />
          </label>

          <label className="intake-form-field">
            <span className="intake-form-label">Description</span>
            <textarea
              className="intake-form-input intake-form-textarea"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
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
            <span className="intake-form-label">Duration *</span>
            <input
              className="intake-form-input"
              value={form.duration}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, duration: e.target.value }));
                setError(null);
              }}
              placeholder="e.g. 12 min"
            />
          </label>

          <label className="intake-form-field">
            <span className="intake-form-label">Tags</span>
            <input
              className="intake-form-input"
              value={form.tags}
              onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g. Renewals, Retention"
            />
          </label>

          {error && <div className="add-market-alert add-market-alert-error">{error}</div>}
        </div>

        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
