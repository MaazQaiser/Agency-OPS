import {
  combinedExecutiveTable,
  tracieKpis,
  valerieKpis,
} from "@/data/retentionScorecard";
import { getExportMeta } from "../branding";
import { exportHtmlAsPdf } from "../print";
import { downloadCsv } from "../csv";

function kpiGridHtml(kpis: typeof valerieKpis, title: string): string {
  const cards = kpis
    .map(
      (k) => `
    <div class="export-kpi">
      <div class="export-kpi-label">${k.label}</div>
      <div class="export-kpi-value">${k.value}</div>
      <div class="export-kpi-sub">${k.sub}</div>
    </div>`,
    )
    .join("");
  return `
    <h3 style="font-family:'Cormorant Garamond',serif;font-size:14pt;margin-bottom:12px">${title}</h3>
    <div class="export-kpi-grid">${cards}</div>`;
}

export function exportRetentionScorecardPdf(): void {
  const combinedRows = combinedExecutiveTable
    .map(
      (r) => `<tr>
        <td><strong>${r.kpi}</strong></td>
        <td>${r.valerie}</td><td>${r.tracie}</td><td>${r.combined}</td><td>${r.goal}</td>
      </tr>`,
    )
    .join("");

  const body = `
    <section class="export-section">
      ${kpiGridHtml(valerieKpis, "Valerie: English Retention")}
    </section>
    <section class="export-section">
      ${kpiGridHtml(tracieKpis, "Tracie: Korean Retention")}
    </section>
    <section class="export-section">
      <h2 class="export-section-title">Combined Executive View</h2>
      <table class="export-table">
        <thead><tr><th>KPI</th><th>Valerie</th><th>Tracie</th><th>Combined</th><th>Goal</th></tr></thead>
        <tbody>${combinedRows}</tbody>
      </table>
    </section>
    <section class="export-section">
      <h2 class="export-section-title">Folio Progress</h2>
      <p style="font-size:10pt">Renewal cycle 68% complete · Cross-sell pipeline active · 9 cancellation saves this period</p>
      <span class="export-sparkline">▃▅▆▇ Retention trend · PIF growth +2.4%</span>
    </section>`;

  exportHtmlAsPdf(
    getExportMeta("Retention Scorecard", "Valerie + Tracie · Combined executive view"),
    body,
  );
}

export function exportRetentionScorecardCsv(): void {
  downloadCsv(
    `retention-scorecard-${new Date().toISOString().slice(0, 10)}`,
    ["KPI", "Valerie", "Tracie", "Combined", "Goal"],
    combinedExecutiveTable.map((r) => [r.kpi, r.valerie, r.tracie, r.combined, r.goal]),
  );
}
