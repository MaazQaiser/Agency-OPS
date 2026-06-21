"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { IntakeFormCard } from "@/data/intakeForms";

type FormSelectorDrawerProps = {
  form: IntakeFormCard | null;
  onClose: () => void;
};

export function FormSelectorDrawer({ form, onClose }: FormSelectorDrawerProps) {
  useEffect(() => {
    if (!form) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [form, onClose]);

  if (!form) return null;

  const { drawer } = form;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close form overview"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${form.title} overview`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <div>
              <div className="va-ops-drawer-name">{form.title}</div>
              <div className="va-ops-drawer-role">{form.avgCompletionTime} avg completion</div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Form Overview</div>
            <p className="va-ops-drawer-text">{drawer.overview}</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Required Documents</div>
            <ul className="va-ops-gap-list">
              {drawer.requiredDocuments.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          </div>

          <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
            <div><dt>Est. Completion</dt><dd>{drawer.estimatedCompletionTime}</dd></div>
            <div><dt>Who Can Submit</dt><dd>{drawer.whoCanSubmit}</dd></div>
          </dl>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Routing Destination</div>
            <ul className="va-ops-gap-list">
              {drawer.routingDestination.map((dest) => (
                <li key={dest}>{dest}</li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn primary">
                <AppIcon name="plus" size={15} strokeWidth={2} />
                Start New
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="folder" size={15} strokeWidth={2} />
                Save Draft
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="clipboard" size={15} strokeWidth={2} />
                Duplicate Last Submission
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
