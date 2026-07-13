"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import type { QuoteOption, TrackerSubmission } from "@/data/submissionTracker";
import { cn } from "@/lib/cn";

type SubmissionQuotePanelProps = {
  submission: TrackerSubmission;
  selectedQuoteId?: string;
  onSelectQuote: (quote: QuoteOption) => void;
  onSendToProducer: (quote: QuoteOption) => void;
};

export function SubmissionQuotePanel({
  submission,
  selectedQuoteId,
  onSelectQuote,
  onSendToProducer,
}: SubmissionQuotePanelProps) {
  if (submission.quotes.length === 0) {
    return (
      <div className="submission-quote-panel empty">
        <div className="submission-tracker-detail-label">Quote Comparison</div>
        <p className="va-ops-section-sub">No quotes received yet: awaiting carrier responses.</p>
      </div>
    );
  }

  return (
    <div className="submission-quote-panel">
      <div className="submission-tracker-detail-label">Quote Comparison</div>
      <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
        <table className="commercial-hub-table submission-quote-table">
          <thead>
            <tr>
              <th>Carrier</th>
              <th>Premium</th>
              <th>Deductible</th>
              <th>Limits</th>
              <th>Exclusions</th>
              <th>Broker Fee</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {submission.quotes.map((quote) => {
              const selected = selectedQuoteId === quote.id;
              return (
                <tr key={quote.id} className={cn(selected && "submission-quote-selected")}>
                  <td className="commercial-hub-client-cell">{quote.carrier}</td>
                  <td className="commercial-hub-premium">{quote.premium}</td>
                  <td>{quote.deductible}</td>
                  <td>{quote.coverageLimits}</td>
                  <td>{quote.exclusions}</td>
                  <td>{quote.brokerFee}</td>
                  <td>
                    <div className="submission-quote-actions">
                      <button
                        type="button"
                        className={cn("va-ops-action-btn", selected && "primary")}
                        onClick={() => onSelectQuote(quote)}
                      >
                        {selected ? "Selected" : "Select Quote"}
                      </button>
                      <button
                        type="button"
                        className="va-ops-action-btn"
                        onClick={() => onSendToProducer(quote)}
                      >
                        <AppIcon name="send" size={14} strokeWidth={2} />
                        Send to Producer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
