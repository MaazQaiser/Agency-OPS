import type { PaymentMethod } from "./epayPolicy";

export const trustReferenceHeader = {
  title: "Trust Account",
  subtitle: "Monitor trust account activity and payment allocations.",
  quickActions: [
    { id: "add-deposit", label: "Add Deposit", icon: "plus" as const },
    { id: "record-release", label: "Record Release", icon: "send" as const },
    { id: "export", label: "Export Ledger", icon: "download" as const },
    { id: "reconcile", label: "Reconcile Account", icon: "check" as const },
  ],
};

export type LedgerEntryType = "Deposit" | "Carrier Release" | "Broker Fee Hold" | "Adjustment" | "Refund";
export type LedgerEntryStatus = "Pending" | "Processing" | "Completed" | "Failed";

export type TrustLedgerEntry = {
  id: string;
  date: string;
  referenceNumber: string;
  client: string;
  type: LedgerEntryType;
  amount: string;
  amountValue: number;
  status: LedgerEntryStatus;
  balanceAfter: string;
  drawer: {
    invoiceReference: string;
    clientInfo: string;
    policyType: string;
    carrier: string;
    brokerFee: string;
    premiumPortion: string;
    paymentMethod: PaymentMethod;
    carrierPaymentHistory: { id: string; action: string; date: string }[];
    trustAccountLogs: { id: string; entry: string; date: string }[];
    reconciliationNotes: string[];
  };
};

export type PendingDeposit = {
  id: string;
  client: string;
  amount: string;
  paymentMethod: PaymentMethod;
  expected: string;
  eta: string;
  status: "Processing" | "Pending" | "Failed";
  cta: string;
  ledgerId: string;
};

export type CarrierRelease = {
  id: string;
  client: string;
  carrier: string;
  amount: string;
  due: string;
  status: "Ready" | "Scheduled" | "Released";
  cta: string;
  ledgerId?: string;
};

export type BrokerFeeEntry = {
  id: string;
  client: string;
  brokerFee: string;
  status: "Held" | "Released";
  collected: "Yes" | "No";
  holdReason?: string;
};

export const TRUST_FLOW_STAGES = [
  { id: "deposited", label: "Deposited" },
  { id: "held", label: "Held" },
  { id: "broker-fee", label: "Broker Fee" },
  { id: "carrier-release", label: "Carrier Release" },
  { id: "reconciled", label: "Reconciled" },
] as const;

export function getTrustFlowStageIndex(entry: TrustLedgerEntry): number {
  if (entry.status === "Failed") return 0;
  if (entry.type === "Deposit" && entry.status === "Pending") return 0;
  if (entry.type === "Deposit" && entry.status === "Processing") return 1;
  if (entry.type === "Broker Fee Hold") return 2;
  if (entry.type === "Carrier Release" && entry.status !== "Completed") return 3;
  if (entry.type === "Carrier Release" || entry.status === "Completed") return 4;
  if (entry.type === "Adjustment") return 3;
  return 1;
}

export function getBrokerFeeHoldSummary(entries: BrokerFeeEntry[]) {
  const held = entries.filter((e) => e.status === "Held");
  const released = entries.filter((e) => e.status === "Released");
  const pendingReleases = held.filter((e) => e.collected === "No").length;
  const parseFee = (fee: string) => Number(fee.replace(/[^0-9.]/g, "")) || 0;

  return {
    amountHeld: held.reduce((sum, e) => sum + parseFee(e.brokerFee), 0),
    amountReleased: released.reduce((sum, e) => sum + parseFee(e.brokerFee), 0),
    pendingReleases,
    heldCount: held.length,
  };
}

export const trustReferenceKpis = [
  {
    label: "Trust Balance",
    value: "$42,600",
    sub: "Available funds",
    helper: "Live trust balance",
    color: "primary" as const,
  },
  {
    label: "Pending Deposits",
    value: "$18,400",
    sub: "Awaiting settlement",
    helper: "Incoming funds",
    color: "yellow" as const,
  },
  {
    label: "Carrier Releases",
    value: "$12,800",
    sub: "Ready to pay carriers",
    helper: "Outgoing obligations",
    color: "primary" as const,
  },
  {
    label: "Daily Reconciliation",
    value: "Balanced",
    sub: "$0 difference",
    helper: "Today's audit status",
    color: "green" as const,
  },
];

export const trustLastUpdated = "Last updated 12 min ago";

export const trustLedgerEntries: TrustLedgerEntry[] = [
  {
    id: "tl-martinez-deposit",
    date: "June 20",
    referenceNumber: "TR-88341",
    client: "Martinez Landscaping",
    type: "Deposit",
    amount: "$4,820",
    amountValue: 4820,
    status: "Pending",
    balanceAfter: "$42,600",
    drawer: {
      invoiceReference: "INV-2048",
      clientInfo: "Martinez Landscaping — BOP + Workers Comp",
      policyType: "BOP + Workers Comp",
      carrier: "Markel",
      brokerFee: "$500",
      premiumPortion: "$4,320",
      paymentMethod: "ACH",
      carrierPaymentHistory: [],
      trustAccountLogs: [
        { id: "tal-1", entry: "Deposit initiated — ACH pending settlement", date: "June 20, 2026" },
      ],
      reconciliationNotes: ["Awaiting ACH settlement — expected today."],
    },
  },
  {
    id: "tl-kim-release",
    date: "June 19",
    referenceNumber: "TR-88310",
    client: "Kim Auto Shop",
    type: "Carrier Release",
    amount: "$5,200",
    amountValue: 5200,
    status: "Completed",
    balanceAfter: "$37,780",
    drawer: {
      invoiceReference: "INV-2045",
      clientInfo: "Kim Auto Shop — Commercial Auto + GL",
      policyType: "Commercial Auto + GL",
      carrier: "Travelers",
      brokerFee: "$450",
      premiumPortion: "$5,200",
      paymentMethod: "ACH",
      carrierPaymentHistory: [
        { id: "cph-1", action: "Carrier payment released to Travelers", date: "June 19, 2026" },
        { id: "cph-2", action: "Deposit cleared", date: "June 18, 2026" },
      ],
      trustAccountLogs: [
        { id: "tal-2", entry: "Release TR-88310 — Travelers", date: "June 19, 2026" },
      ],
      reconciliationNotes: ["Carrier payment confirmed."],
    },
  },
  {
    id: "tl-seoul-broker",
    date: "June 18",
    referenceNumber: "TR-88295",
    client: "Greenline Logistics",
    type: "Broker Fee Hold",
    amount: "$500",
    amountValue: 500,
    status: "Completed",
    balanceAfter: "$42,980",
    drawer: {
      invoiceReference: "INV-2042",
      clientInfo: "Greenline Logistics — BOP + Liquor Liability",
      policyType: "BOP + Liquor Liability",
      carrier: "Nationwide",
      brokerFee: "$500",
      premiumPortion: "$5,700",
      paymentMethod: "Card",
      carrierPaymentHistory: [],
      trustAccountLogs: [
        { id: "tal-3", entry: "Broker fee held separately — compliance", date: "June 18, 2026" },
      ],
      reconciliationNotes: ["Broker fee separated from premium per compliance."],
    },
  },
  {
    id: "tl-abc-failed",
    date: "June 17",
    referenceNumber: "TR-88280",
    client: "ABC Logistics",
    type: "Deposit",
    amount: "$3,900",
    amountValue: 3900,
    status: "Failed",
    balanceAfter: "$43,480",
    drawer: {
      invoiceReference: "INV-2039",
      clientInfo: "ABC Logistics — Commercial Auto",
      policyType: "Commercial Auto",
      carrier: "Liberty Mutual",
      brokerFee: "$350",
      premiumPortion: "$3,550",
      paymentMethod: "Card",
      carrierPaymentHistory: [],
      trustAccountLogs: [
        { id: "tal-4", entry: "Deposit failed — card declined", date: "June 17, 2026" },
      ],
      reconciliationNotes: ["Payment failed — no funds deposited to trust."],
    },
  },
  {
    id: "tl-coastal-deposit",
    date: "June 16",
    referenceNumber: "TR-88270",
    client: "Coastal Bistro",
    type: "Deposit",
    amount: "$3,200",
    amountValue: 3200,
    status: "Completed",
    balanceAfter: "$43,480",
    drawer: {
      invoiceReference: "INV-2040",
      clientInfo: "Coastal Bistro — BOP",
      policyType: "BOP",
      carrier: "Guard",
      brokerFee: "$300",
      premiumPortion: "$2,900",
      paymentMethod: "Check",
      carrierPaymentHistory: [],
      trustAccountLogs: [
        { id: "tal-5", entry: "Check cleared and deposited", date: "June 16, 2026" },
      ],
      reconciliationNotes: [],
    },
  },
  {
    id: "tl-westside-adjust",
    date: "June 15",
    referenceNumber: "TR-88260",
    client: "Rivera Construction",
    type: "Adjustment",
    amount: "$300",
    amountValue: 300,
    status: "Completed",
    balanceAfter: "$40,280",
    drawer: {
      invoiceReference: "INV-2046",
      clientInfo: "Rivera Construction — GL + Umbrella",
      policyType: "GL + Umbrella",
      carrier: "CNA",
      brokerFee: "$400",
      premiumPortion: "$3,700",
      paymentMethod: "Wire",
      carrierPaymentHistory: [],
      trustAccountLogs: [
        { id: "tal-6", entry: "Partial payment adjustment", date: "June 15, 2026" },
      ],
      reconciliationNotes: ["Pending adjustment for partial wire payment."],
    },
  },
];

export const pendingDeposits: PendingDeposit[] = [
  {
    id: "pd-martinez",
    client: "Martinez Landscaping",
    amount: "$4,820",
    paymentMethod: "ACH",
    expected: "Today",
    status: "Processing",
    cta: "Verify Deposit",
    ledgerId: "tl-martinez-deposit",
    eta: "Today",
  },
  {
    id: "pd-abc",
    client: "ABC Logistics",
    amount: "$3,900",
    paymentMethod: "Card",
    expected: "Tomorrow",
    status: "Pending",
    cta: "Review",
    ledgerId: "tl-abc-failed",
    eta: "Tomorrow",
  },
  {
    id: "pd-northside",
    client: "Northside Builders",
    amount: "$7,200",
    paymentMethod: "ACH",
    expected: "June 22, 2026",
    status: "Pending",
    cta: "Review",
    ledgerId: "tl-abc-failed",
    eta: "June 22, 2026",
  },
];

export const carrierReleases: CarrierRelease[] = [
  {
    id: "cr-kim",
    client: "Kim Auto Shop",
    carrier: "Travelers",
    amount: "$5,200",
    due: "Today",
    status: "Ready",
    cta: "Release Funds",
    ledgerId: "tl-kim-release",
  },
  {
    id: "cr-seoul",
    client: "Greenline Logistics",
    carrier: "Markel",
    amount: "$6,400",
    due: "Tomorrow",
    status: "Scheduled",
    cta: "Review",
  },
  {
    id: "cr-martinez",
    client: "Martinez Landscaping",
    carrier: "Markel",
    amount: "$4,320",
    due: "June 22, 2026",
    status: "Scheduled",
    cta: "Review",
    ledgerId: "tl-martinez-deposit",
  },
];

export const brokerFeeLedger: BrokerFeeEntry[] = [
  {
    id: "bf-martinez",
    client: "Martinez Landscaping",
    brokerFee: "$500",
    status: "Held",
    collected: "Yes",
    holdReason: "Awaiting carrier bind confirmation before release",
  },
  {
    id: "bf-kim",
    client: "Kim Auto Shop",
    brokerFee: "$600",
    status: "Released",
    collected: "Yes",
    holdReason: "Released after premium deposit cleared",
  },
  {
    id: "bf-seoul",
    client: "Greenline Logistics",
    brokerFee: "$550",
    status: "Held",
    collected: "No",
    holdReason: "Overdue invoice — broker fee held pending payment",
  },
  {
    id: "bf-coastal",
    client: "Coastal Bistro",
    brokerFee: "$300",
    status: "Released",
    collected: "Yes",
    holdReason: "Standard release after reconciliation",
  },
];

export const dailyReconciliation = {
  depositsCleared: "$8,400",
  carrierPaymentsSent: "$5,200",
  brokerFeesRecorded: "$1,100",
  pendingAdjustments: "$300",
  difference: "$0",
  status: "Balanced" as const,
};

export type TrustActivityItem = {
  id: string;
  message: string;
  timeAgo: string;
  amount?: string;
  status: LedgerEntryStatus;
  type: LedgerEntryType;
};

export const trustActivity: TrustActivityItem[] = [
  {
    id: "ta-1",
    message: "Martinez Landscaping deposit initiated",
    timeAgo: "Today, 9:14 AM",
    amount: "$4,820",
    status: "Processing",
    type: "Deposit",
  },
  {
    id: "ta-2",
    message: "Kim Auto Shop carrier payment released",
    timeAgo: "Today, 8:42 AM",
    amount: "$5,200",
    status: "Completed",
    type: "Carrier Release",
  },
  {
    id: "ta-3",
    message: "Greenline Logistics broker fee logged",
    timeAgo: "Yesterday, 4:30 PM",
    amount: "$550",
    status: "Completed",
    type: "Broker Fee Hold",
  },
  {
    id: "ta-4",
    message: "Kim Auto Shop deposit pending clearance",
    timeAgo: "Yesterday, 11:05 AM",
    amount: "$5,800",
    status: "Pending",
    type: "Deposit",
  },
  {
    id: "ta-5",
    message: "Rivera Construction adjustment recorded",
    timeAgo: "2 days ago",
    amount: "$150",
    status: "Completed",
    type: "Adjustment",
  },
];

export const ledgerStatusClass: Record<LedgerEntryStatus, string> = {
  Pending: "badge-yellow",
  Processing: "badge-blue",
  Completed: "badge-green",
  Failed: "badge-red",
};

export const ledgerTypeClass: Record<LedgerEntryType, string> = {
  Deposit: "badge-green",
  "Carrier Release": "badge-blue",
  "Broker Fee Hold": "badge-blue",
  Adjustment: "badge-yellow",
  Refund: "badge-red",
};

export const depositStatusClass: Record<PendingDeposit["status"], string> = {
  Processing: "badge-blue",
  Pending: "badge-yellow",
  Failed: "badge-red",
};

export const carrierReleaseStatusClass: Record<CarrierRelease["status"], string> = {
  Ready: "badge-green",
  Scheduled: "badge-yellow",
  Released: "badge-blue",
};

export const brokerFeeStatusClass: Record<BrokerFeeEntry["status"], string> = {
  Held: "badge-yellow",
  Released: "badge-green",
};

export function findLedgerEntryById(id: string): TrustLedgerEntry | undefined {
  return trustLedgerEntries.find((e) => e.id === id);
}
