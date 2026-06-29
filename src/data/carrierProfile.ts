import {
  findCarrierById,
  type CarrierRecord,
  type CarrierStatus,
  type SubmissionMethod,
} from "./carrierLibrary";

export const carrierProfileHeader = {
  title: "Carrier Detail",
  subtitle: "Appetite overview, submission methods, performance, and broker intelligence.",
  quickActions: [
    { id: "start-submission", label: "Start Submission", icon: "plus" as const },
    { id: "save-carrier", label: "Save Carrier", icon: "star" as const },
    { id: "add-note", label: "Add Broker Note", icon: "message-square" as const },
    { id: "contact-mga", label: "Contact MGA", icon: "phone" as const },
  ],
};

export type ProductAppetiteStatus = "Open" | "Limited" | "Restricted" | "Paused";
export type ProductRiskType = "Preferred" | "Standard" | "Restricted" | "High Risk";
export type StateAvailabilityStatus = "Active" | "Review Needed" | "Paused";

export type CarrierProductAppetite = {
  id: string;
  product: string;
  verticals: string[];
  riskType: ProductRiskType;
  status: ProductAppetiteStatus;
  drawer: {
    summary: string;
    limits: string;
    deductibles: string;
    exclusions: string[];
    submissionExamples: string[];
    brokerNotes: string[];
    recentWins: string[];
    underwriterContact: string;
  };
};

export type CarrierContact = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  region: string;
};

export type CarrierProfile = {
  name: string;
  submissionType: SubmissionMethod;
  mgaContact: string;
  responseTime: string;
  statesActive: string;
  appetiteStatus: CarrierStatus;
  riskClassesAccepted: string[];
  submissionMethods: { id: string; method: string; products: string; turnaround: string }[];
  recentAppetiteUpdates: { id: string; message: string; date: string }[];
  productAppetite: CarrierProductAppetite[];
  underwritingGuidelines: {
    minimumPremium: string;
    maxRevenue: string;
    maxPayroll: string;
    yearsInBusiness: string;
    lossHistory: string;
    excludedRisks: string;
  };
  stateAvailability: { id: string; state: string; status: StateAvailabilityStatus }[];
  requiredDocuments: string[];
  contacts: CarrierContact[];
  brokerNotes: string[];
  performance: {
    submissionsSent: number;
    quotesReturned: number;
    declines: number;
    avgTurnaround: string;
    bindWins: number;
    winRate: string;
    hitRatio: string;
  };
};

export const productAppetiteStatusClass: Record<ProductAppetiteStatus, string> = {
  Open: "badge-green",
  Limited: "badge-yellow",
  Restricted: "badge-yellow",
  Paused: "badge-red",
};

export const productRiskTypeClass: Record<ProductRiskType, string> = {
  Preferred: "badge-green",
  Standard: "badge-blue",
  Restricted: "badge-yellow",
  "High Risk": "badge-red",
};

export const stateAvailabilityClass: Record<StateAvailabilityStatus, string> = {
  Active: "badge-green",
  "Review Needed": "badge-yellow",
  Paused: "badge-red",
};

const markelProfile: CarrierProfile = {
  name: "Markel",
  submissionType: "Broker Portal",
  mgaContact: "John Miller",
  responseTime: "2.4 days average",
  statesActive: "CA, TX, FL, NY",
  appetiteStatus: "Open Appetite",
  riskClassesAccepted: ["Contractors", "Janitorial", "Retail", "Light Trade"],
  submissionMethods: [
    { id: "markel-portal", method: "Broker Portal", products: "BOP, WC, GL, Umbrella", turnaround: "2.4 days" },
    { id: "markel-email", method: "Email", products: "Umbrella referrals", turnaround: "3–4 days" },
  ],
  recentAppetiteUpdates: [
    { id: "markel-up-1", message: "Tree work carve-back available on contractor BOP in CA", date: "Jun 26, 2026" },
    { id: "markel-up-2", message: "Added TX restaurant BOP appetite", date: "Jun 20, 2026" },
  ],
  productAppetite: [
    {
      id: "markel-bop",
      product: "BOP",
      verticals: ["Contractors", "Restaurants", "Retail"],
      riskType: "Preferred",
      status: "Open",
      drawer: {
        summary: "Broad BOP appetite for light commercial with competitive property terms.",
        limits: "Up to $5M per location · $10M aggregate",
        deductibles: "$500 / $1,000 / $2,500 property · $1,000 GL",
        exclusions: ["Roofing over 3 stories", "Liquor without supplemental", "Vacant buildings"],
        submissionExamples: ["Landscaping contractor BOP — CA", "Retail shop BOP — TX", "Janitorial BOP — FL"],
        brokerNotes: ["Best turnaround on clean contractor BOP", "Verify class codes before submit"],
        recentWins: ["ABC Landscaping — $4,200 premium", "Metro Retail — $3,800 premium"],
        underwriterContact: "John Miller",
      },
    },
    {
      id: "markel-wc",
      product: "Workers Comp",
      verticals: ["Construction", "Janitorial"],
      riskType: "Standard",
      status: "Open",
      drawer: {
        summary: "Workers comp for contractors and janitorial with payroll up to $1.5M.",
        limits: "Statutory limits · Employers liability $1M/$1M/$1M",
        deductibles: "Deductible programs available on request",
        exclusions: ["Roofing", "Heavy trucking", "Staffing agencies"],
        submissionExamples: ["General contractor WC — CA", "Cleaning service WC — NY"],
        brokerNotes: ["Payroll report required upfront", "Experience mod worksheet for renewals"],
        recentWins: ["BuildRight GC — $12,400 premium", "CleanPro Janitorial — $6,200 premium"],
        underwriterContact: "John Miller",
      },
    },
    {
      id: "markel-auto",
      product: "Commercial Auto",
      verticals: ["Delivery", "Service Vehicles"],
      riskType: "Restricted",
      status: "Limited",
      drawer: {
        summary: "Limited commercial auto for service fleets under 10 units.",
        limits: "CSL $1M recommended · UM/UIM per state requirements",
        deductibles: "$1,000 comp/collision · $2,500 fleet deductible option",
        exclusions: ["Long-haul trucking", "Rideshare", "Fleets over 15 units"],
        submissionExamples: ["HVAC service fleet — TX", "Local delivery — CA"],
        brokerNotes: ["Driver MVRs required for all operators", "Avoid sending trucking risks"],
        recentWins: ["QuickFix HVAC — 4 units — $8,900 premium"],
        underwriterContact: "Lisa Carter",
      },
    },
    {
      id: "markel-umbrella",
      product: "Umbrella",
      verticals: ["All Commercial"],
      riskType: "Preferred",
      status: "Open",
      drawer: {
        summary: "Umbrella over admitted GL, auto, and WC with strong appetite on clean accounts.",
        limits: "$1M / $2M / $5M available",
        deductibles: "Follows underlying",
        exclusions: ["Underlying must be admitted", "No standalone umbrella"],
        submissionExamples: ["Contractor umbrella over BOP+WC — CA", "Retail umbrella — NY"],
        brokerNotes: ["Requires complete underlying schedules", "Fast bind on preferred classes"],
        recentWins: ["Summit Contractors — $2M umbrella — $1,400 premium"],
        underwriterContact: "John Miller",
      },
    },
  ],
  underwritingGuidelines: {
    minimumPremium: "$2,500",
    maxRevenue: "$5M",
    maxPayroll: "$1.5M",
    yearsInBusiness: "2+",
    lossHistory: "No major claims in 3 years",
    excludedRisks: "Roofing, Heavy Trucking",
  },
  stateAvailability: [
    { id: "ca", state: "California", status: "Active" },
    { id: "tx", state: "Texas", status: "Active" },
    { id: "fl", state: "Florida", status: "Active" },
    { id: "az", state: "Arizona", status: "Review Needed" },
    { id: "nv", state: "Nevada", status: "Paused" },
  ],
  requiredDocuments: [
    "Signed Application",
    "Loss Runs (5 years)",
    "Current Dec Page",
    "Payroll Report",
    "Driver List",
    "Business Description",
    "Supplemental Forms",
  ],
  contacts: [
    {
      id: "markel-john",
      name: "John Miller",
      role: "Senior Underwriter",
      email: "john@markel.com",
      phone: "(555) 234-8821",
      region: "West",
    },
    {
      id: "markel-lisa",
      name: "Lisa Carter",
      role: "Broker Support",
      email: "lisa@markel.com",
      phone: "(555) 234-8833",
      region: "National",
    },
  ],
  brokerNotes: [
    "Good for contractors under $2M revenue.",
    "Fast turnaround on BOP.",
    "Avoid sending trucking risks.",
    "Strong on clean loss history.",
  ],
  performance: {
    submissionsSent: 18,
    quotesReturned: 11,
    declines: 4,
    avgTurnaround: "2.4 days",
    bindWins: 6,
    winRate: "33%",
    hitRatio: "33%",
  },
};

const travelersProfile: CarrierProfile = {
  name: "Travelers",
  submissionType: "Broker Portal",
  mgaContact: "Sarah Chen",
  responseTime: "1.8 days average",
  statesActive: "CA, TX, FL, NY, WA",
  appetiteStatus: "Open Appetite",
  riskClassesAccepted: ["Auto Repair", "Contractors", "Service Fleets", "Retail"],
  submissionMethods: [
    { id: "travelers-portal", method: "Broker Portal", products: "Commercial Auto, GL, BOP", turnaround: "1.8 days" },
    { id: "travelers-email", method: "Email", products: "Umbrella referrals", turnaround: "2–3 days" },
  ],
  recentAppetiteUpdates: [
    { id: "travelers-up-1", message: "Restaurant submissions paused in Texas", date: "Jun 25, 2026" },
    { id: "travelers-up-2", message: "Garagekeepers limits expanded for auto repair", date: "Jun 18, 2026" },
  ],
  productAppetite: [
    {
      id: "travelers-auto",
      product: "Commercial Auto",
      verticals: ["Auto Repair", "Contractors", "Service Fleets"],
      riskType: "Preferred",
      status: "Open",
      drawer: {
        summary: "Strong commercial auto for garage and service operations.",
        limits: "CSL up to $2M · Garagekeepers available",
        deductibles: "$500 / $1,000 comp/collision",
        exclusions: ["Long-haul trucking", "For-hire livery"],
        submissionExamples: ["Auto repair shop fleet — CA", "Contractor pickup fleet — TX"],
        brokerNotes: ["Preferred market for auto repair in CA"],
        recentWins: ["Precision Auto — 6 units — $11,200 premium"],
        underwriterContact: "Sarah Chen",
      },
    },
    {
      id: "travelers-gl",
      product: "GL",
      verticals: ["Contractors", "Retail", "Restaurants"],
      riskType: "Standard",
      status: "Open",
      drawer: {
        summary: "General liability for commercial operations with umbrella follow capacity.",
        limits: "$1M / $2M occurrence/aggregate standard",
        deductibles: "$0 GL · Property deductibles vary",
        exclusions: ["Roofing without safety program", "Nightclub liquor"],
        submissionExamples: ["Contractor GL — NY", "Retail GL — FL"],
        brokerNotes: ["Bundle with BOP when possible"],
        recentWins: ["Urban Retail Group — $5,600 premium"],
        underwriterContact: "Sarah Chen",
      },
    },
    {
      id: "travelers-bop",
      product: "BOP",
      verticals: ["Contractors", "Retail"],
      riskType: "Standard",
      status: "Limited",
      drawer: {
        summary: "BOP available in select states; restaurant appetite paused in TX.",
        limits: "Up to $3M property per location",
        deductibles: "$1,000 property standard",
        exclusions: ["Restaurant TX submissions paused", "Vacant property"],
        submissionExamples: ["Contractor BOP — CA", "Retail BOP — WA"],
        brokerNotes: ["Check state appetite before restaurant submit"],
        recentWins: ["Rivera Construction — $4,100 premium"],
        underwriterContact: "Sarah Chen",
      },
    },
  ],
  underwritingGuidelines: {
    minimumPremium: "$3,000",
    maxRevenue: "$10M",
    maxPayroll: "$2M",
    yearsInBusiness: "3+",
    lossHistory: "Max 2 claims in 5 years",
    excludedRisks: "Roofing, Restaurant TX (paused)",
  },
  stateAvailability: [
    { id: "ca", state: "California", status: "Active" },
    { id: "tx", state: "Texas", status: "Active" },
    { id: "fl", state: "Florida", status: "Active" },
    { id: "ny", state: "New York", status: "Active" },
    { id: "wa", state: "Washington", status: "Active" },
  ],
  requiredDocuments: [
    "Signed Application",
    "Loss Runs (5 years)",
    "Current Dec Page",
    "Driver List",
    "MVR Reports",
    "Operations Description",
  ],
  contacts: [
    {
      id: "travelers-sarah",
      name: "Sarah Chen",
      role: "Senior Underwriter",
      email: "schen@travelers.com",
      phone: "(555) 876-2200",
      region: "West",
    },
    {
      id: "travelers-mike",
      name: "Mike Reynolds",
      role: "Broker Support",
      email: "mreynolds@travelers.com",
      phone: "(555) 876-2211",
      region: "National",
    },
  ],
  brokerNotes: [
    "Preferred market for auto repair in CA.",
    "Restaurant submissions paused in Texas.",
    "Fast turnaround on clean contractor accounts.",
  ],
  performance: {
    submissionsSent: 24,
    quotesReturned: 16,
    declines: 5,
    avgTurnaround: "1.8 days",
    bindWins: 9,
    winRate: "38%",
    hitRatio: "38%",
  },
};

const cnaProfile: CarrierProfile = {
  name: "CNA",
  submissionType: "Email",
  mgaContact: "Mike Torres",
  responseTime: "3.5 days average",
  statesActive: "CA, TX, FL, NY",
  appetiteStatus: "Open Appetite",
  riskClassesAccepted: ["Restaurants", "Retail", "Janitorial", "Light Contractors"],
  submissionMethods: [
    { id: "cna-email", method: "Email", products: "BOP, WC, Commercial Auto", turnaround: "3.5 days" },
    { id: "cna-portal", method: "Portal", products: "BOP renewals", turnaround: "2–3 days" },
  ],
  recentAppetiteUpdates: [
    { id: "cna-up-1", message: "New commercial auto product launched", date: "Jun 24, 2026" },
    { id: "cna-up-2", message: "FL janitorial WC requires underwriter referral", date: "Jun 22, 2026" },
  ],
  productAppetite: [
    {
      id: "cna-bop",
      product: "BOP",
      verticals: ["Restaurants", "Retail"],
      riskType: "Standard",
      status: "Open",
      drawer: {
        summary: "Restaurant and retail BOP with food spoilage options.",
        limits: "Up to $5M property · $2M GL",
        deductibles: "$1,000 property · $500 GL",
        exclusions: ["Nightclubs", "Food trucks without supplemental"],
        submissionExamples: ["Family restaurant BOP — TX", "Retail BOP — FL"],
        brokerNotes: ["Good for multi-location restaurant groups"],
        recentWins: ["Coastal Bistro — $6,800 premium"],
        underwriterContact: "Mike Torres",
      },
    },
    {
      id: "cna-wc",
      product: "Workers Comp",
      verticals: ["Janitorial", "Contractors"],
      riskType: "Standard",
      status: "Open",
      drawer: {
        summary: "Workers comp for janitorial and light contractor classes.",
        limits: "Statutory · EL $1M/$1M/$1M",
        deductibles: "Deductible programs on accounts over $25K premium",
        exclusions: ["Roofing", "Staffing"],
        submissionExamples: ["Janitorial WC — CA", "Light contractor WC — NY"],
        brokerNotes: ["Requires 3 markets minimum on WC"],
        recentWins: ["Sparkle Clean — $7,400 premium"],
        underwriterContact: "Mike Torres",
      },
    },
    {
      id: "cna-auto",
      product: "Commercial Auto",
      verticals: ["Delivery", "Service Vehicles"],
      riskType: "Standard",
      status: "Open",
      drawer: {
        summary: "New commercial auto product for local delivery and service fleets.",
        limits: "CSL $1M standard",
        deductibles: "$1,000 comp/collision",
        exclusions: ["Interstate trucking", "Rideshare"],
        submissionExamples: ["Local delivery fleet — CA"],
        brokerNotes: ["Recently added — confirm state availability"],
        recentWins: ["FreshRoute Delivery — 3 units — $5,200 premium"],
        underwriterContact: "Mike Torres",
      },
    },
  ],
  underwritingGuidelines: {
    minimumPremium: "$2,000",
    maxRevenue: "$8M",
    maxPayroll: "$1.2M",
    yearsInBusiness: "2+",
    lossHistory: "No losses over $25K in 3 years",
    excludedRisks: "Roofing, Staffing Agencies",
  },
  stateAvailability: [
    { id: "ca", state: "California", status: "Active" },
    { id: "tx", state: "Texas", status: "Active" },
    { id: "fl", state: "Florida", status: "Review Needed" },
    { id: "ny", state: "New York", status: "Active" },
  ],
  requiredDocuments: [
    "Signed Application",
    "Loss Runs (5 years)",
    "Menu/Revenue Breakdown",
    "Payroll Report",
    "Liquor License (if applicable)",
    "Business Description",
  ],
  contacts: [
    {
      id: "cna-mike",
      name: "Mike Torres",
      role: "Senior Underwriter",
      email: "mtorres@cna.com",
      phone: "(555) 412-3300",
      region: "Southwest",
    },
    {
      id: "cna-amy",
      name: "Amy Walsh",
      role: "Broker Support",
      email: "awalsh@cna.com",
      phone: "(555) 412-3311",
      region: "National",
    },
  ],
  brokerNotes: [
    "Good for multi-location restaurant groups.",
    "Appetite review pending for FL janitorial WC.",
    "New commercial auto product — verify state list.",
  ],
  performance: {
    submissionsSent: 14,
    quotesReturned: 9,
    declines: 3,
    avgTurnaround: "3.5 days",
    bindWins: 4,
    winRate: "29%",
    hitRatio: "29%",
  },
};

const carrierProfilesByName: Record<string, CarrierProfile> = {
  Markel: markelProfile,
  Travelers: travelersProfile,
  CNA: cnaProfile,
};

function buildProfileFromRecord(record: CarrierRecord): CarrierProfile {
  const { drawer } = record;
  return {
    name: record.name,
    submissionType: record.submissionMethod,
    mgaContact: record.mgaContact,
    responseTime: `${record.responseTime} average`,
    statesActive: record.states,
    appetiteStatus: record.status,
    riskClassesAccepted: drawer.verticals,
    submissionMethods: [
      {
        id: `${record.id}-method`,
        method: record.submissionMethod,
        products: record.product,
        turnaround: record.responseTime,
      },
    ],
    recentAppetiteUpdates: drawer.recentChanges.map((message, index) => ({
      id: `${record.id}-change-${index}`,
      message,
      date: "Recent",
    })),
    productAppetite: [
      {
        id: `${record.id}-product`,
        product: record.product,
        verticals: drawer.verticals,
        riskType: record.riskType === "High Risk" ? "High Risk" : record.riskType,
        status: record.status === "Open Appetite" ? "Open" : record.status === "Paused" ? "Paused" : "Limited",
        drawer: {
          summary: drawer.summary,
          limits: "Contact underwriter for limits",
          deductibles: "Standard market deductibles apply",
          exclusions: [],
          submissionExamples: [`${record.verticalAppetite} ${record.product} — ${drawer.statesList[0] ?? "Multi-state"}`],
          brokerNotes: drawer.brokerNotes,
          recentWins: [],
          underwriterContact: record.mgaContact,
        },
      },
      ...drawer.products
        .filter((p) => p !== record.product)
        .map((product, index) => ({
          id: `${record.id}-alt-${index}`,
          product,
          verticals: drawer.verticals,
          riskType: "Standard" as ProductRiskType,
          status: "Open" as ProductAppetiteStatus,
          drawer: {
            summary: `${product} available through ${record.name}.`,
            limits: "Contact underwriter for limits",
            deductibles: "Standard market deductibles apply",
            exclusions: [],
            submissionExamples: [],
            brokerNotes: [],
            recentWins: [],
            underwriterContact: record.mgaContact,
          },
        })),
    ],
    underwritingGuidelines: {
      minimumPremium: "$2,500",
      maxRevenue: "$5M",
      maxPayroll: "$1M",
      yearsInBusiness: "2+",
      lossHistory: "Standard market loss history requirements",
      excludedRisks: "Contact underwriter for exclusions",
    },
    stateAvailability: drawer.statesList.map((state, index) => ({
      id: `${record.id}-state-${index}`,
      state,
      status: "Active" as StateAvailabilityStatus,
    })),
    requiredDocuments: drawer.submissionRequirements.map((doc) =>
      doc.charAt(0).toUpperCase() + doc.slice(1),
    ),
    contacts: [
      {
        id: `${record.id}-contact`,
        name: record.mgaContact,
        role: "Underwriter",
        email: drawer.mgaEmail,
        phone: drawer.mgaPhone,
        region: "National",
      },
    ],
    brokerNotes: drawer.brokerNotes.length > 0 ? drawer.brokerNotes : ["No internal notes yet."],
    performance: {
      submissionsSent: 8,
      quotesReturned: 5,
      declines: 2,
      avgTurnaround: record.responseTime,
      bindWins: 2,
      winRate: "25%",
      hitRatio: "25%",
    },
  };
}

export function getCarrierProfile(carrierRecordId: string): CarrierProfile | undefined {
  const record = findCarrierById(carrierRecordId);
  if (!record) return undefined;

  const named = carrierProfilesByName[record.name];
  if (named) return named;

  return buildProfileFromRecord(record);
}

export const DEFAULT_CARRIER_PROFILE_ID = "car-markel-bop";
