export const routes = {
  home: "/",
  login: "/login",
  welcome: "/welcome",
  dashboard: "/dashboard",
  producer: "/producer",
  retention: "/retention",
  commercial: "/commercial",
  primeAgency: "/prime-agency",
  /** @deprecated Use routes.producer */
  production: "/production",
} as const;

export type AppModule =
  | "dashboard"
  | "producer"
  | "retention"
  | "commercial"
  | "prime-agency";

export const navItems: {
  key: AppModule;
  label: string;
  href: string;
  icon: string;
}[] = [
  { key: "dashboard", label: "Dashboard", href: routes.dashboard, icon: "◈" },
  { key: "producer", label: "Producer Scorecard", href: routes.producer, icon: "▣" },
  { key: "retention", label: "Retention Scorecard", href: routes.retention, icon: "◉" },
  { key: "commercial", label: "Commercial Tracker", href: routes.commercial, icon: "▤" },
  { key: "prime-agency", label: "Prime Agency", href: routes.primeAgency, icon: "★" },
];
