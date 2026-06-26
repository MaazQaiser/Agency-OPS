import type { QuoteOption, TrackerSubmission } from "@/data/submissionTracker";

export type QuoteRecommendationTag =
  | "Best Value"
  | "Lowest Premium"
  | "Lowest Deductible"
  | "Fastest Bind Path"
  | "Best Coverage Match";

export type QuoteWithRecommendations = QuoteOption & {
  recommendations: QuoteRecommendationTag[];
};

export type SubmissionQuoteRecommendations = {
  submissionId: string;
  client: string;
  recommendedQuoteId: string | null;
  quotes: QuoteWithRecommendations[];
};

function parseMoney(value: string): number {
  return Number(value.replace(/[^0-9.]/g, "")) || 0;
}

function parseDeductible(value: string): number {
  return parseMoney(value);
}

function scoreBestValue(quote: QuoteOption): number {
  const premium = parseMoney(quote.premium);
  const deductible = parseDeductible(quote.deductible);
  const exclusionPenalty = quote.exclusions.toLowerCase().includes("none") ? 0 : 500;
  return premium + deductible * 0.35 + exclusionPenalty;
}

function scoreCoverageMatch(quote: QuoteOption): number {
  let score = 0;
  if (quote.coverageLimits.includes("$2M")) score += 2;
  if (quote.exclusions.toLowerCase().includes("none")) score += 3;
  if (!quote.notes.toLowerCase().includes("pending")) score += 1;
  return score;
}

function scoreBindSpeed(quote: QuoteOption): number {
  if (quote.notes.toLowerCase().includes("recommended")) return 3;
  if (quote.notes.toLowerCase().includes("pending")) return 0;
  return 1;
}

export function buildSubmissionQuoteRecommendations(
  submission: TrackerSubmission,
): SubmissionQuoteRecommendations {
  if (submission.quotes.length === 0) {
    return {
      submissionId: submission.id,
      client: submission.client,
      recommendedQuoteId: null,
      quotes: [],
    };
  }

  const lowestPremium = submission.quotes.reduce((best, q) =>
    parseMoney(q.premium) < parseMoney(best.premium) ? q : best,
  );
  const lowestDeductible = submission.quotes.reduce((best, q) =>
    parseDeductible(q.deductible) < parseDeductible(best.deductible) ? q : best,
  );
  const bestValue = submission.quotes.reduce((best, q) =>
    scoreBestValue(q) < scoreBestValue(best) ? q : best,
  );
  const bestCoverage = submission.quotes.reduce((best, q) =>
    scoreCoverageMatch(q) > scoreCoverageMatch(best) ? q : best,
  );
  const fastestBind = submission.quotes.reduce((best, q) =>
    scoreBindSpeed(q) > scoreBindSpeed(best) ? q : best,
  );

  const tagMap = new Map<string, Set<QuoteRecommendationTag>>();

  const addTag = (quote: QuoteOption, tag: QuoteRecommendationTag) => {
    const set = tagMap.get(quote.id) ?? new Set<QuoteRecommendationTag>();
    set.add(tag);
    tagMap.set(quote.id, set);
  };

  addTag(bestValue, "Best Value");
  addTag(lowestPremium, "Lowest Premium");
  addTag(lowestDeductible, "Lowest Deductible");
  addTag(fastestBind, "Fastest Bind Path");
  addTag(bestCoverage, "Best Coverage Match");

  const quotes: QuoteWithRecommendations[] = submission.quotes.map((quote) => ({
    ...quote,
    recommendations: Array.from(tagMap.get(quote.id) ?? []),
  }));

  const recommendedQuoteId =
    submission.selectedQuoteId
    ?? bestValue.id
    ?? quotes[0]?.id
    ?? null;

  return {
    submissionId: submission.id,
    client: submission.client,
    recommendedQuoteId,
    quotes,
  };
}

export function buildAllQuoteRecommendations(
  submissions: TrackerSubmission[],
): SubmissionQuoteRecommendations[] {
  return submissions
    .filter((s) => s.quotes.length > 0)
    .map(buildSubmissionQuoteRecommendations);
}
