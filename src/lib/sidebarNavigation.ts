import type { AppIconName } from "@/components/ui/AppIcon";
import type { AccessTarget } from "@/data/subscriptionTiers";
import { HUB_THEMES } from "@/lib/hubThemes";
import { routes } from "@/lib/routes";

export const SIDEBAR_COLLAPSED_STORAGE_KEY = "agency-os-sidebar-collapsed";

export type SidebarNavKey =
  | "dashboard"
  | "va-operations"
  | "commercial"
  | "farmers-edge"
  | "intake-forms"
  | "training-hub"
  | "carrier-library"
  | "epay-policy"
  | "global-search"
  | "send-center"
  | "analytics"
  | "audit-logs";

export type SidebarNavAction = "audit-log";

export type SidebarNavItem = {
  key: SidebarNavKey;
  label: string;
  icon: AppIconName;
  /** Hub accent hex: drives active state */
  accent: string;
  accentClass: string;
  href?: string;
  module?: AccessTarget;
  action?: SidebarNavAction;
  badge?: string | number;
  /** When true, item is shown but may be gated by role (e.g. audit log) */
  ownerOnly?: boolean;
};

export const sidebarNavItems: SidebarNavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "home",
    accent: HUB_THEMES.vaOperations.navAccent,
    accentClass: "dashboard",
    href: `${routes.vaOperations}?view=overview`,
    module: "va-operations",
  },
  {
    key: "va-operations",
    label: "VA Operations",
    icon: "users",
    accent: HUB_THEMES.vaOperations.navAccent,
    accentClass: "va",
    href: `${routes.vaOperations}?view=tasks`,
    module: "va-operations",
    badge: 12,
  },
  {
    key: "commercial",
    label: "Commercial Hub",
    icon: "target",
    accent: HUB_THEMES.commercial.navAccent,
    accentClass: "commercial",
    href: routes.commercialHub,
    module: "commercial",
    badge: 4,
  },
  {
    key: "farmers-edge",
    label: "Farmers Edge",
    icon: "telescope",
    accent: HUB_THEMES.farmersEdge.navAccent,
    accentClass: "farmers",
    href: routes.farmersEdge,
    module: "farmers-edge",
  },
  {
    key: "intake-forms",
    label: "Intake Forms",
    icon: "clipboard",
    accent: HUB_THEMES.intakeForms.navAccent,
    accentClass: "intake",
    href: routes.intakeForms,
    module: "intake-forms",
    badge: 3,
  },
  {
    key: "training-hub",
    label: "Training Hub",
    icon: "trophy",
    accent: HUB_THEMES.training.navAccent,
    accentClass: "training",
    href: routes.trainingHub,
    module: "training-hub",
  },
  {
    key: "carrier-library",
    label: "Carrier Library",
    icon: "shield",
    accent: HUB_THEMES.carrierLibrary.navAccent,
    accentClass: "carrier",
    href: routes.carrierLibrary,
    module: "carrier-library",
  },
  {
    key: "epay-policy",
    label: "ePayPolicy",
    icon: "dollar",
    accent: HUB_THEMES.ePayPolicy.navAccent,
    accentClass: "epay",
    href: routes.epayPolicy,
    module: "epay-policy",
  },
  {
    key: "global-search",
    label: "Global Search",
    icon: "search",
    accent: HUB_THEMES.globalSearch.navAccent,
    accentClass: "search",
    href: routes.globalSearch,
    module: "global-search",
  },
  {
    key: "send-center",
    label: "Send Center",
    icon: "send",
    accent: HUB_THEMES.sendCenter.navAccent,
    accentClass: "send",
    href: routes.sendCenter,
    module: "send-center",
    badge: 2,
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: "bar-chart",
    accent: HUB_THEMES.analytics.navAccent,
    accentClass: "analytics",
    href: routes.analytics,
    module: "analytics",
  },
  {
    key: "audit-logs",
    label: "Audit Logs",
    icon: "file-text",
    accent: "#64748b",
    accentClass: "audit",
    action: "audit-log",
    ownerOnly: true,
  },
];

export function isSidebarNavActive(
  pathname: string,
  searchParams: URLSearchParams,
  item: SidebarNavItem,
): boolean {
  if (item.action === "audit-log") return false;

  const href = item.href;
  if (!href) return false;

  const view = searchParams.get("view");

  if (item.key === "dashboard") {
    const onVa =
      pathname === routes.vaOperations ||
      pathname.startsWith(`${routes.vaOperations}/`) ||
      pathname === routes.home ||
      pathname === "/dashboard";
    return onVa && (!view || view === "overview");
  }

  if (item.key === "va-operations") {
    const onVa =
      pathname === routes.vaOperations || pathname.startsWith(`${routes.vaOperations}/`);
    return onVa && Boolean(view && view !== "overview");
  }

  const [path] = href.split("?");
  if (path === routes.vaOperations) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}

export function sidebarAccentStyle(accent: string): Record<string, string> {
  return {
    "--sidebar-item-accent": accent,
    "--sidebar-item-glow": `color-mix(in srgb, ${accent} 22%, transparent)`,
    "--sidebar-item-bg": `color-mix(in srgb, ${accent} 10%, transparent)`,
    "--sidebar-item-bg-active": `color-mix(in srgb, ${accent} 12%, transparent)`,
  };
}
