export const epayPolicyTabs = [
  { id: "builder", label: "Invoice Builder" },
  { id: "tracker", label: "Payment Tracker" },
  { id: "trust", label: "Trust Account" },
] as const;

export type EPayPolicyTabId = (typeof epayPolicyTabs)[number]["id"];

export const epayPolicyHeader = {
  title: "ePayPolicy",
  subtitle: "Invoice tracking · Broker fees · Payment confirmation",
  quickActions: [
    { id: "send-payment-link", label: "Send Payment Link", icon: "send" as const, variant: "secondary" as const },
    { id: "new-invoice", label: "New Invoice", icon: "plus" as const, variant: "primary" as const },
  ],
};

export const invoiceBuilderHeader = {
  title: "Invoice Builder",
  subtitle: "Generate invoices and prepare payment requests.",
  quickActions: [
    { id: "save", label: "Save Invoice", icon: "folder" as const },
    { id: "send-link", label: "Send Payment Link", icon: "send" as const },
    { id: "download", label: "Download PDF", icon: "download" as const },
    { id: "mark-ready", label: "Mark Ready", icon: "check" as const },
  ],
};

export type PaymentMethod = "Card" | "ACH" | "Check" | "Wire";
export type InstallmentOption = "Full Pay" | "Monthly" | "Quarterly";
export type PaymentLinkStatus = "Sent" | "Pending" | "Opened" | "Not Sent";

export type PaymentLifecycleStage = "Generated" | "Sent" | "Viewed" | "Paid";

export type PaymentLifecycle = Record<Lowercase<PaymentLifecycleStage>, boolean>;
export type PendingPaymentStatus = "Pending" | "Overdue";
export type InvoicePaymentStatus = "Pending Payment" | "Paid" | "Overdue" | "Draft";

export type ComplianceItem = {
  id: string;
  label: string;
  complete: boolean;
};

export type BillingType = "Agency Bill" | "Direct Bill";

export type BrokerFeeTriggerStepStatus = "pending" | "success" | "failed";

export type BrokerFeeTriggerStepId = "make-webhook" | "epay-invoice" | "az-esign";

export type BrokerFeeTriggerStep = {
  id: BrokerFeeTriggerStepId;
  label: string;
  status: BrokerFeeTriggerStepStatus;
  updatedAt?: string;
  detail?: string;
};

export const brokerFeeTriggerStepOrder: BrokerFeeTriggerStepId[] = [
  "make-webhook",
  "epay-invoice",
  "az-esign",
];

export const brokerFeeTriggerStepLabels: Record<BrokerFeeTriggerStepId, string> = {
  "make-webhook": "Make.com webhook fired",
  "epay-invoice": "ePayPolicy invoice created",
  "az-esign": "AZ E-sign disclosure sent",
};

export function isAgencyBillRecord(billingType: BillingType): boolean {
  return billingType === "Agency Bill";
}

export function getBrokerFeeTriggerSummary(steps: BrokerFeeTriggerStep[]): BrokerFeeTriggerStepStatus {
  if (steps.some((s) => s.status === "failed")) return "failed";
  if (steps.every((s) => s.status === "success")) return "success";
  return "pending";
}

export type PaymentActivity = {
  id: string;
  message: string;
  timeAgo: string;
};

export type InvoiceFormData = {
  invoiceNumber: string;
  policyPremium: number;
  brokerFee: number;
  taxesFees: number;
  paymentDueDate: string;
  paymentMethod: PaymentMethod;
  installmentOption: InstallmentOption;
  notes: string;
};

export type InvoiceClient = {
  id: string;
  clientName: string;
  policyType: string;
  carrier: string;
  producer: string;
  assignedVa: string;
  effectiveDate: string;
  renewalDate: string;
  status: string;
  billingType: BillingType;
  brokerFeeTrigger: BrokerFeeTriggerStep[];
  invoice: InvoiceFormData;
  paymentRequest: {
    linkGenerated: boolean;
    linkStatus: PaymentLinkStatus;
    sentTo: string;
    sentAt: string;
    paymentLink: string;
    lifecycle: PaymentLifecycle;
  };
  trustAccount: {
    accountName: string;
    depositMethod: string;
    referenceNumber: string;
    expectedDepositDate: string;
  };
  activity: PaymentActivity[];
  compliance: ComplianceItem[];
};

export type PendingInvoice = {
  id: string;
  clientName: string;
  amount: string;
  amountValue: number;
  due: string;
  status: PendingPaymentStatus;
  cta: string;
  drawer: {
    invoiceNumber: string;
    policyPremium: string;
    brokerFee: string;
    taxesFees: string;
    totalDue: string;
    paymentHistory: { id: string; action: string; date: string }[];
    brokerFeeNote: string;
    trustAccountLogs: { id: string; entry: string; date: string }[];
    clientNotes: string[];
  };
};

export const paymentMethodOptions: PaymentMethod[] = ["Card", "ACH", "Check", "Wire"];
export const installmentOptions: InstallmentOption[] = ["Full Pay", "Monthly", "Quarterly"];

export const DEFAULT_INVOICE_CLIENT_ID = "inv-martinez";

const martinezClient: InvoiceClient = {
  id: "inv-martinez",
  clientName: "Martinez Landscaping",
  policyType: "BOP + Workers Comp",
  carrier: "Markel",
  producer: "Eva",
  assignedVa: "JoJo",
  effectiveDate: "July 12, 2026",
  renewalDate: "July 12, 2027",
  status: "Ready to Invoice",
  billingType: "Agency Bill",
  brokerFeeTrigger: [
    { id: "make-webhook", label: "Make.com webhook fired", status: "success", updatedAt: "Today, 11:18 AM", detail: "Scenario #482 — broker_fee_trigger" },
    { id: "epay-invoice", label: "ePayPolicy invoice created", status: "success", updatedAt: "Today, 11:20 AM", detail: "INV-2048 synced to ePayPolicy" },
    { id: "az-esign", label: "AZ E-sign disclosure sent", status: "pending", updatedAt: "Awaiting", detail: "DocuSign envelope queued" },
  ],
  invoice: {
    invoiceNumber: "INV-2048",
    policyPremium: 4200,
    brokerFee: 500,
    taxesFees: 120,
    paymentDueDate: "June 28, 2026",
    paymentMethod: "ACH",
    installmentOption: "Full Pay",
    notes: "Broker fee due upfront.",
  },
  paymentRequest: {
    linkGenerated: true,
    linkStatus: "Sent",
    sentTo: "martinez@landscape.com",
    sentAt: "Today, 11:22 AM",
    paymentLink: "https://pay.epaypolicy.com/inv-2048-martinez",
    lifecycle: {
      generated: true,
      sent: true,
      viewed: true,
      paid: false,
    },
  },
  trustAccount: {
    accountName: "Insurance Town Trust",
    depositMethod: "ACH Deposit",
    referenceNumber: "TR-88341",
    expectedDepositDate: "June 29, 2026",
  },
  activity: [
    { id: "pa-1", message: "Invoice created", timeAgo: "Today" },
    { id: "pa-2", message: "Payment link sent", timeAgo: "Today" },
    { id: "pa-3", message: "Client opened payment link", timeAgo: "2 hours later" },
    { id: "pa-4", message: "Payment pending", timeAgo: "Current" },
  ],
  compliance: [
    { id: "c-broker", label: "Broker fee separated", complete: true },
    { id: "c-premium", label: "Premium verified", complete: true },
    { id: "c-carrier", label: "Carrier confirmed", complete: true },
    { id: "c-method", label: "Payment method selected", complete: true },
    { id: "c-producer", label: "Producer approved", complete: true },
    { id: "c-client", label: "Client notified", complete: false },
  ],
};

const kimClient: InvoiceClient = {
  id: "inv-kim",
  clientName: "Kim Auto Shop",
  policyType: "Commercial Auto",
  carrier: "Travelers",
  producer: "Pedro",
  assignedVa: "Tracie",
  effectiveDate: "August 1, 2026",
  renewalDate: "August 1, 2027",
  status: "Pending Payment",
  billingType: "Agency Bill",
  brokerFeeTrigger: [
    { id: "make-webhook", label: "Make.com webhook fired", status: "success", updatedAt: "June 18, 9:12 AM" },
    { id: "epay-invoice", label: "ePayPolicy invoice created", status: "success", updatedAt: "June 18, 9:14 AM" },
    { id: "az-esign", label: "AZ E-sign disclosure sent", status: "success", updatedAt: "June 18, 9:16 AM" },
  ],
  invoice: {
    invoiceNumber: "INV-2045",
    policyPremium: 5200,
    brokerFee: 450,
    taxesFees: 150,
    paymentDueDate: "June 22, 2026",
    paymentMethod: "ACH",
    installmentOption: "Full Pay",
    notes: "Awaiting signed app before bind.",
  },
  paymentRequest: {
    linkGenerated: true,
    linkStatus: "Opened",
    sentTo: "david@kimautoshop.com",
    sentAt: "June 18, 2026",
    paymentLink: "https://pay.epaypolicy.com/inv-2045-kim",
    lifecycle: { generated: true, sent: true, viewed: true, paid: false },
  },
  trustAccount: {
    accountName: "Insurance Town Trust",
    depositMethod: "ACH Deposit",
    referenceNumber: "TR-88338",
    expectedDepositDate: "June 23, 2026",
  },
  activity: [
    { id: "pa-k1", message: "Invoice sent", timeAgo: "3 days ago" },
    { id: "pa-k2", message: "Payment link opened", timeAgo: "Today" },
  ],
  compliance: [
    { id: "c-broker", label: "Broker fee separated", complete: true },
    { id: "c-premium", label: "Premium verified", complete: true },
    { id: "c-carrier", label: "Carrier confirmed", complete: true },
    { id: "c-method", label: "Payment method selected", complete: true },
    { id: "c-producer", label: "Producer approved", complete: true },
    { id: "c-client", label: "Client notified", complete: true },
  ],
};

const riveraClient: InvoiceClient = {
  id: "inv-rivera",
  clientName: "Rivera Construction",
  policyType: "Workers Comp",
  carrier: "ICW",
  producer: "Sarah",
  assignedVa: "Valerie",
  effectiveDate: "June 15, 2026",
  renewalDate: "June 15, 2027",
  status: "Partial Payment",
  billingType: "Direct Bill",
  brokerFeeTrigger: [],
  invoice: {
    invoiceNumber: "INV-2046",
    policyPremium: 3600,
    brokerFee: 400,
    taxesFees: 100,
    paymentDueDate: "June 25, 2026",
    paymentMethod: "Wire",
    installmentOption: "Full Pay",
    notes: "Balance due after partial wire received.",
  },
  paymentRequest: {
    linkGenerated: true,
    linkStatus: "Sent",
    sentTo: "j.rivera@riveraconstruction.com",
    sentAt: "June 19, 2026",
    paymentLink: "https://pay.epaypolicy.com/inv-2046-rivera",
    lifecycle: { generated: true, sent: true, viewed: false, paid: false },
  },
  trustAccount: {
    accountName: "Insurance Town Trust",
    depositMethod: "Wire Transfer",
    referenceNumber: "TR-88342",
    expectedDepositDate: "June 26, 2026",
  },
  activity: [
    { id: "pa-r1", message: "Partial payment received", timeAgo: "3 hours ago" },
    { id: "pa-r2", message: "Invoice sent", timeAgo: "2 days ago" },
  ],
  compliance: [
    { id: "c-broker", label: "Broker fee separated", complete: true },
    { id: "c-premium", label: "Premium verified", complete: true },
    { id: "c-carrier", label: "Carrier confirmed", complete: true },
    { id: "c-method", label: "Payment method selected", complete: true },
    { id: "c-producer", label: "Producer approved", complete: true },
    { id: "c-client", label: "Client notified", complete: true },
  ],
};

const greenlineClient: InvoiceClient = {
  id: "inv-greenline",
  clientName: "Greenline Logistics",
  policyType: "BOP",
  carrier: "CNA",
  producer: "Eva",
  assignedVa: "JoJo",
  effectiveDate: "September 1, 2026",
  renewalDate: "September 1, 2027",
  status: "Overdue",
  billingType: "Agency Bill",
  brokerFeeTrigger: [
    { id: "make-webhook", label: "Make.com webhook fired", status: "success", updatedAt: "June 15, 8:40 AM" },
    { id: "epay-invoice", label: "ePayPolicy invoice created", status: "success", updatedAt: "June 15, 8:42 AM" },
    { id: "az-esign", label: "AZ E-sign disclosure sent", status: "failed", updatedAt: "June 15, 8:45 AM", detail: "DocuSign API timeout — retry required" },
  ],
  invoice: {
    invoiceNumber: "INV-2042",
    policyPremium: 5500,
    brokerFee: 550,
    taxesFees: 150,
    paymentDueDate: "June 18, 2026",
    paymentMethod: "Card",
    installmentOption: "Full Pay",
    notes: "Renewal BOP — payment overdue.",
  },
  paymentRequest: {
    linkGenerated: true,
    linkStatus: "Opened",
    sentTo: "min@greenlinelogistics.com",
    sentAt: "June 15, 2026",
    paymentLink: "https://pay.epaypolicy.com/inv-2042-greenline",
    lifecycle: { generated: true, sent: true, viewed: true, paid: false },
  },
  trustAccount: {
    accountName: "Insurance Town Trust",
    depositMethod: "Card Deposit",
    referenceNumber: "TR-88335",
    expectedDepositDate: "Overdue",
  },
  activity: [
    { id: "pa-g1", message: "Payment overdue", timeAgo: "1 day ago" },
    { id: "pa-g2", message: "Reminder sent", timeAgo: "1 day ago" },
  ],
  compliance: [
    { id: "c-broker", label: "Broker fee separated", complete: true },
    { id: "c-premium", label: "Premium verified", complete: true },
    { id: "c-carrier", label: "Carrier confirmed", complete: true },
    { id: "c-method", label: "Payment method selected", complete: true },
    { id: "c-producer", label: "Producer approved", complete: true },
    { id: "c-client", label: "Client notified", complete: false },
  ],
};

const atlasClient: InvoiceClient = {
  id: "inv-atlas",
  clientName: "Atlas Roofing",
  policyType: "General Liability",
  carrier: "Kingsway",
  producer: "Pedro",
  assignedVa: "Tracie",
  effectiveDate: "July 15, 2026",
  renewalDate: "July 15, 2027",
  status: "Paid",
  billingType: "Direct Bill",
  brokerFeeTrigger: [],
  invoice: {
    invoiceNumber: "INV-2041",
    policyPremium: 4900,
    brokerFee: 560,
    taxesFees: 140,
    paymentDueDate: "June 15, 2026",
    paymentMethod: "ACH",
    installmentOption: "Full Pay",
    notes: "GL renewal — paid in full.",
  },
  paymentRequest: {
    linkGenerated: true,
    linkStatus: "Sent",
    sentTo: "r.chen@atlasroofing.com",
    sentAt: "June 14, 2026",
    paymentLink: "https://pay.epaypolicy.com/inv-2041-atlas",
    lifecycle: { generated: true, sent: true, viewed: true, paid: true },
  },
  trustAccount: {
    accountName: "Insurance Town Trust",
    depositMethod: "ACH Deposit",
    referenceNumber: "TR-88333",
    expectedDepositDate: "June 16, 2026",
  },
  activity: [
    { id: "pa-a1", message: "Payment received", timeAgo: "2 days ago" },
    { id: "pa-a2", message: "Invoice sent", timeAgo: "1 week ago" },
  ],
  compliance: [
    { id: "c-broker", label: "Broker fee separated", complete: true },
    { id: "c-premium", label: "Premium verified", complete: true },
    { id: "c-carrier", label: "Carrier confirmed", complete: true },
    { id: "c-method", label: "Payment method selected", complete: true },
    { id: "c-producer", label: "Producer approved", complete: true },
    { id: "c-client", label: "Client notified", complete: true },
  ],
};

export const invoiceClients: InvoiceClient[] = [
  martinezClient,
  kimClient,
  riveraClient,
  greenlineClient,
  atlasClient,
];

export const pendingInvoices: PendingInvoice[] = [
  {
    id: "pend-kim-auto",
    clientName: "Kim Auto Shop",
    amount: "$5,800",
    amountValue: 5800,
    due: "Tomorrow",
    status: "Pending",
    cta: "Send Reminder",
    drawer: {
      invoiceNumber: "INV-2045",
      policyPremium: "$5,200",
      brokerFee: "$450",
      taxesFees: "$150",
      totalDue: "$5,800",
      paymentHistory: [
        { id: "ph-1", action: "Invoice sent", date: "June 18, 2026" },
        { id: "ph-2", action: "Reminder sent", date: "June 20, 2026" },
      ],
      brokerFeeNote: "Broker fee listed separately per compliance — $450 agency fee.",
      trustAccountLogs: [
        { id: "tl-1", entry: "Pending deposit — TR-88338", date: "June 18, 2026" },
      ],
      clientNotes: ["Follow up on auto dec page before bind."],
    },
  },
  {
    id: "pend-greenline",
    clientName: "Greenline Logistics",
    amount: "$6,200",
    amountValue: 6200,
    due: "Today",
    status: "Overdue",
    cta: "Follow Up",
    drawer: {
      invoiceNumber: "INV-2042",
      policyPremium: "$5,500",
      brokerFee: "$550",
      taxesFees: "$150",
      totalDue: "$6,200",
      paymentHistory: [
        { id: "ph-3", action: "Invoice sent", date: "June 15, 2026" },
        { id: "ph-4", action: "Payment link opened", date: "June 17, 2026" },
        { id: "ph-5", action: "Reminder sent", date: "June 19, 2026" },
      ],
      brokerFeeNote: "Broker fee separated — logistics BOP package.",
      trustAccountLogs: [
        { id: "tl-2", entry: "Overdue — no deposit received", date: "June 20, 2026" },
      ],
      clientNotes: ["Owner requested payment plan — follow up with producer."],
    },
  },
  {
    id: "pend-rivera",
    clientName: "Rivera Construction",
    amount: "$4,100",
    amountValue: 4100,
    due: "June 25, 2026",
    status: "Pending",
    cta: "Send Reminder",
    drawer: {
      invoiceNumber: "INV-2046",
      policyPremium: "$3,600",
      brokerFee: "$400",
      taxesFees: "$100",
      totalDue: "$4,100",
      paymentHistory: [{ id: "ph-6", action: "Invoice created", date: "June 19, 2026" }],
      brokerFeeNote: "Standard broker fee separation applied.",
      trustAccountLogs: [],
      clientNotes: [],
    },
  },
];

export function getInvoiceClient(clientId: string): InvoiceClient | undefined {
  return invoiceClients.find((c) => c.id === clientId);
}

export function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function calculateTotalDue(invoice: Pick<InvoiceFormData, "policyPremium" | "brokerFee" | "taxesFees">): number {
  return invoice.policyPremium + invoice.brokerFee + invoice.taxesFees;
}

export function getComplianceStatus(compliance: ComplianceItem[]): "Ready" | "Blocked" {
  return compliance.every((item) => item.complete) ? "Ready" : "Blocked";
}

export type InvoiceReadinessItem = {
  id: string;
  label: string;
  complete: boolean;
};

export function getInvoiceReadinessItems(
  client: InvoiceClient,
  form: Pick<InvoiceFormData, "policyPremium" | "brokerFee" | "paymentMethod">,
): InvoiceReadinessItem[] {
  const complianceMap = Object.fromEntries(client.compliance.map((c) => [c.id, c.complete]));
  const disclosuresStep = client.brokerFeeTrigger.find((s) => s.id === "az-esign");
  const disclosuresComplete =
    client.billingType === "Direct Bill" ||
    client.brokerFeeTrigger.length === 0 ||
    disclosuresStep?.status === "success";

  return [
    { id: "premium", label: "Premium verified", complete: Boolean(complianceMap["c-premium"]) && form.policyPremium > 0 },
    { id: "broker", label: "Broker fee separated", complete: Boolean(complianceMap["c-broker"]) && form.brokerFee > 0 },
    { id: "carrier", label: "Carrier confirmed", complete: Boolean(complianceMap["c-carrier"]) },
    { id: "method", label: "Payment method selected", complete: Boolean(complianceMap["c-method"]) && Boolean(form.paymentMethod) },
    { id: "disclosures", label: "Compliance disclosures sent", complete: disclosuresComplete },
    { id: "contact", label: "Client contact verified", complete: Boolean(complianceMap["c-client"]) && Boolean(client.paymentRequest.sentTo) },
  ];
}

export function isInvoiceReadyForSend(items: readonly InvoiceReadinessItem[]): boolean {
  return items.every((item) => item.complete);
}

export type ExtendedLifecycleStage = {
  id: string;
  label: string;
  state: "completed" | "current" | "pending" | "failed";
  timestamp?: string;
};

export function getExtendedPaymentLifecycle(client: InvoiceClient): ExtendedLifecycleStage[] {
  const lc = client.paymentRequest.lifecycle;
  const isPartial = client.status === "Partial Payment";
  const isFailed = client.brokerFeeTrigger.some((s) => s.status === "failed") || client.status === "Overdue";
  const opened = lc.viewed || client.paymentRequest.linkStatus === "Opened";
  const paid = lc.paid || client.status === "Paid";

  const stages: Omit<ExtendedLifecycleStage, "state">[] = [
    { id: "generated", label: "Generated", timestamp: client.activity.find((a) => a.message.toLowerCase().includes("created"))?.timeAgo },
    { id: "sent", label: "Sent", timestamp: client.paymentRequest.sentAt },
    { id: "delivered", label: "Delivered", timestamp: client.paymentRequest.sentAt },
    { id: "opened", label: "Opened", timestamp: opened ? client.activity.find((a) => a.message.toLowerCase().includes("opened"))?.timeAgo : undefined },
    { id: "partial", label: "Partial", timestamp: isPartial ? client.activity[0]?.timeAgo : undefined },
    { id: "terminal", label: paid ? "Paid" : isFailed ? "Failed" : "Paid / Failed", timestamp: paid ? client.activity.find((a) => a.message.toLowerCase().includes("received"))?.timeAgo : undefined },
  ];

  const flags = [lc.generated, lc.sent, lc.sent, opened, isPartial, paid || isFailed];
  const result: ExtendedLifecycleStage[] = [];

  for (let i = 0; i < stages.length; i++) {
    const prevAllDone = flags.slice(0, i).every(Boolean);
    let state: ExtendedLifecycleStage["state"] = "pending";
    if (i === stages.length - 1 && isFailed && !paid) state = "failed";
    else if (flags[i]) state = "completed";
    else if (prevAllDone) state = "current";
    result.push({ ...stages[i], state });
  }

  if (paid) {
    const terminal = result[result.length - 1];
    terminal.label = "Paid";
    terminal.state = "completed";
  } else if (isFailed && !paid) {
    const terminal = result[result.length - 1];
    terminal.label = "Failed";
    terminal.state = "failed";
  } else if (!isPartial) {
    result[4].state = "pending";
    result[4].timestamp = undefined;
  }

  return result;
}

import { epayStatusClass } from "./epayStatus";

export const pendingStatusClass: Record<PendingPaymentStatus, string> = {
  Pending: epayStatusClass.Pending,
  Overdue: epayStatusClass.Overdue,
};
