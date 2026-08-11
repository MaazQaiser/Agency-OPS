"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { aiCompliancePolicySections } from "@/data/aiComplianceNotice";
import { cn } from "@/lib/cn";

type AiCompliancePolicyModalProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Mock AI Drafting Policy modal opened from the compliance footer.
 */
export function AiCompliancePolicyModal({ open, onClose }: AiCompliancePolicyModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="va-ops-modal-root send-center-compliance-modal-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close AI drafting policy"
        onClick={onClose}
      />
      <div
        className="va-ops-modal send-center-compliance-policy-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-compliance-policy-title"
        data-shortcut-ignore
      >
        <div className="va-ops-modal-header">
          <div>
            <h2 id="ai-compliance-policy-title" className="va-ops-modal-title">
              AI Drafting Policy
            </h2>
            <p className="va-ops-modal-subtitle">
              How Agency OS uses AI for outbound drafting and compliance.
            </p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="send-center-compliance-policy-body">
          {aiCompliancePolicySections.map((section) => (
            <section key={section.id} className="send-center-compliance-policy-section">
              <h3 className="send-center-compliance-policy-section-title">{section.title}</h3>
              <p className="send-center-compliance-policy-section-body">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
