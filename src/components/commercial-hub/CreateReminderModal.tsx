"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  OUTREACH_ASSIGNEES,
  REMINDER_TYPES,
  type CreateReminderPayload,
} from "@/data/outreachQueue";

type CreateReminderModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: CreateReminderPayload) => void;
};

const emptyForm: CreateReminderPayload = {
  reminderType: "",
  date: "",
  time: "",
  assignedTo: "",
  message: "",
};

export function CreateReminderModal({ open, onClose, onSave }: CreateReminderModalProps) {
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
    if (!form.reminderType || !form.date || !form.time || !form.assignedTo) {
      setError("Reminder type, date, time, and assignee are required.");
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close create reminder modal" onClick={onClose} />
      <div className="va-ops-modal" role="dialog" aria-modal="true" aria-label="Create reminder">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Create Reminder</h2>
            <p className="va-ops-modal-subtitle">Set a reminder for broker or VA follow-up.</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>
        <div className="va-ops-modal-body">
          <label className="intake-form-field">
            <span className="intake-form-label">Reminder Type *</span>
            <select className="intake-form-input" value={form.reminderType} onChange={(e) => setForm((p) => ({ ...p, reminderType: e.target.value }))}>
              <option value="">Select reminder type</option>
              {REMINDER_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Date *</span>
            <input className="intake-form-input" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Time *</span>
            <input className="intake-form-input" type="time" value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} />
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Assigned To *</span>
            <select className="intake-form-input" value={form.assignedTo} onChange={(e) => setForm((p) => ({ ...p, assignedTo: e.target.value }))}>
              <option value="">Select assignee</option>
              {OUTREACH_ASSIGNEES.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Message</span>
            <textarea className="intake-form-input intake-form-textarea" rows={3} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} />
          </label>
          {error && <div className="add-market-alert add-market-alert-error">{error}</div>}
        </div>
        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={handleSave}>Save Reminder</button>
        </div>
      </div>
    </div>
  );
}
