export const researchVAHeader = {
  title: "Researcher VA",
  subtitle: "Source, enrich, and qualify new opportunities.",
  quickActions: [
    { id: "add-prospect", label: "Add New Prospect", icon: "plus" as const },
    { id: "import-list", label: "Import Lead List", icon: "upload" as const },
    { id: "export-queue", label: "Export Queue", icon: "download" as const },
  ],
};

export const researchKpis = [
  {
    label: "New Prospects Today",
    value: "34",
    sub: "8 high-fit",
    helper: "Fresh opportunities sourced",
    color: "primary" as const,
  },
  {
    label: "Qualified Leads",
    value: "12",
    sub: "Ready for handoff",
    helper: "Passed research criteria",
    color: "green" as const,
  },
  {
    label: "Pending Enrichment",
    value: "9",
    sub: "Missing company data",
    helper: "Needs completion",
    color: "yellow" as const,
  },
  {
    label: "Sent to Dialer",
    value: "14",
    sub: "Assigned this week",
    helper: "Transferred for outreach",
    color: "red" as const,
  },
];

export type ProspectStatus = "researching" | "ready-for-qualification" | "qualified" | "handed-off";

export type QualificationStatus = "ready" | "incomplete";

export type LeadIntelligence = {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  website: string;
  currentCarrier: string;
  renewalDate: string;
  estimatedPremium: string;
  coverageGaps: string[];
  notes: string[];
};

export type QualificationItem = {
  id: string;
  label: string;
  checked: boolean;
};

export type ResearchProspect = {
  id: string;
  business: string;
  industry: string;
  source: string;
  location: string;
  status: ProspectStatus;
  statusLabel: string;
  assignedTo: string;
  cta: string;
  intelligence: LeadIntelligence;
  qualification: {
    items: QualificationItem[];
    status: QualificationStatus;
  };
  previousAttempts: string[];
  recommendedAction: string;
};

export const prospectQueue: ResearchProspect[] = [
  {
    id: "prospect-martinez",
    business: "Martinez Landscaping",
    industry: "Contractor",
    source: "Google Search",
    location: "California",
    status: "researching",
    statusLabel: "Researching",
    assignedTo: "Jaffer",
    cta: "Open Profile",
    intelligence: {
      businessName: "Martinez Landscaping LLC",
      ownerName: "John Martinez",
      phone: "(559) 555-0184",
      email: "john@martinezlandscaping.com",
      website: "martinezlandscaping.com",
      currentCarrier: "State Farm",
      renewalDate: "August 2026",
      estimatedPremium: "$18,400/yr",
      coverageGaps: ["Workers comp limits may be underinsured", "No commercial auto fleet policy on file"],
      notes: ["3-vehicle fleet identified via DOT lookup.", "Owner prefers email first contact."],
    },
    qualification: {
      status: "incomplete",
      items: [
        { id: "q1", label: "Business verified", checked: true },
        { id: "q2", label: "Phone verified", checked: true },
        { id: "q3", label: "Decision maker identified", checked: true },
        { id: "q4", label: "Coverage type identified", checked: false },
        { id: "q5", label: "Renewal timing known", checked: true },
        { id: "q6", label: "Premium potential estimated", checked: false },
        { id: "q7", label: "Risk category assigned", checked: false },
      ],
    },
    previousAttempts: ["Initial web scrape completed", "Carrier lookup via AM Best"],
    recommendedAction: "Complete coverage type identification before handoff to Dialer.",
  },
  {
    id: "prospect-kim",
    business: "Kim Auto Shop",
    industry: "Auto Repair",
    source: "Referral",
    location: "Texas",
    status: "ready-for-qualification",
    statusLabel: "Ready for Qualification",
    assignedTo: "Jaffer",
    cta: "Review",
    intelligence: {
      businessName: "Kim Auto Shop Inc.",
      ownerName: "Michael Kim",
      phone: "(713) 555-0198",
      email: "michael@kimautoshop.com",
      website: "kimautoshop.com",
      currentCarrier: "Travelers",
      renewalDate: "November 2026",
      estimatedPremium: "$24,200/yr",
      coverageGaps: ["GL limits at minimum", "Garagekeepers coverage unclear"],
      notes: ["Referred by JoJo — existing brokerage client.", "Needs GL + garagekeepers quote bundle."],
    },
    qualification: {
      status: "ready",
      items: [
        { id: "q1", label: "Business verified", checked: true },
        { id: "q2", label: "Phone verified", checked: true },
        { id: "q3", label: "Decision maker identified", checked: true },
        { id: "q4", label: "Coverage type identified", checked: true },
        { id: "q5", label: "Renewal timing known", checked: true },
        { id: "q6", label: "Premium potential estimated", checked: true },
        { id: "q7", label: "Risk category assigned", checked: true },
      ],
    },
    previousAttempts: ["Referral validated with JoJo", "Owner contact updated 14 min ago"],
    recommendedAction: "Push to Dialer — high-fit GL prospect ready for first contact.",
  },
];

export const leadSources = [
  { id: "src-google", source: "Google Search", count: 12 },
  { id: "src-linkedin", source: "LinkedIn", count: 9 },
  { id: "src-meta", source: "Meta Ads", count: 7 },
  { id: "src-referral", source: "Referrals", count: 4 },
  { id: "src-agencyzoom", source: "AgencyZoom", count: 2 },
];

export const researchActivity = [
  { id: "ra-1", text: "Added Martinez Landscaping", time: "8 minutes ago" },
  { id: "ra-2", text: "Updated owner contact for Kim Auto Shop", time: "14 minutes ago" },
  { id: "ra-3", text: "Qualified Seoul Restaurant Group", time: "26 minutes ago" },
  { id: "ra-4", text: "Sent Pacific Rim Contractors to Dialer", time: "41 minutes ago" },
];

export type HandoffPriority = "high" | "medium";

export type HandoffItem = {
  id: string;
  leadName: string;
  industry: string;
  priority: HandoffPriority;
  assignedDialer: string;
  transferTime: string;
  cta: string;
};

export const handoffQueue: HandoffItem[] = [
  {
    id: "ho-1",
    leadName: "Martinez Landscaping",
    industry: "Contractor",
    priority: "high",
    assignedDialer: "Kat",
    transferTime: "Now",
    cta: "Assign Lead",
  },
  {
    id: "ho-2",
    leadName: "Kim Auto Shop",
    industry: "Auto Repair",
    priority: "medium",
    assignedDialer: "Kat",
    transferTime: "2 PM",
    cta: "Assign Lead",
  },
];

/** Default featured prospect for intelligence panel when none selected */
export const featuredProspectId = "prospect-martinez";
