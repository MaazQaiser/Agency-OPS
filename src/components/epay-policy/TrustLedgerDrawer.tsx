"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { TrustLedgerEntry } from "@/data/trustReference";

type TrustLedgerDrawerProps = {
  entry: TrustLedgerEntry | null;
  onClose: () => void;
};

export function TrustLedgerDrawer({ entry, onClose }: TrustLedgerDrawerProps) {
  useEffect(() => {
    if (!entry) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.document.addEventListener("keydown", handleKeyDown);
    window.document.body.style.overflow = "hidden";

    return () => {
      window.document.removeEventListener("keydown", handleKeyDown);
      window.document.body.style.overflow = "";
    };
  }, [entry, onClose]);

  if (!entry) return null;

  const { drawer } = entry;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close transaction details"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Trust transaction ${entry.referenceNumber}`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <div>
              <div className="va-ops-drawer-name">{entry.referenceNumber}</div>
              <div className="va-ops-drawer-role">
                {entry.client} · {entry.type} · {entry.amount}
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Transaction Details</div>
            <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
              <div>
                <dt>Date</dt>
                <dd>{entry.date}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{entry.status}</dd>
              </div>
              <div>
                <dt>Balance After</dt>
                <dd>{entry.balanceAfter}</dd>
              </div>
              <div>
                <dt>Payment Method</dt>
                <dd>{drawer.paymentMethod}</dd>
              </div>
            </dl>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Invoice Reference</div>
            <p className="va-ops-drawer-text">
              {drawer.invoiceReference}: {drawer.clientInfo}
            </p>
          </div>

          <div className="va-ops-drawer-section epay-broker-fee-note">
            <div className="va-ops-drawer-section-label">Broker Fee Breakdown</div>
            <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
              <div>
                <dt>Broker Fee</dt>
                <dd className="epay-broker-fee-highlight">{drawer.brokerFee}</dd>
              </div>
              <div>
                <dt>Premium Portion</dt>
                <dd>{drawer.premiumPortion}</dd>
              </div>
              <div>
                <dt>Carrier</dt>
                <dd>{drawer.carrier}</dd>
              </div>
            </dl>
          </div>

          {drawer.carrierPaymentHistory.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Carrier Payment History</div>
              <ul className="submission-doc-history-list">
                {drawer.carrierPaymentHistory.map((item) => (
                  <li key={item.id}>
                    <strong>{item.action}</strong>: {item.date}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {drawer.trustAccountLogs.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Trust Account Logs</div>
              <ul className="va-ops-gap-list">
                {drawer.trustAccountLogs.map((log) => (
                  <li key={log.id}>
                    {log.entry}: {log.date}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {drawer.reconciliationNotes.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Reconciliation Notes</div>
              <ul className="va-ops-gap-list">
                {drawer.reconciliationNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn primary">
                <AppIcon name="check" size={15} strokeWidth={2} />
                Verify Deposit
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="send" size={15} strokeWidth={2} />
                Release Funds
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="plus" size={15} strokeWidth={2} />
                Add Adjustment
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="download" size={15} strokeWidth={2} />
                Download Receipt
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="triangle-alert" size={15} strokeWidth={2} />
                Flag Issue
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
