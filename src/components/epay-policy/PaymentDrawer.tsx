"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import type { PaymentRecord } from "@/data/paymentTracker";
import { formatTotal } from "@/data/paymentTracker";
import { useToast } from "@/hooks/useToast";
import { crossModuleRoutes, resolveSubmissionId } from "@/lib/crossModuleLinks";
import { routes } from "@/lib/routes";
import { toastMessages } from "@/lib/toastMessages";

type PaymentDrawerProps = {
  payment: PaymentRecord | null;
  onClose: () => void;
  onToast?: (message: string, variant?: "success" | "error") => void;
};

export function PaymentDrawer({ payment, onClose }: PaymentDrawerProps) {
  const toast = useToast();
  const router = useRouter();
  useEffect(() => {
    if (!payment) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.document.addEventListener("keydown", handleKeyDown);
    window.document.body.style.overflow = "hidden";

    return () => {
      window.document.removeEventListener("keydown", handleKeyDown);
      window.document.body.style.overflow = "";
    };
  }, [payment, onClose]);

  const retryPayment = useCallback(() => {
    if (!payment) return;
    toast.error(toastMessages.epay.paymentFailed, {
      action: {
        label: "Retry",
        onClick: () => toast.success(`Retry initiated for ${payment.clientName}`),
      },
    });
  }, [payment, toast]);

  if (!payment) return null;

  const { drawer } = payment;

  const viewRelatedSubmission = () => {
    const submissionId = resolveSubmissionId(payment.clientName);
    router.push(
      crossModuleRoutes.readyToBind({
        href: `${routes.epayPolicy}?view=tracker`,
        label: "Payment Tracker",
      }),
    );
    onClose();
  };

  const markBound = () => {
    router.push(
      crossModuleRoutes.submissionClock({
        href: `${routes.epayPolicy}?view=tracker&payment=${payment.id}`,
        label: "Payment Tracker",
      }),
    );
    toast.success(`Marked bound — opening Submission Clock for ${payment.clientName}`);
    onClose();
  };

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close payment details"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Payment for ${payment.clientName}`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <div>
              <div className="va-ops-drawer-name">{payment.clientName}</div>
              <div className="va-ops-drawer-role">
                {payment.invoiceNumber} · {formatTotal(payment)} · {payment.status}
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Full Invoice</div>
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
            <div className="va-ops-drawer-section-label">Broker Fee Breakdown</div>
            <p className="va-ops-drawer-text">{drawer.brokerFeeNote}</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Trust Account Reference</div>
            <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
              <div>
                <dt>Account</dt>
                <dd>{drawer.trustAccount.accountName}</dd>
              </div>
              <div>
                <dt>Reference</dt>
                <dd>{drawer.trustAccount.referenceNumber}</dd>
              </div>
              <div>
                <dt>Deposit Status</dt>
                <dd>{drawer.trustAccount.depositStatus}</dd>
              </div>
            </dl>
          </div>

          {drawer.paymentHistory.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Payment History</div>
              <ul className="submission-doc-history-list">
                {drawer.paymentHistory.map((entry) => (
                  <li key={entry.id}>
                    <strong>{entry.action}</strong>
                    {entry.amount ? ` — ${entry.amount}` : ""} · {entry.date}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {drawer.paymentAttempts.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Payment Attempts</div>
              <ul className="va-ops-gap-list">
                {drawer.paymentAttempts.map((attempt) => (
                  <li key={attempt.id}>
                    {attempt.method} — {attempt.result} · {attempt.date}
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
              {payment.status === "Failed" && (
                <button type="button" className="va-ops-drawer-action-btn primary" onClick={viewRelatedSubmission}>
                  View Related Submission
                </button>
              )}
              {payment.status === "Paid" && (
                <button type="button" className="va-ops-drawer-action-btn primary" onClick={markBound}>
                  Mark Bound
                </button>
              )}
              <button type="button" className="va-ops-drawer-action-btn primary">
                <AppIcon name="send" size={15} strokeWidth={2} />
                Resend Link
              </button>
              <button type="button" className="va-ops-drawer-action-btn" onClick={retryPayment}>
                <AppIcon name="refresh" size={15} strokeWidth={2} />
                Retry Payment
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="check" size={15} strokeWidth={2} />
                Mark Paid
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="message-square" size={15} strokeWidth={2} />
                Add Note
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="x" size={15} strokeWidth={2} />
                Refund Payment
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
