"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { formTypeLabels, getSubmissionRules } from "@/data/formBuilder";
import type { IntakeFormType } from "@/data/intakeForms";

type SubmissionRulesDrawerProps = {
  open: boolean;
  formType: IntakeFormType;
  onClose: () => void;
};

export function SubmissionRulesDrawer({ open, formType, onClose }: SubmissionRulesDrawerProps) {
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

  const sections = getSubmissionRules(formType);

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close submission rules"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Submission rules"
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <div>
              <div className="va-ops-drawer-name">Submission Rules</div>
              <div className="va-ops-drawer-role">{formTypeLabels[formType]}</div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          {sections.map((section) => (
            <div key={section.title} className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">{section.title}</div>
              <ul className="va-ops-gap-list intake-rules-list">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
