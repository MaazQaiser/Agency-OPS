export const sendCenterTabs = [
  { id: "draft-queue", label: "Draft Queue" },
  { id: "pending-review", label: "Pending Licensed Review" },
  { id: "approved", label: "Approved Drafts" },
  { id: "sent", label: "Sent Proposals" },
  { id: "templates", label: "Templates" },
] as const;

export type SendCenterTabId = (typeof sendCenterTabs)[number]["id"];

export const sendCenterHeader = {
  title: "Send Center",
  subtitle: "Outbound communication · Tone selection · Compliance gate",
  quickActions: [
    { id: "use-template", label: "Use Template", icon: "file-text" as const, variant: "secondary" as const },
    { id: "new-draft", label: "New Draft", icon: "plus" as const, variant: "primary" as const },
  ],
};

export const sendCenterKpiCommands = [
  {
    id: "kpi-draft",
    label: "Draft Queue",
    value: "8",
    sub: "8 awaiting action",
    urgencyLabel: "3 high priority",
    urgencyTone: "amber" as const,
    tab: "draft-queue" as const,
    color: "yellow" as const,
  },
  {
    id: "kpi-pending",
    label: "Pending Review",
    value: "4",
    sub: "4 at risk",
    urgencyLabel: "1 SLA breach",
    urgencyTone: "red" as const,
    tab: "pending-review" as const,
    color: "red" as const,
  },
  {
    id: "kpi-approved",
    label: "Approved",
    value: "6",
    sub: "6 ready to send",
    urgencyLabel: "2 scheduled today",
    urgencyTone: "green" as const,
    tab: "approved" as const,
    color: "green" as const,
  },
  {
    id: "kpi-sent",
    label: "Sent This Week",
    value: "14",
    sub: "14 delivered",
    urgencyLabel: "68% opened",
    urgencyTone: "blue" as const,
    tab: "sent" as const,
    color: "primary" as const,
  },
] as const;

/** @deprecated Use sendCenterKpiCommands for operational KPI strip */
export const sendCenterKpis = sendCenterKpiCommands.map((k) => ({
  label: k.label,
  value: k.value,
  sub: k.sub,
  helper: k.urgencyLabel,
  color: k.color,
}));

export type SendPriority = "High" | "Medium" | "Low";

export type DraftQueueStatus = "Draft" | "In Progress" | "Ready for Review";

export type DraftQueueRecord = {
  id: string;
  proposalId: string;
  client: string;
  policyType: string;
  draftType: string;
  assignedProducer: string;
  createdAt: string;
  priority: SendPriority;
  status: DraftQueueStatus;
};

export type EscalationStatus = "On Track" | "Producer Alert" | "Owner Escalation";

export type PendingReviewRecord = {
  id: string;
  draftName: string;
  submittedBy: string;
  client: string;
  waitingMinutes: number;
  priority: SendPriority;
  escalationStatus: EscalationStatus;
  submittedAt: string;
};

export type ApprovedDraftRecord = {
  id: string;
  proposalId: string;
  client: string;
  approvedBy: string;
  date: string;
  proposalType: string;
  status: "Ready to Send" | "Scheduled" | "On Hold";
};

export type SentProposalRecord = {
  id: string;
  proposalId: string;
  client: string;
  sentDate: string;
  opened: boolean;
  viewed: boolean;
  accepted: boolean;
  expired: boolean;
  openCount: number;
  replied: boolean;
  daysSinceActivity: number;
};

export type CommLogEventType = "Sent" | "Viewed" | "Replied" | "Escalated" | "Follow-up";

export type CommunicationLogEntry = {
  id: string;
  type: CommLogEventType;
  client: string;
  subject: string;
  actor: string;
  timestamp: string;
  detail: string;
};

export type TemplateRecord = {
  id: string;
  name: string;
  type: string;
  lastUpdated: string;
  description: string;
  usageCount: number;
  conversionRate: number;
  lastUsed: string;
};

export const sendCenterFilterOptions = {
  priority: ["All Priorities", "High", "Medium", "Low"],
  producer: ["All Producers", "Eva", "Pedro", "Sarah"],
  policyType: ["All Policy Types", "BOP", "Workers Comp", "Commercial Auto", "GL Package", "Umbrella"],
  status: ["All Statuses", "Draft", "In Progress", "Ready for Review", "On Track", "Producer Alert", "Owner Escalation"],
};

export type SendCenterFilterState = {
  priority: string;
  producer: string;
  policyType: string;
  status: string;
};

export const defaultSendCenterFilters: SendCenterFilterState = {
  priority: sendCenterFilterOptions.priority[0],
  producer: sendCenterFilterOptions.producer[0],
  policyType: sendCenterFilterOptions.policyType[0],
  status: sendCenterFilterOptions.status[0],
};

export const draftQueueRecords: DraftQueueRecord[] = [
  { id: "dq-1", proposalId: "prop-martinez", client: "Martinez Landscaping", policyType: "BOP", draftType: "Multi-line Proposal", assignedProducer: "Eva", createdAt: "Jun 20, 2026 · 9:14 AM", priority: "High", status: "In Progress" },
  { id: "dq-2", proposalId: "prop-kim", client: "Kim Auto Shop", policyType: "Commercial Auto", draftType: "Quote Summary", assignedProducer: "Pedro", createdAt: "Jun 19, 2026 · 2:40 PM", priority: "Medium", status: "Draft" },
  { id: "dq-3", proposalId: "prop-greenline", client: "Greenline Logistics", policyType: "BOP Package", draftType: "Renewal Proposal", assignedProducer: "Eva", createdAt: "Jun 18, 2026 · 11:05 AM", priority: "High", status: "Ready for Review" },
  { id: "dq-4", proposalId: "prop-rivera", client: "Rivera Construction", policyType: "Workers Comp", draftType: "Bind Request", assignedProducer: "Sarah", createdAt: "Jun 17, 2026 · 4:22 PM", priority: "Low", status: "Draft" },
  { id: "dq-5", proposalId: "prop-atlas", client: "Atlas Roofing", policyType: "BOP", draftType: "Coverage Comparison", assignedProducer: "Pedro", createdAt: "Jun 16, 2026 · 10:30 AM", priority: "Medium", status: "In Progress" },
];

export const pendingReviewRecords: PendingReviewRecord[] = [
  { id: "pr-1", draftName: "Martinez BOP + WC Package", submittedBy: "JoJo", client: "Martinez Landscaping", waitingMinutes: 72, priority: "High", escalationStatus: "Owner Escalation", submittedAt: "Jun 21, 2026 · 8:00 AM" },
  { id: "pr-2", draftName: "Kim Auto Commercial Auto Quote", submittedBy: "Pedro", client: "Kim Auto Shop", waitingMinutes: 22, priority: "Medium", escalationStatus: "Producer Alert", submittedAt: "Jun 21, 2026 · 9:10 AM" },
  { id: "pr-3", draftName: "Greenline Logistics Renewal", submittedBy: "JoJo", client: "Greenline Logistics", waitingMinutes: 8, priority: "High", escalationStatus: "On Track", submittedAt: "Jun 21, 2026 · 9:24 AM" },
  { id: "pr-4", draftName: "Rivera WC Bind Draft", submittedBy: "Valerie", client: "Rivera Construction", waitingMinutes: 45, priority: "Low", escalationStatus: "Producer Alert", submittedAt: "Jun 21, 2026 · 8:47 AM" },
];

export const approvedDraftRecords: ApprovedDraftRecord[] = [
  { id: "ad-1", proposalId: "prop-martinez", client: "Martinez Landscaping", approvedBy: "Eva Chong", date: "Jun 20, 2026", proposalType: "BOP + Workers Comp", status: "Ready to Send" },
  { id: "ad-2", proposalId: "prop-atlas", client: "Atlas Roofing", approvedBy: "Eva Chong", date: "Jun 19, 2026", proposalType: "BOP Package", status: "Scheduled" },
  { id: "ad-3", proposalId: "prop-kim", client: "Kim Auto Shop", approvedBy: "Pedro", date: "Jun 18, 2026", proposalType: "Commercial Auto", status: "Ready to Send" },
  { id: "ad-4", proposalId: "prop-greenline", client: "Greenline Logistics", approvedBy: "Eva", date: "Jun 17, 2026", proposalType: "BOP Package", status: "On Hold" },
];

export const sentProposalRecords: SentProposalRecord[] = [
  { id: "sp-1", proposalId: "prop-martinez", client: "Martinez Landscaping", sentDate: "Jun 15, 2026", opened: true, viewed: true, accepted: false, expired: false, openCount: 4, replied: true, daysSinceActivity: 5 },
  { id: "sp-2", proposalId: "prop-greenline", client: "Greenline Logistics", sentDate: "Jun 12, 2026", opened: true, viewed: false, accepted: false, expired: false, openCount: 1, replied: false, daysSinceActivity: 9 },
  { id: "sp-3", proposalId: "prop-rivera", client: "Rivera Construction", sentDate: "Jun 8, 2026", opened: true, viewed: true, accepted: true, expired: false, openCount: 3, replied: true, daysSinceActivity: 11 },
  { id: "sp-4", proposalId: "prop-kim", client: "Kim Auto Shop", sentDate: "May 28, 2026", opened: false, viewed: false, accepted: false, expired: true, openCount: 0, replied: false, daysSinceActivity: 24 },
  { id: "sp-5", proposalId: "prop-atlas", client: "Atlas Roofing", sentDate: "Jun 18, 2026", opened: true, viewed: true, accepted: false, expired: false, openCount: 2, replied: false, daysSinceActivity: 3 },
];

export const communicationLogEntries: CommunicationLogEntry[] = [
  { id: "cl-1", type: "Sent", client: "Martinez Landscaping", subject: "BOP + WC Proposal", actor: "Eva Chong", timestamp: "Jun 15, 2026 · 10:22 AM", detail: "Proposal sent via email with payment link." },
  { id: "cl-2", type: "Viewed", client: "Martinez Landscaping", subject: "BOP + WC Proposal", actor: "Client", timestamp: "Jun 15, 2026 · 2:45 PM", detail: "Proposal opened — 4 min read time." },
  { id: "cl-3", type: "Replied", client: "Martinez Landscaping", subject: "BOP + WC Proposal", actor: "Client", timestamp: "Jun 16, 2026 · 9:10 AM", detail: "Client asked about broker fee breakdown." },
  { id: "cl-4", type: "Follow-up", client: "Greenline Logistics", subject: "Renewal Proposal", actor: "JoJo", timestamp: "Jun 17, 2026 · 11:00 AM", detail: "Follow-up call scheduled for overdue payment discussion." },
  { id: "cl-5", type: "Escalated", client: "Kim Auto Shop", subject: "Commercial Auto Quote", actor: "System", timestamp: "Jun 18, 2026 · 3:30 PM", detail: "Licensed review exceeded 60 min — owner notified." },
  { id: "cl-6", type: "Sent", client: "Rivera Construction", subject: "Workers Comp Bind", actor: "Sarah", timestamp: "Jun 8, 2026 · 1:15 PM", detail: "Bind proposal delivered to client portal." },
  { id: "cl-7", type: "Viewed", client: "Rivera Construction", subject: "Workers Comp Bind", actor: "Client", timestamp: "Jun 9, 2026 · 8:40 AM", detail: "Full proposal reviewed and accepted." },
];

export const templateRecords: TemplateRecord[] = [
  { id: "tpl-1", name: "Commercial BOP Proposal", type: "Multi-line", lastUpdated: "Jun 10, 2026", description: "Standard BOP proposal with coverage summary and carrier comparison.", usageCount: 42, conversionRate: 68, lastUsed: "Jun 20, 2026" },
  { id: "tpl-2", name: "Workers Comp Bind Package", type: "Bind Request", lastUpdated: "Jun 5, 2026", description: "WC bind template with payroll schedule and class codes.", usageCount: 28, conversionRate: 71, lastUsed: "Jun 18, 2026" },
  { id: "tpl-3", name: "Renewal Summary Letter", type: "Renewal", lastUpdated: "May 28, 2026", description: "Annual renewal recap with premium change breakdown.", usageCount: 35, conversionRate: 82, lastUsed: "Jun 19, 2026" },
  { id: "tpl-4", name: "Commercial Auto Quote", type: "Quote Summary", lastUpdated: "Jun 14, 2026", description: "Fleet auto quote with vehicle schedule attachment.", usageCount: 19, conversionRate: 54, lastUsed: "Jun 17, 2026" },
  { id: "tpl-5", name: "Restaurant Package Proposal", type: "Industry", lastUpdated: "Jun 1, 2026", description: "Restaurant-specific BOP + GL + liquor liability template.", usageCount: 15, conversionRate: 61, lastUsed: "Jun 15, 2026" },
  { id: "tpl-6", name: "Contractor Coverage Comparison", type: "Comparison", lastUpdated: "Jun 18, 2026", description: "Side-by-side market comparison for contractor risks.", usageCount: 22, conversionRate: 48, lastUsed: "Jun 16, 2026" },
];

export const sendPriorityClass: Record<SendPriority, string> = {
  High: "badge-rose",
  Medium: "badge-amber",
  Low: "badge-blue",
};

export const draftStatusClass: Record<DraftQueueStatus, string> = {
  Draft: "badge-violet",
  "In Progress": "badge-amber",
  "Ready for Review": "badge-green",
};

export const escalationStatusClass: Record<EscalationStatus, string> = {
  "On Track": "badge-green",
  "Producer Alert": "badge-amber",
  "Owner Escalation": "badge-rose",
};

export const approvedStatusClass: Record<ApprovedDraftRecord["status"], string> = {
  "Ready to Send": "badge-green",
  Scheduled: "badge-blue",
  "On Hold": "badge-amber",
};

export const commLogTypeClass: Record<CommLogEventType, string> = {
  Sent: "badge-blue",
  Viewed: "badge-green",
  Replied: "badge-amber",
  Escalated: "badge-rose",
  "Follow-up": "badge-amber",
};

export const SLA_PRODUCER_MINUTES = 15;
export const SLA_OWNER_MINUTES = 60;

export function computeEscalationStatus(waitingMinutes: number): EscalationStatus {
  if (waitingMinutes >= SLA_OWNER_MINUTES) return "Owner Escalation";
  if (waitingMinutes >= SLA_PRODUCER_MINUTES) return "Producer Alert";
  return "On Track";
}

export type SlaUrgencyTier = "blue" | "amber" | "orange" | "red";

export function getSlaUrgencyTier(waitingMinutes: number): SlaUrgencyTier {
  if (waitingMinutes >= 60) return "red";
  if (waitingMinutes >= 30) return "orange";
  if (waitingMinutes >= 15) return "amber";
  return "blue";
}

export function getEscalationRiskBadge(waitingMinutes: number): { label: string; className: string } {
  const tier = getSlaUrgencyTier(waitingMinutes);
  const map: Record<SlaUrgencyTier, { label: string; className: string }> = {
    blue: { label: "Low risk", className: "badge-blue" },
    amber: { label: "Moderate risk", className: "badge-amber" },
    orange: { label: "High risk", className: "badge-amber" },
    red: { label: "Escalation risk", className: "badge-rose" },
  };
  return map[tier];
}

export const sendCenterBulkActions = ["Assign producer", "Send", "Archive", "Escalate", "Export"] as const;

export function getDraftNextAction(status: DraftQueueStatus): string {
  if (status === "Draft") return "Complete draft";
  if (status === "In Progress") return "Continue editing";
  return "Submit for review";
}

export function getDraftRiskLevel(priority: SendPriority): string {
  return priority;
}

export function getApprovedComplianceBlock(row: ApprovedDraftRecord): string | null {
  if (row.status === "On Hold") {
    return "Broker fee and carrier bind confirmation required before send";
  }
  return null;
}

export const sendCenterAiInsights = {
  draftQueue: [
    {
      id: "dq-ai-1",
      title: "Missing documents",
      detail: "2 drafts are missing required attachments before licensed review.",
      why: "Licensed review will reject incomplete packages.",
      actionLabel: "Fix mismatch",
      actionId: "fix-mismatch",
    },
    {
      id: "dq-ai-2",
      title: "Missing broker fee",
      detail: "Kim Auto Shop draft has no broker fee line item configured.",
      why: "Compliance gate blocks send until fee is confirmed.",
      actionLabel: "Review draft",
      actionId: "review-draft",
    },
    {
      id: "dq-ai-3",
      title: "Incomplete carrier quote",
      detail: "Rivera Construction WC bind is missing AmTrust quote confirmation.",
      why: "Bind request cannot route without carrier confirmation.",
      actionLabel: "Escalate approval",
      actionId: "escalate",
    },
  ],
  pendingReview: [
    {
      id: "pr-ai-1",
      title: "Approval bottlenecks",
      detail: "Martinez BOP + WC has been waiting 72 min — owner escalation triggered.",
      why: "SLA breach risks client delay and revenue slip.",
      actionLabel: "Escalate approval",
      actionId: "escalate",
    },
    {
      id: "pr-ai-2",
      title: "SLA risks",
      detail: "2 drafts will breach producer alert threshold within 10 minutes.",
      why: "Early action prevents owner escalation.",
      actionLabel: "Follow up now",
      actionId: "follow-up",
    },
  ],
  sentProposals: [
    {
      id: "sp-ai-1",
      title: "High engagement detected",
      detail: "Martinez Landscaping opened 4 times and replied — prioritize follow-up today.",
      why: "Hot leads close fastest within 24 hours of reply.",
      actionLabel: "Follow up now",
      actionId: "follow-up",
    },
    {
      id: "sp-ai-2",
      title: "Best follow-up timing",
      detail: "Atlas Roofing viewed proposal twice — optimal window is 10–11 AM.",
      why: "Second views signal buying intent.",
      actionLabel: "Resend proposal",
      actionId: "resend",
    },
    {
      id: "sp-ai-3",
      title: "No activity for 24 days",
      detail: "Kim Auto Shop proposal expired with zero opens — consider resend or archive.",
      why: "Stale proposals clutter pipeline and hurt metrics.",
      actionLabel: "Archive inactive",
      actionId: "archive",
    },
  ],
  templates: [
    {
      id: "tpl-ai-1",
      title: "Best converting template",
      detail: "Renewal Summary Letter leads with 82% close rate across 35 sends.",
      why: "High performers should be default for renewals.",
      actionLabel: "Use template",
      actionId: "use-template",
    },
    {
      id: "tpl-ai-2",
      title: "Lowest response template",
      detail: "Contractor Coverage Comparison has 48% conversion — review messaging.",
      why: "Underperforming templates waste send capacity.",
      actionLabel: "Review template",
      actionId: "review-template",
    },
  ],
} as const;

export const templatePerformanceCards = [
  { id: "tp-1", label: "Most Used", value: "Commercial BOP Proposal", metric: "42 sends" },
  { id: "tp-2", label: "Highest Close Rate", value: "Renewal Summary Letter", metric: "82%" },
  { id: "tp-3", label: "Fastest Send Time", value: "Workers Comp Bind Package", metric: "Avg 8 min" },
  { id: "tp-4", label: "Best Renewal Template", value: "Renewal Summary Letter", metric: "35 renewals" },
] as const;

export function formatWaitingTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function matchesSendCenterSearch(haystack: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return haystack.toLowerCase().includes(q);
}

export function matchesSendCenterFilters(
  priority: SendPriority | string,
  producer: string,
  policyType: string,
  status: string,
  filters: SendCenterFilterState,
): boolean {
  if (filters.priority !== "All Priorities" && priority !== filters.priority) return false;
  if (filters.producer !== "All Producers" && producer !== filters.producer) return false;
  if (filters.policyType !== "All Policy Types" && policyType !== filters.policyType) return false;
  if (filters.status !== "All Statuses" && status !== filters.status) return false;
  return true;
}
