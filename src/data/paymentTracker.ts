import type { PaymentMethod } from "./epayPolicy";
import { formatMoney } from "./epayPolicy";

export const paymentTrackerHeader = {
  title: "Payment Tracker",
  subtitle: "Monitor all invoice payments and collection status.",
  quickActions: [
    { id: "export", label: "Export Payments", icon: "download" as const },
    { id: "reminder", label: "Send Reminder", icon: "send" as const },
    { id: "manual", label: "Record Manual Payment", icon: "plus" as const },
    { id: "overdue", label: "View Overdue", icon: "triangle-alert" as const },
  ],
};

export type TrackerPaymentStatus =
  | "Paid"
  | "Pending"
  | "Overdue"
  | "Partial"
  | "Failed"
  | "Refunded";

export type PaymentRecord = {
  id: string;
  clientName: string;
  invoiceNumber: string;
  policyType: string;
  carrier: string;
  producer: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  paymentMethod: PaymentMethod;
  status: TrackerPaymentStatus;
  lastActivity: string;
  nextAction: string;
  drawer: {
    policyPremium: string;
    brokerFee: string;
    taxesFees: string;
    totalDue: string;
    paymentHistory: { id: string; action: string; amount?: string; date: string }[];
    paymentAttempts: { id: string; method: string; result: string; date: string }[];
    clientNotes: string[];
    trustAccount: {
      accountName: string;
      referenceNumber: string;
      depositStatus: string;
    };
    brokerFeeNote: string;
  };
};

export type OverdueInvoice = {
  id: string;
  clientName: string;
  amount: string;
  due: string;
  assigned: string;
  status: "Overdue" | "Pending";
  queueType: "Overdue" | "Needs follow-up" | "High priority";
  cta: string;
  paymentId: string;
};

export type FailedTransaction = {
  id: string;
  clientName: string;
  reason: string;
  amount: string;
  time: string;
  cta: string;
  paymentId: string;
};

export type TrackerFilterState = {
  status: string;
  dueDate: string;
  producer: string;
  carrier: string;
  paymentMethod: string;
};

export const paymentTrackerKpis = [
  {
    label: "Pending Payments",
    value: "14",
    sub: "Awaiting payment",
    helper: "Outstanding invoices",
    color: "primary" as const,
  },
  {
    label: "Paid This Week",
    value: "9",
    sub: "Successfully collected",
    helper: "Recent payments",
    color: "green" as const,
  },
  {
    label: "Overdue",
    value: "4",
    sub: "Past due date",
    helper: "Needs follow-up",
    color: "yellow" as const,
  },
  {
    label: "Failed Payments",
    value: "2",
    sub: "Requires retry",
    helper: "Payment issues",
    color: "yellow" as const,
  },
];

export const paymentTrackerPlaceholder = "Search by client, invoice number, or status";

export const paymentTrackerFilterOptions = {
  status: ["All Statuses", "Paid", "Pending", "Overdue", "Partial", "Failed", "Refunded"],
  dueDate: ["All Dates", "Today", "This Week", "Overdue", "Next 7 Days"],
  producer: ["All Producers", "Eva", "Pedro", "Sarah"],
  carrier: ["All Carriers", "Markel", "Travelers", "CNA", "ICW", "Kingsway"],
  paymentMethod: ["All Methods", "ACH", "Card", "Wire", "Check"],
};

export const defaultPaymentTrackerFilters: TrackerFilterState = {
  status: paymentTrackerFilterOptions.status[0],
  dueDate: paymentTrackerFilterOptions.dueDate[0],
  producer: paymentTrackerFilterOptions.producer[0],
  carrier: paymentTrackerFilterOptions.carrier[0],
  paymentMethod: paymentTrackerFilterOptions.paymentMethod[0],
};

export const paymentRecords: PaymentRecord[] = [
  {
    id: "pay-martinez",
    clientName: "Martinez Landscaping",
    invoiceNumber: "INV-2048",
    policyType: "BOP + Workers Comp",
    carrier: "Markel",
    producer: "Eva",
    totalAmount: 4820,
    paidAmount: 4820,
    dueDate: "June 28, 2026",
    paymentMethod: "ACH",
    status: "Paid",
    lastActivity: "18 min ago",
    nextAction: "View Invoice",
    drawer: {
      policyPremium: "$4,200",
      brokerFee: "$500",
      taxesFees: "$120",
      totalDue: "$4,820",
      paymentHistory: [
        { id: "ph-m1", action: "Payment received", amount: "$4,820", date: "June 21, 2026" },
        { id: "ph-m2", action: "Payment link sent", date: "June 20, 2026" },
        { id: "ph-m3", action: "Invoice created", date: "June 20, 2026" },
      ],
      paymentAttempts: [
        { id: "pa-m1", method: "ACH", result: "Success", date: "June 21, 2026" },
      ],
      clientNotes: ["Client paid in full via ACH."],
      trustAccount: {
        accountName: "Insurance Town Trust",
        referenceNumber: "TR-88341",
        depositStatus: "Deposited",
      },
      brokerFeeNote: "Broker fee $500 separated from premium per compliance.",
    },
  },
  {
    id: "pay-greenline",
    clientName: "Greenline Logistics",
    invoiceNumber: "INV-2042",
    policyType: "BOP",
    carrier: "CNA",
    producer: "Eva",
    totalAmount: 6200,
    paidAmount: 0,
    dueDate: "June 18, 2026",
    paymentMethod: "Card",
    status: "Overdue",
    lastActivity: "1 day ago",
    nextAction: "Send Reminder",
    drawer: {
      policyPremium: "$5,500",
      brokerFee: "$550",
      taxesFees: "$150",
      totalDue: "$6,200",
      paymentHistory: [
        { id: "ph-s1", action: "Reminder sent", date: "June 20, 2026" },
        { id: "ph-s2", action: "Payment link opened", date: "June 17, 2026" },
        { id: "ph-s3", action: "Invoice sent", date: "June 15, 2026" },
      ],
      paymentAttempts: [
        { id: "pa-s1", method: "Card", result: "Link opened — no payment", date: "June 17, 2026" },
      ],
      clientNotes: ["Owner requested payment plan — follow up with producer."],
      trustAccount: {
        accountName: "Insurance Town Trust",
        referenceNumber: "TR-88335",
        depositStatus: "Pending — overdue",
      },
      brokerFeeNote: "Broker fee separated — logistics BOP package.",
    },
  },
  {
    id: "pay-kim",
    clientName: "Kim Auto Shop",
    invoiceNumber: "INV-2045",
    policyType: "Commercial Auto",
    carrier: "Travelers",
    producer: "Pedro",
    totalAmount: 5800,
    paidAmount: 0,
    dueDate: "June 22, 2026",
    paymentMethod: "ACH",
    status: "Pending",
    lastActivity: "42 min ago",
    nextAction: "Contact Client",
    drawer: {
      policyPremium: "$5,200",
      brokerFee: "$450",
      taxesFees: "$150",
      totalDue: "$5,800",
      paymentHistory: [
        { id: "ph-k1", action: "Payment link opened", date: "June 21, 2026" },
        { id: "ph-k2", action: "Reminder sent", date: "June 20, 2026" },
        { id: "ph-k3", action: "Invoice sent", date: "June 18, 2026" },
      ],
      paymentAttempts: [],
      clientNotes: ["Follow up on auto dec page before bind."],
      trustAccount: {
        accountName: "Insurance Town Trust",
        referenceNumber: "TR-88338",
        depositStatus: "Pending",
      },
      brokerFeeNote: "Broker fee listed separately — $450 agency fee.",
    },
  },
  {
    id: "pay-rivera",
    clientName: "Rivera Construction",
    invoiceNumber: "INV-2046",
    policyType: "Workers Comp",
    carrier: "ICW",
    producer: "Sarah",
    totalAmount: 4100,
    paidAmount: 2050,
    dueDate: "June 25, 2026",
    paymentMethod: "Wire",
    status: "Partial",
    lastActivity: "3 hours ago",
    nextAction: "Send Reminder",
    drawer: {
      policyPremium: "$3,600",
      brokerFee: "$400",
      taxesFees: "$100",
      totalDue: "$4,100",
      paymentHistory: [
        { id: "ph-w1", action: "Partial payment received", amount: "$2,050", date: "June 21, 2026" },
        { id: "ph-w2", action: "Invoice sent", date: "June 19, 2026" },
      ],
      paymentAttempts: [
        { id: "pa-w1", method: "Wire", result: "Partial — $2,050 received", date: "June 21, 2026" },
      ],
      clientNotes: ["Client paying in two installments — balance due June 25."],
      trustAccount: {
        accountName: "Insurance Town Trust",
        referenceNumber: "TR-88342",
        depositStatus: "Partial deposit",
      },
      brokerFeeNote: "Broker fee included in first installment.",
    },
  },
  {
    id: "pay-atlas",
    clientName: "Atlas Roofing",
    invoiceNumber: "INV-2041",
    policyType: "General Liability",
    carrier: "Kingsway",
    producer: "Pedro",
    totalAmount: 5600,
    paidAmount: 5600,
    dueDate: "June 15, 2026",
    paymentMethod: "ACH",
    status: "Paid",
    lastActivity: "2 days ago",
    nextAction: "View Invoice",
    drawer: {
      policyPremium: "$4,900",
      brokerFee: "$560",
      taxesFees: "$140",
      totalDue: "$5,600",
      paymentHistory: [
        { id: "ph-a1", action: "Payment received", amount: "$5,600", date: "June 19, 2026" },
        { id: "ph-a2", action: "Invoice sent", date: "June 14, 2026" },
      ],
      paymentAttempts: [
        { id: "pa-a1", method: "ACH", result: "Success", date: "June 19, 2026" },
      ],
      clientNotes: [],
      trustAccount: {
        accountName: "Insurance Town Trust",
        referenceNumber: "TR-88333",
        depositStatus: "Deposited",
      },
      brokerFeeNote: "Broker fee separated per compliance.",
    },
  },
];

export const overdueInvoices: OverdueInvoice[] = [
  {
    id: "od-seoul",
    clientName: "Greenline Logistics",
    amount: "$6,200",
    due: "3 days ago",
    assigned: "JoJo",
    status: "Overdue",
    queueType: "Overdue",
    cta: "Send Reminder",
    paymentId: "pay-greenline",
  },
  {
    id: "od-kim",
    clientName: "Kim Auto Shop",
    amount: "$5,800",
    due: "Yesterday",
    assigned: "Pedro",
    status: "Pending",
    queueType: "Needs follow-up",
    cta: "Contact Client",
    paymentId: "pay-kim",
  },
  {
    id: "od-westside",
    clientName: "Rivera Construction",
    amount: "$2,050",
    due: "June 25, 2026",
    assigned: "JoJo",
    status: "Pending",
    queueType: "High priority",
    cta: "Send Reminder",
    paymentId: "pay-rivera",
  },
];

export const failedTransactions: FailedTransaction[] = [
  {
    id: "fail-kim",
    clientName: "Kim Auto Shop",
    reason: "Payment link opened — no payment",
    amount: "$5,800",
    time: "Today",
    cta: "Contact Client",
    paymentId: "pay-kim",
  },
];

export const collectionActivity = [
  { id: "ca-1", message: "Martinez Landscaping paid invoice", timeAgo: "18 min ago" },
  { id: "ca-2", message: "Kim Auto Shop opened payment link", timeAgo: "42 min ago" },
  { id: "ca-3", message: "Greenline Logistics payment overdue", timeAgo: "1 day ago" },
  { id: "ca-4", message: "Atlas Roofing payment received", timeAgo: "2 days ago" },
  { id: "ca-5", message: "Rivera Construction partial payment received", timeAgo: "3 hours ago" },
];

export const collectionSummary = {
  collectedToday: "$8,400",
  collectedThisWeek: "$34,200",
  pendingCollection: "$18,900",
  overdueAmount: "$12,000",
  failedAmount: "$7,100",
};

import { epayStatusClass } from "./epayStatus";

export const trackerStatusClass: Record<TrackerPaymentStatus, string> = {
  Paid: epayStatusClass.Paid,
  Pending: epayStatusClass.Pending,
  Overdue: epayStatusClass.Overdue,
  Partial: epayStatusClass.Partial,
  Failed: epayStatusClass.Failed,
  Refunded: epayStatusClass.Refunded,
};

export function getRemainingBalance(record: PaymentRecord): number {
  return Math.max(0, record.totalAmount - record.paidAmount);
}

export function findPaymentById(id: string): PaymentRecord | undefined {
  return paymentRecords.find((p) => p.id === id);
}

export function matchesPaymentFilters(
  record: PaymentRecord,
  search: string,
  filters: TrackerFilterState,
): boolean {
  const q = search.trim().toLowerCase();
  if (q) {
    const haystack = [
      record.clientName,
      record.invoiceNumber,
      record.policyType,
      record.status,
      record.producer,
      record.carrier,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  if (filters.status !== "All Statuses" && record.status !== filters.status) return false;
  if (filters.producer !== "All Producers" && record.producer !== filters.producer) return false;
  if (filters.carrier !== "All Carriers" && record.carrier !== filters.carrier) return false;
  if (filters.paymentMethod !== "All Methods" && record.paymentMethod !== filters.paymentMethod) {
    return false;
  }

  if (filters.dueDate === "Overdue" && record.status !== "Overdue") return false;
  if (filters.dueDate === "Today" && !record.dueDate.includes("21")) return false;

  return true;
}

export function formatRemaining(record: PaymentRecord): string {
  return formatMoney(getRemainingBalance(record));
}

export function formatPaid(record: PaymentRecord): string {
  return formatMoney(record.paidAmount);
}

export function formatTotal(record: PaymentRecord): string {
  return formatMoney(record.totalAmount);
}
