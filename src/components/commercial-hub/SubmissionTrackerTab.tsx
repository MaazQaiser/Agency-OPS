"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCrossModuleHandoff } from "@/hooks/useCrossModuleHandoff";
import { resolveSubmissionId } from "@/lib/crossModuleLinks";
import { AppIcon } from "@/components/ui/AppIcon";
import { setTrackerSubmissions } from "@/data/commercialHubStore";
import {
  agingBuckets,
  applyAddMarket,
  requiredMarketCount,
  submissionTrackerSearchPlaceholder,
  trackerFilterOptions,
  type AddMarketPayload,
  type QuoteOption,
  type TrackerStatus,
  type TrackerSubmission,
} from "@/data/submissionTracker";
import { TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { ExportMenu } from "@/components/export/ExportMenu";
import { getCommercialHubSnapshot } from "@/data/commercialHubStore";
import { useCommercialHubStore } from "@/hooks/useCommercialHubStore";
import { useHubDataState } from "@/hooks/useHubDataState";
import { resolveDisplayStatus } from "@/lib/dataState";
import { useSyncBreadcrumbDetail } from "@/hooks/useSyncBreadcrumbDetail";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";
import { toastMessages } from "@/lib/toastMessages";
import { AddMarketModal } from "./AddMarketModal";
import { QuoteDetailsModal } from "./QuoteDetailsModal";
import { SubmissionTrackerDrawer } from "./SubmissionTrackerDrawer";
import { SubmissionTrackerExpandPanel } from "./SubmissionTrackerExpandPanel";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import { EoRiskBadge } from "@/components/commercial/EoRiskBadge";
import {
  eoRiskFromTrackerSubmission,
  sortByEoExposure,
  type EoExposureSort,
} from "@/lib/eoRiskScore";
import { ClientLanguageBadges } from "@/components/bilingual/ClientLanguageBadges";
import { getClientLanguage } from "@/data/bilingualClient";
import { CoverageChecklistProgress } from "@/components/commercial/CoverageChecklistProgress";
import { progressFromTrackerSubmission } from "@/lib/coverageChecklistProgress";
import { commercialHubTabHeaders } from "@/data/commercialHubTabHeaders";
import { submissionTrackerTabKpis } from "@/lib/commercialHubTabKpis";
import { routes } from "@/lib/routes";
import { buildSubmissionAnalysisRequest } from "@/lib/farmersEdgeIntel";
import { useFarmersEdgeIntel } from "@/components/farmers-edge/FarmersEdgeIntelligenceProvider";
import { CommercialRowActionMenu } from "./CommercialRowActionMenu";
import {
  CommercialHubIntelPanel,
  CommercialHubKpiStrip,
  CommercialHubTabFooter,
  CommercialHubTabHeader,
  CommercialHubTabShell,
  CommercialHubWorkspace,
} from "./CommercialHubTabLayout";

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
  const router = useRouter();
  const toast = useToast();
  const { openIntel, canOpen: canOpenFarmersEdge } = useFarmersEdgeIntel();
  const { trackerSubmissions: submissions } = useCommercialHubStore();
  const {
    status: loadStatus,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => getCommercialHubSnapshot().trackerSubmissions,
    errorPreset: "agencyzoom-unavailable",
  });
  const status = resolveDisplayStatus(loadStatus, submissions, (d) => d.length === 0);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [quickChip, setQuickChip] = useState<QuickChip>("all");
  const [drawerSubmissionId, setDrawerSubmissionId] = useState<string | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [quoteModalClient, setQuoteModalClient] = useState<string | null>(null);
  const [quoteModalQuotes, setQuoteModalQuotes] = useState<QuoteOption[]>([]);
  const [quoteModalSubmissionId, setQuoteModalSubmissionId] = useState<string | null>(null);
  const [addMarketSubmissionId, setAddMarketSubmissionId] = useState<string | null>(null);
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);
  const [exposureSort, setExposureSort] = useState<EoExposureSort>("highest");

  useEffect(() => {
    if (!initialSubmissionId) return;
    setDrawerSubmissionId(initialSubmissionId);
    setActiveSubmissionId(initialSubmissionId);
  }, [initialSubmissionId]);

  const onIntakeHandoff = useCallback((payload: Record<string, string | undefined>) => {
    const submissionId =
      payload.submissionId && submissions.some((row) => row.id === payload.submissionId)
        ? payload.submissionId
        : resolveSubmissionId(payload.client ?? "");
    if (submissionId) {
      setDrawerSubmissionId(submissionId);
      setActiveSubmissionId(submissionId);
    }
    toast.success(toastMessages.commercialHub.submissionCreated);
  }, [submissions, toast]);

  useCrossModuleHandoff("intake-to-submission", onIntakeHandoff);

  const activeSubmission = useMemo(
    () => submissions.find((row) => row.id === (activeSubmissionId ?? drawerSubmissionId)) ?? null,
    [submissions, activeSubmissionId, drawerSubmissionId],
  );

  useSyncBreadcrumbDetail(activeSubmission?.client ?? null, {
    paramKey: "submission",
    paramValue: activeSubmission?.id,
    enabled: Boolean(activeSubmission),
  });

  const filteredRows = useMemo(
    () =>
      sortByEoExposure(
        submissions.filter(
          (row) => matchesFilters(row, search, filters) && matchesQuickChip(row, quickChip),
        ),
        eoRiskFromTrackerSubmission,
        exposureSort,
      ),
    [submissions, search, filters, quickChip, exposureSort],
  );

  const drawerSubmission = useMemo(
    () => submissions.find((row) => row.id === drawerSubmissionId) ?? null,
    [submissions, drawerSubmissionId],
  );

  const openDrawer = (rowId: string) => {
    setDrawerSubmissionId(rowId);
    setActiveSubmissionId(rowId);
  };

  const toggleExpand = (rowId: string) => {
    setExpandedRowId((current) => (current === rowId ? null : rowId));
    setActiveSubmissionId(rowId);
  };

  const closeDrawer = () => {
    setDrawerSubmissionId(null);
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
    const resolvedId = submissionId ?? activeSubmissionId ?? drawerSubmissionId ?? null;
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
    setDrawerSubmissionId(addMarketSubmissionId);
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

  const tableColSpan = 13;
  const header = commercialHubTabHeaders.submissions;
  const urgentRows = filteredRows.filter((row) => row.daysOpen >= 6 || row.status === "Pending Docs").slice(0, 4);

  return (
    <CommercialHubTabShell className="submission-tracker">
      <CommercialHubTabHeader title={header.title} subtitle={header.subtitle} />

      <CommercialHubKpiStrip kpis={submissionTrackerTabKpis()} columns={6} />

      <CommercialHubWorkspace
        ariaLabel="Active submissions"
        title="Active Submissions"
        subtitle={`${filteredRows.length} submission${filteredRows.length === 1 ? "" : "s"} — click a row to expand pipeline details.`}
        actions={
          <>
            <ExportMenu kind="submission-log" />
            <label className="eo-exposure-sort">
              <span className="eo-exposure-sort-label">Sort</span>
              <select
                className="header-filter-select eo-exposure-sort-select"
                value={exposureSort}
                onChange={(e) => setExposureSort(e.target.value as EoExposureSort)}
                aria-label="Sort by E&O exposure"
              >
                <option value="highest">Highest exposure</option>
                <option value="lowest">Lowest exposure</option>
                <option value="oldest">Oldest</option>
                <option value="newest">Newest</option>
              </select>
            </label>
          </>
        }
        toolbar={
          <>
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

              <label className="submission-tracker-filter submission-tracker-quick-filter">
                <select
                  className="header-filter-select submission-tracker-select"
                  aria-label="Quick filter"
                  value={quickChip}
                  onChange={(e) => setQuickChip(e.target.value as QuickChip)}
                >
                  {quickChipOptions.map((chip) => (
                    <option key={chip.id} value={chip.id}>
                      {chip.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </>
        }
      >
        <DataStateView
          status={status}
          lastSyncedAt={lastSyncedAt}
          isStale={isStale}
          showFreshness={false}
          loading={<TableSkeleton rows={6} columns={11} />}
          empty={
            <HubEmptyState
              preset="commercial-submissions"
              onAction={() => openAddMarket()}
            />
          }
          error={
            <HubErrorState
              preset="agencyzoom-unavailable"
              onRetry={retry}
              retrying={retrying}
              lastSyncedAt={lastSyncedAt}
            />
          }
        >
        <div className="submission-tracker-table-scroll ops-responsive-table-wrap">
          <table className="commercial-hub-table submission-tracker-table">
            <thead>
              <tr>
                <th aria-label="Expand" />
                <th>Status</th>
                <th>Assigned VA</th>
                <th>Producer</th>
                <th>Days Open</th>
                <th>E&O Risk</th>
                <th className="submission-tracker-client-col">Client</th>
                <th>Coverage</th>
                <th>Markets</th>
                <th>Quotes</th>
                <th className="submission-tracker-checklist-col">Checklist</th>
                <th className="submission-tracker-actions-col" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={tableColSpan}>
                    <HubEmptyState
                      title="No matches"
                      description="No submissions match your search or filters. Adjust filters or quick filter to see active submissions."
                      compact
                    />
                  </td>
                </tr>
              ) : (
                filteredRows.flatMap((row) => {
                const isExpanded = expandedRowId === row.id;
                const checklistProgress = progressFromTrackerSubmission(row);
                const eoRisk = eoRiskFromTrackerSubmission(row);
                return [
                  <tr
                    key={row.id}
                    className={cn(
                      "submission-tracker-row submission-tracker-row-clickable",
                      isExpanded && "expanded selected",
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
                    <td className="submission-tracker-status-col">
                      <span className={cn("badge", statusClass[row.status])}>{row.status}</span>
                    </td>
                    <td>{row.va}</td>
                    <td><UserChip name={row.producer} /></td>
                    <td>{row.daysOpen} days</td>
                    <td>
                      <EoRiskBadge score={eoRisk} />
                    </td>
                    <td
                      className="commercial-hub-client-cell submission-tracker-client-cell"
                      onClick={() => setActiveSubmissionId(row.id)}
                    >
                      <span className="bilingual-client-cell submission-tracker-client-name">
                        <span className="submission-tracker-client-label">{row.client}</span>
                        <ClientLanguageBadges profile={getClientLanguage(row.client)} compact />
                      </span>
                    </td>
                    <td>{row.coverage}</td>
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
                    <td className="submission-tracker-checklist-col" onClick={(e) => e.stopPropagation()}>
                      <CoverageChecklistProgress progress={checklistProgress} variant="inline" />
                    </td>
                    <td onClick={(e) => e.stopPropagation()} className="submission-tracker-actions-col">
                      <CommercialRowActionMenu
                        label={`Actions for ${row.client}`}
                        actions={[
                          {
                            id: "review",
                            label: "Review Submission",
                            onSelect: () => openDrawer(row.id),
                          },
                          {
                            id: "follow-up",
                            label: "Assign Follow-up",
                            onSelect: () => {
                              router.push(`${routes.commercialHub}?view=follow-ups`);
                              toast.success(`Follow-up queued for ${row.client}`);
                            },
                          },
                          {
                            id: "carrier",
                            label: "Open Carrier",
                            onSelect: () => {
                              const carrier =
                                row.carriers.find((c) => c.status === "Quoted")?.carrier ??
                                row.carriers[0]?.carrier;
                              if (carrier) {
                                router.push(
                                  `${routes.carrierLibrary}?search=${encodeURIComponent(carrier)}`,
                                );
                              } else {
                                toast.success(`No carrier on file for ${row.client}`);
                              }
                            },
                          },
                          ...(canOpenFarmersEdge
                            ? [
                                {
                                  id: "farmers-edge",
                                  label: "Analyze in Farmers Edge",
                                  accent: "farmers-edge" as const,
                                  onSelect: () =>
                                    openIntel(buildSubmissionAnalysisRequest(row)),
                                },
                              ]
                            : []),
                        ]}
                      />
                    </td>
                  </tr>,
                  isExpanded ? (
                    <tr key={`${row.id}-detail`} className="submission-tracker-detail-row">
                      <td colSpan={tableColSpan}>
                        <SubmissionTrackerExpandPanel
                          submission={row}
                          onOpenDrawer={() => openDrawer(row.id)}
                        />
                      </td>
                    </tr>
                  ) : null,
                ].filter(Boolean);
              })
              )}
            </tbody>
          </table>
        </div>
        </DataStateView>
      </CommercialHubWorkspace>

      <CommercialHubIntelPanel
        title="Needs Attention"
        subtitle="Urgent submissions and document blockers."
      >
        {urgentRows.length === 0 ? (
          <p className="va-ops-section-sub">No urgent submissions in current filter.</p>
        ) : (
          <ul className="va-ops-gap-list">
            {urgentRows.map((row) => (
              <li key={row.id}>
                <strong>{row.client}</strong> · {row.status} · {row.daysOpen} days · {row.producer}
              </li>
            ))}
          </ul>
        )}
      </CommercialHubIntelPanel>

      <CommercialHubTabFooter
        title="Submission Aging"
        subtitle="Distribution of open submissions by days in pipeline."
      >
        <div className="submission-aging-panel submission-aging-panel-compact">
          {agingBuckets.map((bucket) => (
            <article
              key={bucket.id}
              className={cn("submission-aging-bucket", `submission-aging-${bucket.tone}`)}
            >
              <div className="submission-aging-label">{bucket.label}</div>
              <div className="submission-aging-count">{bucket.count}</div>
            </article>
          ))}
        </div>
      </CommercialHubTabFooter>

      <SubmissionTrackerDrawer submission={drawerSubmission} onClose={closeDrawer} />

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
    </CommercialHubTabShell>
  );
}
