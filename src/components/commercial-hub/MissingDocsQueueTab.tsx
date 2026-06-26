"use client";

import { useState } from "react";
import {
  documentBlockers,
  getGranularDocsCompletion,
  type DocumentBlocker,
  type DocUrgency,
  type GranularDocStatus,
} from "@/data/submissionTracker";
import { CoverageChecklistProgress } from "@/components/commercial/CoverageChecklistProgress";
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
        >
          <ul className="submission-queue-list">
            {items.map((item) => {
              const checklistProgress =
                findTrackerProgressByClient(item.client, trackerSubmissions)
                ?? progressFromMissingDocsField(item.missing);
              const completionPct = getGranularDocsCompletion(item.documents);
              return (
                <li key={item.id} className="submission-queue-row submission-doc-blocker">
                  <div className="submission-queue-main">
                    <div className="submission-queue-title-row">
                      <span className={cn("badge", urgencyClass[item.urgency])}>
                        {urgencyLabels[item.urgency]}
                      </span>
                      <div className="submission-queue-client">{item.client}</div>
                      <span className="granular-docs-completion">{completionPct}% complete</span>
                    </div>
                    <div className="submission-queue-meta">
                      <span>Owner: <strong>{item.assigned}</strong></span>
                    </div>
                    <CoverageChecklistProgress
                      progress={checklistProgress}
                      variant="compact"
                      className="submission-queue-checklist-progress"
                    />
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
                  </div>
                  <button
                    type="button"
                    className={cn(
                      "va-ops-action-btn",
                      item.urgency === "critical" ? "primary" : undefined,
                    )}
                    onClick={() => handleRowAction(item)}
                  >
                    {item.action}
                  </button>
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
                  <strong>{item.client}</strong> — {item.missing} · Owner: {item.assigned}
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
