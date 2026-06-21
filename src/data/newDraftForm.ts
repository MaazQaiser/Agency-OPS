import type { SendPriority } from "./sendCenter";

export type NewDraftFormValues = {
  clientName: string;
  businessName: string;
  policyType: string;
  effectiveDate: string;
  renewalDate: string;
  producerAssigned: string;
  carrier: string;
  productType: string;
  coverageLimit: string;
  deductible: string;
  premiumEstimate: string;
  brokerFee: string;
  taxesFees: string;
  submissionType: string;
  mgaContact: string;
  priority: SendPriority;
  requiredDocuments: Record<string, boolean>;
  internalNotes: string;
  specialConditions: string;
  clientRequests: string;
};

export const newDraftClientOptions = [
  "Martinez Landscaping",
  "Kim Auto Shop",
  "Greenline Logistics",
  "Rivera Construction",
  "Atlas Roofing",
  "Greenline Logistics",
];

export const newDraftPolicyTypes = ["BOP", "Workers Comp", "Commercial Auto", "GL Package", "Umbrella", "Multi-line"];

export const newDraftProducerOptions = ["Eva", "Pedro", "Sarah"];

export const newDraftCarrierOptions = [
  "Travelers",
  "Hartford",
  "Progressive Commercial",
  "CNA",
  "AmTrust",
  "Zurich",
  "Everest",
];

export const newDraftProductTypes = ["Standard", "Multi-line Package", "Renewal", "Bind Request", "Quote Summary"];

export const newDraftSubmissionTypes = ["New Business", "Renewal", "Rewrite", "Endorsement", "Bind Request"];

export const newDraftRequiredDocuments = [
  { id: "acord-125", label: "ACORD 125" },
  { id: "loss-runs", label: "Loss Runs" },
  { id: "financials", label: "Financial Statements" },
  { id: "vehicle-schedule", label: "Vehicle Schedule" },
  { id: "payroll", label: "Payroll Schedule" },
  { id: "coi-request", label: "COI Request" },
] as const;

export const NEW_DRAFT_AUTOSAVE_KEY = "send-center-new-draft-autosave";

export const defaultNewDraftFormValues = (): NewDraftFormValues => ({
  clientName: "",
  businessName: "",
  policyType: "",
  effectiveDate: "",
  renewalDate: "",
  producerAssigned: "",
  carrier: "",
  productType: "",
  coverageLimit: "",
  deductible: "",
  premiumEstimate: "",
  brokerFee: "",
  taxesFees: "",
  submissionType: "",
  mgaContact: "",
  priority: "Medium",
  requiredDocuments: Object.fromEntries(newDraftRequiredDocuments.map((d) => [d.id, false])),
  internalNotes: "",
  specialConditions: "",
  clientRequests: "",
});

export function parseCurrency(value: string): number {
  const n = parseFloat(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function computeDraftTotal(form: NewDraftFormValues): number {
  return parseCurrency(form.premiumEstimate) + parseCurrency(form.brokerFee) + parseCurrency(form.taxesFees);
}

export type NewDraftFormErrors = Partial<Record<keyof NewDraftFormValues | "requiredDocuments", string>>;

export function validateNewDraftForm(form: NewDraftFormValues): NewDraftFormErrors {
  const errors: NewDraftFormErrors = {};

  if (!form.clientName.trim()) errors.clientName = "Client name is required.";
  if (!form.policyType) errors.policyType = "Policy type is required.";
  if (!form.producerAssigned) errors.producerAssigned = "Producer is required.";
  if (!form.carrier.trim()) errors.carrier = "Carrier is required.";
  if (!form.submissionType) errors.submissionType = "Submission type is required.";
  if (!form.premiumEstimate.trim()) errors.premiumEstimate = "Premium estimate is required.";
  if (parseCurrency(form.premiumEstimate) <= 0) errors.premiumEstimate = "Enter a valid premium amount.";

  const docsSelected = Object.values(form.requiredDocuments).some(Boolean);
  if (!docsSelected) errors.requiredDocuments = "Select at least one required document.";

  return errors;
}

export function loadAutosavedDraft(): NewDraftFormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(NEW_DRAFT_AUTOSAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as NewDraftFormValues;
  } catch {
    return null;
  }
}

export function saveAutosavedDraft(form: NewDraftFormValues): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NEW_DRAFT_AUTOSAVE_KEY, JSON.stringify(form));
}

export function clearAutosavedDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(NEW_DRAFT_AUTOSAVE_KEY);
}

export function createDraftQueueRecordFromForm(
  form: NewDraftFormValues,
  submitForReview: boolean,
): import("./sendCenter").DraftQueueRecord {
  const id = `dq-${Date.now()}`;
  return {
    id,
    proposalId: id,
    client: form.clientName,
    policyType: form.policyType,
    draftType: form.productType || form.submissionType || "New Proposal",
    assignedProducer: form.producerAssigned,
    createdAt: new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    priority: form.priority,
    status: submitForReview ? "Ready for Review" : "Draft",
  };
}
