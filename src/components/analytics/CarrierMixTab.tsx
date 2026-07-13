"use client";

import {
  analyticsAiInsights,
  appetiteTrendClass,
  carrierDependencyData,
  carrierMixData,
} from "@/data/analytics";
import { cn } from "@/lib/cn";
import { AnalyticsAiInsights } from "./AnalyticsAiInsights";
import { AnalyticsDependencyChart } from "./AnalyticsDependencyChart";

import type { AnalyticsTimeFilterId } from "@/data/analytics";
import { AnalyticsPeriodBadge } from "./AnalyticsPeriodBadge";

export function CarrierMixTab({ period }: { period: AnalyticsTimeFilterId }) {
  return (
    <div className="analytics-tab-view">
      <div className="analytics-tab-period-row">
        <AnalyticsPeriodBadge period={period} />
      </div>
      <div className="analytics-dual-panel analytics-dual-panel--carrier">
        <section className="va-ops-panel analytics-panel-compact" aria-label="Carrier performance">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Carrier Performance</h3>
            <p className="va-ops-section-sub">Volume, decline ratio, quote speed, concentration, and appetite trend.</p>
          </div>
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap analytics-carrier-table-wrap">
            <table className="commercial-hub-table analytics-carrier-table">
              <thead>
                <tr>
                  <th>Carrier</th>
                  <th>Premium</th>
                  <th>Concentration</th>
                  <th>Submissions</th>
                  <th>Decline Ratio</th>
                  <th>Bind Rate</th>
                  <th>Avg Quote</th>
                  <th>Appetite</th>
                </tr>
              </thead>
              <tbody>
                {carrierMixData.map((row) => (
                  <tr key={row.id}>
                    <td className="commercial-hub-carrier-name">{row.carrier}</td>
                    <td>{row.premium}</td>
                    <td>
                      <span className="analytics-concentration">{row.premiumPct}%</span>
                    </td>
                    <td>{row.submissions}</td>
                    <td>
                      <span className={cn("badge", parseInt(row.declineRatio, 10) >= 20 ? "badge-amber" : "badge-green")}>
                        {row.declineRatio}
                      </span>
                    </td>
                    <td>
                      <span className={cn("badge", row.bindRate >= 35 ? "badge-green" : "badge-amber")}>
                        {row.bindRateLabel}
                      </span>
                    </td>
                    <td>{row.avgDays} days</td>
                    <td>
                      <span className={cn("badge", appetiteTrendClass[row.appetiteTrend])}>
                        {row.appetiteTrend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="va-ops-panel analytics-panel-compact" aria-label="Carrier dependency">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Carrier Dependency</h3>
            <p className="va-ops-section-sub">How much business depends on each carrier.</p>
          </div>
          <AnalyticsDependencyChart data={carrierDependencyData} />
        </section>
      </div>

      <AnalyticsAiInsights insights={analyticsAiInsights.carriers} />
    </div>
  );
}
