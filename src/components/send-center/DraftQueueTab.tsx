"use client";

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import {
  draftStatusClass,
  matchesSendCenterFilters,
  matchesSendCenterSearch,
  sendCenterAiInsights,
  sendPriorityClass,
  type DraftQueueRecord,
  type SendCenterFilterState,
} from "@/data/sendCenter";
import { proposalIdByRowId } from "@/data/sendCenterProposals";
import { routes } from "@/lib/routes";
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
import {
  SendCenterEmptyState,
  SendCenterFilters,
  SendCenterTableSkeleton,
  useSendCenterFilters,
  useTabLoading,
} from "./SendCenterFilters";

type DraftQueueTabProps = {
  rows: DraftQueueRecord[];
  setRows: Dispatch<SetStateAction<DraftQueueRecord[]>>;
  onToast: (message: string, variant?: "success" | "error") => void;
  onOpenNewDraft: () => void;
};

export function DraftQueueTab({ rows, setRows, onToast, onOpenNewDraft }: DraftQueueTabProps) {
  const router = useRouter();
  const loading = useTabLoading();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useSendCenterFilters();
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
    if (action === "Delete Draft") {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      onToast(`Draft for ${row.client} deleted`, "success");
    }
  };

  const handleBulk = (action: string) => {
    onToast(`${action} applied to ${selected.size} draft(s)`, "success");
    if (action === "Delete") {
      setRows((prev) => prev.filter((r) => !selected.has(r.id)));
    }
    setSelected(new Set());
  };

  return (
    <div className="va-ops-role-view send-center-tab">
      <RoleTabHeader
        title="Draft Queue"
        subtitle="Proposals in progress — edit, submit for review, or remove drafts."
        quickActions={[{ id: "new", label: "New Draft", icon: "plus" }]}
        onQuickActionClick={() => onOpenNewDraft()}
      />

      <SendCenterAiInsight insights={sendCenterAiInsights.draftQueue} />

      <SendCenterFilters
        search={search}
        onSearchChange={setSearch}
        placeholder="Search clients, policy types, producers..."
        filters={filters}
        onFilterChange={updateFilter}
      />

      <SendCenterBulkBar
        selectedCount={selected.size}
        actions={["Submit", "Delete", "Assign"]}
        onAction={handleBulk}
        onClear={() => setSelected(new Set())}
      />

      <section className="va-ops-panel" aria-label="Draft queue">
        {loading ? (
          <SendCenterTableSkeleton />
        ) : (
          <div className="commercial-hub-table-wrap">
            <table className="commercial-hub-table send-center-table">
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
                  <th>Client</th>
                  <th>Language</th>
                  <th>Policy Type</th>
                  <th>Draft Type</th>
                  <th>Assigned Producer</th>
                  <th>Created At</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10}>
                      <SendCenterEmptyState
                        title="No drafts in queue"
                        description="Create a new draft or adjust your search and filters."
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr
                      key={row.id}
                      className={cn("send-center-clickable-row", selected.has(row.id) && "selected")}
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
                      <td>{row.policyType}</td>
                      <td>{row.draftType}</td>
                      <td><UserChip name={row.assignedProducer} /></td>
                      <td>{row.createdAt}</td>
                      <td>
                        <span className={cn("badge", sendPriorityClass[row.priority])}>{row.priority}</span>
                      </td>
                      <td>
                        <span className={cn("badge", draftStatusClass[row.status])}>{row.status}</span>
                      </td>
                      <td>
                        <div className="send-center-row-actions">
                          {(["Edit Draft", "Submit for Review", "Delete Draft"] as const).map((action) => (
                            <button
                              key={action}
                              type="button"
                              className={cn("va-ops-action-btn", action === "Delete Draft" && "send-center-action-danger")}
                              onClick={() => handleAction(action, row)}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
