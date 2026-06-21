"use client";

import { useState } from "react";
import {
  documentBlockers,
  type DocumentBlocker,
  type DocUrgency,
} from "@/data/submissionTracker";
import { CardSkeletonGrid } from "@/components/shared/loading";
import { useTabLoading } from "@/hooks/useTabLoading";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import { cn } from "@/lib/cn";
import { CommercialHubEmptyState } from "./CommercialHubEmptyState";
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

export function MissingDocsQueueTab() {
  const toast = useToast();
  const loading = useTabLoading();
  const [items, setItems] = useState(documentBlockers);
  const [reminderItem, setReminderItem] = useState<DocumentBlocker | null>(null);

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

  if (loading) {
    return (
      <div className="va-ops-role-view submission-ops-queue">
        <CardSkeletonGrid count={4} />
      </div>
    );
  }

  return (
    <div className="va-ops-role-view submission-ops-queue">
      <section className="submission-doc-blockers-panel" aria-label="Missing documents queue">
        <div className="submission-queue-header">
          <h3 className="va-ops-section-title">Missing Docs Queue</h3>
          <p className="va-ops-section-sub">
            Document blockers preventing brokerage review and carrier submission.
          </p>
        </div>
        <ul className="submission-queue-list">
          {items.length === 0 ? (
            <li>
              <CommercialHubEmptyState
                icon="check"
                title="No missing documents"
                description="All required documents are received — queue is clear."
              />
            </li>
          ) : (
            items.map((item) => (
            <li key={item.id} className="submission-queue-row submission-doc-blocker">
              <div className="submission-queue-main">
                <div className="submission-queue-title-row">
                  <div className="submission-queue-client">{item.client}</div>
                  <span className={cn("badge", urgencyClass[item.urgency])}>
                    {urgencyLabels[item.urgency]}
                  </span>
                </div>
                <div className="submission-queue-meta">
                  <span>Missing: <strong>{item.missing}</strong></span>
                  <span>Requested: <strong>{item.requested}</strong></span>
                  <span>Assigned VA: <strong>{item.assigned}</strong></span>
                </div>
              </div>
              <button
                type="button"
                className={cn("va-ops-action-btn", item.urgency === "critical" && "critical")}
                onClick={() => handleRowAction(item)}
              >
                {item.action}
              </button>
            </li>
          ))
          )}
        </ul>
      </section>

      <DocReminderModal
        open={Boolean(reminderItem)}
        item={reminderItem}
        onClose={() => setReminderItem(null)}
        onSend={handleSendReminder}
      />
    </div>
  );
}
