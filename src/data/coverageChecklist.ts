import type { TrackerSubmission } from "@/data/submissionTracker";

export const coverageChecklistHeader = {
  title: "Coverage Checklist",
  subtitle: "Validate coverage and readiness before sending to market.",
  quickActions: [
    { id: "add-coverage", label: "Add Coverage", icon: "plus" as const },
    { id: "upload-doc", label: "Upload Document", icon: "upload" as const },
    { id: "mark-complete", label: "Mark Complete", icon: "check" as const },
    { id: "send-producer", label: "Send to Producer", icon: "send" as const },
  ],
};

export type CoverageChecklistStage = "Reviewing" | "Coverage Validation" | "Market Ready";

export type CoverageItemStatus = "Completed" | "Pending" | "Not Added";

export type CoverageCategory = "required" | "recommended";

export type DocumentStatus = "Received" | "Pending";

export type CoverageReviewItem = {
  id: string;
  name: string;
  category: CoverageCategory;
  status: CoverageItemStatus;
  carrier?: string;
  limit?: string;
  payroll?: string;
  vehicles?: number;
  driverList?: string;
  recommendation?: string;
  notes: string;
  drawer: {
    details: string;
    carrierOptions: string[];
    limits: string;
    deductibles: string;
    exclusions: string;
    premiumOptions: { carrier: string; premium: string }[];
    brokerNotes: string[];
  };
};

export type RequiredDocument = {
  id: string;
  name: string;
  status: DocumentStatus;
};

export type ChecklistClient = {
  id: string;
  submissionId: string;
  clientName: string;
  businessType: string;
  coverageType: string;
  assignedVa: string;
  assignedProducer: string;
  renewalDate: string;
  estimatedPremium: string;
  currentStage: CoverageChecklistStage;
  riskOverview: {
    claimsHistory: string;
    businessAge: string;
    employeeCount: number;
    annualRevenue: string;
    payroll: string;
    riskScore: {
      label: string;
      score: number;
    };
    riskFlags: string[];
  };
  coverageItems: CoverageReviewItem[];
  requiredDocuments: RequiredDocument[];
};

export const checklistClients: ChecklistClient[] = [
  {
    id: "cl-martinez",
    submissionId: "trk-martinez",
    clientName: "Martinez Landscaping",
    businessType: "Contractor",
    coverageType: "BOP + Workers Comp",
    assignedVa: "JoJo",
    assignedProducer: "Eva",
    renewalDate: "July 12, 2026",
    estimatedPremium: "$8,400",
    currentStage: "Coverage Validation",
    riskOverview: {
      claimsHistory: "1 claim in last 3 years",
      businessAge: "8 years",
      employeeCount: 24,
      annualRevenue: "$1.2M",
      payroll: "$420,000",
      riskScore: { label: "Medium Risk", score: 68 },
      riskFlags: ["Prior cancellation", "Large payroll exposure", "Open claim history"],
    },
    coverageItems: [
      {
        id: "cov-gl",
        name: "General Liability",
        category: "required",
        status: "Completed",
        carrier: "Markel",
        limit: "$1M / $2M",
        notes: "Verified",
        drawer: {
          details: "Standard GL for landscaping contractor operations.",
          carrierOptions: ["Markel", "Travelers", "CNA"],
          limits: "$1M per occurrence / $2M aggregate",
          deductibles: "$1,000",
          exclusions: "Tree work over 15 ft excluded",
          premiumOptions: [
            { carrier: "Markel", premium: "$2,800" },
            { carrier: "Travelers", premium: "$3,100" },
          ],
          brokerNotes: ["Markel selected: best terms for tree work carve-back."],
        },
      },
      {
        id: "cov-wc",
        name: "Workers Compensation",
        category: "required",
        status: "Completed",
        carrier: "Travelers",
        payroll: "$420,000",
        notes: "Verified",
        drawer: {
          details: "Statutory WC for 24 employees across CA operations.",
          carrierOptions: ["Travelers", "ICW", "Employers"],
          limits: "Statutory limits",
          deductibles: "N/A",
          exclusions: "Roofing class excluded",
          premiumOptions: [
            { carrier: "Travelers", premium: "$4,200" },
            { carrier: "ICW", premium: "$4,450" },
          ],
          brokerNotes: ["Payroll verified against Q1 report."],
        },
      },
      {
        id: "cov-auto",
        name: "Commercial Auto",
        category: "required",
        status: "Pending",
        vehicles: 4,
        driverList: "Missing",
        notes: "Waiting on client",
        drawer: {
          details: "4 light-duty trucks and trailers for crew transport.",
          carrierOptions: ["Travelers", "Bristol West"],
          limits: "$1M CSL",
          deductibles: "$1,500",
          exclusions: "Racing and personal use excluded",
          premiumOptions: [{ carrier: "Travelers", premium: "$3,400" }],
          brokerNotes: ["Driver list requested 2 days ago: follow up today."],
        },
      },
      {
        id: "cov-umbrella",
        name: "Umbrella",
        category: "recommended",
        status: "Not Added",
        recommendation: "Suggested",
        notes: "Optional",
        drawer: {
          details: "Excess liability over GL and auto.",
          carrierOptions: ["Markel", "Travelers"],
          limits: "$2M excess",
          deductibles: "N/A",
          exclusions: "Follows underlying",
          premiumOptions: [{ carrier: "Markel", premium: "$2,200" }],
          brokerNotes: ["Recommended given payroll and revenue exposure."],
        },
      },
      {
        id: "cov-epli",
        name: "EPLI",
        category: "recommended",
        status: "Not Added",
        recommendation: "Suggested",
        notes: "Optional",
        drawer: {
          details: "Employment practices liability for 24+ employee count.",
          carrierOptions: ["Markel", "CNA"],
          limits: "$1M",
          deductibles: "$5,000",
          exclusions: "Prior acts excluded",
          premiumOptions: [{ carrier: "Markel", premium: "$1,400" }],
          brokerNotes: ["Strong upsell: employee count over 20."],
        },
      },
      {
        id: "cov-cyber",
        name: "Cyber",
        category: "recommended",
        status: "Not Added",
        recommendation: "Suggested",
        notes: "Optional",
        drawer: {
          details: "Cyber liability for online scheduling and payments.",
          carrierOptions: ["Markel", "CNA"],
          limits: "$500K",
          deductibles: "$2,500",
          exclusions: "Prior acts excluded",
          premiumOptions: [{ carrier: "Markel", premium: "$900" }],
          brokerNotes: ["Recommended for online payment processing."],
        },
      },
    ],
    requiredDocuments: [
      { id: "doc-app", name: "Signed Application", status: "Received" },
      { id: "doc-loss", name: "Loss Runs (5 Years)", status: "Pending" },
      { id: "doc-payroll", name: "Payroll Report", status: "Received" },
      { id: "doc-drivers", name: "Driver List", status: "Pending" },
      { id: "doc-license", name: "Business License", status: "Received" },
      { id: "doc-dec", name: "Current Dec Page", status: "Received" },
    ],
  },
  {
    id: "cl-kim",
    submissionId: "trk-kim",
    clientName: "Kim Auto Shop",
    businessType: "Auto Repair",
    coverageType: "Commercial Auto + GL",
    assignedVa: "Pedro",
    assignedProducer: "Eva",
    renewalDate: "August 3, 2026",
    estimatedPremium: "$5,800",
    currentStage: "Reviewing",
    riskOverview: {
      claimsHistory: "No claims in last 5 years",
      businessAge: "12 years",
      employeeCount: 8,
      annualRevenue: "$680K",
      payroll: "$185,000",
      riskScore: { label: "Low Risk", score: 82 },
      riskFlags: ["Garagekeepers exposure"],
    },
    coverageItems: [
      {
        id: "cov-kim-gl",
        name: "General Liability",
        category: "required",
        status: "Completed",
        carrier: "Travelers",
        limit: "$1M / $2M",
        notes: "Verified",
        drawer: {
          details: "GL for auto repair shop with customer vehicle exposure.",
          carrierOptions: ["Travelers", "Markel"],
          limits: "$1M / $2M",
          deductibles: "$1,000",
          exclusions: "Standard garage exclusions",
          premiumOptions: [{ carrier: "Travelers", premium: "$1,900" }],
          brokerNotes: ["Limits at minimum: client aware."],
        },
      },
      {
        id: "cov-kim-auto",
        name: "Commercial Auto",
        category: "required",
        status: "Pending",
        vehicles: 3,
        driverList: "Missing",
        notes: "Awaiting signed app",
        drawer: {
          details: "3 service vehicles: tow and flatbed.",
          carrierOptions: ["Travelers", "Bristol West"],
          limits: "$1M CSL",
          deductibles: "$1,500",
          exclusions: "Racing excluded",
          premiumOptions: [{ carrier: "Travelers", premium: "$3,900" }],
          brokerNotes: ["Bind blocked on signed application."],
        },
      },
      {
        id: "cov-kim-umbrella",
        name: "Umbrella",
        category: "recommended",
        status: "Not Added",
        recommendation: "Suggested",
        notes: "Optional",
        drawer: {
          details: "Excess liability over GL and auto.",
          carrierOptions: ["Travelers"],
          limits: "$1M excess",
          deductibles: "N/A",
          exclusions: "Follows underlying",
          premiumOptions: [{ carrier: "Travelers", premium: "$1,100" }],
          brokerNotes: ["Optional upsell for garage operations."],
        },
      },
    ],
    requiredDocuments: [
      { id: "doc-kim-app", name: "Signed Application", status: "Pending" },
      { id: "doc-kim-loss", name: "Loss Runs (5 Years)", status: "Received" },
      { id: "doc-kim-drivers", name: "Driver List", status: "Pending" },
      { id: "doc-kim-license", name: "Business License", status: "Received" },
    ],
  },
];

export function getRequiredCoverageItems(client: ChecklistClient) {
  return client.coverageItems.filter((item) => item.category === "required");
}

export function getRecommendedCoverageItems(client: ChecklistClient) {
  return client.coverageItems.filter((item) => item.category === "recommended");
}

export function getCoverageCompletion(client: ChecklistClient) {
  const required = getRequiredCoverageItems(client);
  const completed = required.filter((item) => item.status === "Completed").length;
  const total = required.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { completed, total, percent };
}

export function getBindBlockers(client: ChecklistClient): string[] {
  const blockers: string[] = [];

  for (const doc of client.requiredDocuments) {
    if (doc.status === "Pending") {
      blockers.push(`${doc.name} missing`);
    }
  }

  for (const item of getRequiredCoverageItems(client)) {
    if (item.driverList === "Missing") {
      blockers.push(`${item.name}: Driver List missing`);
    }
  }

  return blockers;
}

export function getDocumentsStatus(client: ChecklistClient) {
  const received = client.requiredDocuments.filter((doc) => doc.status === "Received").length;
  const total = client.requiredDocuments.length;

  return { received, total };
}

export function getRiskScoreFactors(client: ChecklistClient): string[] {
  return [
    client.riskOverview.claimsHistory.toLowerCase().includes("no claim")
      ? "Clean claims history"
      : "Prior claims",
    "Payroll exposure",
    "Business age",
    "Employee count",
  ];
}

export function getStageBadgeClass(stage: CoverageChecklistStage): string {
  if (stage === "Market Ready") return "badge-green";
  if (stage === "Coverage Validation") return "badge-yellow";
  return "badge-blue";
}

export const COVERAGE_TYPE_OPTIONS = [
  { value: "General Liability", category: "required" as const },
  { value: "Workers Comp", category: "required" as const },
  { value: "Commercial Auto", category: "required" as const },
  { value: "Umbrella", category: "recommended" as const },
  { value: "EPLI", category: "recommended" as const },
  { value: "Cyber", category: "recommended" as const },
] as const;

export const DOCUMENT_UPLOAD_OPTIONS = [
  "Signed Application",
  "Loss Runs",
  "Payroll Report",
  "Driver List",
  "Dec Page",
  "Business License",
] as const;

export const ALLOWED_UPLOAD_EXTENSIONS = [".pdf", ".doc", ".docx"];

export type AddCoveragePayload = {
  coverageType: string;
  carrier: string;
  limit: string;
  deductible: string;
  notes: string;
};

export type UploadDocumentPayload = {
  documentType: string;
  fileName: string;
  notes: string;
};

export function validateAddCoverage(
  client: ChecklistClient,
  payload: AddCoveragePayload,
): { ok: boolean; error?: string } {
  if (!payload.coverageType.trim()) {
    return { ok: false, error: "Select a coverage type." };
  }

  const exists = client.coverageItems.some(
    (item) => item.name.toLowerCase() === payload.coverageType.trim().toLowerCase(),
  );
  if (exists) {
    return { ok: false, error: "This coverage already exists" };
  }

  return { ok: true };
}

export function applyAddCoverage(
  client: ChecklistClient,
  payload: AddCoveragePayload,
): ChecklistClient {
  const option = COVERAGE_TYPE_OPTIONS.find((item) => item.value === payload.coverageType);
  const category = option?.category ?? "recommended";
  const id = `cov-${payload.coverageType.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

  const newItem: CoverageReviewItem = {
    id,
    name: payload.coverageType,
    category,
    status: category === "required" ? "Pending" : "Not Added",
    carrier: payload.carrier.trim() || undefined,
    limit: payload.limit.trim() || undefined,
    notes: payload.notes.trim() || "Added from checklist",
    drawer: {
      details: `${payload.coverageType} added during coverage validation.`,
      carrierOptions: payload.carrier.trim() ? [payload.carrier.trim()] : [],
      limits: payload.limit.trim() || "TBD",
      deductibles: payload.deductible.trim() || "TBD",
      exclusions: "Pending underwriting review",
      premiumOptions: [],
      brokerNotes: payload.notes.trim() ? [payload.notes.trim()] : [],
    },
  };

  if (payload.deductible.trim()) {
    newItem.drawer.deductibles = payload.deductible.trim();
  }

  return {
    ...client,
    coverageItems: [...client.coverageItems, newItem],
    currentStage: client.currentStage === "Reviewing" ? "Coverage Validation" : client.currentStage,
  };
}

export function validateUploadDocument(
  payload: UploadDocumentPayload,
  file: File | null,
): { ok: boolean; error?: string } {
  if (!payload.documentType.trim()) {
    return { ok: false, error: "Select a document type." };
  }

  if (!file) {
    return { ok: false, error: "Select a file to upload." };
  }

  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_UPLOAD_EXTENSIONS.includes(extension)) {
    return { ok: false, error: "Only PDF, DOC, and DOCX files are allowed." };
  }

  return { ok: true };
}

function normalizeDocumentName(name: string) {
  return name.toLowerCase().replace(/\s*\(.*?\)\s*/g, "").trim();
}

export function applyUploadDocument(
  client: ChecklistClient,
  payload: UploadDocumentPayload,
): ChecklistClient {
  const normalizedType = normalizeDocumentName(payload.documentType);

  const requiredDocuments = client.requiredDocuments.map((doc) => {
    const docKey = normalizeDocumentName(doc.name);
    if (
      docKey.includes(normalizedType)
      || normalizedType.includes(docKey)
      || (normalizedType === "dec page" && docKey.includes("dec"))
    ) {
      return { ...doc, status: "Received" as const };
    }
    return doc;
  });

  const coverageItems = client.coverageItems.map((item) => {
    if (payload.documentType === "Driver List" && item.driverList === "Missing") {
      return { ...item, driverList: "Received", status: item.status === "Pending" ? item.status : item.status };
    }
    return item;
  });

  return {
    ...client,
    requiredDocuments,
    coverageItems,
    currentStage: client.currentStage === "Reviewing" ? "Coverage Validation" : client.currentStage,
  };
}

export function canMarkChecklistComplete(client: ChecklistClient): { ok: boolean; error?: string } {
  const incompleteRequired = getRequiredCoverageItems(client).filter(
    (item) => item.status !== "Completed",
  );
  const pendingDocs = client.requiredDocuments.filter((doc) => doc.status === "Pending");
  const blockers = getBindBlockers(client);

  if (incompleteRequired.length > 0 || pendingDocs.length > 0 || blockers.length > 0) {
    return { ok: false, error: "Cannot complete checklist. Resolve all required items first." };
  }

  return { ok: true };
}

export function applyMarkChecklistComplete(client: ChecklistClient): ChecklistClient {
  return {
    ...client,
    currentStage: "Market Ready",
  };
}

export function canSendToProducer(
  client: ChecklistClient,
  marketsSubmitted: number,
  requiredMarkets = 3,
): { ok: boolean; error?: string } {
  if (client.currentStage !== "Market Ready") {
    return {
      ok: false,
      error:
        "Submission must be complete and meet minimum market requirement before producer review.",
    };
  }

  if (marketsSubmitted < requiredMarkets) {
    return {
      ok: false,
      error:
        "Submission must be complete and meet minimum market requirement before producer review.",
    };
  }

  return { ok: true };
}

export function computeChecklistHealthScore(client: ChecklistClient): number {
  const completion = getCoverageCompletion(client);
  const docs = getDocumentsStatus(client);
  const docScore = docs.total === 0 ? 0 : (docs.received / docs.total) * 35;
  const coverageScore = completion.percent * 0.35;
  const riskScore = client.riskOverview.riskScore.score * 0.2;
  const blockerPenalty = getBindBlockers(client).length * 8;
  const stageBonus = client.currentStage === "Market Ready" ? 10 : 0;

  return Math.max(
    0,
    Math.min(100, Math.round(coverageScore + docScore + riskScore + stageBonus - blockerPenalty)),
  );
}

export function syncTrackerFromChecklist(
  client: ChecklistClient,
  submission: TrackerSubmission,
  options?: { sentToProducer?: boolean },
): TrackerSubmission {
  const missingDocNames = client.requiredDocuments
    .filter((doc) => doc.status === "Pending")
    .map((doc) => doc.name.replace(/\s*\(.*?\)\s*/g, "").trim());

  const documents = client.requiredDocuments.map((doc) => ({
    label: doc.name,
    status: doc.status === "Received"
      ? ("complete" as const)
      : ("missing" as const),
  }));

  const coverageChecklist = getRequiredCoverageItems(client).map((item) => ({
    label: item.name,
    status:
      item.status === "Completed"
        ? ("complete" as const)
        : item.status === "Pending"
          ? ("pending" as const)
          : ("missing" as const),
  }));

  let status = submission.status;
  let nextAction = submission.nextAction;

  if (options?.sentToProducer) {
    status = "Pending Producer Approval";
    nextAction = "Producer Approval";
  } else if (client.currentStage === "Market Ready") {
    status = submission.marketsSubmitted >= 3 ? "Marketed" : submission.status;
    nextAction = submission.marketsSubmitted >= 3 ? "Add Market" : submission.nextAction;
  } else if (client.currentStage === "Coverage Validation") {
    status = "Reviewing";
    nextAction = "Complete Coverage Checklist";
  }

  return {
    ...submission,
    documents,
    coverageChecklist,
    missingDocs: missingDocNames.length === 0 ? "None" : missingDocNames.join(", "),
    status,
    nextAction,
  };
}
