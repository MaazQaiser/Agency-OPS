"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  formBuilderSteps,
  formTypeLabels,
  getReviewSections,
  routingPreview,
} from "@/data/formBuilder";
import type { FieldError, FormBuilderStepId, IntakeFormData } from "@/data/formBuilder";
import type { IntakeFormType } from "@/data/intakeForms";

type FormReviewDrawerProps = {
  open: boolean;
  data: IntakeFormData;
  formType: IntakeFormType;
  errors: FieldError[];
  onClose: () => void;
  onEditStep: (step: FormBuilderStepId) => void;
};

export function FormReviewDrawer({
  open,
  data,
  formType,
  errors,
  onClose,
  onEditStep,
}: FormReviewDrawerProps) {
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

  if (!open) return null;

  const reviewSections = getReviewSections(data, formType);
  const displayName = data.businessName || "New Submission";

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close submission review"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Submission review summary"
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <div>
              <div className="va-ops-drawer-name">{displayName}</div>
              <div className="va-ops-drawer-role">{formTypeLabels[formType]}</div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Full Submission Summary</div>
            {reviewSections.map((section) => (
              <div key={section.title} className="intake-review-block">
                <h4 className="intake-review-block-title">{section.title}</h4>
                <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
                  {section.items.map(([label, value]) => (
                    <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          {errors.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Validation Errors</div>
              <ul className="intake-review-errors">
                {errors.map((err) => (
                  <li key={`${err.field}-${err.message}`}>{err.message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Routing Destination</div>
            <ul className="va-ops-gap-list">
              {routingPreview.map((dest) => (
                <li key={dest}>{dest}</li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Submission History</div>
            <p className="va-ops-drawer-text">No duplicate submissions found for this business name.</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Edit Section</div>
            <div className="intake-review-step-links">
              {formBuilderSteps.slice(0, 5).map((step) => (
                <button
                  key={step.id}
                  type="button"
                  className="va-ops-drawer-action-btn"
                  onClick={() => {
                    onEditStep(step.id);
                    onClose();
                  }}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="folder" size={15} strokeWidth={2} />
                Save Draft
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="clipboard" size={15} strokeWidth={2} />
                Duplicate Form
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
