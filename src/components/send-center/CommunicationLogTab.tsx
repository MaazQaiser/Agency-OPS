"use client";

import { useMemo, useState } from "react";
import {
  commLogTypeClass,
  communicationLogEntries,
  matchesSendCenterSearch,
  type CommLogEventType,
} from "@/data/sendCenter";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { resolveDisplayStatus } from "@/lib/dataState";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { cn } from "@/lib/cn";
import { SendCenterTableSkeleton } from "./SendCenterFilters";
import { AppIcon } from "@/components/ui/AppIcon";

type CommunicationLogTabProps = {
  onToast?: (message: string) => void;
};

export function CommunicationLogTab({ onToast: _onToast }: CommunicationLogTabProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Events");
  const {
    status: loadStatus,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => communicationLogEntries,
    errorPreset: "supabase-timeout",
  });
  const status = resolveDisplayStatus(loadStatus, communicationLogEntries, (d) => d.length === 0);

  const filtered = useMemo(
    () =>
      communicationLogEntries.filter((entry) => {
        const haystack = [entry.client, entry.subject, entry.actor, entry.detail, entry.type].join(" ");
        const typeMatch = typeFilter === "All Events" || entry.type === typeFilter;
        return typeMatch && matchesSendCenterSearch(haystack, search);
      }),
    [search, typeFilter],
  );

  return (
    <div className="va-ops-role-view send-center-tab">
      <RoleTabHeader
        title="Communication Log"
        subtitle="Full timeline of proposal communications: sent, viewed, replied, escalated, and follow-ups."
      />

      <div className="send-center-filters">
        <label className="va-ops-search send-center-search" aria-label="Search communication log">
          <AppIcon name="search" size={16} strokeWidth={2} className="va-ops-search-icon" />
          <input
            type="search"
            className="va-ops-search-input"
            placeholder="Search client, subject, actor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="send-center-filter-row">
          <label className="send-center-filter">
            <span className="send-center-filter-label">Event Type</span>
            <select
              className="header-filter-select send-center-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All Events">All Events</option>
              {(["Sent", "Viewed", "Replied", "Escalated", "Follow-up"] as CommLogEventType[]).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <section className="va-ops-panel" aria-label="Communication timeline">
        <DataStateView
          status={status}
          lastSyncedAt={lastSyncedAt}
          isStale={isStale}
          showFreshness={false}
          loading={<SendCenterTableSkeleton rows={5} />}
          empty={
            <HubEmptyState
              title="No communication events"
              description="Proposal activity will be logged here as clients engage."
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
              description="No events match your search or event type filter. Try clearing filters or broadening your search."
              compact
            />
          ) : (
            <ol className="send-center-timeline">
              {filtered.map((entry) => (
              <li key={entry.id} className="send-center-timeline-item">
                <div className="send-center-timeline-dot" aria-hidden="true" />
                <div className="send-center-timeline-content">
                  <div className="send-center-timeline-header">
                    <span className={cn("badge", commLogTypeClass[entry.type])}>{entry.type}</span>
                    <span className="send-center-timeline-client">{entry.client}</span>
                    <span className="send-center-timeline-time">{entry.timestamp}</span>
                  </div>
                  <div className="send-center-timeline-subject">{entry.subject}</div>
                  <div className="send-center-timeline-detail">{entry.detail}</div>
                  <div className="send-center-timeline-actor">by {entry.actor}</div>
                </div>
              </li>
            ))}
          </ol>
          )}
        </DataStateView>
      </section>
    </div>
  );
}
