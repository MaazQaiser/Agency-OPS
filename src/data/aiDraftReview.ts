import { templateRecords } from "./sendCenter";
import type { NewDraftFormValues } from "./newDraftForm";
import { formatCurrency, parseCurrency } from "./newDraftForm";
import {
  appendGeneratedAuditEvent,
  appendReviewRequestedAuditEvent,
  createInitialAuditTrail,
  type DraftAuditTrail,
} from "./aiDraftAuditTrail";

export type AiDraftTone = "Professional" | "Warm" | "Concise" | "Formal";

export type AiDraftLanguage = "English" | "Spanish";

export type AiDraftPhase = "review" | "approved";

/** Licensed producer compliance gate for coverage-related AI drafts. */
export type LicensedReviewGate =
  | "not-required"
  | "pending-request"
  | "waiting";

export type LicensedReviewPriority = "Normal" | "High";

export type LicensedApprovalTimelineStepId =
  | "draft-generated"
  | "review-requested"
  | "waiting-approval";

export type LicensedApprovalTimelineStep = {
  id: LicensedApprovalTimelineStepId;
  label: string;
};

export const licensedApprovalTimelineSteps: LicensedApprovalTimelineStep[] = [
  { id: "draft-generated", label: "Draft Generated" },
  { id: "review-requested", label: "Review Requested" },
  { id: "waiting-approval", label: "Waiting for Approval" },
];

export type BodySegment = {
  id: string;
  text: string;
  isCoverage: boolean;
};

export type AiDraftSession = {
  id: string;
  phase: AiDraftPhase;
  clientName: string;
  businessName: string;
  policyType: string;
  producerAssigned: string;
  carrier: string;
  premiumEstimate: string;
  subject: string;
  body: string;
  generatedBy: "Claude AI";
  generatedAt: string;
  generatedAtMs: number;
  selectedTemplate: string;
  tone: AiDraftTone;
  language: AiDraftLanguage;
  highlightGenerated: boolean;
  editedByUser: boolean;
  generationCount: number;
  /** True when draft body/subject includes insurance coverage language. */
  requiresLicensedReview: boolean;
  licensedReviewGate: LicensedReviewGate;
  licensedReviewer: string | null;
  licensedReviewPriority: LicensedReviewPriority;
  licensedReviewRequestedAtMs: number | null;
  estimatedReviewLabel: string;
  auditTrail: DraftAuditTrail;
};

export const aiDraftToneOptions: AiDraftTone[] = [
  "Professional",
  "Warm",
  "Concise",
  "Formal",
];

export const aiDraftLanguageOptions: AiDraftLanguage[] = ["English", "Spanish"];

export const aiDraftTemplateOptions = templateRecords.map((tpl) => tpl.name);

function formatGeneratedAt(date = new Date()): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Relative label for UI (e.g. "2 minutes ago"). Mock-friendly. */
export function formatAiDraftRelativeTime(generatedAtMs: number, nowMs = Date.now()): string {
  const deltaSec = Math.max(0, Math.floor((nowMs - generatedAtMs) / 1000));
  if (deltaSec < 45) return "Just now";
  const minutes = Math.floor(deltaSec / 60);
  if (minutes < 60) return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

const COVERAGE_PATTERNS =
  /\b(coverage|coverages|premium|deductible|deductibles|limit|limits|exclusion|exclusions|liability|policy|policies|advice|recommend|recommendation|recommendations|bop|workers?\s*comp|gl\b|umbrella|endorsement|bind|quote|carrier|effective date|expiration|insured|insurance)\b/i;

/** Mock heuristic: coverage-related language requires licensed producer review. */
export function detectCoverageRelatedContent(...parts: string[]): boolean {
  return parts.some((part) => COVERAGE_PATTERNS.test(part));
}

export function splitBodyIntoSegments(body: string): BodySegment[] {
  const blocks = body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return [{ id: "seg-0", text: body, isCoverage: detectCoverageRelatedContent(body) }];
  }

  return blocks.map((text, index) => ({
    id: `seg-${index}`,
    text,
    isCoverage: detectCoverageRelatedContent(text),
  }));
}

export function getLicensedTimelineCurrentStep(
  gate: LicensedReviewGate,
): LicensedApprovalTimelineStepId {
  if (gate === "waiting") return "waiting-approval";
  if (gate === "pending-request") return "draft-generated";
  return "draft-generated";
}

export function isLicensedTimelineStepComplete(
  stepId: LicensedApprovalTimelineStepId,
  gate: LicensedReviewGate,
): boolean {
  if (gate === "waiting") {
    return stepId === "draft-generated" || stepId === "review-requested";
  }
  if (gate === "pending-request") {
    return stepId === "draft-generated";
  }
  return false;
}

function resolveLicensedReviewer(producerAssigned: string): string | null {
  const trimmed = producerAssigned.trim();
  return trimmed ? trimmed : null;
}

function buildLicensedReviewFields(
  form: Pick<NewDraftFormValues, "producerAssigned">,
  subject: string,
  body: string,
  nowMs: number,
): Pick<
  AiDraftSession,
  | "requiresLicensedReview"
  | "licensedReviewGate"
  | "licensedReviewer"
  | "licensedReviewPriority"
  | "licensedReviewRequestedAtMs"
  | "estimatedReviewLabel"
> {
  const requiresLicensedReview = detectCoverageRelatedContent(subject, body);
  return {
    requiresLicensedReview,
    licensedReviewGate: requiresLicensedReview ? "pending-request" : "not-required",
    licensedReviewer: resolveLicensedReviewer(form.producerAssigned),
    licensedReviewPriority: "Normal",
    licensedReviewRequestedAtMs: requiresLicensedReview ? nowMs - 2 * 60 * 1000 : null,
    estimatedReviewLabel: "Within 15 minutes",
  };
}

function resolveTemplate(form: NewDraftFormValues): string {
  if (form.selectedTemplate.trim()) return form.selectedTemplate;
  const byProduct = aiDraftTemplateOptions.find((name) =>
    name.toLowerCase().includes((form.productType || form.policyType).toLowerCase().split(" ")[0] ?? ""),
  );
  return byProduct ?? aiDraftTemplateOptions[0] ?? "Commercial BOP Proposal";
}

function buildSubject(form: NewDraftFormValues, language: AiDraftLanguage, variant: number): string {
  const client = form.clientName.trim() || "Valued Client";
  const policy = form.policyType || "coverage";
  if (language === "Spanish") {
    const subjects = [
      `Propuesta de ${policy} para ${client}`,
      `${client}: resumen de cotización ${policy}`,
      `Su propuesta de seguro ${policy} está lista`,
    ];
    return subjects[variant % subjects.length]!;
  }
  const subjects = [
    `Your ${policy} proposal for ${client}`,
    `${client}: ${policy} coverage summary`,
    `${policy} proposal ready for review — ${client}`,
  ];
  return subjects[variant % subjects.length]!;
}

function buildBody(form: NewDraftFormValues, tone: AiDraftTone, language: AiDraftLanguage, variant: number): string {
  const client = form.clientName.trim() || "there";
  const policy = form.policyType || "coverage";
  const carrier = form.carrier || "our preferred market";
  const premium = form.premiumEstimate
    ? formatCurrency(parseCurrency(form.premiumEstimate))
    : "the quoted premium";
  const producer = form.producerAssigned || "your producer";

  if (language === "Spanish") {
    const bodies = [
      `Hola ${client},\n\nPreparé una propuesta de ${policy} a través de ${carrier}. El estimado de prima es ${premium}.\n\nRevise los términos adjuntos y avíseme si desea ajustar límites, deducibles o fechas efectivas.\n\nSaludos,\n${producer}`,
      `Estimado/a ${client},\n\nAdjunto encontrará la cotización de ${policy} con ${carrier} (${premium}). Esta versión enfatiza claridad en coberturas y próximos pasos.\n\nQuedo atento/a a sus comentarios.\n\n${producer}`,
      `${client},\n\nSu borrador de ${policy} ya está listo. Mercado: ${carrier}. Prima estimada: ${premium}.\n\nPuede responder a este mensaje con cualquier cambio antes del envío final.\n\n${producer}`,
    ];
    return bodies[variant % bodies.length]!;
  }

  const warm = `Hi ${client},\n\nI put together a ${policy} proposal with ${carrier} for your review. The estimated premium is ${premium}.\n\nPlease take a look at the coverage summary and let me know if you'd like any adjustments before we send it.\n\nBest,\n${producer}`;
  const professional = `Hello ${client},\n\nPlease find your ${policy} proposal prepared with ${carrier}. Estimated premium: ${premium}.\n\nReview the attached terms, limits, and effective dates. Reply with any requested changes prior to final delivery.\n\nRegards,\n${producer}`;
  const concise = `${client} —\n\n${policy} draft ready via ${carrier}. Premium estimate: ${premium}.\n\nReply with edits or confirm to proceed.\n\n${producer}`;
  const formal = `Dear ${client},\n\nOn behalf of our agency, please find the enclosed ${policy} proposal placed with ${carrier}. The indicated premium estimate is ${premium}.\n\nWe welcome your review of the proposed terms and any conditions requiring revision before formal transmission.\n\nSincerely,\n${producer}`;

  const byTone: Record<AiDraftTone, string[]> = {
    Warm: [warm, warm.replace("Best,", "Warm regards,"), warm.replace("I put together", "I've prepared")],
    Professional: [professional, professional.replace("Hello", "Good day"), professional.replace("Regards,", "Thank you,")],
    Concise: [concise, concise.replace("Reply with edits or confirm to proceed.", "Confirm or request changes."), concise.replace("draft ready", "proposal draft ready")],
    Formal: [formal, formal.replace("Dear", "To"), formal.replace("Sincerely,", "Respectfully,")],
  };

  const options = byTone[tone];
  return options[variant % options.length]!;
}

export function createAiDraftSession(
  form: NewDraftFormValues,
  options?: { variant?: number },
): AiDraftSession {
  const tone = form.tone || "Professional";
  const language = form.language || "English";
  const variant = options?.variant ?? 0;
  const now = new Date();
  const subject = form.emailSubject.trim() || buildSubject(form, language, variant);
  const body = buildBody(form, tone, language, variant);
  const id = `ai-draft-${Date.now()}`;
  const selectedTemplate = resolveTemplate(form);
  return {
    id,
    phase: "review",
    clientName: form.clientName,
    businessName: form.businessName,
    policyType: form.policyType,
    producerAssigned: form.producerAssigned,
    carrier: form.carrier,
    premiumEstimate: form.premiumEstimate,
    subject,
    body,
    generatedBy: "Claude AI",
    generatedAt: formatGeneratedAt(now),
    generatedAtMs: now.getTime(),
    selectedTemplate,
    tone,
    language,
    highlightGenerated: true,
    editedByUser: false,
    generationCount: 1,
    ...buildLicensedReviewFields(form, subject, body, now.getTime()),
    auditTrail: createInitialAuditTrail({
      draftId: id,
      generatedBy: "Claude AI",
      language,
      templateUsed: selectedTemplate,
      subject,
      body,
      atMs: now.getTime(),
    }),
  };
}

export function regenerateAiDraftSession(session: AiDraftSession): AiDraftSession {
  const formLike: NewDraftFormValues = {
    clientName: session.clientName,
    businessName: session.businessName,
    policyType: session.policyType,
    effectiveDate: "",
    renewalDate: "",
    producerAssigned: session.producerAssigned,
    carrier: session.carrier,
    productType: "",
    coverageLimit: "",
    deductible: "",
    premiumEstimate: session.premiumEstimate,
    brokerFee: "",
    taxesFees: "",
    submissionType: "",
    mgaContact: "",
    priority: "Medium",
    requiredDocuments: {},
    internalNotes: "",
    specialConditions: "",
    clientRequests: "",
    emailSubject: "",
    emailBody: "",
    tone: session.tone,
    language: session.language,
    selectedTemplate: session.selectedTemplate,
  };
  const variant = session.generationCount;
  const now = new Date();
  const subject = buildSubject(formLike, session.language, variant);
  const body = buildBody(formLike, session.tone, session.language, variant);
  const next = {
    ...session,
    phase: "review" as const,
    subject,
    body,
    generatedAt: formatGeneratedAt(now),
    generatedAtMs: now.getTime(),
    highlightGenerated: true,
    editedByUser: false,
    generationCount: session.generationCount + 1,
    ...buildLicensedReviewFields(
      { producerAssigned: session.producerAssigned },
      subject,
      body,
      now.getTime(),
    ),
  };
  return {
    ...next,
    auditTrail: appendGeneratedAuditEvent(
      session.auditTrail,
      subject,
      body,
      "Claude AI",
      now.getTime(),
    ),
  };
}

export function requestLicensedApproval(session: AiDraftSession): AiDraftSession {
  if (!session.requiresLicensedReview || !session.licensedReviewer) return session;
  const atMs = Date.now();
  return {
    ...session,
    phase: "review",
    licensedReviewGate: "waiting",
    licensedReviewRequestedAtMs: atMs,
    highlightGenerated: false,
    auditTrail: appendReviewRequestedAuditEvent(
      session.auditTrail,
      session.licensedReviewer,
      atMs,
    ),
  };
}
