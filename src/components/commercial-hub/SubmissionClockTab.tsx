"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  applyClockSummaryFilter,
  clockAgeFilterOptions,
  clockCarrierFilterOptions,
  clockComplianceAlerts,
  clockAlertSeverityClass,
  clockPriorityFilterOptions,
  clockProducerFilterOptions,
  clockSlaFilterOptions,
  clockStageFilterOptions,
  clockStageLabels,
  clockVaFilterOptions,
  computeClockSummaryCards,
  defaultClockFilters,
  formatDurationMs,
  getNextStageKey,
  loadClockOverrides,
  matchesClockFilters,
  matchesClockSearch,
  mergeClockRecords,
  saveClockOverrides,
  seedSubmissionClockRecords,
  slaHealthClass,
  type ClockFilters,
  type ClockRecordOverrides,
  type ClockSummaryCard,
  type SubmissionClockRecord,
} from "@/data/submissionClock";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import { computeLiveStageAge, SubmissionClockDrawer } from "./SubmissionClockDrawer";

function liveStageAge(record: SubmissionClockRecord, tickMs: number): string {
  if (record.slaPaused) return `${formatDurationMs(record.currentStageAgeMs)} (paused)`;
  const current = record.stages.find((s) => s.state === "current" || s.state === "delayed" || s.state === "blocked");
  if (!current?.timestampMs) return record.currentStageAge;
  return formatDurationMs(tickMs - current.timestampMs);
}

const vaOptions = ["JoJo", "Pedro", "Hamad", "Tracie"];
const producerOptions = ["Eva", "Tracie", "Sarah", "Kyle"];

export function SubmissionClockTab() {
  const toast = useToast();
  const { requirePermission, logAudit } = usePermissions();
  const [records, setRecords] = useState<SubmissionClockRecord[]>(seedSubmissionClockRecords);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ClockFilters>(defaultClockFilters);
  const [summaryFilter, setSummaryFilter] = useState<ClockSummaryCard["filterKey"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SubmissionClockRecord | null>(null);
  const [tickMs, setTickMs] = useState(() => Date.now());

  useEffect(() => {
    const overrides = loadClockOverrides();
    setRecords(mergeClockRecords(seedSubmissionClockRecords, overrides));
    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setTickMs(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const persistRecord = useCallback((updated: SubmissionClockRecord) => {
    setRecords((prev) => {
      const next = prev.map((r) => (r.id === updated.id ? updated : r));
      const overrides: ClockRecordOverrides = loadClockOverrides();
      overrides[updated.id] = {
        assignedVa: updated.assignedVa,
        assignedProducer: updated.assignedProducer,
        currentStage: updated.currentStage,
        currentStageKey: updated.currentStageKey,
        slaStatus: updated.slaStatus,
        internalNotes: updated.internalNotes,
        slaPaused: updated.slaPaused,
        stages: updated.stages,
      };
      saveClockOverrides(overrides);
      return next;
    });
    setSelected(updated);
  }, []);

  const filtered = useMemo(() => {
    let rows = records.filter((r) => matchesClockSearch(r, search) && matchesClockFilters(r, filters));
    if (summaryFilter) rows = applyClockSummaryFilter(rows, summaryFilter);
    return rows.sort((a, b) => b.totalAgeMs - a.totalAgeMs);
  }, [records, search, filters, summaryFilter]);

  const summaryCards = useMemo(() => computeClockSummaryCards(records), [records]);

  const handleAction = useCallback(
    (action: string, record: SubmissionClockRecord) => {
      let updated = { ...record };

      switch (action) {
        case "Reassign submission": {
          requirePermission("action:reassign-tasks", () => {
          const vaIdx = vaOptions.indexOf(record.assignedVa);
          const prodIdx = producerOptions.indexOf(record.assignedProducer);
          updated = {
            ...record,
            assignedVa: vaOptions[(vaIdx + 1) % vaOptions.length],
            assignedProducer: producerOptions[(prodIdx + 1) % producerOptions.length],
            internalNotes: [
              `Reassigned ${new Date().toLocaleString()} — VA and producer rotated by owner.`,
              ...record.internalNotes,
            ],
          };
          persistRecord(updated);
          toast.success(`Reassigned — ${record.clientName}`);
          });
          break;
        }
        case "Escalate stage": {
          requirePermission("action:escalate-queues", () => {
          updated = {
            ...record,
            slaStatus: record.slaStatus === "Healthy" ? "At Risk" : "Delayed",
            internalNotes: [
              `Stage escalated ${new Date().toLocaleString()} — ${record.currentStage} flagged for owner review.`,
              ...record.internalNotes,
            ],
          };
          persistRecord(updated);
          toast.warning(`Escalated — ${record.currentStage}`);
          });
          break;
        }
        case "Force move stage": {
          requirePermission("action:force-stage", () => {
          const nextKey = getNextStageKey(record.currentStageKey);
          if (!nextKey) {
            toast.error("Already at final stage.");
            return;
          }
          const nextLabel = clockStageLabels[nextKey];
          const nowMs = Date.now();
          const nowStr = new Date().toLocaleString();
          updated = {
            ...record,
            currentStageKey: nextKey,
            currentStage: nextLabel,
            stages: record.stages.map((s) => {
              if (s.key === record.currentStageKey) {
                return { ...s, state: "completed" as const, timestamp: nowStr, timestampMs: nowMs };
              }
              if (s.key === nextKey) {
                return { ...s, state: "current" as const, timestamp: nowStr, timestampMs: nowMs };
              }
              return s;
            }),
            internalNotes: [
              `Force moved to ${nextLabel} ${nowStr} by owner.`,
              ...record.internalNotes,
            ],
          };
          persistRecord(updated);
          logAudit("override-used", `Force stage — ${record.clientName} → ${nextLabel}`);
          toast.success(`Moved to ${nextLabel}`);
          });
          break;
        }
        case "Pause SLA": {
          requirePermission("action:force-stage", () => {
          const pausing = !record.slaPaused;
          updated = {
            ...record,
            slaPaused: pausing,
            internalNotes: [
              `${pausing ? "SLA paused" : "SLA resumed"} ${new Date().toLocaleString()} by owner.`,
              ...record.internalNotes,
            ],
          };
          persistRecord(updated);
          toast.info(pausing ? "SLA paused" : "SLA resumed");
          });
          break;
        }
        case "Add internal note": {
          requirePermission("action:add-notes", () => {
          updated = {
            ...record,
            internalNotes: [
              `Owner note ${new Date().toLocaleString()} — follow-up required on ${record.currentStage}.`,
              ...record.internalNotes,
            ],
          };
          persistRecord(updated);
          toast.success("Internal note added");
          });
          break;
        }
        case "View timeline":
          setSelected(record);
          return;
        default:
          toast.success(`${action} — ${record.clientName}`);
      }
    },
    [logAudit, persistRecord, requirePermission, toast],
  );

  const updateFilter = (key: keyof ClockFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSummaryFilter(null);
  };

  const selectedLiveAge = selected ? computeLiveStageAge(selected, tickMs) : "";

  return (
    <div className="submission-clock-view">
      <RoleTabHeader
        title="Submission Clock"
        subtitle="Time-based lifecycle tracker — stage accountability, SLA compliance, and bind velocity."
      />

      <section className="submission-clock-summary-strip" aria-label="Submission clock summary">
        {summaryCards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={cn("submission-clock-summary-card", summaryFilter === card.filterKey && "active")}
            onClick={() => setSummaryFilter((prev) => (prev === card.filterKey ? null : card.filterKey))}
          >
            <span className="submission-clock-summary-value">{card.value}</span>
            <span className="submission-clock-summary-label">{card.label}</span>
          </button>
        ))}
      </section>

      <section className="va-ops-panel submission-clock-alerts-panel" aria-label="Clock alerts">
        <div className="va-ops-panel-header">
          <h2 className="va-ops-section-title">SLA Alerts</h2>
          <p className="va-ops-section-sub">Submissions breaching time thresholds or stuck in stage.</p>
        </div>
        <ul className="submission-clock-alerts-list">
          {clockComplianceAlerts.map((alert) => (
            <li key={alert.id} className={cn("submission-clock-alert-item", alert.severity)}>
              <div className="submission-clock-alert-header">
                <span className={cn("badge", clockAlertSeverityClass[alert.severity])}>
                  {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                </span>
                <time>{alert.timestamp}</time>
              </div>
              <strong>{alert.title}</strong>
              <p>{alert.detail}</p>
              {alert.recordId && (
                <button
                  type="button"
                  className="submission-clock-alert-link"
                  onClick={() => {
                    const rec = records.find((r) => r.id === alert.recordId);
                    if (rec) setSelected(rec);
                  }}
                >
                  View submission
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="va-ops-panel" aria-label="Submission clock records">
        <div className="submission-clock-toolbar">
          <div className="send-center-search-wrap">
            <AppIcon name="search" size={16} strokeWidth={2} />
            <input
              type="search"
              placeholder="Search by client or submission ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search submissions"
            />
          </div>
          <div className="submission-clock-filter-row">
            {(
              [
                ["stage", clockStageFilterOptions],
                ["age", clockAgeFilterOptions],
                ["slaStatus", clockSlaFilterOptions],
                ["assignedVa", clockVaFilterOptions],
                ["assignedProducer", clockProducerFilterOptions],
                ["carrier", clockCarrierFilterOptions],
                ["priority", clockPriorityFilterOptions],
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
          <div className="send-center-skeleton" aria-busy="true" aria-label="Loading submission clock">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="send-center-skeleton-row" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="commercial-hub-empty-state" role="status">
            <div className="commercial-hub-empty-state-title">No submissions found</div>
            <p className="commercial-hub-empty-state-desc">
              {search || summaryFilter
                ? "Try adjusting your search or filters."
                : "No commercial submissions are being tracked yet."}
            </p>
          </div>
        ) : (
          <div className="commercial-hub-table-wrap">
            <table className="commercial-hub-table submission-clock-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Submission ID</th>
                  <th>Current Stage</th>
                  <th>Total Age</th>
                  <th>Current Stage Age</th>
                  <th>Assigned VA</th>
                  <th>Assigned Producer</th>
                  <th>SLA Status</th>
                  <th>Bind Probability</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const stageAge = liveStageAge(row, tickMs);
                  const isOverdue = row.slaStatus === "Overdue" || row.slaStatus === "Delayed";
                  return (
                    <tr
                      key={row.id}
                      className="commercial-hub-table-row-clickable"
                      onClick={() => setSelected(row)}
                    >
                      <td className="commercial-hub-client-cell">
                        <span className="submission-clock-client-cell">
                          {row.clientName}
                          {row.slaPaused && <span className="badge badge-yellow submission-clock-badge">Paused</span>}
                          {isOverdue && <span className="badge badge-red submission-clock-badge">Overdue</span>}
                        </span>
                      </td>
                      <td>{row.submissionId}</td>
                      <td>{row.currentStage}</td>
                      <td>{row.totalAge}</td>
                      <td className={cn(isOverdue && "submission-clock-overdue-text")}>{stageAge}</td>
                      <td><UserChip name={row.assignedVa} /></td>
                      <td><UserChip name={row.assignedProducer} /></td>
                      <td><span className={cn("badge", slaHealthClass[row.slaStatus])}>{row.slaStatus}</span></td>
                      <td>
                        <span className={cn("submission-clock-bind-prob", row.bindProbability >= 70 && "high")}>
                          {row.bindProbability}%
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="send-center-row-actions">
                          <button type="button" className="va-ops-action-btn" onClick={() => handleAction("View timeline", row)}>
                            Timeline
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="submission-clock-sla-rules">
          <AppIcon name="triangle-alert" size={16} strokeWidth={2} />
          <p>
            SLA targets: Intake 2h · Docs 24h · Carrier Response 48h · Producer Review 1h · Client Follow-up 24h.
            Submissions stuck &gt; 3 days, missing docs &gt; 24h, and carrier delays are flagged automatically.
          </p>
        </div>
      </section>

      <SubmissionClockDrawer
        record={selected}
        liveStageAge={selectedLiveAge}
        onClose={() => setSelected(null)}
        onAction={handleAction}
      />
    </div>
  );
}
