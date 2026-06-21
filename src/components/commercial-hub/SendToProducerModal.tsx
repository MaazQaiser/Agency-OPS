"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  computeChecklistHealthScore,
  getBindBlockers,
  getCoverageCompletion,
  getDocumentsStatus,
  type ChecklistClient,
} from "@/data/coverageChecklist";
import { requiredMarketCount } from "@/data/submissionTracker";

type SendToProducerModalProps = {
  open: boolean;
  client: ChecklistClient | null;
  marketsSubmitted: number;
  onClose: () => void;
  onConfirm: () => void;
};

export function SendToProducerModal({
  open,
  client,
  marketsSubmitted,
  onClose,
  onConfirm,
}: SendToProducerModalProps) {
  useEffect(() => {
    if (!open) return;

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

  const completion = getCoverageCompletion(client);
  const documentsStatus = getDocumentsStatus(client);
  const blockers = getBindBlockers(client);
  const healthScore = computeChecklistHealthScore(client);

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close send to producer modal" onClick={onClose} />
      <div className="va-ops-modal" role="dialog" aria-modal="true" aria-label="Send to producer">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Send to Producer</h2>
            <p className="va-ops-modal-subtitle">{client.clientName}</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-modal-body">
          <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
            <div><dt>Coverage Completion</dt><dd>{completion.percent}%</dd></div>
            <div><dt>Risk Score</dt><dd>{client.riskOverview.riskScore.label} ({healthScore}/100)</dd></div>
            <div><dt>Documents Status</dt><dd>{documentsStatus.received} of {documentsStatus.total} received</dd></div>
            <div><dt>Markets Submitted</dt><dd>{marketsSubmitted} of {requiredMarketCount} required</dd></div>
          </dl>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Remaining Blockers</div>
            {blockers.length === 0 ? (
              <p className="va-ops-drawer-text">No remaining blockers.</p>
            ) : (
              <ul className="va-ops-gap-list">
                {blockers.map((blocker) => (
                  <li key={blocker}>{blocker}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={onConfirm}>
            <AppIcon name="send" size={15} strokeWidth={2} />
            Confirm Send
          </button>
        </div>
      </div>
    </div>
  );
}
