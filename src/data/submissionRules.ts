export const submissionRulesHeader = {
  title: "Submission Rules",
  subtitle: "Carrier submission requirements, binding rules, and decline triggers.",
};

export type RuleStatus = "Required" | "Conditional" | "Optional" | "Active" | "Restricted" | "Blocked";

export type AutoValidationStatus = "Passed" | "Failed" | "Pending" | "Not Run";

export type DeclineSeverity = "Low" | "Medium" | "High" | "Hard Decline";

export const declineSeverityClass: Record<DeclineSeverity, string> = {
  Low: "carrier-decline-severity--low",
  Medium: "carrier-decline-severity--medium",
  High: "carrier-decline-severity--high",
  "Hard Decline": "carrier-decline-severity--hard",
};

export const autoValidationClass: Record<AutoValidationStatus, string> = {
  Passed: "badge-green",
  Failed: "badge-red",
  Pending: "badge-yellow",
  "Not Run": "badge-blue",
};

export type RequiredDocumentEntry = {
  id: string;
  document: string;
  requiredByCarrier: string;
  requiredByProduct: string;
  autoValidation: AutoValidationStatus;
  missing: boolean;
};

export type RequiredDocumentsProduct = {
  id: string;
  product: string;
  documents: RequiredDocumentEntry[];
  status: RuleStatus;
  notes: string;
};

export const aiSubmissionGuidance = {
  summary:
    "This risk fits Travelers best for commercial auto and garagekeepers. Avoid Liberty Mutual due to liquor-heavy operations and CA logistics restrictions.",
  bestCarrier: {
    name: "Travelers",
    product: "Commercial Auto / GL",
    reason: "Preferred auto repair appetite with 1.8-day avg turnaround and 38% hit ratio.",
  },
  declineRisks: [
    "Liberty Mutual — liquor-heavy restaurant operations",
    "Liberty Mutual — logistics fleets over 15 units in CA",
    "ICW — roofing without documented safety program",
  ],
  requiredDocs: [
    "Signed Application",
    "Loss Runs (5 yr)",
    "Driver List & MVRs",
    "Liquor License (if applicable)",
    "Operations Description",
  ],
  backupCarrier: {
    name: "Guard",
    product: "BOP (Non-Admitted)",
    reason: "Surplus option for hard-to-place restaurant risks with liquor exposure.",
  },
};

export const ruleStatusClass: Record<RuleStatus, string> = {
  Required: "badge-red",
  Conditional: "badge-yellow",
  Optional: "badge-blue",
  Active: "badge-green",
  Restricted: "badge-yellow",
  Blocked: "badge-red",
};

export const carrierConditionCardClass: Partial<Record<RuleStatus, string>> = {
  Active: "carrier-condition-card--active",
  Restricted: "carrier-condition-card--restricted",
  Blocked: "carrier-condition-card--blocked",
  Required: "carrier-condition-card--required",
  Conditional: "carrier-condition-card--conditional",
};

export const carrierConditionStatusClass: Partial<Record<RuleStatus, string>> = {
  Active: "carrier-condition-status--active",
  Restricted: "carrier-condition-status--restricted",
  Blocked: "carrier-condition-status--blocked",
  Required: "carrier-condition-status--required",
  Conditional: "carrier-condition-status--conditional",
};

export const requiredDocumentsByProduct: RequiredDocumentsProduct[] = [
  {
    id: "doc-bop",
    product: "BOP",
    documents: [
      {
        id: "doc-bop-app",
        document: "Signed Application",
        requiredByCarrier: "All carriers",
        requiredByProduct: "BOP",
        autoValidation: "Passed",
        missing: false,
      },
      {
        id: "doc-bop-loss",
        document: "Loss Runs (5 yr)",
        requiredByCarrier: "Markel, Travelers, CNA",
        requiredByProduct: "BOP",
        autoValidation: "Pending",
        missing: false,
      },
      {
        id: "doc-bop-payroll",
        document: "Payroll Report",
        requiredByCarrier: "Markel, AmTrust",
        requiredByProduct: "BOP / WC bundle",
        autoValidation: "Not Run",
        missing: true,
      },
      {
        id: "doc-bop-license",
        document: "Business License",
        requiredByCarrier: "Markel",
        requiredByProduct: "BOP",
        autoValidation: "Failed",
        missing: true,
      },
    ],
    status: "Required" as RuleStatus,
    notes: "All docs required before portal submit",
  },
  {
    id: "doc-wc",
    product: "Workers Comp",
    documents: [
      {
        id: "doc-wc-payroll",
        document: "Payroll by Class",
        requiredByCarrier: "All WC carriers",
        requiredByProduct: "Workers Comp",
        autoValidation: "Passed",
        missing: false,
      },
      {
        id: "doc-wc-app",
        document: "Signed Application",
        requiredByCarrier: "All carriers",
        requiredByProduct: "Workers Comp",
        autoValidation: "Passed",
        missing: false,
      },
      {
        id: "doc-wc-mod",
        document: "Experience Mod Worksheet",
        requiredByCarrier: "Markel, Employers",
        requiredByProduct: "Workers Comp",
        autoValidation: "Pending",
        missing: false,
      },
      {
        id: "doc-wc-loss",
        document: "Loss Runs",
        requiredByCarrier: "CNA, ICW",
        requiredByProduct: "Workers Comp",
        autoValidation: "Not Run",
        missing: true,
      },
    ],
    status: "Required" as RuleStatus,
    notes: "Payroll must match class codes",
  },
  {
    id: "doc-auto",
    product: "Commercial Auto",
    documents: [
      {
        id: "doc-auto-drivers",
        document: "Driver List",
        requiredByCarrier: "Travelers, Liberty Mutual",
        requiredByProduct: "Commercial Auto",
        autoValidation: "Passed",
        missing: false,
      },
      {
        id: "doc-auto-mvr",
        document: "MVR Reports",
        requiredByCarrier: "Travelers",
        requiredByProduct: "Commercial Auto",
        autoValidation: "Failed",
        missing: true,
      },
      {
        id: "doc-auto-app",
        document: "Signed Application",
        requiredByCarrier: "All carriers",
        requiredByProduct: "Commercial Auto",
        autoValidation: "Passed",
        missing: false,
      },
      {
        id: "doc-auto-dec",
        document: "Current Dec Page",
        requiredByCarrier: "Travelers, Markel",
        requiredByProduct: "Commercial Auto",
        autoValidation: "Pending",
        missing: false,
      },
    ],
    status: "Required" as RuleStatus,
    notes: "MVR within 90 days",
  },
  {
    id: "doc-gl",
    product: "GL",
    documents: [
      {
        id: "doc-gl-app",
        document: "Signed Application",
        requiredByCarrier: "All carriers",
        requiredByProduct: "GL",
        autoValidation: "Passed",
        missing: false,
      },
      {
        id: "doc-gl-loss",
        document: "Loss Runs",
        requiredByCarrier: "Travelers, Markel",
        requiredByProduct: "GL",
        autoValidation: "Not Run",
        missing: false,
      },
      {
        id: "doc-gl-ops",
        document: "Operations Description",
        requiredByCarrier: "Travelers",
        requiredByProduct: "GL",
        autoValidation: "Pending",
        missing: true,
      },
    ],
    status: "Required" as RuleStatus,
    notes: "Operations narrative required for contractors",
  },
  {
    id: "doc-umbrella",
    product: "Umbrella",
    documents: [
      {
        id: "doc-umb-underlying",
        document: "Underlying Dec Pages",
        requiredByCarrier: "Markel",
        requiredByProduct: "Umbrella",
        autoValidation: "Not Run",
        missing: false,
      },
      {
        id: "doc-umb-app",
        document: "Signed Application",
        requiredByCarrier: "Markel",
        requiredByProduct: "Umbrella",
        autoValidation: "Passed",
        missing: false,
      },
      {
        id: "doc-umb-loss",
        document: "Loss Runs",
        requiredByCarrier: "Markel",
        requiredByProduct: "Umbrella",
        autoValidation: "Pending",
        missing: false,
      },
    ],
    status: "Conditional" as RuleStatus,
    notes: "Required when underlying is non-admitted",
  },
];

export const bindingRules = [
  {
    id: "bind-1",
    rule: "Minimum 3 markets quoted before bind recommendation",
    appliesTo: "All Commercial",
    status: "Active" as RuleStatus,
    owner: "Producer Approval",
  },
  {
    id: "bind-2",
    rule: "Signed application and payment authorization required",
    appliesTo: "All Products",
    status: "Required" as RuleStatus,
    owner: "Brokerage Team",
  },
  {
    id: "bind-3",
    rule: "E&O clearance for non-admitted placements",
    appliesTo: "Non-Admitted",
    status: "Required" as RuleStatus,
    owner: "Compliance",
  },
  {
    id: "bind-4",
    rule: "Producer must review quote delta before bind",
    appliesTo: "Renewals",
    status: "Active" as RuleStatus,
    owner: "Sales Team",
  },
  {
    id: "bind-5",
    rule: "Bind confirmation call for premium over $25K",
    appliesTo: "High Premium",
    status: "Conditional" as RuleStatus,
    owner: "Producer",
  },
];

export const declineTriggers = [
  {
    id: "decl-1",
    trigger: "Loss ratio exceeds 65% on prior term",
    severity: "Hard Decline" as DeclineSeverity,
    action: "Refer to underwriter — do not auto-submit",
    status: "Blocked" as RuleStatus,
  },
  {
    id: "decl-2",
    trigger: "Roofing operations without safety program",
    severity: "Hard Decline" as DeclineSeverity,
    action: "Decline or seek surplus market",
    status: "Blocked" as RuleStatus,
  },
  {
    id: "decl-3",
    trigger: "Prior carrier cancellation within 24 months",
    severity: "Medium" as DeclineSeverity,
    action: "Requires explanation letter",
    status: "Restricted" as RuleStatus,
  },
  {
    id: "decl-4",
    trigger: "Fleet size exceeds carrier appetite (>25 units)",
    severity: "High" as DeclineSeverity,
    action: "Split fleet or alternate market",
    status: "Restricted" as RuleStatus,
  },
  {
    id: "decl-5",
    trigger: "Liquor sales without valid license on file",
    severity: "High" as DeclineSeverity,
    action: "Hold submission until license uploaded",
    status: "Blocked" as RuleStatus,
  },
  {
    id: "decl-6",
    trigger: "Revenue exceeds $10M without financials",
    severity: "Low" as DeclineSeverity,
    action: "Request P&L and balance sheet before submit",
    status: "Conditional" as RuleStatus,
  },
];

export const submissionMethodMatrix = [
  {
    id: "matrix-markel",
    carrier: "Markel",
    product: "BOP / WC",
    method: "Portal",
    turnaround: "2–3 days",
    status: "Active" as RuleStatus,
  },
  {
    id: "matrix-travelers",
    carrier: "Travelers",
    product: "Commercial Auto / GL",
    method: "Broker Portal",
    turnaround: "1–2 days",
    status: "Active" as RuleStatus,
  },
  {
    id: "matrix-cna",
    carrier: "CNA",
    product: "BOP / WC",
    method: "Email",
    turnaround: "3–4 days",
    status: "Active" as RuleStatus,
  },
  {
    id: "matrix-guard",
    carrier: "Guard",
    product: "BOP (Non-Admitted)",
    method: "Wholesaler",
    turnaround: "3–5 days",
    status: "Conditional" as RuleStatus,
  },
  {
    id: "matrix-liberty",
    carrier: "Liberty Mutual",
    product: "Commercial Auto",
    method: "Portal",
    turnaround: "2–4 days",
    status: "Restricted" as RuleStatus,
  },
  {
    id: "matrix-employers",
    carrier: "Employers",
    product: "Workers Comp",
    method: "Portal",
    turnaround: "1–2 days",
    status: "Active" as RuleStatus,
  },
];

export const specialCarrierConditions = [
  {
    id: "cond-markel",
    carrier: "Markel",
    condition: "Tree work carve-back available on contractor BOP in CA",
    effective: "June 2026",
    status: "Active" as RuleStatus,
  },
  {
    id: "cond-travelers",
    carrier: "Travelers",
    condition: "Restaurant submissions paused in Texas",
    effective: "May 2026",
    status: "Blocked" as RuleStatus,
  },
  {
    id: "cond-cna",
    carrier: "CNA",
    condition: "New commercial auto product — requires 3 markets minimum",
    effective: "June 2026",
    status: "Conditional" as RuleStatus,
  },
  {
    id: "cond-liberty",
    carrier: "Liberty Mutual",
    condition: "Logistics appetite tightened in California",
    effective: "April 2026",
    status: "Restricted" as RuleStatus,
  },
  {
    id: "cond-icw",
    carrier: "ICW",
    condition: "Roofing WC requires safety program documentation",
    effective: "Ongoing",
    status: "Required" as RuleStatus,
  },
];

export const submissionRulesKpis = [
  {
    label: "Active Rules",
    value: "42",
    sub: "Across all carriers",
    helper: "Submission governance",
    color: "primary" as const,
  },
  {
    label: "Required Docs",
    value: "18",
    sub: "Product-level requirements",
    helper: "Document standards",
    color: "yellow" as const,
  },
  {
    label: "Decline Triggers",
    value: "12",
    sub: "Auto-flag conditions",
    helper: "Risk guardrails",
    color: "primary" as const,
  },
  {
    label: "Special Conditions",
    value: "9",
    sub: "Carrier-specific overrides",
    helper: "Market exceptions",
    color: "green" as const,
  },
];
