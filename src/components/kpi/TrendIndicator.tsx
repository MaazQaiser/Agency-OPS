import { cn } from "@/lib/cn";
import type { KpiTrendState } from "@/lib/kpiTrend";

type TrendDirection = "up" | "down" | "stable" | "flat";

type TrendIndicatorProps = {
  direction: TrendDirection;
  label: string;
  state?: KpiTrendState | "positive" | "negative" | "neutral" | "warning";
  className?: string;
};

const ARROW: Record<TrendDirection, string> = {
  up: "↑",
  down: "↓",
  stable: "→",
  flat: "→",
};

export function TrendIndicator({
  direction,
  label,
  state,
  className,
}: TrendIndicatorProps) {
  const tone =
    state ??
    (direction === "up" ? "positive" : direction === "down" ? "negative" : "neutral");

  return (
    <span
      className={cn("aos-trend", `aos-trend--${tone}`, className)}
      aria-label={label}
    >
      <span className="aos-trend-arrow" aria-hidden="true">
        {ARROW[direction]}
      </span>
      <span className="aos-trend-label">{label}</span>
    </span>
  );
}
