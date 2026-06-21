import type { AppIconName } from "@/components/ui/AppIcon";
import { routes } from "@/lib/routes";

export type NotificationCategory = "urgent" | "approvals" | "payments" | "training" | "system";

export type NotificationFilterTab = "all" | NotificationCategory;

export type NotificationPriority = "critical" | "high" | "medium" | "low";

export type NotificationStatus = "unread" | "read" | "snoozed" | "dismissed" | "resolved";

export type NotificationAction = {
  id: string;
  label: string;
};

export type AppNotification = {
  id: string;
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
  actions: NotificationAction[];
  snoozedUntil?: number;
};

export const notificationCategoryLabels: Record<NotificationCategory, string> = {
  urgent: "Urgent",
  approvals: "Approvals",
  payments: "Payments",
  training: "Training",
  system: "System",
};

export const notificationFilterTabs: { id: NotificationFilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "urgent", label: "Urgent" },
  { id: "approvals", label: "Approvals" },
  { id: "payments", label: "Payments" },
  { id: "training", label: "Training" },
  { id: "system", label: "System" },
];

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

export const categoryIcon: Record<NotificationCategory, AppIconName> = {
  urgent: "triangle-alert",
  approvals: "shield",
  payments: "dollar",
  training: "trophy",
  system: "refresh",
};

const now = Date.now();
const hour = 60 * 60 * 1000;
const day = 24 * hour;

export const seedNotifications: AppNotification[] = [
  {
    id: "n-urg-1",
    category: "urgent",
    priority: "critical",
    status: "unread",
    title: "Submission overdue by 3 days",
    description: "Martinez Landscaping BOP submission has exceeded SLA — missing loss runs blocking bind.",
    timestamp: "2h ago",
    timestampMs: now - 2 * hour,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "triangle-alert",
    actions: [
      { id: "open", label: "Open" },
      { id: "assign", label: "Assign" },
      { id: "resolve", label: "Resolve" },
    ],
  },
  {
    id: "n-urg-2",
    category: "urgent",
    priority: "high",
    status: "unread",
    title: "Missing docs blocking bind",
    description: "Rivera Construction WC bind is blocked — signed ACORD 125 not uploaded.",
    timestamp: "45m ago",
    timestampMs: now - 45 * 60 * 1000,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "triangle-alert",
    actions: [
      { id: "open", label: "Open" },
      { id: "assign", label: "Assign" },
      { id: "resolve", label: "Resolve" },
    ],
  },
  {
    id: "n-urg-3",
    category: "urgent",
    priority: "high",
    status: "unread",
    title: "Proposal pending review > 60 mins",
    description: "Kim Auto Shop commercial auto proposal has been in licensed review for 72 minutes.",
    timestamp: "1h ago",
    timestampMs: now - hour,
    module: "Send Center",
    moduleRoute: `${routes.sendCenter}?view=pending-review`,
    icon: "triangle-alert",
    actions: [
      { id: "open", label: "Open" },
      { id: "assign", label: "Assign" },
      { id: "resolve", label: "Resolve" },
    ],
  },
  {
    id: "n-urg-4",
    category: "urgent",
    priority: "medium",
    status: "read",
    title: "Carrier no response > SLA",
    description: "CNA has not responded to Greenline Logistics quote request in 48 hours.",
    timestamp: "3h ago",
    timestampMs: now - 3 * hour,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "triangle-alert",
    actions: [
      { id: "open", label: "Open" },
      { id: "assign", label: "Assign" },
      { id: "resolve", label: "Resolve" },
    ],
  },
  {
    id: "n-apr-1",
    category: "approvals",
    priority: "high",
    status: "unread",
    title: "Proposal waiting producer review",
    description: "Atlas Roofing BOP package is approved by licensing — awaiting producer sign-off.",
    timestamp: "30m ago",
    timestampMs: now - 30 * 60 * 1000,
    module: "Send Center",
    moduleRoute: `${routes.sendCenter}?view=approved`,
    icon: "shield",
    actions: [
      { id: "review", label: "Review" },
      { id: "approve", label: "Approve" },
      { id: "reject", label: "Reject" },
    ],
  },
  {
    id: "n-apr-2",
    category: "approvals",
    priority: "medium",
    status: "unread",
    title: "Quote approval required",
    description: "Harbor Logistics GL + Umbrella quote needs executive approval above $30K premium.",
    timestamp: "4h ago",
    timestampMs: now - 4 * hour,
    module: "Commercial Hub",
    moduleRoute: routes.commercialHub,
    icon: "shield",
    actions: [
      { id: "review", label: "Review" },
      { id: "approve", label: "Approve" },
      { id: "reject", label: "Reject" },
    ],
  },
  {
    id: "n-apr-3",
    category: "approvals",
    priority: "medium",
    status: "read",
    title: "Payment release pending",
    description: "Trust account release for Martinez Landscaping bind requires manager approval.",
    timestamp: "Yesterday",
    timestampMs: now - day,
    module: "ePayPolicy",
    moduleRoute: routes.epayPolicy,
    icon: "shield",
    actions: [
      { id: "review", label: "Review" },
      { id: "approve", label: "Approve" },
      { id: "reject", label: "Reject" },
    ],
  },
  {
    id: "n-pay-1",
    category: "payments",
    priority: "low",
    status: "read",
    title: "Invoice paid",
    description: "Greenline Logistics paid invoice #INV-2026-0842 — $26,831 via ACH.",
    timestamp: "5h ago",
    timestampMs: now - 5 * hour,
    module: "ePayPolicy",
    moduleRoute: routes.epayPolicy,
    icon: "dollar",
    actions: [
      { id: "view-invoice", label: "View Invoice" },
      { id: "reconcile", label: "Reconcile" },
    ],
  },
  {
    id: "n-pay-2",
    category: "payments",
    priority: "critical",
    status: "unread",
    title: "Payment failed",
    description: "Kim Auto Shop card payment declined for policy premium — retry required.",
    timestamp: "20m ago",
    timestampMs: now - 20 * 60 * 1000,
    module: "ePayPolicy",
    moduleRoute: routes.epayPolicy,
    icon: "dollar",
    actions: [
      { id: "view-invoice", label: "View Invoice" },
      { id: "retry", label: "Retry" },
      { id: "reconcile", label: "Reconcile" },
    ],
  },
  {
    id: "n-pay-3",
    category: "payments",
    priority: "high",
    status: "unread",
    title: "Trust release pending",
    description: "Rivera Construction bind payment held in trust — release awaiting documentation.",
    timestamp: "2h ago",
    timestampMs: now - 2 * hour,
    module: "ePayPolicy",
    moduleRoute: routes.epayPolicy,
    icon: "dollar",
    actions: [
      { id: "view-invoice", label: "View Invoice" },
      { id: "reconcile", label: "Reconcile" },
    ],
  },
  {
    id: "n-pay-4",
    category: "payments",
    priority: "high",
    status: "unread",
    title: "Overdue invoice reminder",
    description: "Atlas Roofing invoice #INV-2026-0891 is 5 days past due — $12,474 outstanding.",
    timestamp: "6h ago",
    timestampMs: now - 6 * hour,
    module: "ePayPolicy",
    moduleRoute: routes.epayPolicy,
    icon: "dollar",
    actions: [
      { id: "view-invoice", label: "View Invoice" },
      { id: "retry", label: "Retry" },
    ],
  },
  {
    id: "n-trn-1",
    category: "training",
    priority: "medium",
    status: "unread",
    title: "New training assigned",
    description: "Licensed Producer Compliance Refresher assigned to your team — due Jun 28.",
    timestamp: "1d ago",
    timestampMs: now - day,
    module: "Training Hub",
    moduleRoute: routes.trainingHub,
    icon: "trophy",
    actions: [
      { id: "open-training", label: "Open Training" },
      { id: "mark-complete", label: "Mark Complete" },
    ],
  },
  {
    id: "n-trn-2",
    category: "training",
    priority: "high",
    status: "unread",
    title: "Due in 2 days",
    description: "E&O Best Practices module due Jun 23 — 3 team members have not started.",
    timestamp: "8h ago",
    timestampMs: now - 8 * hour,
    module: "Training Hub",
    moduleRoute: routes.trainingHub,
    icon: "trophy",
    actions: [
      { id: "open-training", label: "Open Training" },
      { id: "mark-complete", label: "Mark Complete" },
    ],
  },
  {
    id: "n-trn-3",
    category: "training",
    priority: "medium",
    status: "read",
    title: "Training expired",
    description: "Cyber Liability Product Overview certification expired for Kyle Nguyen — renewal required.",
    timestamp: "2d ago",
    timestampMs: now - 2 * day,
    module: "Training Hub",
    moduleRoute: routes.trainingHub,
    icon: "trophy",
    actions: [
      { id: "open-training", label: "Open Training" },
      { id: "mark-complete", label: "Mark Complete" },
    ],
  },
  {
    id: "n-trn-4",
    category: "training",
    priority: "low",
    status: "read",
    title: "SOP updated",
    description: "Send Center proposal workflow SOP v2.4 published — review changes before next send.",
    timestamp: "3d ago",
    timestampMs: now - 3 * day,
    module: "Training Hub",
    moduleRoute: routes.trainingHub,
    icon: "trophy",
    actions: [
      { id: "open-training", label: "Open Training" },
    ],
  },
  {
    id: "n-sys-1",
    category: "system",
    priority: "high",
    status: "unread",
    title: "AgencyZoom sync failed",
    description: "Last sync failed at 6:12 AM — 14 records could not be pushed to AgencyZoom.",
    timestamp: "3h ago",
    timestampMs: now - 3 * hour,
    module: "VA Operations",
    moduleRoute: routes.vaOperations,
    icon: "refresh",
    actions: [
      { id: "view-logs", label: "View Logs" },
      { id: "retry-sync", label: "Retry Sync" },
    ],
  },
  {
    id: "n-sys-2",
    category: "system",
    priority: "medium",
    status: "unread",
    title: "Slack webhook failed",
    description: "Send Center delivery webhook returned 503 — 2 proposal notifications not delivered.",
    timestamp: "5h ago",
    timestampMs: now - 5 * hour,
    module: "Send Center",
    moduleRoute: routes.sendCenter,
    icon: "refresh",
    actions: [
      { id: "view-logs", label: "View Logs" },
      { id: "retry-sync", label: "Retry Sync" },
    ],
  },
  {
    id: "n-sys-3",
    category: "system",
    priority: "low",
    status: "read",
    title: "Monday sync delayed",
    description: "Monday.com board sync running 12 minutes behind schedule — no action required.",
    timestamp: "7h ago",
    timestampMs: now - 7 * hour,
    module: "VA Operations",
    moduleRoute: routes.vaOperations,
    icon: "refresh",
    actions: [
      { id: "view-logs", label: "View Logs" },
    ],
  },
  {
    id: "n-sys-4",
    category: "system",
    priority: "medium",
    status: "unread",
    title: "Carrier market updated",
    description: "Travelers BOP appetite expanded to landscaping accounts in TX — review Carrier Library.",
    timestamp: "1d ago",
    timestampMs: now - day,
    module: "Carrier Library",
    moduleRoute: routes.carrierLibrary,
    icon: "refresh",
    actions: [
      { id: "open", label: "Open" },
    ],
  },
  {
    id: "n-sc-1",
    category: "urgent",
    priority: "medium",
    status: "unread",
    title: "Proposal not viewed",
    description: "Greenline Logistics renewal proposal sent 4 days ago — client has not opened.",
    timestamp: "4h ago",
    timestampMs: now - 4 * hour,
    module: "Send Center",
    moduleRoute: `${routes.sendCenter}?view=sent`,
    icon: "send",
    actions: [
      { id: "open", label: "Open" },
      { id: "resolve", label: "Resolve" },
    ],
  },
  {
    id: "n-sc-2",
    category: "urgent",
    priority: "low",
    status: "read",
    title: "Proposal opened",
    description: "Martinez Landscaping opened proposal 4 times — high engagement detected.",
    timestamp: "30m ago",
    timestampMs: now - 30 * 60 * 1000,
    module: "Send Center",
    moduleRoute: routes.sendCenterProposal("prop-martinez"),
    icon: "send",
    actions: [
      { id: "open", label: "Open" },
    ],
  },
  {
    id: "n-va-1",
    category: "urgent",
    priority: "high",
    status: "unread",
    title: "DNC flag triggered",
    description: "Lead #4821 marked Do Not Contact — outreach queue item requires review.",
    timestamp: "1h ago",
    timestampMs: now - hour,
    module: "VA Operations",
    moduleRoute: `${routes.vaOperations}?view=dnc-log`,
    icon: "flag",
    actions: [
      { id: "open", label: "Open" },
      { id: "resolve", label: "Resolve" },
    ],
  },
  {
    id: "n-va-2",
    category: "urgent",
    priority: "critical",
    status: "unread",
    title: "Speed to lead breach",
    description: "New commercial lead unassigned for 22 minutes — SLA threshold is 15 minutes.",
    timestamp: "22m ago",
    timestampMs: now - 22 * 60 * 1000,
    module: "VA Operations",
    moduleRoute: routes.vaOperations,
    icon: "flag",
    actions: [
      { id: "open", label: "Open" },
      { id: "assign", label: "Assign" },
      { id: "resolve", label: "Resolve" },
    ],
  },
  {
    id: "n-bl-1",
    category: "urgent",
    priority: "critical",
    status: "unread",
    title: "No bilingual support assigned",
    description: "Atlas Roofing requires Mandarin support — no bilingual VA assigned.",
    timestamp: "45m ago",
    timestampMs: now - 45 * 60 * 1000,
    module: "VA Operations",
    moduleRoute: `${routes.vaOperations}?view=bilingual-queue`,
    icon: "globe",
    actions: [{ id: "open", label: "Open" }, { id: "assign", label: "Assign VA" }],
  },
  {
    id: "n-bl-2",
    category: "urgent",
    priority: "critical",
    status: "unread",
    title: "Proposal sent in wrong language",
    description: "Martinez Landscaping proposal sent in English — client prefers Spanish.",
    timestamp: "2h ago",
    timestampMs: now - 2 * hour,
    module: "Send Center",
    moduleRoute: routes.sendCenterProposal("prop-martinez"),
    icon: "send",
    actions: [{ id: "open", label: "Open" }, { id: "translate", label: "Translate" }],
  },
  {
    id: "n-bl-3",
    category: "system",
    priority: "high",
    status: "unread",
    title: "Intake incomplete — language mismatch",
    description: "Kim Auto Shop intake blocked — Korean labels needed for signed application.",
    timestamp: "3h ago",
    timestampMs: now - 3 * hour,
    module: "Intake Forms",
    moduleRoute: routes.intakeForms,
    icon: "clipboard",
    actions: [{ id: "open", label: "Open" }],
  },
  {
    id: "n-bl-4",
    category: "system",
    priority: "high",
    status: "unread",
    title: "Payment reminder not localized",
    description: "Greenline Logistics payment reminder sent in English — billing language is Portuguese.",
    timestamp: "5h ago",
    timestampMs: now - 5 * hour,
    module: "ePayPolicy",
    moduleRoute: routes.epayPolicy,
    icon: "dollar",
    actions: [{ id: "open", label: "Open" }],
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

export function filterNotifications(
  notifications: AppNotification[],
  tab: NotificationFilterTab,
  priorityFilter: NotificationPriority | "all",
): AppNotification[] {
  const nowMs = Date.now();
  return notifications
    .filter((n) => isNotificationVisible(n, nowMs))
    .filter((n) => tab === "all" || n.category === tab)
    .filter((n) => priorityFilter === "all" || n.priority === priorityFilter)
    .sort((a, b) => b.timestampMs - a.timestampMs);
}

export function countUnread(notifications: AppNotification[]): number {
  return notifications.filter(
    (n) => isNotificationVisible(n) && n.status === "unread",
  ).length;
}

export function hasCriticalUnread(notifications: AppNotification[]): boolean {
  return notifications.some(
    (n) =>
      isNotificationVisible(n) &&
      n.status === "unread" &&
      n.priority === "critical",
  );
}

export function hasUrgentUnread(notifications: AppNotification[]): boolean {
  return notifications.some(
    (n) =>
      isNotificationVisible(n) &&
      n.status === "unread" &&
      n.category === "urgent",
  );
}

export function tabCount(
  notifications: AppNotification[],
  tab: NotificationFilterTab,
): number {
  const nowMs = Date.now();
  return notifications.filter(
    (n) =>
      isNotificationVisible(n, nowMs) &&
      (tab === "all" || n.category === tab) &&
      n.status === "unread",
  ).length;
}
