"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import {
  getSubmissionTimeline,
  requiredMarketCount,
  type TrackerSubmission,
} from "@/data/submissionTracker";
import { cn } from "@/lib/cn";

type SubmissionTrackerExpandPanelProps = {
  submission: TrackerSubmission;
  onOpenDrawer: () => void;
};

const docStatusIcon = {
  complete: "check",
  pending: "refresh",
  missing: "x",
} as const;

export function SubmissionTrackerExpandPanel({
  submission,
  onOpenDrawer,
}: SubmissionTrackerExpandPanelProps) {
  const timeline = getSubmissionTimeline(submission);
  const openDocs = submission.documents.filter((doc) => doc.status !== "complete");
  const coverageGaps = submission.coverageChecklist.filter((item) => item.status !== "complete");
  const hasNotes = submission.producerNotes.length > 0 || submission.brokerNotes.length > 0;

  return (
    <div className="submission-tracker-detail commercial-hub-inline-expand">
      <header className="commercial-expand-header">
        <div className="commercial-expand-header-copy">
          <span className="commercial-expand-client">{submission.client}</span>
          <span className="commercial-expand-meta">
            {submission.coverage} · {submission.daysOpen} days open · {submission.producer}
          </span>
        </div>
        <button
          type="button"
          className="va-ops-action-btn commercial-hub-btn-teal"
          onClick={onOpenDrawer}
        >
          Open full inspection
        </button>
      </header>

      <div className="commercial-expand-grid">
        <article className="commercial-expand-card">
          <h4 className="commercial-expand-card-title">Documents</h4>
          {openDocs.length === 0 ? (
            <p className="commercial-expand-empty">All required documents received.</p>
          ) : (
            <ul className="commercial-expand-chip-list">
              {openDocs.map((doc) => (
                <li key={doc.label} className={cn("commercial-expand-chip", `commercial-expand-chip--${doc.status}`)}>
                  <AppIcon name={docStatusIcon[doc.status]} size={12} strokeWidth={2.25} />
                  {doc.label}
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="commercial-expand-card">
          <h4 className="commercial-expand-card-title">Markets</h4>
          <ul className="commercial-expand-line-list">
            {submission.carriers.map((carrier) => (
              <li key={carrier.carrier}>
                <span>{carrier.carrier}</span>
                <span className="badge badge-gray">{carrier.status}</span>
              </li>
            ))}
          </ul>
          {submission.marketsSubmitted < requiredMarketCount && (
            <p className="commercial-expand-warning">
              {submission.marketsSubmitted} of {requiredMarketCount} required markets submitted.
            </p>
          )}
        </article>

        <article className="commercial-expand-card">
          <h4 className="commercial-expand-card-title">Quotes</h4>
          {submission.quotes.length === 0 ? (
            <p className="commercial-expand-empty">No carrier quotes returned yet.</p>
          ) : (
            <ul className="commercial-expand-line-list">
              {submission.quotes.map((quote) => (
                <li key={quote.id}>
                  <span>{quote.carrier}</span>
                  <strong>{quote.premium}</strong>
                  {submission.selectedQuoteId === quote.id && (
                    <span className="badge badge-green">Selected</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </article>

        {coverageGaps.length > 0 && (
          <article className="commercial-expand-card">
            <h4 className="commercial-expand-card-title">Coverage Gaps</h4>
            <ul className="commercial-expand-line-list">
              {coverageGaps.map((item) => (
                <li key={item.label}>
                  <span>{item.label}</span>
                  <span className="badge badge-yellow">{item.status}</span>
                </li>
              ))}
            </ul>
          </article>
        )}
      </div>

      <div className="commercial-expand-footer">
        <div className="commercial-expand-timeline">
          <span className="commercial-expand-footer-label">Pipeline</span>
          <ol className="commercial-expand-steps">
            {timeline.map((step) => (
              <li
                key={step.label}
                className={cn("commercial-expand-step", step.complete && "is-complete")}
                title={step.timestamp ?? step.label}
              >
                <span className="commercial-expand-step-dot" aria-hidden="true" />
                <span className="commercial-expand-step-label">{step.label}</span>
              </li>
            ))}
          </ol>
        </div>

        {hasNotes && (
          <div className="commercial-expand-notes">
            <span className="commercial-expand-footer-label">Notes</span>
            <ul className="commercial-expand-notes-list">
              {submission.producerNotes.map((note) => (
                <li key={`p-${note}`}>
                  <span className="commercial-expand-note-tag">Producer</span>
                  {note}
                </li>
              ))}
              {submission.brokerNotes.map((note) => (
                <li key={`b-${note}`}>
                  <span className="commercial-expand-note-tag">Broker</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
