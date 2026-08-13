"use client";

import { cn } from "@/lib/cn";
import type { AnalyticsKpi } from "@/data/analytics";
import { isFinancialDisplayValue } from "@/lib/isFinancialDisplayValue";
import { KpiSparkline } from "./KpiSparkline";
import { TrendIndicator } from "@/components/kpi/TrendIndicator";

const trendState = {
  positive: "positive",
  negative: "negative",
  neutral: "neutral",
} as const;

export function AnalyticsKpiCard({ kpi, className }: { kpi: AnalyticsKpi; className?: string }) {
  const financial = isFinancialDisplayValue(kpi.label, kpi.value);

  return (
    <div className={cn("analytics-kpi-card aos-card--info aos-kpi-card", `analytics-kpi-card--${kpi.trend}`, `aos-kpi-card--${kpi.trend === "negative" ? "danger" : kpi.trend === "positive" ? "positive" : "info"}`, className)}>
      <div className="analytics-kpi-label">{kpi.label}</div>
      <div className={cn("analytics-kpi-value", financial && "aos-finance")}>{kpi.value}</div>
      <div className="analytics-kpi-delta-row">
        <TrendIndicator
          direction={kpi.trendDirection === "flat" ? "flat" : kpi.trendDirection}
          label={kpi.delta}
          state={trendState[kpi.trend]}
        />
      </div>
      {kpi.benchmark ? <div className="analytics-kpi-benchmark">{kpi.benchmark}</div> : null}
      {kpi.sparkline.length >= 2 && (
        <div className="analytics-kpi-sparkline-row">
          <KpiSparkline data={kpi.sparkline} trend={kpi.trend} width={120} height={28} />
        </div>
      )}
      <div className="analytics-kpi-sub">{kpi.sub}</div>
    </div>
  );
}

export function AnalyticsKpiGrid({ kpis }: { kpis: AnalyticsKpi[] }) {
  return (
    <div className="analytics-kpi-grid ih-section--primary">
      {kpis.map((kpi, index) => (
        <AnalyticsKpiCard
          key={kpi.id}
          kpi={kpi}
          className={index < 3 ? "ih-kpi--primary" : "ih-kpi--secondary"}
        />
      ))}
    </div>
  );
}
