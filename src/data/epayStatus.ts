/** Standardized ePayPolicy status badge classes */
export const epayStatusClass = {
  Draft: "epay-status-draft",
  Pending: "epay-status-pending",
  Sent: "epay-status-sent",
  Viewed: "epay-status-viewed",
  Paid: "epay-status-paid",
  Partial: "epay-status-partial",
  Failed: "epay-status-failed",
  Overdue: "epay-status-overdue",
  Refunded: "epay-status-refunded",
} as const;

export type EPayStatusKey = keyof typeof epayStatusClass;
