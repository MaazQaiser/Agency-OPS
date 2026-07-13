"use client";

import { cn } from "@/lib/cn";

type DependencyItem = {
  id: string;
  carrier: string;
  premiumPct: number;
  premium: string;
};

const barColors = ["#0891b2", "#06b6d4", "#22d3ee", "#67e8f9", "#a5f3fc"];

export function AnalyticsDependencyChart({ data }: { data: DependencyItem[] }) {
  return (
    <div className="analytics-dependency-chart">
      <div className="analytics-dependency-bars">
        {data.map((item, index) => (
          <div key={item.id} className="analytics-dependency-row">
            <span className="analytics-dependency-carrier">{item.carrier}</span>
            <div className="analytics-dependency-bar-track">
              <div
                className="analytics-dependency-bar-fill"
                style={{
                  width: `${item.premiumPct}%`,
                  background: barColors[index % barColors.length],
                }}
              />
            </div>
            <span className="analytics-dependency-pct">{item.premiumPct}%</span>
            <span className="analytics-dependency-premium">{item.premium}</span>
          </div>
        ))}
      </div>
      <div className="analytics-dependency-stacked" aria-hidden="true">
        {data.map((item, index) => (
          <div
            key={`stack-${item.id}`}
            className={cn("analytics-dependency-stack-segment")}
            style={{
              width: `${item.premiumPct}%`,
              background: barColors[index % barColors.length],
            }}
            title={`${item.carrier}: ${item.premiumPct}%`}
          />
        ))}
      </div>
      <p className="analytics-dependency-caption">
        Premium concentration by carrier: identifies over-reliance risk
      </p>
    </div>
  );
}
