"use client";

import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  FOLLOW_UP_TYPES,
  OUTREACH_ASSIGNEES,
  PRODUCER_OPTIONS,
  type AddFollowUpPayload,
  type OutreachPriority,
} from "@/data/outreachQueue";

type AddFollowUpModalProps = {
  open: boolean;
  clientOptions: string[];
  onClose: () => void;
  onSave: (payload: AddFollowUpPayload) => void;
};

const emptyForm: AddFollowUpPayload = {
  client: "",
  followUpType: "",
  dueDate: "",
  priority: "Medium",
  notes: "",
};

export function AddFollowUpModal({ open, clientOptions, onClose, onSave }: AddFollowUpModalProps) {
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

  const options = useMemo(() => clientOptions, [clientOptions]);

  if (!open) return null;

  const handleSave = () => {
    if (!form.client || !form.followUpType || !form.dueDate) {
      setError("Client, follow-up type, and due date are required.");
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close add follow-up modal" onClick={onClose} />
      <div className="va-ops-modal" role="dialog" aria-modal="true" aria-label="Add follow-up">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Add Follow-Up</h2>
            <p className="va-ops-modal-subtitle">Create a manual follow-up task for client communication.</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>
        <div className="va-ops-modal-body">
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
            <span className="intake-form-label">Follow-up Type *</span>
            <select className="intake-form-input" value={form.followUpType} onChange={(e) => setForm((p) => ({ ...p, followUpType: e.target.value }))}>
              <option value="">Select type</option>
              {FOLLOW_UP_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Due Date *</span>
            <input className="intake-form-input" type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
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
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={handleSave}>Save Follow-Up</button>
        </div>
      </div>
    </div>
  );
}
