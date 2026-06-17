"use client";

import { useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  Tooltip,
  LinearScale,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { AlertBox } from "@/components/ui/Alert";
import { KpiCard, KpiGrid } from "@/components/ui/KpiCard";
import {
  chartLobData,
  chartStatusData,
  executiveAlerts,
  executiveKpis,
  weeklyProductivity,
} from "@/data/commercialSubmissions";
import { colors } from "@/lib/colors";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type ProductivityPeriod = "week" | "day" | "month";

const productivityPeriodOptions: { id: ProductivityPeriod; label: string }[] = [
  { id: "week", label: "Week" },
  { id: "day", label: "Day" },
  { id: "month", label: "Month" },
];

const productivitySectionTitles: Record<ProductivityPeriod, string> = {
  week: "Weekly Productivity Snapshot",
  day: "Daily Productivity Snapshot",
  month: "Monthly Productivity Snapshot",
};

export function ExecutiveTab() {
  const [productivityPeriod, setProductivityPeriod] = useState<ProductivityPeriod>("week");

  const statusChart = {
    labels: chartStatusData.labels,
    datasets: [{
      data: chartStatusData.data,
      backgroundColor: chartStatusData.colors,
      borderColor: colors.surface.cardSolid,
      borderWidth: 2,
    }],
  };

  const lobChart = {
    labels: chartLobData.labels,
    datasets: [{
      label: "Submissions",
      data: chartLobData.data,
      backgroundColor: colors.primary.DEFAULT,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const chartScales = {
    x: { ticks: { color: colors.chart.tick, font: { size: 12 } }, grid: { color: colors.chart.grid } },
    y: { ticks: { color: colors.chart.tick, font: { size: 12 } }, grid: { color: colors.chart.grid }, beginAtZero: true },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  return (
    <>
      <div className="section-header">
        <div className="section-title">Executive Overview</div>
        <div className="section-sub live">
          <span className="live-blinker" aria-hidden="true" />
          Owner View · Live KPIs
        </div>
      </div>

      <KpiGrid>
        {executiveKpis.map((kpi) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            sub={kpi.sub}
            variant="commercial"
            color={kpi.variant !== "default" ? kpi.variant : undefined}
            valueStyle={kpi.small ? { fontSize: "var(--font-size-18)" } : undefined}
          />
        ))}
      </KpiGrid>

      <hr className="divider" />

      <div className="chart-grid">
        <div className="chart-card">
          <div className="chart-title">Submissions by Status</div>
          <div className="chart-container">
            <Doughnut data={statusChart} options={{ ...chartOptions, cutout: "60%" }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12, fontSize: "var(--font-size-12)", color: "var(--text-muted)" }}>
            {chartStatusData.legend.map((item) => (
              <span key={item.label}>
                <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "var(--radius)", background: item.color, marginRight: 4 }} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-title">Submissions by LOB</div>
          <div className="chart-container">
            <Bar
              data={lobChart}
              options={{
                ...chartOptions,
                scales: chartScales,
              }}
            />
          </div>
        </div>
      </div>

      <div className="section-header" style={{ marginTop: 8 }}>
        <div className="section-title">Alerts &amp; Flags</div>
      </div>
      <div className="alert-list">
        {executiveAlerts.map((alert) => (
          <AlertBox key={alert.title} variant={alert.variant} title={alert.title} body={alert.body} />
        ))}
      </div>

      <hr className="divider" />

      <div className="section-header section-header-with-filter">
        <div className="section-title">{productivitySectionTitles[productivityPeriod]}</div>
        <div className="period-filter" role="group" aria-label="Time period">
          {productivityPeriodOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`period-filter-btn${productivityPeriod === option.id ? " active" : ""}`}
              aria-pressed={productivityPeriod === option.id}
              onClick={() => setProductivityPeriod(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>VA / Producer</th>
              <th>Subs Opened</th>
              <th>Markets Hit</th>
              <th>Quotes Back</th>
              <th>Follow-Ups Done</th>
              <th>Binds</th>
              <th>Docs Collected</th>
              <th>Pace</th>
            </tr>
          </thead>
          <tbody>
            {weeklyProductivity.map((row) => (
              <tr key={row.name}>
                <td><strong>{row.name}</strong> <span style={{ fontSize: "var(--font-size-12)", color: "var(--text-muted)" }}>({row.role})</span></td>
                <td>{row.subsOpened}</td>
                <td>{row.marketsHit}</td>
                <td>{row.quotesBack}</td>
                <td>{row.followUpsDone}</td>
                <td>{row.binds}</td>
                <td>{row.docsCollected}</td>
                <td><span className={`badge badge-${row.paceVariant}`}>{row.pace}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
