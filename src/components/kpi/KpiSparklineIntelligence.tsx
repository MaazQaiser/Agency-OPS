"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import {
  getKpiTrend,
  trendStateColorVar,
  type KpiPolarity,
  type KpiTrendData,
  type KpiTrendState,
} from "@/lib/kpiTrend";

type KpiSparklineIntelligenceProps = {
  label?: string;
  trend?: KpiTrendData;
  polarity?: KpiPolarity;
  className?: string;
  compact?: boolean;
};

const SPARKLINE_WIDTH = 88;
const SPARKLINE_HEIGHT = 28;

function buildSmoothPath(points: number[], width: number, height: number): string {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const pad = 2;
  const innerH = height - pad * 2;
  const step = width / (points.length - 1);

  const coords = points.map((p, i) => ({
    x: i * step,
    y: pad + innerH - ((p - min) / range) * innerH,
  }));

  if (coords.length < 2) return "";

  let d = `M ${coords[0].x.toFixed(2)} ${coords[0].y.toFixed(2)}`;
  for (let i = 1; i < coords.length; i += 1) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` Q ${cpx.toFixed(2)} ${prev.y.toFixed(2)} ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`;
  }
  return d;
}

function buildAreaPath(linePath: string, width: number, height: number): string {
  return `${linePath} L ${width} ${height} L 0 ${height} Z`;
}

function DeltaBadge({
  trend,
  compact,
}: {
  trend: KpiTrendData;
  compact?: boolean;
}) {
  const arrow =
    trend.direction === "stable" ? "→" : trend.direction === "up" ? "↑" : "↓";

  return (
    <span
      className={cn("kpi-sparkline-delta", `kpi-sparkline-delta--${trend.state}`, compact && "compact")}
      style={{ color: trendStateColorVar(trend.state) }}
    >
      <span className="kpi-sparkline-delta-arrow" aria-hidden="true">
        {arrow}
      </span>
      {trend.deltaLabel}
    </span>
  );
}

function TrendTooltip({ trend }: { trend: KpiTrendData }) {
  return (
    <div className="kpi-sparkline-tooltip" role="tooltip">
      <div className="kpi-sparkline-tooltip-title">7-day trend</div>
      <ul className="kpi-sparkline-tooltip-days">
        {trend.points.map((value, i) => (
          <li key={trend.dayLabels[i]}>
            <span>{trend.dayLabels[i]}</span>
            <span className="kpi-sparkline-tooltip-val">{value}</span>
          </li>
        ))}
      </ul>
      <div className="kpi-sparkline-tooltip-stats">
        <div>
          <span>Best</span>
          <strong>{trend.best}</strong>
        </div>
        <div>
          <span>Worst</span>
          <strong>{trend.worst}</strong>
        </div>
        <div>
          <span>Avg</span>
          <strong>{trend.average}</strong>
        </div>
      </div>
    </div>
  );
}

export function KpiSparklineIntelligence({
  label,
  trend: trendProp,
  polarity,
  className,
  compact,
}: KpiSparklineIntelligenceProps) {
  const [open, setOpen] = useState(false);
  const gradientId = useId().replace(/:/g, "");

  const trend = useMemo(
    () => trendProp ?? (label ? getKpiTrend(label, polarity) : null),
    [trendProp, label, polarity],
  );

  if (!trend) return null;

  const stroke = trendStateColorVar(trend.state);
  const linePath = buildSmoothPath(trend.points, SPARKLINE_WIDTH, SPARKLINE_HEIGHT);
  const areaPath = buildAreaPath(linePath, SPARKLINE_WIDTH, SPARKLINE_HEIGHT);

  return (
    <div
      className={cn("kpi-sparkline-wrap", className, open && "kpi-sparkline-wrap--open")}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      tabIndex={0}
      role="img"
      aria-label={`${trend.deltaLabel} trend over 7 days`}
    >
      <DeltaBadge trend={trend} compact={compact} />
      <svg
        className="kpi-sparkline-svg"
        viewBox={`0 0 ${SPARKLINE_WIDTH} ${SPARKLINE_HEIGHT}`}
        width={SPARKLINE_WIDTH}
        height={SPARKLINE_HEIGHT}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`kpi-spark-fill-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
          <filter id={`kpi-spark-glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={areaPath} fill={`url(#kpi-spark-fill-${gradientId})`} />
        <path
          d={linePath}
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#kpi-spark-glow-${gradientId})`}
        />
      </svg>
      {open && <TrendTooltip trend={trend} />}
    </div>
  );
}

export type { KpiTrendData, KpiTrendState, KpiPolarity };
