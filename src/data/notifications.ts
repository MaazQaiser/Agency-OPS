import type { AppIconName } from "@/components/ui/AppIcon";
import { routes } from "@/lib/routes";

export type NotificationType = "danger" | "warning" | "success" | "info" | "draft";

/** @deprecated Legacy module grouping — prefer `type` for filters and styling */
export type NotificationCategory = "urgent" | "approvals" | "payments" | "training" | "system";

export type NotificationFilterTab = "all" | NotificationType;

export type NotificationPriority = "critical" | "high" | "medium" | "low";

export type NotificationStatus = "unread" | "read" | "snoozed" | "dismissed" | "resolved";

export type NotificationAction = {
  id: string;
  label: string;
};

export type AppNotification = {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  description: string;
  timestamp: string;
  timestampMs: number;
  module: string;
  moduleRoute: string;
  icon: AppIconName;
  relatedUserId?: string;
  relatedUserName?: string;
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

const TYPE_SORT_ORDER: Record<NotificationType, number> = {
  danger: 0,
  warning: 1,
  success: 2,
  info: 3,
  draft: 4,
};

const now = Date.now();
const hour = 60 * 60 * 1000;
const day = 24 * hour;

export const seedNotifications: AppNotification[] = [
  {
    id: "n-crit-1",
    type: "danger",
    category: "urgent",
    priority: "critical",
    status: "unread",
    title: "E&O exposure critical",
    description: "Martinez Landscaping scored 6 on E&O risk — 32 days open, no carrier, 2 missing documents.",
    timestamp: "2m ago",
    timestampMs: now - 2 * 60 * 1000,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "triangle-alert",
    relatedUserId: "pedro-va",
    relatedUserName: "Pedro",
    actions: [{ id: "review", label: "Review" }, { id: "assign", label: "Assign" }],
  },
  {
    id: "n-crit-2",
    type: "danger",
    category: "urgent",
    priority: "critical",
    status: "unread",
    title: "Speed to lead breach",
    description: "New commercial lead unassigned for 22 minutes — SLA threshold is 15 minutes.",
    timestamp: "22m ago",
    timestampMs: now - 22 * 60 * 1000,
    module: "VA Operations",
    moduleRoute: routes.vaOperations,
    icon: "triangle-alert",
    relatedUserId: "jaffer",
    relatedUserName: "Jazmín",
    actions: [{ id: "open", label: "Open" }, { id: "assign", label: "Assign" }],
  },
  {
    id: "n-crit-3",
    type: "danger",
    category: "urgent",
    priority: "critical",
    status: "unread",
    title: "Policy at risk — bind blocked",
    description: "Rivera Construction WC bind blocked — signed ACORD 125 missing. Policy at risk of lapse.",
    timestamp: "45m ago",
    timestampMs: now - 45 * 60 * 1000,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "shield",
    relatedUserId: "sarah-chen",
    relatedUserName: "Sarah",
    actions: [{ id: "review", label: "Review" }, { id: "resolve", label: "Resolve" }],
  },
  {
    id: "n-crit-4",
    type: "danger",
    category: "payments",
    priority: "critical",
    status: "unread",
    title: "Payment failed",
    description: "Kim Auto Shop card payment declined — premium bind cannot complete until retry.",
    timestamp: "20m ago",
    timestampMs: now - 20 * 60 * 1000,
    module: "ePayPolicy",
    moduleRoute: routes.epayPolicy,
    icon: "dollar",
    relatedUserId: "pedro-alvarez",
    relatedUserName: "Pedro",
    actions: [{ id: "view-invoice", label: "View Invoice" }, { id: "retry", label: "Retry" }],
  },
  {
    id: "n-crit-5",
    type: "danger",
    category: "approvals",
    priority: "critical",
    status: "unread",
    title: "Approval missed",
    description: "Harbor Logistics GL + Umbrella executive approval window expired — quote may lapse.",
    timestamp: "1h ago",
    timestampMs: now - hour,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "shield",
    relatedUserId: "eva-chong",
    relatedUserName: "Eva",
    actions: [{ id: "review", label: "Review" }, { id: "approve", label: "Approve" }],
  },
  {
    id: "n-warn-1",
    type: "warning",
    category: "urgent",
    priority: "high",
    status: "unread",
    title: "Folio nearing close",
    description: "Folio 18 closes in 7 days at 61% pace — $11.8K gap to $30K premium goal.",
    timestamp: "12m ago",
    timestampMs: now - 12 * 60 * 1000,
    module: "VA Operations",
    moduleRoute: routes.vaOperations,
    icon: "flag",
    relatedUserId: "eva-chong",
    relatedUserName: "Eva",
    actions: [{ id: "open", label: "View Folio" }],
  },
  {
    id: "n-warn-2",
    type: "warning",
    category: "approvals",
    priority: "high",
    status: "unread",
    title: "Producer review delayed",
    description: "Atlas Roofing BOP package in licensed review for 72 minutes — producer sign-off pending.",
    timestamp: "1h ago",
    timestampMs: now - hour,
    module: "Send Center",
    moduleRoute: `${routes.sendCenter}?view=pending-review`,
    icon: "flag",
    relatedUserId: "pedro-alvarez",
    relatedUserName: "Pedro",
    actions: [{ id: "review", label: "Review" }],
  },
  {
    id: "n-warn-3",
    type: "warning",
    category: "urgent",
    priority: "medium",
    status: "unread",
    title: "Pending DocuSign over 72h",
    description: "Greenline Logistics renewal proposal unsigned for 78 hours — follow-up recommended.",
    timestamp: "3h ago",
    timestampMs: now - 3 * hour,
    module: "Send Center",
    moduleRoute: `${routes.sendCenter}?view=sent`,
    icon: "send",
    relatedUserId: "jojo",
    relatedUserName: "JoJo",
    actions: [{ id: "open", label: "Open" }, { id: "nudge", label: "Nudge" }],
  },
  {
    id: "n-warn-4",
    type: "warning",
    category: "urgent",
    priority: "medium",
    status: "read",
    title: "SLA approaching",
    description: "CNA has not responded to Greenline Logistics quote request in 48 hours.",
    timestamp: "4h ago",
    timestampMs: now - 4 * hour,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "flag",
    relatedUserId: "tracie-wong",
    relatedUserName: "Tracie",
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-warn-5",
    type: "warning",
    category: "training",
    priority: "high",
    status: "unread",
    title: "E&O training due in 2 days",
    description: "E&O Best Practices module due Jun 23 — 3 team members have not started.",
    timestamp: "8h ago",
    timestampMs: now - 8 * hour,
    module: "Training Hub",
    moduleRoute: routes.trainingHub,
    icon: "trophy",
    relatedUserId: "kyle-nguyen",
    relatedUserName: "Kyle",
    actions: [{ id: "open-training", label: "Open Training" }],
  },
  {
    id: "n-succ-1",
    type: "success",
    category: "payments",
    priority: "low",
    status: "unread",
    title: "Invoice paid",
    description: "Greenline Logistics paid invoice #INV-2026-0842 — $26,831 via ACH.",
    timestamp: "5h ago",
    timestampMs: now - 5 * hour,
    module: "ePayPolicy",
    moduleRoute: routes.epayPolicy,
    icon: "check",
    relatedUserId: "valerie-martinez",
    relatedUserName: "Valerie",
    actions: [{ id: "view-invoice", label: "View Invoice" }],
  },
  {
    id: "n-succ-2",
    type: "success",
    category: "approvals",
    priority: "medium",
    status: "unread",
    title: "Transfer approved",
    description: "Jazmín → Sarah personal lead handoff approved and routed to dialer queue.",
    timestamp: "30m ago",
    timestampMs: now - 30 * 60 * 1000,
    module: "VA Operations",
    moduleRoute: routes.vaOperations,
    icon: "check",
    relatedUserId: "sarah-chen",
    relatedUserName: "Sarah",
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-succ-3",
    type: "success",
    category: "approvals",
    priority: "medium",
    status: "read",
    title: "Send approved",
    description: "Martinez Landscaping proposal approved by licensing — ready for client delivery.",
    timestamp: "2h ago",
    timestampMs: now - 2 * hour,
    module: "Send Center",
    moduleRoute: routes.sendCenter,
    icon: "check",
    relatedUserId: "eva-chong",
    relatedUserName: "Eva",
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-succ-4",
    type: "success",
    category: "urgent",
    priority: "low",
    status: "read",
    title: "Policy bound",
    description: "Atlas Roofing GL bound with Travelers — $5,600 annual premium recorded.",
    timestamp: "6h ago",
    timestampMs: now - 6 * hour,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "check",
    relatedUserId: "pedro-alvarez",
    relatedUserName: "Pedro",
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-info-1",
    type: "info",
    category: "urgent",
    priority: "medium",
    status: "unread",
    title: "New lead added",
    description: "Meta commercial lead assigned to research queue — Harbor Logistics expansion.",
    timestamp: "8m ago",
    timestampMs: now - 8 * 60 * 1000,
    module: "VA Operations",
    moduleRoute: routes.vaOperations,
    icon: "user-plus",
    relatedUserId: "jaffer",
    relatedUserName: "Jaffer",
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-info-2",
    type: "info",
    category: "urgent",
    priority: "low",
    status: "unread",
    title: "New task assigned",
    description: "Pedro assigned COI follow-up for Kim Auto Shop — due today EOD.",
    timestamp: "25m ago",
    timestampMs: now - 25 * 60 * 1000,
    module: "VA Operations",
    moduleRoute: `${routes.vaOperations}?view=tasks`,
    icon: "clipboard",
    relatedUserId: "pedro-va",
    relatedUserName: "Pedro",
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-info-3",
    type: "info",
    category: "system",
    priority: "low",
    status: "unread",
    title: "Pipeline moved",
    description: "Martinez Landscaping submission advanced to Quoted stage in Commercial Hub.",
    timestamp: "1h ago",
    timestampMs: now - hour,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "trending-up",
    relatedUserId: "tracie-wong",
    relatedUserName: "Tracie",
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-info-4",
    type: "info",
    category: "system",
    priority: "medium",
    status: "read",
    title: "Team status updated",
    description: "Sarah marked available — personal lines queue coverage restored.",
    timestamp: "2h ago",
    timestampMs: now - 2 * hour,
    module: "VA Operations",
    moduleRoute: routes.vaOperations,
    icon: "users",
    relatedUserId: "sarah-chen",
    relatedUserName: "Sarah",
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-info-5",
    type: "info",
    category: "system",
    priority: "low",
    status: "read",
    title: "Carrier market updated",
    description: "Travelers BOP appetite expanded to landscaping accounts in TX — review Carrier Library.",
    timestamp: "1d ago",
    timestampMs: now - day,
    module: "Carrier Library",
    moduleRoute: routes.carrierLibrary,
    icon: "refresh",
    relatedUserId: "kyle",
    relatedUserName: "Kyle",
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-info-6",
    type: "info",
    category: "system",
    priority: "high",
    status: "unread",
    title: "AgencyZoom sync completed",
    description: "14 records pushed successfully — last sync 6:42 AM PST.",
    timestamp: "3h ago",
    timestampMs: now - 3 * hour,
    module: "VA Operations",
    moduleRoute: routes.vaOperations,
    icon: "refresh",
    relatedUserId: "arminda-ops",
    relatedUserName: "Arminda",
    actions: [{ id: "view-logs", label: "View Logs" }],
  },
  {
    id: "n-draft-1",
    type: "draft",
    category: "approvals",
    priority: "medium",
    status: "unread",
    title: "Proposal draft awaiting review",
    description: "Atlas Roofing BOP package saved as draft — licensed review not yet submitted.",
    timestamp: "45m ago",
    timestampMs: now - 45 * 60 * 1000,
    module: "Send Center",
    moduleRoute: `${routes.sendCenter}?view=draft-queue`,
    icon: "file-text",
    relatedUserId: "pedro-alvarez",
    relatedUserName: "Pedro",
    actions: [{ id: "open", label: "Open Draft" }],
  },
  {
    id: "n-draft-2",
    type: "draft",
    category: "payments",
    priority: "low",
    status: "unread",
    title: "Invoice draft in progress",
    description: "Rivera Construction installment invoice draft — broker fee pending confirmation.",
    timestamp: "2h ago",
    timestampMs: now - 2 * hour,
    module: "ePayPolicy",
    moduleRoute: routes.epayPolicy,
    icon: "file-text",
    relatedUserId: "valerie-martinez",
    relatedUserName: "Valerie",
    actions: [{ id: "open", label: "Resume Draft" }],
  },
];

export const NOTIFICATION_STORAGE_KEY = "agency-ops-notifications";

export type NotificationOverrides = Record<
  string,
  Partial<Pick<AppNotification, "status" | "snoozedUntil">>
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
  const typeDiff = TYPE_SORT_ORDER[a.type] - TYPE_SORT_ORDER[b.type];
  if (typeDiff !== 0) return typeDiff;

  const unreadA = a.status === "unread" ? 0 : 1;
  const unreadB = b.status === "unread" ? 0 : 1;
  if (unreadA !== unreadB) return unreadA - unreadB;

  return b.timestampMs - a.timestampMs;
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
