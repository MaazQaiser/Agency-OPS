export const vaOperationsRoles = [
  { id: "owner", label: "Owner" },
  { id: "dialer", label: "Dialer" },
  { id: "research", label: "Research" },
  { id: "brokerage", label: "Brokerage" },
  { id: "retention", label: "Retention" },
  { id: "sales", label: "Sales", private: true as const },
  { id: "automation", label: "Automation" },
] as const;

export type VaOperationsRoleId = (typeof vaOperationsRoles)[number]["id"];

export const vaOperationsTabs = [
  { id: "overview", label: "Overview" },
  { id: "tasks", label: "Tasks" },
  { id: "activity", label: "Activity" },
  { id: "approvals", label: "Approvals" },
  { id: "automations", label: "Automations" },
  { id: "dnc-log", label: "DNC Log" },
  { id: "bilingual-queue", label: "Bilingual Queue" },
] as const;

export type VaOperationsTabId = (typeof vaOperationsTabs)[number]["id"];

export const vaOperationsHeader = {
  title: "VA Operations",
  subtitle: "Team command center · All VA activity in one view",
  searchPlaceholder: "Search tasks, clients, VAs, notes, or leads",
  folioTracker: "12 days left in current folio",
};

export const vaOperationsKpis = [
  {
    label: "Active Team Members",
    value: "8",
    sub: "6 active · 2 away",
    helper: "Live team availability",
    color: "primary" as const,
  },
  {
    label: "Tasks Due Today",
    value: "24",
    sub: "8 overdue",
    helper: "Tasks requiring attention today",
    color: "yellow" as const,
  },
  {
    label: "Leads Waiting",
    value: "16",
    sub: "Average response: 3m 22s",
    helper: "Unworked leads in queue",
    color: "green" as const,
  },
  {
    label: "SLA Breaches",
    value: "4",
    sub: "Requires immediate action",
    helper: "Tasks past SLA threshold",
    color: "red" as const,
  },
  {
    label: "Pending Approvals",
    value: "9",
    sub: "Requires producer review",
    helper: "Drafts awaiting approval",
    color: "orange" as const,
  },
];

export type OperationalSnapshotKey =
  | "calls"
  | "docs"
  | "quotes"
  | "renewals"
  | "automation";

export type OperationalSnapshotItem = {
  key: OperationalSnapshotKey;
  label: string;
  value: string;
  sub: string;
};

export const operationalSnapshot: OperationalSnapshotItem[] = [
  { key: "calls", label: "Total calls today", value: "47", sub: "Across dialer team" },
  { key: "docs", label: "Docs collected", value: "18", sub: "Brokerage submissions" },
  { key: "quotes", label: "Quotes sent", value: "12", sub: "Commercial + Send Center" },
  { key: "renewals", label: "Renewals saved", value: "5", sub: "Retention wins today" },
  { key: "automation", label: "Automation triggers", value: "142", sub: "Workflows fired today" },
];

export type TeamMemberStatus = "active" | "away" | "offline";

export type VaRoleType =
  | "dialer"
  | "research"
  | "brokerage"
  | "retention"
  | "automation"
  | "sales"
  | "developer";

export type DialerStats = {
  callsMade: number;
  speedToLead: string;
  transfers: number;
  dncFlags: number;
};

export type ResearchStats = {
  leadsEnriched: number;
  recordsCompleted: number;
  missingData: number;
  queueLoad: number;
};

export type BrokerageStats = {
  submissionsWorked: number;
  docsCollected: number;
  marketsAdded: number;
  followUpsDue: number;
};

export type RetentionStats = {
  renewalsSaved: number;
  pifRetention: string;
  cancellationSaves: number;
  crossSells: number;
};

export type AutomationStats = {
  workflowsUpdated: number;
  triggersActive: number;
  failedRuns: number;
  integrationsHealthy: number;
};

export type TeamMemberStats =
  | DialerStats
  | ResearchStats
  | BrokerageStats
  | RetentionStats
  | AutomationStats;

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  roleType: VaRoleType;
  status: TeamMemberStatus;
  stats: TeamMemberStats;
  recentNotes: string[];
  recentActions: { text: string; time: string }[];
};

export const teamMembers: TeamMember[] = [
  {
    id: "kat",
    name: "Kat",
    role: "Dialer VA",
    roleType: "dialer",
    status: "active",
    stats: { callsMade: 18, speedToLead: "2m 11s", transfers: 3, dncFlags: 1 },
    recentNotes: ["Follow-up scheduled for Martinez Landscaping at 11:30 AM.", "Inbound lead from Ricochet — callback completed."],
    recentActions: [
      { text: "Called new inbound lead", time: "2 minutes ago" },
      { text: "Logged follow-up task", time: "18 minutes ago" },
    ],
  },
  {
    id: "jaffer",
    name: "Jaffer",
    role: "Research VA",
    roleType: "research",
    status: "active",
    stats: { leadsEnriched: 12, recordsCompleted: 4, missingData: 2, queueLoad: 8 },
    recentNotes: ["Added 4 commercial prospects from Meta campaign.", "Loss run request pending for Kim Auto Shop."],
    recentActions: [
      { text: "Added 4 new commercial prospects", time: "5 minutes ago" },
      { text: "Updated prospect research sheet", time: "22 minutes ago" },
    ],
  },
  {
    id: "jojo",
    name: "JoJo",
    role: "Brokerage Team",
    roleType: "brokerage",
    status: "active",
    stats: { submissionsWorked: 6, docsCollected: 4, marketsAdded: 2, followUpsDue: 3 },
    recentNotes: ["Carrier documents uploaded for Greenline Logistics.", "Renewal reminder draft awaiting approval."],
    recentActions: [
      { text: "Uploaded carrier documents", time: "11 minutes ago" },
      { text: "Submitted renewal reminder draft", time: "27 minutes ago" },
    ],
  },
  {
    id: "pedro",
    name: "Pedro",
    role: "Brokerage Team",
    roleType: "brokerage",
    status: "active",
    stats: { submissionsWorked: 8, docsCollected: 5, marketsAdded: 3, followUpsDue: 4 },
    recentNotes: ["BOP quote request submitted for Kim Auto Shop.", "Missing loss runs flagged for follow-up."],
    recentActions: [
      { text: "Submitted BOP quote request", time: "8 minutes ago" },
      { text: "Requested loss runs from client", time: "31 minutes ago" },
    ],
  },
  {
    id: "sara",
    name: "Sara",
    role: "Retention VA",
    roleType: "retention",
    status: "active",
    stats: { renewalsSaved: 5, pifRetention: "92%", cancellationSaves: 2, crossSells: 1 },
    recentNotes: ["Saved cancellation for Lopez Family Auto — payment plan offered.", "Renewal reminder sent for Kim Auto Shop."],
    recentActions: [
      { text: "Completed retention save call", time: "14 minutes ago" },
      { text: "Queued renewal follow-up", time: "35 minutes ago" },
    ],
  },
  {
    id: "kyle",
    name: "Kyle",
    role: "Automation Builder",
    roleType: "automation",
    status: "away",
    stats: { workflowsUpdated: 3, triggersActive: 12, failedRuns: 1, integrationsHealthy: 4 },
    recentNotes: ["Workflow update deployed for lead routing.", "Testing Ricochet webhook integration."],
    recentActions: [
      { text: "Updated automation workflow", time: "18 minutes ago" },
      { text: "Fixed webhook retry logic", time: "45 minutes ago" },
    ],
  },
  {
    id: "hassan",
    name: "Hassan",
    role: "Developer",
    roleType: "developer",
    status: "away",
    stats: { workflowsUpdated: 2, triggersActive: 0, failedRuns: 0, integrationsHealthy: 3 },
    recentNotes: ["API endpoint for lead sync in progress.", "Bug fix deployed for document upload."],
    recentActions: [
      { text: "Pushed lead sync API update", time: "1 hour ago" },
      { text: "Resolved upload timeout issue", time: "2 hours ago" },
    ],
  },
];

export type PriorityTaskStatus = "urgent" | "pending" | "critical";

export type TaskPriorityLevel = "low" | "medium" | "high" | "critical";

export type DueDateRisk = "on-track" | "due-soon" | "at-risk" | "overdue";

export type TaskBlockerState =
  | "clear"
  | "awaiting-client"
  | "awaiting-carrier"
  | "awaiting-docs"
  | "awaiting-approval"
  | "internal-handoff";

export type PriorityType =
  | "lead-callback"
  | "missing-docs"
  | "quote-follow-up"
  | "producer-approval"
  | "retention-save";

export type TaskSource = "commercial" | "intake" | "send-center" | "retention";

export type PriorityTask = {
  id: string;
  title: string;
  assignedTo: string;
  assignedBy: string;
  due: string;
  dueDateRisk: DueDateRisk;
  priority: TaskPriorityLevel;
  priorityType: PriorityType;
  source: TaskSource;
  roleType: VaRoleType;
  status: PriorityTaskStatus;
  blocker: TaskBlockerState;
};

export function getTaskCta(priorityType: PriorityType): string {
  switch (priorityType) {
    case "lead-callback":
      return "Call Client";
    case "producer-approval":
      return "Review Draft";
    case "retention-save":
      return "Open Case";
    default:
      return "Open Task";
  }
}

export const priorityQueue: PriorityTask[] = [
  {
    id: "task-1",
    title: "Follow up with Martinez Landscaping",
    assignedTo: "JoJo",
    assignedBy: "Eva",
    due: "11:30 AM",
    dueDateRisk: "at-risk",
    priority: "high",
    priorityType: "quote-follow-up",
    source: "commercial",
    roleType: "brokerage",
    status: "urgent",
    blocker: "awaiting-client",
  },
  {
    id: "task-2",
    title: "Collect missing loss runs",
    assignedTo: "Pedro",
    assignedBy: "JoJo",
    due: "2:00 PM",
    dueDateRisk: "on-track",
    priority: "medium",
    priorityType: "missing-docs",
    source: "intake",
    roleType: "brokerage",
    status: "pending",
    blocker: "awaiting-docs",
  },
  {
    id: "task-3",
    title: "Return inbound lead callback",
    assignedTo: "Kat",
    assignedBy: "Ricochet",
    due: "In 10 minutes",
    dueDateRisk: "due-soon",
    priority: "critical",
    priorityType: "lead-callback",
    source: "intake",
    roleType: "dialer",
    status: "critical",
    blocker: "clear",
  },
  {
    id: "task-4",
    title: "Producer approval — BOP quote draft",
    assignedTo: "Pedro",
    assignedBy: "Sarah",
    due: "3:00 PM",
    dueDateRisk: "on-track",
    priority: "high",
    priorityType: "producer-approval",
    source: "send-center",
    roleType: "brokerage",
    status: "urgent",
    blocker: "awaiting-approval",
  },
  {
    id: "task-5",
    title: "Retention save — Lopez Family Auto",
    assignedTo: "Sara",
    assignedBy: "Eva",
    due: "4:30 PM",
    dueDateRisk: "at-risk",
    priority: "critical",
    priorityType: "retention-save",
    source: "retention",
    roleType: "retention",
    status: "critical",
    blocker: "awaiting-client",
  },
  {
    id: "task-6",
    title: "Carrier follow-up — Greenline GL quote",
    assignedTo: "Pedro",
    assignedBy: "Jaffer",
    due: "Yesterday 5:00 PM",
    dueDateRisk: "overdue",
    priority: "high",
    priorityType: "quote-follow-up",
    source: "commercial",
    roleType: "brokerage",
    status: "urgent",
    blocker: "awaiting-carrier",
  },
  {
    id: "task-7",
    title: "Handoff bilingual intake — Kim Auto Shop",
    assignedTo: "Kat",
    assignedBy: "Pedro",
    due: "1:15 PM",
    dueDateRisk: "due-soon",
    priority: "medium",
    priorityType: "lead-callback",
    source: "intake",
    roleType: "dialer",
    status: "pending",
    blocker: "internal-handoff",
  },
];

export type ActivityCategory = "calls" | "commercial" | "approvals" | "retention";

export type ActivityEventType = "call" | "upload" | "sla-miss" | "send" | "add" | "complete";

export type ActivityItem = {
  id: string;
  text: string;
  summary: string;
  actor: string;
  eventType: ActivityEventType;
  source: string;
  time: string;
  category: ActivityCategory;
  roleType: VaRoleType;
};

export const liveActivity: ActivityItem[] = [
  {
    id: "act-1",
    text: "Kat called new inbound lead",
    summary: "Called lead",
    actor: "Kat",
    eventType: "call",
    source: "Ricochet",
    time: "2 minutes ago",
    category: "calls",
    roleType: "dialer",
  },
  {
    id: "act-2",
    text: "Jaffer added 4 new commercial prospects",
    summary: "Added prospects",
    actor: "Jaffer",
    eventType: "add",
    source: "Commercial",
    time: "5 minutes ago",
    category: "commercial",
    roleType: "research",
  },
  {
    id: "act-3",
    text: "Pedro submitted BOP quote request",
    summary: "Uploaded quote",
    actor: "Pedro",
    eventType: "upload",
    source: "Commercial Hub",
    time: "8 minutes ago",
    category: "commercial",
    roleType: "brokerage",
  },
  {
    id: "act-4",
    text: "JoJo uploaded carrier documents",
    summary: "Uploaded documents",
    actor: "JoJo",
    eventType: "upload",
    source: "Intake",
    time: "11 minutes ago",
    category: "commercial",
    roleType: "brokerage",
  },
  {
    id: "act-5",
    text: "Sara completed retention save call",
    summary: "Completed save call",
    actor: "Sara",
    eventType: "complete",
    source: "Retention",
    time: "14 minutes ago",
    category: "retention",
    roleType: "retention",
  },
  {
    id: "act-6",
    text: "Pedro submitted quote draft for producer approval",
    summary: "Sent proposal",
    actor: "Pedro",
    eventType: "send",
    source: "Send Center",
    time: "16 minutes ago",
    category: "approvals",
    roleType: "brokerage",
  },
  {
    id: "act-7",
    text: "JoJo missed 5-min SLA on Meta commercial lead",
    summary: "Missed SLA",
    actor: "JoJo",
    eventType: "sla-miss",
    source: "Meta Leads",
    time: "18 minutes ago",
    category: "commercial",
    roleType: "brokerage",
  },
  {
    id: "act-8",
    text: "Kyle updated automation workflow",
    summary: "Updated workflow",
    actor: "Kyle",
    eventType: "add",
    source: "Automation",
    time: "22 minutes ago",
    category: "commercial",
    roleType: "automation",
  },
];

export type SlaStatus = "within" | "near" | "breached";

export type LeadResponseRow = {
  id: string;
  name: string;
  source: string;
  responseTime: string;
  status: SlaStatus;
  roleType: VaRoleType;
};

export const leadResponseTracker: LeadResponseRow[] = [
  { id: "lead-1", name: "Kat", source: "Ricochet", responseTime: "2m 11s", status: "within", roleType: "dialer" },
  { id: "lead-2", name: "Jaffer", source: "Meta Leads", responseTime: "4m 48s", status: "near", roleType: "research" },
  { id: "lead-3", name: "JoJo", source: "Referral", responseTime: "7m 02s", status: "breached", roleType: "brokerage" },
];

export type SlaRiskLevel = "on-track" | "at-risk" | "critical";

export type WorkloadRow = {
  id: string;
  name: string;
  role: string;
  roleType: VaRoleType;
  openTasks: number;
  completedToday: number;
  overdueCount: number;
  slaRisk: SlaRiskLevel;
  pendingApprovals: number;
};

export const workloadDistribution: WorkloadRow[] = [
  { id: "wl-kat", name: "Kat", role: "Dialer", roleType: "dialer", openTasks: 8, completedToday: 5, overdueCount: 2, slaRisk: "at-risk", pendingApprovals: 0 },
  { id: "wl-jaffer", name: "Jaffer", role: "Research", roleType: "research", openTasks: 6, completedToday: 4, overdueCount: 0, slaRisk: "on-track", pendingApprovals: 1 },
  { id: "wl-pedro", name: "Pedro", role: "Brokerage", roleType: "brokerage", openTasks: 12, completedToday: 8, overdueCount: 3, slaRisk: "at-risk", pendingApprovals: 2 },
  { id: "wl-jojo", name: "JoJo", role: "Brokerage", roleType: "brokerage", openTasks: 9, completedToday: 6, overdueCount: 1, slaRisk: "on-track", pendingApprovals: 1 },
  { id: "wl-sara", name: "Sara", role: "Retention", roleType: "retention", openTasks: 5, completedToday: 3, overdueCount: 0, slaRisk: "on-track", pendingApprovals: 0 },
];

export type ApprovalType = "quote" | "proposal" | "renewal" | "exception-request";

export type ApprovalHub = "commercial" | "send-center" | "retention";

export type ApprovalPriority = "low" | "medium" | "high" | "critical";

export type ApprovalLifecycleStage = "draft" | "review" | "approved" | "sent";

export type ApprovalDraft = {
  id: string;
  title: string;
  preparedBy: string;
  client: string;
  submitted: string;
  approvalType: ApprovalType;
  hub: ApprovalHub;
  roleType: VaRoleType;
  priority: ApprovalPriority;
  lifecycleStage: ApprovalLifecycleStage;
  cta: string;
};

export const approvalLifecycleLabels: Record<ApprovalLifecycleStage, string> = {
  draft: "Draft",
  review: "Review",
  approved: "Approved",
  sent: "Sent",
};

export const approvalQueue: ApprovalDraft[] = [
  {
    id: "draft-1",
    title: "Commercial Quote Follow-up",
    preparedBy: "Pedro",
    client: "Kim Auto Shop",
    submitted: "15 min ago",
    approvalType: "quote",
    hub: "commercial",
    roleType: "brokerage",
    priority: "high",
    lifecycleStage: "review",
    cta: "Approve Draft",
  },
  {
    id: "draft-2",
    title: "Policy Renewal Reminder",
    preparedBy: "JoJo",
    client: "Greenline Logistics",
    submitted: "27 min ago",
    approvalType: "renewal",
    hub: "retention",
    roleType: "brokerage",
    priority: "medium",
    lifecycleStage: "draft",
    cta: "Review Draft",
  },
  {
    id: "draft-3",
    title: "BOP Proposal — Send Center",
    preparedBy: "Pedro",
    client: "Martinez Landscaping",
    submitted: "32 min ago",
    approvalType: "proposal",
    hub: "send-center",
    roleType: "brokerage",
    priority: "high",
    lifecycleStage: "review",
    cta: "Review Draft",
  },
  {
    id: "draft-4",
    title: "Rate Exception Request",
    preparedBy: "Sara",
    client: "Lopez Family Auto",
    submitted: "45 min ago",
    approvalType: "exception-request",
    hub: "retention",
    roleType: "retention",
    priority: "critical",
    lifecycleStage: "draft",
    cta: "Review Request",
  },
];

export type OwnerIntelligenceStat = {
  id: string;
  value: number;
  label: string;
  tone: "amber" | "red";
};

export const ownerIntelligenceStats: OwnerIntelligenceStat[] = [
  { id: "approvals", value: 3, label: "approvals overdue", tone: "amber" },
  { id: "sla", value: 2, label: "SLA breaches", tone: "red" },
  { id: "policy", value: 1, label: "policy at risk", tone: "red" },
];

const roleToMemberTypes: Record<VaOperationsRoleId, VaRoleType[] | "all"> = {
  owner: "all",
  dialer: ["dialer"],
  research: ["research"],
  brokerage: ["brokerage"],
  retention: ["retention"],
  sales: ["brokerage"],
  automation: ["automation", "developer"],
};

export function roleMatchesMemberType(role: VaOperationsRoleId, roleType: VaRoleType): boolean {
  const mapping = roleToMemberTypes[role];
  if (mapping === "all") return true;
  return mapping.includes(roleType);
}

export function filterByRole<T extends { roleType: VaRoleType }>(
  items: T[],
  role: VaOperationsRoleId,
): T[] {
  if (role === "owner") return items;
  return items.filter((item) => roleMatchesMemberType(role, item.roleType));
}

export const priorityTypeLabels: Record<PriorityType, string> = {
  "lead-callback": "Lead callback",
  "missing-docs": "Missing docs",
  "quote-follow-up": "Quote follow-up",
  "producer-approval": "Producer approval",
  "retention-save": "Retention save",
};

export const taskSourceLabels: Record<TaskSource, string> = {
  commercial: "Commercial",
  intake: "Intake",
  "send-center": "Send Center",
  retention: "Retention",
};

export const approvalTypeLabels: Record<ApprovalType, string> = {
  quote: "Quote",
  proposal: "Proposal",
  renewal: "Renewal",
  "exception-request": "Exception request",
};

export const approvalPriorityLabels: Record<ApprovalPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const taskPriorityLabels: Record<TaskPriorityLevel, string> = approvalPriorityLabels;

export const dueDateRiskLabels: Record<DueDateRisk, string> = {
  "on-track": "On Track",
  "due-soon": "Due Soon",
  "at-risk": "At Risk",
  overdue: "Overdue",
};

export const taskBlockerLabels: Record<TaskBlockerState, string> = {
  clear: "Clear",
  "awaiting-client": "Awaiting Client",
  "awaiting-carrier": "Awaiting Carrier",
  "awaiting-docs": "Awaiting Docs",
  "awaiting-approval": "Awaiting Approval",
  "internal-handoff": "Internal Handoff",
};

export function filterOperationalSnapshot(role: VaOperationsRoleId): OperationalSnapshotItem[] {
  if (role === "owner") return operationalSnapshot;
  if (role === "dialer") return operationalSnapshot.filter((item) => item.key === "calls");
  if (role === "research") return operationalSnapshot.filter((item) => item.key === "quotes");
  if (role === "brokerage" || role === "sales") {
    return operationalSnapshot.filter((item) => item.key === "docs" || item.key === "quotes");
  }
  if (role === "retention") return operationalSnapshot.filter((item) => item.key === "renewals");
  if (role === "automation") return operationalSnapshot.filter((item) => item.key === "automation");
  return operationalSnapshot;
}

export const approvalHubLabels: Record<ApprovalHub, string> = {
  commercial: "Commercial",
  "send-center": "Send Center",
  retention: "Retention",
};

export const slaRiskLabels: Record<SlaRiskLevel, string> = {
  "on-track": "On Track",
  "at-risk": "At Risk",
  critical: "Critical",
};

export type TeamMemberStatEntry = { label: string; value: string | number };

export function getTeamMemberStatEntries(member: TeamMember): TeamMemberStatEntry[] {
  switch (member.roleType) {
    case "dialer": {
      const s = member.stats as DialerStats;
      return [
        { label: "Calls made", value: s.callsMade },
        { label: "Speed to lead", value: s.speedToLead },
        { label: "Transfers", value: s.transfers },
        { label: "DNC flags", value: s.dncFlags },
      ];
    }
    case "research": {
      const s = member.stats as ResearchStats;
      return [
        { label: "Leads enriched", value: s.leadsEnriched },
        { label: "Records completed", value: s.recordsCompleted },
        { label: "Missing data", value: s.missingData },
        { label: "Queue load", value: s.queueLoad },
      ];
    }
    case "brokerage": {
      const s = member.stats as BrokerageStats;
      return [
        { label: "Submissions worked", value: s.submissionsWorked },
        { label: "Docs collected", value: s.docsCollected },
        { label: "Markets added", value: s.marketsAdded },
        { label: "Follow-ups due", value: s.followUpsDue },
      ];
    }
    case "retention": {
      const s = member.stats as RetentionStats;
      return [
        { label: "Renewals saved", value: s.renewalsSaved },
        { label: "PIF retention", value: s.pifRetention },
        { label: "Cancellation saves", value: s.cancellationSaves },
        { label: "Cross-sells", value: s.crossSells },
      ];
    }
    default: {
      const s = member.stats as AutomationStats;
      return [
        { label: "Workflows updated", value: s.workflowsUpdated },
        { label: "Triggers active", value: s.triggersActive },
        { label: "Failed runs", value: s.failedRuns },
        { label: "Integrations healthy", value: s.integrationsHealthy },
      ];
    }
  }
}

export type PlaceholderTabId = "brokerage" | "retention";

export const tabPlaceholders: Record<PlaceholderTabId, { title: string; description: string }> = {
  brokerage: {
    title: "Brokerage Team",
    description: "JoJo and Pedro's brokerage workspace — quotes, documents, and client follow-ups.",
  },
  retention: {
    title: "Retention VA",
    description: "Sara's retention workspace — renewals, cancellation saves, and cross-sell follow-ups.",
  },
};
