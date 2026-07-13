"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  automationBuilderHeader,
  automationKpis,
  buildExecutionLogDetails,
  connectedSystems,
  executionHistory as initialExecutionHistory,
  failedExecutions as initialFailedExecutions,
  featuredWorkflowId,
  featuredWorkflowLogic,
  liveTriggerActivity as initialTriggerActivity,
  activeWorkflows as initialWorkflows,
  optimizationQueue,
  type AddTriggerPayload,
  type AutomationWorkflow,
  type CreateWorkflowPayload,
  type ExecutionLogItem,
  type ExecutionLogVariant,
  type FailedExecution,
  type IntegrationStatus,
  type TriggerActivityItem,
  type WorkflowLogicStep,
  type WorkflowStatus,
} from "@/data/automationBuilder";
import { CardSkeletonGrid, KpiSkeletonGrid } from "@/components/shared/loading";
import { DataStateView, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { VaOpsKpiCard } from "@/components/kpi/VaOpsKpiCard";
import { cn } from "@/lib/cn";
import { AddTriggerDrawer } from "./AddTriggerDrawer";
import { CreateWorkflowModal } from "./CreateWorkflowModal";
import { LogicStepDrawer } from "./LogicStepDrawer";
import { RoleTabHeader } from "./RoleTabHeader";
import { RunTestModal, type RunTestResult } from "./RunTestModal";
import { ViewLogsModal } from "./ViewLogsModal";
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

type ActiveModal = "create" | "logs" | "test" | null;

export function AutomationBuilderTab({ embedded = false }: { embedded?: boolean } = {}) {
  const toast = useToast();
  const testToastIdRef = useRef<string | null>(null);
  const {
    status,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => true,
    isEmpty: () => false,
    errorPreset: "supabase-timeout",
  });
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [triggers, setTriggers] = useState(initialTriggerActivity);
  const [execLogs, setExecLogs] = useState(initialExecutionHistory);
  const [failedRuns, setFailedRuns] = useState(initialFailedExecutions);
  const [executionsToday, setExecutionsToday] = useState(324);

  const [selectedWorkflowId, setSelectedWorkflowId] = useState(featuredWorkflowId);
  const [drawerWorkflow, setDrawerWorkflow] = useState<AutomationWorkflow | null>(null);
  const [selectedLogicStep, setSelectedLogicStep] = useState<WorkflowLogicStep | null>(null);

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [triggerDrawerOpen, setTriggerDrawerOpen] = useState(false);

  const focusedWorkflow = useMemo(
    () => workflows.find((w) => w.id === selectedWorkflowId) ?? workflows[0],
    [workflows, selectedWorkflowId],
  );

  const logDetails = useMemo(
    () => buildExecutionLogDetails(execLogs, failedRuns),
    [execLogs, failedRuns],
  );

  const liveCount = workflows.filter((w) => w.status === "active").length;
  const pausedCount = workflows.filter((w) => w.status === "paused").length;

  const displayKpis = useMemo(() => {
    return automationKpis.map((kpi) => {
      if (kpi.label === "Active Workflows") {
        return {
          ...kpi,
          value: String(workflows.length),
          sub: `${liveCount} live / ${pausedCount} paused`,
        };
      }
      if (kpi.label === "Executions Today") {
        return { ...kpi, value: String(executionsToday) };
      }
      if (kpi.label === "Failed Runs") {
        return { ...kpi, value: String(failedRuns.length) };
      }
      return kpi;
    });
  }, [workflows.length, liveCount, pausedCount, executionsToday, failedRuns.length]);

  const openWorkflow = (workflow: AutomationWorkflow) => {
    setSelectedWorkflowId(workflow.id);
    setDrawerWorkflow(workflow);
  };

  const handleQuickAction = useCallback((actionId: string) => {
    if (actionId === "create-workflow") setActiveModal("create");
    if (actionId === "add-trigger") setTriggerDrawerOpen(true);
    if (actionId === "view-logs") setActiveModal("logs");
    if (actionId === "run-test") setActiveModal("test");
  }, []);

  const handleCreateWorkflow = useCallback((payload: CreateWorkflowPayload) => {
    toast.success(toastMessages.vaOps.workflowCreated);
    const newWorkflow: AutomationWorkflow = {
      id: `wf-${Date.now()}`,
      name: payload.name.trim(),
      trigger: payload.triggerType,
      action: payload.actionType,
      status: "active",
      statusLabel: "Active",
      runsToday: 1,
      cta: "Open Workflow",
      conditions: [payload.condition],
      actions: [`Assign to ${payload.assignTo}`, payload.actionType],
      dependencies: [],
      connectedTools: ["AgencyZoom"],
      lastExecution: "Just now: success",
      failureLogs: [],
    };

    setWorkflows((prev) => [newWorkflow, ...prev]);
    setSelectedWorkflowId(newWorkflow.id);
    setExecutionsToday((prev) => prev + 1);
    setExecLogs((prev) => [
      {
        id: `el-${Date.now()}`,
        text: `${newWorkflow.name} created and activated`,
        time: "Just now",
        variant: "triggered",
      },
      ...prev,
    ]);
  }, [toast]);

  const handleRunTestStart = useCallback(() => {
    testToastIdRef.current = toast.processing("Running workflow test…");
  }, [toast]);

  const handleAddTrigger = useCallback((payload: AddTriggerPayload) => {
    const newTrigger: TriggerActivityItem = {
      id: `ta-${Date.now()}`,
      trigger: `${payload.name} triggered (${payload.source})`,
      status: payload.enabled ? "success" : "running",
      time: "Just now",
    };
    setTriggers((prev) => [newTrigger, ...prev]);
  }, []);

  const handleRunTest = useCallback((result: RunTestResult) => {
    if (testToastIdRef.current) {
      toast.update(
        testToastIdRef.current,
        result.success ? "Workflow test completed" : (result.error ?? "Workflow test failed"),
        result.success ? "success" : "error",
      );
      testToastIdRef.current = null;
    }

    setExecutionsToday((prev) => prev + 1);

    const logEntry: ExecutionLogItem = {
      id: `el-${Date.now()}`,
      text: result.success
        ? `${result.workflowName} test completed`
        : `${result.workflowName} test failed`,
      time: "Just now",
      variant: result.success ? "success" : "failed",
    };
    setExecLogs((prev) => [logEntry, ...prev]);

    if (result.success) {
      setWorkflows((prev) =>
        prev.map((workflow) =>
          workflow.name === result.workflowName
            ? {
                ...workflow,
                runsToday: workflow.runsToday + 1,
                lastExecution: "Just now: test success",
              }
            : workflow,
        ),
      );
      return;
    }

    const failedEntry: FailedExecution = {
      id: `fe-${Date.now()}`,
      workflow: result.workflowName,
      error: result.error ?? "Test simulation failed",
      time: "Just now",
      cta: "Debug",
    };
    setFailedRuns((prev) => [failedEntry, ...prev]);
  }, [toast]);

  const content = (
    <div className={cn("va-ops-role-view va-ops-automation", embedded && "embedded")}>
      {!embedded && (
        <RoleTabHeader
          title={automationBuilderHeader.title}
          subtitle={automationBuilderHeader.subtitle}
          quickActions={automationBuilderHeader.quickActions}
          onQuickActionClick={handleQuickAction}
        />
      )}

      {!embedded && (
        <section className="va-ops-kpi-strip" aria-label="Automation KPI summary">
          <div className="va-ops-kpi-grid">
            {displayKpis.map((kpi) => (
              <VaOpsKpiCard key={kpi.label} {...kpi} />
            ))}
          </div>
        </section>
      )}

      <div className="va-ops-content-grid">
        <section className="va-ops-panel va-ops-workflow-library" aria-label="Active workflows">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Active Workflows</h3>
            <p className="va-ops-section-sub">Current operational automations.</p>
          </div>
          <ul className="va-ops-workflow-list">
            {workflows.map((workflow) => (
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
            {triggers.map((item) => (
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
            Step structure for <strong>{focusedWorkflow?.name}</strong>
          </p>
        </div>
        <div className="va-ops-logic-flow">
          {featuredWorkflowLogic.map((step, index) => (
            <div key={step.id} className="va-ops-logic-step-wrap">
              <button
                type="button"
                className={cn("va-ops-logic-step va-ops-logic-step-btn", logicStepClass[step.type])}
                onClick={() => setSelectedLogicStep(step)}
              >
                <span className="va-ops-logic-step-type">{step.type}</span>
                <span className="va-ops-logic-step-label">{step.label}</span>
              </button>
              {index < featuredWorkflowLogic.length - 1 && (
                <div className="va-ops-logic-arrow" aria-hidden="true">↓</div>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="va-ops-action-btn"
          onClick={() => setSelectedLogicStep(featuredWorkflowLogic[0])}
        >
          <AppIcon name="settings" size={14} strokeWidth={2.25} />
          Edit Logic
        </button>
      </section>

      <section className="va-ops-panel va-ops-failed-panel aos-card--action" aria-label="Failed executions">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Failed Executions</h3>
          <p className="va-ops-section-sub">Workflow errors requiring attention.</p>
        </div>
        <ul className="va-ops-failed-list">
          {failedRuns.map((item) => (
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
            {execLogs.map((item) => (
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
      <LogicStepDrawer
        step={selectedLogicStep}
        workflowName={focusedWorkflow?.name ?? "Workflow"}
        onClose={() => setSelectedLogicStep(null)}
      />
      <CreateWorkflowModal
        open={activeModal === "create"}
        onClose={() => setActiveModal(null)}
        onSave={handleCreateWorkflow}
      />
      <AddTriggerDrawer
        open={triggerDrawerOpen}
        onClose={() => setTriggerDrawerOpen(false)}
        onSave={handleAddTrigger}
      />
      <ViewLogsModal
        open={activeModal === "logs"}
        logs={logDetails}
        onClose={() => setActiveModal(null)}
      />
      <RunTestModal
        open={activeModal === "test"}
        workflows={workflows}
        onClose={() => setActiveModal(null)}
        onRunStart={handleRunTestStart}
        onRun={handleRunTest}
      />
    </div>
  );

  if (embedded) return content;

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <div className="va-ops-role-view va-ops-automation">
          <KpiSkeletonGrid count={4} />
          <CardSkeletonGrid count={3} tall />
        </div>
      }
      error={
        <HubErrorState
          preset="supabase-timeout"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      }
    >
      {content}
    </DataStateView>
  );
}
