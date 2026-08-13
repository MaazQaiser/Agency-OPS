import { cn } from "@/lib/cn";
import type { VelocityTrendPoint } from "@/data/leadVelocity";
import { TargetLine } from "@/components/kpi/TargetLine";

type LeadVelocityChartsProps = {
  dailySpeed: VelocityTrendPoint[];
  weeklyConversion: VelocityTrendPoint[];
  monthlyBind: VelocityTrendPoint[];
};

function TrendChart({
  title,
  data,
  unit,
  showTarget,
}: {
  title: string;
  data: VelocityTrendPoint[];
  unit: string;
  showTarget?: boolean;
}) {
  const max = Math.max(...data.map((d) => Math.max(d.value, d.target ?? 0)), 1);
  const hasTarget = showTarget && data.some((point) => point.target != null);

  return (
    <div className="chart-card lead-velocity-chart aos-chart-card">
      <div className="chart-title">{title}</div>
      {hasTarget && (
        <p className="aos-chart-legend">
          <span className="aos-target-swatch" aria-hidden="true" />
          Target
        </p>
      )}
      <div className="lead-velocity-chart-bars" role="img" aria-label={title}>
        {data.map((point) => {
          const height = Math.round((point.value / max) * 100);
          const targetHeight = point.target != null ? Math.round((point.target / max) * 100) : null;
          const belowTarget = point.target != null && point.value < point.target;
          const atOrAbove = point.target != null && point.value >= point.target;

          return (
            <div key={point.label} className="lead-velocity-chart-col">
              <span className="lead-velocity-chart-value">
                {point.value}
                {unit}
              </span>
              <div className="lead-velocity-chart-bar-wrap">
                {showTarget && targetHeight != null && (
                  <TargetLine bottomPct={targetHeight} />
                )}
                <span
                  className={cn(
                    "lead-velocity-chart-bar",
                    belowTarget && "is-below",
                    atOrAbove && "is-on-target",
                  )}
                  style={{ height: `${height}%` }}
                  title={`${point.label}: ${point.value}${unit}`}
                />
              </div>
              <span className="lead-velocity-chart-label" title={point.label}>
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LeadVelocityCharts({ dailySpeed, weeklyConversion, monthlyBind }: LeadVelocityChartsProps) {
  return (
    <div className="chart-grid lead-velocity-charts">
      <TrendChart title="Daily Lead Speed Trend (avg mins to first contact)" data={dailySpeed} unit="m" showTarget />
      <TrendChart title="Weekly Conversion Trend (%)" data={weeklyConversion} unit="%" />
      <TrendChart title="Monthly Bind Speed Trend (avg days)" data={monthlyBind} unit="d" showTarget />
    </div>
  );
}
