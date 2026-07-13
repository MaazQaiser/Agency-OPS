export const submissionHistoryHeader = {
  title: "Submission History",
  subtitle: "View and track all intake submissions across form types.",
  quickActions: [
    { id: "export", label: "Export History", icon: "download" as const },
    { id: "retry-failed", label: "Retry Failed", icon: "refresh" as const },
    { id: "view-drafts", label: "View Drafts", icon: "folder" as const },
  ],
};

export const submissionHistorySearchPlaceholder =
  "Search by client, form type, submitter, or status";

export const historyFilterOptions = {
  formType: ["Form Type", "Contractors", "Restaurants", "Personal Lines"],
  submittedBy: ["Submitted By", "Pedro", "JoJo", "Eva", "Hamad", "Tracie", "Kyle"],
  status: [
    "Status",
    "Pending Review",
    "Routed",
    "Processing",
    "Failed",
    "Draft",
    "Completed",
  ],
  dateRange: ["Date Range", "Today", "Last 7 Days", "Last 30 Days", "This Month"],
  routingStatus: ["Routing Status", "All Systems", "Partial", "Failed", "Pending"],
};

export const submissionHistoryKpis = [
  {
    label: "Submitted Today",
    value: "14",
    sub: "Across all forms",
    helper: "Daily intake volume",
    color: "primary" as const,
  },
  {
    label: "Pending Review",
    value: "9",
    sub: "Awaiting processing",
    helper: "Needs internal review",
    color: "yellow" as const,
  },
  {
    label: "Successfully Routed",
    value: "68",
    sub: "Sent to systems",
    helper: "Completed workflows",
    color: "green" as const,
  },
  {
    label: "Failed Submissions",
    value: "3",
    sub: "Needs retry",
    helper: "Routing issue detected",
    color: "red" as const,
  },
];

export type HistorySubmissionStatus =
  | "Pending Review"
  | "Routed"
  | "Processing"
  | "Failed"
  | "Draft"
  | "Completed";

export type ValidationStatus =
  | "Complete"
  | "Missing Docs"
  | "Incomplete"
  | "Duplicate Found";

export type RoutingSystemStatus = "Success" | "Failed" | "Pending";

export type RoutingSystemEntry = {
  system: string;
  status: RoutingSystemStatus;
};

export type HistorySubmission = {
  id: string;
  client: string;
  formType: string;
  submittedBy: string;
  submittedAt: string;
  completionTime: string;
  status: HistorySubmissionStatus;
  routedTo: string;
  validationStatus: ValidationStatus;
  lastUpdate: string;
  nextAction: string;
  routingStatus: string;
  drawer: {
    submittedFields: { label: string; value: string }[];
    documentsUploaded: { name: string; status: string }[];
    validationLog: string[];
    routingLog: { system: string; status: string; message: string; time: string }[];
    systemResponses: string[];
    assignedTeam: string;
  };
};

export const historySubmissions: HistorySubmission[] = [
  {
    id: "hist-martinez",
    client: "Martinez Landscaping",
    formType: "Contractors",
    submittedBy: "Pedro",
    submittedAt: "Today, 11:42 AM",
    completionTime: "9 min",
    status: "Routed",
    routedTo: "All Systems",
    validationStatus: "Complete",
    lastUpdate: "5 min ago",
    nextAction: "Open Submission",
    routingStatus: "Partial",
    drawer: {
      submittedFields: [
        { label: "Business Name", value: "Martinez Landscaping" },
        { label: "Coverage", value: "GL, Workers Comp" },
        { label: "Annual Revenue", value: "$1.2M" },
        { label: "Payroll", value: "$420,000" },
      ],
      documentsUploaded: [
        { name: "Signed App", status: "Uploaded" },
        { name: "Loss Runs", status: "Missing" },
        { name: "Payroll Report", status: "Uploaded" },
      ],
      validationLog: ["Business info validated", "Owner contact verified", "Loss runs flagged missing"],
      routingLog: [
        { system: "AgencyZoom", status: "Success", message: "Lead created #AZ-4821", time: "11:43 AM" },
        { system: "Slack", status: "Success", message: "Posted to #commercial-intake", time: "11:43 AM" },
        { system: "Monday", status: "Pending", message: "Awaiting board sync", time: "11:44 AM" },
      ],
      systemResponses: ["AgencyZoom: Lead ID AZ-4821", "Slack: Message ts_928471"],
      assignedTeam: "JoJo (VA), Eva (Producer)",
    },
  },
  {
    id: "hist-kim",
    client: "Kim Auto Shop",
    formType: "Contractors",
    submittedBy: "JoJo",
    submittedAt: "Today, 10:24 AM",
    completionTime: "11 min",
    status: "Failed",
    routedTo: "AgencyZoom",
    validationStatus: "Missing Docs",
    lastUpdate: "34 min ago",
    nextAction: "Retry",
    routingStatus: "Failed",
    drawer: {
      submittedFields: [
        { label: "Business Name", value: "Kim Auto Shop" },
        { label: "Coverage", value: "Commercial Auto, GL" },
        { label: "Annual Revenue", value: "$680K" },
      ],
      documentsUploaded: [
        { name: "Signed App", status: "Missing" },
        { name: "Driver List", status: "Missing" },
      ],
      validationLog: ["Missing signed application", "Missing driver list", "AgencyZoom timeout on route"],
      routingLog: [
        { system: "AgencyZoom", status: "Failed", message: "Connection timeout after 30s", time: "10:24 AM" },
        { system: "Slack", status: "Success", message: "Alert posted to #commercial-intake", time: "10:25 AM" },
        { system: "Monday", status: "Success", message: "Item created on board", time: "10:25 AM" },
      ],
      systemResponses: ["AgencyZoom: ERROR_TIMEOUT", "Slack: OK"],
      assignedTeam: "Pedro (VA), Eva (Producer)",
    },
  },
  {
    id: "hist-seoul",
    client: "Greenline Logistics",
    formType: "Restaurants",
    submittedBy: "Eva",
    submittedAt: "Today, 9:15 AM",
    completionTime: "11 min",
    status: "Completed",
    routedTo: "All Systems",
    validationStatus: "Complete",
    lastUpdate: "52 min ago",
    nextAction: "Open Submission",
    routingStatus: "All Systems",
    drawer: {
      submittedFields: [
        { label: "Business Name", value: "Greenline Logistics" },
        { label: "Coverage", value: "BOP, Liquor Liability" },
        { label: "Locations", value: "3" },
      ],
      documentsUploaded: [
        { name: "Signed App", status: "Uploaded" },
        { name: "Liquor License", status: "Uploaded" },
        { name: "Menu / Revenue", status: "Uploaded" },
      ],
      validationLog: ["All required fields complete", "Documents verified", "No duplicates found"],
      routingLog: [
        { system: "AgencyZoom", status: "Success", message: "Lead created #AZ-4819", time: "9:16 AM" },
        { system: "Slack", status: "Success", message: "Posted to #commercial-intake", time: "9:16 AM" },
        { system: "Monday", status: "Success", message: "Added to Restaurant Pipeline", time: "9:17 AM" },
      ],
      systemResponses: ["All systems acknowledged"],
      assignedTeam: "JoJo (VA), Tracie (Producer)",
    },
  },
  {
    id: "hist-johnson",
    client: "Johnson Family",
    formType: "Personal Lines",
    submittedBy: "Tracie",
    submittedAt: "Today, 8:30 AM",
    completionTime: "6 min",
    status: "Completed",
    routedTo: "All Systems",
    validationStatus: "Complete",
    lastUpdate: "1 hour ago",
    nextAction: "Open Submission",
    routingStatus: "All Systems",
    drawer: {
      submittedFields: [
        { label: "Client Name", value: "Johnson Family" },
        { label: "Coverage", value: "Auto + Home Bundle" },
        { label: "State", value: "TX" },
      ],
      documentsUploaded: [
        { name: "Driver Info", status: "Uploaded" },
        { name: "Current Dec Pages", status: "Uploaded" },
      ],
      validationLog: ["Personal lines validation passed"],
      routingLog: [
        { system: "AgencyZoom", status: "Success", message: "Contact created", time: "8:31 AM" },
        { system: "Slack", status: "Success", message: "Posted to #personal-intake", time: "8:31 AM" },
        { system: "Monday", status: "Success", message: "Added to Personal Lines board", time: "8:32 AM" },
      ],
      systemResponses: ["All systems acknowledged"],
      assignedTeam: "Tracie (Producer)",
    },
  },
  {
    id: "hist-abc",
    client: "ABC Logistics",
    formType: "Contractors",
    submittedBy: "Pedro",
    submittedAt: "Yesterday, 3:45 PM",
    completionTime: "10 min",
    status: "Failed",
    routedTo: "AgencyZoom",
    validationStatus: "Incomplete",
    lastUpdate: "Yesterday",
    nextAction: "Review Submission",
    routingStatus: "Failed",
    drawer: {
      submittedFields: [
        { label: "Business Name", value: "ABC Logistics" },
        { label: "Coverage", value: "Commercial Auto, GL" },
      ],
      documentsUploaded: [{ name: "Signed App", status: "Missing" }],
      validationLog: ["Missing required documents", "Incomplete business profile"],
      routingLog: [
        { system: "AgencyZoom", status: "Failed", message: "Missing required documents", time: "3:45 PM" },
      ],
      systemResponses: ["AgencyZoom: VALIDATION_ERROR"],
      assignedTeam: "Hamad (VA)",
    },
  },
  {
    id: "hist-valley",
    client: "Valley Medical Supply",
    formType: "Contractors",
    submittedBy: "Hamad",
    submittedAt: "Yesterday, 1:30 PM",
    completionTime: "9 min",
    status: "Failed",
    routedTo: "Monday",
    validationStatus: "Complete",
    lastUpdate: "Yesterday",
    nextAction: "Retry",
    routingStatus: "Failed",
    drawer: {
      submittedFields: [
        { label: "Business Name", value: "Valley Medical Supply" },
        { label: "Coverage", value: "BOP" },
      ],
      documentsUploaded: [{ name: "Signed App", status: "Uploaded" }],
      validationLog: ["Validation passed", "Monday webhook failed"],
      routingLog: [
        { system: "AgencyZoom", status: "Success", message: "Lead created", time: "1:31 PM" },
        { system: "Slack", status: "Success", message: "Posted", time: "1:31 PM" },
        { system: "Monday", status: "Failed", message: "Webhook failure: 500 error", time: "1:32 PM" },
      ],
      systemResponses: ["Monday: WEBHOOK_ERROR_500"],
      assignedTeam: "Hamad (VA)",
    },
  },
  {
    id: "hist-northside",
    client: "Northside Builders",
    formType: "Contractors",
    submittedBy: "JoJo",
    submittedAt: "Draft",
    completionTime: "-",
    status: "Draft",
    routedTo: "-",
    validationStatus: "Incomplete",
    lastUpdate: "Today",
    nextAction: "Continue Draft",
    routingStatus: "Pending",
    drawer: {
      submittedFields: [
        { label: "Business Name", value: "Northside Builders" },
        { label: "Progress", value: "60%" },
      ],
      documentsUploaded: [],
      validationLog: ["Draft: not yet submitted"],
      routingLog: [],
      systemResponses: [],
      assignedTeam: "JoJo (VA)",
    },
  },
  {
    id: "hist-paks",
    client: "Atlas Roofing",
    formType: "Contractors",
    submittedBy: "Hamad",
    submittedAt: "Yesterday, 2:10 PM",
    completionTime: "8 min",
    status: "Pending Review",
    routedTo: "Slack",
    validationStatus: "Duplicate Found",
    lastUpdate: "18 hours ago",
    nextAction: "Review",
    routingStatus: "Partial",
    drawer: {
      submittedFields: [
        { label: "Business Name", value: "Atlas Roofing" },
        { label: "Coverage", value: "General Liability" },
      ],
      documentsUploaded: [{ name: "Signed App", status: "Uploaded" }],
      validationLog: ["Possible duplicate: existing submission found", "Awaiting team review"],
      routingLog: [
        { system: "Slack", status: "Success", message: "Review alert posted", time: "2:11 PM" },
      ],
      systemResponses: ["Duplicate check flagged existing record"],
      assignedTeam: "JoJo (VA), Eva (Producer)",
    },
  },
  {
    id: "hist-greenleaf",
    client: "Green Leaf Café",
    formType: "Restaurants",
    submittedBy: "Eva",
    submittedAt: "Draft",
    completionTime: "-",
    status: "Draft",
    routedTo: "-",
    validationStatus: "Incomplete",
    lastUpdate: "Yesterday",
    nextAction: "Continue Draft",
    routingStatus: "Pending",
    drawer: {
      submittedFields: [
        { label: "Business Name", value: "Green Leaf Café" },
        { label: "Progress", value: "40%" },
      ],
      documentsUploaded: [],
      validationLog: ["Draft: not yet submitted"],
      routingLog: [],
      systemResponses: [],
      assignedTeam: "Eva (Producer)",
    },
  },
];

export const routingActivity = [
  {
    id: "ra-martinez",
    client: "Martinez Landscaping",
    systems: [
      { system: "AgencyZoom", status: "Success" as RoutingSystemStatus },
      { system: "Slack", status: "Success" as RoutingSystemStatus },
      { system: "Monday", status: "Pending" as RoutingSystemStatus },
    ],
  },
  {
    id: "ra-kim",
    client: "Kim Auto Shop",
    systems: [
      { system: "AgencyZoom", status: "Failed" as RoutingSystemStatus },
      { system: "Slack", status: "Success" as RoutingSystemStatus },
      { system: "Monday", status: "Success" as RoutingSystemStatus },
    ],
  },
  {
    id: "ra-seoul",
    client: "Greenline Logistics",
    systems: [
      { system: "AgencyZoom", status: "Success" as RoutingSystemStatus },
      { system: "Slack", status: "Success" as RoutingSystemStatus },
      { system: "Monday", status: "Success" as RoutingSystemStatus },
    ],
  },
];

export const failedSubmissionQueue = [
  {
    id: "fail-kim",
    client: "Kim Auto Shop",
    issue: "AgencyZoom timeout",
    failedAt: "10:24 AM",
    submittedBy: "JoJo",
    cta: "Retry Routing",
    submissionId: "hist-kim",
  },
  {
    id: "fail-abc",
    client: "ABC Logistics",
    issue: "Missing required documents",
    failedAt: "Yesterday",
    submittedBy: "Pedro",
    cta: "Review Submission",
    submissionId: "hist-abc",
  },
  {
    id: "fail-valley",
    client: "Valley Medical Supply",
    issue: "Monday webhook failure",
    failedAt: "Yesterday",
    submittedBy: "Hamad",
    cta: "Retry Routing",
    submissionId: "hist-valley",
  },
];

export const historyDrafts = [
  {
    id: "draft-northside",
    client: "Northside Builders",
    form: "Contractors",
    progress: 60,
    lastEdited: "Today",
    formType: "contractors" as const,
    cta: "Resume Draft",
  },
  {
    id: "draft-greenleaf",
    client: "Green Leaf Café",
    form: "Restaurants",
    progress: 40,
    lastEdited: "Yesterday",
    formType: "restaurants" as const,
    cta: "Continue",
  },
];

export const submissionTimeline = [
  { id: "tl-1", message: "Pedro submitted Contractors Intake", timeAgo: "18 min ago" },
  { id: "tl-2", message: "JoJo retried failed AgencyZoom route", timeAgo: "34 min ago" },
  { id: "tl-3", message: "Eva completed Restaurant Intake", timeAgo: "52 min ago" },
  { id: "tl-4", message: "Kyle fixed routing webhook issue", timeAgo: "1 hour ago" },
  { id: "tl-5", message: "Hamad flagged duplicate for Atlas Roofing", timeAgo: "2 hours ago" },
];

export type HistoryFilterKey = keyof typeof historyFilterOptions;

export type HistoryFilterState = {
  formType: string;
  submittedBy: string;
  status: string;
  dateRange: string;
  routingStatus: string;
};

export const defaultHistoryFilters: HistoryFilterState = {
  formType: historyFilterOptions.formType[0],
  submittedBy: historyFilterOptions.submittedBy[0],
  status: historyFilterOptions.status[0],
  dateRange: historyFilterOptions.dateRange[0],
  routingStatus: historyFilterOptions.routingStatus[0],
};

export function matchesHistoryFilters(
  row: HistorySubmission,
  search: string,
  filters: HistoryFilterState,
) {
  const q = search.trim().toLowerCase();
  if (q) {
    const haystack = [row.client, row.formType, row.submittedBy, row.status, row.validationStatus]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  if (filters.formType !== "Form Type" && row.formType !== filters.formType) return false;
  if (filters.submittedBy !== "Submitted By" && row.submittedBy !== filters.submittedBy) return false;
  if (filters.status !== "Status" && row.status !== filters.status) return false;
  if (filters.routingStatus !== "Routing Status" && row.routingStatus !== filters.routingStatus) return false;

  if (filters.dateRange !== "Date Range") {
    if (filters.dateRange === "Today") {
      if (!row.submittedAt.startsWith("Today")) return false;
    }
  }

  return true;
}
