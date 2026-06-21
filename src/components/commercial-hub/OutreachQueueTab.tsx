"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  assignProducer,
  saveFollowUp,
  saveReminder,
  sendQuoteReminder,
} from "@/data/outreachQueueActions";
import {
  computeOutreachKpis,
  getOutreachClientOptions,
  outreachQueueHeader,
  type ActiveFollowUp,
  type OutreachClientProfile,
} from "@/data/outreachQueue";
import { TableSkeleton, TimelineSkeleton } from "@/components/shared/loading";
import { useOutreachHubStore } from "@/hooks/useOutreachHubStore";
import { useTabLoading } from "@/hooks/useTabLoading";
import { useToast } from "@/hooks/useToast";
import { crossModuleRoutes, navigateWithHandoff } from "@/lib/crossModuleLinks";
import { routes } from "@/lib/routes";
import { toastMessages } from "@/lib/toastMessages";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { cn } from "@/lib/cn";
import { AddFollowUpModal } from "./AddFollowUpModal";
import { AssignProducerModal } from "./AssignProducerModal";
import { CreateReminderModal } from "./CreateReminderModal";
import { OutreachClientDrawer } from "./OutreachClientDrawer";
import { SendQuoteReminderModal } from "./SendQuoteReminderModal";
import { CommercialHubEmptyState } from "./CommercialHubEmptyState";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";

const quoteStatusClass: Record<string, string> = {
  Waiting: "badge-yellow",
  Fresh: "badge-green",
  Stale: "badge-gray",
  "Followed Up": "badge-blue",
};

const decisionStatusClass: Record<string, string> = {
  Waiting: "badge-yellow",
  Negotiating: "badge-blue",
  Accepted: "badge-green",
  Declined: "badge-red",
};

const priorityClass = {
  High: "badge-red",
  Medium: "badge-yellow",
  Low: "badge-gray",
} as const;

type DrawerState = { client: string; profile: OutreachClientProfile } | null;

export function OutreachQueueTab() {
  const router = useRouter();
  const toast = useToast();
  const loading = useTabLoading();
  const snapshot = useOutreachHubStore();
  const [addFollowUpOpen, setAddFollowUpOpen] = useState(false);
  const [createReminderOpen, setCreateReminderOpen] = useState(false);
  const [sendQuoteOpen, setSendQuoteOpen] = useState(false);
  const [assignProducerOpen, setAssignProducerOpen] = useState(false);
  const [drawer, setDrawer] = useState<DrawerState>(null);

  const clientOptions = useMemo(() => getOutreachClientOptions(snapshot), [snapshot]);
  const kpis = useMemo(() => computeOutreachKpis(snapshot), [snapshot]);
  const upcomingReminder = snapshot.reminders[0] ?? null;
  const followUpCount = snapshot.activeFollowUps.length + snapshot.quoteFollowUps.length;

  const reviseProposal = (client: string) => {
    navigateWithHandoff(
      router,
      crossModuleRoutes.sendCenterDraftQueue({ handoff: "revise-proposal" }),
      {
        type: "revise-proposal",
        sourcePath: `${routes.commercialHub}?view=outreach`,
        returnLabel: "Outreach Queue",
        payload: { client },
      },
      { href: `${routes.commercialHub}?view=outreach`, label: "Outreach Queue" },
    );
  };

  const openDrawer = (row: ActiveFollowUp) => {
    setDrawer({ client: row.client, profile: row.drawer });
  };

  const handleQuickAction = (actionId: string) => {
    if (actionId === "add-follow-up") {
      setAddFollowUpOpen(true);
      return;
    }
    if (actionId === "create-reminder") {
      setCreateReminderOpen(true);
      return;
    }
    if (actionId === "send-quote-reminder") {
      if (snapshot.quoteFollowUps.length === 0) {
        toast.error("No quote follow-ups available to remind.");
        return;
      }
      setSendQuoteOpen(true);
      return;
    }
    if (actionId === "assign-producer") {
      setAssignProducerOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="va-ops-role-view outreach-queue">
        <TimelineSkeleton items={5} />
        <TableSkeleton rows={4} />
      </div>
    );
  }

  return (
    <div className="va-ops-role-view outreach-queue">
      <RoleTabHeader
        title={outreachQueueHeader.title}
        subtitle={outreachQueueHeader.subtitle}
        quickActions={outreachQueueHeader.quickActions}
        onQuickActionClick={handleQuickAction}
      />

      {upcomingReminder && (
        <div className="add-market-alert add-market-alert-warn outreach-upcoming-reminder" role="status">
          <strong>Upcoming Reminder</strong>
          <span>
            {upcomingReminder.reminderType} — {upcomingReminder.date} at {upcomingReminder.time} · Assigned to {upcomingReminder.assignedTo}
          </span>
        </div>
      )}

      <section className="va-ops-kpi-strip" aria-label="Outreach queue KPI summary">
        <div className="commercial-hub-kpi-grid outreach-kpi-grid">
          {kpis.map((kpi) => (
            <article key={kpi.label} className={cn("va-ops-kpi-card", kpi.color)}>
              <div className="va-ops-kpi-label">{kpi.label}</div>
              <div className="va-ops-kpi-value">{kpi.value}</div>
              <div className="va-ops-kpi-sub">{kpi.sub}</div>
              <div className="va-ops-kpi-helper">{kpi.helper}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="va-ops-panel" aria-label="Follow-up queue">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Follow-up Queue</h3>
          <p className="va-ops-section-sub">Active tasks and quote follow-ups driving client momentum.</p>
        </div>
        <div className="commercial-hub-table-wrap">
          <table className="commercial-hub-table outreach-follow-ups-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Type</th>
                <th>Carrier / Coverage</th>
                <th>Assigned</th>
                <th>Due / Sent</th>
                <th>Priority / Status</th>
                <th>Next Action</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {followUpCount === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <CommercialHubEmptyState
                      title="Follow-up queue is clear"
                      description="No active tasks or quote follow-ups need attention right now."
                    />
                  </td>
                </tr>
              ) : (
                <>
              {snapshot.activeFollowUps.map((row) => (
                <tr
                  key={`af-${row.id}`}
                  className="outreach-table-row"
                  tabIndex={0}
                  role="button"
                  onClick={() => openDrawer(row)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openDrawer(row);
                    }
                  }}
                >
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  <td>{row.type}</td>
                  <td>{row.coverage}</td>
                  <td>{row.assigned}</td>
                  <td>{row.due}</td>
                  <td>
                    <span className={cn("badge", priorityClass[row.priority])}>{row.priority}</span>
                  </td>
                  <td className="commercial-hub-next-action">{row.nextAction}</td>
                  <td>
                    <button
                      type="button"
                      className="va-ops-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDrawer(row);
                      }}
                    >
                      {row.cta}
                    </button>
                  </td>
                </tr>
              ))}
              {snapshot.quoteFollowUps.map((row) => (
                <tr key={`qf-${row.id}`}>
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  <td>Quote Follow-Up</td>
                  <td>{row.carrier}</td>
                  <td>—</td>
                  <td>{row.sent}</td>
                  <td>
                    <span className={cn("badge", quoteStatusClass[row.status] ?? "badge-gray")}>
                      {row.status}
                    </span>
                  </td>
                  <td className="commercial-hub-next-action">{row.nextStep}</td>
                  <td>
                    <button type="button" className="va-ops-action-btn" onClick={() => reviseProposal(row.client)}>
                      Revise Proposal
                    </button>
                  </td>
                </tr>
              ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {snapshot.producerQueue.length > 0 && (
        <section className="va-ops-panel" aria-label="Producer queue">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Producer Queue</h3>
            <p className="va-ops-section-sub">Accounts assigned to producers for closing.</p>
          </div>
          <div className="commercial-hub-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Producer</th>
                  <th>Priority</th>
                  <th>Assigned</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.producerQueue.map((row) => (
                  <tr key={row.id}>
                    <td className="commercial-hub-client-cell">{row.client}</td>
                    <td><UserChip name={row.producer} /></td>
                    <td>
                      <span className={cn("badge", priorityClass[row.priority])}>{row.priority}</span>
                    </td>
                    <td>{row.assignedAt}</td>
                    <td>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="va-ops-panel" aria-label="Decision queue">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Decision Queue</h3>
          <p className="va-ops-section-sub">Quotes sent to clients awaiting a decision.</p>
        </div>
        <div className="commercial-hub-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Sent Date</th>
                <th>Last Contact</th>
                <th>Decision Status</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.clientDecisionQueue.map((row) => (
                <tr key={row.id}>
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  <td>{row.sentDate}</td>
                  <td>{row.lastContact}</td>
                  <td>
                    <span className={cn("badge", decisionStatusClass[row.decisionStatus])}>
                      {row.decisionStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="va-ops-panel" aria-label="Objections queue">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Objections Queue</h3>
          <p className="va-ops-section-sub">Commercial objection handling during quote negotiation.</p>
        </div>
        <div className="commercial-hub-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Objection</th>
                <th>Suggested Action</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.clientObjections.map((row) => (
                <tr key={row.id}>
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  <td>{row.objection}</td>
                  <td className="commercial-hub-next-action">{row.suggestedAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="va-ops-panel" aria-label="Recent outreach activity">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Outreach Activity</h3>
          <p className="va-ops-section-sub">Follow-up history and client communication log.</p>
        </div>
        <ol className="outreach-activity-timeline">
          {snapshot.outreachActivity.map((item) => (
            <li key={item.id} className="outreach-activity-item">
              <div className="outreach-activity-dot" aria-hidden="true" />
              <div className="outreach-activity-content">
                <div className="outreach-activity-message">{item.message}</div>
                <div className="outreach-activity-time">{item.timeAgo}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <AddFollowUpModal
        open={addFollowUpOpen}
        clientOptions={clientOptions}
        onClose={() => setAddFollowUpOpen(false)}
        onSave={(payload) => {
          saveFollowUp(payload);
          toast.success("Follow-up added successfully");
        }}
      />

      <CreateReminderModal
        open={createReminderOpen}
        onClose={() => setCreateReminderOpen(false)}
        onSave={(payload) => {
          saveReminder(payload);
          toast.success("Reminder scheduled");
        }}
      />

      <SendQuoteReminderModal
        open={sendQuoteOpen}
        quoteFollowUps={snapshot.quoteFollowUps}
        onClose={() => setSendQuoteOpen(false)}
        onSend={(payload) => {
          sendQuoteReminder(payload);
          toast.success(toastMessages.commercialHub.carrierFollowUpSent);
        }}
      />

      <AssignProducerModal
        open={assignProducerOpen}
        clientOptions={clientOptions}
        onClose={() => setAssignProducerOpen(false)}
        onSave={(payload) => {
          assignProducer(payload);
          toast.success("Producer assigned successfully");
        }}
      />

      <OutreachClientDrawer
        client={drawer?.client ?? null}
        profile={drawer?.profile ?? null}
        onClose={() => setDrawer(null)}
        onReviseProposal={reviseProposal}
      />
    </div>
  );
}
