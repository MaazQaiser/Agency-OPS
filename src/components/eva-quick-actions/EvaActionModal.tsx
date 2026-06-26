"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { EvaActionField } from "@/data/evaQuickActions";

type EvaActionModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
  fields: EvaActionField[];
  submitLabel: string;
};

export function EvaActionModal({
  open,
  title,
  onClose,
  onSubmit,
  fields,
  submitLabel,
}: EvaActionModalProps) {
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="eva-action-modal-root" role="presentation">
      <button type="button" className="eva-action-modal-backdrop" aria-label="Close" onClick={onClose} />
      <div className="eva-action-modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="eva-action-modal-header">
          <h3>{title}</h3>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </header>
        <form className="eva-action-modal-body" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.id} className="eva-action-modal-field">
              <label htmlFor={`eva-${field.id}`}>{field.label}</label>
              {field.type === "select" ? (
                <select
                  id={`eva-${field.id}`}
                  className="intake-form-input"
                  required={field.required}
                  value={values[field.id] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                >
                  <option value="">{field.placeholder ?? "Select…"}</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  id={`eva-${field.id}`}
                  className="intake-form-input eva-action-modal-textarea"
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={4}
                  value={values[field.id] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                />
              ) : (
                <input
                  id={`eva-${field.id}`}
                  className="intake-form-input"
                  placeholder={field.placeholder}
                  required={field.required}
                  value={values[field.id] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                />
              )}
            </div>
          ))}
          <footer className="eva-action-modal-footer">
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
