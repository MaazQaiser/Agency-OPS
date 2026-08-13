"use client";

import { StatusPill } from "@/components/kpi/StatusPill";
import { HubEmptyState } from "@/components/state";
import { cn } from "@/lib/cn";
import { retentionStatusFromColor } from "@/lib/retentionScorecardView";

export type RetentionDepartmentRow = {
  id: string;
  name: string;
  retention: string;
  color?: string;
  goal: string;
  pif: string;
  saves: string;
  signal: string;
};

type RetentionDepartmentPanelProps = {
  title: string;
  actionLabel: string;
  headers: string[];
  rows: RetentionDepartmentRow[];
  emptyTitle: string;
  emptyDescription: string;
  onView: (id: string) => void;
};

export function RetentionDepartmentPanel({
  title,
  actionLabel,
  headers,
  rows,
  emptyTitle,
  emptyDescription,
  onView,
}: RetentionDepartmentPanelProps) {
  if (rows.length === 0) {
    return (
      <section className="retention-risk-section" aria-label={title}>
        <h3 className="retention-risk-title">{title}</h3>
        <HubEmptyState compact title={emptyTitle} description={emptyDescription} icon="users" />
      </section>
    );
  }

  return (
    <section className="retention-risk-section" aria-label={title}>
      <h3 className="retention-risk-title">{title}</h3>
      <div className="retention-risk-table-wrap">
        <table className="retention-risk-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const status = retentionStatusFromColor(row.color);
              const emphasis = status.tone === "danger" ? "high" : status.tone === "warning" ? "watch" : "ok";
              return (
                <tr key={row.id} className={cn("retention-risk-row", `retention-risk-row--${emphasis}`)}>
                  <td>
                    <span className="retention-risk-name">{row.name}</span>
                  </td>
                  <td>
                    <span className={cn("retention-risk-score", `retention-risk-score--${status.tone}`)}>
                      {row.retention}
                    </span>
                  </td>
                  <td>
                    <StatusPill tone={status.tone}>{status.label}</StatusPill>
                  </td>
                  <td>
                    <span className="retention-risk-meta">{row.goal}</span>
                  </td>
                  <td>
                    <span className="retention-risk-meta retention-risk-mono">{row.pif}</span>
                  </td>
                  <td>
                    <span className="retention-risk-signal">{row.signal}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="retention-risk-action"
                      onClick={() => onView(row.id)}
                    >
                      {actionLabel}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="retention-risk-cards">
        {rows.map((row) => {
          const status = retentionStatusFromColor(row.color);
          return (
            <li key={`card-${row.id}`} className="retention-risk-card">
              <div className="retention-risk-card-top">
                <strong className="retention-risk-name">{row.name}</strong>
                <StatusPill tone={status.tone}>{status.label}</StatusPill>
              </div>
              <p className={cn("retention-risk-score", `retention-risk-score--${status.tone}`)}>{row.retention}</p>
              <p className="retention-risk-signal">{row.signal}</p>
              <p className="retention-risk-meta">{row.goal} · PIF {row.pif}</p>
              <button type="button" className="retention-risk-action" onClick={() => onView(row.id)}>
                {actionLabel}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
