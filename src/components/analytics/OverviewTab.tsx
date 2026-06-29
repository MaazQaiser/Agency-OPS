"use client";

import {
  analyticsAiInsights,
  executiveSummary,
  overviewKpis,
  overviewTrendCharts,
} from "@/data/analytics";
import { cn } from "@/lib/cn";
import { AnalyticsAiInsights } from "./AnalyticsAiInsights";
import { AnalyticsKpiGrid } from "./AnalyticsKpiCard";
import { AnalyticsTrendChartGrid } from "./AnalyticsTrendChart";

const execToneClass = {
  positive: "analytics-exec--positive",
  negative: "analytics-exec--negative",
  neutral: "analytics-exec--neutral",
  warning: "analytics-exec--warning",
} as const;

import type { AnalyticsTimeFilterId } from "@/data/analytics";
import { AnalyticsPeriodBadge } from "./AnalyticsPeriodBadge";

export function OverviewTab({ period }: { period: AnalyticsTimeFilterId }) {
  return (
    <div className="analytics-tab-view">
      <div className="analytics-tab-period-row">
        <AnalyticsPeriodBadge period={period} />
      </div>
      <AnalyticsKpiGrid kpis={overviewKpis} />

      <section className="analytics-exec-summary" aria-label="Executive summary">
        {executiveSummary.map((item) => (
          <article
            key={item.id}
            className={cn("analytics-exec-card", execToneClass[item.tone])}
          >
            <span className="analytics-exec-label">{item.label}</span>
            <strong className="analytics-exec-value">{item.value}</strong>
            <span className="analytics-exec-detail">{item.detail}</span>
          </article>
        ))}
      </section>

      <section className="analytics-charts-section" aria-label="Performance trends">
        <AnalyticsTrendChartGrid charts={overviewTrendCharts} />
      </section>

      <AnalyticsAiInsights insights={analyticsAiInsights.overview} />
    </div>
  );
}
