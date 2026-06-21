"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { QuoteOption } from "@/data/submissionTracker";

type QuoteComparisonDrawerProps = {
  quote: QuoteOption | null;
  clientName: string | null;
  onClose: () => void;
};

export function QuoteComparisonDrawer({ quote, clientName, onClose }: QuoteComparisonDrawerProps) {
  useEffect(() => {
    if (!quote) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [quote, onClose]);

  if (!quote || !clientName) return null;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close quote comparison"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${quote.carrier} quote for ${clientName}`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <div>
              <div className="va-ops-drawer-name">{quote.carrier}</div>
              <div className="va-ops-drawer-role">{clientName}</div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
            <div><dt>Carrier</dt><dd>{quote.carrier}</dd></div>
            <div><dt>Premium</dt><dd>{quote.premium}</dd></div>
            <div><dt>Deductible</dt><dd>{quote.deductible}</dd></div>
            <div><dt>Coverage Limits</dt><dd>{quote.coverageLimits}</dd></div>
            <div><dt>Exclusions</dt><dd>{quote.exclusions}</dd></div>
            <div><dt>Broker Fee</dt><dd>{quote.brokerFee}</dd></div>
          </dl>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Notes</div>
            <p className="va-ops-drawer-text">{quote.notes}</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn primary">
                <AppIcon name="check" size={15} strokeWidth={2} />
                Select Carrier
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="send" size={15} strokeWidth={2} />
                Send for Review
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="shield" size={15} strokeWidth={2} />
                Mark Bind Ready
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
