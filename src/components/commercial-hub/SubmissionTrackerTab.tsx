"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useCrossModuleHandoff } from "@/hooks/useCrossModuleHandoff";
import { resolveSubmissionId } from "@/lib/crossModuleLinks";
import { AppIcon } from "@/components/ui/AppIcon";
import { setTrackerSubmissions } from "@/data/commercialHubStore";
import {
  agingBuckets,
  applyAddMarket,
  computeCarrierSla,
  computeClientSla,
  computeHealthScore,
  getHealthClass,
  getSubmissionTimeline,
  requiredMarketCount,
  submissionTrackerSearchPlaceholder,
  trackerFilterOptions,
  type AddMarketPayload,
  type QuoteOption,
  type TrackerStatus,
  type TrackerSubmission,
} from "@/data/submissionTracker";
import { TableSkeleton } from "@/components/shared/loading";
import { useCommercialHubStore } from "@/hooks/useCommercialHubStore";
import { useTabLoading } from "@/hooks/useTabLoading";
import { useSyncBreadcrumbDetail } from "@/hooks/useSyncBreadcrumbDetail";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";
import { toastMessages } from "@/lib/toastMessages";
import { AddMarketModal } from "./AddMarketModal";
import { QuoteDetailsModal } from "./QuoteDetailsModal";
import { SubmissionQuotePanel } from "./SubmissionQuotePanel";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import { ClientLanguageBadges } from "@/components/bilingual/ClientLanguageBadges";
import { getClientLanguage } from "@/data/bilingualClient";

const statusClass: Record<TrackerStatus, string> = {
  "New Intake": "badge-blue",
  Reviewing: "badge-yellow",
  Marketed: "badge-gray",
  Quoted: "badge-green",
  Negotiation: "badge-yellow",
  "Pending Producer Approval": "badge-yellow",
  "Pending Docs": "badge-yellow",
  "Ready to Bind": "badge-green",
  Bound: "badge-green",
  Declined: "badge-red",
};

const docStatusIcon = {
  complete: "check",
  pending: "refresh",
  missing: "x",
} as const;

type FilterState = {
  coverage: string;
  producer: string;
  va: string;
  status: string;
  carrier: string;
  state: string;
  daysOpen: string;
};

type QuickChip = "all" | "urgent" | "missing-docs" | "pending-approval";

const quickChipOptions: { id: QuickChip; label: string }[] = [
  { id: "all", label: "All" },
  { id: "urgent", label: "Urgent" },
  { id: "missing-docs", label: "Missing Docs" },
  { id: "pending-approval", label: "Pending Approval" },
];

const defaultFilters: FilterState = {
  coverage: trackerFilterOptions.coverage[0],
  producer: trackerFilterOptions.producer[0],
  va: trackerFilterOptions.va[0],
  status: trackerFilterOptions.status[0],
  carrier: trackerFilterOptions.carrier[0],
  state: trackerFilterOptions.state[0],
  daysOpen: trackerFilterOptions.daysOpen[0],
};

function matchesDaysOpen(days: number, filter: string) {
  if (filter === "Days Open") return true;
  if (filter === "0–2 Days") return days <= 2;
  if (filter === "3–5 Days") return days >= 3 && days <= 5;
  if (filter === "6–10 Days") return days >= 6 && days <= 10;
  if (filter === "11+ Days") return days >= 11;
  return true;
}

const filterAriaLabels: Record<keyof FilterState, string> = {
  coverage: "Coverage Type",
  producer: "Producer",
  va: "Assigned VA",
  status: "Current Stage",
  carrier: "Carrier",
  state: "State",
  daysOpen: "Days Open",
};

function matchesFilters(row: TrackerSubmission, search: string, filters: FilterState) {
  const q = search.trim().toLowerCase();
  if (q) {
    const haystack = [
      row.client,
      row.producer,
      row.va,
      row.coverage,
      ...row.carriers.map((c) => c.carrier),
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  if (filters.coverage !== "Coverage Type" && row.coverage !== filters.coverage) return false;
  if (filters.producer !== "Producer" && row.producer !== filters.producer) return false;
  if (filters.va !== "Assigned VA" && row.va !== filters.va) return false;
  if (filters.status !== "Current Stage" && row.status !== filters.status) return false;
  if (filters.state !== "State" && row.state !== filters.state) return false;
  if (filters.carrier !== "Carrier") {
    const hasCarrier = row.carriers.some((c) => c.carrier === filters.carrier);
    if (!hasCarrier) return false;
  }
  if (!matchesDaysOpen(row.daysOpen, filters.daysOpen)) return false;

  return true;
}

function matchesQuickChip(row: TrackerSubmission, chip: QuickChip) {
  if (chip === "all") return true;
  const hasMissingDocs = row.documents.some((doc) => doc.status === "missing");
  if (chip === "missing-docs") return hasMissingDocs;
  if (chip === "pending-approval") return row.status === "Pending Producer Approval";
  if (chip === "urgent") {
    return row.daysOpen >= 6 || hasMissingDocs || row.status === "Pending Producer Approval";
  }
  return true;
}

function getLastAction(row: TrackerSubmission) {
  return row.brokerNotes[row.brokerNotes.length - 1] ?? row.nextAction;
}

type SubmissionTrackerTabProps = {
  addMarketOpen?: boolean;
  onAddMarketOpenChange?: (open: boolean) => void;
  initialSubmissionId?: string | null;
};

export function SubmissionTrackerTab({
  addMarketOpen = false,
  onAddMarketOpenChange,
  initialSubmissionId,
}: SubmissionTrackerTabProps) {
  const loading = useTabLoading();
  const toast = useToast();
  const { trackerSubmissions: submissions } = useCommercialHubStore();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [quickChip, setQuickChip] = useState<QuickChip>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [quoteModalClient, setQuoteModalClient] = useState<string | null>(null);
  const [quoteModalQuotes, setQuoteModalQuotes] = useState<QuoteOption[]>([]);
  const [quoteModalSubmissionId, setQuoteModalSubmissionId] = useState<string | null>(null);
  const [addMarketSubmissionId, setAddMarketSubmissionId] = useState<string | null>(null);
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    if (!initialSubmissionId) return;
    setExpandedId(initialSubmissionId);
    setActiveSubmissionId(initialSubmissionId);
  }, [initialSubmissionId]);

  const onIntakeHandoff = useCallback((payload: Record<string, string | undefined>) => {
    const submissionId =
      payload.submissionId && submissions.some((row) => row.id === payload.submissionId)
        ? payload.submissionId
        : resolveSubmissionId(payload.client ?? "");
    if (submissionId) {
      setExpandedId(submissionId);
      setActiveSubmissionId(submissionId);
    }
    toast.success(toastMessages.commercialHub.submissionCreated);
  }, [submissions, toast]);

  useCrossModuleHandoff("intake-to-submission", onIntakeHandoff);

  const activeSubmission = useMemo(
    () => submissions.find((row) => row.id === (activeSubmissionId ?? expandedId)) ?? null,
    [submissions, activeSubmissionId, expandedId],
  );

  useSyncBreadcrumbDetail(activeSubmission?.client ?? null, {
    paramKey: "submission",
    paramValue: activeSubmission?.id,
    enabled: Boolean(activeSubmission),
  });

  const filteredRows = useMemo(
    () =>
      submissions.filter(
        (row) => matchesFilters(row, search, filters) && matchesQuickChip(row, quickChip),
      ),
    [submissions, search, filters, quickChip],
  );

  const toggleExpand = (rowId: string) => {
    setExpandedId((current) => {
      const nextId = current === rowId ? null : rowId;
      if (nextId) setActiveSubmissionId(nextId);
      return nextId;
    });
  };

  const addMarketSubmission = useMemo(
    () => submissions.find((row) => row.id === addMarketSubmissionId) ?? null,
    [submissions, addMarketSubmissionId],
  );

  const openQuoteModal = (row: TrackerSubmission) => {
    if (row.quotes.length === 0) return;
    setQuoteModalClient(row.client);
    setQuoteModalQuotes(row.quotes);
    setQuoteModalSubmissionId(row.id);
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const openAddMarket = (submissionId?: string) => {
    const resolvedId = submissionId ?? activeSubmissionId ?? expandedId ?? null;
    setAddMarketSubmissionId(resolvedId);
    onAddMarketOpenChange?.(true);
  };

  const updateSubmissions = (
    updater: TrackerSubmission[] | ((prev: TrackerSubmission[]) => TrackerSubmission[]),
  ) => {
    const next =
      typeof updater === "function" ? updater(submissions) : updater;
    setTrackerSubmissions(next);
  };

  const handleAddMarket = (payload: AddMarketPayload) => {
    if (!addMarketSubmissionId) return;

    updateSubmissions((prev) =>
      prev.map((row) =>
        row.id === addMarketSubmissionId
          ? applyAddMarket(row, payload.carrier, payload.notes)
          : row,
      ),
    );
    setExpandedId(addMarketSubmissionId);
    setActiveSubmissionId(addMarketSubmissionId);
  };

  const handleSelectAddMarketSubmission = (submissionId: string) => {
    setAddMarketSubmissionId(submissionId || null);
  };

  const handleSelectQuote = (submissionId: string, quote: QuoteOption) => {
    updateSubmissions((prev) =>
      prev.map((row) =>
        row.id === submissionId
          ? {
              ...row,
              selectedQuoteId: quote.id,
              binding: {
                quoteSelected: true,
                producerApproved: row.binding?.producerApproved ?? false,
                clientApproved: row.binding?.clientApproved ?? false,
                docsComplete: row.documents.every((d) => d.status === "complete"),
                paymentReady: row.binding?.paymentReady ?? false,
                selectedCarrier: quote.carrier,
                selectedPremium: quote.premium,
                brokerFee: quote.brokerFee,
                approvalStatus: "Pending Producer Approval",
              },
              status:
                row.marketsSubmitted >= requiredMarketCount
                  ? "Pending Producer Approval"
                  : row.status,
              nextAction: "Producer Approval",
            }
          : row,
      ),
    );
  };

  const handleSendToProducer = (submissionId: string, quote: QuoteOption) => {
    updateSubmissions((prev) =>
      prev.map((row) =>
        row.id === submissionId
          ? {
              ...row,
              selectedQuoteId: quote.id,
              status:
                row.marketsSubmitted >= requiredMarketCount
                  ? "Pending Producer Approval"
                  : row.status,
              nextAction: "Producer Approval",
              binding: {
                quoteSelected: true,
                producerApproved: false,
                clientApproved: row.binding?.clientApproved ?? false,
                docsComplete: row.documents.every((d) => d.status === "complete"),
                paymentReady: row.binding?.paymentReady ?? false,
                selectedCarrier: quote.carrier,
                selectedPremium: quote.premium,
                brokerFee: quote.brokerFee,
                approvalStatus: "Pending Producer Approval",
              },
              producerNotes: [
                ...row.producerNotes,
                `Quote sent for review — ${quote.carrier} at ${quote.premium}`,
              ],
            }
          : row,
      ),
    );
  };

  const tableColSpan = 10;

  if (loading) {
    return (
      <div className="va-ops-role-view submission-tracker">
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="va-ops-role-view submission-tracker">
      <section className="submission-aging-panel" aria-label="Submission aging">
        {agingBuckets.map((bucket) => (
          <article
            key={bucket.id}
            className={cn("submission-aging-bucket", `submission-aging-${bucket.tone}`)}
          >
            <div className="submission-aging-label">{bucket.label}</div>
            <div className="submission-aging-count">{bucket.count}</div>
          </article>
        ))}
      </section>

      <div className="submission-tracker-filters">
        <label className="va-ops-search submission-tracker-search" aria-label="Search submissions">
          <AppIcon name="search" size={16} strokeWidth={2} className="va-ops-search-icon" />
          <input
            type="search"
            className="va-ops-search-input"
            placeholder={submissionTrackerSearchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        {(Object.keys(trackerFilterOptions) as (keyof FilterState)[]).map((key) => (
          <label key={key} className="submission-tracker-filter">
            <select
              className="header-filter-select submission-tracker-select"
              aria-label={filterAriaLabels[key]}
              value={filters[key]}
              onChange={(e) => updateFilter(key, e.target.value)}
            >
              {trackerFilterOptions[key].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="submission-tracker-quick-chips" role="group" aria-label="Quick filters">
        {quickChipOptions.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={cn("submission-quick-chip", quickChip === chip.id && "active")}
            onClick={() => setQuickChip(chip.id)}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <section className="submission-tracker-table-panel" aria-label="Active submissions">
        <div className="submission-tracker-table-header">
          <div className="submission-tracker-table-header-left">
            <h3 className="va-ops-section-title">Active Submissions</h3>
            <p className="va-ops-section-sub">
              {filteredRows.length} submission{filteredRows.length === 1 ? "" : "s"} — click a row to expand details.
            </p>
          </div>
        </div>
        <div className="submission-tracker-table-scroll">
          <table className="commercial-hub-table submission-tracker-table">
            <thead>
              <tr>
                <th aria-label="Expand" />
                <th>Client</th>
                <th>Coverage</th>
                <th>Assigned VA</th>
                <th>Producer</th>
                <th>Markets</th>
                <th>Quotes</th>
                <th>Missing Docs</th>
                <th>Days Open</th>
                <th className="submission-tracker-status-col">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={tableColSpan}>
                    <div className="commercial-hub-empty-state" role="status">
                      <div className="commercial-hub-empty-state-title">No submissions match</div>
                      <p className="commercial-hub-empty-state-desc">
                        Adjust filters or quick chips to see active submissions.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                const isExpanded = expandedId === row.id;
                const missingDocCount = row.documents.filter((d) => d.status === "missing").length;
                const healthScore = computeHealthScore(row);
                const carrierSla = computeCarrierSla(row);
                const clientSla = computeClientSla(row);
                const timeline = getSubmissionTimeline(row);
                const lastAction = getLastAction(row);
                return (
                  <Fragment key={row.id}>
                    <tr
                      className={cn(
                        "submission-tracker-row submission-tracker-row-clickable",
                        isExpanded && "expanded",
                        activeSubmissionId === row.id && "selected",
                      )}
                      onClick={(event) => {
                        const target = event.target as HTMLElement;
                        if (target.closest("button")) return;
                        toggleExpand(row.id);
                      }}
                    >
                      <td>
                        <button
                          type="button"
                          className="submission-tracker-expand-btn"
                          aria-expanded={isExpanded}
                          aria-label={`${isExpanded ? "Collapse" : "Expand"} ${row.client}`}
                          onClick={() => toggleExpand(row.id)}
                        >
                          <AppIcon name="chevron-down" size={14} strokeWidth={2.5} className={cn(isExpanded && "rotated")} />
                        </button>
                      </td>
                      <td
                        className="commercial-hub-client-cell"
                        onClick={() => setActiveSubmissionId(row.id)}
                      >
                        <span className="bilingual-client-cell">
                          {row.client}
                          <ClientLanguageBadges profile={getClientLanguage(row.client)} compact />
                        </span>
                      </td>
                      <td>{row.coverage}</td>
                      <td>{row.va}</td>
                      <td><UserChip name={row.producer} /></td>
                      <td>{row.marketsSubmitted}</td>
                      <td>
                        {row.quotesReceived > 0 ? (
                          <button
                            type="button"
                            className="submission-tracker-quote-link"
                            onClick={() => openQuoteModal(row)}
                          >
                            {row.quotesReceived}
                          </button>
                        ) : (
                          row.quotesReceived
                        )}
                      </td>
                      <td className={missingDocCount > 0 ? "submission-missing-docs" : ""}>
                        {missingDocCount > 0 ? missingDocCount : "None"}
                      </td>
                      <td>{row.daysOpen} days</td>
                      <td className="submission-tracker-status-col">
                        <span className={cn("badge", statusClass[row.status])}>{row.status}</span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="submission-tracker-detail-row">
                        <td colSpan={tableColSpan}>
                          <div className="submission-tracker-detail">
                            <div className="submission-tracker-sla-strip">
                              <div className="submission-tracker-sla-item">
                                <span className="submission-tracker-detail-label">Health</span>
                                <span className={cn("submission-health-score", getHealthClass(healthScore))}>
                                  {healthScore}%
                                </span>
                              </div>
                              <div className="submission-tracker-sla-item">
                                <span className="submission-tracker-detail-label">Carrier SLA</span>
                                <span className={cn("submission-sla", carrierSla.overdue && "submission-sla-blocked")}>
                                  {carrierSla.label}
                                </span>
                              </div>
                              <div className="submission-tracker-sla-item">
                                <span className="submission-tracker-detail-label">Client SLA</span>
                                <span className={cn("submission-sla", clientSla.overdue && "submission-sla-blocked")}>
                                  {clientSla.label}
                                </span>
                              </div>
                              <div className="submission-tracker-sla-item">
                                <span className="submission-tracker-detail-label">Last Action</span>
                                <span className="commercial-hub-next-action">{lastAction}</span>
                              </div>
                              <div className="submission-tracker-sla-item submission-tracker-sla-item-notes">
                                <span className="submission-tracker-detail-label">Notes</span>
                                <span className="submission-tracker-notes-preview">
                                  {row.brokerNotes[0] ?? "No notes yet"}
                                </span>
                              </div>
                            </div>

                            {row.marketsSubmitted < requiredMarketCount && (
                              <div className="submission-market-warning" role="status">
                                <AppIcon name="triangle-alert" size={16} strokeWidth={2} />
                                <span>Minimum market requirement not met</span>
                                <button
                                  type="button"
                                  className="va-ops-action-btn"
                                  onClick={() => openAddMarket(row.id)}
                                >
                                  Add Market
                                </button>
                              </div>
                            )}

                            <div className="submission-tracker-detail-grid">
                              <div className="submission-tracker-detail-col">
                                <div className="submission-tracker-detail-label">Markets</div>
                                <ul className="submission-carrier-list submission-market-stack">
                                  {row.carriers.map((c) => (
                                    <li key={`${c.carrier}-${c.status}`}>
                                      {c.carrier} — {c.status}
                                    </li>
                                  ))}
                                </ul>
                                <button
                                  type="button"
                                  className="va-ops-action-btn submission-add-market-btn"
                                  onClick={() => openAddMarket(row.id)}
                                >
                                  Add Market
                                </button>
                              </div>

                              <div className="submission-tracker-detail-col">
                                <div className="submission-tracker-detail-label">Document Checklist</div>
                                <ul className="submission-doc-checklist">
                                  {row.documents.map((item) => (
                                    <li key={item.label} className={item.status}>
                                      <AppIcon
                                        name={docStatusIcon[item.status]}
                                        size={14}
                                        strokeWidth={2.5}
                                      />
                                      {item.label}
                                      {item.status === "complete" && " ✓"}
                                      {item.status === "pending" && " Pending"}
                                      {item.status === "missing" && " Missing"}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="submission-tracker-detail-col">
                                <div className="submission-tracker-detail-label">Broker Notes</div>
                                <ul className="va-ops-gap-list">
                                  {row.brokerNotes.map((note) => (
                                    <li key={note}>{note}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="submission-tracker-detail-col">
                                <div className="submission-tracker-detail-label">Producer Notes</div>
                                <ul className="va-ops-gap-list">
                                  {row.producerNotes.map((note) => (
                                    <li key={note}>{note}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="submission-timeline-panel">
                              <div className="submission-tracker-detail-label">Submission Timeline</div>
                              <ol className="submission-timeline">
                                {timeline.map((step, index) => (
                                  <li
                                    key={step.label}
                                    className={cn("submission-timeline-step", step.complete && "complete")}
                                  >
                                    <div className="submission-timeline-marker" aria-hidden="true" />
                                    <div className="submission-timeline-content">
                                      <div className="submission-timeline-label">{step.label}</div>
                                      {step.timestamp && (
                                        <div className="submission-timeline-time">{step.timestamp}</div>
                                      )}
                                    </div>
                                    {index < timeline.length - 1 && (
                                      <div className="submission-timeline-connector" aria-hidden="true" />
                                    )}
                                  </li>
                                ))}
                              </ol>
                            </div>

                            <SubmissionQuotePanel
                              submission={row}
                              selectedQuoteId={row.selectedQuoteId}
                              onSelectQuote={(quote) => handleSelectQuote(row.id, quote)}
                              onSendToProducer={(quote) => handleSendToProducer(row.id, quote)}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <QuoteDetailsModal
        open={Boolean(quoteModalClient)}
        client={quoteModalClient}
        quotes={quoteModalQuotes}
        onClose={() => {
          setQuoteModalClient(null);
          setQuoteModalQuotes([]);
          setQuoteModalSubmissionId(null);
        }}
        onSelectQuote={(quote) => {
          if (quoteModalSubmissionId) handleSelectQuote(quoteModalSubmissionId, quote);
        }}
      />

      <AddMarketModal
        open={addMarketOpen}
        submission={addMarketSubmission}
        submissions={submissions}
        onSelectSubmission={handleSelectAddMarketSubmission}
        onClose={() => {
          onAddMarketOpenChange?.(false);
          setAddMarketSubmissionId(null);
        }}
        onSubmit={handleAddMarket}
      />
    </div>
  );
}
