"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  approvedDraftRecords,
  approvedStatusClass,
  matchesSendCenterFilters,
  matchesSendCenterSearch,
  type ApprovedDraftRecord,
  type SendCenterFilterState,
} from "@/data/sendCenter";
import { proposalIdByRowId } from "@/data/sendCenterProposals";
import { routes } from "@/lib/routes";
import { exportSendCenterHistoryPdf } from "@/lib/export";
import { ExportMenu } from "@/components/export/ExportMenu";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { cn } from "@/lib/cn";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { resolveDisplayStatus } from "@/lib/dataState";
import { SendCenterBulkBar } from "./SendCenterBulkBar";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import {
  SendCenterFilters,
  SendCenterTableSkeleton,
  useSendCenterFilters,
} from "./SendCenterFilters";
import { ComplianceLockRing } from "./ComplianceLockRing";

type ApprovedDraftsTabProps = {
  onToast: (message: string, variant?: "success" | "error") => void;
};

export function ApprovedDraftsTab({ onToast }: ApprovedDraftsTabProps) {
  const { can, requirePermission } = usePermissions();
  const canSend = can("action:send-proposals");
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useSendCenterFilters();
  const [rows] = useState(approvedDraftRecords);
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
        const haystack = [row.client, row.approvedBy, row.proposalType, row.status].join(" ");
        return (
          matchesSendCenterSearch(haystack, search) &&
          matchesSendCenterFilters("", row.approvedBy, row.proposalType.split(" ")[0], row.status, filters)
        );
      }),
    [rows, search, filters],
  );

  const updateFilter = (key: keyof SendCenterFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const openProposal = (row: ApprovedDraftRecord) => {
    const id = proposalIdByRowId[row.id] ?? row.proposalId;
    router.push(`${routes.sendCenterProposal(id)}?from=approved`);
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

  const handleAction = (action: string, row: ApprovedDraftRecord) => {
    if (action === "Send Proposal") {
      requirePermission("action:send-proposals", () => {
        onToast(`Proposal sent to ${row.client}`, "success");
      });
      return;
    }
    if (action === "Download PDF") {
      exportSendCenterHistoryPdf();
      onToast(`PDF exported for ${row.client}`, "success");
      return;
    }
    if (action === "Add Notes") {
      openProposal(row);
    }
  };

  const handleBulk = (action: string) => {
    onToast(`${action} applied to ${selected.size} approved draft(s)`, "success");
    setSelected(new Set());
  };

  return (
    <div className="va-ops-role-view send-center-tab">
      <div className="export-table-header-export">
        <RoleTabHeader
          title="Approved Drafts"
          subtitle="Licensed-approved proposals ready to send or schedule."
        />
        <ExportMenu kind="send-center-history" />
      </div>

      <SendCenterFilters
        search={search}
        onSearchChange={setSearch}
        placeholder="Search client, approver, proposal type..."
        filters={filters}
        onFilterChange={updateFilter}
        filterKeys={["producer", "policyType", "status"]}
      />

      <SendCenterBulkBar
        selectedCount={selected.size}
        actions={["Send", "Schedule", "Download PDF"]}
        onAction={handleBulk}
        onClear={() => setSelected(new Set())}
      />

      <section className="va-ops-panel" aria-label="Approved drafts">
        <DataStateView
          status={status}
          lastSyncedAt={lastSyncedAt}
          isStale={isStale}
          showFreshness={false}
          loading={<SendCenterTableSkeleton />}
          empty={
            <HubEmptyState
              title="No approved drafts"
              description="Approved proposals will appear here after licensed review."
            />
          }
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
            <table className="commercial-hub-table send-center-table">
              <thead>
                <tr>
                  <th className="send-center-checkbox-col">
                    <input
                      type="checkbox"
                      aria-label="Select all approved drafts"
                      checked={filtered.length > 0 && selected.size === filtered.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Client</th>
                  <th>Approved By</th>
                  <th>Date</th>
                  <th>Proposal Type</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <HubEmptyState
                        title="No matches"
                        description="No approved drafts match your search or filters. Try clearing filters or broadening your search."
                        compact
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.id} className={cn("send-center-clickable-row", selected.has(row.id) && "selected")}>
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
                          {row.client}
                        </button>
                      </td>
                      <td><UserChip name={row.approvedBy} /></td>
                      <td>{row.date}</td>
                      <td>{row.proposalType}</td>
                      <td>
                        <span className={cn("badge", approvedStatusClass[row.status])}>{row.status}</span>
                      </td>
                      <td>
                        <div className="send-center-row-actions">
                          {canSend ? (
                            <ComplianceLockRing
                              locked={row.status === "On Hold"}
                              onSend={() => handleAction("Send Proposal", row)}
                              label="Send Proposal"
                              className="send-center-compliance-lock"
                            />
                          ) : null}
                          {(["Download PDF", "Add Notes"] as const)
                            .map((action) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DataStateView>
      </section>
    </div>
  );
}
