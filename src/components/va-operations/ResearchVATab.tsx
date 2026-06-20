"use client";

import { useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  featuredProspectId,
  handoffQueue,
  leadSources,
  prospectQueue,
  researchActivity,
  researchKpis,
  researchVAHeader,
  type HandoffPriority,
  type ResearchProspect,
} from "@/data/researchVA";
import { cn } from "@/lib/cn";
import { ProspectDrawer } from "./ProspectDrawer";
import { RoleTabHeader } from "./RoleTabHeader";

const prospectStatusClass = {
  researching: "badge-blue",
  "ready-for-qualification": "badge-yellow",
  qualified: "badge-green",
  "handed-off": "badge-gray",
} as const;

const handoffPriorityClass: Record<HandoffPriority, string> = {
  high: "badge-red",
  medium: "badge-yellow",
};

const qualificationStatusClass = {
  ready: "badge-green",
  incomplete: "badge-yellow",
} as const;

export function ResearchVATab() {
  const [selectedId, setSelectedId] = useState(featuredProspectId);
  const [drawerProspect, setDrawerProspect] = useState<ResearchProspect | null>(null);

  const focusedProspect = useMemo(
    () => prospectQueue.find((p) => p.id === selectedId) ?? prospectQueue[0],
    [selectedId],
  );

  const openDrawer = (prospect: ResearchProspect) => {
    setSelectedId(prospect.id);
    setDrawerProspect(prospect);
  };

  return (
    <div className="va-ops-role-view va-ops-research">
      <RoleTabHeader
        title={researchVAHeader.title}
        subtitle={researchVAHeader.subtitle}
        quickActions={researchVAHeader.quickActions}
      />

      <section className="va-ops-kpi-strip" aria-label="Research performance summary">
        <div className="va-ops-kpi-grid">
          {researchKpis.map((kpi) => (
            <article key={kpi.label} className={cn("va-ops-kpi-card", kpi.color)}>
              <div className="va-ops-kpi-label">{kpi.label}</div>
              <div className="va-ops-kpi-value">{kpi.value}</div>
              <div className="va-ops-kpi-sub">{kpi.sub}</div>
              <div className="va-ops-kpi-helper">{kpi.helper}</div>
            </article>
          ))}
        </div>
      </section>

      <div className="va-ops-content-grid">
        <section className="va-ops-panel va-ops-prospect-panel" aria-label="Prospect queue">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Prospect Queue</h3>
            <p className="va-ops-section-sub">Leads currently under research.</p>
          </div>
          <ul className="va-ops-prospect-list">
            {prospectQueue.map((prospect) => (
              <li
                key={prospect.id}
                className={cn("va-ops-prospect-row", selectedId === prospect.id && "selected")}
              >
                <button
                  type="button"
                  className="va-ops-prospect-main"
                  onClick={() => {
                    setSelectedId(prospect.id);
                    openDrawer(prospect);
                  }}
                >
                  <div className="va-ops-prospect-business">{prospect.business}</div>
                  <div className="va-ops-prospect-meta">
                    <span>Industry: <strong>{prospect.industry}</strong></span>
                    <span>Source: <strong>{prospect.source}</strong></span>
                    <span>Location: <strong>{prospect.location}</strong></span>
                    <span>Assigned: <strong>{prospect.assignedTo}</strong></span>
                  </div>
                  <span className={cn("badge", prospectStatusClass[prospect.status])}>
                    {prospect.statusLabel}
                  </span>
                </button>
                <button
                  type="button"
                  className="va-ops-action-btn"
                  onClick={() => openDrawer(prospect)}
                >
                  {prospect.cta}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="va-ops-panel va-ops-sources-panel" aria-label="Lead sources">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Lead Sources</h3>
            <p className="va-ops-section-sub">Where opportunities originate.</p>
          </div>
          <ul className="va-ops-source-list">
            {leadSources.map((item) => (
              <li key={item.id} className="va-ops-source-row">
                <span className="va-ops-source-name">{item.source}</span>
                <span className="va-ops-source-count">{item.count}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="va-ops-research-intel-grid">
        <section className="va-ops-panel va-ops-intelligence-panel" aria-label="Lead intelligence">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Lead Intelligence</h3>
            <p className="va-ops-section-sub">
              Enriched profile for <strong>{focusedProspect.business}</strong>
            </p>
          </div>
          <dl className="va-ops-intel-grid">
            <div><dt>Business Name</dt><dd>{focusedProspect.intelligence.businessName}</dd></div>
            <div><dt>Owner Name</dt><dd>{focusedProspect.intelligence.ownerName}</dd></div>
            <div><dt>Phone</dt><dd>{focusedProspect.intelligence.phone}</dd></div>
            <div><dt>Email</dt><dd>{focusedProspect.intelligence.email}</dd></div>
            <div><dt>Website</dt><dd>{focusedProspect.intelligence.website}</dd></div>
            <div><dt>Current Carrier</dt><dd>{focusedProspect.intelligence.currentCarrier}</dd></div>
            <div><dt>Renewal Date</dt><dd>{focusedProspect.intelligence.renewalDate}</dd></div>
            <div><dt>Estimated Premium</dt><dd>{focusedProspect.intelligence.estimatedPremium}</dd></div>
          </dl>
          <div className="va-ops-coverage-gaps">
            <div className="va-ops-intel-label">Coverage Gaps</div>
            <ul className="va-ops-gap-list">
              {focusedProspect.intelligence.coverageGaps.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          </div>
          <div className="va-ops-intel-notes">
            <div className="va-ops-intel-label">Notes</div>
            <ul className="va-ops-gap-list">
              {focusedProspect.intelligence.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
          <button type="button" className="va-ops-action-btn va-ops-push-dialer">
            <AppIcon name="send" size={14} strokeWidth={2.25} />
            Push to Dialer
          </button>
        </section>

        <section className="va-ops-panel va-ops-qualification-panel" aria-label="Qualification criteria">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Qualification Criteria</h3>
            <p className="va-ops-section-sub">Standardized lead quality checklist.</p>
          </div>
          <ul className="va-ops-qual-checklist">
            {focusedProspect.qualification.items.map((item) => (
              <li key={item.id} className={item.checked ? "checked" : ""}>
                <AppIcon name={item.checked ? "check" : "x"} size={15} strokeWidth={2.5} />
                {item.label}
              </li>
            ))}
          </ul>
          <div className="va-ops-qual-status">
            <span className="va-ops-intel-label">Status</span>
            <span
              className={cn(
                "badge",
                qualificationStatusClass[focusedProspect.qualification.status],
              )}
            >
              {focusedProspect.qualification.status === "ready" ? "Ready" : "Incomplete"}
            </span>
          </div>
        </section>
      </div>

      <div className="va-ops-research-bottom-grid">
        <section className="va-ops-panel va-ops-research-activity-panel" aria-label="Research activity">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Research Activity</h3>
            <p className="va-ops-section-sub">Recent sourcing and enrichment work.</p>
          </div>
          <ul className="va-ops-activity-feed">
            {researchActivity.map((item) => (
              <li key={item.id} className="va-ops-activity-item">
                <span className="va-ops-activity-dot" aria-hidden="true" />
                <div>
                  <div className="va-ops-activity-text">{item.text}</div>
                  <time className="va-ops-activity-time">{item.time}</time>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="va-ops-panel va-ops-handoff-panel" aria-label="Ready for outreach">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Ready for Outreach</h3>
            <p className="va-ops-section-sub">Bridge between Research and Dialer.</p>
          </div>
          <div className="va-ops-handoff-table-wrap">
            <table className="va-ops-handoff-table">
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Industry</th>
                  <th>Priority</th>
                  <th>Assigned Dialer</th>
                  <th>Transfer Time</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {handoffQueue.map((item) => (
                  <tr key={item.id}>
                    <td className="va-ops-handoff-name">{item.leadName}</td>
                    <td>{item.industry}</td>
                    <td>
                      <span className={cn("badge", handoffPriorityClass[item.priority])}>
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                      </span>
                    </td>
                    <td>{item.assignedDialer}</td>
                    <td className="va-ops-handoff-time">{item.transferTime}</td>
                    <td>
                      <button type="button" className="va-ops-action-btn">
                        {item.cta}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <ProspectDrawer prospect={drawerProspect} onClose={() => setDrawerProspect(null)} />
    </div>
  );
}
