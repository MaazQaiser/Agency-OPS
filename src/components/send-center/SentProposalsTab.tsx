"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getProposalDetail,
  computeEngagementScore,
  engagementScoreClass,
  proposalIdByRowId,
} from "@/data/sendCenterProposals";
import {
  matchesSendCenterSearch,
  sentProposalRecords,
  sendCenterAiInsights,
  sendCenterBulkActions,
  type SentProposalRecord,
} from "@/data/sendCenter";
import { routes } from "@/lib/routes";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { ExportMenu } from "@/components/export/ExportMenu";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import { cn } from "@/lib/cn";
import { ClientLanguageBadges } from "@/components/bilingual/ClientLanguageBadges";
import { getClientLanguage } from "@/data/bilingualClient";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { resolveDisplayStatus } from "@/lib/dataState";
import { exportSendCenterHistoryPdf } from "@/lib/export";
import { SendCenterAiInsight } from "./SendCenterAiInsight";
import { SendCenterBulkBar } from "./SendCenterBulkBar";
import { SentProposalLifecycleStepper } from "./SentProposalLifecycleStepper";
import {
  SendCenterFilters,
  SendCenterTableSkeleton,
  useSendCenterFilters,
} from "./SendCenterFilters";

type SentProposalsTabProps = {
  onToast: (message: string, variant?: "success" | "error") => void;
};

function getEngagement(row: SentProposalRecord) {
  const detail = getProposalDetail(proposalIdByRowId[row.id] ?? row.proposalId);
  if (detail) return computeEngagementScore(detail.engagement);
  if (row.replied || row.openCount >= 2) return "Hot" as const;
  if (row.opened || row.openCount >= 1) return "Warm" as const;
  return "Cold" as const;
}

export function SentProposalsTab({ onToast }: SentProposalsTabProps) {
  const toast = useToast();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useSendCenterFilters();
  const [rows, setRows] = useState(sentProposalRecords);
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
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        const haystack = [row.client, row.sentDate].join(" ");
        return matchesSendCenterSearch(haystack, search);
      }),
    [rows, search],
  );

  const updateFilter = () => {};

  const openProposal = (row: SentProposalRecord) => {
    const id = proposalIdByRowId[row.id] ?? row.proposalId;
    router.push(`${routes.sendCenterProposal(id)}?from=sent`);
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

  const handleAction = async (action: string, row: SentProposalRecord) => {
    if (action === "Resend") {
      const toastId = toast.processing(toastMessages.sendCenter.sendingProposal);
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      toast.update(toastId, toastMessages.sendCenter.proposalSent, "success");
      return;
    }
    if (action === "Follow-up") {
      toast.success(toastMessages.sendCenter.followUpScheduled);
      return;
    }
    if (action === "Archive") {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      onToast(`${row.client} proposal archived`, "success");
    }
  };

  const handleBulk = async (action: string) => {
    if (action === "Export") {
      exportSendCenterHistoryPdf();
      onToast(`Exported ${selected.size} proposal record(s)`, "success");
    } else if (action === "Send") {
      const toastId = toast.processing(toastMessages.sendCenter.sendingProposal);
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      toast.update(toastId, toastMessages.sendCenter.proposalSent, "success");
    } else if (action === "Escalate") {
      onToast(`Escalated ${selected.size} proposal(s) for follow-up`, "success");
    } else {
      onToast(`${action} applied to ${selected.size} proposal(s)`, "success");
    }
    if (action === "Archive") {
      setRows((prev) => prev.filter((r) => !selected.has(r.id)));
    }
    setSelected(new Set());
  };

  const handleAiAction = (actionId: string) => {
    if (actionId === "archive") {
      const kim = rows.find((r) => r.client.includes("Kim"));
      if (kim) {
        setRows((prev) => prev.filter((r) => r.id !== kim.id));
        onToast(`${kim.client} proposal archived`, "success");
      }
      return;
    }
    onToast(`AI action: ${actionId.replace(/-/g, " ")}`, "success");
  };

  return (
    <div className="va-ops-role-view send-center-tab">
      <div className="export-table-header-export">
        <RoleTabHeader
          title="Sent Proposals"
          subtitle="Track delivery, engagement, acceptance, and expiration."
        />
        <ExportMenu kind="send-center-history" />
      </div>

      <SendCenterAiInsight insights={sendCenterAiInsights.sentProposals} onAction={handleAiAction} />

      <SendCenterFilters
        search={search}
        onSearchChange={setSearch}
        placeholder="Search client or sent date..."
        filters={filters}
        onFilterChange={updateFilter}
        filterKeys={[]}
      />

      <SendCenterBulkBar
        selectedCount={selected.size}
        actions={sendCenterBulkActions}
        onAction={handleBulk}
        onClear={() => setSelected(new Set())}
      />

      <section className="va-ops-panel" aria-label="Sent proposals">
        <DataStateView
          status={status}
          lastSyncedAt={lastSyncedAt}
          isStale={isStale}
          showFreshness={false}
          loading={<SendCenterTableSkeleton />}
          empty={<HubEmptyState preset="send-center-sent" />}
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
            <table className="commercial-hub-table send-center-table send-center-sent-table">
              <thead>
                <tr>
                  <th className="send-center-checkbox-col">
                    <input
                      type="checkbox"
                      aria-label="Select all sent proposals"
                      checked={filtered.length > 0 && selected.size === filtered.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Client</th>
                  <th>Sent Date</th>
                  <th>Engagement</th>
                  <th>Lifecycle</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <HubEmptyState
                        title="No matches"
                        description="No sent proposals match your search. Try clearing filters or broadening your search."
                        compact
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => {
                    const engagement = getEngagement(row);
                    return (
                      <tr
                        key={row.id}
                        className={cn(
                          "send-center-clickable-row",
                          row.expired && "send-center-row-expired",
                          selected.has(row.id) && "selected",
                        )}
                      >
                        <td className="send-center-checkbox-col">
                          <input
                            type="checkbox"
                            aria-label={`Select ${row.client}`}
                            checked={selected.has(row.id)}
                            onChange={() => toggleSelect(row.id)}
                          />
                        </td>
                        <td className="commercial-hub-client-cell">
                          <button type="button" className="send-center-row-link" onClick={() => openProposal(row)}>
                            <span className="bilingual-client-cell">
                              {row.client}
                              <ClientLanguageBadges profile={getClientLanguage(row.client)} compact />
                            </span>
                          </button>
                          <span className={cn("badge send-center-engagement-badge", engagementScoreClass[engagement])}>
                            {engagement}
                          </span>
                        </td>
                        <td>{row.sentDate}</td>
                        <td>
                          <span className="send-center-engagement-meta">
                            {row.openCount} opens · {row.daysSinceActivity}d since activity
                          </span>
                        </td>
                        <td className="send-center-lifecycle-cell">
                          <SentProposalLifecycleStepper row={row} />
                        </td>
                        <td>
                          <div className="send-center-row-actions">
                            {(["Resend", "Follow-up", "Archive"] as const).map((action) => (
                              <button
                                key={action}
                                type="button"
                                className="va-ops-action-btn"
                                onClick={() => handleAction(action, row)}
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
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
