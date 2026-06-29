"use client";

import { useEffect } from "react";
import { VaOpsDrawerRoot } from "@/components/ui/VaOpsDrawerRoot";
import { AppIcon } from "@/components/ui/AppIcon";
import type { CoverageReviewItem } from "@/data/coverageChecklist";

type CoverageDetailDrawerProps = {
  coverage: CoverageReviewItem | null;
  clientName: string | null;
  onClose: () => void;
};

export function CoverageDetailDrawer({ coverage, clientName, onClose }: CoverageDetailDrawerProps) {
  useEffect(() => {
    if (!coverage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [coverage, onClose]);

  if (!coverage || !clientName) return null;

  const { drawer } = coverage;

  return (
    <VaOpsDrawerRoot>
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close coverage details"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${coverage.name} coverage for ${clientName}`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <div>
              <div className="va-ops-drawer-name">{coverage.name}</div>
              <div className="va-ops-drawer-role">
                {clientName} · {coverage.status}
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Coverage Details</div>
            <p className="va-ops-drawer-text">{drawer.details}</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Carrier Options</div>
            <ul className="va-ops-gap-list">
              {drawer.carrierOptions.map((carrier) => (
                <li key={carrier}>{carrier}</li>
              ))}
            </ul>
          </div>

          <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
            <div><dt>Limits</dt><dd>{drawer.limits}</dd></div>
            <div><dt>Deductibles</dt><dd>{drawer.deductibles}</dd></div>
            <div><dt>Exclusions</dt><dd>{drawer.exclusions}</dd></div>
          </dl>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Premium Options</div>
            <ul className="coverage-drawer-premium-list">
              {drawer.premiumOptions.map((option) => (
                <li key={option.carrier}>
                  <strong>{option.carrier}</strong> — {option.premium}
                </li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Broker Notes</div>
            <ul className="va-ops-gap-list">
              {drawer.brokerNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="clipboard" size={15} strokeWidth={2} />
                Edit Coverage
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="message-square" size={15} strokeWidth={2} />
                Add Notes
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="refresh" size={15} strokeWidth={2} />
                Replace Carrier
              </button>
              <button type="button" className="va-ops-drawer-action-btn primary">
                <AppIcon name="check" size={15} strokeWidth={2} />
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      </aside>
    </VaOpsDrawerRoot>
  );
}
