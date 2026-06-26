import type { AppIconName } from "@/components/ui/AppIcon";
import { navItems, routes } from "@/lib/routes";

export type CommandPaletteAction = {
  id: string;
  label: string;
  href: string;
  icon: AppIconName;
  hub: string;
  keywords: string[];
  pinned?: boolean;
};

/** Always-visible shortcuts when the palette opens. */
export const pinnedPaletteActions: CommandPaletteAction[] = [
  {
    id: "create-note",
    label: "Create AZ Note",
    href: `${routes.commercialHub}?view=submissions&action=create-note`,
    icon: "file-text",
    hub: "Commercial Hub",
    keywords: ["create", "note", "az", "agency zoom", "internal"],
    pinned: true,
  },
  {
    id: "flag-followup",
    label: "Flag Follow-Up",
    href: `${routes.commercialHub}?view=follow-ups&action=flag`,
    icon: "flag",
    hub: "Commercial Hub",
    keywords: ["flag", "follow", "follow-up", "urgent", "escalate"],
    pinned: true,
  },
  {
    id: "open-producer",
    label: "Open Producer Scorecard",
    href: routes.producer,
    icon: "bar-chart",
    hub: "Commercial Hub",
    keywords: ["producer", "scorecard", "kpi", "production"],
    pinned: true,
  },
  {
    id: "open-send",
    label: "Open Send Center",
    href: routes.sendCenter,
    icon: "send",
    hub: "Send Center",
    keywords: ["send", "proposal", "draft", "center"],
    pinned: true,
  },
  {
    id: "open-commercial-records",
    label: "Open Commercial Records",
    href: `${routes.commercialHub}?view=submissions`,
    icon: "clipboard",
    hub: "Commercial Hub",
    keywords: ["commercial", "records", "submissions", "clients", "pipeline"],
    pinned: true,
  },
];

const extraModuleJumpActions: CommandPaletteAction[] = [
  {
    id: "jump-producer",
    label: "Go to Producer Scorecard",
    href: routes.producer,
    icon: "bar-chart",
    hub: "Commercial Hub",
    keywords: ["producer", "scorecard", "jump", "go"],
  },
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
  ...navItems.map((item) => ({
    id: `jump-${item.key}`,
    label: `Go to ${item.label}`,
    href: item.href,
    icon: moduleIcon(item.key),
    hub: item.label,
    keywords: [item.label, item.key, "jump", "open", "module", "hub", "go"],
  })),
  ...extraModuleJumpActions,
]);

export const allPaletteActions: CommandPaletteAction[] = dedupePaletteActions([
  ...pinnedPaletteActions,
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
    id: "new-submission",
    label: "New Submission",
    href: `${routes.intakeForms}?view=new-submission`,
    icon: "plus",
    hub: "Intake Forms",
    keywords: ["intake", "form", "submit"],
  },
  {
    id: "new-invoice",
    label: "New Invoice",
    href: `${routes.epayPolicy}?view=builder`,
    icon: "dollar",
    hub: "ePayPolicy",
    keywords: ["invoice", "payment", "epay"],
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
