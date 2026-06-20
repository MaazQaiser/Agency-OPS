"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { AutomationWorkflow } from "@/data/automationBuilder";

type WorkflowDrawerProps = {
  workflow: AutomationWorkflow | null;
  onClose: () => void;
};

export function WorkflowDrawer({ workflow, onClose }: WorkflowDrawerProps) {
  useEffect(() => {
    if (!workflow) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [workflow, onClose]);

  if (!workflow) return null;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close workflow drawer"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`${workflow.name} workflow details`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar va-ops-workflow-avatar" aria-hidden="true">
              <AppIcon name="rocket" size={20} strokeWidth={2} />
            </span>
            <div>
              <div className="va-ops-drawer-name">{workflow.name}</div>
              <div className="va-ops-drawer-role">
                {workflow.statusLabel} · {workflow.runsToday} runs today
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Trigger</div>
            <p className="va-ops-drawer-text">{workflow.trigger}</p>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Conditions</div>
            <ul className="va-ops-drawer-list">
              {workflow.conditions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Actions</div>
            <ul className="va-ops-drawer-list">
              {workflow.actions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Dependencies</div>
            <ul className="va-ops-drawer-list">
              {workflow.dependencies.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Connected Tools</div>
            <div className="va-ops-tool-tags">
              {workflow.connectedTools.map((tool) => (
                <span key={tool} className="va-ops-tool-tag">{tool}</span>
              ))}
            </div>
          </div>

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Last Execution</div>
            <p className="va-ops-drawer-text">{workflow.lastExecution}</p>
          </div>

          {workflow.failureLogs.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Failure Logs</div>
              <ul className="va-ops-drawer-actions">
                {workflow.failureLogs.map((log) => (
                  <li key={`${log.error}-${log.time}`}>
                    <span>{log.error}</span>
                    <time>{log.time}</time>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Quick Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="refresh" size={15} strokeWidth={2} />
                {workflow.status === "paused" ? "Resume Workflow" : "Pause Workflow"}
              </button>
              <button type="button" className="va-ops-drawer-action-btn primary">
                <AppIcon name="settings" size={15} strokeWidth={2} />
                Edit Workflow
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="clipboard" size={15} strokeWidth={2} />
                Duplicate Workflow
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="rocket" size={15} strokeWidth={2} />
                Test Run
              </button>
              <button type="button" className="va-ops-drawer-action-btn va-ops-action-danger">
                <AppIcon name="x" size={15} strokeWidth={2} />
                Delete Workflow
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
