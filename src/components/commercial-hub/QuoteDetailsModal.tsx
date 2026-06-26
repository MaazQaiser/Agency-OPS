"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { QuoteOption } from "@/data/submissionTracker";
import { cn } from "@/lib/cn";

type QuoteDetailsModalProps = {
  open: boolean;
  client: string | null;
  quotes: QuoteOption[];
  onClose: () => void;
  onSelectQuote?: (quote: QuoteOption) => void;
};

export function QuoteDetailsModal({
  open,
  client,
  quotes,
  onClose,
  onSelectQuote,
}: QuoteDetailsModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSelectedId(quotes[0]?.id ?? null);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, quotes]);

  if (!open || !client) return null;

  const selected = quotes.find((q) => q.id === selectedId) ?? quotes[0];

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close quote details" onClick={onClose} />
      <div className="va-ops-modal va-ops-modal-wide" role="dialog" aria-modal="true" aria-label="Quote details">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Quote Details — {client}</h2>
            <p className="va-ops-modal-subtitle">{quotes.length} returned quote{quotes.length === 1 ? "" : "s"}</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>
        <div className="va-ops-modal-body">
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Carrier</th>
                  <th>Premium</th>
                  <th>Deductible</th>
                  <th>Limits</th>
                  <th>Broker Fee</th>
                  <th aria-label="Select" />
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className={cn(selectedId === quote.id && "submission-tracker-row selected")}
                  >
                    <td>{quote.carrier}</td>
                    <td className="commercial-hub-premium">{quote.premium}</td>
                    <td>{quote.deductible}</td>
                    <td>{quote.coverageLimits}</td>
                    <td>{quote.brokerFee}</td>
                    <td>
                      <button
                        type="button"
                        className="va-ops-action-btn"
                        onClick={() => setSelectedId(quote.id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selected && (
            <div className="quote-details-selected">
              <div className="submission-tracker-detail-label">Selected Quote Notes</div>
              <p>{selected.notes}</p>
              <p className="va-ops-section-sub">Exclusions: {selected.exclusions}</p>
            </div>
          )}
        </div>
        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Close</button>
          {selected && onSelectQuote && (
            <button
              type="button"
              className="va-ops-role-action-btn intake-form-continue-btn"
              onClick={() => {
                onSelectQuote(selected);
                onClose();
              }}
            >
              Select Quote
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
