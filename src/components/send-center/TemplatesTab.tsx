"use client";

import { useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  matchesSendCenterSearch,
  sendCenterAiInsights,
  templatePerformanceCards,
  templateRecords,
  type TemplateRecord,
} from "@/data/sendCenter";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { resolveDisplayStatus } from "@/lib/dataState";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { SendCenterAiInsight } from "./SendCenterAiInsight";
import {
  SendCenterFilters,
  useSendCenterFilters,
} from "./SendCenterFilters";

type TemplatesTabProps = {
  onToast: (message: string, variant?: "success" | "error") => void;
};

export function TemplatesTab({ onToast }: TemplatesTabProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useSendCenterFilters();
  const {
    status: loadStatus,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => templateRecords,
    errorPreset: "supabase-timeout",
  });
  const status = resolveDisplayStatus(loadStatus, templateRecords, (d) => d.length === 0);

  const filtered = useMemo(
    () =>
      templateRecords.filter((tpl) => {
        const haystack = [tpl.name, tpl.type, tpl.description].join(" ");
        return matchesSendCenterSearch(haystack, search);
      }),
    [search],
  );

  const maxUsage = Math.max(...templateRecords.map((t) => t.usageCount));

  const updateFilter = () => {};

  const handleAction = (action: string, tpl: TemplateRecord) => {
    if (action === "Edit") {
      onToast(`Editing template: ${tpl.name}`);
      return;
    }
    if (action === "Duplicate") {
      onToast(`Template duplicated: ${tpl.name}`, "success");
      return;
    }
    if (action === "Use Template") {
      onToast(`New draft started from ${tpl.name}`, "success");
    }
  };

  return (
    <div className="va-ops-role-view send-center-tab">
      <RoleTabHeader
        title="Templates"
        subtitle="Reusable proposal templates: edit, duplicate, or start a new draft."
        quickActions={[{ id: "new-template", label: "New Template", icon: "plus" }]}
        onQuickActionClick={() => onToast("Template builder opened")}
      />

      <SendCenterAiInsight
        insights={sendCenterAiInsights.templates}
        onAction={(actionId) => onToast(`AI action: ${actionId.replace(/-/g, " ")}`, "success")}
      />

      <section className="send-center-template-performance" aria-label="Template performance">
        <div className="send-center-template-perf-grid">
          {templatePerformanceCards.map((card) => (
            <article key={card.id} className="va-ops-kpi-card primary send-center-template-perf-card">
              <div className="va-ops-kpi-label">{card.label}</div>
              <div className="send-center-template-perf-value">{card.value}</div>
              <div className="va-ops-kpi-helper">{card.metric}</div>
            </article>
          ))}
        </div>
      </section>

      <SendCenterFilters
        search={search}
        onSearchChange={setSearch}
        placeholder="Search template name or type..."
        filters={filters}
        onFilterChange={updateFilter}
        filterKeys={[]}
      />

      <section className="va-ops-panel" aria-label="Proposal templates">
        <DataStateView
          status={status}
          lastSyncedAt={lastSyncedAt}
          isStale={isStale}
          showFreshness={false}
          loading={
            <div className="send-center-template-skeleton-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="send-center-template-skeleton-card" />
              ))}
            </div>
          }
          empty={
            <HubEmptyState
              preset="generic-list"
              title="No templates found"
              description="Create a template or adjust your search."
              onAction={() => onToast("Template builder opened")}
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
          {filtered.length === 0 ? (
            <HubEmptyState
              title="No matches"
              description="No templates match your search. Try clearing filters or broadening your search."
              compact
            />
          ) : (
            <div className="send-center-template-grid">
              {filtered.map((tpl) => (
              <article key={tpl.id} className="send-center-template-card">
                <div className="send-center-template-card-header">
                  <AppIcon name="folder" size={20} strokeWidth={2} className="send-center-template-icon" />
                  <div>
                    <h3 className="send-center-template-name">{tpl.name}</h3>
                    <span className="badge badge-blue">{tpl.type}</span>
                  </div>
                </div>
                <p className="send-center-template-desc">{tpl.description}</p>
                <div className="send-center-template-stats">
                  <div className="send-center-template-stat">
                    <span className="send-center-template-stat-label">Usage</span>
                    <div className="send-center-template-usage-bar">
                      <span
                        className="send-center-template-usage-fill"
                        style={{ width: `${(tpl.usageCount / maxUsage) * 100}%` }}
                      />
                    </div>
                    <span className="send-center-template-stat-value">{tpl.usageCount} sends</span>
                  </div>
                  <div className="send-center-template-stat">
                    <span className="send-center-template-stat-label">Conversion</span>
                    <span className="send-center-template-stat-value">{tpl.conversionRate}%</span>
                  </div>
                  <div className="send-center-template-stat">
                    <span className="send-center-template-stat-label">Last used</span>
                    <span className="send-center-template-stat-value">{tpl.lastUsed}</span>
                  </div>
                </div>
                <div className="send-center-template-meta">Last updated {tpl.lastUpdated}</div>
                <div className="send-center-template-actions">
                  {(["Edit", "Duplicate", "Use Template"] as const).map((action) => (
                    <button
                      key={action}
                      type="button"
                      className="va-ops-action-btn"
                      onClick={() => handleAction(action, tpl)}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
          )}
        </DataStateView>
      </section>
    </div>
  );
}
