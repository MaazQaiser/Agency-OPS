"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  defaultDraftFilters,
  draftFilterOptions,
  draftSortLabels,
  draftSummaryKpis,
  savedDrafts,
  type DraftFilterState,
  type DraftSortOption,
  type IntakeDraft,
  type IntakeDraftStatus,
} from "@/data/intakeForms";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { KpiSkeletonGrid, TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { VaOpsKpiCard } from "@/components/kpi/VaOpsKpiCard";
import { TeamAvatar } from "@/components/user-profile/TeamAvatar";
import { useToast } from "@/hooks/useToast";
import { IntakeRowActionMenu } from "./IntakeRowActionMenu";

const draftStatusClass: Record<IntakeDraftStatus, string> = {
  Draft: "badge-violet",
  "In Progress": "badge-amber",
  "Needs Review": "badge-red",
};

const ownerUserIds: Record<string, string> = {
  JoJo: "jojo",
  Pedro: "pedro-va",
  Tracie: "tracie-wong",
  Valerie: "valerie-martinez",
};

const draftRowActions = [
  { id: "resume", label: "Resume", tone: "primary" as const },
  { id: "assign", label: "Assign owner" },
  { id: "duplicate", label: "Duplicate" },
  { id: "blockers", label: "Review blockers" },
  { id: "delete", label: "Delete", tone: "danger" as const },
];

function matchesDraftFilters(draft: IntakeDraft, filters: DraftFilterState): boolean {
  if (filters.formType !== "All Forms" && draft.form !== filters.formType) return false;
  if (filters.owner !== "All Owners" && draft.assignedOwner !== filters.owner) return false;
  if (filters.riskLevel !== "All Risk" && draft.riskLevel !== filters.riskLevel) return false;
  if (filters.completion !== "Any Completion") {
    const [low, high] = filters.completion.replace("%", "").split("–").map((v) => parseInt(v, 10));
    if (draft.progress < low || draft.progress > high) return false;
  }
  if (filters.lastEdited === "Today" && draft.lastEditedMs < Date.now() - 24 * 60 * 60 * 1000) return false;
  if (filters.lastEdited === "Yesterday") {
    const day = 24 * 60 * 60 * 1000;
    if (draft.lastEditedMs < Date.now() - 2 * day || draft.lastEditedMs > Date.now() - day) return false;
  }
  return true;
}

function sortDrafts(drafts: IntakeDraft[], sort: DraftSortOption): IntakeDraft[] {
  const copy = [...drafts];
  if (sort === "oldest") return copy.sort((a, b) => a.lastEditedMs - b.lastEditedMs);
  if (sort === "completion") return copy.sort((a, b) => b.progress - a.progress);
  return copy.sort((a, b) => {
    const score = (d: IntakeDraft) => (d.status === "Needs Review" ? 2 : d.missingFields > 5 ? 1 : 0);
    return score(b) - score(a);
  });
}

export function DraftsTab() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const highlightDraftId = searchParams.get("draft");
  const [filters, setFilters] = useState<DraftFilterState>(defaultDraftFilters);
  const [sort, setSort] = useState<DraftSortOption>("oldest");

  const {
    status,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => savedDrafts,
    errorPreset: "supabase-timeout",
  });

  const filteredDrafts = useMemo(
    () => sortDrafts(savedDrafts.filter((d) => matchesDraftFilters(d, filters)), sort),
    [filters, sort],
  );

  const resumeDraft = useCallback(
    (draft: IntakeDraft) => {
      router.push(
        `${routes.intakeForms}?view=new-submission&form=${draft.formType}&draft=${draft.id}`,
        { scroll: false },
      );
    },
    [router],
  );

  useEffect(() => {
    if (!highlightDraftId) return;
    const draft = savedDrafts.find((row) => row.id === highlightDraftId);
    if (draft) resumeDraft(draft);
  }, [highlightDraftId, resumeDraft]);

  const handleRowAction = (draft: IntakeDraft, actionId: string) => {
    if (actionId === "resume" || actionId === "blockers") {
      resumeDraft(draft);
      return;
    }
    if (actionId === "delete") {
      toast.success(`Draft for ${draft.client} archived`);
      return;
    }
    toast.success(`${actionId}: ${draft.client}`);
  };

  const updateFilter = (key: keyof DraftFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <div className="va-ops-role-view intake-drafts">
          <KpiSkeletonGrid count={5} />
          <TableSkeleton rows={5} />
        </div>
      }
      empty={<HubEmptyState preset="intake-forms" />}
      error={
        <HubErrorState
          preset="supabase-timeout"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      }
    >
      <div className="va-ops-role-view intake-drafts">
        <section className="intake-drafts-kpi-strip" aria-label="Draft summary">
          <div className="commercial-hub-kpi-grid hub-kpi-grid intake-drafts-kpi-grid">
            {draftSummaryKpis.map((kpi) => (
              <VaOpsKpiCard key={kpi.label} {...kpi} className="commercial-hub-kpi-uniform" sparkline={false} />
            ))}
          </div>
        </section>

        <div className="intake-drafts-toolbar">
          <div className="intake-drafts-filters">
            {(Object.keys(draftFilterOptions) as (keyof DraftFilterState)[]).map((key) => (
              <label key={key} className="intake-drafts-filter">
                <select
                  className="header-filter-select"
                  value={filters[key]}
                  onChange={(e) => updateFilter(key, e.target.value)}
                  aria-label={key}
                >
                  {draftFilterOptions[key].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <label className="intake-drafts-sort">
            <span>Sort</span>
            <select
              className="header-filter-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as DraftSortOption)}
            >
              {(Object.keys(draftSortLabels) as DraftSortOption[]).map((opt) => (
                <option key={opt} value={opt}>{draftSortLabels[opt]}</option>
              ))}
            </select>
          </label>
        </div>

        <section className="va-ops-panel" aria-label="Saved drafts">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Draft Submissions</h3>
            <p className="va-ops-section-sub">
              {filteredDrafts.length} draft{filteredDrafts.length === 1 ? "" : "s"}: resume, assign, or resolve blockers.
            </p>
          </div>
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table intake-table-dense intake-drafts-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Form Type</th>
                  <th>Last Edited</th>
                  <th>Completion</th>
                  <th>Blockers</th>
                  <th>Assigned Owner</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filteredDrafts.map((draft) => (
                  <tr
                    key={draft.id}
                    className={cn(highlightDraftId === draft.id && "submission-tracker-row-expanded")}
                  >
                    <td className="commercial-hub-client-cell">{draft.client}</td>
                    <td>{draft.form}</td>
                    <td>{draft.lastEdited}</td>
                    <td>
                      <div className="intake-draft-progress">
                        <div className="intake-draft-progress-bar">
                          <div
                            className="intake-draft-progress-fill"
                            style={{ width: `${draft.progress}%` }}
                          />
                        </div>
                        <span>{draft.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="intake-draft-blocker-hint">
                        Missing {draft.missingFields} required field{draft.missingFields === 1 ? "" : "s"}
                      </span>
                    </td>
                    <td>
                      <span className="intake-draft-owner">
                        <TeamAvatar
                          userId={ownerUserIds[draft.assignedOwner]}
                          name={draft.assignedOwner}
                          size="xs"
                          showStatus={false}
                        />
                        {draft.assignedOwner}
                      </span>
                    </td>
                    <td>
                      <span className={cn("badge", draft.riskLevel === "High" ? "badge-red" : draft.riskLevel === "Medium" ? "badge-amber" : "badge-green")}>
                        {draft.riskLevel}
                      </span>
                    </td>
                    <td>
                      <span className={cn("badge", draftStatusClass[draft.status])}>
                        {draft.status}
                      </span>
                    </td>
                    <td>
                      <div className="intake-draft-row-actions">
                        <button
                          type="button"
                          className="va-ops-action-btn primary"
                          onClick={() => resumeDraft(draft)}
                        >
                          Resume
                        </button>
                        <IntakeRowActionMenu
                          ariaLabel={`Actions for ${draft.client}`}
                          actions={draftRowActions.filter((a) => a.id !== "resume")}
                          onAction={(id) => handleRowAction(draft, id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DataStateView>
  );
}
