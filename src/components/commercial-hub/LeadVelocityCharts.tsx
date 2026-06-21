import { cn } from "@/lib/cn";
import type { VelocityTrendPoint } from "@/data/leadVelocity";

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

  return (
    <div className="chart-card lead-velocity-chart">
      <div className="chart-title">{title}</div>
      <div className="lead-velocity-chart-bars" role="img" aria-label={title}>
        {data.map((point) => {
          const height = Math.round((point.value / max) * 100);
          const targetHeight = point.target ? Math.round((point.target / max) * 100) : null;
          const overTarget = point.target != null && point.value > point.target;

          return (
            <div key={point.label} className="lead-velocity-chart-col">
              <div className="lead-velocity-chart-bar-wrap">
                {showTarget && targetHeight != null && (
                  <span
                    className="lead-velocity-chart-target"
                    style={{ bottom: `${targetHeight}%` }}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn("lead-velocity-chart-bar", overTarget && "over-target")}
                  style={{ height: `${height}%` }}
                  title={`${point.value}${unit}`}
                />
              </div>
              <span className="lead-velocity-chart-label">{point.label}</span>
              <span className="lead-velocity-chart-value">
                {point.value}
                {unit}
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
