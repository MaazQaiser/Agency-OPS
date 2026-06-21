"use client";

import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  PRODUCER_OPTIONS,
  type AssignProducerPayload,
  type OutreachPriority,
} from "@/data/outreachQueue";

type AssignProducerModalProps = {
  open: boolean;
  clientOptions: string[];
  onClose: () => void;
  onSave: (payload: AssignProducerPayload) => void;
};

const emptyForm: AssignProducerPayload = {
  producer: "",
  client: "",
  notes: "",
  priority: "Medium",
};

export function AssignProducerModal({ open, clientOptions, onClose, onSave }: AssignProducerModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm({ ...emptyForm, client: clientOptions[0] ?? "" });
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
  }, [open, onClose, clientOptions]);

  const options = useMemo(() => clientOptions, [clientOptions]);

  if (!open) return null;

  const handleSave = () => {
    if (!form.producer || !form.client) {
      setError("Producer and client are required.");
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close assign producer modal" onClick={onClose} />
      <div className="va-ops-modal" role="dialog" aria-modal="true" aria-label="Assign producer">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Assign Producer</h2>
            <p className="va-ops-modal-subtitle">Assign ownership for closing.</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>
        <div className="va-ops-modal-body">
          <label className="intake-form-field">
            <span className="intake-form-label">Select Producer *</span>
            <select className="intake-form-input" value={form.producer} onChange={(e) => setForm((p) => ({ ...p, producer: e.target.value }))}>
              <option value="">Select producer</option>
              {PRODUCER_OPTIONS.map((producer) => (
                <option key={producer} value={producer}>{producer}</option>
              ))}
            </select>
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Client *</span>
            <select className="intake-form-input" value={form.client} onChange={(e) => setForm((p) => ({ ...p, client: e.target.value }))}>
              <option value="">Select client</option>
              {options.map((client) => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Priority</span>
            <select className="intake-form-input" value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value as OutreachPriority }))}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Notes</span>
            <textarea className="intake-form-input intake-form-textarea" rows={3} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          </label>
          {error && <div className="add-market-alert add-market-alert-error">{error}</div>}
        </div>
        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={handleSave}>Assign Producer</button>
        </div>
      </div>
    </div>
  );
}
