"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { KpiCard, KpiGrid } from "@/components/ui/KpiCard";
import { ExportMenu } from "@/components/export/ExportMenu";
import { useRetentionLocale } from "@/components/retention/RetentionLanguageProvider";
import type { RetentionKpi } from "@/types";

function RetentionKpiGrid({ kpis, footnote }: { kpis: RetentionKpi[]; footnote: string }) {
  return (
    <>
      <KpiGrid variant="retention">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            sub={kpi.sub}
            color={kpi.color}
            variant="retention"
          />
        ))}
      </KpiGrid>
      <p className="retention-kpi-footnote">{footnote}</p>
    </>
  );
}

export function RetentionKpiTabs() {
  const { copy } = useRetentionLocale();
  const [activeTab, setActiveTab] = useState("valerie");

  return (
    <div className="retention-scorecard-block">
      <div className="retention-scorecard-toolbar export-table-header-export">
        <span className="retention-scorecard-toolbar-label sh-label">
          {copy.scorecardHeader}
        </span>
        <ExportMenu kind="retention-scorecard" />
      </div>

      <div className="tab-bar retention-scorecard-tabs" role="tablist" aria-label={copy.scorecardHeader}>
        {copy.tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab retention${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content retention active" style={{ display: "block" }}>
        {activeTab === "valerie" && (
          <RetentionKpiGrid kpis={copy.valerieKpis} footnote={copy.valerieFootnote} />
        )}
        {activeTab === "tracie" && (
          <RetentionKpiGrid kpis={copy.tracieKpis} footnote={copy.tracieFootnote} />
        )}
        {activeTab === "combined" && (
          <div className="retention-table-wrap">
            <DataTable variant="retention">
              <thead>
                <tr>
                  {copy.combinedTable.headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {copy.combinedTable.rows.map((row) => (
                  <tr key={row.kpi}>
                    <td>{row.kpi}</td>
                    <td style={row.valerieColor ? { color: `var(--${row.valerieColor})` } : undefined}>
                      {row.valerie}
                    </td>
                    <td style={row.tracieColor ? { color: `var(--${row.tracieColor})` } : undefined}>
                      {row.tracie}
                    </td>
                    <td>{row.combined}</td>
                    <td>{row.goal}</td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </div>
        )}
      </div>
    </div>
  );
}
