"use client";

import { DataTable } from "@/components/ui/DataTable";
import { KpiCard, KpiGrid } from "@/components/ui/KpiCard";
import { Tabs } from "@/components/ui/Tabs";
import {
  combinedExecutiveTable,
  retentionTabs,
  tracieKpis,
  valerieKpis,
} from "@/data/retentionScorecard";

function RetentionKpiGrid({ kpis, footnote }: { kpis: typeof valerieKpis; footnote: string }) {
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
      <p style={{ fontSize: "var(--font-size-12)", color: "var(--muted)" }}>{footnote}</p>
    </>
  );
}

export function RetentionKpiTabs() {
  return (
    <Tabs tabs={retentionTabs} defaultTab="valerie" variant="retention">
      {(active) => (
        <div className={`tab-content retention${active ? " active" : ""}`} style={{ display: "block" }}>
          {active === "valerie" && (
            <RetentionKpiGrid
              kpis={valerieKpis}
              footnote="Data populates from Kyle's Google Sheets retention tab. Folio period dates — not calendar month."
            />
          )}
          {active === "tracie" && (
            <RetentionKpiGrid
              kpis={tracieKpis}
              footnote="Korean dept only. Tracie's renewals never route to Valerie. Separate board, separate scorecard."
            />
          )}
          {active === "combined" && (
            <DataTable variant="retention">
              <thead>
                <tr>
                  <th>KPI</th>
                  <th>Valerie (English)</th>
                  <th>Tracie (Korean)</th>
                  <th>Combined</th>
                  <th>Goal</th>
                </tr>
              </thead>
              <tbody>
                {combinedExecutiveTable.map((row) => (
                  <tr key={row.kpi}>
                    <td>{row.kpi}</td>
                    <td style={row.valerieColor ? { color: `var(--${row.valerieColor})` } : undefined}>{row.valerie}</td>
                    <td style={row.tracieColor ? { color: `var(--${row.tracieColor})` } : undefined}>{row.tracie}</td>
                    <td>{row.combined}</td>
                    <td>{row.goal}</td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          )}
        </div>
      )}
    </Tabs>
  );
}
