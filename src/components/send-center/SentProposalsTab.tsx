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
  type SentProposalRecord,
} from "@/data/sendCenter";
import { routes } from "@/lib/routes";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import { cn } from "@/lib/cn";
import { ClientLanguageBadges } from "@/components/bilingual/ClientLanguageBadges";
import { getClientLanguage, getProposalLanguageMeta, translationStatusClass } from "@/data/bilingualClient";
import { SendCenterAiInsight } from "./SendCenterAiInsight";
import { SendCenterBulkBar } from "./SendCenterBulkBar";
import { ProposalWorkflowStepper } from "./ProposalWorkflowStepper";
import {
  SendCenterEmptyState,
  SendCenterFilters,
  SendCenterTableSkeleton,
  useSendCenterFilters,
  useTabLoading,
} from "./SendCenterFilters";

type SentProposalsTabProps = {
  onToast: (message: string, variant?: "success" | "error") => void;
};

function getWorkflowProgress(row: SentProposalRecord) {
  const detail = getProposalDetail(proposalIdByRowId[row.id] ?? row.proposalId);
  return detail?.workflowProgress ?? ["draft", "review", "approved", "sent"];
}

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
  const loading = useTabLoading();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useSendCenterFilters();
  const [rows, setRows] = useState(sentProposalRecords);
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
    if (action === "Resend") {
      const toastId = toast.processing(toastMessages.sendCenter.sendingProposal);
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      toast.update(toastId, toastMessages.sendCenter.proposalSent, "success");
    } else if (action === "Assign Follow-up") {
      toast.success(toastMessages.sendCenter.followUpScheduled);
    } else {
      onToast(`${action} applied to ${selected.size} proposal(s)`, "success");
    }
    if (action === "Archive") {
      setRows((prev) => prev.filter((r) => !selected.has(r.id)));
    }
    setSelected(new Set());
  };

  return (
    <div className="va-ops-role-view send-center-tab">
      <RoleTabHeader
        title="Sent Proposals"
        subtitle="Track delivery, engagement, acceptance, and expiration."
      />

      <SendCenterAiInsight insights={sendCenterAiInsights.sentProposals} />

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
        actions={["Resend", "Archive", "Export", "Assign Follow-up"]}
        onAction={handleBulk}
        onClear={() => setSelected(new Set())}
      />

      <section className="va-ops-panel" aria-label="Sent proposals">
        {loading ? (
          <SendCenterTableSkeleton />
        ) : (
          <div className="commercial-hub-table-wrap">
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
                  <th>Language</th>
                  <th>Sent Date</th>
                  <th>Engagement</th>
                  <th>Workflow</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <SendCenterEmptyState
                        title="No sent proposals"
                        description="Sent proposals and their engagement status will appear here."
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => {
                    const engagement = getEngagement(row);
                    const progress = getWorkflowProgress(row);
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
                        <td>
                          {(() => {
                            const meta = getProposalLanguageMeta(proposalIdByRowId[row.id] ?? row.proposalId);
                            if (!meta) return <span className="badge badge-gray">EN</span>;
                            return (
                              <span className={cn("badge", translationStatusClass[meta.translationStatus])}>
                                {meta.translationStatus}
                              </span>
                            );
                          })()}
                        </td>
                        <td>{row.sentDate}</td>
                        <td>
                          <span className="send-center-engagement-meta">
                            {row.openCount} opens · {row.daysSinceActivity}d since activity
                          </span>
                        </td>
                        <td className="send-center-stepper-cell">
                          <ProposalWorkflowStepper progress={progress} compact />
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
        )}
      </section>
    </div>
  );
}
