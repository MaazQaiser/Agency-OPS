export const automationBuilderHeader = {
  title: "Automation Builder",
  subtitle: "Manage operational workflows, triggers, and system automations.",
  quickActions: [
    { id: "create-workflow", label: "Create Workflow", icon: "plus" as const },
    { id: "add-trigger", label: "Add Trigger", icon: "target" as const },
    { id: "view-logs", label: "View Logs", icon: "clipboard" as const },
    { id: "run-test", label: "Run Test", icon: "rocket" as const },
  ],
};

export const automationKpis = [
  {
    label: "Active Workflows",
    value: "18",
    sub: "14 live / 4 paused",
    helper: "Current automations running",
    color: "primary" as const,
  },
  {
    label: "Executions Today",
    value: "324",
    sub: "92% success rate",
    helper: "Workflow activity volume",
    color: "green" as const,
  },
  {
    label: "Failed Runs",
    value: "7",
    sub: "Needs review",
    helper: "Workflow errors detected",
    color: "red" as const,
  },
  {
    label: "Pending Optimizations",
    value: "5",
    sub: "Manual review required",
    helper: "Workflow improvement queue",
    color: "yellow" as const,
  },
];

export type WorkflowStatus = "active" | "paused";

export type AutomationWorkflow = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: WorkflowStatus;
  statusLabel: string;
  runsToday: number;
  cta: string;
  conditions: string[];
  actions: string[];
  dependencies: string[];
  connectedTools: string[];
  lastExecution: string;
  failureLogs: { error: string; time: string }[];
};

export const activeWorkflows: AutomationWorkflow[] = [
  {
    id: "wf-lead-assignment",
    name: "New Lead Assignment",
    trigger: "New lead enters system",
    action: "Assign to Dialer VA",
    status: "active",
    statusLabel: "Active",
    runsToday: 48,
    cta: "Open Workflow",
    conditions: ["Lead source is valid", "Lead has contact info"],
    actions: ["Route to available Dialer VA", "Create follow-up task", "Log assignment in AgencyZoom"],
    dependencies: ["AgencyZoom API", "VA availability table"],
    connectedTools: ["AgencyZoom", "Google Sheets", "Slack"],
    lastExecution: "2 minutes ago: success",
    failureLogs: [],
  },
  {
    id: "wf-missed-lead",
    name: "Missed Lead Alert",
    trigger: "No response after 5 mins",
    action: "Notify Owner",
    status: "active",
    statusLabel: "Active",
    runsToday: 14,
    cta: "View Rules",
    conditions: ["Lead unworked > 5 minutes", "Priority is high or critical"],
    actions: ["Send Slack alert to #ops-alerts", "Flag lead in dashboard", "Ping assigned Dialer VA"],
    dependencies: ["Slack webhook", "Lead queue timer"],
    connectedTools: ["Slack", "AgencyZoom"],
    lastExecution: "8 minutes ago: success",
    failureLogs: [],
  },
  {
    id: "wf-doc-reminder",
    name: "Document Reminder",
    trigger: "Missing docs after 24 hours",
    action: "Send reminder",
    status: "paused",
    statusLabel: "Paused",
    runsToday: 0,
    cta: "Resume",
    conditions: ["Submission status is pending docs", "24h elapsed since request"],
    actions: ["Email broker team", "Create callback task", "Update Monday board"],
    dependencies: ["Monday.com API", "Email service"],
    connectedTools: ["Monday", "Google Sheets", "Make.com"],
    lastExecution: "Paused: last run 2 days ago",
    failureLogs: [{ error: "Monday API rate limit", time: "2 days ago" }],
  },
];

export type TriggerActivityItem = {
  id: string;
  trigger: string;
  status: "success" | "failed" | "running";
  time: string;
};

export const liveTriggerActivity: TriggerActivityItem[] = [
  { id: "ta-1", trigger: "New Lead Assignment triggered", status: "success", time: "2 mins ago" },
  { id: "ta-2", trigger: "Missed Callback Alert triggered", status: "success", time: "8 mins ago" },
  { id: "ta-3", trigger: "Document Reminder triggered", status: "running", time: "14 mins ago" },
  { id: "ta-4", trigger: "Carrier Follow-Up Workflow triggered", status: "success", time: "21 mins ago" },
];

export type WorkflowLogicStep = {
  id: string;
  label: string;
  type: "trigger" | "condition" | "action" | "outcome";
  description: string;
  details: string[];
};

export const featuredWorkflowLogic: WorkflowLogicStep[] = [
  {
    id: "s1",
    label: "Lead created",
    type: "trigger",
    description: "Fires when a new lead record is created in Ricochet or intake forms.",
    details: ["Source: Ricochet webhook", "De-dupe window: 5 minutes", "Runs on: all inbound leads"],
  },
  {
    id: "s2",
    label: "If commercial lead",
    type: "condition",
    description: "Routes leads based on line of business and campaign source.",
    details: ["LOB equals Commercial", "OR campaign tag contains BOP", "Fallback: personal lines queue"],
  },
  {
    id: "s3",
    label: "Assign Research VA",
    type: "action",
    description: "Assigns the lead to the next available Research VA with capacity.",
    details: ["Round-robin pool: Jaffer", "Max queue load: 10", "Notify via Slack #research"],
  },
  {
    id: "s4",
    label: "Notify Dialer",
    type: "outcome",
    description: "Alerts the dialer team when research handoff is complete or SLA is near breach.",
    details: ["Slack channel: #dialer-ops", "SMS fallback: enabled", "Log outcome to activity feed"],
  },
];

export type FailedExecution = {
  id: string;
  workflow: string;
  error: string;
  time: string;
  cta: string;
};

export const failedExecutions: FailedExecution[] = [
  {
    id: "fe-1",
    workflow: "Lead Assignment",
    error: "Missing lead owner",
    time: "11:24 AM",
    cta: "Debug",
  },
  {
    id: "fe-2",
    workflow: "Slack Notification",
    error: "Webhook timeout",
    time: "10:42 AM",
    cta: "Retry",
  },
];

export type IntegrationStatus = "connected" | "degraded" | "disconnected";

export type Integration = {
  id: string;
  name: string;
  status: IntegrationStatus;
  statusLabel: string;
  lastSync: string;
};

export const connectedSystems: Integration[] = [
  { id: "int-az", name: "AgencyZoom", status: "connected", statusLabel: "Connected", lastSync: "2 min ago" },
  { id: "int-slack", name: "Slack", status: "connected", statusLabel: "Connected", lastSync: "5 min ago" },
  { id: "int-sheets", name: "Google Sheets", status: "connected", statusLabel: "Connected", lastSync: "1 min ago" },
  { id: "int-monday", name: "Monday", status: "connected", statusLabel: "Connected", lastSync: "8 min ago" },
  { id: "int-make", name: "Make.com", status: "connected", statusLabel: "Connected", lastSync: "3 min ago" },
];

export type OptimizationItem = {
  id: string;
  workflow: string;
  suggestion: string;
  impact: string;
  cta: string;
};

export const optimizationQueue: OptimizationItem[] = [
  {
    id: "opt-1",
    workflow: "Missed Lead Alert",
    suggestion: "Reduce trigger wait from 5m to 3m",
    impact: "Higher response rate",
    cta: "Review",
  },
  {
    id: "opt-2",
    workflow: "Document Reminder",
    suggestion: "Add second follow-up after 48h",
    impact: "Reduce stalled submissions",
    cta: "Apply",
  },
];

export type ExecutionLogVariant = "success" | "failed" | "sent" | "triggered";

export type ExecutionLogItem = {
  id: string;
  text: string;
  time: string;
  variant: ExecutionLogVariant;
};

export const executionHistory: ExecutionLogItem[] = [
  { id: "el-1", text: "New Lead Assignment completed", time: "2 min ago", variant: "success" },
  { id: "el-2", text: "Slack Notification failed", time: "7 min ago", variant: "failed" },
  { id: "el-3", text: "Follow-up Reminder sent", time: "15 min ago", variant: "sent" },
  { id: "el-4", text: "Carrier Update workflow triggered", time: "28 min ago", variant: "triggered" },
];

export const featuredWorkflowId = "wf-lead-assignment";

export const workflowTriggerTypes = [
  "New lead enters system",
  "No response after 5 mins",
  "Missing docs after 24 hours",
  "Quote sent to client",
  "Policy expiring in 30 days",
] as const;

export const workflowConditions = [
  "Lead source is valid",
  "Lead has contact info",
  "Priority is high or critical",
  "Submission status is pending docs",
  "Commercial line of business",
] as const;

export const workflowActionTypes = [
  "Assign to Dialer VA",
  "Assign to Research VA",
  "Send reminder",
  "Notify Owner",
  "Create follow-up task",
] as const;

export const workflowAssignToOptions = [
  "Dialer VA",
  "Research VA",
  "Brokerage Team",
  "Retention VA",
  "Owner",
] as const;

export const triggerSourceOptions = [
  "Lead Created",
  "Quote Sent",
  "Policy Expiring",
  "Missing Docs",
  "Follow-Up Due",
] as const;

export type CreateWorkflowPayload = {
  name: string;
  triggerType: string;
  condition: string;
  actionType: string;
  assignTo: string;
};

export type AddTriggerPayload = {
  name: string;
  source: string;
  delayTime: string;
  condition: string;
  enabled: boolean;
};

export type RunTestPayload = {
  workflowId: string;
  mockPayload: string;
};

export type ExecutionLogDetail = {
  id: string;
  workflowName: string;
  status: "success" | "failed";
  executedAt: string;
  duration: string;
  result: string;
  errors?: string;
};

export function buildExecutionLogDetails(
  history: ExecutionLogItem[],
  failed: FailedExecution[],
): ExecutionLogDetail[] {
  const fromHistory: ExecutionLogDetail[] = history.map((item) => ({
    id: item.id,
    workflowName: item.text.replace(/ completed| failed| sent| triggered/gi, ""),
    status: item.variant === "failed" ? "failed" : "success",
    executedAt: item.time,
    duration: item.variant === "failed" ? "1.2s" : "0.8s",
    result: item.text,
    errors: item.variant === "failed" ? "Execution returned non-200 response" : undefined,
  }));

  const fromFailed: ExecutionLogDetail[] = failed.map((item) => ({
    id: item.id,
    workflowName: item.workflow,
    status: "failed" as const,
    executedAt: item.time,
    duration: "2.4s",
    result: "Workflow execution failed",
    errors: item.error,
  }));

  return [...fromHistory, ...fromFailed];
}
