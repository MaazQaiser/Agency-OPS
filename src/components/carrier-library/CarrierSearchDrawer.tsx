"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import type { CarrierRecord } from "@/data/carrierLibrary";
import { crossModuleRoutes, navigateWithHandoff } from "@/lib/crossModuleLinks";
import { routes } from "@/lib/routes";
import { getNameInitials } from "@/lib/nameInitials";

type CarrierSearchDrawerProps = {
  carrier: CarrierRecord | null;
  onClose: () => void;
  onViewProfile?: (carrierId: string) => void;
  onStartSubmission?: (carrierId: string) => void;
  onUseCarrier?: (carrier: CarrierRecord) => void;
};

export function CarrierSearchDrawer({
  carrier,
  onClose,
  onViewProfile,
  onStartSubmission,
  onUseCarrier,
}: CarrierSearchDrawerProps) {
  const router = useRouter();
  useEffect(() => {
    if (!carrier) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [carrier, onClose]);

  if (!carrier) return null;

  const { drawer } = carrier;

  const handleUseCarrier = () => {
    if (onUseCarrier) {
      onUseCarrier(carrier);
      return;
    }
    navigateWithHandoff(
      router,
      crossModuleRoutes.carrierFollowUp(
        { carrier: carrier.id, carrierName: carrier.name },
        { href: routes.carrierLibrary, label: "Carrier Library" },
      ),
      {
        type: "carrier-to-followup",
        sourcePath: routes.carrierLibrary,
        returnLabel: "Carrier Library",
        payload: {
          carrierId: carrier.id,
          carrierName: carrier.name,
          appetite: carrier.verticalAppetite,
          docs: drawer.submissionRequirements.join("; "),
        },
      },
      { href: routes.carrierLibrary, label: "Carrier Library" },
    );
    onClose();
  };

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close carrier details"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${carrier.name} carrier details`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar" aria-hidden="true">
              {getNameInitials(carrier.name)}
            </span>
            <div>
              <div className="va-ops-drawer-name">{carrier.name}</div>
              <div className="va-ops-drawer-role">
                {carrier.product} · {carrier.verticalAppetite}
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Carrier Summary</div>
            <p className="va-ops-drawer-text">{drawer.summary}</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Products</div>
            <ul className="va-ops-gap-list">
              {drawer.products.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>

          <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
            <div>
              <dt>States</dt>
              <dd>{drawer.statesList.join(", ")}</dd>
            </div>
            <div>
              <dt>Vertical Appetite</dt>
              <dd>{drawer.verticals.join(", ")}</dd>
            </div>
            <div>
              <dt>MGA Contact</dt>
              <dd>{carrier.mgaContact}</dd>
            </div>
            <div>
              <dt>MGA Email</dt>
              <dd>{drawer.mgaEmail}</dd>
            </div>
            <div>
              <dt>MGA Phone</dt>
              <dd>{drawer.mgaPhone}</dd>
            </div>
            <div>
              <dt>Response Time</dt>
              <dd>{carrier.responseTime}</dd>
            </div>
          </dl>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Submission Requirements</div>
            <ul className="va-ops-gap-list">
              {drawer.submissionRequirements.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          </div>

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

          {drawer.recentChanges.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Recent Changes</div>
              <ul className="va-ops-gap-list">
                {drawer.recentChanges.map((change) => (
                  <li key={change}>{change}</li>
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
                onClick={handleUseCarrier}
              >
                <AppIcon name="check" size={15} strokeWidth={2} />
                Use Carrier
              </button>
              <button
                type="button"
                className="va-ops-drawer-action-btn"
                onClick={() => onViewProfile?.(carrier.id)}
              >
                <AppIcon name="folder" size={15} strokeWidth={2} />
                View Carrier
              </button>
              <button
                type="button"
                className="va-ops-drawer-action-btn"
                onClick={() => onStartSubmission?.(carrier.id)}
              >
                <AppIcon name="plus" size={15} strokeWidth={2} />
                Start Submission
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="star" size={15} strokeWidth={2} />
                Save Carrier
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="phone" size={15} strokeWidth={2} />
                Contact MGA
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
