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
import { ExportMenu } from "@/components/export/ExportMenu";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import { ClientLanguageBadges } from "@/components/bilingual/ClientLanguageBadges";
import { getClientLanguage } from "@/data/bilingualClient";
import { LeadVelocityCharts } from "./LeadVelocityCharts";
import { LeadSourceChip } from "./LeadSourceChip";
import { LeadVelocityDrawer } from "./LeadVelocityDrawer";
import { TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { useSyncBreadcrumbDetail } from "@/hooks/useSyncBreadcrumbDetail";
import type { DataStatus } from "@/lib/dataState";
import { commercialHubTabHeaders } from "@/data/commercialHubTabHeaders";
import { velocitySummaryToKpis } from "@/lib/commercialHubTabKpis";
import {
  CommercialHubIntelPanel,
  CommercialHubKpiStrip,
  CommercialHubTabFooter,
  CommercialHubTabHeader,
  CommercialHubTabShell,
  CommercialHubWorkspace,
} from "./CommercialHubTabLayout";

const vaOptions = ["JoJo", "Pedro", "Hamad", "Tracie"];
const producerOptions = ["Eva", "Tracie", "Sarah", "Kyle"];

export function LeadVelocityTab() {
  const toast = useToast();
  const { requirePermission, logAudit } = usePermissions();
  const [records, setRecords] = useState<LeadVelocityRecord[]>(seedLeadVelocityRecords);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<VelocityFilters>(defaultVelocityFilters);
  const [summaryFilter, setSummaryFilter] = useState<VelocitySummaryCard["filterKey"] | null>(null);
  const [selected, setSelected] = useState<LeadVelocityRecord | null>(null);

  const {
    status: loadStatus,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
    data: hydratedRecords,
  } = useHubDataState({
    load: () => {
      const overrides = loadVelocityOverrides();
      return mergeVelocityRecords(seedLeadVelocityRecords, overrides);
    },
    errorPreset: "agencyzoom-unavailable",
  });

  useEffect(() => {
    if (hydratedRecords) setRecords(hydratedRecords);
  }, [hydratedRecords]);

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

  useSyncBreadcrumbDetail(selected?.leadName ?? null, {
    paramKey: "lead",
    paramValue: selected?.id,
    enabled: Boolean(selected),
  });

  const tableStatus: DataStatus =
    loadStatus === "loading" || loadStatus === "error"
      ? loadStatus
      : filtered.length === 0
        ? "empty"
        : "success";

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
              `Reassigned ${new Date().toLocaleString()}: VA and producer rotated by owner.`,
              ...record.internalNotes,
            ],
          };
          persistRecord(updated);
          toast.success(`Reassigned: ${record.leadName}`);
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
              `Priority escalated ${new Date().toLocaleString()}: owner flagged for immediate follow-up.`,
              ...record.internalNotes,
            ],
          };
          persistRecord(updated);
          toast.warning(`Escalated: ${record.leadName}`);
          });
          break;
        }
        case "Trigger follow-up": {
          requirePermission("action:follow-up", () => {
          updated = {
            ...record,
            internalNotes: [
              `Follow-up triggered ${new Date().toLocaleString()}: owner requested outreach.`,
              ...record.internalNotes,
            ],
          };
          persistRecord(updated);
          toast.success(`Follow-up triggered: ${record.leadName}`);
          });
          break;
        }
        case "Override owner": {
          requirePermission("action:override-owner", () => {
          updated = {
            ...record,
            assignedProducer: "Eva",
            internalNotes: [
              `Owner override ${new Date().toLocaleString()}: Eva assigned as lead owner.`,
              ...record.internalNotes,
            ],
          };
          persistRecord(updated);
          logAudit("override-used", `Owner override: ${record.leadName}`);
          toast.success(`Owner override applied: ${record.leadName}`);
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
          toast.warning(`Marked lost: ${record.leadName}`);
          });
          break;
        }
        case "View timeline":
          setSelected(record);
          return;
        default:
          toast.success(`${action}: ${record.leadName}`);
      }
    },
    [logAudit, persistRecord, requirePermission, toast],
  );

  const updateFilter = (key: keyof VelocityFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSummaryFilter(null);
  };

  return (
    <CommercialHubTabShell className="lead-velocity-view">
      <CommercialHubTabHeader
        title={commercialHubTabHeaders["lead-velocity"].title}
        subtitle={commercialHubTabHeaders["lead-velocity"].subtitle}
        utilities={<ExportMenu kind="lead-velocity" />}
      />

      <CommercialHubKpiStrip kpis={velocitySummaryToKpis(summaryCards)} columns={6} />

      <CommercialHubWorkspace
        ariaLabel="Lead velocity pipeline"
        title="Lead Pipeline"
        subtitle="Lead-to-bind speed across intake, quote, and proposal stages."
        toolbar={
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
        }
      >
        <DataStateView
          status={tableStatus}
          lastSyncedAt={lastSyncedAt}
          isStale={isStale}
          showFreshness={false}
          loading={<TableSkeleton rows={6} columns={8} />}
          empty={
            <HubEmptyState
              preset="commercial-submissions"
              title={search || summaryFilter ? "No leads match your filters" : undefined}
              description={
                search || summaryFilter
                  ? "Try adjusting your search or summary filters."
                  : undefined
              }
            />
          }
          error={
            <HubErrorState
              preset="agencyzoom-unavailable"
              onRetry={retry}
              retrying={retrying}
              lastSyncedAt={lastSyncedAt}
            />
          }
        >
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table lead-velocity-table">
              <thead>
                <tr>
                  <th>Current Status</th>
                  <th>Assigned VA</th>
                  <th>Assigned Producer</th>
                  <th>First Response</th>
                  <th>Total Cycle</th>
                  <th>Conversion Prob.</th>
                  <th>Lead Name</th>
                  <th>Business Name</th>
                  <th>Lead Source</th>
                  <th>Time to Intake</th>
                  <th>Time to Quote</th>
                  <th>Time to Proposal</th>
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
                      <td>
                        <span className={cn("badge", velocityStatusClass[row.currentStatus])}>{row.currentStatus}</span>
                      </td>
                      <td>
                        <UserChip name={row.assignedVa} />
                      </td>
                      <td>
                        <UserChip name={row.assignedProducer} />
                      </td>
                      <td className={cn(isSlow && "lead-velocity-slow-text")}>{row.firstResponseTime || "-"}</td>
                      <td>{row.totalCycleTime}</td>
                      <td>
                        <span className={cn("lead-velocity-conversion", row.conversionProbability >= 70 && "high")}>
                          {row.conversionProbability}%
                        </span>
                      </td>
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
                        <LeadSourceChip source={row.leadSource} />
                      </td>
                      <td>{row.timeToIntake || "-"}</td>
                      <td>{row.timeToQuote || "-"}</td>
                      <td>{row.timeToProposal || "-"}</td>
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
        </DataStateView>
      </CommercialHubWorkspace>

      <CommercialHubIntelPanel title="Bottleneck Insights" subtitle="AI-detected speed and conversion patterns across the pipeline." className="commercial-hub-intel-tall">
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
        <LeadVelocityCharts
          dailySpeed={dailyLeadSpeedTrend}
          weeklyConversion={weeklyConversionTrend}
          monthlyBind={monthlyBindSpeedTrend}
        />
      </CommercialHubIntelPanel>

      <CommercialHubTabFooter title="Speed Benchmarks" subtitle="Target thresholds for lead-to-bind velocity.">
        <div className="lead-velocity-benchmarks-footer">
          <AppIcon name="triangle-alert" size={16} strokeWidth={2} />
          <p>
            Speed benchmarks: First Contact &lt; 15 mins · Intake Start &lt; 2h · Quote &lt; 24h · Proposal &lt; 48h ·
            Bind &lt; 7 days. Ratings: Fast, Normal, Slow, At Risk.
          </p>
        </div>
      </CommercialHubTabFooter>

      <LeadVelocityDrawer record={selected} onClose={() => setSelected(null)} onAction={handleAction} />
    </CommercialHubTabShell>
  );
}
