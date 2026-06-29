"use client";

import { useMemo, useState, Fragment, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import {
  draftStatusClass,
  getDraftNextAction,
  getDraftRiskLevel,
  matchesSendCenterFilters,
  matchesSendCenterSearch,
  sendCenterAiInsights,
  sendCenterBulkActions,
  sendPriorityClass,
  type DraftQueueRecord,
  type SendCenterFilterState,
} from "@/data/sendCenter";
import { proposalIdByRowId } from "@/data/sendCenterProposals";
import { routes } from "@/lib/routes";
import { ExportMenu } from "@/components/export/ExportMenu";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { cn } from "@/lib/cn";
import { SendCenterAiInsight } from "./SendCenterAiInsight";
import { SendCenterBulkBar } from "./SendCenterBulkBar";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import { ClientLanguageBadges } from "@/components/bilingual/ClientLanguageBadges";
import {
  getClientLanguage,
  getProposalLanguageMeta,
  translationStatusClass,
} from "@/data/bilingualClient";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { resolveDisplayStatus } from "@/lib/dataState";
import { exportSendCenterHistoryPdf } from "@/lib/export";
import {
  SendCenterFilters,
  SendCenterTableSkeleton,
  useSendCenterFilters,
} from "./SendCenterFilters";

type DraftQueueTabProps = {
  rows: DraftQueueRecord[];
  setRows: Dispatch<SetStateAction<DraftQueueRecord[]>>;
  onToast: (message: string, variant?: "success" | "error") => void;
  onOpenNewDraft: () => void;
};

export function DraftQueueTab({ rows, setRows, onToast, onOpenNewDraft }: DraftQueueTabProps) {
  const router = useRouter();
  const {
    status: loadStatus,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => rows,
    deps: [rows],
    errorPreset: "supabase-timeout",
  });
  const status = resolveDisplayStatus(loadStatus, rows, (d) => d.length === 0);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useSendCenterFilters();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        const haystack = [row.client, row.policyType, row.draftType, row.assignedProducer, row.status].join(" ");
        return (
          matchesSendCenterSearch(haystack, search) &&
          matchesSendCenterFilters(row.priority, row.assignedProducer, row.policyType, row.status, filters)
        );
      }),
    [rows, search, filters],
  );

  const updateFilter = (key: keyof SendCenterFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const openProposal = (row: DraftQueueRecord) => {
    const id = proposalIdByRowId[row.id] ?? row.proposalId;
    router.push(`${routes.sendCenterProposal(id)}?from=draft-queue`);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) => (prev.size === filtered.length ? new Set() : new Set(filtered.map((r) => r.id))));
  };

  const handleAction = (action: string, row: DraftQueueRecord) => {
    if (action === "Edit Draft") {
      openProposal(row);
      return;
    }
    if (action === "Submit for Review") {
      onToast(`${row.client} submitted for licensed review`, "success");
      return;
    }
    if (action === "Delete") {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      onToast(`Draft for ${row.client} deleted`, "success");
    }
  };

  const handleBulk = (action: string) => {
    if (action === "Export") {
      exportSendCenterHistoryPdf();
      onToast(`Exported ${selected.size} draft record(s)`, "success");
    } else {
      onToast(`${action} applied to ${selected.size} draft(s)`, "success");
    }
    if (action === "Archive") {
      setRows((prev) => prev.filter((r) => !selected.has(r.id)));
    }
    setSelected(new Set());
  };

  const handleAiAction = (actionId: string) => {
    if (actionId === "review-draft") {
      const kim = rows.find((r) => r.client.includes("Kim"));
      if (kim) openProposal(kim);
      return;
    }
    onToast(`AI action: ${actionId.replace(/-/g, " ")}`, "success");
  };

  return (
    <div className="va-ops-role-view send-center-tab">
      <RoleTabHeader
        title="Draft Queue"
        subtitle="Proposals in progress — edit, submit for review, or remove drafts."
        quickActions={[{ id: "new", label: "New Draft", icon: "plus" }]}
        onQuickActionClick={() => onOpenNewDraft()}
      />

      <SendCenterAiInsight insights={sendCenterAiInsights.draftQueue} onAction={handleAiAction} />

      <div className="send-center-table-toolbar">
        <SendCenterFilters
          search={search}
          onSearchChange={setSearch}
          placeholder="Search clients, policy types, producers..."
          filters={filters}
          onFilterChange={updateFilter}
        />
        <ExportMenu kind="send-center-history" compact />
      </div>

      <SendCenterBulkBar
        selectedCount={selected.size}
        actions={sendCenterBulkActions}
        onAction={handleBulk}
        onClear={() => setSelected(new Set())}
      />

      <section className="va-ops-panel" aria-label="Draft queue">
        <DataStateView
          status={status}
          lastSyncedAt={lastSyncedAt}
          isStale={isStale}
          showFreshness={false}
          loading={<SendCenterTableSkeleton />}
          empty={<HubEmptyState preset="send-center-drafts" onAction={onOpenNewDraft} />}
          error={
            <HubErrorState
              preset="supabase-timeout"
              onRetry={retry}
              retrying={retrying}
              lastSyncedAt={lastSyncedAt}
            />
          }
        >
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table send-center-table send-center-table--compact">
              <thead>
                <tr>
                  <th className="send-center-checkbox-col">
                    <input
                      type="checkbox"
                      aria-label="Select all drafts"
                      checked={filtered.length > 0 && selected.size === filtered.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th aria-label="Expand" className="send-center-expand-col" />
                  <th>Client</th>
                  <th>Policy</th>
                  <th>Assigned Producer</th>
                  <th>Progress State</th>
                  <th>Risk Level</th>
                  <th>Next Action</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9}>
                      <HubEmptyState
                        title="No matches"
                        description="No drafts match your search or filters. Try clearing filters or broadening your search."
                        compact
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => {
                    const expanded = expandedId === row.id;
                    const langMeta = getProposalLanguageMeta(proposalIdByRowId[row.id] ?? row.proposalId);
                    return (
                      <Fragment key={row.id}>
                        <tr
                          className={cn(
                            "send-center-clickable-row",
                            selected.has(row.id) && "selected",
                            row.priority === "High" && "send-center-row--urgent",
                          )}
                        >
                          <td className="send-center-checkbox-col" data-label="">
                            <input
                              type="checkbox"
                              aria-label={`Select ${row.client}`}
                              checked={selected.has(row.id)}
                              onChange={() => toggleSelect(row.id)}
                            />
                          </td>
                          <td className="send-center-expand-col" data-label="">
                            <button
                              type="button"
                              className={cn("send-center-expand-btn", expanded && "expanded")}
                              aria-expanded={expanded}
                              aria-label={expanded ? "Collapse details" : "Expand details"}
                              onClick={() => setExpandedId(expanded ? null : row.id)}
                            >
                              ›
                            </button>
                          </td>
                          <td className="commercial-hub-client-cell" data-label="Client">
                            <button type="button" className="send-center-row-link" onClick={() => openProposal(row)}>
                              <span className="bilingual-client-cell">
                                {row.client}
                                <ClientLanguageBadges profile={getClientLanguage(row.client)} compact />
                              </span>
                            </button>
                          </td>
                          <td data-label="Policy" title={`${row.policyType} · ${row.draftType}`}>
                            {row.policyType}
                          </td>
                          <td data-label="Producer">
                            <UserChip name={row.assignedProducer} />
                          </td>
                          <td data-label="Progress State">
                            <span className={cn("badge", draftStatusClass[row.status])}>{row.status}</span>
                          </td>
                          <td data-label="Risk Level">
                            <span className={cn("badge", sendPriorityClass[row.priority])}>
                              {getDraftRiskLevel(row.priority)}
                            </span>
                          </td>
                          <td data-label="Next Action">
                            <span className="send-center-next-action">{getDraftNextAction(row.status)}</span>
                          </td>
                          <td data-label="" className="ops-responsive-cell--bare">
                            <div className="send-center-row-actions">
                              {(["Edit Draft", "Submit for Review", "Delete"] as const).map((action) => (
                                <button
                                  key={action}
                                  type="button"
                                  className={cn("va-ops-action-btn", action === "Delete" && "send-center-action-danger")}
                                  onClick={() => handleAction(action, row)}
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                        {expanded && (
                          <tr className="send-center-detail-row">
                            <td colSpan={9}>
                              <dl className="send-center-detail-grid">
                                <div>
                                  <dt>Draft type</dt>
                                  <dd>{row.draftType}</dd>
                                </div>
                                <div>
                                  <dt>Created</dt>
                                  <dd>{row.createdAt}</dd>
                                </div>
                                <div>
                                  <dt>Language</dt>
                                  <dd>
                                    {langMeta ? (
                                      <span className={cn("badge", translationStatusClass[langMeta.translationStatus])}>
                                        {langMeta.translationStatus}
                                      </span>
                                    ) : (
                                      <span className="badge badge-gray">EN</span>
                                    )}
                                  </dd>
                                </div>
                                <div>
                                  <dt>Priority</dt>
                                  <dd>{row.priority}</dd>
                                </div>
                              </dl>
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
        </DataStateView>
      </section>
    </div>
  );
}
