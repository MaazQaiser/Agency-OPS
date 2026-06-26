import { routes } from "@/lib/routes";

export const carrierLibraryTabs = [
  { id: "search", label: "Carrier Search" },
  { id: "rules", label: "Submission Rules" },
] as const;

export type CarrierLibraryTabId = (typeof carrierLibraryTabs)[number]["id"];

export type CarrierProfileFrom = "search";

export const carrierLibraryHeader = {
  title: "Carrier Library",
  subtitle: "Appetite notes · MGA contacts · Submission checklists",
  quickActions: [
    { id: "add-carrier", label: "Add Carrier", icon: "plus" as const },
    { id: "update-market", label: "Update Market Info", icon: "refresh" as const },
  ],
};

export const carrierSearchHeader = {
  title: "Carrier Search",
  subtitle: "Find carriers by vertical, state, product, and underwriting fit.",
};

export const carrierSearchPlaceholder =
  "Search by carrier, product, vertical, or appetite";

export const carrierFilterOptions = {
  state: ["All States", "CA", "TX", "FL", "NY", "WA", "AZ", "NV"],
  productType: ["All Products", "BOP", "Workers Comp", "Commercial Auto", "GL", "Umbrella", "EPLI"],
  vertical: ["All Verticals", "Contractors", "Restaurants", "Auto Repair", "Retail", "Janitorial", "Logistics"],
  riskType: ["All Risk Types", "Preferred", "Standard", "High Risk"],
  admitted: ["All", "Admitted", "Non-Admitted"],
  submissionType: ["All Methods", "Portal", "Email", "Broker Portal", "Wholesaler"],
};

export const carrierSearchKpis = [
  {
    label: "Total Carriers",
    value: "84",
    sub: "Active in system",
    helper: "Carrier database",
    color: "primary" as const,
  },
  {
    label: "Products Available",
    value: "216",
    sub: "Across all carriers",
    helper: "Coverage options",
    color: "green" as const,
  },
  {
    label: "Top Used This Month",
    value: "14",
    sub: "Most submitted markets",
    helper: "Popular carriers",
    color: "primary" as const,
  },
  {
    label: "Pending Updates",
    value: "7",
    sub: "Need appetite review",
    helper: "Carrier data refresh",
    color: "yellow" as const,
  },
];

export type CarrierStatus = "Open Appetite" | "Restricted" | "Paused" | "Review Needed";
export type RiskType = "Preferred" | "Standard" | "High Risk";
export type SubmissionMethod = "Portal" | "Email" | "Broker Portal" | "Wholesaler";

export type CarrierRecord = {
  id: string;
  name: string;
  product: string;
  verticalAppetite: string;
  states: string;
  riskType: RiskType;
  submissionMethod: SubmissionMethod;
  mgaContact: string;
  responseTime: string;
  status: CarrierStatus;
  admitted: "Admitted" | "Non-Admitted";
  drawer: {
    summary: string;
    products: string[];
    statesList: string[];
    verticals: string[];
    submissionRequirements: string[];
    mgaEmail: string;
    mgaPhone: string;
    brokerNotes: string[];
    recentChanges: string[];
  };
};

export const carrierRecords: CarrierRecord[] = [
  {
    id: "car-markel-bop",
    name: "Markel",
    product: "BOP",
    verticalAppetite: "Contractors",
    states: "CA, TX, FL, NY",
    riskType: "Preferred",
    submissionMethod: "Portal",
    mgaContact: "John Miller",
    responseTime: "2.4 days",
    status: "Open Appetite",
    admitted: "Admitted",
    drawer: {
      summary: "Strong contractor appetite for BOP and GL with competitive terms on landscaping and light trade classes.",
      products: ["BOP", "GL", "Umbrella"],
      statesList: ["CA", "TX", "FL", "NY", "WA"],
      verticals: ["Contractors", "Janitorial", "Retail"],
      submissionRequirements: ["Signed app", "Loss runs (5 yr)", "Payroll report", "Business license"],
      mgaEmail: "jmiller@markel.com",
      mgaPhone: "(555) 234-8800",
      brokerNotes: ["Best for contractor BOP in CA", "Fast quote turnaround on clean loss history"],
      recentChanges: ["Updated contractor appetite — tree work carve-back available", "Added TX restaurant BOP"],
    },
  },
  {
    id: "car-markel-wc",
    name: "Markel",
    product: "Workers Comp",
    verticalAppetite: "Contractors",
    states: "CA, TX, NY",
    riskType: "Standard",
    submissionMethod: "Portal",
    mgaContact: "John Miller",
    responseTime: "3.1 days",
    status: "Open Appetite",
    admitted: "Admitted",
    drawer: {
      summary: "Workers comp for contractors with payroll up to $750K. Roofing class restricted.",
      products: ["Workers Comp"],
      statesList: ["CA", "TX", "NY"],
      verticals: ["Contractors"],
      submissionRequirements: ["Payroll report", "Signed app", "Experience mod worksheet"],
      mgaEmail: "jmiller@markel.com",
      mgaPhone: "(555) 234-8800",
      brokerNotes: ["Verify class codes before submit"],
      recentChanges: ["Contractor appetite updated today"],
    },
  },
  {
    id: "car-travelers-auto",
    name: "Travelers",
    product: "Commercial Auto",
    verticalAppetite: "Auto Repair",
    states: "CA, TX, FL, NY, WA",
    riskType: "Preferred",
    submissionMethod: "Broker Portal",
    mgaContact: "Sarah Chen",
    responseTime: "1.8 days",
    status: "Open Appetite",
    admitted: "Admitted",
    drawer: {
      summary: "Commercial auto for service and repair shops. Strong garagekeepers options.",
      products: ["Commercial Auto", "GL", "Garagekeepers"],
      statesList: ["CA", "TX", "FL", "NY", "WA", "AZ"],
      verticals: ["Auto Repair", "Contractors"],
      submissionRequirements: ["Driver list", "MVR reports", "Signed app", "Current dec page"],
      mgaEmail: "schen@travelers.com",
      mgaPhone: "(555) 876-2200",
      brokerNotes: ["Preferred market for auto repair in CA"],
      recentChanges: ["Paused restaurant submissions in Texas"],
    },
  },
  {
    id: "car-travelers-gl",
    name: "Travelers",
    product: "GL",
    verticalAppetite: "Contractors",
    states: "CA, TX, NY",
    riskType: "Standard",
    submissionMethod: "Broker Portal",
    mgaContact: "Sarah Chen",
    responseTime: "2.0 days",
    status: "Open Appetite",
    admitted: "Admitted",
    drawer: {
      summary: "General liability for contractors and commercial operations.",
      products: ["GL", "BOP", "Umbrella"],
      statesList: ["CA", "TX", "NY", "FL"],
      verticals: ["Contractors", "Retail"],
      submissionRequirements: ["Signed app", "Loss runs", "Operations description"],
      mgaEmail: "schen@travelers.com",
      mgaPhone: "(555) 876-2200",
      brokerNotes: [],
      recentChanges: [],
    },
  },
  {
    id: "car-cna-bop",
    name: "CNA",
    product: "BOP",
    verticalAppetite: "Restaurants",
    states: "CA, TX, FL, NY",
    riskType: "Standard",
    submissionMethod: "Email",
    mgaContact: "Mike Torres",
    responseTime: "3.5 days",
    status: "Open Appetite",
    admitted: "Admitted",
    drawer: {
      summary: "Restaurant BOP with food spoilage and property coverage options.",
      products: ["BOP", "GL", "Property"],
      statesList: ["CA", "TX", "FL", "NY"],
      verticals: ["Restaurants", "Retail"],
      submissionRequirements: ["Menu/revenue breakdown", "Liquor license if applicable", "Signed app"],
      mgaEmail: "mtorres@cna.com",
      mgaPhone: "(555) 412-3300",
      brokerNotes: ["Good for multi-location restaurant groups"],
      recentChanges: ["Added new commercial auto product"],
    },
  },
  {
    id: "car-cna-wc",
    name: "CNA",
    product: "Workers Comp",
    verticalAppetite: "Janitorial",
    states: "CA, TX, NY, FL",
    riskType: "Standard",
    submissionMethod: "Email",
    mgaContact: "Mike Torres",
    responseTime: "4.0 days",
    status: "Review Needed",
    admitted: "Admitted",
    drawer: {
      summary: "Workers comp for janitorial and cleaning services.",
      products: ["Workers Comp", "GL"],
      statesList: ["CA", "TX", "NY", "FL"],
      verticals: ["Janitorial"],
      submissionRequirements: ["Payroll by class", "Signed app", "Loss runs"],
      mgaEmail: "mtorres@cna.com",
      mgaPhone: "(555) 412-3300",
      brokerNotes: ["Requires 3 markets minimum"],
      recentChanges: ["Appetite review pending for FL"],
    },
  },
  {
    id: "car-amtrust-wc",
    name: "AmTrust",
    product: "Workers Comp",
    verticalAppetite: "Contractors",
    states: "CA, TX, FL, NY",
    riskType: "Standard",
    submissionMethod: "Portal",
    mgaContact: "Lisa Park",
    responseTime: "2.8 days",
    status: "Open Appetite",
    admitted: "Admitted",
    drawer: {
      summary: "Workers comp specialist with broad contractor appetite.",
      products: ["Workers Comp"],
      statesList: ["CA", "TX", "FL", "NY", "AZ"],
      verticals: ["Contractors", "Janitorial"],
      submissionRequirements: ["Payroll report", "Signed app"],
      mgaEmail: "lpark@amtrust.com",
      mgaPhone: "(555) 901-4400",
      brokerNotes: [],
      recentChanges: [],
    },
  },
  {
    id: "car-nationwide-bop",
    name: "Nationwide",
    product: "BOP",
    verticalAppetite: "Restaurants",
    states: "TX, FL, NY, OH",
    riskType: "Preferred",
    submissionMethod: "Broker Portal",
    mgaContact: "David Walsh",
    responseTime: "2.2 days",
    status: "Open Appetite",
    admitted: "Admitted",
    drawer: {
      summary: "Restaurant and retail BOP with competitive property terms.",
      products: ["BOP", "GL"],
      statesList: ["TX", "FL", "NY", "OH"],
      verticals: ["Restaurants", "Retail"],
      submissionRequirements: ["Signed app", "Property schedule"],
      mgaEmail: "dwalsh@nationwide.com",
      mgaPhone: "(555) 667-1100",
      brokerNotes: ["Recommended for TX restaurant BOP"],
      recentChanges: [],
    },
  },
  {
    id: "car-guard-bop",
    name: "Guard",
    product: "BOP",
    verticalAppetite: "Restaurants",
    states: "TX, FL, CA",
    riskType: "Standard",
    submissionMethod: "Wholesaler",
    mgaContact: "Amy Foster",
    responseTime: "3.0 days",
    status: "Open Appetite",
    admitted: "Non-Admitted",
    drawer: {
      summary: "Non-admitted BOP for restaurants with liquor exposure.",
      products: ["BOP", "Liquor Liability"],
      statesList: ["TX", "FL", "CA"],
      verticals: ["Restaurants"],
      submissionRequirements: ["Liquor license", "Revenue breakdown", "Signed app"],
      mgaEmail: "afoster@guard.com",
      mgaPhone: "(555) 778-9900",
      brokerNotes: ["Use for hard-to-place restaurant risks"],
      recentChanges: [],
    },
  },
  {
    id: "car-liberty-auto",
    name: "Liberty Mutual",
    product: "Commercial Auto",
    verticalAppetite: "Logistics",
    states: "TX, FL, NY, CA",
    riskType: "Standard",
    submissionMethod: "Portal",
    mgaContact: "Chris Nguyen",
    responseTime: "2.6 days",
    status: "Restricted",
    admitted: "Admitted",
    drawer: {
      summary: "Commercial auto for logistics and delivery fleets.",
      products: ["Commercial Auto", "GL"],
      statesList: ["TX", "FL", "NY", "CA"],
      verticals: ["Logistics", "Contractors"],
      submissionRequirements: ["Driver list", "Fleet schedule", "Loss runs"],
      mgaEmail: "cnguyen@libertymutual.com",
      mgaPhone: "(555) 334-5500",
      brokerNotes: ["Restricted on fleets over 25 units"],
      recentChanges: ["Tightened logistics appetite in CA"],
    },
  },
  {
    id: "car-icw-wc",
    name: "ICW",
    product: "Workers Comp",
    verticalAppetite: "Contractors",
    states: "CA, TX",
    riskType: "High Risk",
    submissionMethod: "Email",
    mgaContact: "Robert Hayes",
    responseTime: "4.5 days",
    status: "Open Appetite",
    admitted: "Admitted",
    drawer: {
      summary: "Workers comp for higher-risk contractor classes including roofing.",
      products: ["Workers Comp"],
      statesList: ["CA", "TX"],
      verticals: ["Contractors"],
      submissionRequirements: ["Safety program docs", "Payroll report", "Loss runs"],
      mgaEmail: "rhayes@icw.com",
      mgaPhone: "(555) 223-7700",
      brokerNotes: ["Go-to for hard-to-place WC"],
      recentChanges: [],
    },
  },
  {
    id: "car-employers-wc",
    name: "Employers",
    product: "Workers Comp",
    verticalAppetite: "Janitorial",
    states: "CA, TX, FL, NY, WA",
    riskType: "Preferred",
    submissionMethod: "Portal",
    mgaContact: "Janet Brooks",
    responseTime: "1.5 days",
    status: "Open Appetite",
    admitted: "Admitted",
    drawer: {
      summary: "Fast-turn workers comp for janitorial and light commercial.",
      products: ["Workers Comp", "GL"],
      statesList: ["CA", "TX", "FL", "NY", "WA"],
      verticals: ["Janitorial", "Retail"],
      submissionRequirements: ["Payroll report", "Signed app"],
      mgaEmail: "jbrooks@employers.com",
      mgaPhone: "(555) 889-2200",
      brokerNotes: ["Fastest WC turnaround in portfolio"],
      recentChanges: [],
    },
  },
];

let extraCarrierRecords: CarrierRecord[] = [];

export function setExtraCarrierRecords(records: CarrierRecord[]) {
  extraCarrierRecords = records;
}

export function getExtraCarrierRecords(): CarrierRecord[] {
  return extraCarrierRecords;
}

export function getAllCarrierRecords(): CarrierRecord[] {
  return [...carrierRecords, ...extraCarrierRecords];
}

export type MarketRecommendation = {
  id: string;
  vertical: string;
  product: string;
  state: string;
  bestCarrier: string;
  alternateCarriers: string[];
  reason: string;
  appetiteFit: string;
  verticalFit: string;
  turnaround: string;
  restrictions?: string;
  riskLevel: "Open" | "Conditional" | "Restricted" | "High Risk";
};

export const recommendedMarkets: MarketRecommendation[] = [
  {
    id: "rec-contractor-wc-ca",
    vertical: "Contractors",
    product: "Workers Comp",
    state: "California",
    bestCarrier: "Markel",
    alternateCarriers: ["Travelers", "Employers"],
    reason: "Preferred class appetite for landscaping & light trade; 2.4-day avg response on clean 5-yr loss history.",
    appetiteFit: "Strong — landscaping & light trade classes",
    verticalFit: "Contractors · WC payroll up to $750K",
    turnaround: "2.4 days avg quote",
    restrictions: "Roofing class restricted",
    riskLevel: "Open",
  },
  {
    id: "rec-restaurant-bop-tx",
    vertical: "Restaurants",
    product: "BOP",
    state: "Texas",
    bestCarrier: "Nationwide",
    alternateCarriers: ["Guard", "Liberty Mutual"],
    reason: "Open restaurant BOP appetite with competitive liquor liability; avoid Travelers (TX pause in effect).",
    appetiteFit: "Open — full-service & fast casual",
    verticalFit: "Restaurants · liquor liability included",
    turnaround: "3.1 days avg quote",
    restrictions: "Travelers paused in TX",
    riskLevel: "Conditional",
  },
  {
    id: "rec-auto-repair-ca",
    vertical: "Auto Repair",
    product: "Commercial Auto",
    state: "California",
    bestCarrier: "Travelers",
    alternateCarriers: ["Markel", "CNA"],
    reason: "Strong garagekeepers options and 1.8-day quote turnaround for service & repair shops.",
    appetiteFit: "Preferred — service & repair shops",
    verticalFit: "Auto Repair · garagekeepers available",
    turnaround: "1.8 days avg quote",
    riskLevel: "Open",
  },
];

export const recentMarketActivity = [
  { id: "ma-1", message: "Markel updated contractor appetite", timeAgo: "Today" },
  { id: "ma-2", message: "Travelers paused restaurant submissions in Texas", timeAgo: "Yesterday" },
  { id: "ma-3", message: "CNA added new commercial auto product", timeAgo: "2 days ago" },
  { id: "ma-4", message: "Liberty Mutual tightened logistics appetite in CA", timeAgo: "3 days ago" },
];

export const savedMarkets = [
  { id: "fav-markel", name: "Markel", lastUsed: "Today", topVertical: "Contractors" },
  { id: "fav-travelers", name: "Travelers", lastUsed: "Yesterday", topVertical: "Commercial Auto" },
  { id: "fav-cna", name: "CNA", lastUsed: "3 days ago", topVertical: "Workers Comp" },
  { id: "fav-employers", name: "Employers", lastUsed: "1 week ago", topVertical: "Janitorial" },
];

export const carrierStatusClass: Record<CarrierStatus, string> = {
  "Open Appetite": "badge-green",
  Restricted: "badge-yellow",
  Paused: "badge-red",
  "Review Needed": "badge-yellow",
};

export const riskTypeClass: Record<RiskType, string> = {
  Preferred: "badge-green",
  Standard: "badge-blue",
  "High Risk": "badge-red",
};

export type CarrierFilterState = {
  state: string;
  productType: string;
  vertical: string;
  riskType: string;
  admitted: string;
  submissionType: string;
};

export const defaultCarrierFilters: CarrierFilterState = {
  state: carrierFilterOptions.state[0],
  productType: carrierFilterOptions.productType[0],
  vertical: carrierFilterOptions.vertical[0],
  riskType: carrierFilterOptions.riskType[0],
  admitted: carrierFilterOptions.admitted[0],
  submissionType: carrierFilterOptions.submissionType[0],
};

export function matchesCarrierFilters(
  row: CarrierRecord,
  search: string,
  filters: CarrierFilterState,
) {
  const q = search.trim().toLowerCase();
  if (q) {
    const haystack = [
      row.name,
      row.product,
      row.verticalAppetite,
      row.states,
      row.mgaContact,
      row.status,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  if (filters.state !== "All States" && !row.states.includes(filters.state)) return false;
  if (filters.productType !== "All Products" && row.product !== filters.productType) return false;
  if (filters.vertical !== "All Verticals" && row.verticalAppetite !== filters.vertical) return false;
  if (filters.riskType !== "All Risk Types" && row.riskType !== filters.riskType) return false;
  if (filters.admitted !== "All" && row.admitted !== filters.admitted) return false;
  if (filters.submissionType !== "All Methods" && row.submissionMethod !== filters.submissionType) {
    return false;
  }

  return true;
}

export function findCarrierById(id: string): CarrierRecord | undefined {
  return getAllCarrierRecords().find((c) => c.id === id);
}

export function findCarriersByName(name: string): CarrierRecord[] {
  return getAllCarrierRecords().filter((c) => c.name === name);
}

export function getCarrierProfileHref(carrierId: string, from: CarrierProfileFrom = "search"): string {
  const params = new URLSearchParams({
    view: "profile",
    carrier: carrierId,
    from,
  });
  return `${routes.carrierLibrary}?${params.toString()}`;
}
