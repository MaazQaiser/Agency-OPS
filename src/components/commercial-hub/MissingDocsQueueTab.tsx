"use client";

import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  documentBlockers,
  getGranularDocsCompletion,
  type DocumentBlocker,
  type DocUrgency,
  type GranularDocStatus,
} from "@/data/submissionTracker";
import {
  findTrackerProgressByClient,
  progressFromMissingDocsField,
} from "@/lib/coverageChecklistProgress";
import { trackerSubmissions } from "@/data/submissionTracker";
import { PipelineCardSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { resolveDisplayStatus } from "@/lib/dataState";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import { cn } from "@/lib/cn";
import { commercialHubTabHeaders } from "@/data/commercialHubTabHeaders";
import { missingDocsTabKpis } from "@/lib/commercialHubTabKpis";
import {
  CommercialHubIntelPanel,
  CommercialHubKpiStrip,
  CommercialHubTabFooter,
  CommercialHubTabHeader,
  CommercialHubTabShell,
  CommercialHubWorkspace,
} from "./CommercialHubTabLayout";
import { DocReminderModal } from "./DocReminderModal";
import { FarmersEdgeIntelTrigger } from "./FarmersEdgeIntelTrigger";
import { buildFarmersEdgeIntelRequest } from "@/lib/farmersEdgeIntel";

const urgencyLabels: Record<DocUrgency, string> = {
  critical: "Critical",
  "waiting-client": "Waiting Client",
  "follow-up-sent": "Follow-up Sent",
};

const urgencyClass: Record<DocUrgency, string> = {
  critical: "badge-red",
  "waiting-client": "badge-yellow",
  "follow-up-sent": "badge-blue",
};

const docStatusClass: Record<GranularDocStatus, string> = {
  Pending: "badge-yellow",
  Received: "badge-green",
  Overdue: "badge-red",
};

export function MissingDocsQueueTab() {
  const toast = useToast();
  const [items, setItems] = useState(documentBlockers);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reminderItem, setReminderItem] = useState<DocumentBlocker | null>(null);
  const header = commercialHubTabHeaders["missing-docs"];

  const {
    status: loadStatus,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => documentBlockers,
    errorPreset: "supabase-timeout",
  });

  const status = resolveDisplayStatus(loadStatus, items, (d) => d.length === 0);

  const handleResolveDoc = (item: DocumentBlocker) => {
    setItems((prev) => prev.filter((row) => row.id !== item.id));
    if (expandedId === item.id) setExpandedId(null);
    toast.success(toastMessages.commercialHub.missingDocResolved);
  };

  const handleSendReminder = (item: DocumentBlocker, _channel: "email" | "sms") => {
    setItems((prev) =>
      prev.map((row) =>
        row.id === item.id ? { ...row, urgency: "follow-up-sent" as DocUrgency, action: "Mark Resolved" } : row,
      ),
    );
    setReminderItem(null);
  };

  const handleRowAction = (item: DocumentBlocker) => {
    if (/resolve/i.test(item.action)) {
      handleResolveDoc(item);
      return;
    }
    setReminderItem(item);
  };

  const criticalItems = items.filter((item) => item.urgency === "critical");

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      loading={<PipelineCardSkeleton count={4} />}
      empty={<HubEmptyState preset="commercial-missing-docs" />}
      error={<HubErrorState preset="supabase-timeout" onRetry={retry} retrying={retrying} lastSyncedAt={lastSyncedAt} />}
    >
      <CommercialHubTabShell className="submission-ops-queue">
        <CommercialHubTabHeader title={header.title} subtitle={header.subtitle} />

        <CommercialHubKpiStrip kpis={missingDocsTabKpis()} columns={4} />

        <CommercialHubWorkspace
          ariaLabel="Missing documents queue"
          title="Document Blockers"
          subtitle={`${items.length} client${items.length === 1 ? "" : "s"} waiting on required documents.`}
          actions={
            <FarmersEdgeIntelTrigger
              label="Risk Exposure Review"
              request={buildFarmersEdgeIntelRequest({
                mode: "risk-exposure",
                client: (criticalItems[0] ?? items[0])?.client,
                missingDocs: (criticalItems[0] ?? items[0])?.documents
                  .filter((doc) => doc.status !== "Received")
                  .map((doc) => doc.name),
              })}
            />
          }
        >
          <ul className="submission-queue-list commercial-docs-accordion">
            {items.map((item) => {
              const isExpanded = expandedId === item.id;
              const completionPct = getGranularDocsCompletion(item.documents);
              const missingCount = item.documents.filter((doc) => doc.status !== "Received").length;
              return (
                <li
                  key={item.id}
                  className={cn(
                    "submission-queue-row submission-doc-blocker commercial-docs-accordion-item",
                    isExpanded && "is-expanded",
                  )}
                >
                  <button
                    type="button"
                    className="commercial-docs-accordion-trigger"
                    aria-expanded={isExpanded}
                    onClick={() => setExpandedId((current) => (current === item.id ? null : item.id))}
                  >
                    <span className="commercial-docs-accordion-chevron" aria-hidden="true">
                      <AppIcon
                        name="chevron-down"
                        size={14}
                        strokeWidth={2.5}
                        className={cn(isExpanded && "rotated")}
                      />
                    </span>
                    <span className="commercial-docs-accordion-summary">
                      <span className="submission-queue-client">{item.client}</span>
                      <span className="granular-docs-completion">{completionPct}% complete</span>
                      <span className="commercial-docs-missing-count">
                        {missingCount} missing
                      </span>
                      <span className={cn("badge", urgencyClass[item.urgency])}>
                        {urgencyLabels[item.urgency]}
                      </span>
                      <span className="commercial-docs-owner">
                        Owner: <strong>{item.assigned}</strong>
                      </span>
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="commercial-docs-accordion-panel">
                      <div className="granular-docs-panel">
                        <div className="granular-docs-panel-title">Required Documents</div>
                        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
                          <table className="commercial-hub-table granular-docs-table">
                            <thead>
                              <tr>
                                <th>Status</th>
                                <th>Document</th>
                                <th>Requested</th>
                                <th>Last Reminder</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.documents.map((doc) => (
                                <tr key={doc.id}>
                                  <td>
                                    <span className={cn("badge", docStatusClass[doc.status])}>{doc.status}</span>
                                  </td>
                                  <td>{doc.name}</td>
                                  <td>{doc.requestedDate}</td>
                                  <td>{doc.lastReminder}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="commercial-docs-reminder-log">
                        <div className="granular-docs-panel-title">Reminder Log</div>
                        <ul className="va-ops-gap-list">
                          {item.documents
                            .filter((doc) => doc.lastReminder !== "-")
                            .map((doc) => (
                              <li key={doc.id}>
                                <strong>{doc.name}</strong>: last reminder {doc.lastReminder}
                              </li>
                            ))}
                        </ul>
                      </div>

                      <div className="commercial-docs-accordion-actions">
                        <button
                          type="button"
                          className={cn(
                            "va-ops-action-btn commercial-hub-btn-teal",
                            item.urgency === "critical" && "primary",
                          )}
                          onClick={() => handleRowAction(item)}
                        >
                          {item.action}
                        </button>
                        <button
                          type="button"
                          className="va-ops-action-btn"
                          onClick={() => setReminderItem(item)}
                        >
                          Send Reminder
                        </button>
                      </div>
                    </div>
                  )}

                  {!isExpanded && (
                    <button
                      type="button"
                      className={cn(
                        "va-ops-action-btn commercial-hub-btn-teal commercial-docs-accordion-cta",
                        item.urgency === "critical" && "primary",
                      )}
                      onClick={() => handleRowAction(item)}
                    >
                      {item.action}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </CommercialHubWorkspace>

        <CommercialHubIntelPanel
          title="Critical Blockers"
          subtitle="Highest urgency document gaps requiring immediate outreach."
        >
          {criticalItems.length === 0 ? (
            <p className="va-ops-section-sub">No critical blockers in queue.</p>
          ) : (
            <ul className="va-ops-gap-list">
              {criticalItems.map((item) => (
                <li key={item.id}>
                  <strong>{item.client}</strong>: {item.missing} · Owner: {item.assigned}
                </li>
              ))}
            </ul>
          )}
        </CommercialHubIntelPanel>

        <CommercialHubTabFooter
          title="Reminder Discipline"
          subtitle="Follow-up cadence and client response tracking."
        >
          <p className="va-ops-section-sub">
            Overdue documents escalate after two reminders. Mark resolved once uploaded to AgencyZoom.
          </p>
        </CommercialHubTabFooter>

        <DocReminderModal
          open={Boolean(reminderItem)}
          item={reminderItem}
          onClose={() => setReminderItem(null)}
          onSend={handleSendReminder}
        />
      </CommercialHubTabShell>
    </DataStateView>
  );
}
