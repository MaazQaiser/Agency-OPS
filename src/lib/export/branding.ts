export type ExportMeta = {
  title: string;
  subtitle?: string;
  exportedBy: string;
  exportedAt: Date;
  reportId?: string;
};

export function getExportMeta(title: string, subtitle?: string): ExportMeta {
  return {
    title,
    subtitle,
    exportedBy: "Eva Chong",
    exportedAt: new Date(),
    reportId: `ITA-${Date.now().toString(36).toUpperCase()}`,
  };
}

export function formatExportDate(date: Date): string {
  return date.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Shared inline styles for print/PDF export documents */
export const exportDocumentStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #1C2B35;
    background: #F7FBFD;
    padding: 32px 40px;
  }
  .export-doc { max-width: 900px; margin: 0 auto; }
  .export-doc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #AAD0E7;
    padding-bottom: 20px;
    margin-bottom: 28px;
  }
  .export-doc-brand { display: flex; align-items: center; gap: 14px; }
  .export-doc-logo {
    width: 48px; height: 24px;
    background: #1C2B35;
    border-radius: 4px;
    display: flex; align-items: center; justify-content: center;
    color: #AAD0E7; font-weight: 700; font-size: 9px; letter-spacing: 0.08em;
  }
  .export-doc-org { font-size: 10pt; color: #7AAFC8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
  .export-doc-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 28pt;
    font-weight: 700;
    color: #1C2B35;
    margin-top: 4px;
    line-height: 1.15;
  }
  .export-doc-subtitle { font-size: 11pt; color: #5a6f7d; margin-top: 6px; }
  .export-doc-meta { text-align: right; font-size: 9pt; color: #5a6f7d; }
  .export-doc-meta strong { display: block; color: #1C2B35; font-size: 10pt; margin-bottom: 4px; }
  .export-doc-meta span { display: block; margin-top: 2px; }
  .export-doc-meta .mono { font-family: 'JetBrains Mono', monospace; font-size: 8pt; }
  .export-section { margin-bottom: 28px; }
  .export-section-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 16pt;
    font-weight: 600;
    color: #1C2B35;
    margin-bottom: 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid #d4e8f2;
  }
  .export-kpi-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  .export-kpi {
    border: 1px solid #d4e8f2;
    border-radius: 8px;
    padding: 14px 16px;
    background: #fff;
  }
  .export-kpi-label { font-size: 8pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #7AAFC8; }
  .export-kpi-value {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 22pt;
    font-weight: 700;
    color: #1C2B35;
    margin-top: 4px;
  }
  .export-kpi-sub { font-size: 8pt; color: #5a6f7d; margin-top: 4px; }
  table.export-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9pt;
    background: #fff;
    border: 1px solid #d4e8f2;
    border-radius: 8px;
    overflow: hidden;
  }
  table.export-table th {
    background: #1C2B35;
    color: #F7FBFD;
    font-weight: 600;
    text-align: left;
    padding: 10px 12px;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  table.export-table td {
    padding: 9px 12px;
    border-bottom: 1px solid #e8f2f8;
    vertical-align: top;
  }
  table.export-table tr:last-child td { border-bottom: none; }
  table.export-table tr:nth-child(even) td { background: #f7fbfd; }
  .export-status {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 8pt;
    font-weight: 600;
    border: 1px solid;
  }
  .export-status--approved, .export-status--bound, .export-status--paid, .export-status--green {
    background: #ecfdf5; color: #065f46; border-color: #10B981;
  }
  .export-status--pending, .export-status--quoted, .export-status--yellow {
    background: #fffbeb; color: #92400e; border-color: #F59E0B;
  }
  .export-status--critical, .export-status--overdue, .export-status--red {
    background: #fff1f2; color: #9f1239; border-color: #F43F5E;
  }
  .export-status--draft, .export-status--blue {
    background: #eff6ff; color: #1e40af; border-color: #3B82F6;
  }
  .export-sparkline {
    display: block;
    height: 28px;
    margin-top: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 7pt;
    color: #7AAFC8;
    letter-spacing: 0.02em;
  }
  .export-invoice-total {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 24pt;
    font-weight: 700;
    color: #1C2B35;
    text-align: right;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 2px solid #1C2B35;
  }
  .export-invoice-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #e8f2f8;
  }
  .export-invoice-row span:last-child {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 500;
  }
  .export-footer {
    margin-top: 40px;
    padding-top: 16px;
    border-top: 1px solid #d4e8f2;
    font-size: 8pt;
    color: #7AAFC8;
    text-align: center;
  }
  .export-stage-group { margin-bottom: 20px; }
  .export-stage-name {
    font-weight: 700;
    font-size: 10pt;
    color: #7AAFC8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 8px;
  }
  @media print {
    body { padding: 16px; background: #fff; }
    .export-doc { max-width: 100%; }
  }
`;

export function statusClass(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("approv") || s.includes("bound") || s.includes("paid") || s.includes("complete") || s.includes("sent")) {
    return "export-status--approved";
  }
  if (s.includes("critical") || s.includes("overdue") || s.includes("declin") || s.includes("stale")) {
    return "export-status--critical";
  }
  if (s.includes("draft")) return "export-status--draft";
  if (s.includes("pending") || s.includes("quoted") || s.includes("review") || s.includes("watch")) {
    return "export-status--pending";
  }
  return "export-status--blue";
}

export function statusBadge(status: string): string {
  const cls = statusClass(status);
  return `<span class="export-status ${cls}">${status}</span>`;
}

export function wrapExportDocument(meta: ExportMeta, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${meta.title} — Insurance Town</title>
  <style>${exportDocumentStyles}</style>
</head>
<body>
  <div class="export-doc">
    <header class="export-doc-header">
      <div class="export-doc-brand">
        <div class="export-doc-logo">ITA</div>
        <div>
          <div class="export-doc-org">Insurance Town · Agency OS</div>
          <h1 class="export-doc-title">${meta.title}</h1>
          ${meta.subtitle ? `<p class="export-doc-subtitle">${meta.subtitle}</p>` : ""}
        </div>
      </div>
      <div class="export-doc-meta">
        <strong>Generated</strong>
        <span>${formatExportDate(meta.exportedAt)}</span>
        <span>Exported by ${meta.exportedBy}</span>
        ${meta.reportId ? `<span class="mono">${meta.reportId}</span>` : ""}
      </div>
    </header>
    ${bodyHtml}
    <footer class="export-footer">
      Confidential — Insurance Town Agency OS · Patent Pending USPTO #64/053,057
    </footer>
  </div>
</body>
</html>`;
}
