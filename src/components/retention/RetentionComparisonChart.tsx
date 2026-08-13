"use client";

import { TargetLine } from "@/components/kpi/TargetLine";
import { cn } from "@/lib/cn";
import { parseExistingPercent, retentionStatusFromColor } from "@/lib/retentionScorecardView";

export type RetentionComparisonPoint = {
  id: string;
  label: string;
  value: string;
  color?: string;
};

type RetentionComparisonChartProps = {
  title: string;
  subtitle: string;
  points: RetentionComparisonPoint[];
  goalValue?: string;
  goalLabel?: string;
};

export function RetentionComparisonChart({
  title,
  subtitle,
  points,
  goalValue,
  goalLabel,
}: RetentionComparisonChartProps) {
  const goal = goalValue ? parseExistingPercent(goalValue) : null;
  const parsed = points
    .map((point) => ({ ...point, percent: parseExistingPercent(point.value) }))
    .filter((point): point is RetentionComparisonPoint & { percent: number } => point.percent != null);

  if (!parsed.length) return null;

  const max = Math.max(100, ...parsed.map((p) => p.percent), goal ?? 0);
  const goalBottom = goal != null ? (goal / max) * 100 : null;

  return (
    <section className="retention-trend-card" aria-label={title}>
      <header className="retention-trend-header">
        <div>
          <h3 className="retention-trend-title">{title}</h3>
          <p className="retention-trend-sub">{subtitle}</p>
        </div>
        {goalLabel && <span className="retention-trend-goal">{goalLabel}</span>}
      </header>

      <div className="retention-trend-plot">
        <div className="retention-trend-values">
          {parsed.map((point) => (
            <span key={`v-${point.id}`} className="retention-trend-col-value">
              {point.value}
            </span>
          ))}
        </div>
        <div className="retention-trend-stage" role="img" aria-label={title}>
          {goalBottom != null && <TargetLine bottomPct={goalBottom} label={goalLabel} />}
          {parsed.map((point) => {
            const status = point.color ? retentionStatusFromColor(point.color) : null;
            return (
              <div key={point.id} className="retention-trend-bar-track">
                <div
                  className={cn("retention-trend-bar-fill", status && `retention-trend-bar-fill--${status.tone}`)}
                  style={{ height: `${(point.percent / max) * 100}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="retention-trend-labels">
          {parsed.map((point) => (
            <span key={`l-${point.id}`} className="retention-trend-col-label">
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
