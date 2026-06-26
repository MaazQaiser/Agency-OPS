import { ownerSummaryCards } from "@/data/ownerQuickActions";
import { commercialHubKpis } from "@/data/commercialHub";
import { getExportMeta } from "../branding";
import { exportHtmlAsPdf } from "../print";

export function exportOwnerKpiSummaryPdf(): void {
  const ownerCards = ownerSummaryCards
    .map(
      (c) => `
    <div class="export-kpi">
      <div class="export-kpi-label">${c.label}</div>
      <div class="export-kpi-value">${c.value}</div>
      <div class="export-kpi-sub">${c.variant === "urgent" ? "Requires attention" : c.variant === "warning" ? "Review soon" : "On track"}</div>
    </div>`,
    )
    .join("");

  const hubKpis = commercialHubKpis
    .slice(0, 4)
    .map(
      (k) => `
    <div class="export-kpi">
      <div class="export-kpi-label">${k.label}</div>
      <div class="export-kpi-value">${k.value}</div>
      <div class="export-kpi-sub">${k.sub}</div>
    </div>`,
    )
    .join("");

  exportHtmlAsPdf(
    getExportMeta("Owner KPI Summary", "Executive operational snapshot"),
    `<section class="export-section">
      <h2 class="export-section-title">Owner Action Items</h2>
      <div class="export-kpi-grid">${ownerCards}</div>
    </section>
    <section class="export-section">
      <h2 class="export-section-title">Commercial Pipeline KPIs</h2>
      <div class="export-kpi-grid">${hubKpis}</div>
      <span class="export-sparkline">▁▂▃▅▆▇ Pipeline premium trend · 7-day window</span>
    </section>`,
  );
}
