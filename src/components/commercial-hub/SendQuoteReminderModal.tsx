"use client";

import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  buildQuoteReminderTemplate,
  type QuoteFollowUp,
  type SendQuoteReminderPayload,
} from "@/data/outreachQueue";

type SendQuoteReminderModalProps = {
  open: boolean;
  quoteFollowUps: QuoteFollowUp[];
  onClose: () => void;
  onSend: (payload: SendQuoteReminderPayload) => void;
};

export function SendQuoteReminderModal({
  open,
  quoteFollowUps,
  onClose,
  onSend,
}: SendQuoteReminderModalProps) {
  const [client, setClient] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setClient(quoteFollowUps[0]?.client ?? "");
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
  }, [open, onClose, quoteFollowUps]);

  const selectedQuote = useMemo(
    () => quoteFollowUps.find((row) => row.client === client) ?? null,
    [quoteFollowUps, client],
  );

  const template = useMemo(
    () => buildQuoteReminderTemplate(client || "Client"),
    [client],
  );

  if (!open) return null;

  const handleSend = (channel: "email" | "sms") => {
    if (!client) {
      setError("Select a client to send the quote reminder.");
      return;
    }
    onSend({ client, channel });
    onClose();
  };

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close send quote reminder modal" onClick={onClose} />
      <div className="va-ops-modal" role="dialog" aria-modal="true" aria-label="Send quote reminder">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Send Quote Reminder</h2>
            <p className="va-ops-modal-subtitle">Re-send reminder to client to review quote.</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>
        <div className="va-ops-modal-body">
          <label className="intake-form-field">
            <span className="intake-form-label">Client *</span>
            <select className="intake-form-input" value={client} onChange={(e) => setClient(e.target.value)}>
              {quoteFollowUps.map((row) => (
                <option key={row.id} value={row.client}>{row.client}</option>
              ))}
            </select>
          </label>

          {selectedQuote && (
            <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
              <div><dt>Carrier</dt><dd>{selectedQuote.carrier}</dd></div>
              <div><dt>Premium</dt><dd>{selectedQuote.premium}</dd></div>
              <div><dt>Quote Sent Date</dt><dd>{selectedQuote.sent}</dd></div>
            </dl>
          )}

          <label className="intake-form-field">
            <span className="intake-form-label">Subject</span>
            <input className="intake-form-input" readOnly value={template.subject} />
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Message</span>
            <textarea className="intake-form-input intake-form-textarea" rows={6} readOnly value={template.body} />
          </label>

          {error && <div className="add-market-alert add-market-alert-error">{error}</div>}
        </div>
        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="va-ops-role-action-btn" onClick={() => handleSend("sms")}>Send SMS</button>
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={() => handleSend("email")}>
            <AppIcon name="send" size={15} strokeWidth={2} />
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}
