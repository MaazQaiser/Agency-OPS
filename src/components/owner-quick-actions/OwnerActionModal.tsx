"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";

type OwnerActionModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
  fields: { id: string; label: string; placeholder: string; required?: boolean }[];
  submitLabel: string;
};

export function OwnerActionModal({
  open,
  title,
  onClose,
  onSubmit,
  fields,
  submitLabel,
}: OwnerActionModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) setValues({});
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="owner-action-modal-root" role="presentation">
      <button type="button" className="owner-action-modal-backdrop" aria-label="Close" onClick={onClose} />
      <div className="owner-action-modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="owner-action-modal-header">
          <h3>{title}</h3>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </header>
        <form className="owner-action-modal-body" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.id} className="owner-action-modal-field">
              <label htmlFor={field.id}>{field.label}</label>
              <input
                id={field.id}
                className="intake-form-input"
                placeholder={field.placeholder}
                required={field.required}
                value={values[field.id] ?? ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
              />
            </div>
          ))}
          <footer className="owner-action-modal-footer">
            <button type="button" className="va-ops-role-action-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="va-ops-role-action-btn intake-form-continue-btn">
              {submitLabel}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export const assignTaskFields = [
  { id: "assignee", label: "Assign to", placeholder: "Team member name", required: true },
  { id: "task", label: "Task", placeholder: "Describe the task", required: true },
  { id: "due", label: "Due date", placeholder: "e.g. Jun 25, 2026" },
];

export const reassignSubmissionFields = [
  { id: "submission", label: "Submission", placeholder: "Submission # or client name", required: true },
  { id: "producer", label: "New producer", placeholder: "Producer name", required: true },
];

export const overridePriorityFields = [
  { id: "item", label: "Item", placeholder: "Task, submission, or lead ID", required: true },
  { id: "priority", label: "New priority", placeholder: "Critical / High / Medium / Low", required: true },
  { id: "reason", label: "Reason", placeholder: "Why override?", required: true },
];
