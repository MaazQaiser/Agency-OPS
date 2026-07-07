"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { folioUrgencyIndicators, folioOperationalMetrics, formatRevenueAtRisk } from "@/data/folioOperationalData";
import { getFolioProgressMetrics } from "@/lib/folioProgress";
import { FolioDrawer } from "./FolioDrawer";

export function GlobalFolioStrip() {
  const metrics = getFolioProgressMetrics();
  const [animatedGoalPct, setAnimatedGoalPct] = useState(0);
  const [animatedTimePct, setAnimatedTimePct] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setAnimatedGoalPct(metrics.goalProgressPct);
      setAnimatedTimePct(metrics.timeElapsedPct * 100);
    });
    return () => cancelAnimationFrame(frame);
  }, [metrics.goalProgressPct, metrics.timeElapsedPct]);

  const stateClass = metrics.folioState === "closed" ? "closed" : metrics.urgency;

  return (
    <>
      <button
        type="button"
        className={cn(
          "folio-progress-bar global-folio-strip",
          `folio-progress-bar--${stateClass}`,
          `global-folio-strip--${metrics.folioState}`,
          metrics.folioState === "critical" && "global-folio-strip--glow",
        )}
        onClick={() => setDrawerOpen(true)}
        aria-label={`Folio ${metrics.folioNumber} agency heartbeat. Click for leadership view.`}
      >
        <div className="folio-progress-accent" aria-hidden="true" />

        <div className="folio-progress-left global-folio-left">
          <span className="folio-progress-badge">Folio {metrics.folioNumber}</span>
          <span className="folio-progress-dates">{metrics.dateRangeLabel}</span>
          <span className="folio-progress-dates global-folio-days">{metrics.daysRemainingLabel}</span>
          <span className={cn("folio-progress-risk-label", `folio-progress-risk-label--${stateClass}`)}>
            {metrics.riskStateLabel}
          </span>
        </div>

        <div className="folio-progress-center global-folio-center">
          <div className="folio-progress-track-wrap global-folio-track-wrap" aria-hidden="true">
            <div className={cn("folio-progress-track", `folio-progress-track-wrap--${stateClass}`)}>
              <div className="folio-progress-time-fill" style={{ width: `${animatedTimePct}%` }} />
              <div
                className={cn("folio-progress-fill", `folio-progress-fill--${stateClass}`)}
                style={{ width: `${animatedGoalPct}%` }}
              />
              <div
                className="folio-progress-pace-marker"
                style={{ left: `${metrics.timeElapsedPct * 100}%` }}
              />
            </div>
            <span className="folio-progress-pct">{Math.round(metrics.goalProgressPct)}%</span>
          </div>
        </div>

        <div className="folio-progress-right global-folio-right">
          <div className="folio-progress-stat global-folio-stat">
            <span className="folio-progress-stat-label">Target</span>
            <span className="folio-progress-stat-value">{metrics.targetLabel}</span>
          </div>
          <div className="folio-progress-stat global-folio-stat">
            <span className="folio-progress-stat-label">Written</span>
            <span className="folio-progress-stat-value">{metrics.writtenLabel}</span>
          </div>
          <div className="folio-progress-stat global-folio-stat">
            <span className="folio-progress-stat-label">Pace</span>
            <span
              className={cn(
                "folio-progress-stat-value",
                "folio-progress-stat-pace",
                `folio-progress-stat-pace--${stateClass}`,
              )}
            >
              {metrics.paceLabel}
            </span>
          </div>

          {metrics.folioState !== "closed" && (
            <>
              <div className="folio-progress-stat global-folio-stat global-folio-stat--secondary">
                <span className="folio-progress-stat-label">Binds</span>
                <span className="folio-progress-stat-value">{folioOperationalMetrics.pendingBinds}</span>
              </div>
              <div className="folio-progress-stat global-folio-stat global-folio-stat--secondary">
                <span className="folio-progress-stat-label">Approvals</span>
                <span className="folio-progress-stat-value">{folioOperationalMetrics.pendingApprovals}</span>
              </div>
              <div className="folio-progress-stat global-folio-stat global-folio-stat--secondary">
                <span className="folio-progress-stat-label">At Risk</span>
                <span className="folio-progress-stat-value global-folio-risk-value">
                  {formatRevenueAtRisk(folioOperationalMetrics.revenueAtRisk)}
                </span>
              </div>

              <div className="global-folio-urgency-badges" aria-label="Folio urgency indicators">
                {folioUrgencyIndicators.map((indicator) => (
                  <span
                    key={indicator.id}
                    className={cn("global-folio-urgency-badge", `global-folio-urgency-badge--${indicator.tone}`)}
                  >
                    {indicator.label}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </button>

      <FolioDrawer metrics={metrics} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
