"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  appendDncAudit,
  applySummaryFilter,
  computeDncSummaryCounts,
  defaultDncFilters,
  dncAlertSeverityClass,
  dncComplianceAlerts,
  dncDateRangeOptions,
  dncMarkedByOptions,
  dncOverrideClass,
  dncOverrideStatusOptions,
  dncStatusClass,
  dncStatusOptions,
  dncTypeClass,
  dncTypeOptions,
  loadDncOverrides,
  matchesDncFilters,
  matchesDncSearch,
  mergeDncRecords,
  saveDncOverrides,
  seedDncRecords,
  type DncFilters,
  type DncRecord,
  type DncRecordOverrides,
  type DncSummaryCard,
} from "@/data/dncLog";
import type { VaOperationsRoleId } from "@/data/vaOperations";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useSyncBreadcrumbDetail } from "@/hooks/useSyncBreadcrumbDetail";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";
import { toastMessages } from "@/lib/toastMessages";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import { DNCRecordDrawer } from "./DNCRecordDrawer";

type DNCLogTabProps = {
  role: VaOperationsRoleId;
  initialDncId?: string | null;
};

export function DNCLogTab({ role, initialDncId }: DNCLogTabProps) {
  const toast = useToast();
  const { can, requirePermission, logAudit } = usePermissions();
  const canClearDnc = can("action:clear-dnc");
  const canApproveOverride = can("action:approve-dnc-override");
  const [records, setRecords] = useState<DncRecord[]>(seedDncRecords);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<DncFilters>(defaultDncFilters);
  const [summaryFilter, setSummaryFilter] = useState<DncSummaryCard["filterKey"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DncRecord | null>(null);

  useEffect(() => {
    const overrides = loadDncOverrides();
    setRecords(mergeDncRecords(seedDncRecords, overrides));
    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!initialDncId || loading) return;
    const match = records.find((record) => record.id === initialDncId);
    if (match) setSelected(match);
  }, [initialDncId, loading, records]);

  useSyncBreadcrumbDetail(selected?.leadName ?? null, {
    paramKey: "dnc",
    paramValue: selected?.id,
    enabled: Boolean(selected),
  });

  const persistRecord = useCallback((updated: DncRecord, action: string, actor = "Eva Chong") => {
    setRecords((prev) => {
      const next = prev.map((r) => (r.id === updated.id ? updated : r));
      const overrides: DncRecordOverrides = loadDncOverrides();
      overrides[updated.id] = {
        status: updated.status,
        overrideStatus: updated.overrideStatus,
        notes: updated.notes,
        complianceTimeline: updated.complianceTimeline,
        overrideRequests: updated.overrideRequests,
      };
      saveDncOverrides(overrides);
      appendDncAudit({
        recordId: updated.id,
        action,
        actor,
        timestamp: new Date().toLocaleString(),
      });
      return next;
    });
    setSelected(updated);
  }, []);

  const filtered = useMemo(() => {
    let rows = records.filter((r) => matchesDncSearch(r, search) && matchesDncFilters(r, filters));
    if (summaryFilter) rows = applySummaryFilter(rows, summaryFilter);
    return rows.sort((a, b) => b.dateAddedMs - a.dateAddedMs);
  }, [records, search, filters, summaryFilter]);

  const summaryCards = useMemo(() => computeDncSummaryCounts(records), [records]);

  const handleAction = useCallback(
    (action: string, record: DncRecord) => {
      const timelineEntry = (label: string, detail: string, actor: string) => ({
        id: `t-${Date.now()}`,
        label,
        detail,
        actor,
        timestamp: new Date().toLocaleString(),
      });

      let updated = { ...record };

      switch (action) {
        case "View Details":
          setSelected(record);
          return;
        case "Request Override":
          updated = {
            ...record,
            overrideStatus: "Pending Owner Approval",
            status: "Under Review",
            overrideRequests: [
              ...record.overrideRequests,
              {
                id: `ov-${Date.now()}`,
                requestedBy: "Current User",
                reason: "Outreach exception requested",
                status: "Pending Owner Approval" as const,
                timestamp: new Date().toLocaleString(),
              },
            ],
            complianceTimeline: [
              timelineEntry("Override requested", "Pending owner approval", "Current User"),
              ...record.complianceTimeline,
            ],
          };
          persistRecord(updated, "Override requested");
          toast.success(`Override requested — ${record.leadName}`);
          break;
        case "Approve Override":
          if (!canApproveOverride) {
            requirePermission("action:approve-dnc-override", () => {});
            return;
          }
          updated = {
            ...record,
            overrideStatus: "Approved",
            complianceTimeline: [
              timelineEntry("Override approved", "Owner approved outreach exception", "Eva Chong"),
              ...record.complianceTimeline,
            ],
          };
          persistRecord(updated, "Override approved", "Eva Chong");
          logAudit("approval-made", `DNC override approved — ${record.leadName}`);
          toast.success(toastMessages.vaOps.dncOverrideApproved);
          break;
        case "Deny Override":
          if (!canApproveOverride) {
            requirePermission("action:approve-dnc-override", () => {});
            return;
          }
          updated = {
            ...record,
            overrideStatus: "Denied",
            complianceTimeline: [
              timelineEntry("Override denied", "Owner denied outreach exception", "Eva Chong"),
              ...record.complianceTimeline,
            ],
          };
          persistRecord(updated, "Override denied", "Eva Chong");
          toast.warning(`Override denied — ${record.leadName}`);
          break;
        case "Clear DNC":
          if (!canClearDnc) {
            requirePermission("action:clear-dnc", () => {});
            return;
          }
          updated = {
            ...record,
            status: "Cleared",
            overrideStatus: "None",
            complianceTimeline: [
              timelineEntry("DNC cleared", "Owner cleared DNC flag", "Eva Chong"),
              ...record.complianceTimeline,
            ],
          };
          persistRecord(updated, "DNC cleared", "Eva Chong");
          logAudit("dnc-cleared", `DNC cleared — ${record.leadName}`);
          toast.success(`DNC cleared — ${record.leadName}`);
          break;
        case "Add Note":
          updated = {
            ...record,
            notes: [`Compliance note added ${new Date().toLocaleString()}`, ...record.notes],
          };
          persistRecord(updated, "Note added");
          toast.success("Note added");
          break;
        case "Export Record":
          toast.info(`Export started — ${record.id}`);
          break;
        default:
          toast.success(`${action} — ${record.leadName}`);
      }
    },
    [canApproveOverride, canClearDnc, logAudit, persistRecord, requirePermission, toast],
  );

  const updateFilter = (key: keyof DncFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSummaryFilter(null);
  };

  return (
    <div className="dnc-log-view">
      <RoleTabHeader
        title="DNC Compliance Log"
        subtitle="Do Not Contact governance — lead protection, override tracking, and compliance audit trail."
      />

      <section className="dnc-summary-strip" aria-label="DNC summary">
        {summaryCards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={cn("dnc-summary-card", summaryFilter === card.filterKey && "active")}
            onClick={() => setSummaryFilter((prev) => (prev === card.filterKey ? null : card.filterKey))}
          >
            <span className="dnc-summary-value">{card.value}</span>
            <span className="dnc-summary-label">{card.label}</span>
          </button>
        ))}
      </section>

      <section className="va-ops-panel dnc-alerts-panel" aria-label="Compliance alerts">
        <div className="va-ops-panel-header">
          <h2 className="va-ops-section-title">Compliance Alerts</h2>
          <p className="va-ops-section-sub">Active DNC violations and review items requiring attention.</p>
        </div>
        <ul className="dnc-alerts-list">
          {dncComplianceAlerts.map((alert) => (
            <li key={alert.id} className={cn("dnc-alert-item", alert.severity)}>
              <div className="dnc-alert-header">
                <span className={cn("badge", dncAlertSeverityClass[alert.severity])}>
                  {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                </span>
                <time>{alert.timestamp}</time>
              </div>
              <strong>{alert.title}</strong>
              <p>{alert.detail}</p>
              {alert.recordId && (
                <button
                  type="button"
                  className="dnc-alert-link"
                  onClick={() => {
                    const rec = records.find((r) => r.id === alert.recordId);
                    if (rec) setSelected(rec);
                  }}
                >
                  View record
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="va-ops-panel" aria-label="DNC records">
        <div className="dnc-toolbar">
          <div className="send-center-search-wrap">
            <AppIcon name="search" size={16} strokeWidth={2} />
            <input
              type="search"
              placeholder="Search by lead, email, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search DNC records"
            />
          </div>
          <div className="dnc-filter-row">
            {(
              [
                ["dncType", dncTypeOptions],
                ["dateRange", dncDateRangeOptions],
                ["markedBy", dncMarkedByOptions],
                ["status", dncStatusOptions],
                ["overrideStatus", dncOverrideStatusOptions],
              ] as const
            ).map(([key, options]) => (
              <select
                key={key}
                className="header-filter-select"
                value={filters[key]}
                onChange={(e) => updateFilter(key, e.target.value)}
                aria-label={`Filter by ${key}`}
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="send-center-skeleton" aria-busy="true" aria-label="Loading DNC records">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="send-center-skeleton-row" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="commercial-hub-empty-state" role="status">
            <div className="commercial-hub-empty-state-title">No DNC records found</div>
            <p className="commercial-hub-empty-state-desc">
              {search || summaryFilter
                ? "Try adjusting your search or filters."
                : "No Do Not Contact records are on file yet."}
            </p>
          </div>
        ) : (
          <div className="commercial-hub-table-wrap">
            <table className="commercial-hub-table dnc-log-table">
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Business Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>DNC Type</th>
                  <th>Reason</th>
                  <th>Marked By</th>
                  <th>Date Added</th>
                  <th>Status</th>
                  <th>Override Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="commercial-hub-table-row-clickable"
                    onClick={() => setSelected(row)}
                  >
                    <td className="commercial-hub-client-cell">
                      <span className="dnc-lead-cell">
                        {row.leadName}
                        {row.status === "Active" && <span className="badge badge-red dnc-badge">DNC</span>}
                      </span>
                    </td>
                    <td>{row.businessName}</td>
                    <td>{row.phone}</td>
                    <td>{row.email}</td>
                    <td><span className={cn("badge", dncTypeClass[row.dncType])}>{row.dncType}</span></td>
                    <td className="dnc-reason-cell">{row.reason}</td>
                    <td><UserChip name={row.markedBy} /></td>
                    <td>{row.dateAdded}</td>
                    <td><span className={cn("badge", dncStatusClass[row.status])}>{row.status}</span></td>
                    <td><span className={cn("badge", dncOverrideClass[row.overrideStatus])}>{row.overrideStatus}</span></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="send-center-row-actions">
                        <button type="button" className="va-ops-action-btn" onClick={() => handleAction("View Details", row)}>
                          View
                        </button>
                        <button type="button" className="va-ops-action-btn" onClick={() => handleAction("Request Override", row)}>
                          Override
                        </button>
                        {canApproveOverride && row.overrideStatus === "Pending Owner Approval" && (
                          <button type="button" className="va-ops-action-btn" onClick={() => handleAction("Approve Override", row)}>
                            Approve
                          </button>
                        )}
                        {canClearDnc && row.status !== "Cleared" && (
                          <button type="button" className="va-ops-action-btn send-center-action-danger" onClick={() => handleAction("Clear DNC", row)}>
                            Clear
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="dnc-system-rules">
          <AppIcon name="shield" size={16} strokeWidth={2} />
          <p>
            Active DNC records block Send Center sends, Commercial outreach, and display a global red DNC badge.
            Owner override required for exceptions.
          </p>
        </div>
      </section>

      <DNCRecordDrawer
        record={selected}
        canClearDnc={canClearDnc}
        canApproveOverride={canApproveOverride}
        onClose={() => setSelected(null)}
        onAction={handleAction}
      />
    </div>
  );
}
