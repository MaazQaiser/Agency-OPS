"use client";

import {
  analyticsAiInsights,
  atRiskRenewals,
  lostAccounts,
  retentionByProducer,
  retentionKpis,
  retentionRiskClass,
} from "@/data/analytics";
import { cn } from "@/lib/cn";
import { AnalyticsAiInsights } from "./AnalyticsAiInsights";
import { AnalyticsKpiGrid } from "./AnalyticsKpiCard";

import type { AnalyticsTimeFilterId } from "@/data/analytics";
import { AnalyticsPeriodBadge } from "./AnalyticsPeriodBadge";

export function RetentionTab({ period }: { period: AnalyticsTimeFilterId }) {
  return (
    <div className="analytics-tab-view">
      <div className="analytics-tab-period-row">
        <AnalyticsPeriodBadge period={period} />
      </div>
      <AnalyticsKpiGrid kpis={retentionKpis} />

      <div className="analytics-dual-panel">
        <section className="va-ops-panel analytics-panel-compact" aria-label="Retention by producer">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Retention by Producer</h3>
            <p className="va-ops-section-sub">Renewals due, saved, lost, and save rate with risk segmentation.</p>
          </div>
          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Producer</th>
                  <th>Due</th>
                  <th>Saved</th>
                  <th>Lost</th>
                  <th>Save Rate</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {retentionByProducer.map((row) => (
                  <tr key={row.id} className={cn("analytics-retention-row", retentionRiskClass[row.riskLevel])}>
                    <td className="commercial-hub-carrier-name">{row.producer}</td>
                    <td>{row.renewalsDue}</td>
                    <td>{row.saved}</td>
                    <td>{row.lost}</td>
                    <td>{row.saveRate}</td>
                    <td>
                      <span className={cn("analytics-risk-badge", retentionRiskClass[row.riskLevel])}>
                        {row.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="va-ops-panel analytics-panel-compact" aria-label="At-risk renewals">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">At-Risk Renewals</h3>
            <p className="va-ops-section-sub">Accounts requiring intervention this month.</p>
          </div>
          <ul className="analytics-risk-list">
            {atRiskRenewals.map((item) => (
              <li key={item.id} className={cn("analytics-risk-card", retentionRiskClass[item.riskLevel])}>
                <div className="analytics-risk-card-top">
                  <strong>{item.account}</strong>
                  <span className={cn("analytics-risk-badge", retentionRiskClass[item.riskLevel])}>
                    {item.riskLevel}
                  </span>
                </div>
                <div className="analytics-risk-card-meta">
                  {item.producer} · {item.premium} · Renews {item.renewalDate}
                </div>
                <p className="analytics-risk-card-reason">{item.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="va-ops-panel analytics-panel-compact" aria-label="Lost accounts">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Lost Accounts</h3>
          <p className="va-ops-section-sub">Recent non-renewals and churn reasons.</p>
        </div>
        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Producer</th>
                <th>Premium</th>
                <th>Lost Date</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {lostAccounts.map((row) => (
                <tr key={row.id}>
                  <td className="commercial-hub-carrier-name">{row.account}</td>
                  <td>{row.producer}</td>
                  <td>{row.premium}</td>
                  <td>{row.lostDate}</td>
                  <td>{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AnalyticsAiInsights insights={analyticsAiInsights.retention} />
    </div>
  );
}
