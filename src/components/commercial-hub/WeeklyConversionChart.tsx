"use client";

import { cn } from "@/lib/cn";
import type { VelocityTrendPoint } from "@/data/leadVelocity";
import { TargetLine } from "@/components/kpi/TargetLine";

type WeeklyConversionChartProps = {
  data: VelocityTrendPoint[];
  title?: string;
};

export function WeeklyConversionChart({
  data,
  title = "Weekly conversion",
}: WeeklyConversionChartProps) {
  const max = Math.max(...data.map((point) => Math.max(point.value, point.target ?? 0)), 1);
  const hasTarget = data.some((point) => point.target != null);

  return (
    <section className="commercial-conversion-chart aos-chart-card ih-chart--primary" aria-label={title}>
      <header className="commercial-conversion-chart-header">
        <h3 className="commercial-conversion-chart-title">{title}</h3>
        {hasTarget && (
          <p className="commercial-conversion-chart-legend aos-chart-legend">
            <span className="aos-target-swatch" aria-hidden="true" />
            Target
          </p>
        )}
      </header>
      <div className="commercial-conversion-chart-bars" role="img" aria-label={title}>
        {data.map((point) => {
          const height = Math.round((point.value / max) * 100);
          const targetHeight = point.target != null ? Math.round((point.target / max) * 100) : null;
          const belowTarget = point.target != null && point.value < point.target;
          const atOrAbove = point.target != null && point.value >= point.target;

          return (
            <div key={point.label} className="commercial-conversion-col">
              <span className="commercial-conversion-value">{point.value}%</span>
              <div className="commercial-conversion-bar-wrap">
                {targetHeight != null && <TargetLine bottomPct={targetHeight} />}
                <span
                  className={cn(
                    "commercial-conversion-bar",
                    belowTarget && "is-below",
                    atOrAbove && "is-on-target",
                  )}
                  style={{ height: `${height}%` }}
                  title={`${point.label}: ${point.value}%`}
                />
              </div>
              <span className="commercial-conversion-label" title={point.label}>
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
