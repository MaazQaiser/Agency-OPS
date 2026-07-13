export const submissionChecklistHeader = {
  title: "Submission Checklist",
  subtitle: "Review all required items before sending to market.",
  quickActions: [
    { id: "upload", label: "Upload Document", icon: "upload" as const },
    { id: "add-note", label: "Add Note", icon: "message-square" as const },
    { id: "mark-ready", label: "Mark Ready", icon: "check" as const },
    { id: "submit", label: "Submit to Carrier", icon: "send" as const },
  ],
};

export type DocumentStatus = "Uploaded" | "Pending" | "Completed";

export type SubmissionDocument = {
  id: string;
  name: string;
  status: DocumentStatus;
  uploadedBy?: string;
  requestedAgo?: string;
  drawer: {
    preview: string;
    uploadHistory: { id: string; action: string; by: string; date: string }[];
    versionHistory: { id: string; version: string; date: string }[];
    requestedBy?: string;
    uploadedBy?: string;
    internalNotes: string[];
  };
};

export type CoverageValidationStatus = "Verified" | "Pending" | "Suggested";

export type CoverageValidationItem = {
  id: string;
  name: string;
  status: CoverageValidationStatus;
  detail: string;
  issue?: string;
};

export type ApprovalItem = {
  id: string;
  label: string;
  complete: boolean;
};

export type ChecklistActivity = {
  id: string;
  message: string;
  timeAgo: string;
};

export type SubmissionChecklist = {
  id: string;
  clientName: string;
  carrier: string;
  carrierId: string;
  coverageType: string;
  assignedVa: string;
  producer: string;
  submissionDate: string;
  renewalDate: string;
  estimatedPremium: string;
  documents: SubmissionDocument[];
  readiness: {
    completedItems: number;
    pendingItems: number;
    completion: number;
    status: "Ready" | "Not Ready";
    blockingItems: string[];
  };
  coverageValidation: CoverageValidationItem[];
  underwritingQuestions: {
    yearsInBusiness: string;
    priorClaims: string;
    openLosses: string;
    priorCancellation: string;
    subcontractorCost: string;
    highRiskOperations: string;
  };
  brokerNotes: string[];
  approvalChecklist: ApprovalItem[];
  activity: ChecklistActivity[];
};

export const documentStatusClass: Record<DocumentStatus, string> = {
  Uploaded: "badge-green",
  Pending: "badge-yellow",
  Completed: "badge-blue",
};

export const coverageValidationClass: Record<CoverageValidationStatus, string> = {
  Verified: "badge-green",
  Pending: "badge-yellow",
  Suggested: "badge-blue",
};

export const DEFAULT_SUBMISSION_ID = "sub-martinez-markel";

const martinezMarkelSubmission: SubmissionChecklist = {
  id: "sub-martinez-markel",
  clientName: "Martinez Landscaping",
  carrier: "Markel",
  carrierId: "car-markel-bop",
  coverageType: "BOP + Workers Comp",
  assignedVa: "JoJo",
  producer: "Eva",
  submissionDate: "June 20, 2026",
  renewalDate: "July 12, 2026",
  estimatedPremium: "$8,400",
  documents: [
    {
      id: "doc-app",
      name: "Signed Application",
      status: "Uploaded",
      uploadedBy: "JoJo",
      drawer: {
        preview: "Signed commercial application: Martinez Landscaping: BOP + WC package.",
        uploadHistory: [
          { id: "uh-1", action: "Uploaded", by: "JoJo", date: "June 18, 2026" },
          { id: "uh-2", action: "Verified", by: "Eva", date: "June 19, 2026" },
        ],
        versionHistory: [
          { id: "vh-1", version: "v2: signed", date: "June 18, 2026" },
          { id: "vh-2", version: "v1: draft", date: "June 17, 2026" },
        ],
        uploadedBy: "JoJo",
        internalNotes: ["Client signed electronically via DocuSign."],
      },
    },
    {
      id: "doc-loss",
      name: "Loss Runs (5 Years)",
      status: "Pending",
      requestedAgo: "2 days ago",
      drawer: {
        preview: "Loss runs not yet received from prior carrier.",
        uploadHistory: [
          { id: "uh-3", action: "Requested", by: "Pedro", date: "June 18, 2026" },
        ],
        versionHistory: [],
        requestedBy: "Pedro",
        internalNotes: ["Requested from Hartford: follow up if not received by Friday."],
      },
    },
    {
      id: "doc-dec",
      name: "Current Dec Page",
      status: "Uploaded",
      uploadedBy: "JoJo",
      drawer: {
        preview: "Current dec page: Hartford BOP policy expiring July 12, 2026.",
        uploadHistory: [
          { id: "uh-4", action: "Uploaded", by: "JoJo", date: "June 17, 2026" },
        ],
        versionHistory: [{ id: "vh-3", version: "v1", date: "June 17, 2026" }],
        uploadedBy: "JoJo",
        internalNotes: [],
      },
    },
    {
      id: "doc-payroll",
      name: "Payroll Report",
      status: "Uploaded",
      uploadedBy: "JoJo",
      drawer: {
        preview: "Payroll report: $420,000 annual: class codes 0042, 8810.",
        uploadHistory: [
          { id: "uh-5", action: "Uploaded", by: "JoJo", date: "June 20, 2026" },
        ],
        versionHistory: [
          { id: "vh-4", version: "v2: updated payroll", date: "June 20, 2026" },
          { id: "vh-5", version: "v1", date: "June 15, 2026" },
        ],
        uploadedBy: "JoJo",
        internalNotes: ["Payroll updated last week per client request."],
      },
    },
    {
      id: "doc-drivers",
      name: "Driver List",
      status: "Pending",
      drawer: {
        preview: "Driver list pending: 3 commercial vehicles on account.",
        uploadHistory: [],
        versionHistory: [],
        internalNotes: ["Client has 3 vehicles: need DL and MVR for each driver."],
      },
    },
    {
      id: "doc-supplemental",
      name: "Supplemental Form",
      status: "Uploaded",
      uploadedBy: "JoJo",
      drawer: {
        preview: "Markel contractor supplemental: completed and signed.",
        uploadHistory: [
          { id: "uh-6", action: "Uploaded", by: "JoJo", date: "June 19, 2026" },
        ],
        versionHistory: [{ id: "vh-6", version: "v1", date: "June 19, 2026" }],
        uploadedBy: "JoJo",
        internalNotes: [],
      },
    },
    {
      id: "doc-description",
      name: "Business Description",
      status: "Completed",
      uploadedBy: "JoJo",
      drawer: {
        preview: "Landscaping and lawn maintenance: residential and commercial accounts.",
        uploadHistory: [
          { id: "uh-7", action: "Completed in system", by: "JoJo", date: "June 17, 2026" },
        ],
        versionHistory: [{ id: "vh-7", version: "v1", date: "June 17, 2026" }],
        uploadedBy: "JoJo",
        internalNotes: ["No tree work or hardscape over $50K per project."],
      },
    },
  ],
  readiness: {
    completedItems: 5,
    pendingItems: 2,
    completion: 72,
    status: "Not Ready",
    blockingItems: ["Loss Runs missing", "Driver List missing"],
  },
  coverageValidation: [
    {
      id: "cov-gl",
      name: "General Liability",
      status: "Verified",
      detail: "Limits: $1M / $2M",
    },
    {
      id: "cov-wc",
      name: "Workers Comp",
      status: "Verified",
      detail: "Payroll: $420,000",
    },
    {
      id: "cov-auto",
      name: "Commercial Auto",
      status: "Pending",
      detail: "3 vehicles on schedule",
      issue: "Driver List Missing",
    },
    {
      id: "cov-umbrella",
      name: "Umbrella",
      status: "Suggested",
      detail: "Recommended $1M umbrella",
      issue: "Not Added",
    },
  ],
  underwritingQuestions: {
    yearsInBusiness: "8",
    priorClaims: "1",
    openLosses: "No",
    priorCancellation: "No",
    subcontractorCost: "$80,000",
    highRiskOperations: "No",
  },
  brokerNotes: [
    "Client wants quote by Friday.",
    "Owner requested lower deductible options.",
    "Payroll updated last week.",
    "Loss runs still pending.",
  ],
  approvalChecklist: [
    { id: "ap-docs", label: "All required docs uploaded", complete: false },
    { id: "ap-coverage", label: "Coverage verified", complete: true },
    { id: "ap-carrier", label: "Carrier selected", complete: true },
    { id: "ap-producer", label: "Producer reviewed", complete: true },
    { id: "ap-notes", label: "Internal notes added", complete: true },
    { id: "ap-rules", label: "Submission rules confirmed", complete: false },
  ],
  activity: [
    { id: "act-1", message: "JoJo uploaded payroll report", timeAgo: "Today" },
    { id: "act-2", message: "Pedro requested loss runs", timeAgo: "Yesterday" },
    { id: "act-3", message: "Eva reviewed coverage", timeAgo: "2 days ago" },
    { id: "act-4", message: "Driver list still pending", timeAgo: "Today" },
  ],
};

const submissions: SubmissionChecklist[] = [martinezMarkelSubmission];

export function getSubmissionChecklist(submissionId: string): SubmissionChecklist | undefined {
  return submissions.find((s) => s.id === submissionId);
}

export function getSubmissionByCarrier(carrierId: string): SubmissionChecklist | undefined {
  return submissions.find((s) => s.carrierId === carrierId) ?? martinezMarkelSubmission;
}

export function getSubmissionApprovalStatus(checklist: SubmissionChecklist): "Ready" | "Blocked" {
  const allComplete = checklist.approvalChecklist.every((item) => item.complete);
  const noBlockers = checklist.readiness.blockingItems.length === 0;
  return allComplete && noBlockers ? "Ready" : "Blocked";
}
