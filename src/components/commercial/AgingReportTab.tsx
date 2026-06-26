"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { KpiCard } from "@/components/ui/KpiCard";
import { agingBuckets, agingKpis, chartAgingData } from "@/data/commercialSubmissions";
import { colors } from "@/lib/colors";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function AgingReportTab() {
  const agingChart = {
    labels: chartAgingData.labels,
    datasets: [{
      label: "Submissions",
      data: chartAgingData.data,
      backgroundColor: chartAgingData.colors,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  return (
    <>
      <div className="section-header">
        <div className="section-title">Submission Aging Report</div>
        <div className="section-sub">Days Since Submission · Escalation View</div>
      </div>

      <div className="kpi-grid">
        {agingKpis.map((kpi) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            sub={kpi.sub}
            color={kpi.variant !== "default" ? (kpi.variant as "yellow" | "red" | "green" | "primary") : undefined}
            polarity={kpi.label.toLowerCase().includes("overdue") || kpi.label.toLowerCase().includes("stalled") ? "lower-better" : undefined}
          />
        ))}
      </div>

      {agingBuckets.map((bucket) => (
        <div key={bucket.header} className="aging-bucket">
          <div className={`aging-row header${bucket.headerStyle === "yellow" ? "" : ""}`} style={bucket.headerStyle === "yellow" ? { background: "rgba(241,196,15,0.06)" } : undefined}>
            <div>{bucket.header}</div>
            <div>Days Open</div>
            <div>VA</div>
            <div>Status</div>
            <div>Action</div>
          </div>
          {bucket.rows.map((row) => (
            <div key={row.client} className={`aging-row ${row.rowClass}`}>
              <div>
                <strong>{row.client}</strong>
                <br />
                <span style={{ fontSize: "var(--font-size-12)", color: "var(--text-muted)" }}>{row.detail}</span>
              </div>
              <div style={{ color: `var(--${row.daysColor})`, fontWeight: row.daysColor === "red" ? "bold" : undefined }}>{row.days}</div>
              <div>{row.va}</div>
              <div><span className={`badge badge-${row.statusVariant}`}>{row.status}</span></div>
              <div style={{ fontSize: "var(--font-size-12)", color: "var(--text-muted)" }}>{row.action}</div>
            </div>
          ))}
        </div>
      ))}

      <div className="chart-card" style={{ marginTop: 16 }}>
        <div className="chart-title">Aging Distribution (All Open Submissions)</div>
        <div style={{ position: "relative", height: 180 }}>
          <Bar
            data={agingChart}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: colors.chart.tick, font: { size: 12 } }, grid: { color: colors.chart.grid } },
                y: { ticks: { color: colors.chart.tick, stepSize: 1 }, grid: { color: colors.chart.grid }, beginAtZero: true },
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
