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
  getOutreachClientOptions,
  outreachQueueHeader,
  type ActiveFollowUp,
  type OutreachClientProfile,
} from "@/data/outreachQueue";
import { PipelineCardSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { getOutreachSnapshot } from "@/data/outreachHubStore";
import { useOutreachHubStore } from "@/hooks/useOutreachHubStore";
import { useHubDataState } from "@/hooks/useHubDataState";
import { useToast } from "@/hooks/useToast";
import { crossModuleRoutes, navigateWithHandoff } from "@/lib/crossModuleLinks";
import { routes } from "@/lib/routes";
import { toastMessages } from "@/lib/toastMessages";
import { cn } from "@/lib/cn";
import { commercialHubTabHeaders } from "@/data/commercialHubTabHeaders";
import { outreachTabKpis } from "@/lib/commercialHubTabKpis";
import {
  CommercialHubIntelPanel,
  CommercialHubKpiStrip,
  CommercialHubTabFooter,
  CommercialHubTabHeader,
  CommercialHubTabShell,
  CommercialHubWorkspace,
} from "./CommercialHubTabLayout";
import { AddFollowUpModal } from "./AddFollowUpModal";
import { AssignProducerModal } from "./AssignProducerModal";
import { CreateReminderModal } from "./CreateReminderModal";
import { OutreachClientDrawer } from "./OutreachClientDrawer";
import { SendQuoteReminderModal } from "./SendQuoteReminderModal";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import { CommercialHubEmptyState } from "./CommercialHubEmptyState";

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
  const snapshot = useOutreachHubStore();
  const {
    status,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => getOutreachSnapshot(),
    isEmpty: () => false,
    errorPreset: "agencyzoom-unavailable",
  });
  const [addFollowUpOpen, setAddFollowUpOpen] = useState(false);
  const [createReminderOpen, setCreateReminderOpen] = useState(false);
  const [sendQuoteOpen, setSendQuoteOpen] = useState(false);
  const [assignProducerOpen, setAssignProducerOpen] = useState(false);
  const [drawer, setDrawer] = useState<DrawerState>(null);

  const clientOptions = useMemo(() => getOutreachClientOptions(snapshot), [snapshot]);
  const kpis = useMemo(() => outreachTabKpis(snapshot), [snapshot]);
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

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <CommercialHubTabShell className="outreach-queue">
          <PipelineCardSkeleton count={4} />
        </CommercialHubTabShell>
      }
      empty={<HubEmptyState preset="commercial-outreach" />}
      error={
        <HubErrorState
          preset="agencyzoom-unavailable"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      }
    >
    <CommercialHubTabShell className="outreach-queue">
      <CommercialHubTabHeader
        title={commercialHubTabHeaders.outreach.title}
        subtitle={commercialHubTabHeaders.outreach.subtitle}
        actions={outreachQueueHeader.quickActions.map((action, index) => ({
          ...action,
          variant: index === 0 ? "primary" as const : "secondary" as const,
        }))}
        onActionClick={handleQuickAction}
      />

      {upcomingReminder && (
        <div className="add-market-alert add-market-alert-warn outreach-upcoming-reminder" role="status">
          <strong>Upcoming Reminder</strong>
          <span>
            {upcomingReminder.reminderType} — {upcomingReminder.date} at {upcomingReminder.time} · Assigned to {upcomingReminder.assignedTo}
          </span>
        </div>
      )}

      <CommercialHubKpiStrip kpis={kpis} columns={4} />

      <CommercialHubWorkspace
        ariaLabel="Follow-up queue"
        title="Follow-up Queue"
        subtitle="Active tasks and quote follow-ups driving client momentum."
      >
        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table outreach-follow-ups-table">
            <thead>
              <tr>
                <th>Priority / Status</th>
                <th>Assigned</th>
                <th>Due / Sent</th>
                <th>Client</th>
                <th>Type</th>
                <th>Carrier / Coverage</th>
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
                  <td>
                    <span className={cn("badge", priorityClass[row.priority])}>{row.priority}</span>
                  </td>
                  <td>{row.assigned}</td>
                  <td>{row.due}</td>
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  <td>{row.type}</td>
                  <td>{row.coverage}</td>
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
                  <td>
                    <span className={cn("badge", quoteStatusClass[row.status] ?? "badge-gray")}>
                      {row.status}
                    </span>
                  </td>
                  <td>—</td>
                  <td>{row.sent}</td>
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  <td>Quote Follow-Up</td>
                  <td>{row.carrier}</td>
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
      </CommercialHubWorkspace>

      <CommercialHubIntelPanel title="Producer Queue" subtitle="Accounts assigned to producers for closing." className="commercial-hub-intel-tall">
        {snapshot.producerQueue.length === 0 ? (
          <p className="va-ops-section-sub">No producer assignments pending.</p>
        ) : (
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Producer</th>
                  <th>Assigned</th>
                  <th>Client</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.producerQueue.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span className={cn("badge", priorityClass[row.priority])}>{row.priority}</span>
                    </td>
                    <td><UserChip name={row.producer} /></td>
                    <td>{row.assignedAt}</td>
                    <td className="commercial-hub-client-cell">{row.client}</td>
                    <td>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CommercialHubIntelPanel>

      <CommercialHubIntelPanel title="Decision Queue" subtitle="Quotes sent to clients awaiting a decision." className="commercial-hub-intel-tall">
        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Decision Status</th>
                <th>Client</th>
                <th>Sent Date</th>
                <th>Last Contact</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.clientDecisionQueue.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className={cn("badge", decisionStatusClass[row.decisionStatus])}>
                      {row.decisionStatus}
                    </span>
                  </td>
                  <td className="commercial-hub-client-cell">{row.client}</td>
                  <td>{row.sentDate}</td>
                  <td>{row.lastContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CommercialHubIntelPanel>

      <CommercialHubIntelPanel title="Objections Queue" subtitle="Commercial objection handling during quote negotiation." className="commercial-hub-intel-tall">
        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
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
      </CommercialHubIntelPanel>

      <CommercialHubTabFooter title="Outreach Activity" subtitle="Follow-up history and client communication log.">
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
      </CommercialHubTabFooter>

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
    </CommercialHubTabShell>
    </DataStateView>
  );
}
