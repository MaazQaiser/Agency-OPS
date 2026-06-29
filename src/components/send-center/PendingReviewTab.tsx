"use client";

import { useMemo, useState } from "react";
import {
  computeEscalationStatus,
  formatWaitingTime,
  getEscalationRiskBadge,
  getSlaUrgencyTier,
  matchesSendCenterFilters,
  matchesSendCenterSearch,
  pendingReviewRecords,
  sendCenterAiInsights,
  sendCenterBulkActions,
  sendPriorityClass,
  type PendingReviewRecord,
  type SendCenterFilterState,
} from "@/data/sendCenter";
import { ExportMenu } from "@/components/export/ExportMenu";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import { cn } from "@/lib/cn";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { resolveDisplayStatus } from "@/lib/dataState";
import { exportSendCenterHistoryPdf } from "@/lib/export";
import { SendCenterAiInsight } from "./SendCenterAiInsight";
import { SendCenterBulkBar } from "./SendCenterBulkBar";
import {
  SendCenterSlaStageIndicator,
  SendCenterSlaWorkflowRail,
} from "./SendCenterSlaWorkflowRail";
import {
  SendCenterFilters,
  SendCenterTableSkeleton,
  useSendCenterFilters,
} from "./SendCenterFilters";

type PendingReviewTabProps = {
  onToast: (message: string, variant?: "success" | "error") => void;
};

export function PendingReviewTab({ onToast }: PendingReviewTabProps) {
  const toast = useToast();
  const { can, requirePermission, logAudit } = usePermissions();
  const canApprove = can("action:approve-drafts");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useSendCenterFilters();
  const [rows, setRows] = useState(pendingReviewRecords);
  const [selected, setSelected] = useState<Set<string>>(new Set());
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

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        const escalation = computeEscalationStatus(row.waitingMinutes);
        const haystack = [row.draftName, row.submittedBy, row.client, escalation].join(" ");
        return (
          matchesSendCenterSearch(haystack, search) &&
          matchesSendCenterFilters(row.priority, row.submittedBy, "", escalation, filters)
        );
      }),
    [rows, search, filters],
  );

  const updateFilter = (key: keyof SendCenterFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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

  const handleAction = (action: string, row: PendingReviewRecord) => {
    if (action === "Approve") {
      requirePermission("action:approve-drafts", () => {
        setRows((prev) => prev.filter((r) => r.id !== row.id));
        logAudit("approval-made", `Draft approved — ${row.draftName}`);
        toast.success(toastMessages.sendCenter.proposalApproved);
      });
      return;
    }
    if (action === "Reject") {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      onToast(`${row.draftName} rejected`, "success");
      return;
    }
    if (action === "Request Revision") {
      onToast(`Revision requested for ${row.draftName}`, "success");
    }
  };

  const handleBulk = (action: string) => {
    if (action === "Export") {
      exportSendCenterHistoryPdf();
      onToast(`Exported ${selected.size} review record(s)`, "success");
    } else {
      onToast(`${action} applied to ${selected.size} draft(s)`, "success");
    }
    setSelected(new Set());
  };

  const handleAiAction = (actionId: string) => {
    onToast(`AI action: ${actionId.replace(/-/g, " ")}`, "success");
  };

  return (
    <div className="va-ops-role-view send-center-tab">
      <RoleTabHeader
        title="Pending Licensed Review"
        subtitle="Drafts awaiting licensed producer approval — SLA monitored."
      />

      <SendCenterAiInsight insights={sendCenterAiInsights.pendingReview} onAction={handleAiAction} />

      <SendCenterSlaWorkflowRail />

      <div className="send-center-table-toolbar">
        <SendCenterFilters
          search={search}
          onSearchChange={setSearch}
          placeholder="Search draft name, client, submitter..."
          filters={filters}
          onFilterChange={updateFilter}
          filterKeys={["priority", "status"]}
        />
        <ExportMenu kind="send-center-history" compact />
      </div>

      <SendCenterBulkBar
        selectedCount={selected.size}
        actions={sendCenterBulkActions}
        onAction={handleBulk}
        onClear={() => setSelected(new Set())}
      />

      <section className="va-ops-panel" aria-label="Pending licensed review">
        <DataStateView
          status={status}
          lastSyncedAt={lastSyncedAt}
          isStale={isStale}
          showFreshness={false}
          loading={<SendCenterTableSkeleton />}
          empty={
            <HubEmptyState
              title="No drafts pending review"
              description="All licensed reviews are current. New submissions will appear here."
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
                      aria-label="Select all pending reviews"
                      checked={filtered.length > 0 && selected.size === filtered.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Draft Name</th>
                  <th>Client</th>
                  <th>Time Waiting</th>
                  <th>Priority</th>
                  <th>SLA Stage</th>
                  <th>Risk</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <HubEmptyState
                        title="No matches"
                        description="No pending reviews match your search or filters. Try clearing filters or broadening your search."
                        compact
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => {
                    const escalation = computeEscalationStatus(row.waitingMinutes);
                    const urgency = getSlaUrgencyTier(row.waitingMinutes);
                    const risk = getEscalationRiskBadge(row.waitingMinutes);
                    return (
                      <tr
                        key={row.id}
                        className={cn(
                          "send-center-sla-row",
                          `send-center-sla-${urgency}`,
                          escalation === "Owner Escalation" && "send-center-row-escalated",
                          selected.has(row.id) && "selected",
                        )}
                      >
                        <td className="send-center-checkbox-col">
                          <input
                            type="checkbox"
                            aria-label={`Select ${row.draftName}`}
                            checked={selected.has(row.id)}
                            onChange={() => toggleSelect(row.id)}
                          />
                        </td>
                        <td className="commercial-hub-client-cell">{row.draftName}</td>
                        <td>{row.client}</td>
                        <td>
                          <span className="send-center-wait-time send-center-wait-indicator">
                            {formatWaitingTime(row.waitingMinutes)}
                          </span>
                        </td>
                        <td>
                          <span className={cn("badge", sendPriorityClass[row.priority])}>{row.priority}</span>
                        </td>
                        <td>
                          <SendCenterSlaStageIndicator status={escalation} waitingMinutes={row.waitingMinutes} />
                        </td>
                        <td>
                          <span className={cn("badge", risk.className)}>{risk.label}</span>
                        </td>
                        <td>
                          <div className="send-center-row-actions">
                            {(["Approve", "Reject", "Request Revision"] as const)
                              .filter((action) => action !== "Approve" || canApprove)
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
