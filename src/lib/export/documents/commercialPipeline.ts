import { activeSubmissions, carrierPerformance, commercialHubKpis, type HubSubmission } from "@/data/commercialHub";
import { eoRiskFromHubSubmission } from "@/lib/eoRiskScore";
import { downloadCsv } from "../csv";
import { getExportMeta, statusBadge } from "../branding";
import { exportHtmlAsPdf } from "../print";

function inferVertical(coverage: string): string {
  if (/bop|gl|general|workers|commercial/i.test(coverage)) return "Commercial";
  if (/auto|home|personal/i.test(coverage)) return "Personal";
  return coverage.split(" ")[0] ?? "Commercial";
}

function groupByStage(submissions: HubSubmission[]): Map<string, HubSubmission[]> {
  const map = new Map<string, HubSubmission[]>();
  for (const sub of submissions) {
    const stage = sub.stage || "Unassigned";
    const list = map.get(stage) ?? [];
    list.push(sub);
    map.set(stage, list);
  }
  return map;
}

function pipelinePdfBody(): string {
  const grouped = groupByStage(activeSubmissions);
  const kpiHtml = commercialHubKpis
    .slice(0, 6)
    .map(
      (k) => `
    <div class="export-kpi">
      <div class="export-kpi-label">${k.label}</div>
      <div class="export-kpi-value">${k.value}</div>
      <div class="export-kpi-sub">${k.sub}</div>
      <span class="export-sparkline">▁▂▃▅▆▇ — 7d trend</span>
    </div>`,
    )
    .join("");

  const stageSections = Array.from(grouped.entries())
    .map(([stage, subs]) => {
      const rows = subs
        .map((s) => {
          const risk = eoRiskFromHubSubmission(s);
          const carrier = s.carrierSubmissions[0]?.carrier ?? "—";
          return `<tr>
            <td class="mono" style="font-family:'JetBrains Mono',monospace;font-size:8pt">${s.id}</td>
            <td><strong>${s.client}</strong></td>
            <td>${inferVertical(s.coverage)}</td>
            <td>${statusBadge(s.stage)}</td>
            <td style="font-family:'JetBrains Mono',monospace">${s.premium}</td>
            <td>${s.daysOpen}d</td>
            <td>${statusBadge(risk.label)} <span style="font-size:8pt;color:#5a6f7d">(${risk.total})</span></td>
            <td>${s.producer}</td>
            <td>${carrier}</td>
          </tr>`;
        })
        .join("");
      return `
      <div class="export-stage-group">
        <div class="export-stage-name">${stage} · ${subs.length} submission${subs.length === 1 ? "" : "s"}</div>
        <table class="export-table">
          <thead><tr>
            <th>ID</th><th>Client</th><th>Vertical</th><th>Stage</th><th>Premium</th>
            <th>Days Open</th><th>E&amp;O Score</th><th>Producer</th><th>Carrier</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    })
    .join("");

  const carrierRows = carrierPerformance
    .map(
      (c) => `<tr>
        <td>${c.carrier}</td><td>${c.submissions}</td><td>${c.quotesReturned}</td>
        <td>${c.avgResponseTime}</td><td>${c.bindWins}</td>
      </tr>`,
    )
    .join("");

  return `
    <section class="export-section">
      <h2 class="export-section-title">Pipeline Summary</h2>
      <div class="export-kpi-grid">${kpiHtml}</div>
    </section>
    <section class="export-section">
      <h2 class="export-section-title">Active Submissions by Stage</h2>
      ${stageSections}
    </section>
    <section class="export-section">
      <h2 class="export-section-title">Carrier Performance</h2>
      <table class="export-table">
        <thead><tr><th>Carrier</th><th>Submissions</th><th>Quotes</th><th>Avg Response</th><th>Bind Wins</th></tr></thead>
        <tbody>${carrierRows}</tbody>
      </table>
    </section>`;
}

export function exportCommercialPipelinePdf(): void {
  exportHtmlAsPdf(
    getExportMeta("Commercial Pipeline Report", "Active submissions grouped by stage"),
    pipelinePdfBody(),
  );
}

export function exportCommercialPipelineCsv(): void {
  downloadCsv(
    `commercial-pipeline-${new Date().toISOString().slice(0, 10)}`,
    ["Submission ID", "Client", "Vertical", "Stage", "Premium", "Days Open", "E&O Score", "E&O Level", "Producer", "Carrier", "Status"],
    activeSubmissions.map((s) => {
      const risk = eoRiskFromHubSubmission(s);
      return [
        s.id,
        s.client,
        inferVertical(s.coverage),
        s.stage,
        s.premium,
        s.daysOpen,
        risk.total,
        risk.label,
        s.producer,
        s.carrierSubmissions[0]?.carrier ?? "",
        s.status,
      ];
    }),
  );
}

export function exportCarrierPerformanceCsv(): void {
  downloadCsv(
    `carrier-performance-${new Date().toISOString().slice(0, 10)}`,
    ["Carrier", "Submissions", "Quotes Returned", "Avg Response Time", "Bind Wins"],
    carrierPerformance.map((c) => [c.carrier, c.submissions, c.quotesReturned, c.avgResponseTime, c.bindWins]),
  );
}
