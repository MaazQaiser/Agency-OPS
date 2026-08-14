import { routes } from "@/lib/routes";

export type HubThemeId =
  | "vaOperations"
  | "commercial"
  | "farmersEdge"
  | "intakeForms"
  | "training"
  | "carrierLibrary"
  | "ePayPolicy"
  | "sendCenter"
  | "analytics"
  | "globalSearch";

export type HubTheme = {
  id: HubThemeId;
  label: string;
  primary: string;
  deep: string;
  glow: string;
  background: string;
  moduleClass: string;
  /**
   * Accent used on dark chrome (sidebar / mobile nav) when primary
   * would fail contrast. Defaults to primary.
   */
  navAccent: string;
};

const WORKSPACE_BACKGROUND = "#F7FBFD";
const OBSIDIAN_WORKSPACE = "#0A0C10";

export type AppColorMode = "light" | "obsidian";

/** Commercial Hub is the only light workspace; every other route is obsidian. */
export function colorModeForHub(hubId: HubThemeId | null): AppColorMode {
  return hubId === "commercial" ? "light" : "obsidian";
}

export const HUB_THEMES: Record<HubThemeId, HubTheme> = {
  vaOperations: {
    id: "vaOperations",
    label: "VA Operations",
    primary: "#4F46E5",
    deep: "#3730A3",
    glow: "rgba(79,70,229,0.14)",
    background: WORKSPACE_BACKGROUND,
    moduleClass: "module-va-operations",
    navAccent: "#4F46E5",
  },
  commercial: {
    id: "commercial",
    label: "Commercial Hub",
    primary: "#0D9488",
    deep: "#0F766E",
    glow: "rgba(13,148,136,0.14)",
    background: WORKSPACE_BACKGROUND,
    moduleClass: "module-commercial-hub",
    navAccent: "#0D9488",
  },
  farmersEdge: {
    id: "farmersEdge",
    label: "Farmers Edge",
    primary: "#059669",
    deep: "#047857",
    glow: "rgba(5,150,105,0.14)",
    background: WORKSPACE_BACKGROUND,
    moduleClass: "module-farmers-edge",
    navAccent: "#059669",
  },
  intakeForms: {
    id: "intakeForms",
    label: "Intake Forms",
    primary: "#D97706",
    deep: "#B45309",
    glow: "rgba(217,119,6,0.14)",
    background: WORKSPACE_BACKGROUND,
    moduleClass: "module-intake-forms",
    navAccent: "#D97706",
  },
  training: {
    id: "training",
    label: "Training Hub",
    primary: "#7C3AED",
    deep: "#6D28D9",
    glow: "rgba(124,58,237,0.14)",
    background: WORKSPACE_BACKGROUND,
    moduleClass: "module-training-hub",
    navAccent: "#7C3AED",
  },
  carrierLibrary: {
    id: "carrierLibrary",
    label: "Carrier Library",
    primary: "#1D4ED8",
    deep: "#1E40AF",
    glow: "rgba(29,78,216,0.14)",
    background: WORKSPACE_BACKGROUND,
    moduleClass: "module-carrier-library",
    navAccent: "#1D4ED8",
  },
  ePayPolicy: {
    id: "ePayPolicy",
    label: "ePayPolicy",
    primary: "#10B981",
    deep: "#059669",
    glow: "rgba(16,185,129,0.14)",
    background: WORKSPACE_BACKGROUND,
    moduleClass: "module-epay-policy",
    navAccent: "#10B981",
  },
  sendCenter: {
    id: "sendCenter",
    label: "Send Center",
    primary: "#E11D48",
    deep: "#BE123C",
    glow: "rgba(225,29,72,0.14)",
    background: WORKSPACE_BACKGROUND,
    moduleClass: "module-send-center",
    navAccent: "#E11D48",
  },
  analytics: {
    id: "analytics",
    label: "Analytics",
    primary: "#0891B2",
    deep: "#0E7490",
    glow: "rgba(8,145,178,0.14)",
    background: WORKSPACE_BACKGROUND,
    moduleClass: "module-analytics",
    navAccent: "#0891B2",
  },
  globalSearch: {
    id: "globalSearch",
    label: "Global Search",
    primary: "#1C2B35",
    deep: "#111827",
    glow: "rgba(28,43,53,0.14)",
    background: WORKSPACE_BACKGROUND,
    moduleClass: "module-global-search",
    /* ITA sky — #1C2B35 is invisible on the dark sidebar */
    navAccent: "#AAD0E7",
  },
};

export function hubThemeCssVars(theme: HubTheme): Record<string, string> {
  const workspace =
    theme.id === "commercial" ? theme.background : OBSIDIAN_WORKSPACE;
  return {
    "--hub-primary": theme.primary,
    "--hub-deep": theme.deep,
    "--hub-glow": theme.glow,
    "--hub-background": workspace,
    "--hub-accent": theme.primary,
    "--hub-dark": theme.deep,
    "--hub-secondary": theme.deep,
    "--hub-gradient": `linear-gradient(135deg, ${theme.deep}, ${theme.primary})`,
    "--hub-bg": theme.glow,
    "--hub-label": `"${theme.label}"`,
    "--hub-nav-accent": theme.navAccent,
  };
}

export function resolveHubThemeId(pathname: string): HubThemeId | null {
  if (!pathname) return null;

  if (pathname === routes.globalSearch || pathname.startsWith(`${routes.globalSearch}/`)) {
    return "globalSearch";
  }
  if (pathname === routes.commercialHub || pathname.startsWith(`${routes.commercialHub}/`)) {
    return "commercial";
  }
  if (pathname === routes.commercial || pathname.startsWith(`${routes.commercial}/`)) {
    return "commercial";
  }
  if (pathname === routes.farmersEdge || pathname.startsWith(`${routes.farmersEdge}/`)) {
    return "farmersEdge";
  }
  if (pathname === routes.intakeForms || pathname.startsWith(`${routes.intakeForms}/`)) {
    return "intakeForms";
  }
  if (pathname === routes.trainingHub || pathname.startsWith(`${routes.trainingHub}/`)) {
    return "training";
  }
  if (pathname === routes.carrierLibrary || pathname.startsWith(`${routes.carrierLibrary}/`)) {
    return "carrierLibrary";
  }
  if (pathname === routes.epayPolicy || pathname.startsWith(`${routes.epayPolicy}/`)) {
    return "ePayPolicy";
  }
  if (pathname === routes.sendCenter || pathname.startsWith(`${routes.sendCenter}/`)) {
    return "sendCenter";
  }
  if (pathname === routes.analytics || pathname.startsWith(`${routes.analytics}/`)) {
    return "analytics";
  }
  if (pathname === routes.retention || pathname.startsWith(`${routes.retention}/`)) {
    return "vaOperations";
  }
  if (pathname === routes.primeAgency || pathname.startsWith(`${routes.primeAgency}/`)) {
    return "vaOperations";
  }
  if (
    pathname === routes.home ||
    pathname === "/dashboard" ||
    pathname === routes.vaOperations ||
    pathname.startsWith(`${routes.vaOperations}/`)
  ) {
    return "vaOperations";
  }

  return null;
}

export function hubThemeIdFromHelpAccent(
  accent: string,
): HubThemeId | null {
  switch (accent) {
    case "va":
      return "vaOperations";
    case "commercial":
      return "commercial";
    case "farmers-edge":
      return "farmersEdge";
    case "intake":
      return "intakeForms";
    case "training":
      return "training";
    case "carrier":
      return "carrierLibrary";
    case "epay":
      return "ePayPolicy";
    case "send":
      return "sendCenter";
    case "analytics":
      return "analytics";
    case "search":
      return "globalSearch";
    default:
      return null;
  }
}
