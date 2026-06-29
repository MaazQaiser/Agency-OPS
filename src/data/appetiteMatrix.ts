export type AppetiteLevel = "writes" | "conditional" | "no" | "unknown";

export type AppetiteMatrixCarrier = {
  id: string;
  name: string;
  appetite: Record<string, AppetiteLevel>;
  reasoning: Record<string, string>;
  recentlyUpdated?: string[];
};

export const appetiteMatrixVerticals = [
  "Contractors",
  "Landscapers",
  "Restaurants",
  "Cleaning",
  "Trucking",
  "Beauty",
  "Auto Repair",
] as const;

export const appetiteMatrixCarriers: AppetiteMatrixCarrier[] = [
  {
    id: "c1",
    name: "Farmers",
    appetite: {
      Contractors: "writes",
      Landscapers: "writes",
      Restaurants: "writes",
      Cleaning: "writes",
      Trucking: "conditional",
      Beauty: "writes",
      "Auto Repair": "conditional",
    },
    reasoning: {
      Contractors: "Preferred class codes for light trade and GC under $2M revenue.",
      Landscapers: "Open appetite with competitive BOP terms.",
      Restaurants: "Full-service and fast casual accepted statewide.",
      Cleaning: "Janitorial WC and BOP available.",
      Trucking: "Local delivery only — no long-haul.",
      Beauty: "Salon and spa BOP with standard limits.",
      "Auto Repair": "Garagekeepers available on referral.",
    },
    recentlyUpdated: ["Trucking", "Auto Repair"],
  },
  {
    id: "c2",
    name: "Employers",
    appetite: {
      Contractors: "writes",
      Landscapers: "writes",
      Restaurants: "conditional",
      Cleaning: "writes",
      Trucking: "no",
      Beauty: "writes",
      "Auto Repair": "writes",
    },
    reasoning: {
      Contractors: "Fast-turn WC for contractors under $1M payroll.",
      Landscapers: "Landscaping class codes preferred.",
      Restaurants: "Limited to quick-service without liquor.",
      Cleaning: "Core janitorial appetite — fastest turnaround.",
      Trucking: "No trucking or fleet risks accepted.",
      Beauty: "Salon WC and BOP available.",
      "Auto Repair": "Service fleet auto under 8 units.",
    },
    recentlyUpdated: ["Cleaning"],
  },
  {
    id: "c3",
    name: "Guard Insurance",
    appetite: {
      Contractors: "conditional",
      Landscapers: "writes",
      Restaurants: "writes",
      Cleaning: "writes",
      Trucking: "no",
      Beauty: "conditional",
      "Auto Repair": "conditional",
    },
    reasoning: {
      Contractors: "Non-admitted placement for hard-to-place trade classes.",
      Landscapers: "Surplus market option for landscaping BOP.",
      Restaurants: "Liquor liability available on admitted surplus.",
      Cleaning: "Janitorial WC on non-admitted paper.",
      Trucking: "Declined — no trucking appetite.",
      Beauty: "Referral required for multi-location salons.",
      "Auto Repair": "Garage risks require safety program docs.",
    },
  },
  {
    id: "c4",
    name: "Gainsco",
    appetite: {
      Contractors: "unknown",
      Landscapers: "unknown",
      Restaurants: "no",
      Cleaning: "unknown",
      Trucking: "writes",
      Beauty: "no",
      "Auto Repair": "writes",
    },
    reasoning: {
      Contractors: "Appetite data pending carrier refresh.",
      Landscapers: "Contact MGA for current class list.",
      Restaurants: "Restaurant class declined across all states.",
      Cleaning: "Janitorial appetite unverified.",
      Trucking: "Local trucking and delivery fleets preferred.",
      Beauty: "No beauty/salon appetite.",
      "Auto Repair": "Auto repair fleet auto — CSL $1M standard.",
    },
    recentlyUpdated: ["Trucking"],
  },
  {
    id: "c5",
    name: "KraftLake",
    appetite: {
      Contractors: "writes",
      Landscapers: "conditional",
      Restaurants: "writes",
      Cleaning: "conditional",
      Trucking: "no",
      Beauty: "no",
      "Auto Repair": "writes",
    },
    reasoning: {
      Contractors: "MGA wholesaler channel for contractor package.",
      Landscapers: "Tree work requires supplemental application.",
      Restaurants: "Full liquor appetite via wholesaler.",
      Cleaning: "Janitorial WC referral only.",
      Trucking: "No trucking accepted.",
      Beauty: "Declined.",
      "Auto Repair": "Garage and service shop package available.",
    },
  },
  {
    id: "c6",
    name: "Progressive Comm.",
    appetite: {
      Contractors: "conditional",
      Landscapers: "writes",
      Restaurants: "no",
      Cleaning: "conditional",
      Trucking: "writes",
      Beauty: "no",
      "Auto Repair": "writes",
    },
    reasoning: {
      Contractors: "Light contractor auto only — no WC.",
      Landscapers: "Landscaping fleet auto preferred.",
      Restaurants: "Restaurant class not written.",
      Cleaning: "Cleaning fleet auto on referral.",
      Trucking: "Local trucking fleets under 20 units.",
      Beauty: "No appetite.",
      "Auto Repair": "Strong auto repair fleet appetite.",
    },
    recentlyUpdated: ["Contractors", "Restaurants"],
  },
];

export const appetiteLabel: Record<AppetiteLevel, string> = {
  writes: "Writes",
  conditional: "Conditional",
  no: "No appetite",
  unknown: "Unknown",
};

export const appetiteCellClass: Record<AppetiteLevel, string> = {
  writes: "appetite-cell--writes",
  conditional: "appetite-cell--conditional",
  no: "appetite-cell--no",
  unknown: "appetite-cell--unknown",
};
