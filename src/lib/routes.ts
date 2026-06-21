export const routes = {
  home: "/",
  login: "/login",
  producer: "/producer",
  retention: "/retention",
  commercial: "/commercial",
  commercialHub: "/commercial-hub",
  intakeForms: "/intake-forms",
  trainingHub: "/training-hub",
  carrierLibrary: "/carrier-library",
  epayPolicy: "/epay-policy",
  sendCenter: "/send-center",
  sendCenterProposal: (id: string) => `/send-center/proposal/${id}`,
  globalSearch: "/global-search",
  primeAgency: "/prime-agency",
  vaOperations: "/va-operations",
  systemHealth: "/system-health",
  /** @deprecated Use routes.producer */
  production: "/production",
} as const;

export type AppModule =
  | "producer"
  | "retention"
  | "commercial"
  | "intake-forms"
  | "training-hub"
  | "carrier-library"
  | "epay-policy"
  | "send-center"
  | "global-search"
  | "prime-agency"
  | "va-operations";

export const navItems: {
  key: AppModule;
  label: string;
  href: string;
  icon: string;
}[] = [
  { key: "va-operations", label: "VA Operations", href: routes.vaOperations, icon: "◆" },
  { key: "commercial", label: "Commercial Hub", href: routes.commercialHub, icon: "▤" },
  { key: "intake-forms", label: "Intake Forms", href: routes.intakeForms, icon: "▦" },
  { key: "training-hub", label: "Training Hub", href: routes.trainingHub, icon: "▧" },
  { key: "carrier-library", label: "Carrier Library", href: routes.carrierLibrary, icon: "▨" },
  { key: "epay-policy", label: "ePayPolicy", href: routes.epayPolicy, icon: "▩" },
  { key: "send-center", label: "Send Center", href: routes.sendCenter, icon: "▪" },
];
