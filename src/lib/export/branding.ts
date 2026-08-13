export type ExportMeta = {
  title: string;
  subtitle?: string;
  exportedBy: string;
  exportedAt: Date;
  reportId?: string;
  orientation?: "portrait" | "landscape";
  variant?: "report" | "invoice";
};

export function getExportMeta(
  title: string,
  subtitle?: string,
  extras?: Pick<ExportMeta, "orientation" | "variant">,
): ExportMeta {
  return {
    title,
    subtitle,
    exportedBy: "Eva Chong",
    exportedAt: new Date(),
    reportId: `ITA-${Date.now().toString(36).toUpperCase()}`,
    ...extras,
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

const FONT_DISPLAY = "'Cormorant Garamond', 'Palatino Linotype', Palatino, 'Times New Roman', serif";
const FONT_SANS = "Inter, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const FONT_MONO = "'JetBrains Mono', 'SF Mono', Consolas, 'Courier New', monospace";

/** Shared inline styles for print/PDF export documents */
export const exportDocumentStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    background: #FFFFFF;
    color: #1C2B35;
  }
  body {
    font-family: ${FONT_SANS};
    font-size: 12px;
    line-height: 1.45;
    padding: 0;
  }
  .export-doc {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 8px 4px 16px;
    background: #FFFFFF;
  }
  .export-doc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    border-bottom: 1px solid #DDE4EA;
    padding-bottom: 16px;
    margin-bottom: 22px;
  }
  .export-doc-brand { display: flex; align-items: flex-start; gap: 12px; }
  .export-doc-logo {
    width: 40px; height: 22px;
    background: #1C2B35;
    border-radius: 3px;
    display: flex; align-items: center; justify-content: center;
    color: #FFFFFF; font-weight: 700; font-size: 9px; letter-spacing: 0.08em;
    font-family: ${FONT_SANS};
    flex-shrink: 0;
    margin-top: 4px;
  }
  .export-doc-org {
    font-family: ${FONT_SANS};
    font-size: 10px;
    color: #5E6B7D;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .export-doc-kicker {
    font-family: ${FONT_SANS};
    font-size: 10px;
    color: #8A98A6;
    font-weight: 500;
    margin-top: 2px;
  }
  .export-doc-title {
    font-family: ${FONT_DISPLAY};
    font-size: 30px;
    font-weight: 600;
    color: #1C2B35;
    margin-top: 4px;
    line-height: 1.15;
  }
  .export-doc--invoice .export-doc-title {
    font-size: 32px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .export-doc-subtitle { font-size: 12px; color: #5E6B7D; margin-top: 6px; }
  .export-doc-meta { text-align: right; font-size: 10px; color: #5E6B7D; }
  .export-doc-meta strong { display: block; color: #1C2B35; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
  .export-doc-meta span { display: block; margin-top: 2px; }
  .export-doc-meta .mono { font-family: ${FONT_MONO}; font-size: 9px; }
  .export-section { margin-bottom: 22px; }
  .export-section-title {
    font-family: ${FONT_SANS};
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #5E6B7D;
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid #DDE4EA;
  }
  .export-kpi-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 16px;
  }
  .export-kpi {
    border: 1px solid #DDE4EA;
    border-radius: 6px;
    padding: 12px 14px;
    background: #FFFFFF;
  }
  .export-kpi-label {
    font-family: ${FONT_SANS};
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #5E6B7D;
  }
  .export-kpi-value {
    font-family: ${FONT_MONO};
    font-size: 18px;
    font-weight: 600;
    color: #1C2B35;
    margin-top: 4px;
  }
  .export-kpi-sub { font-size: 10px; color: #5E6B7D; margin-top: 4px; }
  table.export-table {
    width: 100%;
    max-width: none;
    border-collapse: collapse;
    font-size: 11px;
    background: #FFFFFF;
    border: 1px solid #DDE4EA;
  }
  table.export-table thead { display: table-header-group; }
  table.export-table tfoot { display: table-footer-group; }
  table.export-table th {
    background: #F7FBFD;
    color: #5E6B7D;
    font-weight: 700;
    text-align: left;
    padding: 8px 10px;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #DDE4EA;
  }
  table.export-table td {
    padding: 8px 10px;
    border-bottom: 1px solid #E6EBF2;
    vertical-align: top;
    background: #FFFFFF;
  }
  table.export-table tr { page-break-inside: avoid; break-inside: avoid; }
  table.export-table tfoot td {
    font-weight: 700;
    border-top: 1px solid #1C2B35;
    border-bottom: none;
    background: #FFFFFF;
    padding-top: 10px;
  }
  .export-table .numeric,
  .export-table .mono {
    font-family: ${FONT_MONO};
    font-variant-numeric: tabular-nums;
    text-align: right;
  }
  .export-status {
    display: inline-block;
    padding: 1px 7px;
    border-radius: 3px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border: 1px solid #DDE4EA;
    background: #F7FBFD;
    color: #1C2B35;
  }
  .export-status--approved, .export-status--bound, .export-status--paid, .export-status--green {
    background: #F3FBF7; color: #1C2B35; border-color: #CDE8D8;
  }
  .export-status--pending, .export-status--quoted, .export-status--yellow {
    background: #FFFBF3; color: #1C2B35; border-color: #E8D9B0;
  }
  .export-status--critical, .export-status--overdue, .export-status--red {
    background: #FBF4F5; color: #1C2B35; border-color: #E8C9D0;
  }
  .export-status--draft, .export-status--blue {
    background: #F4F8FB; color: #1C2B35; border-color: #D0DCE8;
  }
  .export-sparkline {
    display: block;
    height: 28px;
    margin-top: 6px;
    font-family: ${FONT_MONO};
    font-size: 7pt;
    color: #7AAFC8;
    letter-spacing: 0.02em;
  }
  .export-invoice-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    margin-bottom: 8px;
  }
  .export-invoice-label {
    font-family: ${FONT_SANS};
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #8A98A6;
    margin-bottom: 4px;
  }
  .export-invoice-value {
    font-size: 13px;
    color: #1C2B35;
  }
  .export-invoice-value.mono {
    font-family: ${FONT_MONO};
    font-size: 14px;
    font-weight: 600;
  }
  .export-invoice-total {
    font-family: ${FONT_MONO};
    font-size: 18px;
    font-weight: 600;
    color: #1C2B35;
    text-align: right;
  }
  .export-invoice-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #E6EBF2;
    font-size: 13px;
  }
  .export-invoice-row span:last-child {
    font-family: ${FONT_MONO};
    font-weight: 500;
    font-size: 13px;
  }
  .export-invoice-row--total {
    border-bottom: none;
    border-top: 1px solid #1C2B35;
    margin-top: 4px;
    padding-top: 10px;
    font-weight: 700;
  }
  .export-invoice-row--total span:last-child {
    font-size: 18px;
    font-weight: 600;
  }
  .export-footer {
    margin-top: 28px;
    padding-top: 12px;
    border-top: 1px solid #DDE4EA;
    font-family: ${FONT_SANS};
    font-size: 9px;
    color: #8A98A6;
    text-align: left;
  }
  .export-stage-group { margin-bottom: 18px; page-break-inside: avoid; }
  .export-stage-name {
    font-weight: 700;
    font-size: 10px;
    color: #1C2B35;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 8px;
  }
  .print-hidden { display: none !important; }
  @page {
    margin: 16mm 14mm;
    size: letter;
  }
  @media print {
    html, body { background: #FFFFFF !important; }
    body { padding: 0; }
    .export-doc { max-width: none; width: 100%; padding: 0; }
    .export-doc-header, .export-section, .export-stage-group, .export-footer {
      break-inside: avoid;
    }
    table.export-table thead { display: table-header-group; }
    table.export-table tr { page-break-inside: avoid; break-inside: avoid; }
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

export function statusClass(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("approv") || s.includes("bound") || s.includes("paid") || s.includes("complete") || s.includes("sent") || s.includes("safe") || s.includes("low")) {
    return "export-status--approved";
  }
  if (s.includes("critical") || s.includes("overdue") || s.includes("declin") || s.includes("stale") || s.includes("high")) {
    return "export-status--critical";
  }
  if (s.includes("draft")) return "export-status--draft";
  if (s.includes("pending") || s.includes("quoted") || s.includes("review") || s.includes("watch") || s.includes("medium")) {
    return "export-status--pending";
  }
  return "export-status--blue";
}

export function statusBadge(status: string): string {
  const cls = statusClass(status);
  return `<span class="export-status ${cls}">${status}</span>`;
}

export function wrapExportDocument(meta: ExportMeta, bodyHtml: string): string {
  const landscape = meta.orientation === "landscape";
  const invoice = meta.variant === "invoice";
  const pageCss = landscape
    ? `@page { size: landscape; margin: 12mm 10mm; }`
    : `@page { size: letter; margin: 16mm 14mm; }`;
  const org = "Insurance Town Agency";
  const kicker = "Agency OS";
  const title = invoice ? "Invoice" : meta.title;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${meta.title}: Insurance Town</title>
  <style>${exportDocumentStyles}
  ${pageCss}
  </style>
</head>
<body>
  <div class="export-doc${invoice ? " export-doc--invoice" : ""}${landscape ? " export-doc--landscape" : ""}">
    <header class="export-doc-header">
      <div class="export-doc-brand">
        <div class="export-doc-logo">ITA</div>
        <div>
          <div class="export-doc-org">${org}</div>
          <div class="export-doc-kicker">${kicker}</div>
          <h1 class="export-doc-title">${title}</h1>
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
      Confidential: Insurance Town Agency OS · Patent Pending USPTO #64/053,057
    </footer>
  </div>
</body>
</html>`;
}
