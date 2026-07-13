export type CommercialHubTabHeaderCopy = {
  title: string;
  subtitle: string;
};

export const commercialHubTabHeaders = {
  executive: {
    title: "Executive Dashboard",
    subtitle: "Pipeline health, exposure risk, and carrier performance at a glance.",
  },
  submissions: {
    title: "Active Market Pipeline",
    subtitle: "Operational table for every commercial submission, market, and follow-up.",
  },
  checklist: {
    title: "Coverage Checklist",
    subtitle: "Validate coverage and readiness before sending to market.",
  },
  "missing-docs": {
    title: "Missing Docs Queue",
    subtitle: "Document blockers preventing brokerage review and carrier submission.",
  },
  "follow-ups": {
    title: "Carrier Follow-Up",
    subtitle: "Track stale markets and carrier response discipline.",
  },
  "quote-review": {
    title: "Carrier Comparison",
    subtitle: "Compare returned carrier quotes, obtain producer approval, and track client decisions.",
  },
  "ready-to-bind": {
    title: "Bind Readiness",
    subtitle: "Final stage: producer approved, quote selected, docs and payment validated.",
  },
  outreach: {
    title: "Outreach Queue",
    subtitle: "Commercial follow-up: quote decisions, pending responses, and objection handling.",
  },
  "submission-clock": {
    title: "Pipeline SLA Monitor",
    subtitle: "Time-based lifecycle tracker: stage accountability, SLA compliance, and bind velocity.",
  },
  "lead-velocity": {
    title: "Speed-to-Market",
    subtitle: "Lead-to-bind speed tracking: first contact, quote velocity, conversion, and bottlenecks.",
  },
} as const satisfies Record<string, CommercialHubTabHeaderCopy>;
