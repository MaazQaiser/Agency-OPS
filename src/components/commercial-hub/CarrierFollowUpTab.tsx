"use client";

import { useCallback, useState } from "react";
import {
  formatCarrierAging,
  trackerFollowUpQueue,
  formatCarrierResponseSla,
  carrierSlaStatusClass,
} from "@/data/submissionTracker";
import { TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { useCrossModuleHandoff } from "@/hooks/useCrossModuleHandoff";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";
import { ExportMenu } from "@/components/export/ExportMenu";
import { commercialHubTabHeaders } from "@/data/commercialHubTabHeaders";
import { carrierFollowUpTabKpis } from "@/lib/commercialHubTabKpis";
import {
  CommercialHubIntelPanel,
  CommercialHubKpiStrip,
  CommercialHubTabFooter,
  CommercialHubTabHeader,
  CommercialHubTabShell,
  CommercialHubWorkspace,
} from "./CommercialHubTabLayout";

const followUpStatusClass: Record<string, string> = {
  "Due Today": "badge-red",
  "Due Tomorrow": "badge-yellow",
  Stale: "badge-red",
  "No Response": "badge-yellow",
};

export function CarrierFollowUpTab() {
  const toast = useToast();
  const [highlightCarrier, setHighlightCarrier] = useState<string | null>(null);
  const header = commercialHubTabHeaders["follow-ups"];

  const {
    status,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => trackerFollowUpQueue,
    errorPreset: "agencyzoom-unavailable",
  });

  const onCarrierHandoff = useCallback((payload: Record<string, string | undefined>) => {
    const carrierName = payload.carrierName ?? "";
    setHighlightCarrier(carrierName);
    toast.info(
      `Carrier loaded: ${carrierName}${payload.appetite ? ` · ${payload.appetite}` : ""}`,
    );
  }, [toast]);

  useCrossModuleHandoff("carrier-to-followup", onCarrierHandoff);

  const breached = trackerFollowUpQueue.filter((item) => item.slaStatus === "Breached");

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <CommercialHubTabShell className="submission-ops-queue">
          <TableSkeleton rows={5} />
        </CommercialHubTabShell>
      }
      empty={<HubEmptyState preset="commercial-follow-ups" />}
      error={
        <HubErrorState
          preset="agencyzoom-unavailable"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      }
    >
      <CommercialHubTabShell className="submission-ops-queue">
        <CommercialHubTabHeader
          title={header.title}
          subtitle={header.subtitle}
          utilities={<ExportMenu kind="carrier-response" compact />}
        />

        <CommercialHubKpiStrip kpis={carrierFollowUpTabKpis()} columns={5} />

        <CommercialHubWorkspace
          ariaLabel="Carrier follow-up queue"
          title="Carrier Follow-Up Queue"
          subtitle="Status, owner, SLA timing, and next action for every open market."
        >
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Assigned VA</th>
                  <th>Follow-Up Due</th>
                  <th>Response SLA</th>
                  <th>Carrier</th>
                  <th>Client</th>
                  <th>Aging</th>
                  <th aria-label="Action" />
                </tr>
              </thead>
              <tbody>
                {trackerFollowUpQueue.map((item) => (
                  <tr
                    key={item.id}
                    className={cn(
                      highlightCarrier && item.carrier === highlightCarrier && "submission-tracker-row-expanded",
                    )}
                  >
                    <td>
                      <span className={cn("badge", followUpStatusClass[item.status] ?? "badge-yellow")}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.assigned}</td>
                    <td>{item.due}</td>
                    <td>
                      <div className="carrier-sla-cell">
                        <span className={cn("badge", carrierSlaStatusClass[item.slaStatus])}>
                          {item.slaStatus}
                        </span>
                        <span className="carrier-sla-timing">{formatCarrierResponseSla(item)}</span>
                      </div>
                    </td>
                    <td>{item.carrier}</td>
                    <td className="commercial-hub-client-cell">{item.client}</td>
                    <td className="submission-carrier-aging">
                      {formatCarrierAging(item.daysSinceSent, item.followUpCount)}
                    </td>
                    <td>
                      <button type="button" className="va-ops-action-btn primary">{item.action}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CommercialHubWorkspace>

        <CommercialHubIntelPanel
          title="SLA Breaches"
          subtitle="Markets past carrier response target: escalate immediately."
        >
          {breached.length === 0 ? (
            <p className="va-ops-section-sub">No active SLA breaches.</p>
          ) : (
            <ul className="va-ops-gap-list">
              {breached.map((item) => (
                <li key={item.id}>
                  <strong>{item.carrier}</strong> · {item.client} · {formatCarrierResponseSla(item)} · {item.assigned}
                </li>
              ))}
            </ul>
          )}
        </CommercialHubIntelPanel>

        <CommercialHubTabFooter
          title="Follow-Up Cadence"
          subtitle="Carrier response discipline and broker accountability."
        >
          <p className="va-ops-section-sub">
            48h standard response target · Escalate after two follow-ups with no carrier movement.
          </p>
        </CommercialHubTabFooter>
      </CommercialHubTabShell>
    </DataStateView>
  );
}
