"use client";

import { cn } from "@/lib/cn";
import type { AnalyticsKpi } from "@/data/analytics";
import { isFinancialDisplayValue } from "@/lib/isFinancialDisplayValue";
import { KpiSparkline } from "./KpiSparkline";

const trendArrow: Record<AnalyticsKpi["trendDirection"], string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};

export function AnalyticsKpiCard({ kpi }: { kpi: AnalyticsKpi }) {
  const financial = isFinancialDisplayValue(kpi.label, kpi.value);

  return (
    <div className={cn("analytics-kpi-card aos-card--info", `analytics-kpi-card--${kpi.trend}`)}>
      <div className="analytics-kpi-label">{kpi.label}</div>
      <div className={cn("analytics-kpi-value", financial && "aos-finance")}>{kpi.value}</div>
      <div className="analytics-kpi-delta-row">
        <span className={cn("analytics-kpi-delta", `analytics-kpi-delta--${kpi.trend}`)}>
          <span className="analytics-kpi-arrow" aria-hidden="true">
            {trendArrow[kpi.trendDirection]}
          </span>
          {kpi.delta}
        </span>
      </div>
      {kpi.benchmark ? <div className="analytics-kpi-benchmark">{kpi.benchmark}</div> : null}
      <div className="analytics-kpi-sparkline-row">
        <KpiSparkline data={kpi.sparkline} trend={kpi.trend} width={72} height={28} />
      </div>
      <div className="analytics-kpi-sub">{kpi.sub}</div>
    </div>
  );
}

export function AnalyticsKpiGrid({ kpis }: { kpis: AnalyticsKpi[] }) {
  return (
    <div className="analytics-kpi-grid">
      {kpis.map((kpi) => (
        <AnalyticsKpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}
