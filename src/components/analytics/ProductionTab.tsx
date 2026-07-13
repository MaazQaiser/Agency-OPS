"use client";

import { analyticsAiInsights, pipelineBreakdown, producerLeaderboard, productionKpis } from "@/data/analytics";
import { cn } from "@/lib/cn";
import { AnalyticsAiInsights } from "./AnalyticsAiInsights";
import { AnalyticsFunnel } from "./AnalyticsFunnel";
import { AnalyticsKpiGrid } from "./AnalyticsKpiCard";

const medalClass: Record<number, string> = {
  1: "analytics-medal--gold",
  2: "analytics-medal--silver",
  3: "analytics-medal--bronze",
};

import type { AnalyticsTimeFilterId } from "@/data/analytics";
import { AnalyticsPeriodBadge } from "./AnalyticsPeriodBadge";

export function ProductionTab({ period }: { period: AnalyticsTimeFilterId }) {
  return (
    <div className="analytics-tab-view">
      <div className="analytics-tab-period-row">
        <AnalyticsPeriodBadge period={period} />
      </div>
      <AnalyticsKpiGrid kpis={productionKpis} />

      <div className="analytics-dual-panel">
        <section className="va-ops-panel analytics-panel-compact" aria-label="Producer leaderboard">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Producer Leaderboard</h3>
            <p className="va-ops-section-sub">Ranked by written premium with movement indicators.</p>
          </div>
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table analytics-leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Producer</th>
                  <th>Written Premium</th>
                  <th>Policies</th>
                  <th>Avg Deal</th>
                  <th>Bind Ratio</th>
                  <th>Close Rate</th>
                  <th>Movement</th>
                </tr>
              </thead>
              <tbody>
                {producerLeaderboard.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <span className={cn("analytics-rank", medalClass[row.rank])}>
                        {row.rank <= 3 ? ["🥇", "🥈", "🥉"][row.rank - 1] : `#${row.rank}`}
                      </span>
                    </td>
                    <td className="commercial-hub-carrier-name">{row.producer}</td>
                    <td>{row.writtenPremium}</td>
                    <td>{row.policies}</td>
                    <td>{row.avgDealSize}</td>
                    <td>{row.bindRatio}</td>
                    <td>{row.closeRate}</td>
                    <td>
                      <span
                        className={cn(
                          "analytics-rank-movement",
                          row.rankMovement > 0 && "analytics-rank-movement--up",
                          row.rankMovement < 0 && "analytics-rank-movement--down",
                        )}
                      >
                        {row.rankMovement > 0 ? `↑ ${row.rankMovement}` : row.rankMovement < 0 ? `↓ ${Math.abs(row.rankMovement)}` : "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="va-ops-panel analytics-panel-compact" aria-label="Pipeline breakdown">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Pipeline Breakdown</h3>
            <p className="va-ops-section-sub">Submitted → Quoted → Bound → Lost funnel.</p>
          </div>
          <AnalyticsFunnel stages={pipelineBreakdown} />
        </section>
      </div>

      <AnalyticsAiInsights insights={analyticsAiInsights.production} />
    </div>
  );
}
