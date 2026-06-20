"use client";

import { useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  activeWorkflows,
  automationBuilderHeader,
  automationKpis,
  connectedSystems,
  executionHistory,
  failedExecutions,
  featuredWorkflowId,
  featuredWorkflowLogic,
  liveTriggerActivity,
  optimizationQueue,
  type AutomationWorkflow,
  type ExecutionLogVariant,
  type IntegrationStatus,
  type WorkflowStatus,
} from "@/data/automationBuilder";
import { cn } from "@/lib/cn";
import { RoleTabHeader } from "./RoleTabHeader";
import { WorkflowDrawer } from "./WorkflowDrawer";

const workflowStatusClass: Record<WorkflowStatus, string> = {
  active: "badge-green",
  paused: "badge-gray",
};

const triggerStatusClass = {
  success: "va-ops-trigger-success",
  failed: "va-ops-trigger-failed",
  running: "va-ops-trigger-running",
} as const;

const integrationStatusClass: Record<IntegrationStatus, string> = {
  connected: "badge-green",
  degraded: "badge-yellow",
  disconnected: "badge-red",
};

const executionVariantClass: Record<ExecutionLogVariant, string> = {
  success: "va-ops-exec-success",
  failed: "va-ops-exec-failed",
  sent: "va-ops-exec-sent",
  triggered: "va-ops-exec-triggered",
};

const logicStepClass = {
  trigger: "va-ops-logic-trigger",
  condition: "va-ops-logic-condition",
  action: "va-ops-logic-action",
  outcome: "va-ops-logic-outcome",
} as const;

export function AutomationBuilderTab() {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(featuredWorkflowId);
  const [drawerWorkflow, setDrawerWorkflow] = useState<AutomationWorkflow | null>(null);

  const focusedWorkflow = useMemo(
    () => activeWorkflows.find((w) => w.id === selectedWorkflowId) ?? activeWorkflows[0],
    [selectedWorkflowId],
  );

  const openWorkflow = (workflow: AutomationWorkflow) => {
    setSelectedWorkflowId(workflow.id);
    setDrawerWorkflow(workflow);
  };

  return (
    <div className="va-ops-role-view va-ops-automation">
      <RoleTabHeader
        title={automationBuilderHeader.title}
        subtitle={automationBuilderHeader.subtitle}
        quickActions={automationBuilderHeader.quickActions}
      />

      <section className="va-ops-kpi-strip" aria-label="Automation KPI summary">
        <div className="va-ops-kpi-grid">
          {automationKpis.map((kpi) => (
            <article key={kpi.label} className={cn("va-ops-kpi-card", kpi.color)}>
              <div className="va-ops-kpi-label">{kpi.label}</div>
              <div className="va-ops-kpi-value">{kpi.value}</div>
              <div className="va-ops-kpi-sub">{kpi.sub}</div>
              <div className="va-ops-kpi-helper">{kpi.helper}</div>
            </article>
          ))}
        </div>
      </section>

      <div className="va-ops-content-grid">
        <section className="va-ops-panel va-ops-workflow-library" aria-label="Active workflows">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Active Workflows</h3>
            <p className="va-ops-section-sub">Current operational automations.</p>
          </div>
          <ul className="va-ops-workflow-list">
            {activeWorkflows.map((workflow) => (
              <li
                key={workflow.id}
                className={cn(
                  "va-ops-workflow-card",
                  selectedWorkflowId === workflow.id && "selected",
                )}
              >
                <button
                  type="button"
                  className="va-ops-workflow-main"
                  onClick={() => openWorkflow(workflow)}
                >
                  <div className="va-ops-workflow-name">{workflow.name}</div>
                  <div className="va-ops-workflow-meta">
                    <span>Trigger: <strong>{workflow.trigger}</strong></span>
                    <span>Action: <strong>{workflow.action}</strong></span>
                    <span>Runs Today: <strong>{workflow.runsToday}</strong></span>
                  </div>
                  <span className={cn("badge", workflowStatusClass[workflow.status])}>
                    {workflow.statusLabel}
                  </span>
                </button>
                <button
                  type="button"
                  className={cn(
                    "va-ops-action-btn",
                    workflow.status === "paused" && "va-ops-resume-btn",
                  )}
                  onClick={() => openWorkflow(workflow)}
                >
                  {workflow.cta}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="va-ops-panel va-ops-trigger-panel" aria-label="Live trigger activity">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Live Trigger Activity</h3>
            <p className="va-ops-section-sub">Real-time system events.</p>
          </div>
          <ul className="va-ops-trigger-activity-list">
            {liveTriggerActivity.map((item) => (
              <li key={item.id} className={cn("va-ops-trigger-activity-row", triggerStatusClass[item.status])}>
                <span className="va-ops-trigger-activity-dot" aria-hidden="true" />
                <div>
                  <div className="va-ops-trigger-activity-text">{item.trigger}</div>
                  <time className="va-ops-activity-time">{item.time}</time>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="va-ops-panel va-ops-logic-panel" aria-label="Workflow logic">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Workflow Logic</h3>
          <p className="va-ops-section-sub">
            Step structure for <strong>{focusedWorkflow.name}</strong>
          </p>
        </div>
        <div className="va-ops-logic-flow">
          {featuredWorkflowLogic.map((step, index) => (
            <div key={step.id} className="va-ops-logic-step-wrap">
              <div className={cn("va-ops-logic-step", logicStepClass[step.type])}>
                <span className="va-ops-logic-step-type">{step.type}</span>
                <span className="va-ops-logic-step-label">{step.label}</span>
              </div>
              {index < featuredWorkflowLogic.length - 1 && (
                <div className="va-ops-logic-arrow" aria-hidden="true">↓</div>
              )}
            </div>
          ))}
        </div>
        <button type="button" className="va-ops-action-btn">
          <AppIcon name="settings" size={14} strokeWidth={2.25} />
          Edit Logic
        </button>
      </section>

      <section className="va-ops-panel va-ops-failed-panel" aria-label="Failed executions">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Failed Executions</h3>
          <p className="va-ops-section-sub">Workflow errors requiring attention.</p>
        </div>
        <ul className="va-ops-failed-list">
          {failedExecutions.map((item) => (
            <li key={item.id} className="va-ops-failed-row">
              <div className="va-ops-failed-main">
                <div className="va-ops-failed-workflow">{item.workflow}</div>
                <div className="va-ops-failed-meta">
                  <span>Error: <strong>{item.error}</strong></span>
                  <span>Time: <strong>{item.time}</strong></span>
                </div>
              </div>
              <button type="button" className="va-ops-action-btn critical">
                {item.cta}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="va-ops-panel va-ops-integrations-panel" aria-label="Connected systems">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Connected Systems</h3>
          <p className="va-ops-section-sub">External integration health.</p>
        </div>
        <div className="va-ops-integrations-grid">
          {connectedSystems.map((system) => (
            <article key={system.id} className="va-ops-integration-card">
              <div className="va-ops-integration-name">{system.name}</div>
              <span className={cn("badge", integrationStatusClass[system.status])}>
                {system.statusLabel}
              </span>
              <div className="va-ops-integration-sync">
                Last Sync: <strong>{system.lastSync}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="va-ops-automation-bottom-grid">
        <section className="va-ops-panel va-ops-optimization-panel" aria-label="Suggested improvements">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Suggested Improvements</h3>
            <p className="va-ops-section-sub">Continuous process optimization queue.</p>
          </div>
          <ul className="va-ops-optimization-list">
            {optimizationQueue.map((item) => (
              <li key={item.id} className="va-ops-optimization-row">
                <div className="va-ops-optimization-main">
                  <div className="va-ops-optimization-workflow">{item.workflow}</div>
                  <div className="va-ops-optimization-suggestion">{item.suggestion}</div>
                  <div className="va-ops-optimization-impact">
                    Impact: <strong>{item.impact}</strong>
                  </div>
                </div>
                <button type="button" className="va-ops-action-btn">
                  {item.cta}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="va-ops-panel va-ops-exec-history-panel" aria-label="Recent execution logs">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Recent Execution Logs</h3>
            <p className="va-ops-section-sub">Full automation visibility.</p>
          </div>
          <ul className="va-ops-exec-history">
            {executionHistory.map((item) => (
              <li
                key={item.id}
                className={cn("va-ops-exec-history-item", executionVariantClass[item.variant])}
              >
                <span className="va-ops-exec-dot" aria-hidden="true" />
                <div>
                  <div className="va-ops-exec-text">{item.text}</div>
                  <time className="va-ops-activity-time">{item.time}</time>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <WorkflowDrawer workflow={drawerWorkflow} onClose={() => setDrawerWorkflow(null)} />
    </div>
  );
}
