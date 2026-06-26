"use client";

import { useMemo, useState } from "react";
import {
  computeEscalationStatus,
  escalationStatusClass,
  formatWaitingTime,
  getEscalationRiskBadge,
  getSlaUrgencyTier,
  matchesSendCenterFilters,
  matchesSendCenterSearch,
  pendingReviewRecords,
  sendCenterAiInsights,
  sendPriorityClass,
  SLA_OWNER_MINUTES,
  SLA_PRODUCER_MINUTES,
  type PendingReviewRecord,
  type SendCenterFilterState,
} from "@/data/sendCenter";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import { cn } from "@/lib/cn";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { resolveDisplayStatus } from "@/lib/dataState";
import { SendCenterAiInsight } from "./SendCenterAiInsight";
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

  const slaCounts = useMemo(() => {
    const onTrack = rows.filter((r) => computeEscalationStatus(r.waitingMinutes) === "On Track").length;
    const producer = rows.filter((r) => computeEscalationStatus(r.waitingMinutes) === "Producer Alert").length;
    const owner = rows.filter((r) => computeEscalationStatus(r.waitingMinutes) === "Owner Escalation").length;
    return { onTrack, producer, owner };
  }, [rows]);

  const updateFilter = (key: keyof SendCenterFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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

  return (
    <div className="va-ops-role-view send-center-tab">
      <RoleTabHeader
        title="Pending Licensed Review"
        subtitle="Drafts awaiting licensed producer approval — SLA monitored."
      />

      <SendCenterAiInsight insights={sendCenterAiInsights.pendingReview} />

      <section className="send-center-sla-strip" aria-label="Review SLA thresholds">
        <div className="send-center-sla-item">
          <span>Producer alert</span>
          <strong>{SLA_PRODUCER_MINUTES} min</strong>
          <span className={cn("badge", "badge-amber")}>{slaCounts.producer} active</span>
        </div>
        <div className="send-center-sla-item">
          <span>Owner escalation</span>
          <strong>{SLA_OWNER_MINUTES} min</strong>
          <span className={cn("badge", "badge-rose")}>{slaCounts.owner} breached</span>
        </div>
        <div className="send-center-sla-item">
          <span>On track</span>
          <strong>&lt; {SLA_PRODUCER_MINUTES} min</strong>
          <span className={cn("badge", "badge-green")}>{slaCounts.onTrack} drafts</span>
        </div>
      </section>

      <SendCenterFilters
        search={search}
        onSearchChange={setSearch}
        placeholder="Search draft name, client, submitter..."
        filters={filters}
        onFilterChange={updateFilter}
        filterKeys={["priority", "status"]}
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
                  <th>Draft Name</th>
                  <th>Submitted By</th>
                  <th>Client</th>
                  <th>Time Waiting</th>
                  <th>Priority</th>
                  <th>Escalation Status</th>
                  <th>Escalation Risk</th>
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
                        )}
                      >
                        <td className="commercial-hub-client-cell">{row.draftName}</td>
                        <td>{row.submittedBy}</td>
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
                          <span className={cn("badge", escalationStatusClass[escalation])}>{escalation}</span>
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
