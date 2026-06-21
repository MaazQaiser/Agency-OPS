import {
  trackerSubmissions,
  type QuoteOption,
  type TrackerSubmission,
} from "@/data/submissionTracker";

export type QuoteReviewRow = {
  id: string;
  submissionId: string;
  client: string;
  carrier: string;
  premium: string;
  deductible: string;
  coverageLimits: string;
  exclusions: string;
  brokerFee: string;
  status: string;
};

export type ProducerReviewCase = {
  id: string;
  submissionId: string;
  client: string;
  producer: string;
  selectedQuote: QuoteOption | null;
  reviewNotes: string[];
  approvalStatus: string;
  producerApproved: boolean;
  quoteSelectedDate: string;
  targetPremium: string;
  deltaFromTarget: string;
  coverageGapsWarning: string | null;
  coverageGaps: string[];
  recommendation: string;
  clientNotes: string[];
};

function parsePremium(value: string): number {
  return Number(value.replace(/[^0-9.]/g, "")) || 0;
}

function formatDelta(selected: number, target: number): string {
  const diff = selected - target;
  if (diff === 0) return "On target";
  const prefix = diff > 0 ? "+" : "−";
  return `${prefix}$${Math.abs(diff).toLocaleString()}`;
}

function getCoverageGaps(submission: TrackerSubmission): string | null {
  const missing = submission.coverageChecklist.filter((item) => item.status === "missing");
  if (missing.length === 0) return null;
  return `Coverage gaps: ${missing.map((item) => item.label).join(", ")}`;
}

export const quoteReviewHeader = {
  title: "Quote Review",
  subtitle: "Compare returned carrier quotes, obtain producer approval, and track client decisions.",
};

function quoteStatus(submission: TrackerSubmission, quote: QuoteOption): string {
  if (submission.selectedQuoteId === quote.id) return "Selected";
  if (quote.notes.toLowerCase().includes("declined")) return "Declined";
  return "Quoted";
}

export function buildQuoteReviewRows(submissions: TrackerSubmission[] = trackerSubmissions): QuoteReviewRow[] {
  return submissions.flatMap((submission) =>
    submission.quotes.map((quote) => ({
      id: `${submission.id}-${quote.id}`,
      submissionId: submission.id,
      client: submission.client,
      carrier: quote.carrier,
      premium: quote.premium,
      deductible: quote.deductible,
      coverageLimits: quote.coverageLimits,
      exclusions: quote.exclusions,
      brokerFee: quote.brokerFee,
      status: quoteStatus(submission, quote),
    })),
  );
}

export const quoteReviewRows = buildQuoteReviewRows();

export function buildProducerReviewCases(
  submissions: TrackerSubmission[] = trackerSubmissions,
): ProducerReviewCase[] {
  return submissions
    .filter(
      (submission) =>
        submission.status === "Pending Producer Approval"
        || submission.binding?.approvalStatus === "Pending Producer Approval",
    )
    .map((submission) => {
      const selectedQuote =
        submission.quotes.find((quote) => quote.id === submission.selectedQuoteId)
        ?? submission.quotes[0]
        ?? null;

      const targetPremium = submission.premiumValue || "$12,000";
      const selectedAmount = selectedQuote ? parsePremium(selectedQuote.premium) : 0;
      const targetAmount = parsePremium(targetPremium);

      const coverageGaps = submission.coverageChecklist
        .filter((item) => item.status === "missing" || item.status === "pending")
        .map((item) => item.label);

      return {
        id: `pr-${submission.id}`,
        submissionId: submission.id,
        client: submission.client,
        producer: submission.producer,
        selectedQuote,
        reviewNotes: submission.producerNotes.slice(-2),
        approvalStatus: submission.binding?.approvalStatus ?? "Pending Producer Approval",
        producerApproved: Boolean(submission.binding?.producerApproved),
        quoteSelectedDate: submission.followUpDate || submission.submissionDate,
        targetPremium,
        deltaFromTarget: selectedQuote ? formatDelta(selectedAmount, targetAmount) : "—",
        coverageGapsWarning: getCoverageGaps(submission),
        coverageGaps,
        recommendation: selectedQuote?.notes ?? "Select a quote to generate recommendation",
        clientNotes: submission.producerNotes,
      };
    });
}

export const producerReviewCases: ProducerReviewCase[] = buildProducerReviewCases();
