import type { KpiColor } from "@/types";
import { cn } from "@/lib/cn";
import { emphasizeKpiSub } from "@/lib/emphasizeKpiSub";

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
}: KpiCardProps) {
  const moduleClass = variant !== "default" ? variant : "";
  const borderVariant =
    (variant === "commercial" || variant === "default") &&
    color &&
    ["primary", "green", "red", "yellow"].includes(color)
      ? color
      : undefined;

  const valueClassName =
    variant === "production"
      ? cn("kpi-val production", color)
      : variant === "retention"
        ? "kpi-val retention"
        : "kpi-value";

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
            ? { color: `var(--${color})`, ...valueStyle }
            : valueStyle
        }
      >
        {value}
      </div>
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
