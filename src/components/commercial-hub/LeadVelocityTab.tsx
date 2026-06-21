"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  applyVelocitySummaryFilter,
  computeVelocitySummaryCards,
  dailyLeadSpeedTrend,
  defaultVelocityFilters,
  insightSeverityClass,
  loadVelocityOverrides,
  matchesVelocityFilters,
  matchesVelocitySearch,
  mergeVelocityRecords,
  monthlyBindSpeedTrend,
  saveVelocityOverrides,
  seedLeadVelocityRecords,
  speedRatingClass,
  velocityBottleneckInsights,
  velocityDateRangeOptions,
  velocityIndustryOptions,
  velocityProducerOptions,
  velocitySourceOptions,
  velocitySpeedOptions,
  velocityStateOptions,
  velocityStatusClass,
  velocityStatusOptions,
  velocityVaOptions,
  weeklyConversionTrend,
  type LeadVelocityRecord,
  type VelocityFilters,
  type VelocityRecordOverrides,
  type VelocitySummaryCard,
} from "@/data/leadVelocity";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import { ClientLanguageBadges } from "@/components/bilingual/ClientLanguageBadges";
import { getClientLanguage } from "@/data/bilingualClient";
import { LeadVelocityCharts } from "./LeadVelocityCharts";
import { LeadVelocityDrawer } from "./LeadVelocityDrawer";
import { useSyncBreadcrumbDetail } from "@/hooks/useSyncBreadcrumbDetail";

const vaOptions = ["JoJo", "Pedro", "Hamad", "Tracie"];
const producerOptions = ["Eva", "Tracie", "Sarah", "Kyle"];

export function LeadVelocityTab() {
  const toast = useToast();
  const { requirePermission, logAudit } = usePermissions();
  const [records, setRecords] = useState<LeadVelocityRecord[]>(seedLeadVelocityRecords);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<VelocityFilters>(defaultVelocityFilters);
  const [summaryFilter, setSummaryFilter] = useState<VelocitySummaryCard["filterKey"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<LeadVelocityRecord | null>(null);

  useSyncBreadcrumbDetail(selected?.leadName ?? null, {
    paramKey: "lead",
    paramValue: selected?.id,
    enabled: Boolean(selected),
  });

  useEffect(() => {
    const overrides = loadVelocityOverrides();
    setRecords(mergeVelocityRecords(seedLeadVelocityRecords, overrides));
    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  const persistRecord = useCallback((updated: LeadVelocityRecord) => {
    setRecords((prev) => {
      const next = prev.map((r) => (r.id === updated.id ? updated : r));
      const overrides: VelocityRecordOverrides = loadVelocityOverrides();
      overrides[updated.id] = {
        assignedVa: updated.assignedVa,
        assignedProducer: updated.assignedProducer,
        currentStatus: updated.currentStatus,
        conversionProbability: updated.conversionProbability,
        responseSpeed: updated.responseSpeed,
        priority: updated.priority,
        escalated: updated.escalated,
        internalNotes: updated.internalNotes,
        stages: updated.stages,
      };
      saveVelocityOverrides(overrides);
      return next;
    });
    setSelected(updated);
  }, []);

  const filtered = useMemo(() => {
    let rows = records.filter((r) => matchesVelocitySearch(r, search) && matchesVelocityFilters(r, filters));
    if (summaryFilter) rows = applyVelocitySummaryFilter(rows, summaryFilter);
    return rows.sort((a, b) => b.createdMs - a.createdMs);
  }, [records, search, filters, summaryFilter]);

  const summaryCards = useMemo(() => computeVelocitySummaryCards(records), [records]);

  const handleAction = useCallback(
    (action: string, record: LeadVelocityRecord) => {
      let updated = { ...record };

      switch (action) {
        case "Reassign lead": {
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
          toast.success(`Reassigned — ${record.leadName}`);
          });
          break;
        }
        case "Escalate priority": {
          requirePermission("action:escalate-queues", () => {
          updated = {
            ...record,
            priority: "High",
            escalated: true,
            internalNotes: [
              `Priority escalated ${new Date().toLocaleString()} — owner flagged for immediate follow-up.`,
              ...record.internalNotes,
            ],
          };
          persistRecord(updated);
          toast.warning(`Escalated — ${record.leadName}`);
          });
          break;
        }
        case "Trigger follow-up": {
          requirePermission("action:follow-up", () => {
          updated = {
            ...record,
            internalNotes: [
              `Follow-up triggered ${new Date().toLocaleString()} — owner requested outreach.`,
              ...record.internalNotes,
            ],
          };
          persistRecord(updated);
          toast.success(`Follow-up triggered — ${record.leadName}`);
          });
          break;
        }
        case "Override owner": {
          requirePermission("action:override-owner", () => {
          updated = {
            ...record,
            assignedProducer: "Eva",
            internalNotes: [
              `Owner override ${new Date().toLocaleString()} — Eva assigned as lead owner.`,
              ...record.internalNotes,
            ],
          };
          persistRecord(updated);
          logAudit("override-used", `Owner override — ${record.leadName}`);
          toast.success(`Owner override applied — ${record.leadName}`);
          });
          break;
        }
        case "Mark lost": {
          requirePermission("action:force-stage", () => {
          const nowStr = new Date().toLocaleString();
          updated = {
            ...record,
            currentStatus: "Lost",
            conversionProbability: 0,
            internalNotes: [`Marked lost ${nowStr} by owner.`, ...record.internalNotes],
            stages: record.stages.map((s) =>
              s.key === "bound-lost"
                ? { ...s, state: "lost" as const, timestamp: nowStr, timestampMs: Date.now() }
                : s.state === "current"
                  ? { ...s, state: "completed" as const }
                  : s,
            ),
          };
          persistRecord(updated);
          toast.warning(`Marked lost — ${record.leadName}`);
          });
          break;
        }
        case "View timeline":
          setSelected(record);
          return;
        default:
          toast.success(`${action} — ${record.leadName}`);
      }
    },
    [logAudit, persistRecord, requirePermission, toast],
  );

  const updateFilter = (key: keyof VelocityFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSummaryFilter(null);
  };

  return (
    <div className="lead-velocity-view">
      <RoleTabHeader
        title="Lead Velocity"
        subtitle="Lead-to-bind speed tracking — first contact, quote velocity, conversion, and bottleneck insights."
      />

      <section className="lead-velocity-summary-strip" aria-label="Lead velocity summary">
        {summaryCards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={cn("lead-velocity-summary-card", summaryFilter === card.filterKey && "active")}
            onClick={() => setSummaryFilter((prev) => (prev === card.filterKey ? null : card.filterKey))}
          >
            <span className="lead-velocity-summary-value">{card.value}</span>
            <span className="lead-velocity-summary-label">{card.label}</span>
          </button>
        ))}
      </section>

      <section className="va-ops-panel lead-velocity-insights-panel" aria-label="Bottleneck insights">
        <div className="va-ops-panel-header">
          <h2 className="va-ops-section-title">
            <AppIcon name="sparkles" size={16} strokeWidth={2} /> Bottleneck Insights
          </h2>
          <p className="va-ops-section-sub">AI-detected speed and conversion patterns across the pipeline.</p>
        </div>
        <ul className="lead-velocity-insights-list">
          {velocityBottleneckInsights.map((insight) => (
            <li key={insight.id} className={cn("lead-velocity-insight-card", insight.severity)}>
              <span className={cn("badge", insightSeverityClass[insight.severity])}>
                {insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)}
              </span>
              <strong>{insight.title}</strong>
              <p>{insight.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <LeadVelocityCharts
        dailySpeed={dailyLeadSpeedTrend}
        weeklyConversion={weeklyConversionTrend}
        monthlyBind={monthlyBindSpeedTrend}
      />

      <section className="va-ops-panel" aria-label="Lead velocity pipeline">
        <div className="lead-velocity-toolbar">
          <div className="send-center-search-wrap">
            <AppIcon name="search" size={16} strokeWidth={2} />
            <input
              type="search"
              placeholder="Search by lead or business…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search leads"
            />
          </div>
          <div className="lead-velocity-filter-row">
            {(
              [
                ["leadSource", velocitySourceOptions],
                ["assignedVa", velocityVaOptions],
                ["assignedProducer", velocityProducerOptions],
                ["status", velocityStatusOptions],
                ["responseSpeed", velocitySpeedOptions],
                ["dateRange", velocityDateRangeOptions],
                ["industry", velocityIndustryOptions],
                ["state", velocityStateOptions],
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
          <div className="send-center-skeleton" aria-busy="true" aria-label="Loading lead velocity">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="send-center-skeleton-row" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="commercial-hub-empty-state" role="status">
            <div className="commercial-hub-empty-state-title">No leads found</div>
            <p className="commercial-hub-empty-state-desc">
              {search || summaryFilter
                ? "Try adjusting your search or filters."
                : "No commercial leads are being tracked yet."}
            </p>
          </div>
        ) : (
          <div className="commercial-hub-table-wrap">
            <table className="commercial-hub-table lead-velocity-table">
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Business Name</th>
                  <th>Assigned VA</th>
                  <th>Assigned Producer</th>
                  <th>Lead Source</th>
                  <th>First Response</th>
                  <th>Time to Intake</th>
                  <th>Time to Quote</th>
                  <th>Time to Proposal</th>
                  <th>Total Cycle</th>
                  <th>Current Status</th>
                  <th>Conversion Prob.</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const isSlow = row.responseSpeed === "Slow" || row.responseSpeed === "At Risk";
                  return (
                    <tr
                      key={row.id}
                      className="commercial-hub-table-row-clickable"
                      onClick={() => setSelected(row)}
                    >
                      <td className="commercial-hub-client-cell">
                        <span className="lead-velocity-lead-cell">
                          {row.leadName}
                          <ClientLanguageBadges profile={getClientLanguage(row.businessName)} compact />
                          {row.escalated && <span className="badge badge-red lead-velocity-badge">Escalated</span>}
                          {isSlow && <span className="badge badge-yellow lead-velocity-badge">{row.responseSpeed}</span>}
                        </span>
                      </td>
                      <td>{row.businessName}</td>
                      <td>
                        <UserChip name={row.assignedVa} />
                      </td>
                      <td>
                        <UserChip name={row.assignedProducer} />
                      </td>
                      <td>{row.leadSource}</td>
                      <td className={cn(isSlow && "lead-velocity-slow-text")}>{row.firstResponseTime || "—"}</td>
                      <td>{row.timeToIntake || "—"}</td>
                      <td>{row.timeToQuote || "—"}</td>
                      <td>{row.timeToProposal || "—"}</td>
                      <td>{row.totalCycleTime}</td>
                      <td>
                        <span className={cn("badge", velocityStatusClass[row.currentStatus])}>{row.currentStatus}</span>
                      </td>
                      <td>
                        <span className={cn("lead-velocity-conversion", row.conversionProbability >= 70 && "high")}>
                          {row.conversionProbability}%
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="send-center-row-actions">
                          <button
                            type="button"
                            className="va-ops-action-btn"
                            onClick={() => handleAction("View timeline", row)}
                          >
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

        <div className="lead-velocity-benchmarks-footer">
          <AppIcon name="triangle-alert" size={16} strokeWidth={2} />
          <p>
            Speed benchmarks: First Contact &lt; 15 mins · Intake Start &lt; 2h · Quote &lt; 24h · Proposal &lt; 48h ·
            Bind &lt; 7 days. Ratings: Fast, Normal, Slow, At Risk.
          </p>
        </div>
      </section>

      <LeadVelocityDrawer record={selected} onClose={() => setSelected(null)} onAction={handleAction} />
    </div>
  );
}
