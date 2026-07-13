"use client";

import { cn } from "@/lib/cn";
import type { KpiTrend } from "@/data/analytics";

type KpiSparklineProps = {
  data: number[];
  trend: KpiTrend;
  width?: number;
  height?: number;
  className?: string;
};

/**
 * Analytics Hub Signature Element: KPI Sparkline
 * 7-point sparkline. Hub cyan color (#0891B2). Shifts to rose on negative trend.
 */
export function KpiSparkline({ data, trend, width = 64, height = 24, className }: KpiSparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pad = 2;
  const usableW = width - pad * 2;
  const usableH = height - pad * 2;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * usableW;
    const y = pad + (1 - (v - min) / range) * usableH;
    return `${x},${y}`;
  });

  const pathD = `M${points.join("L")}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("analytics-sparkline", `analytics-sparkline--${trend}`, className)}
      aria-hidden="true"
    >
      <path d={pathD} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
