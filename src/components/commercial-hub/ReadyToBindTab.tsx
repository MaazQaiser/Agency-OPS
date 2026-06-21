"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  readyToBindQueue as initialReadyToBindQueue,
  readyToBindStateLabels,
  type ReadyToBindItem,
} from "@/data/submissionTracker";
import { crossModuleRoutes, resolveProposalId } from "@/lib/crossModuleLinks";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { TableSkeleton } from "@/components/shared/loading";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useTabLoading } from "@/hooks/useTabLoading";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import { BindPolicyConfirmModal } from "./BindPolicyConfirmModal";
import { CommercialHubEmptyState } from "./CommercialHubEmptyState";

export function ReadyToBindTab() {
  const router = useRouter();
  const toast = useToast();
  const loading = useTabLoading();
  const { can, requirePermission } = usePermissions();
  const canBindPolicy = can("action:bind-policy");
  const [queue, setQueue] = useState(initialReadyToBindQueue);
  const [confirmItem, setConfirmItem] = useState<ReadyToBindItem | null>(null);

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

  if (loading) {
    return (
      <div className="va-ops-role-view submission-ops-queue">
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="va-ops-role-view submission-ops-queue">
      <section className="submission-ready-to-bind-panel" aria-label="Ready to bind queue">
        <div className="submission-queue-header">
          <h3 className="va-ops-section-title">Ready to Bind Queue</h3>
          <p className="va-ops-section-sub">
            Final stage — producer approved, quote selected, client approved, docs and payment validated.
          </p>
        </div>
        <div className="commercial-hub-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Selected Carrier</th>
                <th>Premium</th>
                <th>Broker Fee</th>
                <th>Bind State</th>
                <th>Producer Approved</th>
                <th>Assigned VA</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <CommercialHubEmptyState
                      icon="check"
                      title="Bind queue is clear"
                      description="No policies awaiting final bind steps right now."
                    />
                  </td>
                </tr>
              ) : (
                queue.map((item) => (
                <tr key={item.id}>
                  <td className="commercial-hub-client-cell">{item.client}</td>
                  <td>{item.carrier}</td>
                  <td className="commercial-hub-premium">{item.premium}</td>
                  <td>{item.brokerFee}</td>
                  <td>
                    <span className="badge badge-blue">{readyToBindStateLabels[item.bindState]}</span>
                  </td>
                  <td>
                    <span className={cn("badge", item.producerApproved ? "badge-green" : "badge-yellow")}>
                      {item.producerApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td>{item.va}</td>
                  <td>
                    <div className="send-center-row-actions">
                      <button type="button" className="va-ops-action-btn" onClick={() => viewProposal(item)}>
                        View Proposal
                      </button>
                      {canBindPolicy && (
                        <button
                          type="button"
                          className="va-ops-action-btn primary"
                          disabled={!canBind(item)}
                          onClick={() => requirePermission("action:bind-policy", () => setConfirmItem(item))}
                        >
                          Bind Policy
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <BindPolicyConfirmModal
        open={Boolean(confirmItem)}
        item={confirmItem}
        onClose={() => setConfirmItem(null)}
        onConfirm={handleConfirmBind}
      />
    </div>
  );
}
