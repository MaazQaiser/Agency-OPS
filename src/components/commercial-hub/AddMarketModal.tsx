"use client";

import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  getAddMarketDocChecklist,
  getAvailableCarriers,
  requiredMarketCount,
  validateAddMarket,
  type AddMarketPayload,
  type TrackerSubmission,
} from "@/data/submissionTracker";
import { TableSkeleton } from "@/components/shared/loading";
import { useDrawerLoading } from "@/hooks/useTabLoading";
import { cn } from "@/lib/cn";

type AddMarketModalProps = {
  open: boolean;
  submission: TrackerSubmission | null;
  submissions: TrackerSubmission[];
  onSelectSubmission: (submissionId: string) => void;
  onClose: () => void;
  onSubmit: (payload: AddMarketPayload) => void;
};

export function AddMarketModal({
  open,
  submission,
  submissions,
  onSelectSubmission,
  onClose,
  onSubmit,
}: AddMarketModalProps) {
  const [carrier, setCarrier] = useState("");
  const [notes, setNotes] = useState("");
  const [docsConfirmed, setDocsConfirmed] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const modalLoading = useDrawerLoading(open);

  const availableCarriers = useMemo(
    () => (submission ? getAvailableCarriers(submission) : []),
    [submission],
  );

  const docChecklist = useMemo(
    () => (submission ? getAddMarketDocChecklist(submission) : []),
    [submission],
  );

  useEffect(() => {
    if (!open) return;

    setCarrier("");
    setNotes("");
    setDocsConfirmed({});
    setError(null);
    setSuccess(null);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, submission?.id, onClose]);

  if (!open) return null;

  const marketsRemaining = submission
    ? Math.max(0, requiredMarketCount - submission.marketsSubmitted)
    : 0;

  const toggleDoc = (docId: string) => {
    setDocsConfirmed((prev) => ({ ...prev, [docId]: !prev[docId] }));
    setError(null);
  };

  const handleSubmit = () => {
    if (!submission) return;

    const validation = validateAddMarket(submission, carrier, docsConfirmed);
    if (!validation.ok) {
      setError(validation.error ?? "Unable to add market.");
      setSuccess(null);
      return;
    }

    onSubmit({ carrier, notes, docsConfirmed });
    setSuccess(`${carrier} added to ${submission.client}. Markets: ${submission.marketsSubmitted + 1}.`);
    setError(null);

    window.setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close add market modal"
        onClick={onClose}
      />
      <div
        className="va-ops-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Add market to submission"
      >
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Add Market</h2>
            {submission ? (
              <p className="va-ops-modal-subtitle">
                {submission.client} · {submission.coverage} · {submission.marketsSubmitted} market
                {submission.marketsSubmitted === 1 ? "" : "s"}
              </p>
            ) : (
              <p className="va-ops-modal-subtitle">
                Choose a submission to add another carrier market.
              </p>
            )}
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-modal-body">
          {modalLoading ? (
            <TableSkeleton rows={5} label="Loading market options" />
          ) : !submission ? (
            <ul className="add-market-submission-picker">
              {submissions.map((row) => {
                const needsMarkets = row.marketsSubmitted < requiredMarketCount;
                return (
                  <li key={row.id}>
                    <button
                      type="button"
                      className="add-market-submission-option"
                      onClick={() => onSelectSubmission(row.id)}
                    >
                      <div className="add-market-submission-option-top">
                        <span className="add-market-submission-client">{row.client}</span>
                        {needsMarkets && (
                          <span className="add-market-picker-badge">
                            {row.marketsSubmitted} of {requiredMarketCount} required
                          </span>
                        )}
                      </div>
                      <div className="add-market-submission-meta">
                        <span>{row.coverage}</span>
                        <span className="add-market-meta-dot" aria-hidden="true">·</span>
                        <span>{row.marketsSubmitted} markets</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <>
              {marketsRemaining > 0 && (
                <div className="add-market-alert add-market-alert-warn">
                  Minimum market requirement not met: {submission.marketsSubmitted} of {requiredMarketCount} markets before Quote Review.
                </div>
              )}

              <div className="add-market-current-markets">
                <div className="add-market-current-label">Current markets</div>
                <ul className="va-ops-gap-list">
                  {submission.carriers.map((market) => (
                    <li key={`${market.carrier}-${market.status}`}>
                      <strong>{market.carrier}</strong>: {market.status}
                    </li>
                  ))}
                </ul>
              </div>

              <label className="intake-form-field">
                <span className="intake-form-label">Select Carrier *</span>
                <select
                  className="intake-form-input"
                  value={carrier}
                  onChange={(e) => {
                    setCarrier(e.target.value);
                    setError(null);
                  }}
                >
                  <option value="">Choose carrier</option>
                  {availableCarriers.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {availableCarriers.length === 0 && (
                  <span className="intake-form-error">All available carriers have already been added.</span>
                )}
              </label>

              <label className="intake-form-field">
                <span className="intake-form-label">Coverage Type</span>
                <input className="intake-form-input" value={submission.coverage} readOnly />
              </label>

              <label className="intake-form-field">
                <span className="intake-form-label">Assigned Broker</span>
                <input className="intake-form-input" value={submission.producer} readOnly />
              </label>

              <label className="intake-form-field">
                <span className="intake-form-label">Submission Notes</span>
                <textarea
                  className="intake-form-input intake-form-textarea"
                  rows={3}
                  placeholder="Optional notes for this market submission..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>

              <fieldset className="intake-form-field">
                <legend className="intake-form-label">Required Docs Status</legend>
                <ul className="add-market-doc-checklist">
                  {docChecklist.map((doc) => {
                    const confirmed = doc.complete || docsConfirmed[doc.id];
                    return (
                      <li key={doc.id} className={cn("add-market-doc-item", confirmed && "complete")}>
                        <label className="intake-form-checkbox">
                          <input
                            type="checkbox"
                            checked={confirmed}
                            disabled={doc.complete}
                            onChange={() => toggleDoc(doc.id)}
                          />
                          {doc.label}
                        </label>
                        <span className={cn("badge", doc.complete ? "badge-green" : confirmed ? "badge-yellow" : "badge-red")}>
                          {doc.complete ? "Complete" : confirmed ? "Confirmed" : "Missing"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            </>
          )}

          {error && <div className="add-market-alert add-market-alert-error">{error}</div>}
          {success && <div className="add-market-alert add-market-alert-success">{success}</div>}
        </div>

        <div className="va-ops-modal-footer">
          {submission && (
            <button
              type="button"
              className="va-ops-role-action-btn add-market-back-btn"
              onClick={() => onSelectSubmission("")}
            >
              Change Submission
            </button>
          )}
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>
            Cancel
          </button>
          {submission && (
            <button
              type="button"
              className="va-ops-role-action-btn intake-form-continue-btn"
              disabled={availableCarriers.length === 0}
              onClick={handleSubmit}
            >
              <AppIcon name="target" size={15} strokeWidth={2} />
              Submit to Carrier
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
