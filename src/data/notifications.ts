import type { AppIconName } from "@/components/ui/AppIcon";
import { currentFolioPeriod } from "@/lib/folioProgress";
import { routes } from "@/lib/routes";

export type NotificationType = "danger" | "warning" | "success" | "info" | "draft";

/** @deprecated Legacy module grouping: prefer `type` for filters and styling */
export type NotificationCategory = "urgent" | "approvals" | "payments" | "training" | "system";

export type NotificationFilterTab = "all" | NotificationType;

export type NotificationPriority = "critical" | "high" | "medium" | "low";

export type NotificationStatus = "unread" | "read" | "snoozed" | "dismissed" | "resolved";

export type ResolutionState = "open" | "in_progress" | "resolved" | "escalated" | "dismissed";

export type NotificationKind =
  | "approval"
  | "payment"
  | "missing_docs"
  | "risk"
  | "bind_blocked"
  | "folio"
  | "client_reply"
  | "producer_review"
  | "general";

export type NotificationTimeGroup = "now" | "today" | "earlier-today" | "yesterday" | "older";

export type SnoozeOption = "1h" | "tomorrow" | "next-folio";

export type NotificationAction = {
  id: string;
  label: string;
};

export type AppNotification = {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  kind: NotificationKind;
  priority: NotificationPriority;
  status: NotificationStatus;
  resolutionState: ResolutionState;
  pinned?: boolean;
  title: string;
  description: string;
  timestamp: string;
  timestampMs: number;
  module: string;
  moduleRoute: string;
  icon: AppIconName;
  relatedUserId?: string;
  relatedUserName?: string;
  metadata?: Record<string, string>;
  actions: NotificationAction[];
  snoozedUntil?: number;
};

export const notificationTypeLabels: Record<NotificationType, string> = {
  danger: "Danger",
  warning: "Warning",
  success: "Success",
  info: "Info",
  draft: "Draft",
};

export const notificationFilterTabs: { id: NotificationFilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "danger", label: "Danger" },
  { id: "warning", label: "Warnings" },
  { id: "success", label: "Success" },
  { id: "info", label: "Info" },
  { id: "draft", label: "Draft" },
];

/** @deprecated Use notificationTypeLabels */
export const notificationCategoryLabels: Record<NotificationCategory, string> = {
  urgent: "Urgent",
  approvals: "Approvals",
  payments: "Payments",
  training: "Training",
  system: "System",
};

export const typeBadgeClass: Record<NotificationType, string> = {
  danger: "badge-red",
  warning: "badge-amber",
  success: "badge-green",
  info: "badge-blue",
  draft: "badge-violet",
};

export const priorityBadgeClass: Record<NotificationPriority, string> = {
  critical: "badge-red",
  high: "badge-orange",
  medium: "badge-amber",
  low: "badge-blue",
};

export const priorityLabels: Record<NotificationPriority, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const typeIcon: Record<NotificationType, AppIconName> = {
  danger: "triangle-alert",
  warning: "flag",
  success: "check",
  info: "bell",
  draft: "file-text",
};

export const kindIcon: Record<NotificationKind, AppIconName> = {
  approval: "clock",
  payment: "credit-card",
  missing_docs: "file-text",
  risk: "shield",
  bind_blocked: "lock",
  folio: "target",
  client_reply: "mail",
  producer_review: "user-check",
  general: "bell",
};

export const resolutionStateLabels: Record<ResolutionState, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  escalated: "Escalated",
  dismissed: "Dismissed",
};

export const resolutionStateBadgeClass: Record<ResolutionState, string> = {
  open: "notification-resolution--open",
  in_progress: "notification-resolution--in-progress",
  resolved: "notification-resolution--resolved",
  escalated: "notification-resolution--escalated",
  dismissed: "notification-resolution--dismissed",
};

export const timeGroupLabels: Record<NotificationTimeGroup, string> = {
  now: "Now",
  today: "Today",
  "earlier-today": "Earlier Today",
  yesterday: "Yesterday",
  older: "Older",
};

export const timeGroupOrder: NotificationTimeGroup[] = [
  "now",
  "today",
  "earlier-today",
  "yesterday",
  "older",
];

export const moduleSourceClass: Record<string, string> = {
  "VA Operations": "notification-source--va-ops",
  "Commercial Hub": "notification-source--commercial",
  "Send Center": "notification-source--send",
  ePayPolicy: "notification-source--epay",
  "Training Hub": "notification-source--training",
  "Global Search": "notification-source--search",
};

export const snoozeOptionLabels: Record<SnoozeOption, string> = {
  "1h": "Snooze 1h",
  tomorrow: "Snooze until tomorrow",
  "next-folio": "Snooze until next folio",
};

export function getModuleSourceClass(module: string): string {
  return moduleSourceClass[module] ?? "notification-source--neutral";
}

export function getNotificationIcon(notification: Pick<AppNotification, "kind" | "icon">): AppIconName {
  return kindIcon[notification.kind] ?? notification.icon;
}

export function getDefaultActionsForKind(kind: NotificationKind): NotificationAction[] {
  switch (kind) {
    case "payment":
      return [
        { id: "retry-payment", label: "Retry Payment" },
        { id: "open-invoice", label: "Open Invoice" },
        { id: "contact-client", label: "Contact Client" },
      ];
    case "approval":
      return [
        { id: "review-now", label: "Review Now" },
        { id: "reassign", label: "Reassign" },
        { id: "extend-deadline", label: "Extend Deadline" },
      ];
    case "missing_docs":
      return [
        { id: "send-reminder", label: "Send Reminder" },
        { id: "upload-document", label: "Upload Document" },
        { id: "escalate", label: "Escalate" },
      ];
    case "bind_blocked":
      return [
        { id: "open-submission", label: "Open Submission" },
        { id: "resolve-blocker", label: "Resolve Blocker" },
        { id: "contact-producer", label: "Contact Producer" },
      ];
    case "folio":
      return [
        { id: "view-folio", label: "View Folio" },
        { id: "review-pipeline", label: "Review Pipeline" },
        { id: "assign-follow-up", label: "Assign Follow-up" },
      ];
    case "client_reply":
      return [
        { id: "open-thread", label: "Open Thread" },
        { id: "reply", label: "Reply" },
        { id: "assign", label: "Assign" },
      ];
    case "producer_review":
      return [
        { id: "review-now", label: "Review Now" },
        { id: "reassign", label: "Reassign" },
        { id: "nudge-producer", label: "Nudge Producer" },
      ];
    case "risk":
      return [
        { id: "review-exposure", label: "Review Exposure" },
        { id: "assign", label: "Assign" },
        { id: "escalate", label: "Escalate" },
      ];
    default:
      return [
        { id: "open", label: "Open" },
        { id: "assign", label: "Assign" },
        { id: "dismiss", label: "Dismiss" },
      ];
  }
}

export function getNotificationActions(notification: AppNotification): NotificationAction[] {
  return notification.actions.length > 0
    ? notification.actions
    : getDefaultActionsForKind(notification.kind);
}

const NOW_MS = 30 * 60 * 1000;
const TODAY_RECENT_MS = 3 * 60 * 60 * 1000;
const hour = 60 * 60 * 1000;
const day = 24 * hour;

function startOfLocalDay(ms: number): number {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function getTimeGroup(timestampMs: number, nowMs = Date.now()): NotificationTimeGroup {
  const age = nowMs - timestampMs;
  if (age <= NOW_MS) return "now";

  const todayStart = startOfLocalDay(nowMs);
  const yesterdayStart = todayStart - day;
  const eventDay = startOfLocalDay(timestampMs);

  if (eventDay === todayStart) {
    return age <= TODAY_RECENT_MS ? "today" : "earlier-today";
  }
  if (eventDay === yesterdayStart) return "yesterday";
  return "older";
}

export function computeSnoozeUntil(option: SnoozeOption, nowMs = Date.now()): number {
  if (option === "1h") return nowMs + hour;

  if (option === "tomorrow") {
    const tomorrow = new Date(nowMs);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);
    return tomorrow.getTime();
  }

  const [year, month, dayOfMonth] = currentFolioPeriod.endDate.split("-").map(Number);
  const nextFolio = new Date(year, month - 1, dayOfMonth + 1, 8, 0, 0, 0);
  return nextFolio.getTime();
}

export type NotificationFeedGroup = {
  id: NotificationTimeGroup | "pinned";
  label: string;
  notifications: AppNotification[];
};

const TYPE_SORT_ORDER: Record<NotificationType, number> = {
  danger: 0,
  warning: 1,
  success: 2,
  info: 3,
  draft: 4,
};

const now = Date.now();

export const seedNotifications: AppNotification[] = [
  {
    id: "n-crit-1",
    type: "danger",
    category: "urgent",
    kind: "risk",
    priority: "critical",
    status: "unread",
    resolutionState: "open",
    title: "E&O exposure critical",
    description: "Martinez Landscaping scored 6 on E&O risk: 32 days open, no carrier, 2 missing documents.",
    timestamp: "2m ago",
    timestampMs: now - 2 * 60 * 1000,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "shield",
    relatedUserId: "pedro-va",
    relatedUserName: "Pedro",
    metadata: { account: "Martinez Landscaping", riskScore: "6", daysOpen: "32" },
    actions: [
      { id: "review-exposure", label: "Review Exposure" },
      { id: "assign", label: "Assign" },
      { id: "escalate", label: "Escalate" },
    ],
  },
  {
    id: "n-crit-2",
    type: "danger",
    category: "urgent",
    kind: "risk",
    priority: "critical",
    status: "unread",
    resolutionState: "in_progress",
    title: "Speed to lead breach",
    description: "New commercial lead unassigned for 22 minutes: SLA threshold is 15 minutes.",
    timestamp: "22m ago",
    timestampMs: now - 22 * 60 * 1000,
    module: "VA Operations",
    moduleRoute: routes.vaOperations,
    icon: "shield",
    relatedUserId: "jaffer",
    relatedUserName: "Jazmín",
    metadata: { sla: "15 min", elapsed: "22 min", queue: "Commercial leads" },
    actions: [
      { id: "open", label: "Open Lead" },
      { id: "assign", label: "Assign" },
      { id: "escalate", label: "Escalate" },
    ],
  },
  {
    id: "n-crit-3",
    type: "danger",
    category: "urgent",
    kind: "bind_blocked",
    priority: "critical",
    status: "unread",
    resolutionState: "open",
    pinned: true,
    title: "Policy at risk: bind blocked",
    description: "Rivera Construction WC bind blocked: signed ACORD 125 missing. Policy at risk of lapse.",
    timestamp: "45m ago",
    timestampMs: now - 45 * 60 * 1000,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "lock",
    relatedUserId: "sarah-chen",
    relatedUserName: "Sarah",
    metadata: { blocker: "ACORD 125 unsigned", policy: "Rivera Construction WC" },
    actions: [
      { id: "open-submission", label: "Open Submission" },
      { id: "resolve-blocker", label: "Resolve Blocker" },
      { id: "contact-producer", label: "Contact Producer" },
    ],
  },
  {
    id: "n-crit-4",
    type: "danger",
    category: "payments",
    kind: "payment",
    priority: "critical",
    status: "unread",
    resolutionState: "open",
    pinned: true,
    title: "Payment failed",
    description: "Kim Auto Shop card payment declined: premium bind cannot complete until retry.",
    timestamp: "20m ago",
    timestampMs: now - 20 * 60 * 1000,
    module: "ePayPolicy",
    moduleRoute: routes.epayPolicy,
    icon: "credit-card",
    relatedUserId: "pedro-alvarez",
    relatedUserName: "Pedro",
    metadata: { amount: "$4,280", method: "Card declined", invoice: "INV-2026-0912" },
    actions: [
      { id: "retry-payment", label: "Retry Payment" },
      { id: "open-invoice", label: "Open Invoice" },
      { id: "contact-client", label: "Contact Client" },
    ],
  },
  {
    id: "n-crit-5",
    type: "danger",
    category: "approvals",
    kind: "approval",
    priority: "critical",
    status: "unread",
    resolutionState: "escalated",
    pinned: true,
    title: "Approval missed",
    description: "Harbor Logistics GL + Umbrella executive approval window expired: quote may lapse.",
    timestamp: "1h ago",
    timestampMs: now - hour,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "clock",
    relatedUserId: "eva-chong",
    relatedUserName: "Eva",
    metadata: { window: "Expired", package: "GL + Umbrella", account: "Harbor Logistics" },
    actions: [
      { id: "review-now", label: "Review Now" },
      { id: "reassign", label: "Reassign" },
      { id: "extend-deadline", label: "Extend Deadline" },
    ],
  },
  {
    id: "n-warn-1",
    type: "warning",
    category: "urgent",
    kind: "folio",
    priority: "high",
    status: "unread",
    resolutionState: "open",
    pinned: true,
    title: "Folio nearing close",
    description: "Folio 18 closes in 7 days at 61% pace: $11.8K gap to $30K premium goal.",
    timestamp: "12m ago",
    timestampMs: now - 12 * 60 * 1000,
    module: "VA Operations",
    moduleRoute: routes.vaOperations,
    icon: "target",
    relatedUserId: "eva-chong",
    relatedUserName: "Eva",
    metadata: { folio: "18", pace: "61%", gap: "$11.8K" },
    actions: [
      { id: "view-folio", label: "View Folio" },
      { id: "review-pipeline", label: "Review Pipeline" },
      { id: "assign-follow-up", label: "Assign Follow-up" },
    ],
  },
  {
    id: "n-warn-2",
    type: "warning",
    category: "approvals",
    kind: "producer_review",
    priority: "high",
    status: "unread",
    resolutionState: "in_progress",
    title: "Producer review delayed",
    description: "Atlas Roofing BOP package in licensed review for 72 minutes: producer sign-off pending.",
    timestamp: "1h ago",
    timestampMs: now - hour,
    module: "Send Center",
    moduleRoute: `${routes.sendCenter}?view=pending-review`,
    icon: "user-check",
    relatedUserId: "pedro-alvarez",
    relatedUserName: "Pedro",
    metadata: { waitTime: "72 min", package: "Atlas Roofing BOP" },
    actions: [
      { id: "review-now", label: "Review Now" },
      { id: "reassign", label: "Reassign" },
      { id: "nudge-producer", label: "Nudge Producer" },
    ],
  },
  {
    id: "n-warn-3",
    type: "warning",
    category: "urgent",
    kind: "client_reply",
    priority: "medium",
    status: "unread",
    resolutionState: "open",
    title: "Pending DocuSign over 72h",
    description: "Greenline Logistics renewal proposal unsigned for 78 hours: follow-up recommended.",
    timestamp: "3h ago",
    timestampMs: now - 3 * hour,
    module: "Send Center",
    moduleRoute: `${routes.sendCenter}?view=sent`,
    icon: "mail",
    relatedUserId: "jojo",
    relatedUserName: "JoJo",
    metadata: { unsigned: "78 hours", document: "Renewal proposal" },
    actions: [
      { id: "open-thread", label: "Open Thread" },
      { id: "reply", label: "Send Reminder" },
      { id: "assign", label: "Assign" },
    ],
  },
  {
    id: "n-warn-4",
    type: "warning",
    category: "urgent",
    kind: "risk",
    priority: "medium",
    status: "read",
    resolutionState: "resolved",
    title: "SLA approaching",
    description: "CNA has not responded to Greenline Logistics quote request in 48 hours.",
    timestamp: "4h ago",
    timestampMs: now - 4 * hour,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "shield",
    relatedUserId: "tracie-wong",
    relatedUserName: "Tracie",
    metadata: { carrier: "CNA", wait: "48 hours" },
    actions: [
      { id: "review-exposure", label: "Review Exposure" },
      { id: "assign", label: "Assign" },
      { id: "escalate", label: "Escalate" },
    ],
  },
  {
    id: "n-warn-5",
    type: "warning",
    category: "training",
    kind: "general",
    priority: "high",
    status: "unread",
    resolutionState: "open",
    title: "E&O training due in 2 days",
    description: "E&O Best Practices module due Jun 23: 3 team members have not started.",
    timestamp: "8h ago",
    timestampMs: now - 8 * hour,
    module: "Training Hub",
    moduleRoute: routes.trainingHub,
    icon: "trophy",
    relatedUserId: "kyle-nguyen",
    relatedUserName: "Kyle",
    metadata: { due: "Jun 23", incomplete: "3 members" },
    actions: [
      { id: "open-training", label: "Open Training" },
      { id: "assign", label: "Assign" },
      { id: "send-reminder", label: "Send Reminder" },
    ],
  },
  {
    id: "n-succ-1",
    type: "success",
    category: "payments",
    kind: "payment",
    priority: "low",
    status: "unread",
    resolutionState: "resolved",
    title: "Invoice paid",
    description: "Greenline Logistics paid invoice #INV-2026-0842: $26,831 via ACH.",
    timestamp: "5h ago",
    timestampMs: now - 5 * hour,
    module: "ePayPolicy",
    moduleRoute: routes.epayPolicy,
    icon: "credit-card",
    relatedUserId: "valerie-martinez",
    relatedUserName: "Valerie",
    metadata: { invoice: "INV-2026-0842", amount: "$26,831", method: "ACH" },
    actions: [
      { id: "open-invoice", label: "Open Invoice" },
      { id: "contact-client", label: "Contact Client" },
    ],
  },
  {
    id: "n-succ-2",
    type: "success",
    category: "approvals",
    kind: "approval",
    priority: "medium",
    status: "unread",
    resolutionState: "resolved",
    title: "Transfer approved",
    description: "Jazmín → Sarah personal lead handoff approved and routed to dialer queue.",
    timestamp: "30m ago",
    timestampMs: now - 30 * 60 * 1000,
    module: "VA Operations",
    moduleRoute: routes.vaOperations,
    icon: "clock",
    relatedUserId: "sarah-chen",
    relatedUserName: "Sarah",
    metadata: { from: "Jazmín", to: "Sarah", queue: "Personal lines" },
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-succ-3",
    type: "success",
    category: "approvals",
    kind: "approval",
    priority: "medium",
    status: "read",
    resolutionState: "resolved",
    title: "Send approved",
    description: "Martinez Landscaping proposal approved by licensing: ready for client delivery.",
    timestamp: "2h ago",
    timestampMs: now - 2 * hour,
    module: "Send Center",
    moduleRoute: routes.sendCenter,
    icon: "clock",
    relatedUserId: "eva-chong",
    relatedUserName: "Eva",
    metadata: { account: "Martinez Landscaping", stage: "Ready to send" },
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-succ-4",
    type: "success",
    category: "urgent",
    kind: "general",
    priority: "low",
    status: "read",
    resolutionState: "resolved",
    title: "Policy bound",
    description: "Atlas Roofing GL bound with Travelers: $5,600 annual premium recorded.",
    timestamp: "6h ago",
    timestampMs: now - 6 * hour,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "check",
    relatedUserId: "pedro-alvarez",
    relatedUserName: "Pedro",
    metadata: { carrier: "Travelers", premium: "$5,600" },
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-info-1",
    type: "info",
    category: "urgent",
    kind: "general",
    priority: "medium",
    status: "unread",
    resolutionState: "open",
    title: "New lead added",
    description: "Meta commercial lead assigned to research queue: Harbor Logistics expansion.",
    timestamp: "8m ago",
    timestampMs: now - 8 * 60 * 1000,
    module: "VA Operations",
    moduleRoute: routes.vaOperations,
    icon: "user-plus",
    relatedUserId: "jaffer",
    relatedUserName: "Jaffer",
    metadata: { source: "Meta", account: "Harbor Logistics" },
    actions: [{ id: "open", label: "Open" }, { id: "assign", label: "Assign" }],
  },
  {
    id: "n-info-2",
    type: "info",
    category: "urgent",
    kind: "missing_docs",
    priority: "low",
    status: "unread",
    resolutionState: "open",
    title: "Missing COI document",
    description: "Pedro assigned COI follow-up for Kim Auto Shop: loss run missing, due today EOD.",
    timestamp: "25m ago",
    timestampMs: now - 25 * 60 * 1000,
    module: "VA Operations",
    moduleRoute: `${routes.vaOperations}?view=tasks`,
    icon: "file-text",
    relatedUserId: "pedro-va",
    relatedUserName: "Pedro",
    metadata: { document: "Loss run", due: "Today EOD" },
    actions: [
      { id: "send-reminder", label: "Send Reminder" },
      { id: "upload-document", label: "Upload Document" },
      { id: "escalate", label: "Escalate" },
    ],
  },
  {
    id: "n-info-3",
    type: "info",
    category: "system",
    kind: "general",
    priority: "low",
    status: "unread",
    resolutionState: "open",
    title: "Pipeline moved",
    description: "Martinez Landscaping submission advanced to Quoted stage in Commercial Hub.",
    timestamp: "1h ago",
    timestampMs: now - hour,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "trending-up",
    relatedUserId: "tracie-wong",
    relatedUserName: "Tracie",
    metadata: { stage: "Quoted", account: "Martinez Landscaping" },
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-info-4",
    type: "info",
    category: "system",
    kind: "general",
    priority: "medium",
    status: "read",
    resolutionState: "resolved",
    title: "Team status updated",
    description: "Sarah marked available: personal lines queue coverage restored.",
    timestamp: "2h ago",
    timestampMs: now - 2 * hour,
    module: "VA Operations",
    moduleRoute: routes.vaOperations,
    icon: "users",
    relatedUserId: "sarah-chen",
    relatedUserName: "Sarah",
    metadata: { status: "Available", queue: "Personal lines" },
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-info-5",
    type: "info",
    category: "system",
    kind: "general",
    priority: "low",
    status: "read",
    resolutionState: "resolved",
    title: "Carrier market updated",
    description: "Travelers BOP appetite expanded to landscaping accounts in TX: review Carrier Library.",
    timestamp: "1d ago",
    timestampMs: now - day,
    module: "Carrier Library",
    moduleRoute: routes.carrierLibrary,
    icon: "refresh",
    relatedUserId: "kyle",
    relatedUserName: "Kyle",
    metadata: { carrier: "Travelers", market: "Landscaping TX" },
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-info-6",
    type: "info",
    category: "system",
    kind: "general",
    priority: "high",
    status: "unread",
    resolutionState: "open",
    title: "AgencyZoom sync completed",
    description: "14 records pushed successfully: last sync 6:42 AM PST.",
    timestamp: "3h ago",
    timestampMs: now - 3 * hour,
    module: "VA Operations",
    moduleRoute: routes.vaOperations,
    icon: "refresh",
    relatedUserId: "arminda-ops",
    relatedUserName: "Arminda",
    metadata: { records: "14", syncTime: "6:42 AM PST" },
    actions: [{ id: "view-logs", label: "View Logs" }],
  },
  {
    id: "n-draft-1",
    type: "draft",
    category: "approvals",
    kind: "approval",
    priority: "medium",
    status: "unread",
    resolutionState: "open",
    title: "Proposal draft awaiting review",
    description: "Atlas Roofing BOP package saved as draft: licensed review not yet submitted.",
    timestamp: "45m ago",
    timestampMs: now - 45 * 60 * 1000,
    module: "Send Center",
    moduleRoute: `${routes.sendCenter}?view=draft-queue`,
    icon: "clock",
    relatedUserId: "pedro-alvarez",
    relatedUserName: "Pedro",
    metadata: { package: "Atlas Roofing BOP", stage: "Draft" },
    actions: [
      { id: "review-now", label: "Review Now" },
      { id: "open", label: "Open Draft" },
    ],
  },
  {
    id: "n-draft-2",
    type: "draft",
    category: "payments",
    kind: "payment",
    priority: "low",
    status: "unread",
    resolutionState: "open",
    title: "Invoice draft in progress",
    description: "Rivera Construction installment invoice draft: broker fee pending confirmation.",
    timestamp: "2h ago",
    timestampMs: now - 2 * hour,
    module: "ePayPolicy",
    moduleRoute: routes.epayPolicy,
    icon: "credit-card",
    relatedUserId: "valerie-martinez",
    relatedUserName: "Valerie",
    metadata: { account: "Rivera Construction", pending: "Broker fee" },
    actions: [{ id: "open", label: "Resume Draft" }],
  },
];

export const NOTIFICATION_STORAGE_KEY = "agency-ops-notifications";

export type NotificationOverrides = Record<
  string,
  Partial<Pick<AppNotification, "status" | "snoozedUntil" | "pinned" | "resolutionState">>
>;

export function loadNotificationOverrides(): NotificationOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as NotificationOverrides) : {};
  } catch {
    return {};
  }
}

export function saveNotificationOverrides(overrides: NotificationOverrides): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    /* ignore */
  }
}

export function mergeNotificationsWithOverrides(
  base: AppNotification[],
  overrides: NotificationOverrides,
): AppNotification[] {
  return base.map((n) => {
    const o = overrides[n.id];
    if (!o) return n;
    return { ...n, ...o };
  });
}

export function isNotificationVisible(n: AppNotification, nowMs = Date.now()): boolean {
  if (n.status === "dismissed") return false;
  if (n.status === "snoozed" && n.snoozedUntil && n.snoozedUntil > nowMs) return false;
  return true;
}

function compareNotifications(a: AppNotification, b: AppNotification): number {
  const pinA = a.pinned ? 0 : 1;
  const pinB = b.pinned ? 0 : 1;
  if (pinA !== pinB) return pinA - pinB;

  const typeDiff = TYPE_SORT_ORDER[a.type] - TYPE_SORT_ORDER[b.type];
  if (typeDiff !== 0) return typeDiff;

  const unreadA = a.status === "unread" ? 0 : 1;
  const unreadB = b.status === "unread" ? 0 : 1;
  if (unreadA !== unreadB) return unreadA - unreadB;

  return b.timestampMs - a.timestampMs;
}

export function groupNotificationsForFeed(
  notifications: AppNotification[],
  nowMs = Date.now(),
): NotificationFeedGroup[] {
  const pinned = notifications.filter((n) => n.pinned);
  const unpinned = notifications.filter((n) => !n.pinned);
  const groups: NotificationFeedGroup[] = [];

  if (pinned.length > 0) {
    groups.push({
      id: "pinned",
      label: "Pinned",
      notifications: [...pinned].sort(compareNotifications),
    });
  }

  const buckets = new Map<NotificationTimeGroup, AppNotification[]>();
  for (const group of timeGroupOrder) {
    buckets.set(group, []);
  }

  for (const notification of unpinned) {
    const group = getTimeGroup(notification.timestampMs, nowMs);
    buckets.get(group)?.push(notification);
  }

  for (const groupId of timeGroupOrder) {
    const items = buckets.get(groupId) ?? [];
    if (items.length === 0) continue;
    groups.push({
      id: groupId,
      label: timeGroupLabels[groupId],
      notifications: [...items].sort(compareNotifications),
    });
  }

  return groups;
}

export function filterNotifications(
  notifications: AppNotification[],
  tab: NotificationFilterTab,
): AppNotification[] {
  const nowMs = Date.now();
  return notifications
    .filter((n) => isNotificationVisible(n, nowMs))
    .filter((n) => tab === "all" || n.type === tab)
    .sort(compareNotifications);
}

export function countUnread(notifications: AppNotification[]): number {
  return notifications.filter(
    (n) => isNotificationVisible(n) && n.status === "unread",
  ).length;
}

export function hasDangerUnread(notifications: AppNotification[]): boolean {
  return notifications.some(
    (n) =>
      isNotificationVisible(n) &&
      n.status === "unread" &&
      n.type === "danger",
  );
}

/** @deprecated Use hasDangerUnread */
export const hasCriticalUnread = hasDangerUnread;

export function hasUrgentUnread(notifications: AppNotification[]): boolean {
  return hasDangerUnread(notifications);
}

export function tabCount(
  notifications: AppNotification[],
  tab: NotificationFilterTab,
): number {
  const nowMs = Date.now();
  return notifications.filter(
    (n) =>
      isNotificationVisible(n, nowMs) &&
      (tab === "all" || n.type === tab) &&
      n.status === "unread",
  ).length;
}
