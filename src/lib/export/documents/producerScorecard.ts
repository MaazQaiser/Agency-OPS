import { sarahKpis, sarahLobTable, producers } from "@/data/producerScorecard";
import { getExportMeta, statusBadge } from "../branding";
import { exportHtmlAsPdf } from "../print";

export function exportProducerScorecardPdf(producerId = "sarah"): void {
  const producer = producers.find((p) => p.id === producerId) ?? producers[0];
  const kpiHtml = sarahKpis
    .map(
      (k) => `
    <div class="export-kpi">
      <div class="export-kpi-label">${k.label}</div>
      <div class="export-kpi-value">${k.value}</div>
      <div class="export-kpi-sub">${k.sub}</div>
      ${k.progress ? `<span class="export-sparkline">Progress ${k.progress.width} · ${k.progress.color}</span>` : ""}
    </div>`,
    )
    .join("");

  const lobRows = sarahLobTable
    .map(
      (r) => `<tr>
        <td>${r.line}</td><td>${r.quoted}</td><td>${r.bound}</td>
        <td>${r.closeRate}</td><td style="font-family:'JetBrains Mono',monospace">${r.premium}</td>
      </tr>`,
    )
    .join("");

  const body = `
    <section class="export-section">
      <h2 class="export-section-title">${producer.name} — ${producer.role}</h2>
      <p style="margin-bottom:16px;color:#5a6f7d">Score: <strong>${producer.score}</strong> · Folio period May 20–Jun 18</p>
      <div class="export-kpi-grid">${kpiHtml}</div>
    </section>
    <section class="export-section">
      <h2 class="export-section-title">Lines of Business</h2>
      <table class="export-table">
        <thead><tr><th>Line</th><th>Quoted</th><th>Bound</th><th>Close Rate</th><th>Premium</th></tr></thead>
        <tbody>${lobRows}</tbody>
      </table>
    </section>
    <section class="export-section">
      <h2 class="export-section-title">Performance Trend</h2>
      <p style="font-size:9pt;color:#5a6f7d">Premium written trend (7 periods): $4.2k → $5.1k → $5.8k → $6.0k → $6.3k → $6.5k → $6.6k</p>
      <span class="export-sparkline" style="font-size:12pt">▁▂▃▄▅▆▇ Premium · Close rate 14%→18%</span>
    </section>`;

  exportHtmlAsPdf(
    getExportMeta("Producer Scorecard", `${producer.name} — ${producer.role}`),
    body,
  );
}
