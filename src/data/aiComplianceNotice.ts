export type ComplianceNoticeState = "normal" | "warning" | "approved";

export const aiComplianceChecklist = [
  "AI assists with drafting only",
  "Human approval required",
  "AI cannot make coverage decisions",
  "Sensitive customer information is protected",
  "Every draft is logged for auditing",
] as const;

export const aiComplianceFooterCopy = {
  title: "AI Drafting Compliance",
  lines: [
    "AI assists with drafting only.",
    "Messages are never sent automatically.",
    "Every draft requires human review before delivery.",
  ],
  learnMoreLabel: "Learn about AI Compliance",
  privacyBadge: "Protected",
  privacyTooltip: "Sensitive customer information is protected during AI drafting.",
  expandLabel: "AI Compliance Information",
} as const;

export type AiCompliancePolicySection = {
  id: string;
  title: string;
  body: string;
};

export const aiCompliancePolicySections: AiCompliancePolicySection[] = [
  {
    id: "how-ai-is-used",
    title: "How AI is used",
    body:
      "Claude AI helps draft outbound client communications from templates, tone, and context you provide. It does not send messages or change proposal records without a licensed human action.",
  },
  {
    id: "human-approval",
    title: "Human approval process",
    body:
      "Every AI-assisted draft must be reviewed and explicitly approved by an authorized user before delivery. Approvals are recorded in the Send Center audit trail.",
  },
  {
    id: "coverage-review",
    title: "Coverage review requirements",
    body:
      "Drafts that include coverage recommendations, limits, deductibles, exclusions, or policy advice require licensed producer review before send is enabled.",
  },
  {
    id: "data-protection",
    title: "Data protection",
    body:
      "Sensitive customer information used during drafting remains within Agency OS controls. AI drafting does not replace your agency’s privacy and retention policies.",
  },
  {
    id: "audit-logging",
    title: "Audit logging",
    body:
      "Generation, edits, approval requests, licensed reviews, and send events are logged for compliance review. Export of audit history is available from the draft timeline.",
  },
];

export function resolveComplianceNoticeState(input: {
  hasCoverageWarning?: boolean;
  isApproved?: boolean;
  forceState?: ComplianceNoticeState | null;
}): ComplianceNoticeState {
  if (input.forceState) return input.forceState;
  if (input.hasCoverageWarning) return "warning";
  if (input.isApproved) return "approved";
  return "normal";
}
