import { formatMoney, type InvoiceClient } from "@/data/epayPolicy";
import { getExportMeta, statusBadge } from "../branding";
import { exportHtmlAsPdf } from "../print";

export function exportEpayInvoicePdf(client: InvoiceClient, totalDue: number): void {
  const inv = client.invoice;
  const trust = client.trustAccount;
  const paid = client.paymentRequest.lifecycle.paid;
  const statusText = paid ? "Paid" : client.status;

  const body = `
    <section class="export-section">
      <div class="export-invoice-grid">
        <div>
          <p class="export-invoice-label">Invoice number</p>
          <p class="export-invoice-value mono">${inv.invoiceNumber}</p>
        </div>
        <div>
          <p class="export-invoice-label">Due date</p>
          <p class="export-invoice-value">${inv.paymentDueDate}</p>
        </div>
        <div>
          <p class="export-invoice-label">Payment status</p>
          <p class="export-invoice-value">${statusBadge(statusText)}</p>
        </div>
        <div>
          <p class="export-invoice-label">Billing type</p>
          <p class="export-invoice-value">${client.billingType}</p>
        </div>
      </div>
    </section>

    <section class="export-section">
      <h2 class="export-section-title">Client</h2>
      <div class="export-invoice-grid">
        <div>
          <p class="export-invoice-label">Bill to</p>
          <p class="export-invoice-value"><strong>${client.clientName}</strong></p>
        </div>
        <div>
          <p class="export-invoice-label">Producer / VA</p>
          <p class="export-invoice-value">${client.producer} · ${client.assignedVa}</p>
        </div>
      </div>
    </section>

    <section class="export-section">
      <h2 class="export-section-title">Policy</h2>
      <div class="export-invoice-grid">
        <div>
          <p class="export-invoice-label">Policy type</p>
          <p class="export-invoice-value">${client.policyType}</p>
        </div>
        <div>
          <p class="export-invoice-label">Carrier</p>
          <p class="export-invoice-value">${client.carrier}</p>
        </div>
        <div>
          <p class="export-invoice-label">Effective</p>
          <p class="export-invoice-value">${client.effectiveDate}</p>
        </div>
        <div>
          <p class="export-invoice-label">Renewal</p>
          <p class="export-invoice-value">${client.renewalDate}</p>
        </div>
      </div>
    </section>

    <section class="export-section">
      <h2 class="export-section-title">Charges</h2>
      <table class="export-table">
        <thead>
          <tr>
            <th>Description</th>
            <th class="numeric">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Policy Premium</td>
            <td class="numeric">${formatMoney(inv.policyPremium)}</td>
          </tr>
          <tr>
            <td>Broker Fee</td>
            <td class="numeric">${formatMoney(inv.brokerFee)}</td>
          </tr>
          <tr>
            <td>Taxes &amp; Fees</td>
            <td class="numeric">${formatMoney(inv.taxesFees)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Total Due</td>
            <td class="numeric export-invoice-total">${formatMoney(totalDue)}</td>
          </tr>
        </tfoot>
      </table>
    </section>

    <section class="export-section">
      <h2 class="export-section-title">Payment</h2>
      <div class="export-invoice-grid">
        <div>
          <p class="export-invoice-label">Method</p>
          <p class="export-invoice-value">${inv.paymentMethod}</p>
        </div>
        <div>
          <p class="export-invoice-label">Installment</p>
          <p class="export-invoice-value">${inv.installmentOption}</p>
        </div>
        <div>
          <p class="export-invoice-label">Payment link status</p>
          <p class="export-invoice-value">${client.paymentRequest.linkStatus}</p>
        </div>
        <div>
          <p class="export-invoice-label">Sent to</p>
          <p class="export-invoice-value">${client.paymentRequest.sentTo}</p>
        </div>
      </div>
    </section>

    <section class="export-section">
      <h2 class="export-section-title">Trust account</h2>
      <div class="export-invoice-grid">
        <div>
          <p class="export-invoice-label">Account</p>
          <p class="export-invoice-value">${trust.accountName}</p>
        </div>
        <div>
          <p class="export-invoice-label">Deposit method</p>
          <p class="export-invoice-value">${trust.depositMethod}</p>
        </div>
        <div>
          <p class="export-invoice-label">Reference</p>
          <p class="export-invoice-value mono">${trust.referenceNumber}</p>
        </div>
        <div>
          <p class="export-invoice-label">Expected deposit</p>
          <p class="export-invoice-value">${trust.expectedDepositDate}</p>
        </div>
      </div>
    </section>

    ${inv.notes ? `<section class="export-section"><h2 class="export-section-title">Notes</h2><p class="export-invoice-value">${inv.notes}</p></section>` : ""}`;

  exportHtmlAsPdf(
    getExportMeta("Invoice", `${client.clientName} · ${inv.invoiceNumber}`, { variant: "invoice" }),
    body,
  );
}
