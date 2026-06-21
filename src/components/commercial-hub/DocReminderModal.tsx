"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { DocumentBlocker } from "@/data/submissionTracker";

type DocReminderModalProps = {
  open: boolean;
  item: DocumentBlocker | null;
  onClose: () => void;
  onSend: (item: DocumentBlocker, channel: "email" | "sms") => void;
};

export function DocReminderModal({ open, item, onClose, onSend }: DocReminderModalProps) {
  const [channel, setChannel] = useState<"email" | "sms">("email");

  useEffect(() => {
    if (!open) return;
    setChannel("email");

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

  if (!open || !item) return null;

  const message = `Reminder: ${item.client} — please send ${item.missing}. Requested ${item.requested}.`;

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close reminder modal" onClick={onClose} />
      <div className="va-ops-modal" role="dialog" aria-modal="true" aria-label="Send document reminder">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Send Document Reminder</h2>
            <p className="va-ops-modal-subtitle">{item.client} · Missing {item.missing}</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>
        <div className="va-ops-modal-body">
          <label className="intake-form-field">
            <span className="intake-form-label">Delivery Channel</span>
            <select className="intake-form-input" value={channel} onChange={(e) => setChannel(e.target.value as "email" | "sms")}>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Message Preview</span>
            <textarea className="intake-form-input intake-form-textarea" rows={4} readOnly value={message} />
          </label>
        </div>
        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={() => onSend(item, channel)}>
            Send Reminder
          </button>
        </div>
      </div>
    </div>
  );
}
