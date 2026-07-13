"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { SectionLabel } from "@/components/ui/PageHeader";
import { TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useRetentionLocale } from "@/components/retention/RetentionLanguageProvider";
import { useHubDataState } from "@/hooks/useHubDataState";

export function AgencyZoomSection() {
  const { copy } = useRetentionLocale();
  const { agencyZoom } = copy;

  const { status, retry, lastSyncedAt, isStale, retrying } = useHubDataState({
    load: () => agencyZoom.pipelines,
    errorPreset: "agencyzoom-unavailable",
  });

  return (
    <>
      <SectionLabel>{agencyZoom.section}</SectionLabel>

      <div className="alert alert-amber aos-card--action">
        <div className="alert-title alert-title-with-icon">
          <AppIcon name="triangle-alert" size={14} strokeWidth={2.25} />
          {agencyZoom.alertTitle}
        </div>
        <p>{agencyZoom.alertBody}</p>
      </div>

      <DataStateView
        status={status}
        lastSyncedAt={lastSyncedAt}
        isStale={isStale}
        showFreshness={false}
        loading={<TableSkeleton rows={4} columns={4} />}
        empty={<HubEmptyState preset="retention-records" />}
        error={
          <HubErrorState
            preset="agencyzoom-unavailable"
            onRetry={retry}
            retrying={retrying}
            lastSyncedAt={lastSyncedAt}
          />
        }
      >
        <div className="retention-table-wrap">
          <table className="retention">
            <thead>
              <tr>
                {agencyZoom.headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agencyZoom.pipelines.map((row) => (
                <tr key={row.pipeline}>
                  <td>{row.pipeline}</td>
                  <td>{row.owner}</td>
                  <td>{row.automation}</td>
                  <td>{row.monday}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataStateView>
    </>
  );
}
