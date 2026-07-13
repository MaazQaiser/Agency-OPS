import type { KpiColor } from "@/types";
import { cn } from "@/lib/cn";
import { emphasizeKpiSub } from "@/lib/emphasizeKpiSub";
import { isFinancialDisplayValue } from "@/lib/isFinancialDisplayValue";
import { KpiSparklineIntelligence } from "@/components/kpi/KpiSparklineIntelligence";
import type { KpiPolarity, KpiTrendData } from "@/lib/kpiTrend";

export type KpiCardVariant = "default" | "production" | "retention" | "commercial";

export type KpiCardProps = {
  label: string;
  value: string;
  sub?: string;
  color?: KpiColor;
  variant?: KpiCardVariant;
  featured?: boolean;
  progress?: { width: string; color: KpiColor };
  valueStyle?: React.CSSProperties;
  className?: string;
  trend?: KpiTrendData;
  polarity?: KpiPolarity;
  sparkline?: boolean;
};

export function KpiCard({
  label,
  value,
  sub,
  color,
  variant = "default",
  featured,
  progress,
  valueStyle,
  className,
  trend,
  polarity,
  sparkline = true,
}: KpiCardProps) {
  const moduleClass = variant !== "default" ? variant : "";
  const borderVariant =
    (variant === "commercial" || variant === "default") &&
    color &&
    ["primary", "green", "red", "yellow"].includes(color)
      ? color
      : undefined;

  const financial = isFinancialDisplayValue(label, value);

  const valueClassName =
    variant === "production"
      ? cn("kpi-val production", color, financial && "aos-finance")
      : variant === "retention"
        ? cn("kpi-val retention", financial && "aos-finance")
        : cn("kpi-value", financial && "aos-finance");

  const labelClassName =
    variant === "production"
      ? "kpi-label production"
      : variant === "retention"
        ? "kpi-label retention"
        : "kpi-label";

  const subClassName =
    variant === "production"
      ? "kpi-sub production"
      : variant === "retention"
        ? "kpi-sub retention"
        : "kpi-sub";

  return (
    <div
      className={cn(
        "kpi-card",
        "aos-card--info",
        moduleClass,
        borderVariant,
        featured && "featured",
        className,
      )}
    >
      <div className={labelClassName}>{label}</div>
      <div
        className={valueClassName}
        style={
          variant === "retention" && color
            ? { color: financial ? undefined : `var(--${color})`, ...valueStyle }
            : valueStyle
        }
      >
        {value}
      </div>
      {sparkline && (
        <KpiSparklineIntelligence label={label} trend={trend} polarity={polarity} />
      )}
      {sub && <div className={subClassName}>{emphasizeKpiSub(sub)}</div>}
      {progress && variant === "production" && (
        <div className="progress-bar production">
          <div
            className={`progress-fill ${progress.color}`}
            style={{ width: progress.width }}
          />
        </div>
      )}
    </div>
  );
}

export function KpiGrid({
  variant = "default",
  children,
  className,
}: {
  variant?: KpiCardVariant;
  children: React.ReactNode;
  className?: string;
}) {
  const gridClass =
    variant === "production"
      ? "kpi-grid production"
      : variant === "retention"
        ? "kpi-grid retention"
        : "kpi-grid";

  return <div className={cn(gridClass, className)}>{children}</div>;
}
