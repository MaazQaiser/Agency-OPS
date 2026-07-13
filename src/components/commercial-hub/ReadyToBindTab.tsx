"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  readyToBindQueue as initialReadyToBindQueue,
  readyToBindStateLabels,
  paymentStatusClass,
  type ReadyToBindItem,
} from "@/data/submissionTracker";
import { crossModuleRoutes, resolveProposalId } from "@/lib/crossModuleLinks";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { resolveDisplayStatus } from "@/lib/dataState";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import { commercialHubTabHeaders } from "@/data/commercialHubTabHeaders";
import { readyToBindTabKpis } from "@/lib/commercialHubTabKpis";
import {
  CommercialHubIntelPanel,
  CommercialHubKpiStrip,
  CommercialHubTabFooter,
  CommercialHubTabHeader,
  CommercialHubTabShell,
  CommercialHubWorkspace,
} from "./CommercialHubTabLayout";
import { BindPolicyConfirmModal } from "./BindPolicyConfirmModal";
import { FarmersEdgeIntelTrigger } from "./FarmersEdgeIntelTrigger";
import { buildFarmersEdgeIntelRequest } from "@/lib/farmersEdgeIntel";

const bindStateClass: Record<ReadyToBindItem["bindState"], string> = {
  "awaiting-signed-app": "commercial-bind-state--signature",
  "awaiting-payment": "commercial-bind-state--payment",
  "awaiting-producer-check": "commercial-bind-state--blocked",
  "ready-to-issue": "commercial-bind-state--ready",
};

export function ReadyToBindTab() {
  const router = useRouter();
  const toast = useToast();
  const { can, requirePermission } = usePermissions();
  const canBindPolicy = can("action:bind-policy");
  const [queue, setQueue] = useState(initialReadyToBindQueue);
  const [confirmItem, setConfirmItem] = useState<ReadyToBindItem | null>(null);
  const header = commercialHubTabHeaders["ready-to-bind"];

  const {
    status: loadStatus,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => initialReadyToBindQueue,
    errorPreset: "agencyzoom-unavailable",
  });

  const status = resolveDisplayStatus(loadStatus, queue, (d) => d.length === 0);

  const viewProposal = (item: ReadyToBindItem) => {
    const proposalId = resolveProposalId(item.client);
    if (!proposalId) return;
    router.push(
      crossModuleRoutes.sendCenterProposal(proposalId, "approved", {
        href: `${routes.commercialHub}?view=ready-to-bind`,
        label: "Ready to Bind",
      }),
    );
  };
  const canBind = (item: ReadyToBindItem) =>
    item.producerApproved && item.bindState === "ready-to-issue";

  const handleConfirmBind = async (item: ReadyToBindItem) => {
    const toastId = toast.processing("Binding policy…");
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    setQueue((prev) => prev.filter((row) => row.id !== item.id));
    setConfirmItem(null);
    toast.update(toastId, toastMessages.commercialHub.readyToBind, "success");
  };

  const paymentPending = queue.filter(
    (item) => item.paymentStatus === "Pending" || item.paymentStatus === "Not Sent",
  );

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
      empty={<HubEmptyState preset="commercial-ready-bind" />}
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
        <CommercialHubTabHeader title={header.title} subtitle={header.subtitle} />

        <CommercialHubKpiStrip kpis={readyToBindTabKpis(queue)} columns={5} />

        <CommercialHubWorkspace
          ariaLabel="Ready to bind queue"
          title="Bind Queue"
          subtitle="Payment validation and producer approval before policy issuance."
          actions={
            <FarmersEdgeIntelTrigger
              label="Cross-Sell Intelligence"
              request={buildFarmersEdgeIntelRequest({
                mode: "cross-sell",
                client: queue[0]?.client,
                coverage: "BOP",
              })}
            />
          }
        >
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Bind State</th>
                  <th>Assigned VA</th>
                  <th>Payment Status</th>
                  <th>Producer</th>
                  <th>Client</th>
                  <th>Carrier</th>
                  <th>Premium</th>
                  <th>Broker Fee</th>
                  <th aria-label="Action" />
                </tr>
              </thead>
              <tbody>
                {queue.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className={cn("badge commercial-bind-state-badge", bindStateClass[item.bindState])}>
                        {readyToBindStateLabels[item.bindState]}
                      </span>
                    </td>
                    <td>{item.va}</td>
                    <td>
                      <div className="ready-to-bind-payment-cell">
                        <span className={cn("badge", paymentStatusClass[item.paymentStatus])}>
                          {item.paymentStatus}
                        </span>
                        {item.paymentMethod && (
                          <span className="ready-to-bind-payment-method">{item.paymentMethod}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={cn("badge", item.producerApproved ? "badge-green" : "badge-yellow")}>
                        {item.producerApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="commercial-hub-client-cell">{item.client}</td>
                    <td>{item.carrier}</td>
                    <td className="commercial-hub-premium">{item.premium}</td>
                    <td>{item.brokerFee}</td>
                    <td>
                      <div className="send-center-row-actions">
                        <button type="button" className="va-ops-action-btn" onClick={() => viewProposal(item)}>
                          View Proposal
                        </button>
                        {canBindPolicy && (
                          <button
                            type="button"
                            className="va-ops-action-btn commercial-hub-btn-teal primary"
                            disabled={!canBind(item)}
                            onClick={() => requirePermission("action:bind-policy", () => setConfirmItem(item))}
                          >
                            Bind Policy
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CommercialHubWorkspace>

        <CommercialHubIntelPanel
          title="Payment Validation"
          subtitle="Bind flow requires confirmed payment before issuance."
        >
          {paymentPending.length === 0 ? (
            <p className="va-ops-section-sub">All queued policies have payment confirmed or sent.</p>
          ) : (
            <ul className="va-ops-gap-list">
              {paymentPending.map((item) => (
                <li key={item.id}>
                  <strong>{item.client}</strong>: {item.paymentStatus}
                  {item.paymentMethod ? ` · ${item.paymentMethod}` : ""} · {item.va}
                </li>
              ))}
            </ul>
          )}
        </CommercialHubIntelPanel>

        <CommercialHubTabFooter
          title="Bind Checklist"
          subtitle="Producer approved · Quote selected · Docs complete · Payment validated."
        >
          <p className="va-ops-section-sub">
            Policies remain in queue until signed application and payment gates are cleared.
          </p>
        </CommercialHubTabFooter>

        <BindPolicyConfirmModal
          open={Boolean(confirmItem)}
          item={confirmItem}
          onClose={() => setConfirmItem(null)}
          onConfirm={handleConfirmBind}
        />
      </CommercialHubTabShell>
    </DataStateView>
  );
}
