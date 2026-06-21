"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { CarrierProductAppetite } from "@/data/carrierProfile";

type CarrierProductDrawerProps = {
  product: CarrierProductAppetite | null;
  carrierName: string;
  onClose: () => void;
  onStartSubmission?: () => void;
};

export function CarrierProductDrawer({
  product,
  carrierName,
  onClose,
  onStartSubmission,
}: CarrierProductDrawerProps) {
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  const { drawer } = product;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close product details"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${product.product} product details`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar" aria-hidden="true">
              {product.product.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <div className="va-ops-drawer-name">{product.product}</div>
              <div className="va-ops-drawer-role">
                {carrierName} · {product.verticals.join(", ")}
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Product Details</div>
            <p className="va-ops-drawer-text">{drawer.summary}</p>
          </div>

          <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
            <div>
              <dt>Limits</dt>
              <dd>{drawer.limits}</dd>
            </div>
            <div>
              <dt>Deductibles</dt>
              <dd>{drawer.deductibles}</dd>
            </div>
            <div>
              <dt>Underwriter</dt>
              <dd>{drawer.underwriterContact}</dd>
            </div>
          </dl>

          {drawer.exclusions.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Exclusions</div>
              <ul className="va-ops-gap-list">
                {drawer.exclusions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {drawer.submissionExamples.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Submission Examples</div>
              <ul className="va-ops-gap-list">
                {drawer.submissionExamples.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {drawer.brokerNotes.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Broker Notes</div>
              <ul className="va-ops-gap-list">
                {drawer.brokerNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {drawer.recentWins.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Recent Wins</div>
              <ul className="va-ops-gap-list">
                {drawer.recentWins.map((win) => (
                  <li key={win}>{win}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button
                type="button"
                className="va-ops-drawer-action-btn primary"
                onClick={onStartSubmission}
              >
                <AppIcon name="plus" size={15} strokeWidth={2} />
                Start Submission
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="star" size={15} strokeWidth={2} />
                Save Product
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="phone" size={15} strokeWidth={2} />
                Contact Underwriter
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
