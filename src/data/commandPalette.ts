import type { AppIconName } from "@/components/ui/AppIcon";
import { sidebarNavItems } from "@/lib/sidebarNavigation";
import { routes } from "@/lib/routes";

export type CommandPaletteAction = {
  id: string;
  label: string;
  href: string;
  icon: AppIconName;
  hub: string;
  keywords: string[];
  pinned?: boolean;
};

export type PaletteTabId = "all" | "search" | "actions" | "ai";

export const paletteTabs: { id: PaletteTabId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "search", label: "Search" },
  { id: "actions", label: "Actions" },
  { id: "ai", label: "AI" },
];

export type PaletteAiGuidance = {
  id: string;
  label: string;
  query: string;
};

export const paletteAiGuidance: PaletteAiGuidance[] = [
  { id: "ai-q-overdue", label: "Show overdue invoices", query: "overdue invoices" },
  { id: "ai-q-renewals", label: "Find high-risk renewals", query: "high risk renewals" },
  { id: "ai-q-retention", label: "Who has lowest retention?", query: "lowest retention producer" },
  { id: "ai-q-martinez", label: "Open Martinez Landscaping", query: "Martinez Landscaping" },
];

/** Verb-first operational actions: Suggested Actions group */
export const suggestedPaletteActions: CommandPaletteAction[] = [
  {
    id: "create-submission",
    label: "Create New Submission",
    href: `${routes.intakeForms}?view=new-submission`,
    icon: "plus",
    hub: "Intake Forms",
    keywords: ["create", "submission", "intake", "new"],
    pinned: true,
  },
  {
    id: "create-invoice",
    label: "Create Invoice",
    href: `${routes.epayPolicy}?view=builder`,
    icon: "dollar",
    hub: "ePayPolicy",
    keywords: ["create", "invoice", "payment", "epay"],
    pinned: true,
  },
  {
    id: "assign-training",
    label: "Assign Training",
    href: `${routes.trainingHub}?view=library&action=assign`,
    icon: "trophy",
    hub: "Training Hub",
    keywords: ["assign", "training", "certification", "course"],
    pinned: true,
  },
  {
    id: "send-proposal",
    label: "Send Proposal",
    href: `${routes.sendCenter}?view=drafts&action=send`,
    icon: "send",
    hub: "Send Center",
    keywords: ["send", "proposal", "draft", "deliver"],
    pinned: true,
  },
  {
    id: "reconcile-trust",
    label: "Reconcile Trust",
    href: `${routes.epayPolicy}?view=trust&action=reconcile`,
    icon: "check",
    hub: "ePayPolicy",
    keywords: ["reconcile", "trust", "funds", "account"],
    pinned: true,
  },
  {
    id: "open-pending-reviews",
    label: "Open Pending Reviews",
    href: `${routes.sendCenter}?view=pending`,
    icon: "clipboard",
    hub: "Send Center",
    keywords: ["pending", "review", "approval", "sla"],
    pinned: true,
  },
  {
    id: "open-producer-scorecard",
    label: "Open Producer Scorecard",
    href: routes.producer,
    icon: "bar-chart",
    hub: "Producer",
    keywords: ["producer", "scorecard", "kpi", "performance"],
    pinned: true,
  },
  {
    id: "open-client-profile",
    label: "Open Client Profile",
    href: `${routes.commercialHub}?view=submissions`,
    icon: "users",
    hub: "Commercial Hub",
    keywords: ["client", "profile", "account", "open"],
    pinned: true,
  },
];

/** @deprecated Use suggestedPaletteActions */
export const pinnedPaletteActions = suggestedPaletteActions;

const extraModuleJumpActions: CommandPaletteAction[] = [
  {
    id: "jump-retention",
    label: "Go to Retention Hub",
    href: routes.retention,
    icon: "users",
    hub: "Retention",
    keywords: ["retention", "renewal", "jump", "go"],
  },
];

function dedupePaletteActions(actions: CommandPaletteAction[]): CommandPaletteAction[] {
  const seen = new Set<string>();
  return actions.filter((action) => {
    if (seen.has(action.id)) return false;
    seen.add(action.id);
    return true;
  });
}

export const moduleJumpActions: CommandPaletteAction[] = dedupePaletteActions([
  ...sidebarNavItems
    .filter((item) => item.href && item.module)
    .map((item) => ({
      id: `jump-${item.key}`,
      label: `Go to ${item.label}`,
      href: item.href!.split("?")[0] ?? item.href!,
      icon: moduleIcon(item.module ?? item.key),
      hub: item.label,
      keywords: [item.label, item.key, "jump", "open", "module", "hub", "go"],
    })),
  ...extraModuleJumpActions,
]);

export const allPaletteActions: CommandPaletteAction[] = dedupePaletteActions([
  ...suggestedPaletteActions,
  ...moduleJumpActions,
  {
    id: "review-approvals",
    label: "Review Pending Approvals",
    href: `${routes.vaOperations}?view=approvals`,
    icon: "shield",
    hub: "VA Operations",
    keywords: ["approve", "approval", "pending"],
  },
  {
    id: "missing-docs",
    label: "Open Missing Docs",
    href: `${routes.commercialHub}?view=missing-docs`,
    icon: "folder",
    hub: "Commercial Hub",
    keywords: ["documents", "missing"],
  },
]);

export const hubGroupOrder: string[] = [
  "Commercial Hub",
  "VA Operations",
  "Send Center",
  "Retention",
  "ePayPolicy",
  "Carrier Library",
  "Intake Forms",
  "Training Hub",
];

function moduleIcon(key: string): AppIconName {
  switch (key) {
    case "va-operations":
      return "users";
    case "commercial":
      return "target";
    case "intake-forms":
      return "plus";
    case "training-hub":
      return "trophy";
    case "carrier-library":
      return "shield";
    case "epay-policy":
      return "dollar";
    case "send-center":
      return "send";
    case "farmers-edge":
      return "telescope";
    case "analytics":
      return "bar-chart";
    case "global-search":
      return "search";
    default:
      return "search";
  }
}

export function filterPaletteActions(
  query: string,
  actions: CommandPaletteAction[] = allPaletteActions,
): CommandPaletteAction[] {
  const q = query.trim().toLowerCase();
  if (!q) return actions;
  return actions.filter(
    (action) =>
      action.label.toLowerCase().includes(q) ||
      action.hub.toLowerCase().includes(q) ||
      action.keywords.some(
        (kw) => kw.includes(q) || q.includes(kw) || q.split(/\s+/).every((t) => kw.includes(t)),
      ),
  );
}
