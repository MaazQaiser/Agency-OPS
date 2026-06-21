"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { WorkflowLogicStep } from "@/data/automationBuilder";
import { cn } from "@/lib/cn";

type LogicStepDrawerProps = {
  step: WorkflowLogicStep | null;
  workflowName: string;
  onClose: () => void;
};

const stepTypeLabels = {
  trigger: "Trigger",
  condition: "Condition",
  action: "Action",
  outcome: "Outcome",
} as const;

const stepTypeClass = {
  trigger: "va-ops-logic-trigger",
  condition: "va-ops-logic-condition",
  action: "va-ops-logic-action",
  outcome: "va-ops-logic-outcome",
} as const;

export function LogicStepDrawer({ step, workflowName, onClose }: LogicStepDrawerProps) {
  useEffect(() => {
    if (!step) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [step, onClose]);

  if (!step) return null;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close logic step drawer"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${stepTypeLabels[step.type]} step details`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className={cn("va-ops-drawer-avatar va-ops-logic-step-avatar", stepTypeClass[step.type])} aria-hidden="true">
              <AppIcon name="settings" size={18} strokeWidth={2} />
            </span>
            <div>
              <div className="va-ops-drawer-name">{step.label}</div>
              <div className="va-ops-drawer-role">
                {stepTypeLabels[step.type]} · {workflowName}
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Step Type</div>
            <span className={cn("badge", stepTypeClass[step.type])}>{stepTypeLabels[step.type]}</span>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Description</div>
            <p className="va-ops-drawer-text">{step.description}</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Configuration</div>
            <ul className="va-ops-drawer-list">
              {step.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Quick Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn primary">
                <AppIcon name="settings" size={15} strokeWidth={2} />
                Edit Step
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="rocket" size={15} strokeWidth={2} />
                Test Step
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
