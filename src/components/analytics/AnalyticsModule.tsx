"use client";

import { useCallback, useState } from "react";
import {
  analyticsTabs,
  overviewKpis,
  carrierMixData,
  analyticsHeader,
  type AnalyticsTabId,
} from "@/data/analytics";
import { HubHelpTrigger } from "@/components/help/HubHelpTrigger";
import { KpiSparkline } from "./KpiSparkline";
import { cn } from "@/lib/cn";

export function AnalyticsModule() {
  const [activeTab, setActiveTab] = useState<AnalyticsTabId>("overview");

  const handleTab = useCallback((id: AnalyticsTabId) => setActiveTab(id), []);

  return (
    <>
      {/* Hub header */}
      <header className="va-ops-page-header analytics-page-header">
        <div className="va-ops-page-header-left">
          <div className="va-ops-page-title-block">
            <h1 className="va-ops-page-title">{analyticsHeader.title}</h1>
            <p className="va-ops-page-subtitle">{analyticsHeader.subtitle}</p>
          </div>
        </div>
        <div className="va-ops-page-header-toolbar">
          <span className="analytics-folio-badge">Folio 2026-Q2</span>
          <HubHelpTrigger hubId="analytics" />
        </div>
      </header>

      {/* Tab nav */}
      <nav className="va-ops-tab-nav" aria-label="Analytics views">
        {analyticsTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cn("va-ops-tab-btn", activeTab === tab.id && "active")}
            onClick={() => handleTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="va-ops-tab-content analytics-content">
        {activeTab === "overview" && (
          <section aria-label="KPI overview">
            <div className="analytics-kpi-grid">
              {overviewKpis.map((kpi) => (
                <div key={kpi.id} className={cn("analytics-kpi-card", `analytics-kpi-card--${kpi.trend}`)}>
                  <div className="analytics-kpi-label">{kpi.label}</div>
                  <div className="analytics-kpi-value">{kpi.value}</div>
                  <div className="analytics-kpi-sparkline-row">
                    <KpiSparkline data={kpi.sparkline} trend={kpi.trend} />
                    <span className={cn("analytics-kpi-delta", `analytics-kpi-delta--${kpi.trend}`)}>
                      {kpi.delta}
                    </span>
                  </div>
                  <div className="analytics-kpi-sub">{kpi.sub}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "carriers" && (
          <section aria-label="Carrier mix">
            <div className="va-ops-panel">
              <div className="va-ops-panel-header">
                <h3 className="va-ops-section-title">Carrier Mix — MTD</h3>
                <p className="va-ops-section-sub">Premium and bind rate by carrier for this folio month.</p>
              </div>
              <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
                <table className="commercial-hub-table">
                  <thead>
                    <tr>
                      <th>Carrier</th>
                      <th>Premium</th>
                      <th>Policies</th>
                      <th>Bind Rate</th>
                      <th>Avg Days to Quote</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrierMixData.map((row) => (
                      <tr key={row.id}>
                        <td className="commercial-hub-carrier-name">{row.carrier}</td>
                        <td>{row.premium}</td>
                        <td>{row.policies}</td>
                        <td>
                          <span className={row.bindRate >= "35%" ? "badge badge-green" : "badge badge-amber"}>
                            {row.bindRate}
                          </span>
                        </td>
                        <td>{row.avgDays} days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {(activeTab === "production" || activeTab === "retention" || activeTab === "velocity") && (
          <div className="hub-empty-state">
            <div className="hub-empty-state-icon-wrap">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h3 className="hub-empty-state-title">Coming in next build</h3>
            <p className="hub-empty-state-desc">
              {activeTab === "production" && "Detailed production breakdown by producer, vertical, and carrier — sourced from AgencyZoom."}
              {activeTab === "retention" && "Retention analytics by folio period, producer, and vertical — renewal pace vs target."}
              {activeTab === "velocity" && "Lead-to-bind velocity by stage — days at each pipeline stage, bottleneck identification."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
