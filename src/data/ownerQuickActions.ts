import { routes } from "@/lib/routes";

export type OwnerQuickActionModal = "assign-task" | "reassign-submission" | "override-priority";

export type OwnerQuickAction = {
  id: string;
  label: string;
  route?: string;
  modal?: OwnerQuickActionModal;
};

export type OwnerQuickActionSection = {
  id: string;
  title: string;
  actions: OwnerQuickAction[];
};

export type OwnerSummaryCard = {
  id: string;
  label: string;
  value: number;
  route?: string;
  special?: "open-notifications";
  variant: "default" | "urgent" | "warning";
};

export type OwnerRecentAction = {
  id: string;
  description: string;
  timestamp: string;
  timestampMs: number;
};

export const ownerSummaryCards: OwnerSummaryCard[] = [
  {
    id: "pending-approvals",
    label: "Pending Approvals",
    value: 5,
    route: `${routes.vaOperations}?view=approvals`,
    variant: "warning",
  },
  {
    id: "urgent-notifications",
    label: "Urgent Notifications",
    value: 4,
    special: "open-notifications",
    variant: "urgent",
  },
  {
    id: "overdue-payments",
    label: "Overdue Payments",
    value: 3,
    route: `${routes.epayPolicy}?view=tracker`,
    variant: "urgent",
  },
  {
    id: "stalled-submissions",
    label: "Stalled Submissions",
    value: 4,
    route: `${routes.commercialHub}?view=submissions`,
    variant: "warning",
  },
  {
    id: "training-due",
    label: "Training Due",
    value: 7,
    route: `${routes.trainingHub}?view=library`,
    variant: "default",
  },
];

export const ownerQuickActionSections: OwnerQuickActionSection[] = [
  {
    id: "team",
    title: "Team Actions",
    actions: [
      { id: "assign-task", label: "Assign Task", modal: "assign-task" },
      { id: "reassign-submission", label: "Reassign Submission", modal: "reassign-submission" },
      { id: "review-approvals", label: "Review Pending Approvals", route: `${routes.vaOperations}?view=approvals` },
      { id: "team-kpis", label: "View Team KPIs", route: routes.vaOperations },
      { id: "activity-feed", label: "Open Activity Feed", route: `${routes.vaOperations}?view=activity` },
      { id: "override-priority", label: "Override Priority", modal: "override-priority" },
    ],
  },
  {
    id: "commercial",
    title: "Commercial Actions",
    actions: [
      { id: "new-submission", label: "Create New Submission", route: routes.intakeForms },
      { id: "missing-docs", label: "Open Missing Docs Queue", route: `${routes.commercialHub}?view=missing-docs` },
      { id: "stalled", label: "View Stalled Submissions", route: `${routes.commercialHub}?view=submissions` },
      { id: "review-quotes", label: "Review Quotes", route: `${routes.commercialHub}?view=quote-review` },
      { id: "force-stage", label: "Force Move Stage", route: `${routes.commercialHub}?view=submissions` },
      { id: "assign-producer", label: "Assign Producer", route: `${routes.commercialHub}?view=submissions` },
    ],
  },
  {
    id: "send-center",
    title: "Send Center Actions",
    actions: [
      { id: "pending-drafts", label: "Review Pending Drafts", route: `${routes.sendCenter}?view=pending-review` },
      { id: "approve-proposal", label: "Approve Proposal", route: `${routes.sendCenter}?view=approved` },
      { id: "reject-proposal", label: "Reject Proposal", route: `${routes.sendCenter}?view=pending-review` },
      { id: "escalate-draft", label: "Escalate Draft", route: `${routes.sendCenter}?view=pending-review` },
      { id: "sent-proposals", label: "View Sent Proposals", route: `${routes.sendCenter}?view=sent` },
    ],
  },
  {
    id: "finance",
    title: "Finance Actions",
    actions: [
      { id: "create-invoice", label: "Create Invoice", route: routes.epayPolicy },
      { id: "failed-payments", label: "Review Failed Payments", route: `${routes.epayPolicy}?view=tracker` },
      { id: "reconcile-trust", label: "Reconcile Trust Account", route: `${routes.epayPolicy}?view=trust` },
      { id: "export-ledger", label: "Export Ledger", route: `${routes.epayPolicy}?view=trust` },
    ],
  },
  {
    id: "training",
    title: "Training Actions",
    actions: [
      { id: "upload-training", label: "Upload Training", route: `${routes.trainingHub}?view=library&ownerAction=upload` },
      { id: "assign-training", label: "Assign Training", route: `${routes.trainingHub}?view=library&ownerAction=assign` },
      { id: "expired-training", label: "View Expired Training", route: `${routes.trainingHub}?view=library` },
      { id: "manage-categories", label: "Manage Categories", route: `${routes.trainingHub}?view=library&ownerAction=categories` },
    ],
  },
  {
    id: "system",
    title: "System Actions",
    actions: [
      { id: "dnc-log", label: "View DNC Log", route: `${routes.vaOperations}?view=dnc-log` },
      { id: "clear-dnc", label: "Clear DNC Flag", route: `${routes.vaOperations}?view=dnc-log` },
      { id: "system-health", label: "Check System Health", route: routes.systemHealth },
      { id: "retry-sync", label: "Retry Sync", route: `${routes.vaOperations}?view=automations` },
      { id: "error-logs", label: "View Error Logs", route: `${routes.vaOperations}?view=activity` },
    ],
  },
];

export const ownerRecentActions: OwnerRecentAction[] = [
  {
    id: "ra-1",
    description: "Assigned Pedro to submission #2048",
    timestamp: "12m ago",
    timestampMs: Date.now() - 12 * 60 * 1000,
  },
  {
    id: "ra-2",
    description: "Approved Martinez proposal",
    timestamp: "1h ago",
    timestampMs: Date.now() - 60 * 60 * 1000,
  },
  {
    id: "ra-3",
    description: "Reconciled trust release",
    timestamp: "3h ago",
    timestampMs: Date.now() - 3 * 60 * 60 * 1000,
  },
  {
    id: "ra-4",
    description: "Cleared DNC flag",
    timestamp: "Yesterday",
    timestampMs: Date.now() - 24 * 60 * 60 * 1000,
  },
];

export const RECENT_ACTIONS_STORAGE_KEY = "agency-ops-owner-recent-actions";

export function loadRecentActions(): OwnerRecentAction[] {
  if (typeof window === "undefined") return ownerRecentActions;
  try {
    const raw = localStorage.getItem(RECENT_ACTIONS_STORAGE_KEY);
    if (!raw) return ownerRecentActions;
    const parsed = JSON.parse(raw) as OwnerRecentAction[];
    return parsed.length > 0 ? parsed : ownerRecentActions;
  } catch {
    return ownerRecentActions;
  }
}

export function prependRecentAction(description: string): OwnerRecentAction[] {
  const entry: OwnerRecentAction = {
    id: `ra-${Date.now()}`,
    description,
    timestamp: "Just now",
    timestampMs: Date.now(),
  };
  const existing = loadRecentActions().filter((a) => a.description !== description);
  const next = [entry, ...existing].slice(0, 8);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(RECENT_ACTIONS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }
  return next;
}
