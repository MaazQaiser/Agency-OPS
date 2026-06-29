import type { AppModule } from "@/lib/routes";

export type HubLocalPulseChip = {
  id: string;
  value: number | string;
  label: string;
  tone: "amber" | "red" | "blue" | "slate";
  filter?: { view: string; pulse: string };
};

export type HubLocalPulseConfig = {
  id: string;
  label: string;
  chips: HubLocalPulseChip[];
};

export const vaOwnerPulse: HubLocalPulseConfig = {
  id: "va-owner",
  label: "Owner Pulse",
  chips: [
    { id: "sla", value: 2, label: "SLA breaches", tone: "red" },
    { id: "tasks", value: 4, label: "tasks overdue", tone: "amber" },
    { id: "dnc", value: 1, label: "DNC flag", tone: "red" },
  ],
};

export const commercialPipelinePulse: HubLocalPulseConfig = {
  id: "commercial-pipeline",
  label: "Pipeline Pulse",
  chips: [
    { id: "urgent", value: 4, label: "urgent submissions", tone: "red" },
    { id: "docs", value: 5, label: "missing docs", tone: "amber" },
    { id: "quotes", value: 3, label: "quotes awaiting review", tone: "blue" },
  ],
};

export const sendCenterApprovalPulse: HubLocalPulseConfig = {
  id: "send-approval",
  label: "Approval Pulse",
  chips: [
    { id: "drafts", value: 2, label: "drafts pending review", tone: "amber" },
    { id: "client", value: 1, label: "client waiting", tone: "red" },
    { id: "sent", value: 3, label: "proposals sent today", tone: "blue" },
  ],
};

export const epayTrustPulse: HubLocalPulseConfig = {
  id: "epay-trust",
  label: "Trust Pulse",
  chips: [
    { id: "overdue", value: 3, label: "overdue invoices", tone: "red" },
    { id: "pending", value: 2, label: "payments pending", tone: "amber" },
  ],
};

export const intakeIntakePulse: HubLocalPulseConfig = {
  id: "intake",
  label: "Intake Pulse",
  chips: [
    { id: "new-today", value: 14, label: "new today", tone: "blue", filter: { view: "history", pulse: "new-today" } },
    { id: "failed", value: 3, label: "failed routes", tone: "red", filter: { view: "history", pulse: "failed" } },
    { id: "pending", value: 9, label: "pending review", tone: "amber", filter: { view: "history", pulse: "pending" } },
    { id: "duplicate", value: 1, label: "duplicate detected", tone: "amber", filter: { view: "history", pulse: "duplicate" } },
    { id: "missing-docs", value: 4, label: "missing docs", tone: "amber", filter: { view: "history", pulse: "missing-docs" } },
    { id: "high-risk", value: 2, label: "high risk", tone: "red", filter: { view: "selector", pulse: "high-risk" } },
    { id: "producer-blocked", value: 1, label: "producer blocked", tone: "red", filter: { view: "history", pulse: "producer-blocked" } },
  ],
};

export const carrierMarketPulse: HubLocalPulseConfig = {
  id: "carrier",
  label: "Market Pulse",
  chips: [
    { id: "slow", value: 2, label: "slow carrier responses", tone: "amber" },
    { id: "declined", value: 1, label: "recent decline", tone: "red" },
  ],
};

export const trainingPulse: HubLocalPulseConfig = {
  id: "training",
  label: "Training Pulse",
  chips: [
    { id: "overdue", value: 3, label: "overdue assignments", tone: "amber" },
    { id: "new", value: 1, label: "new resource", tone: "blue" },
  ],
};

export const analyticsPulse: HubLocalPulseConfig = {
  id: "analytics",
  label: "Insights Pulse",
  chips: [
    { id: "alerts", value: 2, label: "KPI alerts", tone: "amber" },
    { id: "reports", value: 1, label: "report ready", tone: "blue" },
  ],
};

const pulseByModule: Partial<Record<AppModule, HubLocalPulseConfig>> = {
  "va-operations": vaOwnerPulse,
  commercial: commercialPipelinePulse,
  "send-center": sendCenterApprovalPulse,
  "epay-policy": epayTrustPulse,
  "intake-forms": intakeIntakePulse,
  "carrier-library": carrierMarketPulse,
  "training-hub": trainingPulse,
  analytics: analyticsPulse,
};

export function getHubLocalPulse(module: AppModule | null): HubLocalPulseConfig | null {
  if (!module) return null;
  return pulseByModule[module] ?? null;
}
