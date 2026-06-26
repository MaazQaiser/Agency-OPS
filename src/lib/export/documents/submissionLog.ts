import { trackerSubmissions, computeHealthScore } from "@/data/submissionTracker";
import { downloadCsv } from "../csv";
import { getExportMeta, statusBadge } from "../branding";
import { exportHtmlAsPdf } from "../print";

export function exportSubmissionLogCsv(): void {
  downloadCsv(
    `submission-log-${new Date().toISOString().slice(0, 10)}`,
    [
      "Submission ID",
      "Client",
      "Producer",
      "VA",
      "Coverage",
      "Stage",
      "Status",
      "Days Open",
      "Carrier",
      "Premium",
      "Health Score",
    ],
    trackerSubmissions.map((s) => [
      s.id,
      s.client,
      s.producer,
      s.va,
      s.coverage,
      s.status,
      s.status,
      s.daysOpen,
      s.carriers[0]?.carrier ?? "",
      s.premiumValue,
      computeHealthScore(s),
    ]),
  );
}

export function exportSubmissionLogPdf(): void {
  const rows = trackerSubmissions
    .map(
      (s) => `<tr>
        <td style="font-family:'JetBrains Mono',monospace;font-size:8pt">${s.id}</td>
        <td><strong>${s.client}</strong></td>
        <td>${s.producer}</td>
        <td>${s.va}</td>
        <td>${s.coverage}</td>
        <td>${statusBadge(s.status)}</td>
        <td>${s.daysOpen}d</td>
        <td>${computeHealthScore(s)}</td>
      </tr>`,
    )
    .join("");

  exportHtmlAsPdf(
    getExportMeta("Submission Log", `${trackerSubmissions.length} active tracker records`),
    `<section class="export-section">
      <table class="export-table">
        <thead><tr>
          <th>ID</th><th>Client</th><th>Producer</th><th>VA</th><th>Coverage</th>
          <th>Status</th><th>Days</th><th>Health</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`,
  );
}
