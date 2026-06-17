import type { Submission } from "@/types/submission";

export function getStatusBadgeClass(status: string, daysOpen: number): string {
  if (status === "Bound" || status === "Quoted") return "badge-green";
  if (status === "Overdue" || daysOpen > 10) return "badge-red";
  if (status === "Pending") return "badge-yellow";
  if (status === "Declined") return "badge-gray";
  return "badge-blue";
}

export function getRowClass(status: string, daysOpen: number): string {
  if (status === "Bound" || status === "Quoted") return "row-green";
  if (status === "Overdue" || daysOpen > 2) return "row-red";
  if (status === "Pending") return "row-yellow";
  if (status === "Declined") return "row-gray";
  return "";
}

export function getAgingDotClass(days: number, threshold: number): string {
  if (days <= threshold) return "aging-dot";
  if (days > 10) return "aging-dot filled-red";
  if (days > 4) return "aging-dot filled-yellow";
  return "aging-dot filled-green";
}

export const agingThresholds = [0, 2, 5, 10, 14];

export function filterSubmissions(
  submissions: Submission[],
  filters: { va?: string; lob?: string; producer?: string; status?: string }
): Submission[] {
  return submissions.filter((s) => {
    if (filters.va && filters.va !== "all" && s.va !== filters.va) return false;
    if (filters.lob && filters.lob !== "all" && s.lob !== filters.lob) return false;
    if (filters.producer && filters.producer !== "all" && s.producer !== filters.producer) return false;
    if (filters.status && filters.status !== "all" && s.status !== filters.status) return false;
    return true;
  });
}

export function needsMarketWarning(s: Submission): boolean {
  return s.markets < 3 && s.status !== "Declined" && s.status !== "Bound";
}
