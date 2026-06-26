import { routes } from "@/lib/routes";
import { crossModuleRoutes, fixSearchResultHref } from "@/lib/crossModuleLinks";
import { getCarrierProfileHref } from "./carrierLibrary";

export const globalSearchHeader = {
  title: "Global Search",
  subtitle: "Deep operational search across all hubs. Press ⌘K for instant access anywhere.",
  quickActions: [
    { id: "palette", label: "Command Palette", icon: "search" as const },
    { id: "saved", label: "Saved Searches", icon: "star" as const },
    { id: "filters", label: "Advanced Filters", icon: "telescope" as const },
  ],
};

export const globalSearchPlaceholder =
  "Search hubs, records, and commands…";

export const globalSearchHelper =
  "Results are filtered by your role and permissions.";

export type SearchResultType =
  | "client"
  | "submission"
  | "carrier"
  | "training"
  | "invoice"
  | "task"
  | "document"
  | "user";

export type SearchResultGroup =
  | "Clients"
  | "Submissions"
  | "Carriers"
  | "Training"
  | "Invoices"
  | "Documents"
  | "Users"
  | "Tasks";

export type GlobalSearchResult = {
  id: string;
  type: SearchResultType;
  group: SearchResultGroup;
  title: string;
  hub: string;
  status: string;
  lastUpdated: string;
  owner?: string;
  cta: string;
  href: string;
  fields: { label: string; value: string }[];
  drawer: {
    summary: string;
    details: { label: string; value: string }[];
    notes: string[];
    relatedLinks: { label: string; href: string }[];
  };
};

export type GlobalSearchFilterState = {
  hubType: string;
  status: string;
  assignedTo: string;
  dateRange: string;
  client: string;
  carrier: string;
  coverageType: string;
  priority: string;
  trainingType: string;
};

export const globalSearchFilterOptions = {
  hubType: [
    "All Modules",
    "Commercial Hub",
    "Carrier Library",
    "ePayPolicy",
    "Training Hub",
    "Intake Forms",
    "VA Operations",
  ],
  status: ["All Statuses", "Pending", "Quoted", "Bound", "Overdue", "Failed"],
  assignedTo: ["All Assignees", "JoJo", "Pedro", "Eva", "Valerie", "Tracie", "Sarah"],
  dateRange: ["All Dates", "Today", "This Week", "This Month", "Last 30 Days"],
  client: [
    "All Clients",
    "Martinez Landscaping",
    "Kim Auto Shop",
    "Rivera Construction",
    "Greenline Logistics",
    "Atlas Roofing",
  ],
  carrier: ["All Carriers", "Markel", "Travelers", "CNA", "ICW", "Kingsway"],
  coverageType: ["All Coverage", "BOP", "Workers Comp", "Commercial Auto", "GL", "Umbrella"],
  priority: ["All Priorities", "High", "Medium", "Low"],
  trainingType: ["All Types", "Loom", "Scribe", "Document", "SOP"],
};

export const defaultGlobalSearchFilters: GlobalSearchFilterState = {
  hubType: globalSearchFilterOptions.hubType[0],
  status: globalSearchFilterOptions.status[0],
  assignedTo: globalSearchFilterOptions.assignedTo[0],
  dateRange: globalSearchFilterOptions.dateRange[0],
  client: globalSearchFilterOptions.client[0],
  carrier: globalSearchFilterOptions.carrier[0],
  coverageType: globalSearchFilterOptions.coverageType[0],
  priority: globalSearchFilterOptions.priority[0],
  trainingType: globalSearchFilterOptions.trainingType[0],
};

type RawSearchResult = Omit<GlobalSearchResult, "status" | "lastUpdated"> &
  Partial<Pick<GlobalSearchResult, "status" | "lastUpdated" | "owner">>;

export const rawSearchResults: RawSearchResult[] = [
  {
    id: "sr-martinez-client",
    type: "client",
    group: "Clients",
    title: "Martinez Landscaping",
    hub: "Commercial Hub",
    cta: "Open Client",
    href: crossModuleRoutes.submissionTracker("trk-martinez"),
    fields: [
      { label: "Type", value: "Commercial Client" },
      { label: "Current Stage", value: "Quoted" },
      { label: "Assigned", value: "JoJo" },
      { label: "Last Activity", value: "2 hours ago" },
    ],
    drawer: {
      summary: "Commercial client — BOP + Workers Comp package with Markel.",
      details: [
        { label: "Business Type", value: "Landscaping" },
        { label: "Producer", value: "Eva" },
        { label: "Assigned VA", value: "JoJo" },
        { label: "Renewal Date", value: "July 12, 2027" },
        { label: "Est. Premium", value: "$8,400" },
      ],
      notes: ["Client wants quote by Friday.", "Clean loss history."],
      relatedLinks: [
        { label: "Coverage Checklist", href: `${routes.commercialHub}?view=checklist` },
        { label: "Submission Tracker", href: `${routes.commercialHub}?view=submissions` },
      ],
    },
  },
  {
    id: "sr-kim-client",
    type: "client",
    group: "Clients",
    title: "Kim Auto Shop",
    hub: "Commercial Hub",
    cta: "View Profile",
    href: crossModuleRoutes.submissionTracker("trk-kim"),
    fields: [
      { label: "Type", value: "Commercial Client" },
      { label: "Current Stage", value: "Pending Docs" },
      { label: "Assigned", value: "Tracie" },
      { label: "Last Activity", value: "Today" },
    ],
    drawer: {
      summary: "Auto repair shop — Commercial Auto submission in progress.",
      details: [
        { label: "Business Type", value: "Auto Repair" },
        { label: "Producer", value: "Pedro" },
        { label: "Assigned VA", value: "Tracie" },
        { label: "Missing Docs", value: "Driver List, Loss Runs" },
      ],
      notes: ["Follow up on auto dec page before bind."],
      relatedLinks: [{ label: "Outreach Queue", href: `${routes.commercialHub}?view=outreach` }],
    },
  },
  {
    id: "sr-martinez-sub",
    type: "submission",
    group: "Submissions",
    title: "Martinez Landscaping",
    hub: "Carrier Library",
    cta: "Open Submission",
    href: crossModuleRoutes.submissionTracker("trk-martinez"),
    fields: [
      { label: "Coverage", value: "BOP" },
      { label: "Carrier", value: "Markel" },
      { label: "Status", value: "Ready to Bind" },
    ],
    drawer: {
      summary: "BOP + Workers Comp submission to Markel — checklist 72% complete.",
      details: [
        { label: "Invoice", value: "INV-2048" },
        { label: "Submission Date", value: "June 20, 2026" },
        { label: "Blocking Items", value: "Loss Runs, Driver List" },
        { label: "Producer", value: "Eva" },
      ],
      notes: ["Loss runs still pending from prior carrier."],
      relatedLinks: [
        { label: "Submission Rules", href: `${routes.carrierLibrary}?view=rules` },
        { label: "Carrier Profile", href: getCarrierProfileHref("car-markel-bop") },
      ],
    },
  },
  {
    id: "sr-markel-carrier",
    type: "carrier",
    group: "Carriers",
    title: "Markel",
    hub: "Carrier Library",
    cta: "Open Carrier",
    href: getCarrierProfileHref("car-markel-bop"),
    fields: [
      { label: "Products", value: "BOP, Workers Comp" },
      { label: "States", value: "CA, TX, FL" },
      { label: "Status", value: "Open Appetite" },
    ],
    drawer: {
      summary: "Strong contractor appetite for BOP and WC with competitive terms.",
      details: [
        { label: "MGA Contact", value: "John Miller" },
        { label: "Response Time", value: "2.4 days" },
        { label: "Submission Method", value: "Broker Portal" },
        { label: "Min Premium", value: "$2,500" },
      ],
      notes: ["Good for contractors under $2M revenue.", "Avoid sending trucking risks."],
      relatedLinks: [
        { label: "Carrier Profile", href: getCarrierProfileHref("car-markel-bop") },
        { label: "Carrier Search", href: routes.carrierLibrary },
      ],
    },
  },
  {
    id: "sr-travelers-carrier",
    type: "carrier",
    group: "Carriers",
    title: "Travelers",
    hub: "Carrier Library",
    cta: "View Carrier",
    href: getCarrierProfileHref("car-travelers-auto"),
    fields: [
      { label: "Products", value: "Commercial Auto" },
      { label: "States", value: "National" },
      { label: "Status", value: "Restricted" },
    ],
    drawer: {
      summary: "Commercial auto for service and repair shops. Restaurant TX paused.",
      details: [
        { label: "MGA Contact", value: "Sarah Chen" },
        { label: "Response Time", value: "1.8 days" },
        { label: "Submission Method", value: "Broker Portal" },
      ],
      notes: ["Preferred market for auto repair in CA."],
      relatedLinks: [
        { label: "Carrier Profile", href: getCarrierProfileHref("car-travelers-auto") },
      ],
    },
  },
  {
    id: "sr-carrier-sop",
    type: "training",
    group: "Training",
    title: "Workers Comp Submission SOP",
    hub: "Training Hub",
    cta: "Open Training",
    href: `${routes.trainingHub}?view=detail&resource=lib-carrier-sop`,
    fields: [
      { label: "Department", value: "Brokerage" },
      { label: "Type", value: "Loom" },
    ],
    drawer: {
      summary: "Step-by-step SOP for submitting business to carrier markets.",
      details: [
        { label: "Duration", value: "12 min" },
        { label: "Skill Level", value: "Intermediate" },
        { label: "Assigned To", value: "All VAs" },
        { label: "Completion", value: "78%" },
      ],
      notes: ["Required for new brokerage VAs."],
      relatedLinks: [
        { label: "Open Resource", href: `${routes.trainingHub}?view=detail&resource=lib-carrier-sop` },
        { label: "Training Library", href: `${routes.trainingHub}?view=library` },
      ],
    },
  },
  {
    id: "sr-quote-workflow",
    type: "training",
    group: "Training",
    title: "Commercial Quote Workflow",
    hub: "Training Hub",
    cta: "View Resource",
    href: `${routes.trainingHub}?view=detail&resource=lib-quote-script`,
    fields: [
      { label: "Department", value: "Sales" },
      { label: "Type", value: "Scribe" },
    ],
    drawer: {
      summary: "End-to-end commercial quote workflow from intake to bind.",
      details: [
        { label: "Duration", value: "8 min" },
        { label: "Department", value: "Sales" },
        { label: "Type", value: "Scribe" },
      ],
      notes: [],
      relatedLinks: [{ label: "Open Resource", href: `${routes.trainingHub}?view=detail&resource=lib-quote-script` }],
    },
  },
  {
    id: "sr-inv-2048",
    type: "invoice",
    group: "Invoices",
    title: "INV-2048",
    hub: "ePayPolicy",
    cta: "Open Invoice",
    href: `${routes.epayPolicy}?view=builder`,
    fields: [
      { label: "Client", value: "Martinez Landscaping" },
      { label: "Amount", value: "$4,820" },
      { label: "Status", value: "Pending" },
    ],
    drawer: {
      summary: "Invoice for Martinez Landscaping — BOP + WC with separated broker fee.",
      details: [
        { label: "Policy Premium", value: "$4,200" },
        { label: "Broker Fee", value: "$500" },
        { label: "Taxes", value: "$120" },
        { label: "Due Date", value: "June 28, 2026" },
        { label: "Payment Method", value: "ACH" },
      ],
      notes: ["Broker fee due upfront.", "Payment link sent today."],
      relatedLinks: [
        { label: "Invoice Builder", href: `${routes.epayPolicy}?view=builder` },
        { label: "Payment Tracker", href: `${routes.epayPolicy}?view=tracker` },
      ],
    },
  },
  {
    id: "sr-task-markel",
    type: "task",
    group: "Tasks",
    title: "Follow up with Markel",
    hub: "VA Operations",
    cta: "Open Task",
    href: `${routes.vaOperations}?role=dialer&view=tasks`,
    fields: [
      { label: "Assigned", value: "JoJo" },
      { label: "Due", value: "Today" },
      { label: "Priority", value: "High" },
    ],
    drawer: {
      summary: "Follow up on Martinez Landscaping submission status with Markel underwriter.",
      details: [
        { label: "Client", value: "Martinez Landscaping" },
        { label: "Carrier", value: "Markel" },
        { label: "Due Date", value: "Today" },
        { label: "Priority", value: "High" },
        { label: "Created By", value: "Eva" },
      ],
      notes: ["Waiting on loss runs before carrier follow-up."],
      relatedLinks: [{ label: "Dialer VA", href: `${routes.vaOperations}?role=dialer&view=tasks` }],
    },
  },
  {
    id: "sr-greenline-client",
    type: "client",
    group: "Clients",
    title: "Greenline Logistics",
    hub: "Commercial Hub",
    cta: "Open Client",
    href: crossModuleRoutes.submissionTracker("trk-greenline"),
    fields: [
      { label: "Type", value: "Commercial Client" },
      { label: "Current Stage", value: "Overdue Payment" },
      { label: "Assigned", value: "JoJo" },
      { label: "Last Activity", value: "1 day ago" },
    ],
    drawer: {
      summary: "Fleet logistics account — BOP package with overdue invoice.",
      details: [
        { label: "Producer", value: "Eva" },
        { label: "Invoice", value: "INV-2042 — $6,200 overdue" },
        { label: "Carrier", value: "CNA" },
      ],
      notes: ["Owner requested payment plan."],
      relatedLinks: [{ label: "Payment Tracker", href: `${routes.epayPolicy}?view=tracker` }],
    },
  },
  {
    id: "sr-inv-2042",
    type: "invoice",
    group: "Invoices",
    title: "INV-2042",
    hub: "ePayPolicy",
    status: "Overdue",
    lastUpdated: "1 day ago",
    owner: "JoJo",
    cta: "Open Invoice",
    href: crossModuleRoutes.epayPaymentTracker("pay-greenline"),
    fields: [
      { label: "Client", value: "Greenline Logistics" },
      { label: "Amount", value: "$6,200" },
      { label: "Status", value: "Overdue" },
    ],
    drawer: {
      summary: "Overdue invoice for Greenline Logistics BOP package.",
      details: [
        { label: "Due Date", value: "June 15, 2026" },
        { label: "Days Overdue", value: "6" },
        { label: "Payment Method", value: "ACH" },
      ],
      notes: ["Owner requested payment plan."],
      relatedLinks: [{ label: "Payment Tracker", href: `${routes.epayPolicy}?view=tracker` }],
    },
  },
  {
    id: "sr-loss-runs-doc",
    type: "document",
    group: "Documents",
    title: "Martinez Loss Runs 2024-2026",
    hub: "Commercial Hub",
    status: "Missing",
    lastUpdated: "3 days ago",
    owner: "JoJo",
    cta: "Preview",
    href: `${routes.commercialHub}?view=missing-docs`,
    fields: [
      { label: "Client", value: "Martinez Landscaping" },
      { label: "Type", value: "Loss Runs" },
      { label: "Status", value: "Missing" },
    ],
    drawer: {
      summary: "Loss runs requested from prior carrier — blocking bind.",
      details: [
        { label: "Requested", value: "June 18, 2026" },
        { label: "Prior Carrier", value: "Hartford" },
      ],
      notes: ["Follow up with client for signed authorization."],
      relatedLinks: [{ label: "Missing Docs", href: `${routes.commercialHub}?view=missing-docs` }],
    },
  },
  {
    id: "sr-payroll-doc",
    type: "document",
    group: "Documents",
    title: "Kim Auto Shop Payroll Report",
    hub: "Commercial Hub",
    status: "Pending",
    lastUpdated: "Today",
    owner: "Pedro",
    cta: "Download",
    href: `${routes.commercialHub}?view=missing-docs`,
    fields: [
      { label: "Client", value: "Kim Auto Shop" },
      { label: "Type", value: "Payroll Report" },
      { label: "Status", value: "Pending" },
    ],
    drawer: {
      summary: "Payroll report needed for Workers Comp rating.",
      details: [{ label: "Coverage", value: "Workers Comp" }],
      notes: [],
      relatedLinks: [{ label: "Missing Docs", href: `${routes.commercialHub}?view=missing-docs` }],
    },
  },
  {
    id: "sr-martinez-proposal",
    type: "submission",
    group: "Submissions",
    title: "Martinez Landscaping — Proposal",
    hub: "Send Center",
    cta: "Open Proposal",
    href: crossModuleRoutes.sendCenterProposal("prop-martinez", "sent"),
    fields: [
      { label: "Client", value: "Martinez Landscaping" },
      { label: "Carrier", value: "Markel" },
      { label: "Status", value: "Sent" },
      { label: "Premium", value: "$9,800" },
    ],
    drawer: {
      summary: "BOP proposal sent to Martinez Landscaping — awaiting client response.",
      details: [
        { label: "Producer", value: "Eva" },
        { label: "Broker Fee", value: "$600" },
      ],
      notes: ["Client requested Spanish proposal copy."],
      relatedLinks: [
        { label: "Proposal Detail", href: crossModuleRoutes.sendCenterProposal("prop-martinez", "sent") },
        { label: "Submission Tracker", href: crossModuleRoutes.submissionTracker("trk-martinez") },
      ],
    },
  },
  {
    id: "sr-user-pedro",
    type: "user",
    group: "Users",
    title: "Pedro Ramirez",
    hub: "VA Operations",
    status: "Active",
    lastUpdated: "Online now",
    owner: "Eva",
    cta: "View Profile",
    href: `${routes.vaOperations}?openProfile=pedro-alvarez`,
    fields: [
      { label: "Role", value: "Dialer VA" },
      { label: "Department", value: "Commercial" },
      { label: "Assigned", value: "12 clients" },
    ],
    drawer: {
      summary: "Dialer VA handling commercial outreach and document follow-ups.",
      details: [
        { label: "Email", value: "pedro@insurancetown.com" },
        { label: "Languages", value: "English, Spanish" },
      ],
      notes: [],
      relatedLinks: [{ label: "VA Operations", href: routes.vaOperations }],
    },
  },
  {
    id: "sr-user-jojo",
    type: "user",
    group: "Users",
    title: "JoJo Martinez",
    hub: "VA Operations",
    status: "Active",
    lastUpdated: "12 min ago",
    owner: "Eva",
    cta: "View Profile",
    href: `${routes.vaOperations}?openProfile=jojo-martinez`,
    fields: [
      { label: "Role", value: "Admin VA" },
      { label: "Department", value: "Brokerage" },
      { label: "Assigned", value: "18 clients" },
    ],
    drawer: {
      summary: "Admin VA managing submissions, invoices, and carrier coordination.",
      details: [{ label: "Email", value: "jojo@insurancetown.com" }],
      notes: [],
      relatedLinks: [{ label: "VA Operations", href: routes.vaOperations }],
    },
  },
  {
    id: "sr-pending-bind-sub",
    type: "submission",
    group: "Submissions",
    title: "Rivera Construction — Pending Bind",
    hub: "Commercial Hub",
    status: "Pending",
    lastUpdated: "4 hours ago",
    owner: "Eva",
    cta: "Open Submission",
    href: crossModuleRoutes.readyToBind(),
    fields: [
      { label: "Coverage", value: "BOP" },
      { label: "Carrier", value: "CNA" },
      { label: "Status", value: "Pending Bind" },
      { label: "Priority", value: "High" },
    ],
    drawer: {
      summary: "Contractor BOP pending producer review before bind.",
      details: [{ label: "Producer", value: "Eva" }],
      notes: ["Awaiting producer sign-off."],
      relatedLinks: [{ label: "Ready to Bind", href: `${routes.commercialHub}?view=ready-to-bind` }],
    },
  },
  {
    id: "sr-contractor-quote-1283",
    type: "submission",
    group: "Submissions",
    title: "Contractor Quote #1283",
    hub: "Commercial Hub",
    status: "Pending",
    lastUpdated: "4 days ago",
    owner: "Sarah",
    cta: "Open Submission",
    href: crossModuleRoutes.submissionTracker("trk-martinez"),
    fields: [
      { label: "Client", value: "Martinez Landscaping" },
      { label: "Coverage", value: "Workers Comp" },
      { label: "Status", value: "Pending 4 days" },
      { label: "Carrier", value: "Travelers" },
    ],
    drawer: {
      summary: "Contractor WC quote pending carrier response — 4 days open.",
      details: [{ label: "Producer", value: "Sarah" }],
      notes: ["E&O exposure elevated — follow up today."],
      relatedLinks: [{ label: "Submission Tracker", href: crossModuleRoutes.submissionTracker("trk-martinez") }],
    },
  },
  {
    id: "sr-send-draft-harbor",
    type: "document",
    group: "Documents",
    title: "Harbor Logistics — Proposal Draft",
    hub: "Send Center",
    status: "Draft",
    lastUpdated: "2 hours ago",
    owner: "JoJo",
    cta: "Open Draft",
    href: routes.sendCenter,
    fields: [
      { label: "Client", value: "Harbor Logistics" },
      { label: "Type", value: "Send Center Draft" },
      { label: "Status", value: "Draft" },
    ],
    drawer: {
      summary: "GL + Umbrella proposal draft awaiting producer review.",
      details: [{ label: "Producer", value: "Eva" }],
      notes: ["Spanish copy requested."],
      relatedLinks: [{ label: "Send Center", href: routes.sendCenter }],
    },
  },
  {
    id: "sr-az-note-martinez",
    type: "document",
    group: "Documents",
    title: "AZ Note — Martinez Landscaping",
    hub: "Commercial Hub",
    status: "Active",
    lastUpdated: "Yesterday",
    owner: "Pedro",
    cta: "Open Note",
    href: `${routes.commercialHub}?view=submissions`,
    fields: [
      { label: "Client", value: "Martinez Landscaping" },
      { label: "Type", value: "Internal Note" },
      { label: "Author", value: "Pedro" },
    ],
    drawer: {
      summary: "Internal AZ note on carrier follow-up and missing loss runs.",
      details: [{ label: "Created", value: "June 24, 2026" }],
      notes: ["Flagged for E&O review."],
      relatedLinks: [{ label: "Submission Tracker", href: crossModuleRoutes.submissionTracker("trk-martinez") }],
    },
  },
  {
    id: "sr-retention-greenline",
    type: "client",
    group: "Clients",
    title: "Greenline Logistics",
    hub: "Retention",
    status: "Renewal Due",
    lastUpdated: "3 days ago",
    owner: "Valerie",
    cta: "Open Retention",
    href: routes.retention,
    fields: [
      { label: "Type", value: "Commercial Client" },
      { label: "Current Stage", value: "Renewal · 45 days" },
      { label: "Policy", value: "Commercial Auto" },
    ],
    drawer: {
      summary: "Commercial auto policy renewing in 45 days — retention outreach scheduled.",
      details: [{ label: "Premium", value: "$12,400" }],
      notes: ["High churn risk — schedule call."],
      relatedLinks: [{ label: "Retention Hub", href: routes.retention }],
    },
  },
  {
    id: "sr-travelers-carrier",
    type: "carrier",
    group: "Carriers",
    title: "Travelers",
    hub: "Carrier Library",
    status: "Active",
    lastUpdated: "This week",
    cta: "Open Carrier",
    href: getCarrierProfileHref("car-travelers-gl"),
    fields: [
      { label: "Products", value: "Workers Comp" },
      { label: "Appetite", value: "Contractors" },
      { label: "Status", value: "Active" },
    ],
    drawer: {
      summary: "National carrier — strong workers comp appetite for contractors.",
      details: [{ label: "AM Best", value: "A++" }],
      notes: [],
      relatedLinks: [{ label: "Carrier Library", href: routes.carrierLibrary }],
    },
  },
  {
    id: "sr-user-sarah",
    type: "user",
    group: "Users",
    title: "Sarah Mitchell",
    hub: "VA Operations",
    status: "Active",
    lastUpdated: "2m ago",
    owner: "Eva",
    cta: "View Profile",
    href: `${routes.vaOperations}?openProfile=sarah-mitchell`,
    fields: [
      { label: "Role", value: "Sales" },
      { label: "Department", value: "Personal Lines" },
      { label: "Last Activity", value: "2m ago" },
    ],
    drawer: {
      summary: "Sales VA focused on personal lines cross-sell and renewals.",
      details: [{ label: "Email", value: "sarah@insurancetown.com" }],
      notes: [],
      relatedLinks: [{ label: "VA Operations", href: routes.vaOperations }],
    },
  },
];

function enrichSearchResult(result: RawSearchResult): GlobalSearchResult {
  const statusField = result.fields.find(
    (f) => f.label === "Status" || f.label === "Current Stage",
  );
  const activity = result.fields.find(
    (f) => f.label === "Last Activity" || f.label === "Due",
  );
  const assigned = result.fields.find(
    (f) => f.label === "Assigned" || f.label === "Owner",
  );
  return {
    ...result,
    status: result.status ?? statusField?.value ?? "Active",
    lastUpdated: result.lastUpdated ?? activity?.value ?? "Today",
    owner: result.owner ?? assigned?.value,
  };
}

export const searchResults: GlobalSearchResult[] = rawSearchResults.map((result) => {
  const enriched = enrichSearchResult(result);
  return { ...enriched, href: fixSearchResultHref(enriched) };
});

export const recentSearchesSeed = [
  "Martinez Landscaping",
  "Pending Bind",
  "Markel BOP",
  "Overdue Invoices",
  "Missing Loss Runs",
];

export const savedSearchViews = [
  { id: "ss-overdue", label: "Overdue Payments", query: "overdue payment" },
  { id: "ss-bind", label: "Ready to Bind", query: "ready to bind" },
  { id: "ss-docs", label: "Pending Docs", query: "pending docs" },
  { id: "ss-pipeline", label: "High Value Pipeline", query: "high value" },
  { id: "ss-renewals", label: "Renewals This Month", query: "renewals" },
];

export const searchActivityTimeline = [
  { id: "sa-1", message: "JoJo searched Markel", timeAgo: "12 min ago" },
  { id: "sa-2", message: "Pedro searched Pending Docs", timeAgo: "28 min ago" },
  { id: "sa-3", message: "Eva searched High Value Pipeline", timeAgo: "1 hour ago" },
  { id: "sa-4", message: "Kyle searched Failed Payments", timeAgo: "2 hours ago" },
];

export const searchGroupOrder: SearchResultGroup[] = [
  "Clients",
  "Submissions",
  "Carriers",
  "Invoices",
  "Training",
  "Documents",
  "Users",
  "Tasks",
];

export const searchTypeHubClass: Record<SearchResultType, string> = {
  client: "badge-blue",
  submission: "badge-green",
  carrier: "badge-yellow",
  training: "badge-blue",
  invoice: "badge-green",
  document: "badge-yellow",
  user: "badge-blue",
  task: "badge-red",
};

export function matchesGlobalSearch(
  result: GlobalSearchResult,
  query: string,
  filters: GlobalSearchFilterState,
): boolean {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (tokens.length > 0) {
    const haystack = [
      result.title,
      result.group,
      result.hub,
      result.status,
      result.owner ?? "",
      ...result.fields.map((f) => `${f.label} ${f.value}`),
    ]
      .join(" ")
      .toLowerCase();
    const matched = tokens.every(
      (token) =>
        haystack.includes(token) ||
        haystack.split(/\s+/).some((word) => word.startsWith(token)),
    );
    if (!matched) return false;
  }

  if (filters.hubType !== "All Modules" && result.hub !== filters.hubType) return false;

  const assignedField = result.fields.find((f) => f.label === "Assigned" || f.label === "Owner");
  if (filters.assignedTo !== "All Assignees" && assignedField && assignedField.value !== filters.assignedTo) {
    return false;
  }

  if (filters.client !== "All Clients") {
    const clientMatch =
      result.title === filters.client ||
      result.fields.some((f) => f.value === filters.client);
    if (!clientMatch) return false;
  }

  const carrierField = result.fields.find((f) => f.label === "Carrier");
  if (filters.carrier !== "All Carriers" && carrierField && !carrierField.value.includes(filters.carrier)) {
    return false;
  }

  if (filters.status !== "All Statuses" && !result.status.toLowerCase().includes(filters.status.toLowerCase())) {
    return false;
  }

  if (filters.coverageType !== "All Coverage" && result.type === "submission") {
    const cov = result.fields.find((f) => f.label === "Coverage");
    if (cov && !cov.value.includes(filters.coverageType)) return false;
  }

  if (filters.priority !== "All Priorities") {
    const pri = result.fields.find((f) => f.label === "Priority");
    if (pri && pri.value !== filters.priority) return false;
  }

  const typeField = result.fields.find((f) => f.label === "Type");
  if (
    filters.trainingType !== "All Types" &&
    result.type === "training" &&
    typeField &&
    typeField.value !== filters.trainingType
  ) {
    return false;
  }

  return true;
}

export function groupSearchResults(results: GlobalSearchResult[]): Record<SearchResultGroup, GlobalSearchResult[]> {
  const grouped = {} as Record<SearchResultGroup, GlobalSearchResult[]>;
  for (const group of searchGroupOrder) {
    grouped[group] = [];
  }
  for (const result of results) {
    grouped[result.group].push(result);
  }
  return grouped;
}

export function findSearchResultById(id: string): GlobalSearchResult | undefined {
  return searchResults.find((r) => r.id === id);
}
