export const submissionRulesHeader = {
  title: "Submission Rules",
  subtitle: "Carrier submission requirements, binding rules, and decline triggers.",
};

export type RuleStatus = "Required" | "Conditional" | "Optional" | "Active" | "Restricted" | "Blocked";

export const ruleStatusClass: Record<RuleStatus, string> = {
  Required: "badge-red",
  Conditional: "badge-yellow",
  Optional: "badge-blue",
  Active: "badge-green",
  Restricted: "badge-yellow",
  Blocked: "badge-red",
};

export const requiredDocumentsByProduct = [
  {
    id: "doc-bop",
    product: "BOP",
    documents: ["Signed Application", "Loss Runs (5 yr)", "Payroll Report", "Business License"],
    status: "Required" as RuleStatus,
    notes: "All docs required before portal submit",
  },
  {
    id: "doc-wc",
    product: "Workers Comp",
    documents: ["Payroll by Class", "Signed Application", "Experience Mod Worksheet", "Loss Runs"],
    status: "Required" as RuleStatus,
    notes: "Payroll must match class codes",
  },
  {
    id: "doc-auto",
    product: "Commercial Auto",
    documents: ["Driver List", "MVR Reports", "Signed Application", "Current Dec Page"],
    status: "Required" as RuleStatus,
    notes: "MVR within 90 days",
  },
  {
    id: "doc-gl",
    product: "GL",
    documents: ["Signed Application", "Loss Runs", "Operations Description"],
    status: "Required" as RuleStatus,
    notes: "Operations narrative required for contractors",
  },
  {
    id: "doc-umbrella",
    product: "Umbrella",
    documents: ["Underlying Dec Pages", "Signed Application", "Loss Runs"],
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
    severity: "High Risk",
    action: "Refer to underwriter — do not auto-submit",
    status: "Blocked" as RuleStatus,
  },
  {
    id: "decl-2",
    trigger: "Roofing operations without safety program",
    severity: "High Risk",
    action: "Decline or seek surplus market",
    status: "Blocked" as RuleStatus,
  },
  {
    id: "decl-3",
    trigger: "Prior carrier cancellation within 24 months",
    severity: "Standard",
    action: "Requires explanation letter",
    status: "Restricted" as RuleStatus,
  },
  {
    id: "decl-4",
    trigger: "Fleet size exceeds carrier appetite (>25 units)",
    severity: "Standard",
    action: "Split fleet or alternate market",
    status: "Restricted" as RuleStatus,
  },
  {
    id: "decl-5",
    trigger: "Liquor sales without valid license on file",
    severity: "High Risk",
    action: "Hold submission until license uploaded",
    status: "Blocked" as RuleStatus,
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
