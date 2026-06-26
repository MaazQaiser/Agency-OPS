import { trackerFollowUpQueue } from "@/data/submissionTracker";
import { downloadCsv } from "../csv";
import { getExportMeta, statusBadge } from "../branding";
import { exportHtmlAsPdf } from "../print";

export function exportCarrierResponseLogCsv(): void {
  downloadCsv(
    `carrier-response-log-${new Date().toISOString().slice(0, 10)}`,
    ["Carrier", "Client", "Days Since Sent", "Follow-Ups", "Due", "Assigned VA", "Status"],
    trackerFollowUpQueue.map((r) => [
      r.carrier,
      r.client,
      r.daysSinceSent,
      r.followUpCount,
      r.due,
      r.assigned,
      r.status,
    ]),
  );
}

export function exportCarrierResponseLogPdf(): void {
  const rows = trackerFollowUpQueue
    .map(
      (r) => `<tr>
        <td><strong>${r.carrier}</strong></td>
        <td>${r.client}</td>
        <td>${r.daysSinceSent}d · ${r.followUpCount} follow-ups</td>
        <td>${r.due}</td>
        <td>${r.assigned}</td>
        <td>${statusBadge(r.status)}</td>
      </tr>`,
    )
    .join("");

  exportHtmlAsPdf(
    getExportMeta("Carrier Response Log", "Follow-up queue and carrier SLA tracking"),
    `<section class="export-section">
      <table class="export-table">
        <thead><tr>
          <th>Carrier</th><th>Client</th><th>Aging</th><th>Due</th><th>VA</th><th>Status</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`,
  );
}
