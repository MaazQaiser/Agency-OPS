"use client";

import { useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { submissions, vaKpis, vaLeaderboard } from "@/data/commercialSubmissions";
import {
  agingThresholds,
  filterSubmissions,
  getRowClass,
  getStatusBadgeClass,
  needsMarketWarning,
} from "@/lib/commercialHelpers";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";

const vaTeam = [
  { name: "Hamad", userId: "jaffer" },
  { name: "JoJo", userId: "jojo" },
  { name: "Tracie", userId: "tracie" },
] as const;

export function VADashboardTab() {
  const [vaFilter, setVaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(
    () => filterSubmissions(submissions, { va: vaFilter, status: statusFilter }),
    [vaFilter, statusFilter]
  );

  return (
    <>
      <div className="section-header section-header-with-filter">
        <div className="section-header-main">
          <div className="section-title">VA Operations Dashboard</div>
          <div className="section-sub name-badge-row">
            {vaTeam.map((member) => (
              <UserChip key={member.name} userId={member.userId} name={member.name} className="name-badge-user-chip" />
            ))}
          </div>
        </div>
        <div className="header-filter-group section-header-filters">
          <select
            className="header-filter-select"
            value={vaFilter}
            onChange={(e) => setVaFilter(e.target.value)}
            aria-label="Filter by VA"
          >
            <option value="all">All VAs</option>
            {vaTeam.map((member) => (
              <option key={member.name} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>
          <select
            className="header-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="Quoted">Quoted</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
            <option value="Declined">Declined</option>
          </select>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">My Open Subs</div>
          <div className="kpi-value">{vaKpis.open}</div>
          <div className="kpi-sub">assigned to you</div>
        </div>
        <div className="kpi-card yellow">
          <div className="kpi-label">Due Today</div>
          <div className="kpi-value">{vaKpis.due}</div>
          <div className="kpi-sub">follow-ups</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-label">Overdue</div>
          <div className="kpi-value">{vaKpis.overdue}</div>
          <div className="kpi-sub">needs escalation</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">Quoted</div>
          <div className="kpi-value">{vaKpis.quoted}</div>
          <div className="kpi-sub">awaiting bind decision</div>
        </div>
      </div>

      <hr className="divider" />

      <div className="chart-card" style={{ marginBottom: 20 }}>
        <div className="chart-title">Weekly Leaderboard — Submissions Worked</div>
        {vaLeaderboard.map((row, i) => (
          <div key={row.name} className="va-row">
            <div className="va-rank">{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div className="va-name">{row.name}</div>
              <div className="progress-bar" style={{ marginTop: 6 }}>
                <div className="progress-fill" style={{ width: row.width, background: row.color === "green" ? "var(--green)" : row.color === "yellow" ? "var(--yellow)" : "var(--primary)" }} />
              </div>
            </div>
            <div className="va-stat">{row.actions} actions</div>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>VA</th>
              <th>LOB</th>
              <th>Days Open</th>
              <th>Markets</th>
              <th>Quotes</th>
              <th>Status</th>
              <th>Follow-Up</th>
              <th>Missing Docs</th>
              <th>Aging</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className={getRowClass(s.status, s.daysOpen)}>
                <td><strong>{s.client}</strong></td>
                <td>{s.va}</td>
                <td>{s.lob}</td>
                <td>{s.daysOpen}</td>
                <td>{s.markets} {needsMarketWarning(s) && <span className="mkt-warn"><AppIcon name="triangle-alert" size={12} strokeWidth={2.5} /> &lt;3</span>}</td>
                <td>{s.quotes}</td>
                <td><span className={`badge ${getStatusBadgeClass(s.status, s.daysOpen)}`}>{s.status === "Overdue" || (s.daysOpen > 10 && s.status !== "Bound" && s.status !== "Quoted") ? "Overdue" : s.status}</span></td>
                <td style={{ fontSize: "var(--font-size-12)" }}>{s.followUp || "—"}</td>
                <td style={{ fontSize: "var(--font-size-12)", color: s.missingDocs !== "None" && s.missingDocs !== "N/A" ? "var(--red)" : "var(--text-muted)" }}>{s.missingDocs}</td>
                <td>
                  <div className="aging-bar">
                    {agingThresholds.map((t) => (
                      <div key={t} className={getAgingDotClass(s.daysOpen, t)} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function getAgingDotClass(days: number, threshold: number): string {
  let cls = "aging-dot";
  if (days > threshold) cls += days > 10 ? " filled-red" : days > 4 ? " filled-yellow" : " filled-green";
  return cls;
}
