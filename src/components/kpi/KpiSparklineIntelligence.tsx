"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  trendStateColorVar,
  type KpiPolarity,
  type KpiTrendData,
  type KpiTrendState,
} from "@/lib/kpiTrend";
import { TrendIndicator } from "./TrendIndicator";

type KpiSparklineIntelligenceProps = {
  label?: string;
  trend?: KpiTrendData;
  polarity?: KpiPolarity;
  className?: string;
  compact?: boolean;
};

const SPARKLINE_WIDTH = 120;
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
  trend,
  className,
  compact,
}: KpiSparklineIntelligenceProps) {
  const [open, setOpen] = useState(false);

  if (!trend || trend.points.length < 2) return null;

  const stroke = trendStateColorVar(trend.state);
  const linePath = buildSmoothPath(trend.points, SPARKLINE_WIDTH, SPARKLINE_HEIGHT);

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
      <TrendIndicator
        direction={trend.direction}
        label={trend.deltaLabel}
        state={trend.state}
        className={cn("kpi-sparkline-delta", compact && "compact")}
      />
      <svg
        className="kpi-sparkline-svg"
        viewBox={`0 0 ${SPARKLINE_WIDTH} ${SPARKLINE_HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={linePath}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {open && <TrendTooltip trend={trend} />}
    </div>
  );
}

export type { KpiTrendData, KpiTrendState, KpiPolarity };
