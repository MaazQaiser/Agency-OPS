"use client";

import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { DataTable } from "@/components/ui/DataTable";
import { KpiCard, KpiGrid } from "@/components/ui/KpiCard";
import {
  producers,
  sarahKpis,
  sarahLobTable,
} from "@/data/producerScorecard";
import { getNameInitials } from "@/lib/nameInitials";

export function ProducerScorecardTab() {
  const [activeProducer, setActiveProducer] = useState("sarah");

  return (
    <>
      <div className="producer-cards">
        {producers.map((p) => (
          <div
            key={p.id}
            className={`producer-card${activeProducer === p.id ? " active" : ""}`}
            onClick={() => setActiveProducer(p.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveProducer(p.id)}
          >
            <div className="producer-card-head">
              <span className="producer-avatar" aria-hidden="true">
                {getNameInitials(p.name)}
              </span>
              <div>
                <div className="pc-name">{p.name}</div>
                <div className="pc-role">{p.role}</div>
              </div>
            </div>
            <div className="pc-score">{p.score}</div>
          </div>
        ))}
      </div>

      {activeProducer === "sarah" ? (
        <div>
          <KpiGrid variant="production">
            {sarahKpis.map((kpi) => (
              <KpiCard
                key={kpi.label}
                label={kpi.label}
                value={kpi.value}
                sub={kpi.sub}
                color={kpi.color}
                variant="production"
                featured={kpi.featured}
                progress={kpi.progress}
              />
            ))}
          </KpiGrid>
          <div className="section-hdr">
            <div className="sh-label">Lines of Business — Sarah (Personal + Life Only)</div>
          </div>
          <DataTable variant="production">
            <thead>
              <tr>
                <th>Line</th>
                <th>Quoted</th>
                <th>Bound</th>
                <th>Close Rate</th>
                <th>Premium</th>
              </tr>
            </thead>
            <tbody>
              {sarahLobTable.map((row) => (
                <tr key={row.line}>
                  <td><span className={`lob-tag lob-${row.lineType}`}>{row.line}</span></td>
                  <td>{row.quoted}</td>
                  <td>{row.bound}</td>
                  <td>{row.closeRate}</td>
                  <td>{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
      ) : (
        <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
          <div style={{ marginBottom: 12, display: "flex", justifyContent: "center", color: "var(--primary)" }}>
            <AppIcon name="bar-chart" size={32} strokeWidth={1.75} />
          </div>
          <div style={{ fontSize: "var(--font-size-14)", fontWeight: 600, color: "var(--white)", marginBottom: 6 }}>Producer KPI View</div>
          <div style={{ fontSize: "var(--font-size-12)" }}>
            Populates from Kyle&apos;s Sales_Scorecard Sheets tab.
            <br />
            Monthly reports align to folio period dates — not calendar month.
          </div>
        </div>
      )}
    </>
  );
}
