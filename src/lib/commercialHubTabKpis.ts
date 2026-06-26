import type { VaOpsKpiCardProps } from "@/components/kpi/VaOpsKpiCard";
import { commercialHubKpis } from "@/data/commercialHub";
import {
  agingBuckets,
  documentBlockers,
  readyToBindQueue,
  trackerFollowUpQueue,
  trackerSubmissions,
} from "@/data/submissionTracker";
import { computeOutreachKpis } from "@/data/outreachQueue";
import type { ChecklistClient } from "@/data/coverageChecklist";
import {
  getBindBlockers,
  getCoverageCompletion,
  getDocumentsStatus,
} from "@/data/coverageChecklist";
import type { ClockSummaryCard } from "@/data/submissionClock";
import type { VelocitySummaryCard } from "@/data/leadVelocity";
import { buildProducerReviewCases, buildQuoteReviewRows } from "@/data/quoteReview";

export function executiveTabKpis(): VaOpsKpiCardProps[] {
  return commercialHubKpis.map((kpi) => ({
    label: kpi.label,
    value: kpi.value,
    sub: kpi.sub,
    helper: kpi.helper,
    className: `commercial-hub-kpi-${kpi.tier}`,
    sparkline: false,
  }));
}

export function submissionTrackerTabKpis(): VaOpsKpiCardProps[] {
  const total = trackerSubmissions.length;
  const urgent = trackerSubmissions.filter((s) => s.daysOpen >= 6 || s.status === "Pending Docs").length;
  const quoted = trackerSubmissions.filter((s) => s.quotes.length > 0).length;
  const pendingApproval = trackerSubmissions.filter((s) => s.status === "Pending Producer Approval").length;

  return [
    ...agingBuckets.map((bucket) => ({
      label: bucket.label,
      value: String(bucket.count),
      sub: "Submissions in range",
      sparkline: false,
    })),
    {
      label: "Active Total",
      value: String(total),
      sub: "Open submissions",
      sparkline: false,
    },
    {
      label: "Needs Attention",
      value: String(urgent),
      sub: "Urgent or missing docs",
      sparkline: false,
    },
    {
      label: "Quotes In",
      value: String(quoted),
      sub: "With carrier quotes",
      sparkline: false,
    },
    {
      label: "Producer Review",
      value: String(pendingApproval),
      sub: "Awaiting approval",
      sparkline: false,
    },
  ].slice(0, 6);
}

export function coverageChecklistTabKpis(client: ChecklistClient): VaOpsKpiCardProps[] {
  const coverage = getCoverageCompletion(client);
  const docs = getDocumentsStatus(client);
  const blockers = getBindBlockers(client);

  return [
    {
      label: "Coverage Complete",
      value: `${coverage.percent}%`,
      sub: `${coverage.completed}/${coverage.total} required lines`,
      sparkline: false,
    },
    {
      label: "Documents",
      value: `${docs.received}/${docs.total}`,
      sub: "Received vs required",
      sparkline: false,
    },
    {
      label: "Risk Score",
      value: String(client.riskOverview.riskScore.score),
      sub: client.riskOverview.riskScore.label,
      sparkline: false,
    },
    {
      label: "Bind Blockers",
      value: String(blockers.length),
      sub: blockers.length === 0 ? "Clear to market" : "Needs resolution",
      sparkline: false,
    },
    {
      label: "Assigned Producer",
      value: client.assignedProducer?.trim() ? "Yes" : "No",
      sub: client.assignedProducer ?? "Unassigned",
      sparkline: false,
    },
    {
      label: "Est. Premium",
      value: client.estimatedPremium,
      sub: "Current submission",
      sparkline: false,
    },
  ];
}

export function missingDocsTabKpis(): VaOpsKpiCardProps[] {
  const critical = documentBlockers.filter((d) => d.urgency === "critical").length;
  const overdue = documentBlockers.reduce(
    (sum, item) => sum + item.documents.filter((doc) => doc.status === "Overdue").length,
    0,
  );
  const pending = documentBlockers.reduce(
    (sum, item) => sum + item.documents.filter((doc) => doc.status === "Pending").length,
    0,
  );

  return [
    {
      label: "Open Blockers",
      value: String(documentBlockers.length),
      sub: "Clients waiting on docs",
      sparkline: false,
    },
    {
      label: "Critical",
      value: String(critical),
      sub: "Immediate follow-up",
      sparkline: false,
    },
    {
      label: "Overdue Docs",
      value: String(overdue),
      sub: "Past reminder window",
      sparkline: false,
    },
    {
      label: "Pending",
      value: String(pending),
      sub: "Awaiting client upload",
      sparkline: false,
    },
  ];
}

export function carrierFollowUpTabKpis(): VaOpsKpiCardProps[] {
  const breached = trackerFollowUpQueue.filter((item) => item.slaStatus === "Breached").length;
  const atRisk = trackerFollowUpQueue.filter((item) => item.slaStatus === "At Risk").length;
  const healthy = trackerFollowUpQueue.filter((item) => item.slaStatus === "Healthy").length;
  const dueToday = trackerFollowUpQueue.filter((item) => item.due === "Today").length;

  return [
    {
      label: "Open Follow-Ups",
      value: String(trackerFollowUpQueue.length),
      sub: "Carrier responses pending",
      sparkline: false,
    },
    {
      label: "SLA Breached",
      value: String(breached),
      sub: "Past response target",
      sparkline: false,
    },
    {
      label: "At Risk",
      value: String(atRisk),
      sub: "Approaching breach",
      sparkline: false,
    },
    {
      label: "Healthy",
      value: String(healthy),
      sub: "Within SLA window",
      sparkline: false,
    },
    {
      label: "Due Today",
      value: String(dueToday),
      sub: "Requires action today",
      sparkline: false,
    },
  ];
}

export function quoteReviewTabKpis(submissions = trackerSubmissions): VaOpsKpiCardProps[] {
  const rows = buildQuoteReviewRows(submissions);
  const producerCases = buildProducerReviewCases(submissions);
  const selected = rows.filter((row) => row.status === "Selected").length;
  const declined = rows.filter((row) => row.status === "Declined").length;

  return [
    {
      label: "Quotes Returned",
      value: String(rows.length),
      sub: "Across active submissions",
      sparkline: false,
    },
    {
      label: "Producer Review",
      value: String(producerCases.length),
      sub: "Awaiting approval",
      sparkline: false,
    },
    {
      label: "Selected",
      value: String(selected),
      sub: "Client-facing quotes",
      sparkline: false,
    },
    {
      label: "Declined",
      value: String(declined),
      sub: "Carrier or client pass",
      sparkline: false,
    },
  ];
}

export function readyToBindTabKpis(queue = readyToBindQueue): VaOpsKpiCardProps[] {
  const ready = queue.filter((item) => item.bindState === "ready-to-issue").length;
  const awaitingPayment = queue.filter((item) => item.bindState === "awaiting-payment").length;
  const awaitingApp = queue.filter((item) => item.bindState === "awaiting-signed-app").length;
  const paid = queue.filter((item) => item.paymentStatus === "Paid").length;

  return [
    {
      label: "In Bind Queue",
      value: String(queue.length),
      sub: "Policies near issuance",
      sparkline: false,
    },
    {
      label: "Ready to Issue",
      value: String(ready),
      sub: "All gates cleared",
      sparkline: false,
    },
    {
      label: "Awaiting Payment",
      value: String(awaitingPayment),
      sub: "Payment validation pending",
      sparkline: false,
    },
    {
      label: "Awaiting Signed App",
      value: String(awaitingApp),
      sub: "Client signature needed",
      sparkline: false,
    },
    {
      label: "Paid",
      value: String(paid),
      sub: "Payment confirmed",
      sparkline: false,
    },
  ];
}

export function outreachTabKpis(
  snapshot: Parameters<typeof computeOutreachKpis>[0],
): VaOpsKpiCardProps[] {
  return computeOutreachKpis(snapshot).map((kpi) => ({
    ...kpi,
    sparkline: false,
  }));
}

export function summaryCardsToKpis(
  cards: Array<{ label: string; value: string }>,
  sub = "Click to filter workspace",
): VaOpsKpiCardProps[] {
  return cards.map((card) => ({
    label: card.label,
    value: card.value,
    sub,
    sparkline: false,
  }));
}

export function clockSummaryToKpis(cards: ClockSummaryCard[]): VaOpsKpiCardProps[] {
  return summaryCardsToKpis(cards, "Filter submission clock records");
}

export function velocitySummaryToKpis(cards: VelocitySummaryCard[]): VaOpsKpiCardProps[] {
  return summaryCardsToKpis(cards, "Filter lead velocity pipeline");
}
