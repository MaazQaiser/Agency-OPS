import type { HubSubmission } from "@/data/commercialHub";

export type MarketSpreadRow = {
  id: string;
  client: string;
  marketsSubmitted: number;
  responsesReceived: number;
  waiting: number;
  declined: number;
  bestQuote: string;
};

function parsePremium(value: string): number {
  const digits = value.replace(/[^0-9.]/g, "");
  const parsed = Number.parseFloat(digits);
  return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY;
}

export function buildMarketSpreadMatrix(submissions: HubSubmission[]): MarketSpreadRow[] {
  return submissions.map((submission) => {
    const waiting = submission.carrierSubmissions.filter(
      (carrier) =>
        carrier.status === "Pending"
        || carrier.status === "Submitted"
        || carrier.status === "In Review",
    ).length;
    const declined = submission.carrierSubmissions.filter(
      (carrier) => carrier.status === "Declined",
    ).length;

    const bestQuote = submission.quoteComparison.length > 0
      ? submission.quoteComparison.reduce((best, quote) =>
          parsePremium(quote.premium) < parsePremium(best.premium) ? quote : best,
        ).premium
      : submission.quotesReceived > 0
        ? submission.premium
        : "-";

    return {
      id: submission.id,
      client: submission.client,
      marketsSubmitted: submission.marketsSubmitted,
      responsesReceived: submission.quotesReceived,
      waiting,
      declined,
      bestQuote,
    };
  });
}
