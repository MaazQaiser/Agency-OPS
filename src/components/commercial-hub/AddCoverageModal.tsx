"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  COVERAGE_TYPE_OPTIONS,
  validateAddCoverage,
  type AddCoveragePayload,
  type ChecklistClient,
} from "@/data/coverageChecklist";
import { cn } from "@/lib/cn";

type AddCoverageModalProps = {
  open: boolean;
  client: ChecklistClient | null;
  onClose: () => void;
  onSave: (payload: AddCoveragePayload) => void;
};

const emptyPayload: AddCoveragePayload = {
  coverageType: "",
  carrier: "",
  limit: "",
  deductible: "",
  notes: "",
};

export function AddCoverageModal({ open, client, onClose, onSave }: AddCoverageModalProps) {
  const [form, setForm] = useState<AddCoveragePayload>(emptyPayload);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setForm(emptyPayload);
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

  if (!open || !client) return null;

  const handleSave = () => {
    const validation = validateAddCoverage(client, form);
    if (!validation.ok) {
      setError(validation.error ?? "Unable to add coverage.");
      return;
    }

    onSave(form);
    onClose();
  };

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close add coverage modal" onClick={onClose} />
      <div className="va-ops-modal" role="dialog" aria-modal="true" aria-label="Add coverage">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Add Coverage</h2>
            <p className="va-ops-modal-subtitle">{client.clientName}</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-modal-body">
          <label className="intake-form-field">
            <span className="intake-form-label">Coverage Type *</span>
            <select
              className="intake-form-input"
              value={form.coverageType}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, coverageType: e.target.value }));
                setError(null);
              }}
            >
              <option value="">Select coverage type</option>
              <optgroup label="Required">
                {COVERAGE_TYPE_OPTIONS.filter((item) => item.category === "required").map((item) => (
                  <option key={item.value} value={item.value}>{item.value}</option>
                ))}
              </optgroup>
              <optgroup label="Recommended">
                {COVERAGE_TYPE_OPTIONS.filter((item) => item.category === "recommended").map((item) => (
                  <option key={item.value} value={item.value}>{item.value}</option>
                ))}
              </optgroup>
            </select>
          </label>

          <label className="intake-form-field">
            <span className="intake-form-label">Carrier</span>
            <input
              className="intake-form-input"
              value={form.carrier}
              onChange={(e) => setForm((prev) => ({ ...prev, carrier: e.target.value }))}
              placeholder="Optional"
            />
          </label>

          <label className="intake-form-field">
            <span className="intake-form-label">Coverage Limit</span>
            <input
              className="intake-form-input"
              value={form.limit}
              onChange={(e) => setForm((prev) => ({ ...prev, limit: e.target.value }))}
              placeholder="e.g. $1M / $2M"
            />
          </label>

          <label className="intake-form-field">
            <span className="intake-form-label">Deductible</span>
            <input
              className="intake-form-input"
              value={form.deductible}
              onChange={(e) => setForm((prev) => ({ ...prev, deductible: e.target.value }))}
              placeholder="e.g. $1,000"
            />
          </label>

          <label className="intake-form-field">
            <span className="intake-form-label">Notes</span>
            <textarea
              className="intake-form-input intake-form-textarea"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </label>

          {error && <div className="add-market-alert add-market-alert-error">{error}</div>}
        </div>

        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={handleSave}>
            Save Coverage
          </button>
        </div>
      </div>
    </div>
  );
}
