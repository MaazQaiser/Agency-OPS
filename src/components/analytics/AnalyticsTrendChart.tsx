"use client";

import { cn } from "@/lib/cn";
import type { KpiTrend, TrendChartSeries } from "@/data/analytics";

type AnalyticsTrendChartProps = {
  series: TrendChartSeries;
};

export function AnalyticsTrendChart({ series }: AnalyticsTrendChartProps) {
  const { values, labels, trend, title, subtitle, formatValue } = series;
  const width = 280;
  const height = 120;
  const padX = 8;
  const padY = 12;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2 - 16;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = padX + (i / Math.max(values.length - 1, 1)) * chartW;
    const y = padY + (1 - (v - min) / range) * chartH;
    return { x, y, v };
  });

  const linePath = `M${points.map((p) => `${p.x},${p.y}`).join("L")}`;
  const areaPath = `${linePath} L${points[points.length - 1]?.x ?? padX},${padY + chartH} L${points[0]?.x ?? padX},${padY + chartH} Z`;

  const fmt = formatValue ?? ((v: number) => String(v));
  const latest = values[values.length - 1] ?? 0;

  return (
    <article className={cn("analytics-trend-chart", `analytics-trend-chart--${trend}`)}>
      <div className="analytics-trend-chart-header">
        <div>
          <h4 className="analytics-trend-chart-title">{title}</h4>
          <p className="analytics-trend-chart-sub">{subtitle}</p>
        </div>
        <span className="analytics-trend-chart-latest">{fmt(latest)}</span>
      </div>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="analytics-trend-chart-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`grad-${series.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={trend === "negative" ? "#f43f5e" : "#0891b2"} stopOpacity="0.25" />
            <stop offset="100%" stopColor={trend === "negative" ? "#f43f5e" : "#0891b2"} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#grad-${series.id})`} />
        <path
          d={linePath}
          fill="none"
          stroke={trend === "negative" ? "#f43f5e" : "#0891b2"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle
            key={labels[i] ?? i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill={trend === "negative" ? "#f43f5e" : "#0891b2"}
          />
        ))}
      </svg>
      <div className="analytics-trend-chart-labels">
        {labels.map((label) => (
          <span key={label} className="analytics-trend-chart-label">
            {label}
          </span>
        ))}
      </div>
    </article>
  );
}

export function AnalyticsTrendChartGrid({ charts }: { charts: TrendChartSeries[] }) {
  return (
    <div className="analytics-trend-chart-grid">
      {charts.map((series) => (
        <AnalyticsTrendChart key={series.id} series={series} />
      ))}
    </div>
  );
}
