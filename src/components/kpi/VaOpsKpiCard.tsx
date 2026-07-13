"use client";

import { cn } from "@/lib/cn";
import { isFinancialDisplayValue } from "@/lib/isFinancialDisplayValue";
import type { KpiPolarity, KpiTrendData } from "@/lib/kpiTrend";
import { KpiSparklineIntelligence } from "./KpiSparklineIntelligence";

export type VaOpsKpiCardProps = {
  label: string;
  value: string;
  sub: string;
  helper?: string;
  color?: string;
  className?: string;
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
  trend,
  polarity,
  sparkline = true,
}: VaOpsKpiCardProps) {
  const tooltip = `${label}: ${value}: ${sub}${helper ? ` (${helper})` : ""}`;
  const financial = isFinancialDisplayValue(label, value);

  return (
    <article
      className={cn("va-ops-kpi-card aos-card--info", color, className)}
      tabIndex={0}
      title={tooltip}
      aria-label={tooltip}
    >
      <div className="va-ops-kpi-tooltip" role="tooltip">
        {tooltip}
      </div>
      <div className="va-ops-kpi-label">{label}</div>
      <div className={cn("va-ops-kpi-value", financial && "aos-finance")}>{value}</div>
      {sparkline && (
        <KpiSparklineIntelligence label={label} trend={trend} polarity={polarity} />
      )}
      <div className="va-ops-kpi-sub">{sub}</div>
      {helper && <div className="va-ops-kpi-helper">{helper}</div>}
    </article>
  );
}
