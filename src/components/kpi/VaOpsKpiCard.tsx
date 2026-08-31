"use client";

import { cn } from "@/lib/cn";
import { isFinancialDisplayValue } from "@/lib/isFinancialDisplayValue";
import { kpiToneFromColor } from "@/lib/kpiTone";
import type { KpiPolarity, KpiTrendData } from "@/lib/kpiTrend";
import { KpiSparklineIntelligence } from "./KpiSparklineIntelligence";
import { StatusPill } from "./StatusPill";
import { TrendIndicator } from "./TrendIndicator";

export type VaOpsKpiCardProps = {
  label: string;
  value: string;
  sub: string;
  helper?: string;
  color?: string;
  className?: string;
  financial?: boolean;
  trend?: KpiTrendData;
  polarity?: KpiPolarity;
  sparkline?: boolean;
};

export function VaOpsKpiCard({
  label,
  value,
  sub,
  helper,
  color,
  className,
  financial: financialProp,
  trend,
  polarity,
  sparkline,
}: VaOpsKpiCardProps) {
  const tooltip = `${label}: ${value}: ${sub}${helper ? ` (${helper})` : ""}`;
  const financial = financialProp ?? isFinancialDisplayValue(label, value);
  const tone = kpiToneFromColor(color);
  const showSparkline = (sparkline ?? Boolean(trend)) && Boolean(trend);

  return (
    <article
      className={cn("va-ops-kpi-card aos-card--info aos-kpi-card", color, `aos-kpi-card--${tone}`, className)}
      tabIndex={0}
      aria-label={tooltip}
    >
      <div className="va-ops-kpi-tooltip" role="tooltip">
        {tooltip}
      </div>
      <div className="va-ops-kpi-label">{label}</div>
      <div className={cn("va-ops-kpi-value", financial && "aos-finance")}>{value}</div>
      {(trend || helper) && (
        <div className="aos-kpi-meta">
          {trend && (
            <TrendIndicator
              direction={trend.direction}
              label={trend.deltaLabel}
              state={trend.state}
            />
          )}
          {helper && <StatusPill tone={tone}>{helper}</StatusPill>}
        </div>
      )}
      {sub && <div className="va-ops-kpi-sub">{sub}</div>}
      {showSparkline && (
        <KpiSparklineIntelligence trend={trend} polarity={polarity} />
      )}
    </article>
  );
}
