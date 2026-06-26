import { sentProposalRecords } from "@/data/sendCenter";
import { downloadCsv } from "../csv";
import { getExportMeta, statusBadge } from "../branding";
import { exportHtmlAsPdf } from "../print";

export function exportSendCenterHistoryCsv(): void {
  downloadCsv(
    `send-center-proposals-${new Date().toISOString().slice(0, 10)}`,
    ["Client", "Sent Date", "Opened", "Viewed", "Accepted", "Expired", "Open Count", "Replied", "Days Since Activity"],
    sentProposalRecords.map((r) => [
      r.client,
      r.sentDate,
      r.opened ? "Yes" : "No",
      r.viewed ? "Yes" : "No",
      r.accepted ? "Yes" : "No",
      r.expired ? "Yes" : "No",
      r.openCount,
      r.replied ? "Yes" : "No",
      r.daysSinceActivity,
    ]),
  );
}

export function exportSendCenterHistoryPdf(): void {
  const rows = sentProposalRecords
    .map((r) => {
      const status = r.accepted ? "Accepted" : r.expired ? "Expired" : r.viewed ? "Viewed" : r.opened ? "Opened" : "Sent";
      return `<tr>
        <td><strong>${r.client}</strong></td>
        <td>${r.sentDate}</td>
        <td>${statusBadge(status)}</td>
        <td>${r.openCount} opens</td>
        <td>${r.replied ? "Replied" : "No reply"}</td>
        <td>${r.daysSinceActivity}d ago</td>
      </tr>`;
    })
    .join("");

  exportHtmlAsPdf(
    getExportMeta("Send Center Proposal History", "Sent proposals and client engagement"),
    `<section class="export-section">
      <table class="export-table">
        <thead><tr>
          <th>Client</th><th>Sent</th><th>Status</th><th>Engagement</th><th>Reply</th><th>Activity</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`,
  );
}
