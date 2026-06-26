import { formatMoney, type InvoiceClient } from "@/data/epayPolicy";
import { getExportMeta, statusBadge } from "../branding";
import { exportHtmlAsPdf } from "../print";

export function exportEpayInvoicePdf(client: InvoiceClient, totalDue: number): void {
  const inv = client.invoice;
  const body = `
    <section class="export-section">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">
        <div>
          <h2 class="export-section-title" style="margin-bottom:8px">Bill To</h2>
          <p><strong>${client.clientName}</strong></p>
          <p style="color:#5a6f7d;font-size:9pt">${client.policyType}</p>
          <p style="margin-top:8px">Producer: ${client.producer}</p>
          <p>VA: ${client.assignedVa}</p>
        </div>
        <div style="text-align:right">
          <p style="font-size:9pt;color:#5a6f7d">Invoice #</p>
          <p style="font-family:'JetBrains Mono',monospace;font-size:14pt;font-weight:600">${inv.invoiceNumber}</p>
          <p style="margin-top:12px;font-size:9pt;color:#5a6f7d">Due Date</p>
          <p style="font-weight:600">${inv.paymentDueDate}</p>
          <p style="margin-top:8px">${statusBadge(client.status)}</p>
        </div>
      </div>
    </section>
    <section class="export-section">
      <h2 class="export-section-title">Policy Details</h2>
      <p>Carrier: <strong>${client.carrier}</strong></p>
      <p style="margin-top:4px">Effective: ${client.effectiveDate} · Renewal: ${client.renewalDate}</p>
    </section>
    <section class="export-section">
      <h2 class="export-section-title">Charges</h2>
      <div class="export-invoice-row"><span>Policy Premium</span><span>${formatMoney(inv.policyPremium)}</span></div>
      <div class="export-invoice-row"><span>Broker Fee</span><span>${formatMoney(inv.brokerFee)}</span></div>
      <div class="export-invoice-row"><span>Taxes &amp; Fees</span><span>${formatMoney(inv.taxesFees)}</span></div>
      <div class="export-invoice-total">Total Due: ${formatMoney(totalDue)}</div>
      <p style="text-align:right;margin-top:8px;font-size:9pt;color:#5a6f7d">
        Payment method: ${inv.paymentMethod} · ${inv.installmentOption}
      </p>
    </section>
    ${inv.notes ? `<section class="export-section"><h2 class="export-section-title">Notes</h2><p>${inv.notes}</p></section>` : ""}`;

  exportHtmlAsPdf(
    getExportMeta("Invoice", `${client.clientName} · ${inv.invoiceNumber}`),
    body,
  );
}
