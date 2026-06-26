"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { KpiSparklineIntelligence } from "@/components/kpi/KpiSparklineIntelligence";
import { getFolioProgressMetrics } from "@/lib/folioProgress";

export function FolioProgressBar() {
  const metrics = getFolioProgressMetrics();
  const [animatedGoalPct, setAnimatedGoalPct] = useState(0);
  const [animatedTimePct, setAnimatedTimePct] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setAnimatedGoalPct(metrics.goalProgressPct);
      setAnimatedTimePct(metrics.timeElapsedPct * 100);
    });
    return () => cancelAnimationFrame(frame);
  }, [metrics.goalProgressPct, metrics.timeElapsedPct]);

  const paceDelta = Math.round(metrics.performancePacePct - 100);
  const paceBehind = paceDelta < 0;

  return (
    <div
      className={cn("folio-progress-bar", `folio-progress-bar--${metrics.urgency}`)}
      role="region"
      aria-label={`Folio ${metrics.folioNumber} progress`}
    >
      <div className="folio-progress-accent" aria-hidden="true" />

      <div className="folio-progress-left">
        <span className="folio-progress-badge">Folio {metrics.folioNumber}</span>
        <span className="folio-progress-dates">{metrics.dateRangeLabel}</span>
        <span
          className={cn(
            "folio-progress-urgency",
            `folio-progress-urgency--${metrics.urgency}`,
            metrics.daysRemaining === 0 && "folio-progress-urgency--ended",
          )}
        >
          {metrics.daysRemainingShortLabel}
        </span>
        <span className={cn("folio-progress-completion-pill", `folio-progress-completion-pill--${metrics.urgency}`)}>
          {metrics.completionLabel}
        </span>
        <span className={cn("folio-progress-risk-label", `folio-progress-risk-label--${metrics.urgency}`)}>
          {metrics.riskStateLabel}
        </span>
      </div>

      <div className="folio-progress-center">
        <div
          className={cn("folio-progress-track-wrap", `folio-progress-track-wrap--${metrics.urgency}`)}
          tabIndex={0}
          aria-label={`${Math.round(metrics.goalProgressPct)}% of premium goal written`}
        >
          <div className="folio-progress-track">
            <div
              className="folio-progress-time-fill"
              style={{ width: `${animatedTimePct}%` }}
              aria-hidden="true"
            />
            <div
              className={cn("folio-progress-fill", `folio-progress-fill--${metrics.urgency}`)}
              style={{ width: `${animatedGoalPct}%` }}
            />
            <div
              className="folio-progress-pace-marker"
              style={{ left: `${metrics.timeElapsedPct * 100}%` }}
              aria-hidden="true"
              title="Expected pace"
            />
          </div>
          <span className="folio-progress-pct">{Math.round(metrics.goalProgressPct)}%</span>
        </div>

        <div className="folio-progress-tooltip" role="tooltip">
          <div className="folio-progress-tooltip-header">
            <span>Folio {metrics.folioNumber} cycle</span>
            <span className={cn("folio-progress-tooltip-status", `folio-progress-tooltip-status--${metrics.urgency}`)}>
              {metrics.urgency}
            </span>
          </div>
          <div className="folio-progress-tooltip-row">
            <span className="folio-progress-tooltip-label">Days elapsed</span>
            <span className="folio-progress-tooltip-value">
              {metrics.daysElapsed} / {metrics.daysTotal}
            </span>
          </div>
          <div className="folio-progress-tooltip-row">
            <span className="folio-progress-tooltip-label">Days remaining</span>
            <span className="folio-progress-tooltip-value">{metrics.daysRemaining}</span>
          </div>
          <div className="folio-progress-tooltip-row">
            <span className="folio-progress-tooltip-label">Performance pace</span>
            <span className="folio-progress-tooltip-value">
              {Math.round(metrics.performancePacePct)}%
              <span
                className={cn(
                  "folio-progress-tooltip-delta",
                  paceBehind ? "folio-progress-tooltip-delta--down" : "folio-progress-tooltip-delta--up",
                )}
              >
                {paceDelta >= 0 ? "+" : ""}
                {paceDelta}% vs expected
              </span>
            </span>
          </div>
          <div className="folio-progress-tooltip-row">
            <span className="folio-progress-tooltip-label">Folio {metrics.previousFolio.number}</span>
            <span className="folio-progress-tooltip-value">
              {metrics.previousFolio.pacePct}% closed
              <span
                className={cn(
                  "folio-progress-tooltip-delta",
                  metrics.previousFolioDeltaPct >= 0
                    ? "folio-progress-tooltip-delta--up"
                    : "folio-progress-tooltip-delta--down",
                )}
              >
                {metrics.previousFolioDeltaPct >= 0 ? "+" : ""}
                {Math.round(metrics.previousFolioDeltaPct)}%
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="folio-progress-right">
        <div className="folio-progress-stat">
          <span className="folio-progress-stat-label">Target</span>
          <span className="folio-progress-stat-value">{metrics.targetLabel}</span>
        </div>
        <span className="folio-progress-stat-divider" aria-hidden="true" />
        <div className="folio-progress-stat folio-progress-stat--sparkline">
          <span className="folio-progress-stat-label">Written</span>
          <span className="folio-progress-stat-value">{metrics.writtenLabel}</span>
          <KpiSparklineIntelligence label="Premium Written" compact />
        </div>
        <span className="folio-progress-stat-divider" aria-hidden="true" />
        <div className="folio-progress-stat folio-progress-stat--sparkline">
          <span className="folio-progress-stat-label">Pace</span>
          <span
            className={cn(
              "folio-progress-stat-value",
              "folio-progress-stat-pace",
              `folio-progress-stat-pace--${metrics.urgency}`,
            )}
          >
            {metrics.paceLabel}
          </span>
          <KpiSparklineIntelligence label="Folio Pace" polarity="higher-better" compact />
        </div>
      </div>
    </div>
  );
}
