import { wrapExportDocument, type ExportMeta } from "./branding";

export function openPrintDocument(html: string, title: string): void {
  const win = window.open("", "_blank", "noopener,noreferrer,width=960,height=720");
  if (!win) {
    window.alert("Please allow pop-ups to export or print this report.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.document.title = title;
  win.focus();
  win.onload = () => {
    window.setTimeout(() => win.print(), 280);
  };
}

export function exportHtmlAsPdf(meta: ExportMeta, bodyHtml: string): void {
  const html = wrapExportDocument(meta, bodyHtml);
  openPrintDocument(html, meta.title);
}

export function printCurrentPage(): void {
  window.print();
}
