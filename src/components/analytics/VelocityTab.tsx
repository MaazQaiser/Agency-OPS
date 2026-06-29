"use client";

import {
  analyticsAiInsights,
  velocityBottleneckClass,
  velocityBottlenecks,
  velocityKpis,
  velocityStages,
} from "@/data/analytics";
import { cn } from "@/lib/cn";
import { AnalyticsAiInsights } from "./AnalyticsAiInsights";
import { AnalyticsKpiGrid } from "./AnalyticsKpiCard";

import type { AnalyticsTimeFilterId } from "@/data/analytics";
import { AnalyticsPeriodBadge } from "./AnalyticsPeriodBadge";

export function VelocityTab({ period }: { period: AnalyticsTimeFilterId }) {
  return (
    <div className="analytics-tab-view">
      <div className="analytics-tab-period-row">
        <AnalyticsPeriodBadge period={period} />
      </div>
      <AnalyticsKpiGrid kpis={velocityKpis} />

      <section className="va-ops-panel analytics-panel-compact" aria-label="Speed analysis">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Speed Analysis</h3>
          <p className="va-ops-section-sub">Stage-by-stage cycle time vs benchmark.</p>
        </div>
        <div className="analytics-velocity-stages">
          {velocityStages.map((stage) => {
            const delta = stage.avgDays - stage.benchmark;
            const behind = delta > 0;
            return (
              <article key={stage.id} className={cn("analytics-velocity-stage", `analytics-velocity-stage--${stage.trend}`)}>
                <div className="analytics-velocity-stage-header">
                  <span className="analytics-velocity-stage-label">{stage.label}</span>
                  <span className="analytics-velocity-stage-value">{stage.avgDays} days</span>
                </div>
                <div className="analytics-velocity-stage-bar-track">
                  <div
                    className="analytics-velocity-stage-bar-fill"
                    style={{ width: `${Math.min((stage.avgDays / (stage.benchmark * 1.5)) * 100, 100)}%` }}
                  />
                  <div
                    className="analytics-velocity-stage-benchmark"
                    style={{ left: `${(stage.benchmark / (stage.benchmark * 1.5)) * 100}%` }}
                    title={`Benchmark: ${stage.benchmark} days`}
                  />
                </div>
                <div className="analytics-velocity-stage-footer">
                  <span>Benchmark: {stage.benchmark}d</span>
                  <span className={cn(behind ? "analytics-velocity-behind" : "analytics-velocity-ahead")}>
                    {behind ? `+${delta.toFixed(1)}d behind` : `${Math.abs(delta).toFixed(1)}d ahead`}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="va-ops-panel analytics-panel-compact" aria-label="Bottleneck detection">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Bottleneck Detection</h3>
          <p className="va-ops-section-sub">Segments running slower than benchmark.</p>
        </div>
        <ul className="analytics-bottleneck-list">
          {velocityBottlenecks.map((item) => (
            <li key={item.id} className={cn("analytics-bottleneck-item", velocityBottleneckClass[item.severity])}>
              <span className="analytics-bottleneck-segment">{item.segment}</span>
              <p className="analytics-bottleneck-message">{item.message}</p>
              <span className="analytics-bottleneck-delta">{item.delta}</span>
            </li>
          ))}
        </ul>
      </section>

      <AnalyticsAiInsights insights={analyticsAiInsights.velocity} />
    </div>
  );
}
