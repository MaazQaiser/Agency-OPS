"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { useCrossModuleHandoff } from "@/hooks/useCrossModuleHandoff";
import { resolveInvoiceClientId } from "@/lib/crossModuleLinks";
import {
  calculateTotalDue,
  DEFAULT_INVOICE_CLIENT_ID,
  formatMoney,
  getComplianceStatus,
  getInvoiceClient,
  getInvoiceReadinessItems,
  installmentOptions,
  invoiceBuilderHeader,
  invoiceClients,
  isInvoiceReadyForSend,
  paymentMethodOptions,
  pendingInvoices,
  pendingStatusClass,
  type InvoiceFormData,
  type PendingInvoice,
} from "@/data/epayPolicy";
import { epayStatusClass } from "@/data/epayStatus";
import { exportEpayInvoicePdf } from "@/lib/export";
import { ExportMenu } from "@/components/export/ExportMenu";
import { FormSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { useSyncBreadcrumbDetail } from "@/hooks/useSyncBreadcrumbDetail";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";
import { toastMessages } from "@/lib/toastMessages";
import { ClientLanguageBadges } from "@/components/bilingual/ClientLanguageBadges";
import { getClientLanguage, getLanguageBadgeCode } from "@/data/bilingualClient";
import { EPayAccordion } from "./EPayAccordion";
import { EPayConfirmModal } from "./EPayConfirmModal";
import { BrokerFeeTriggerConfirmation } from "./BrokerFeeTriggerConfirmation";
import { InvoiceDrawer } from "./InvoiceDrawer";
import { InvoiceReadinessPanel } from "./InvoiceReadinessPanel";
import { PaymentLifecycleStepper } from "./PaymentLifecycleStepper";

function parseMoneyInput(value: string): number {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

type InvoiceBuilderTabProps = {
  onToast?: (message: string, variant?: "success" | "error") => void;
};

export function InvoiceBuilderTab(_props: InvoiceBuilderTabProps) {
  const toast = useToast();
  const {
    status,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => invoiceClients,
    errorPreset: "supabase-timeout",
  });
  const [clientId, setClientId] = useState(DEFAULT_INVOICE_CLIENT_ID);
  const client = useMemo(() => getInvoiceClient(clientId) ?? invoiceClients[0], [clientId]);
  const [form, setForm] = useState<InvoiceFormData>(client.invoice);
  const [selectedPending, setSelectedPending] = useState<PendingInvoice | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false);
  const [sendInvoiceConfirmOpen, setSendInvoiceConfirmOpen] = useState(false);

  const onProposalHandoff = useCallback(
    (payload: Record<string, string | undefined>) => {
      const invoiceClientId = resolveInvoiceClientId(payload.client ?? "");
      if (invoiceClientId) {
        setClientId(invoiceClientId);
        const next = getInvoiceClient(invoiceClientId);
        if (next) {
          const premium = parseMoneyInput(payload.premium ?? "");
          const fees = parseMoneyInput(payload.fees ?? "");
          setForm({
            ...next.invoice,
            policyPremium: premium > 0 ? premium : next.invoice.policyPremium,
            brokerFee: fees > 0 ? fees : next.invoice.brokerFee,
          });
        }
      }
      toast.success(`Invoice pre-filled from proposal: ${payload.client ?? "client"}`);
    },
    [toast],
  );

  useCrossModuleHandoff("proposal-to-invoice", onProposalHandoff);

  useSyncBreadcrumbDetail(client?.clientName ?? null, {
    paramKey: "invoice",
    paramValue: client?.id,
  });

  const totalDue = calculateTotalDue(form);
  const readinessItems = useMemo(() => getInvoiceReadinessItems(client, form), [client, form]);
  const isReady = isInvoiceReadyForSend(readinessItems);
  const complianceStatus = getComplianceStatus(client.compliance);
  const billingLang = getClientLanguage(client.clientName);
  const invoiceLocalized = billingLang.billingLanguage === billingLang.preferredLanguage;
  const pendingTotal = pendingInvoices.reduce((sum, inv) => sum + inv.amountValue, 0);
  const overduePendingCount = pendingInvoices.filter((inv) => inv.status === "Overdue").length;

  const updateForm = <K extends keyof InvoiceFormData>(key: K, value: InvoiceFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleClientChange = (id: string) => {
    setClientId(id);
    const next = getInvoiceClient(id);
    if (next) setForm(next.invoice);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(client.paymentRequest.paymentLink);
      setLinkCopied(true);
      toast.success("Payment link copied");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.error("Unable to copy link");
    }
  };

  const handleSendLink = async () => {
    setSendingLink(true);
    const toastId = toast.processing("Sending payment link…");
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSendingLink(false);
    toast.update(toastId, toastMessages.epay.paymentLinkSent, "success");
  };

  const handleSaveInvoice = () => toast.success(toastMessages.epay.invoiceCreated);
  const handleMarkReady = () => toast.success("Invoice marked ready");
  const handleDownloadPdf = () => exportEpayInvoicePdf(client, totalDue);

  const handleSendInvoice = async () => {
    const toastId = toast.processing(toastMessages.epay.generatingInvoice);
    await new Promise((resolve) => setTimeout(resolve, 900));
    toast.update(toastId, toastMessages.epay.invoiceCreated, "success");
  };

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <div className="va-ops-role-view epay-invoice-builder">
          <FormSkeleton />
        </div>
      }
      empty={<HubEmptyState preset="epay-invoices" />}
      error={
        <HubErrorState
          preset="supabase-timeout"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      }
    >
    <div className="va-ops-role-view epay-invoice-builder">
      <div className="export-table-header-export">
        <RoleTabHeader
          title={invoiceBuilderHeader.title}
          subtitle={invoiceBuilderHeader.subtitle}
        />
        <ExportMenu
          kind="epay-invoice"
          invoiceExport={() => exportEpayInvoicePdf(client, totalDue)}
        />
      </div>

      <InvoiceReadinessPanel items={readinessItems} ready={isReady} />

      <section className="va-ops-panel epay-client-summary" aria-label="Client summary">
        <div className="epay-client-summary-top">
          <div>
            <h3 className="epay-client-name">{client.clientName}</h3>
            <p className="epay-client-status">{client.status}</p>
            <ClientLanguageBadges profile={billingLang} className="epay-lang-badges" />
          </div>
          <label className="epay-client-switcher">
            <span className="epay-client-switcher-label">Switch client</span>
            <select
              className="header-filter-select"
              value={clientId}
              onChange={(e) => handleClientChange(e.target.value)}
            >
              {invoiceClients.map((c) => (
                <option key={c.id} value={c.id}>{c.clientName}</option>
              ))}
            </select>
          </label>
        </div>
        <dl className="epay-client-summary-grid">
          <div><dt>Policy Type</dt><dd>{client.policyType}</dd></div>
          <div><dt>Carrier</dt><dd>{client.carrier}</dd></div>
          <div><dt>Producer</dt><dd>{client.producer}</dd></div>
          <div><dt>Assigned VA</dt><dd>{client.assignedVa}</dd></div>
          <div><dt>Policy Effective Date</dt><dd>{client.effectiveDate}</dd></div>
          <div><dt>Renewal Date</dt><dd>{client.renewalDate}</dd></div>
          <div><dt>Billing Language</dt><dd>{billingLang.billingLanguage} ({getLanguageBadgeCode(billingLang.billingLanguage)})</dd></div>
          <div><dt>Invoice Language Status</dt><dd><span className={cn("badge", invoiceLocalized ? "badge-green" : "badge-red")}>{invoiceLocalized ? "Localized" : "Not Localized"}</span></dd></div>
        </dl>
        {!invoiceLocalized && (
          <div className="bilingual-mismatch-warning" role="alert">
            <span className="badge badge-yellow">Reminder</span>
            <span>Payment reminders should be sent in {billingLang.billingLanguage}.</span>
          </div>
        )}
      </section>

      <div className="epay-builder-main epay-builder-split">
        <section className="va-ops-panel" aria-label="Invoice details">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Invoice Details</h3>
            <p className="va-ops-section-sub">
              Broker fee must be a separate line item from premium (compliance requirement).
            </p>
          </div>
          <form className="epay-invoice-form" onSubmit={(e) => e.preventDefault()}>
            <label className="epay-form-field">
              <span className="epay-form-label">Invoice Number</span>
              <input type="text" className="epay-form-input epay-form-input-readonly" value={form.invoiceNumber} readOnly aria-readonly="true" />
              <span className="epay-form-helper">Auto-generated</span>
            </label>
            <label className="epay-form-field">
              <span className="epay-form-label">Policy Premium</span>
              <input type="text" className="epay-form-input" value={form.policyPremium} onChange={(e) => updateForm("policyPremium", parseMoneyInput(e.target.value))} />
            </label>
            <label className="epay-form-field epay-broker-fee-field">
              <span className="epay-form-label">
                Broker Fee
                <span className="epay-compliance-tag">Separate line item</span>
              </span>
              <input type="text" className="epay-form-input epay-broker-fee-input" value={form.brokerFee} onChange={(e) => updateForm("brokerFee", parseMoneyInput(e.target.value))} />
            </label>
            <label className="epay-form-field">
              <span className="epay-form-label">Taxes / Fees</span>
              <input type="text" className="epay-form-input" value={form.taxesFees} onChange={(e) => updateForm("taxesFees", parseMoneyInput(e.target.value))} />
            </label>
            <label className="epay-form-field">
              <span className="epay-form-label">Payment Due Date</span>
              <input type="text" className="epay-form-input" value={form.paymentDueDate} onChange={(e) => updateForm("paymentDueDate", e.target.value)} />
            </label>
            <label className="epay-form-field">
              <span className="epay-form-label">Payment Method</span>
              <select className="header-filter-select epay-form-select" value={form.paymentMethod} onChange={(e) => updateForm("paymentMethod", e.target.value as InvoiceFormData["paymentMethod"])}>
                {paymentMethodOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="epay-form-field">
              <span className="epay-form-label">Installment Option</span>
              <select className="header-filter-select epay-form-select" value={form.installmentOption} onChange={(e) => updateForm("installmentOption", e.target.value as InvoiceFormData["installmentOption"])}>
                {installmentOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="epay-form-field epay-form-field-full">
              <span className="epay-form-label">Notes</span>
              <textarea className="epay-form-textarea" rows={3} value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} />
            </label>
          </form>
        </section>

        <aside className="epay-builder-sidebar">
          <section className="va-ops-panel epay-preview-panel" aria-label="Invoice preview">
            <div className="va-ops-panel-header">
              <h3 className="va-ops-section-title">Invoice Preview</h3>
              <p className="va-ops-section-sub">Real-time invoice summary.</p>
            </div>
            <dl className="epay-preview-breakdown">
              <div className="epay-preview-row"><dt>Policy Premium</dt><dd>{formatMoney(form.policyPremium)}</dd></div>
              <div className="epay-preview-row epay-preview-broker"><dt>Broker Fee</dt><dd>{formatMoney(form.brokerFee)}</dd></div>
              <div className="epay-preview-row"><dt>Taxes</dt><dd>{formatMoney(form.taxesFees)}</dd></div>
              <div className="epay-preview-row epay-preview-total"><dt>Total Due</dt><dd>{formatMoney(totalDue)}</dd></div>
              <div className="epay-preview-row epay-preview-due"><dt>Due Date</dt><dd>{form.paymentDueDate}</dd></div>
              <div className="epay-preview-row"><dt>Payment Method</dt><dd>{form.paymentMethod}</dd></div>
              <div className="epay-preview-row epay-preview-status-row">
                <dt>Status</dt>
                <dd>
                  <span className={cn("epay-preview-status-badge", epayStatusClass.Pending)}>Pending Payment</span>
                </dd>
              </div>
              <div className="epay-preview-row">
                <dt>Billing Type</dt>
                <dd>
                  <span className={cn("badge", client.billingType === "Agency Bill" ? "badge-violet" : "badge-blue")}>
                    {client.billingType}
                  </span>
                </dd>
              </div>
            </dl>
            <BrokerFeeTriggerConfirmation
              billingType={client.billingType}
              steps={client.brokerFeeTrigger}
            />
          </section>

          <section className="va-ops-panel epay-send-gate-panel" aria-label="Send gate: validation and compliance">
            <div className="epay-send-gate-flow" aria-hidden="true">
              <span className="active">Build</span>
              <span className={isReady ? "active" : ""}>Validate</span>
              <span className={complianceStatus === "Ready" ? "active" : ""}>Compliance</span>
              <span className={isReady ? "active" : ""}>Send</span>
            </div>
            <div className="epay-compliance-header">
              <div>
                <h3 className="va-ops-section-title">Compliance Check</h3>
                <p className="va-ops-section-sub">Hard gate before invoice send: all requirements must pass.</p>
              </div>
              <span className={cn("badge epay-compliance-badge", isReady ? epayStatusClass.Paid : epayStatusClass.Failed)}>
                {isReady ? "Ready" : "Blocked"}
              </span>
            </div>
            <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
              <table className="commercial-hub-table epay-compliance-table">
                <thead>
                  <tr><th>Requirement</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {readinessItems.map((item) => (
                    <tr key={item.id} className={cn(item.complete && "epay-compliance-row-complete")}>
                      <td>{item.label}</td>
                      <td>
                        <span className={cn("submission-approval-status-cell", item.complete ? "complete" : "incomplete")}>
                          <AppIcon name={item.complete ? "check" : "x"} size={15} strokeWidth={2.5} />
                          {item.complete ? "Complete" : "Incomplete"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!isReady && (
              <p className="epay-send-gate-blocked" role="alert">
                Send blocked: complete all readiness checks before sending invoice.
              </p>
            )}
            <div className="epay-compliance-actions">
              <button
                type="button"
                className={cn("va-ops-role-action-btn epay-send-invoice-cta", !isReady && "disabled")}
                disabled={!isReady}
                onClick={() => setSendInvoiceConfirmOpen(true)}
              >
                <AppIcon name="send" size={15} strokeWidth={2} />
                Send Invoice
              </button>
            </div>
          </section>
        </aside>
      </div>

      <div className="epay-builder-accordions">
        <EPayAccordion title="Payment Request" subtitle="Payment lifecycle and link delivery." defaultOpen>
          <PaymentLifecycleStepper client={client} />
          <dl className="epay-payment-request-grid">
            <div><dt>Sent To</dt><dd><a href={`mailto:${client.paymentRequest.sentTo}`} className="epay-contact-link">{client.paymentRequest.sentTo}</a></dd></div>
            <div><dt>Sent At</dt><dd>{client.paymentRequest.sentAt}</dd></div>
          </dl>
          <div className="epay-payment-link-actions">
            <button type="button" className="va-ops-action-btn" onClick={copyLink}>{linkCopied ? "Copied!" : "Copy Link"}</button>
            <button
              type="button"
              className="va-ops-action-btn"
              disabled={sendingLink}
              onClick={() => setSendConfirmOpen(true)}
            >
              {sendingLink ? "Sending…" : "Resend Link"}
            </button>
          </div>
        </EPayAccordion>

        <EPayAccordion title="Trust Account Reference" subtitle="Internal financial tracking." countBadge={1} statusSummary={client.trustAccount.referenceNumber} preview={
          <div className="epay-accordion-preview-row">
            <span><strong>{client.trustAccount.accountName}</strong></span>
            <span>{client.trustAccount.depositMethod}</span>
            <span>Expected: {client.trustAccount.expectedDepositDate}</span>
          </div>
        }>
          <dl className="epay-trust-grid">
            <div><dt>Trust Account Name</dt><dd>{client.trustAccount.accountName}</dd></div>
            <div><dt>Deposit Method</dt><dd>{client.trustAccount.depositMethod}</dd></div>
            <div><dt>Reference Number</dt><dd>{client.trustAccount.referenceNumber}</dd></div>
            <div><dt>Expected Deposit Date</dt><dd>{client.trustAccount.expectedDepositDate}</dd></div>
          </dl>
        </EPayAccordion>

        <EPayAccordion
          title="Payment Activity"
          subtitle="Track payment flow and client engagement."
          countBadge={client.activity.length}
          statusSummary={client.activity[0]?.message ?? "No recent activity"}
          preview={
            <ul className="epay-accordion-preview-list">
              {client.activity.slice(0, 2).map((item) => (
                <li key={item.id} className="epay-accordion-preview-item">
                  <span className="epay-accordion-preview-label">{item.message}</span>
                  <span className="epay-accordion-preview-meta">{item.timeAgo}</span>
                </li>
              ))}
            </ul>
          }
        >
          <ol className="outreach-activity-timeline">
            {client.activity.map((item) => (
              <li key={item.id} className="outreach-activity-item">
                <div className="outreach-activity-dot" aria-hidden="true" />
                <div className="outreach-activity-content">
                  <div className="outreach-activity-message">{item.message}</div>
                  <div className="outreach-activity-time">{item.timeAgo}</div>
                </div>
              </li>
            ))}
          </ol>
        </EPayAccordion>

        <EPayAccordion
          title="Pending Payments"
          subtitle="Collections visibility: click a row for full invoice details."
          countBadge={pendingInvoices.length}
          statusSummary={`${formatMoney(pendingTotal)} outstanding${overduePendingCount > 0 ? ` · ${overduePendingCount} overdue` : ""}`}
          preview={
            pendingInvoices.length === 0 ? (
              <p className="epay-accordion-preview-row">No pending invoices.</p>
            ) : (
              <ul className="epay-accordion-preview-list">
                {pendingInvoices.slice(0, 2).map((row) => (
                  <li key={row.id} className="epay-accordion-preview-item">
                    <span className="epay-accordion-preview-label">{row.clientName}</span>
                    <span className="epay-accordion-preview-meta">{row.amount} · {row.due}</span>
                  </li>
                ))}
              </ul>
            )
          }
        >
          {pendingInvoices.length === 0 ? (
            <div className="epay-empty-state">
              <AppIcon name="folder" size={28} strokeWidth={1.5} />
              <p>No pending invoices: all caught up.</p>
            </div>
          ) : (
            <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
              <table className="commercial-hub-table epay-pending-table">
                <thead>
                  <tr><th>Client</th><th>Amount</th><th>Due</th><th>Status</th><th aria-label="Action" /></tr>
                </thead>
                <tbody>
                  {pendingInvoices.map((row) => (
                    <tr
                      key={row.id}
                      className="epay-pending-row"
                      tabIndex={0}
                      role="button"
                      onClick={() => setSelectedPending(row)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedPending(row);
                        }
                      }}
                    >
                      <td className="commercial-hub-client-cell">{row.clientName}</td>
                      <td className="commercial-hub-premium">{row.amount}</td>
                      <td>{row.due}</td>
                      <td><span className={cn("badge", pendingStatusClass[row.status])}>{row.status}</span></td>
                      <td>
                        <button type="button" className="va-ops-action-btn" onClick={(e) => e.stopPropagation()}>{row.cta}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </EPayAccordion>
      </div>

      <div className="epay-invoice-sticky-actions">
        <div className="epay-invoice-sticky-inner">
          {invoiceBuilderHeader.quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className={cn("va-ops-role-action-btn", action.id === "mark-ready" && "intake-form-continue-btn")}
              disabled={action.id === "send-link" && sendingLink}
              onClick={() => {
                if (action.id === "save") handleSaveInvoice();
                if (action.id === "send-link") setSendConfirmOpen(true);
                if (action.id === "download") handleDownloadPdf();
                if (action.id === "mark-ready") handleMarkReady();
              }}
            >
              <AppIcon name={action.icon} size={15} strokeWidth={2} />
              {action.id === "send-link" && sendingLink ? "Sending…" : action.label}
            </button>
          ))}
        </div>
      </div>

      <EPayConfirmModal
        open={sendConfirmOpen}
        title="Send Payment Link"
        message={`Send payment link to ${client.paymentRequest.sentTo} for ${formatMoney(totalDue)}?`}
        confirmLabel="Send Link"
        onClose={() => setSendConfirmOpen(false)}
        onConfirm={handleSendLink}
      />
      <EPayConfirmModal
        open={sendInvoiceConfirmOpen}
        title="Send Invoice"
        message={`Send invoice ${form.invoiceNumber} to ${client.clientName}? Compliance checks passed.`}
        confirmLabel="Send Invoice"
        onClose={() => setSendInvoiceConfirmOpen(false)}
        onConfirm={handleSendInvoice}
      />

      <InvoiceDrawer invoice={selectedPending} onClose={() => setSelectedPending(null)} />
    </div>
    </DataStateView>
  );
}
