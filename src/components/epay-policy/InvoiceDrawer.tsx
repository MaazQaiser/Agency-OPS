"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { PendingInvoice } from "@/data/epayPolicy";

type InvoiceDrawerProps = {
  invoice: PendingInvoice | null;
  onClose: () => void;
};

export function InvoiceDrawer({ invoice, onClose }: InvoiceDrawerProps) {
  useEffect(() => {
    if (!invoice) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.document.addEventListener("keydown", handleKeyDown);
    window.document.body.style.overflow = "hidden";

    return () => {
      window.document.removeEventListener("keydown", handleKeyDown);
      window.document.body.style.overflow = "";
    };
  }, [invoice, onClose]);

  if (!invoice) return null;

  const { drawer } = invoice;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close invoice details"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Invoice for ${invoice.clientName}`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <div>
              <div className="va-ops-drawer-name">{invoice.clientName}</div>
              <div className="va-ops-drawer-role">
                {drawer.invoiceNumber} · {invoice.amount}
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Full Invoice Breakdown</div>
            <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
              <div>
                <dt>Policy Premium</dt>
                <dd>{drawer.policyPremium}</dd>
              </div>
              <div>
                <dt>Broker Fee</dt>
                <dd className="epay-broker-fee-highlight">{drawer.brokerFee}</dd>
              </div>
              <div>
                <dt>Taxes / Fees</dt>
                <dd>{drawer.taxesFees}</dd>
              </div>
              <div>
                <dt>Total Due</dt>
                <dd>{drawer.totalDue}</dd>
              </div>
            </dl>
          </div>

          <div className="va-ops-drawer-section epay-broker-fee-note">
            <div className="va-ops-drawer-section-label">Broker Fee Details</div>
            <p className="va-ops-drawer-text">{drawer.brokerFeeNote}</p>
          </div>

          {drawer.paymentHistory.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Payment History</div>
              <ul className="submission-doc-history-list">
                {drawer.paymentHistory.map((entry) => (
                  <li key={entry.id}>
                    <strong>{entry.action}</strong>: {entry.date}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {drawer.trustAccountLogs.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Trust Account Logs</div>
              <ul className="va-ops-gap-list">
                {drawer.trustAccountLogs.map((entry) => (
                  <li key={entry.id}>
                    {entry.entry}: {entry.date}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {drawer.clientNotes.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Client Notes</div>
              <ul className="va-ops-gap-list">
                {drawer.clientNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn primary">
                <AppIcon name="folder" size={15} strokeWidth={2} />
                Edit Invoice
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="send" size={15} strokeWidth={2} />
                Resend Link
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="check" size={15} strokeWidth={2} />
                Mark Paid
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="download" size={15} strokeWidth={2} />
                Download PDF
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="x" size={15} strokeWidth={2} />
                Cancel Invoice
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
