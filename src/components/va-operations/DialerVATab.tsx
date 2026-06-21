"use client";

import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  callbackQueue,
  callScripts,
  callTimeline,
  dialerKpis,
  dialerVAHeader,
  leadQueue,
  liveCallSessions,
  missedSlaLeads,
  type DialerLead,
  type LeadPriority,
} from "@/data/dialerVA";
import { cn } from "@/lib/cn";
import { LeadDrawer } from "./LeadDrawer";
import { RoleTabHeader } from "./RoleTabHeader";

const priorityClass: Record<LeadPriority, string> = {
  high: "badge-red",
  medium: "badge-yellow",
  low: "badge-gray",
};

const callbackStatusClass = {
  "due-now": "badge-red",
  upcoming: "badge-blue",
  overdue: "badge-yellow",
} as const;

const callStatusClass = {
  "on-call": "va-ops-call-live",
  "wrap-up": "va-ops-call-wrap",
  idle: "va-ops-call-idle",
} as const;

const missedStatusClass = {
  missed: "badge-yellow",
  critical: "badge-red",
} as const;

export function DialerVATab({ embedded = false }: { embedded?: boolean } = {}) {
  const [selectedLead, setSelectedLead] = useState<DialerLead | null>(null);

  const openLead = (lead: DialerLead) => setSelectedLead(lead);

  return (
    <div className={cn("va-ops-role-view va-ops-dialer", embedded && "embedded")}>
      {!embedded && (
        <RoleTabHeader
          title={dialerVAHeader.title}
          subtitle={dialerVAHeader.subtitle}
          quickActions={dialerVAHeader.quickActions}
        />
      )}

      {!embedded && (
        <section className="va-ops-kpi-strip" aria-label="Dialer performance summary">
          <div className="va-ops-kpi-grid">
            {dialerKpis.map((kpi) => (
              <article key={kpi.label} className={cn("va-ops-kpi-card", kpi.color)}>
                <div className="va-ops-kpi-label">{kpi.label}</div>
                <div className="va-ops-kpi-value">{kpi.value}</div>
                <div className="va-ops-kpi-sub">{kpi.sub}</div>
                <div className="va-ops-kpi-helper">{kpi.helper}</div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="va-ops-content-grid">
        <section className="va-ops-panel va-ops-lead-queue-panel" aria-label="Lead queue">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Lead Queue</h3>
            <p className="va-ops-section-sub">Assigned leads waiting for first contact.</p>
          </div>
          <ul className="va-ops-lead-list">
            {leadQueue.map((lead) => (
              <li key={lead.id} className="va-ops-lead-card">
                <button
                  type="button"
                  className="va-ops-lead-card-main va-ops-lead-card-clickable"
                  onClick={() => openLead(lead)}
                >
                  <div className="va-ops-lead-name">{lead.name}</div>
                  <div className="va-ops-lead-meta">
                    <span>Source: <strong>{lead.source}</strong></span>
                    <span>Type: <strong>{lead.type}</strong></span>
                    <span>Assigned: <strong>{lead.assignedTo}</strong></span>
                    <span>Time Added: <strong>{lead.timeAdded}</strong></span>
                  </div>
                  <span className={cn("badge", priorityClass[lead.priority])}>
                    {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)} Priority
                  </span>
                </button>
                <div className="va-ops-lead-card-actions">
                  {lead.cta === "Call Lead" ? (
                    <button type="button" className="va-ops-action-btn critical">
                      <AppIcon name="phone" size={14} strokeWidth={2.25} />
                      {lead.cta}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="va-ops-action-btn"
                      onClick={() => openLead(lead)}
                    >
                      {lead.cta}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="va-ops-panel va-ops-live-call-panel" aria-label="Live call monitor">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Live Call Monitor</h3>
            <p className="va-ops-section-sub">Active call sessions across the dialer team.</p>
          </div>
          <ul className="va-ops-live-call-list">
            {liveCallSessions.map((session) => (
              <li key={session.id} className={cn("va-ops-live-call-row", callStatusClass[session.status])}>
                <div className="va-ops-live-call-agent">{session.agent}</div>
                <div className="va-ops-live-call-details">
                  <div className="va-ops-live-call-status-row">
                    <span className="va-ops-live-call-label">Status:</span>
                    <span className={cn("va-ops-live-call-status", session.status)}>
                      {session.statusLabel}
                    </span>
                  </div>
                  <div className="va-ops-live-call-meta">
                    <span>Duration: <strong>{session.duration}</strong></span>
                    <span>Client: <strong>{session.client}</strong></span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="va-ops-panel va-ops-callback-panel" aria-label="Callback queue">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Callback Queue</h3>
          <p className="va-ops-section-sub">Clients requiring second touch.</p>
        </div>
        <ul className="va-ops-callback-list">
          {callbackQueue.map((item) => (
            <li key={item.id} className="va-ops-callback-row">
              <div className="va-ops-callback-main">
                <div className="va-ops-callback-client">{item.client}</div>
                <div className="va-ops-callback-meta">
                  <span>Reason: <strong>{item.reason}</strong></span>
                  <span>Due: <strong>{item.due}</strong></span>
                  <span>Assigned: <strong>{item.assignedTo}</strong></span>
                </div>
              </div>
              <div className="va-ops-callback-actions">
                <span className={cn("badge", callbackStatusClass[item.status])}>
                  {item.statusLabel}
                </span>
                <button
                  type="button"
                  className={cn("va-ops-action-btn", item.status === "due-now" && "critical")}
                >
                  {item.cta === "Call Back" && <AppIcon name="phone" size={14} strokeWidth={2.25} />}
                  {item.cta}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="va-ops-panel va-ops-scripts-panel" aria-label="Approved call scripts">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Approved Call Scripts</h3>
          <p className="va-ops-section-sub">Quick access for dialer VAs.</p>
        </div>
        <div className="va-ops-scripts-grid">
          {callScripts.map((script) => (
            <article key={script.id} className="va-ops-script-card">
              <div className="va-ops-script-title">{script.title}</div>
              <p className="va-ops-script-desc">{script.description}</p>
              <button type="button" className="va-ops-action-btn">
                <AppIcon name="clipboard" size={14} strokeWidth={2.25} />
                {script.cta}
              </button>
            </article>
          ))}
        </div>
      </section>

      <div className="va-ops-dialer-bottom-grid">
        <section className="va-ops-panel va-ops-timeline-panel" aria-label="Today's call activity">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Today&apos;s Call Activity</h3>
            <p className="va-ops-section-sub">Chronological call history.</p>
          </div>
          <ol className="va-ops-timeline">
            {callTimeline.map((item) => (
              <li key={item.id} className="va-ops-timeline-item">
                <time className="va-ops-timeline-time">{item.time}</time>
                <div className="va-ops-timeline-content">
                  <div className="va-ops-timeline-action">{item.action}</div>
                  <div className="va-ops-timeline-outcome">Outcome: {item.outcome}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="va-ops-panel va-ops-missed-panel" aria-label="Missed lead SLA">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Missed Lead SLA</h3>
            <p className="va-ops-section-sub">Leads not contacted within allowed time.</p>
          </div>
          <ul className="va-ops-missed-list">
            {missedSlaLeads.map((lead) => (
              <li key={lead.id} className={cn("va-ops-missed-row", lead.status)}>
                <div className="va-ops-missed-main">
                  <div className="va-ops-missed-name">{lead.name}</div>
                  <div className="va-ops-missed-meta">
                    <span>Wait Time: <strong>{lead.waitTime}</strong></span>
                    <span>Assigned: <strong>{lead.assignedTo}</strong></span>
                  </div>
                </div>
                <span className={cn("badge", missedStatusClass[lead.status])}>
                  {lead.statusLabel}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </div>
  );
}
