"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { AutomationWorkflow } from "@/data/automationBuilder";
import { cn } from "@/lib/cn";

type RunTestModalProps = {
  open: boolean;
  workflows: AutomationWorkflow[];
  onClose: () => void;
  onRunStart?: () => void;
  onRun: (result: RunTestResult) => void;
};

export type RunTestResult = {
  workflowName: string;
  success: boolean;
  steps: { type: string; label: string; status: "pending" | "running" | "done" | "failed" }[];
  error?: string;
};

type SimulationStep = { type: string; label: string };

const simulationSteps: SimulationStep[] = [
  { type: "trigger", label: "Trigger fired" },
  { type: "condition", label: "Condition evaluated" },
  { type: "action", label: "Action executed" },
  { type: "outcome", label: "Outcome recorded" },
];

export function RunTestModal({ open, workflows, onClose, onRunStart, onRun }: RunTestModalProps) {
  const [workflowId, setWorkflowId] = useState("");
  const [mockPayload, setMockPayload] = useState('{\n  "leadId": "LD-1042",\n  "source": "Ricochet"\n}');
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [stepStates, setStepStates] = useState<RunTestResult["steps"]>([]);
  const [complete, setComplete] = useState(false);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (!open) return;
    setWorkflowId(workflows[0]?.id ?? "");
    setMockPayload('{\n  "leadId": "LD-1042",\n  "source": "Ricochet"\n}');
    setError(null);
    setRunning(false);
    setStepStates([]);
    setComplete(false);
    setTestSuccess(null);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !running) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, workflows, running]);

  if (!open) return null;

  const selectedWorkflow = workflows.find((w) => w.id === workflowId);

  const runSimulation = async () => {
    if (!workflowId) {
      setError("Select a workflow to test.");
      return;
    }
    if (!mockPayload.trim()) {
      setError("Mock payload is required.");
      return;
    }

    setError(null);
    setRunning(true);
    setComplete(false);
    setTestSuccess(null);
    onRunStart?.();

    const willFail = mockPayload.toLowerCase().includes("fail") || mockPayload.toLowerCase().includes("error");
    const steps: RunTestResult["steps"] = simulationSteps.map((step) => ({
      ...step,
      status: "pending",
    }));
    setStepStates([...steps]);

    for (let i = 0; i < steps.length; i++) {
      setStepStates((prev) =>
        prev.map((step, idx) => ({
          ...step,
          status: idx === i ? "running" : idx < i ? "done" : "pending",
        })),
      );
      await new Promise((resolve) => setTimeout(resolve, 450));

      if (willFail && i === 2) {
        setStepStates((prev) =>
          prev.map((step, idx) => ({
            ...step,
            status: idx <= i ? (idx === i ? "failed" : "done") : "pending",
          })),
        );
        setTestSuccess(false);
        setComplete(true);
        setRunning(false);
        onRun({
          workflowName: selectedWorkflow?.name ?? "Unknown Workflow",
          success: false,
          steps,
          error: "Action step returned validation error",
        });
        return;
      }
    }

    setStepStates((prev) => prev.map((step) => ({ ...step, status: "done" })));
    setTestSuccess(true);
    setComplete(true);
    setRunning(false);
    onRun({
      workflowName: selectedWorkflow?.name ?? "Unknown Workflow",
      success: true,
      steps: simulationSteps.map((step) => ({ ...step, status: "done" as const })),
    });
  };

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close run test modal"
        onClick={running ? undefined : onClose}
      />
      <div className="va-ops-modal" role="dialog" aria-modal="true" aria-label="Run workflow test">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Run Test</h2>
            <p className="va-ops-modal-subtitle">Simulate workflow execution with a mock payload.</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose} disabled={running}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>
        <div className="va-ops-modal-body">
          <label className="intake-form-field">
            <span className="intake-form-label">Select Workflow *</span>
            <select
              className="intake-form-input"
              value={workflowId}
              onChange={(e) => setWorkflowId(e.target.value)}
              disabled={running}
            >
              <option value="">Select workflow</option>
              {workflows.map((workflow) => (
                <option key={workflow.id} value={workflow.id}>{workflow.name}</option>
              ))}
            </select>
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Input Mock Payload *</span>
            <textarea
              className="intake-form-input intake-form-textarea"
              rows={5}
              value={mockPayload}
              onChange={(e) => setMockPayload(e.target.value)}
              disabled={running}
            />
          </label>

          {stepStates.length > 0 && (
            <div className="va-ops-test-simulation" aria-label="Simulation progress">
              {stepStates.map((step) => (
                <div
                  key={step.type}
                  className={cn(
                    "va-ops-test-step",
                    step.status === "running" && "running",
                    step.status === "done" && "done",
                    step.status === "failed" && "failed",
                  )}
                >
                  <span className="va-ops-test-step-type">{step.type}</span>
                  <span className="va-ops-test-step-label">{step.label}</span>
                  {step.status === "done" && <AppIcon name="check" size={14} strokeWidth={2.5} />}
                  {step.status === "failed" && <AppIcon name="x" size={14} strokeWidth={2.5} />}
                  {step.status === "running" && <span className="va-ops-test-spinner" aria-hidden="true" />}
                </div>
              ))}
            </div>
          )}

          {complete && testSuccess !== null && (
            <div className={cn("add-market-alert", testSuccess ? "add-market-alert-success" : "add-market-alert-error")}>
              {testSuccess
                ? "Simulation completed successfully. Result added to Recent Execution Logs."
                : "Simulation failed at action step. Appended to Failed Executions."}
            </div>
          )}

          {error && <div className="add-market-alert add-market-alert-error">{error}</div>}
        </div>
        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose} disabled={running}>Cancel</button>
          <button
            type="button"
            className="va-ops-role-action-btn intake-form-continue-btn"
            onClick={runSimulation}
            disabled={running}
          >
            <AppIcon name="rocket" size={15} strokeWidth={2} />
            {running ? "Running…" : "Run Simulation"}
          </button>
        </div>
      </div>
    </div>
  );
}
