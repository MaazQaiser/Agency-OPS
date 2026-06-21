"use client";

import { useCallback, useState } from "react";
import { formatCarrierAging, trackerFollowUpQueue } from "@/data/submissionTracker";
import { TableSkeleton } from "@/components/shared/loading";
import { useCrossModuleHandoff } from "@/hooks/useCrossModuleHandoff";
import { useTabLoading } from "@/hooks/useTabLoading";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";
import { CommercialHubEmptyState } from "./CommercialHubEmptyState";

const followUpStatusClass: Record<string, string> = {
  "Due Today": "badge-red",
  "Due Tomorrow": "badge-yellow",
  Stale: "badge-red",
  "No Response": "badge-yellow",
};

export function CarrierFollowUpTab() {
  const loading = useTabLoading();
  const toast = useToast();
  const [highlightCarrier, setHighlightCarrier] = useState<string | null>(null);

  const onCarrierHandoff = useCallback((payload: Record<string, string | undefined>) => {
    const carrierName = payload.carrierName ?? "";
    setHighlightCarrier(carrierName);
    toast.info(
      `Carrier loaded — ${carrierName}${payload.appetite ? ` · ${payload.appetite}` : ""}`,
    );
  }, [toast]);

  useCrossModuleHandoff("carrier-to-followup", onCarrierHandoff);

  if (loading) {
    return (
      <div className="va-ops-role-view submission-ops-queue">
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="va-ops-role-view submission-ops-queue">
      <section className="submission-follow-up-panel" aria-label="Carrier follow-up queue">
        <div className="submission-queue-header">
          <h3 className="va-ops-section-title">Carrier Follow-Up Queue</h3>
          <p className="va-ops-section-sub">
            Track stale markets and carrier response discipline.
          </p>
        </div>
        <div className="commercial-hub-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Carrier</th>
                <th>Client</th>
                <th>Aging</th>
                <th>Follow-Up Due</th>
                <th>Assigned VA</th>
                <th>Status</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {trackerFollowUpQueue.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <CommercialHubEmptyState
                      title="No carrier follow-ups due"
                      description="All markets are within response SLA — nothing to chase right now."
                    />
                  </td>
                </tr>
              ) : (
                trackerFollowUpQueue.map((item) => (
                <tr
                  key={item.id}
                  className={cn(
                    highlightCarrier && item.carrier === highlightCarrier && "submission-tracker-row-expanded",
                  )}
                >
                  <td>{item.carrier}</td>
                  <td className="commercial-hub-client-cell">{item.client}</td>
                  <td className="submission-carrier-aging">
                    {formatCarrierAging(item.daysSinceSent, item.followUpCount)}
                  </td>
                  <td>{item.due}</td>
                  <td>{item.assigned}</td>
                  <td>
                    <span className={cn("badge", followUpStatusClass[item.status] ?? "badge-yellow")}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="va-ops-action-btn">{item.action}</button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
