"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  buildProducerReviewCases,
  buildQuoteReviewRows,
} from "@/data/quoteReview";
import { TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { getCommercialHubSnapshot } from "@/data/commercialHubStore";
import { useCommercialHubStore } from "@/hooks/useCommercialHubStore";
import { useHubDataState } from "@/hooks/useHubDataState";
import { useOutreachHubStore } from "@/hooks/useOutreachHubStore";
import { crossModuleRoutes, navigateWithHandoff } from "@/lib/crossModuleLinks";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { buildAllQuoteRecommendations } from "@/lib/quoteRecommendations";
import type { QuoteRecommendationTag } from "@/lib/quoteRecommendations";
import { QuoteDetailsModal } from "./QuoteDetailsModal";
import { commercialHubTabHeaders } from "@/data/commercialHubTabHeaders";
import { quoteReviewTabKpis } from "@/lib/commercialHubTabKpis";
import {
  CommercialHubIntelPanel,
  CommercialHubKpiStrip,
  CommercialHubTabFooter,
  CommercialHubTabHeader,
  CommercialHubTabShell,
  CommercialHubWorkspace,
} from "./CommercialHubTabLayout";

const quoteStatusClass: Record<string, string> = {
  Quoted: "badge-green",
  Selected: "badge-blue",
  Declined: "badge-red",
};

const decisionStatusClass: Record<string, string> = {
  Waiting: "badge-yellow",
  Negotiating: "badge-blue",
  Accepted: "badge-green",
  Declined: "badge-red",
};

export function QuoteReviewTab() {
  const router = useRouter();
  const toast = useToast();
  const { trackerSubmissions } = useCommercialHubStore();
  const { clientDecisionQueue } = useOutreachHubStore();
  const {
    status,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => getCommercialHubSnapshot().trackerSubmissions,
    errorPreset: "agencyzoom-unavailable",
  });
  const quoteReviewRows = buildQuoteReviewRows(trackerSubmissions);
  const producerReviewCases = buildProducerReviewCases(trackerSubmissions);
  const quoteRecommendations = useMemo(
    () => buildAllQuoteRecommendations(trackerSubmissions),
    [trackerSubmissions],
  );

  const recommendationByQuoteId = useMemo(() => {
    const map = new Map<string, QuoteRecommendationTag[]>();
    for (const group of quoteRecommendations) {
      for (const quote of group.quotes) {
        map.set(quote.id, quote.recommendations);
      }
    }
    return map;
  }, [quoteRecommendations]);

  const topRecommendation = quoteRecommendations[0] ?? null;
  const topRecommendedQuote = topRecommendation?.quotes.find(
    (quote) => quote.id === topRecommendation.recommendedQuoteId,
  ) ?? null;

  const getQuoteRecommendations = (row: (typeof quoteReviewRows)[number]): QuoteRecommendationTag[] => {
    const quoteId = row.id.slice(row.submissionId.length + 1);
    return recommendationByQuoteId.get(quoteId) ?? [];
  };

  const [quoteModalClient, setQuoteModalClient] = useState<string | null>(null);
  const [quoteModalQuotes, setQuoteModalQuotes] = useState(
    trackerSubmissions.flatMap((s) => s.quotes),
  );

  const sendToSendCenter = (client: string, carrier: string, premium: string, brokerFee: string) => {
    navigateWithHandoff(
      router,
      crossModuleRoutes.sendCenterDraftQueue({ handoff: "quote-to-draft" }),
      {
        type: "quote-to-draft",
        sourcePath: `${routes.commercialHub}?view=quote-review`,
        returnLabel: "Quote Review",
        payload: { client, carrier, premium, brokerFee, quote: `${carrier} — ${premium}` },
      },
      { href: `${routes.commercialHub}?view=quote-review`, label: "Quote Review" },
    );
  };

  const openQuotesForClient = (client: string) => {
    const submission = trackerSubmissions.find((s) => s.client === client);
    if (!submission || submission.quotes.length === 0) return;
    setQuoteModalClient(client);
    setQuoteModalQuotes(submission.quotes);
  };

  const header = commercialHubTabHeaders["quote-review"];

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <CommercialHubTabShell className="quote-review">
          <TableSkeleton rows={5} />
        </CommercialHubTabShell>
      }
      empty={<HubEmptyState preset="commercial-submissions" />}
      error={
        <HubErrorState
          preset="agencyzoom-unavailable"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      }
    >
    <CommercialHubTabShell className="quote-review">
      <CommercialHubTabHeader title={header.title} subtitle={header.subtitle} />

      <CommercialHubKpiStrip kpis={quoteReviewTabKpis(trackerSubmissions)} columns={4} />

      <CommercialHubWorkspace
        ariaLabel="Quote comparison"
        title="Quote Comparison"
        subtitle="Compare returned carrier quotes across active submissions."
      >
        {topRecommendedQuote && topRecommendation && (
          <article className="quote-ai-recommended-card" aria-label="Recommended quote">
            <div className="quote-ai-recommended-header">
              <span className="quote-ai-chip">AI Recommended</span>
              <span className="quote-ai-recommended-client">{topRecommendation.client}</span>
            </div>
            <div className="quote-ai-recommended-body">
              <strong>{topRecommendedQuote.carrier}</strong>
              <span className="commercial-hub-premium">{topRecommendedQuote.premium}</span>
              <span>{topRecommendedQuote.deductible} deductible</span>
            </div>
            <div className="quote-ai-recommendation-chips">
              {topRecommendedQuote.recommendations.map((tag) => (
                <span key={tag} className="quote-ai-recommendation-chip">{tag}</span>
              ))}
            </div>
            <p className="quote-ai-recommended-note">{topRecommendedQuote.notes}</p>
          </article>
        )}
        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Client</th>
                <th>Carrier</th>
                <th>Premium</th>
                <th>Deductible</th>
                <th>Coverage Limits</th>
                <th>Exclusions</th>
                <th>Broker Fee</th>
                <th>AI Insight</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {quoteReviewRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className={cn("badge", quoteStatusClass[row.status] ?? "badge-gray")}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="commercial-hub-client-link"
                      onClick={() => openQuotesForClient(row.client)}
                    >
                      {row.client}
                    </button>
                  </td>
                  <td>{row.carrier}</td>
                  <td className="commercial-hub-premium">{row.premium}</td>
                  <td>{row.deductible}</td>
                  <td>{row.coverageLimits}</td>
                  <td>{row.exclusions}</td>
                  <td>{row.brokerFee}</td>
                  <td>
                    <div className="quote-ai-recommendation-chips">
                      {getQuoteRecommendations(row).map((tag) => (
                        <span key={tag} className="quote-ai-recommendation-chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="va-ops-action-btn primary"
                      onClick={() => sendToSendCenter(row.client, row.carrier, row.premium, row.brokerFee)}
                    >
                      Send to Send Center
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CommercialHubWorkspace>

      <CommercialHubIntelPanel
        title="Producer Review Panel"
        subtitle="Producer approval is required before a quote can move to Ready to Bind."
        className="commercial-hub-intel-tall quote-review-producer-section"
      >
        {producerReviewCases.length === 0 ? (
          <div className="commercial-hub-empty-state" role="status">
            <div className="commercial-hub-empty-state-title">No pending producer reviews</div>
            <p className="commercial-hub-empty-state-desc">
              Submissions awaiting producer approval will appear here.
            </p>
          </div>
        ) : (
          <div className="quote-review-producer-stack">
            {producerReviewCases.map((reviewCase) => (
              <div key={reviewCase.id} className="quote-review-producer-split">
                <article className="quote-review-producer-card">
                  <div className="quote-review-producer-client">{reviewCase.client}</div>
                  <dl className="quote-review-producer-meta">
                    <div>
                      <dt>Selected Quote</dt>
                      <dd>
                        {reviewCase.selectedQuote
                          ? `${reviewCase.selectedQuote.carrier} — ${reviewCase.selectedQuote.premium}`
                          : "None selected"}
                      </dd>
                    </div>
                    <div>
                      <dt>Quote Selected Date</dt>
                      <dd>{reviewCase.quoteSelectedDate}</dd>
                    </div>
                    <div>
                      <dt>Producer</dt>
                      <dd>{reviewCase.producer}</dd>
                    </div>
                    <div>
                      <dt>Approval Status</dt>
                      <dd>
                        <span
                          className={cn(
                            "badge",
                            reviewCase.producerApproved ? "badge-green" : "badge-yellow",
                          )}
                        >
                          {reviewCase.approvalStatus}
                        </span>
                      </dd>
                    </div>
                  </dl>
                  <div className="submission-tracker-detail-label">Review Notes</div>
                  <ul className="va-ops-gap-list">
                    {reviewCase.reviewNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                  <div className="quote-review-producer-actions">
                    <button
                      type="button"
                      className="va-ops-action-btn primary"
                      onClick={() => toast.success(toastMessages.commercialHub.quoteApproved)}
                    >
                      Approve Quote
                    </button>
                    <button
                      type="button"
                      className="va-ops-action-btn"
                      onClick={() => toast.success(toastMessages.commercialHub.quoteApproved)}
                    >
                      Send to Client
                    </button>
                    <button
                      type="button"
                      className="va-ops-action-btn"
                      onClick={() => {
                        const q = reviewCase.selectedQuote;
                        if (q) sendToSendCenter(reviewCase.client, q.carrier, q.premium, q.brokerFee ?? "$0");
                      }}
                    >
                      Send to Send Center
                    </button>
                    <button type="button" className="va-ops-action-btn">Request Revision</button>
                  </div>
                </article>

                <aside className="quote-review-context-panel">
                  <div className="quote-review-context-block">
                    <div className="quote-review-context-label">Coverage Gap Summary</div>
                    {reviewCase.coverageGaps.length === 0 ? (
                      <p className="quote-review-context-empty">No coverage gaps detected.</p>
                    ) : (
                      <ul className="quote-review-gap-list">
                        {reviewCase.coverageGaps.map((gap) => (
                          <li key={gap}>
                            <AppIcon name="triangle-alert" size={14} strokeWidth={2} />
                            {gap}
                          </li>
                        ))}
                      </ul>
                    )}
                    {reviewCase.coverageGapsWarning && (
                      <div className="add-market-alert add-market-alert-warn quote-review-gap-warning">
                        {reviewCase.coverageGapsWarning}
                      </div>
                    )}
                  </div>

                  <div className="quote-review-context-block quote-review-delta-block">
                    <div className="quote-review-context-label">Premium Delta</div>
                    <div className="quote-review-delta-row">
                      <span className="quote-review-delta-target">Target: {reviewCase.targetPremium}</span>
                      <span
                        className={cn(
                          "quote-review-delta-value",
                          reviewCase.deltaFromTarget.startsWith("+") && "quote-review-delta-over",
                        )}
                      >
                        {reviewCase.deltaFromTarget}
                      </span>
                    </div>
                  </div>

                  <div className="quote-review-context-block">
                    <div className="quote-review-context-label">Recommendation</div>
                    <p className="quote-review-recommendation">{reviewCase.recommendation}</p>
                  </div>

                  <div className="quote-review-context-block">
                    <div className="quote-review-context-label">Client Notes</div>
                    <ul className="va-ops-gap-list">
                      {reviewCase.clientNotes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            ))}
          </div>
        )}
      </CommercialHubIntelPanel>

      <CommercialHubTabFooter
        title="Client Decision Queue"
        subtitle="Track client response after quotes are sent."
      >
        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Decision Status</th>
                <th>Client</th>
                <th>Sent Date</th>
                <th>Last Contact</th>
              </tr>
            </thead>
            <tbody>
              {clientDecisionQueue.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className={cn("badge", decisionStatusClass[row.decisionStatus])}>
                      {row.decisionStatus}
                    </span>
                  </td>
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  <td>{row.sentDate}</td>
                  <td>{row.lastContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CommercialHubTabFooter>

      <QuoteDetailsModal
        open={Boolean(quoteModalClient)}
        client={quoteModalClient}
        quotes={quoteModalQuotes}
        onClose={() => setQuoteModalClient(null)}
      />
    </CommercialHubTabShell>
    </DataStateView>
  );
}
