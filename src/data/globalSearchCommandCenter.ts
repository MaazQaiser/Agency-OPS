import type { AppIconName } from "@/components/ui/AppIcon";
import { routes } from "@/lib/routes";
import type { GlobalSearchResult } from "./globalSearch";
import { searchResults } from "./globalSearch";

export type CommandCenterSection =
  | "Clients"
  | "Tasks"
  | "Policies"
  | "Alerts"
  | "Carriers"
  | "Documents";

export const commandCenterSectionOrder: CommandCenterSection[] = [
  "Clients",
  "Tasks",
  "Policies",
  "Alerts",
  "Carriers",
  "Documents",
];

export const commandCenterResultsPerSection = 3;

export const commandCenterSectionSubtitles: Record<CommandCenterSection, string> = {
  Clients: "Policy count · Assigned VA · Current hub · Risk state",
  Tasks: "Pending bind · Missing docs · Approval waiting · Follow-up overdue",
  Policies: "Active renewals · Failed payments · Upcoming expirations",
  Alerts: "SLA breaches · High-risk accounts · Approval misses · Folio warnings",
  Carriers: "Appetite status · Bind rate · Submission volume · Market fit",
  Documents: "Missing docs · AZ notes · Internal flags · Producer comments",
};

export type RecentSearchCard = {
  id: string;
  term: string;
  hub: string;
  activity: string;
  status: string;
  riskLevel?: "High" | "Medium" | "Low";
};

export const recentSearchCardCatalog: RecentSearchCard[] = [
  {
    id: "rc-martinez",
    term: "Martinez Landscaping",
    hub: "Commercial Hub",
    activity: "Pending Docs",
    status: "High Risk",
    riskLevel: "High",
  },
  {
    id: "rc-bind",
    term: "Pending Bind",
    hub: "Commercial Hub",
    activity: "Ready to Bind",
    status: "2 accounts",
    riskLevel: "Medium",
  },
  {
    id: "rc-markel",
    term: "Markel BOP",
    hub: "Carrier Library",
    activity: "Carrier lookup",
    status: "Open appetite",
    riskLevel: "Low",
  },
  {
    id: "rc-overdue",
    term: "Overdue Invoices",
    hub: "ePayPolicy",
    activity: "Failed payments",
    status: "3 overdue",
    riskLevel: "High",
  },
  {
    id: "rc-loss",
    term: "Missing Loss Runs",
    hub: "Commercial Hub",
    activity: "Document blocker",
    status: "Critical",
    riskLevel: "High",
  },
];

export type SavedSearchShortcut = {
  id: string;
  label: string;
  query: string;
  count: number;
  hub: string;
};

export const savedSearchShortcuts: SavedSearchShortcut[] = [
  { id: "ss-overdue", label: "Overdue Payments", query: "overdue payment", count: 3, hub: "ePayPolicy" },
  { id: "ss-bind", label: "Pending Binds", query: "pending bind", count: 2, hub: "Commercial Hub" },
  { id: "ss-risk", label: "High Risk Accounts", query: "high risk", count: 4, hub: "Commercial Hub" },
  { id: "ss-docs", label: "Missing Docs", query: "missing docs", count: 5, hub: "Commercial Hub" },
  { id: "ss-renewals", label: "Renewals This Week", query: "renewals", count: 7, hub: "Commercial Hub" },
];

export type TeamSearchActivityItem = {
  id: string;
  userId: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
};

export const teamSearchActivityFeed: TeamSearchActivityItem[] = [
  {
    id: "tsa-1",
    userId: "eva-chong",
    user: "Eva",
    action: "searched Pending Bind",
    module: "Commercial Hub",
    timestamp: "2 mins ago",
  },
  {
    id: "tsa-2",
    userId: "pedro-alvarez",
    user: "Pedro",
    action: "opened Missing Docs",
    module: "Commercial Hub",
    timestamp: "8 mins ago",
  },
  {
    id: "tsa-3",
    userId: "jojo",
    user: "JoJo",
    action: "searched High Exposure Accounts",
    module: "Commercial Hub",
    timestamp: "14 mins ago",
  },
  {
    id: "tsa-4",
    userId: "valerie",
    user: "Valerie",
    action: "opened INV-2042",
    module: "ePayPolicy",
    timestamp: "22 mins ago",
  },
  {
    id: "tsa-5",
    userId: "tracie-wong",
    user: "Tracie",
    action: "searched Kim Auto Shop",
    module: "Commercial Hub",
    timestamp: "35 mins ago",
  },
];

export type CommandCenterQuickAction = {
  id: string;
  label: string;
  icon: AppIconName;
  href: string;
  toastMessage?: string;
};

export const commandCenterQuickActions: CommandCenterQuickAction[] = [
  {
    id: "create-note",
    label: "Create AZ Note",
    icon: "file-text",
    href: `${routes.commercialHub}?view=submissions&action=create-note`,
    toastMessage: "AZ note composer opened",
  },
  {
    id: "flag-followup",
    label: "Flag Follow-Up",
    icon: "flag",
    href: `${routes.commercialHub}?view=follow-ups&action=flag`,
    toastMessage: "Follow-up flagged",
  },
  {
    id: "open-send",
    label: "Open Send Center",
    icon: "send",
    href: routes.sendCenter,
  },
  {
    id: "assign-va",
    label: "Assign VA",
    icon: "user-plus",
    href: `${routes.vaOperations}?view=tasks&action=assign`,
    toastMessage: "Assignment panel ready",
  },
  {
    id: "review-policy",
    label: "Review Policy",
    icon: "shield",
    href: `${routes.commercialHub}?view=quote-review`,
  },
  {
    id: "add-reminder",
    label: "Add Reminder",
    icon: "bell",
    href: `${routes.commercialHub}?view=follow-ups&action=reminder`,
    toastMessage: "Reminder scheduled",
  },
  {
    id: "producer-scorecard",
    label: "Open Producer Scorecard",
    icon: "bar-chart",
    href: routes.producer,
  },
];

export function resolveRecentSearchCard(term: string): RecentSearchCard {
  const match = recentSearchCardCatalog.find(
    (card) => card.term.toLowerCase() === term.trim().toLowerCase(),
  );
  if (match) return match;
  return {
    id: `recent-${term}`,
    term,
    hub: "All Modules",
    activity: "Recent search",
    status: "—",
  };
}

export function resolveCommandCenterSection(result: GlobalSearchResult): CommandCenterSection {
  if (result.section) return result.section;

  if (result.type === "client") return "Clients";

  if (result.type === "task") return "Tasks";

  const status = result.status.toLowerCase();
  if (
    result.type === "submission" &&
    (status.includes("pending") ||
      status.includes("missing") ||
      status.includes("approval") ||
      status.includes("bind"))
  ) {
    return "Tasks";
  }

  if (
    result.type === "invoice" ||
    status.includes("renewal") ||
    status.includes("bound") ||
    status.includes("active") ||
    result.fields.some((f) => f.label === "Renewal Date")
  ) {
    return "Policies";
  }

  if (
    status.includes("overdue") ||
    status.includes("failed") ||
    status.includes("critical") ||
    status.includes("breach") ||
    result.fields.some((f) => f.label === "Priority" && f.value === "High") ||
    result.fields.some((f) => f.label === "E&O Risk")
  ) {
    return "Alerts";
  }

  if (
    result.type === "document" ||
    result.drawer.notes.length > 0 ||
    result.fields.some((f) => f.label === "Note Type")
  ) {
    return "Documents";
  }

  if (result.type === "carrier") return "Carriers";

  if (result.type === "submission") return "Tasks";
  if (result.type === "training" || result.type === "user") {
    return "Documents";
  }

  return "Alerts";
}

export function getEntityQuickActions(result: GlobalSearchResult): CommandCenterQuickAction[] {
  const actions: CommandCenterQuickAction[] = [
    {
      id: "open-entity",
      label: result.type === "client" ? "Open Client Profile" : `Open ${result.group}`,
      icon: "target",
      href: result.href,
    },
  ];

  if (result.type === "client" || result.type === "submission") {
    actions.push(
      {
        id: "create-note",
        label: "Create AZ Note",
        icon: "file-text",
        href: `${routes.commercialHub}?view=submissions&action=create-note`,
        toastMessage: "Note composer ready",
      },
      {
        id: "send-proposal",
        label: "Send Proposal",
        icon: "send",
        href: routes.sendCenter,
      },
      {
        id: "flag-followup",
        label: "Flag Follow-Up",
        icon: "flag",
        href: `${routes.commercialHub}?view=follow-ups&action=flag`,
        toastMessage: "Issue flagged",
      },
    );
  }

  if (result.type === "invoice") {
    actions.push(
      {
        id: "send-reminder",
        label: "Send Payment Reminder",
        icon: "bell",
        href: `${routes.epayPolicy}?view=tracker`,
        toastMessage: "Reminder queued",
      },
      {
        id: "reconcile",
        label: "Reconcile Trust",
        icon: "check",
        href: `${routes.epayPolicy}?view=trust&action=reconcile`,
      },
    );
  }

  if (result.type === "carrier") {
    actions.push({
      id: "open-carrier",
      label: "Open Carrier Detail",
      icon: "shield",
      href: result.href,
    });
  }

  if (result.type === "training") {
    actions.push({
      id: "assign-training",
      label: "Assign Training",
      icon: "trophy",
      href: `${routes.trainingHub}?view=library&action=assign`,
      toastMessage: "Assignment panel ready",
    });
  }

  actions.push({
    id: "assign-va",
    label: "Assign Task",
    icon: "user-plus",
    href: `${routes.vaOperations}?view=tasks&action=assign`,
    toastMessage: "Task assignment opened",
  });

  return actions;
}

export function getLinkedRecords(result: GlobalSearchResult): { label: string; value: string }[] {
  const linked: { label: string; value: string }[] = [];
  for (const policy of result.drawer.policies ?? []) {
    linked.push({ label: policy.label, value: policy.value });
  }
  for (const item of result.drawer.openItems ?? []) {
    linked.push({ label: item.label, value: item.value });
  }
  for (const field of result.fields.slice(0, 4)) {
    if (!linked.some((l) => l.label === field.label)) {
      linked.push({ label: field.label, value: field.value });
    }
  }
  return linked.slice(0, 6);
}

export function getRecentActivity(result: GlobalSearchResult): string[] {
  const activity: string[] = [];
  activity.push(`Last updated ${result.lastUpdated}`);
  if (result.owner) activity.push(`${result.owner} is assigned`);
  for (const note of result.drawer.notes.slice(0, 2)) {
    activity.push(note);
  }
  return activity;
}

export function groupByCommandCenterSection(
  results: GlobalSearchResult[],
): Record<CommandCenterSection, GlobalSearchResult[]> {
  const grouped = Object.fromEntries(
    commandCenterSectionOrder.map((section) => [section, [] as GlobalSearchResult[]]),
  ) as Record<CommandCenterSection, GlobalSearchResult[]>;

  for (const result of results) {
    const section = resolveCommandCenterSection(result);
    grouped[section].push(result);
  }
  return grouped;
}

export function getLiveCommandCenterSections(limitPerSection = commandCenterResultsPerSection) {
  const grouped = groupByCommandCenterSection(searchResults);
  const trimmed = {} as Record<CommandCenterSection, GlobalSearchResult[]>;
  for (const section of commandCenterSectionOrder) {
    trimmed[section] = grouped[section].slice(0, limitPerSection);
  }
  return trimmed;
}

export function getSectionTotals(results: GlobalSearchResult[] = searchResults) {
  const grouped = groupByCommandCenterSection(results);
  const totals = {} as Record<CommandCenterSection, number>;
  for (const section of commandCenterSectionOrder) {
    totals[section] = grouped[section].length;
  }
  return totals;
}

export function getResultPriority(result: GlobalSearchResult): string {
  if (result.priority) return result.priority;
  const pri = result.fields.find((f) => f.label === "Priority");
  if (pri) return pri.value;
  const risk = result.riskState ?? result.fields.find((f) => f.label === "E&O Risk")?.value;
  if (risk?.toLowerCase().includes("high") || result.status.toLowerCase().includes("overdue")) {
    return "High";
  }
  if (result.status.toLowerCase().includes("pending")) return "Medium";
  return "Low";
}

export function getFieldValue(result: GlobalSearchResult, label: string): string | undefined {
  return result.fields.find((f) => f.label === label)?.value;
}
