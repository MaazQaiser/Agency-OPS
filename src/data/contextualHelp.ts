import type { AppIconName } from "@/components/ui/AppIcon";

export type HubHelpId =
  | "va-operations"
  | "commercial-hub"
  | "farmers-edge"
  | "send-center"
  | "retention"
  | "carrier-library"
  | "training-hub"
  | "epay-policy"
  | "intake-forms"
  | "analytics"
  | "global-search";

export type HelpSourceType = "live" | "config" | "pipeline" | "approved";

export type HelpDataSource = {
  label: string;
  type: HelpSourceType;
};

export type HelpMetric = {
  id: string;
  term: string;
  definition: string;
  keywords: string[];
};

export type HelpSearchEntry = {
  id: string;
  sectionId: string;
  label: string;
  text: string;
  keywords: string[];
};

export type HubHelpContent = {
  id: HubHelpId;
  title: string;
  icon: AppIconName;
  hubAccent: "va" | "commercial" | "farmers-edge" | "send" | "retention" | "carrier" | "training" | "epay" | "intake" | "search" | "analytics";
  summary: string;
  dataSources: HelpDataSource[];
  howToUse: string[];
  metrics: HelpMetric[];
  quickActions: string[];
  extraSections?: { id: string; title: string; items: string[]; keywords: string[] }[];
};

export const helpSourceLabels: Record<HelpSourceType, string> = {
  live: "Live",
  config: "Config",
  pipeline: "Pipeline",
  approved: "Approved",
};

export const hubHelpContent: Record<HubHelpId, HubHelpContent> = {
  "va-operations": {
    id: "va-operations",
    title: "VA Operations",
    icon: "users",
    hubAccent: "va",
    summary:
      "Command center for team workload, speed-to-lead, task queues, approvals, and daily VA priorities across the agency.",
    dataSources: [
      { label: "RingCentral", type: "live" },
      { label: "AgencyZoom", type: "pipeline" },
      { label: "Supabase", type: "live" },
      { label: "Google Sheets", type: "config" },
    ],
    howToUse: [
      "Switch role views to see Dialer, Research, Brokerage, or Owner dashboards.",
      "Review Tasks Due Today and SLA Breaches first each morning.",
      "Use the Activity tab to audit who touched which lead or submission.",
      "Route approvals from the Approvals queue before end of folio day.",
      "Monitor speed-to-lead on the Overview strip — target under 3 minutes.",
    ],
    metrics: [
      {
        id: "metric-stl",
        term: "Speed-to-Lead",
        definition: "Minutes from lead arrival to first human contact. Under 3 min is on pace; over 5 min is a breach risk.",
        keywords: ["speed", "lead", "response", "sla"],
      },
      {
        id: "metric-tasks",
        term: "Tasks Due Today",
        definition: "Open VA tasks with a due date of today or earlier, including overdue items requiring escalation.",
        keywords: ["tasks", "due", "overdue"],
      },
      {
        id: "metric-sla",
        term: "SLA Breaches",
        definition: "Work items past their service-level threshold — calls, docs, or follow-ups that missed the window.",
        keywords: ["sla", "breach", "missed"],
      },
      {
        id: "metric-approvals",
        term: "Pending Approvals",
        definition: "Quotes, binds, or proposals waiting on producer sign-off before moving to market or client.",
        keywords: ["approval", "producer", "pending"],
      },
    ],
    quickActions: ["Assign VA", "Ping team member", "Flag follow-up", "Open submission", "Review approvals"],
    extraSections: [
      {
        id: "va-folio",
        title: "Folio context",
        items: [
          "VA metrics roll up to the active folio period — not calendar month.",
          "Use the folio bar to compare written premium pace vs days remaining.",
        ],
        keywords: ["folio", "pace", "period"],
      },
    ],
  },
  "commercial-hub": {
    id: "commercial-hub",
    title: "Commercial Hub",
    icon: "bar-chart",
    hubAccent: "commercial",
    summary:
      "Track live commercial submissions, pipeline movement, E&O risk exposure, carrier response times, and bind-ready opportunities.",
    dataSources: [
      { label: "AgencyZoom", type: "pipeline" },
      { label: "Supabase", type: "live" },
      { label: "Google Sheets", type: "config" },
      { label: "Carrier portals", type: "approved" },
    ],
    howToUse: [
      "Start on Executive Dashboard for portfolio risk and pipeline health.",
      "Filter submissions by vertical, carrier, or assigned VA in Submission Tracker.",
      "Sort by E&O exposure to surface critical submissions first.",
      "Review Missing Docs and Carrier Follow-Up queues daily.",
      "Use Ready to Bind when quote is selected and producer-approved.",
    ],
    metrics: [
      {
        id: "metric-eo",
        term: "E&O Exposure Score",
        definition: "Composite risk urgency from days open, carrier declines, and missing documents. 5+ is watch; 6+ is critical.",
        keywords: ["e&o", "exposure", "risk", "score"],
      },
      {
        id: "metric-clock",
        term: "Submission Clock",
        definition: "Elapsed time waiting on market action — quote, bind, or carrier response since last touch.",
        keywords: ["clock", "waiting", "market", "time"],
      },
      {
        id: "metric-velocity",
        term: "Lead Velocity",
        definition: "Stage progression speed — how fast submissions move from intake through quote to bind.",
        keywords: ["velocity", "stage", "progression", "pipeline"],
      },
      {
        id: "metric-pipeline",
        term: "Active Pipeline",
        definition: "Open commercial cases from intake through bind, excluding closed or declined.",
        keywords: ["pipeline", "open", "submissions"],
      },
    ],
    quickActions: ["Create AZ note", "Assign VA", "Escalate to producer", "Export pipeline", "Add market"],
  },
  "farmers-edge": {
    id: "farmers-edge",
    title: "Farmers Edge",
    icon: "shield",
    hubAccent: "farmers-edge",
    summary:
      "Commercial competitive intelligence hub. Access ITA's commercial edge over competitors — coverage benefits, gaps by vertical, equipment intel, objection reframes, script lines, and cross-sell angles. Commercial only. Zero PL content.",
    dataSources: [
      { label: "Google Sheets (Tab 12)", type: "config" },
      { label: "Google Sheets (Content Ranges)", type: "live" },
    ],
    howToUse: [
      "Select a commercial vertical from the chip selector to load all intelligence for that vertical.",
      "Use Playbook View to see all 6 content cards simultaneously during a live call.",
      "Switch to Benefits Only, Scripts Only, or Our Edge for focused views.",
      "Search across cards to find specific terms, objections, or equipment types.",
      "The vertical list is driven by Tab 12 in Google Sheets — Kyle adds new verticals there.",
    ],
    metrics: [
      {
        id: "metric-benefits",
        term: "Farmers Commercial Benefits",
        definition: "What Farmers includes commercially that competitors charge extra for or exclude. Blanket AI, waiver of subrogation, hired/non-owned auto, EPLI.",
        keywords: ["benefits", "farmers", "standard", "included"],
      },
      {
        id: "metric-gaps",
        term: "Coverage Gaps",
        definition: "What competitors miss or underwrite incorrectly per vertical. Use to show clients what their current policy excludes.",
        keywords: ["gaps", "competitors", "coverage", "missing"],
      },
      {
        id: "metric-equip",
        term: "Equipment Intel",
        definition: "Equipment risks per vertical. Shows the exposure type and ITA-recommended coverage for each equipment category.",
        keywords: ["equipment", "intel", "inland marine", "tools"],
      },
    ],
    quickActions: ["Search verticals", "View scripts", "Compare carriers", "Open playbook"],
  },
  "send-center": {
    id: "send-center",
    title: "Send Center",
    icon: "send",
    hubAccent: "send",
    summary:
      "Draft, review, approve, and send client proposals. Manages producer approval flow and escalation before delivery.",
    dataSources: [
      { label: "Supabase", type: "live" },
      { label: "Google Sheets", type: "config" },
      { label: "Proposal templates", type: "approved" },
    ],
    howToUse: [
      "Create drafts from intake or Commercial Hub handoff.",
      "Move drafts through Pending Review for producer approval.",
      "Approved drafts can be sent to clients with tracked status.",
      "Use Templates for repeatable proposal structures.",
      "Escalate stalled drafts when approval exceeds 48 hours.",
    ],
    metrics: [
      {
        id: "metric-drafts",
        term: "Draft Queue",
        definition: "Proposals in progress — not yet submitted for producer review.",
        keywords: ["draft", "queue", "proposal"],
      },
      {
        id: "metric-review",
        term: "Pending Review",
        definition: "Drafts awaiting producer approval before client send.",
        keywords: ["review", "approval", "producer"],
      },
      {
        id: "metric-sent",
        term: "Sent Proposals",
        definition: "Delivered proposals awaiting client response or bind decision.",
        keywords: ["sent", "delivered", "client"],
      },
    ],
    quickActions: ["New draft", "Request approval", "Send proposal", "Duplicate template", "Escalate"],
    extraSections: [
      {
        id: "send-approval",
        title: "Producer approval flow",
        items: [
          "Draft → Pending Review when VA marks ready.",
          "Producer approves or returns with notes.",
          "Approved moves to Sent; rejected returns to Draft.",
        ],
        keywords: ["approval", "producer", "flow", "escalation"],
      },
    ],
  },
  retention: {
    id: "retention",
    title: "Retention Scorecard",
    icon: "users",
    hubAccent: "retention",
    summary:
      "Protect in-force premium, drive cross-sell, and manage renewal saves across English and Korean retention departments.",
    dataSources: [
      { label: "AgencyZoom", type: "pipeline" },
      { label: "Google Sheets", type: "config" },
      { label: "Prime Agency", type: "approved" },
    ],
    howToUse: [
      "Review Retention % and PIF trends by department tab.",
      "Track Cross-Sell Points against monthly goals.",
      "Complete ACRs (Annual Coverage Reviews) on schedule.",
      "Log cancellation saves with 60-day hold verification.",
      "Compare Valerie (English) vs Tracie (Korean) scorecards separately.",
    ],
    metrics: [
      {
        id: "metric-retention",
        term: "Retention %",
        definition: "Policies retained through renewal period. Goal 93%+ for Tier 2 compensation.",
        keywords: ["retention", "renewal", "percent"],
      },
      {
        id: "metric-folio-pace",
        term: "Folio Pace",
        definition: "Progress against folio-period goals — renewals and cross-sell measured per folio, not calendar month.",
        keywords: ["folio", "pace", "period"],
      },
      {
        id: "metric-acr",
        term: "ACR Rules",
        definition: "Annual Coverage Reviews due per household — completed ACRs count toward retention KPIs.",
        keywords: ["acr", "annual", "coverage", "review"],
      },
      {
        id: "metric-crosssell",
        term: "Cross-Sell Points",
        definition: "Weighted points for identified and closed cross-sell opportunities per department.",
        keywords: ["cross-sell", "points", "upsell"],
      },
    ],
    quickActions: ["Schedule ACR", "Log save attempt", "Refer to producer", "Export scorecard"],
  },
  "intake-forms": {
    id: "intake-forms",
    title: "Intake Forms",
    icon: "clipboard",
    hubAccent: "intake",
    summary:
      "Structured client intake — form selection, multi-step submission wizard, draft recovery, and submission history with routing visibility.",
    dataSources: [
      { label: "AgencyZoom", type: "pipeline" },
      { label: "Supabase", type: "live" },
      { label: "Slack routing", type: "live" },
      { label: "Monday.com", type: "config" },
    ],
    howToUse: [
      "Start from Form Selector to pick the correct vertical template.",
      "Use New Submission wizard — save drafts anytime; resume from Drafts tab.",
      "Review Submission History for status, validation, and routing activity.",
      "Failed queue surfaces routing errors — retry or contact client from row actions.",
      "Notes panel captures VA context alongside the active form step.",
    ],
    metrics: [
      {
        id: "metric-validation",
        term: "Validation Status",
        definition: "Whether required fields and documents are complete before routing to AgencyZoom and downstream systems.",
        keywords: ["validation", "docs", "complete"],
      },
      {
        id: "metric-routing",
        term: "Routing Activity",
        definition: "Post-submit system handoffs — AgencyZoom, Slack, Monday — with success or failure per integration.",
        keywords: ["routing", "agencyzoom", "slack"],
      },
      {
        id: "metric-drafts",
        term: "Draft Completion",
        definition: "Percent of wizard steps completed for in-progress submissions saved via Save Draft.",
        keywords: ["draft", "progress", "resume"],
      },
    ],
    quickActions: ["New submission", "Resume draft", "View history", "Send reminder"],
    extraSections: [
      {
        id: "intake-next",
        title: "What happens next",
        items: [
          "Completed submissions route to AgencyZoom and notify the assigned VA in Slack.",
          "Failed routing lands in the Failed Queue with retry actions.",
          "Producers can track intake status from Commercial Hub Submission Tracker.",
        ],
        keywords: ["next", "after", "submit", "route"],
      },
    ],
  },
  "carrier-library": {
    id: "carrier-library",
    title: "Carrier Library",
    icon: "shield",
    hubAccent: "carrier",
    summary:
      "Central market intelligence — carrier appetite, submission rules, product guides, and contact paths for placement decisions.",
    dataSources: [
      { label: "Carrier MGA contacts", type: "config" },
      { label: "Internal appetite notes", type: "approved" },
      { label: "Supabase", type: "live" },
    ],
    howToUse: [
      "Search carriers by product, vertical, or state appetite.",
      "Open carrier profile for contacts, commissions, and restrictions.",
      "Review Submission Rules before sending to market.",
      "Add new carriers when onboarding a market relationship.",
      "Favorite frequently used markets for quick access.",
    ],
    metrics: [
      {
        id: "metric-appetite",
        term: "Appetite Match",
        definition: "Whether carrier accepts the risk class, revenue band, and coverage type for the submission.",
        keywords: ["appetite", "match", "market"],
      },
      {
        id: "metric-rules",
        term: "Submission Rules",
        definition: "Required documents, portal links, and formatting rules per carrier before quote request.",
        keywords: ["rules", "documents", "submission"],
      },
    ],
    quickActions: ["Add carrier", "Open profile", "Copy MGA email", "View rules"],
  },
  "training-hub": {
    id: "training-hub",
    title: "Training Hub",
    icon: "trophy",
    hubAccent: "training",
    summary:
      "Department training library — SOPs, Loom walkthroughs, Scribe docs, and onboarding resources for every VA role.",
    dataSources: [
      { label: "Loom", type: "live" },
      { label: "Scribe", type: "approved" },
      { label: "Google Drive", type: "config" },
    ],
    howToUse: [
      "Browse by department or resource type in the library.",
      "Upload new training with tags for discoverability.",
      "Assign required resources during VA onboarding.",
      "Use Department Overview for completion tracking.",
    ],
    metrics: [
      {
        id: "metric-completion",
        term: "Completion Rate",
        definition: "Percentage of assigned training resources marked complete per department.",
        keywords: ["completion", "training", "onboarding"],
      },
      {
        id: "metric-required",
        term: "Required SOPs",
        definition: "Mandatory resources that must be completed before role activation.",
        keywords: ["required", "sop", "mandatory"],
      },
    ],
    quickActions: ["Upload training", "Add resource", "Manage tags", "Share link"],
  },
  "epay-policy": {
    id: "epay-policy",
    title: "ePayPolicy",
    icon: "dollar",
    hubAccent: "epay",
    summary:
      "Invoice builder, payment tracking, and trust reconciliation — separates broker fees from premium and triggers Agency Bill workflows.",
    dataSources: [
      { label: "ePayPolicy", type: "live" },
      { label: "Supabase", type: "live" },
      { label: "Trust ledger", type: "approved" },
    ],
    howToUse: [
      "Build invoices in Invoice Builder — separate broker fee from premium lines.",
      "Track payment status and send client payment links.",
      "Reconcile trust funds in the Trust Reference tab.",
      "Trigger Agency Bill when carrier requires agency-billed workflow.",
      "Flag failed or overdue payments for retention follow-up.",
    ],
    metrics: [
      {
        id: "metric-broker-fee",
        term: "Broker Fee Separation",
        definition: "Broker fees appear as distinct line items — never bundled into premium for compliance.",
        keywords: ["broker", "fee", "separation", "premium"],
      },
      {
        id: "metric-invoice-status",
        term: "Invoice Status",
        definition: "Draft → Sent → Paid → Reconciled. Failed payments require manual follow-up.",
        keywords: ["invoice", "status", "payment", "paid"],
      },
      {
        id: "metric-agency-bill",
        term: "Agency Bill Trigger",
        definition: "Fires when policy is agency-billed — creates carrier payable and trust obligation.",
        keywords: ["agency", "bill", "trigger", "carrier"],
      },
    ],
    quickActions: ["New invoice", "Send payment link", "Reconcile trust", "Export ledger"],
  },
  "global-search": {
    id: "global-search",
    title: "Global Search",
    icon: "search",
    hubAccent: "search",
    summary:
      "Deep operational search across all hubs — clients, submissions, carriers, team, documents, and command actions from one workspace.",
    dataSources: [
      { label: "All hub indexes", type: "live" },
      { label: "Supabase", type: "pipeline" },
      { label: "Saved views", type: "config" },
    ],
    howToUse: [
      "Press ⌘K anywhere for instant Command Palette access.",
      "Use filters to narrow by hub, status, assignee, or date.",
      "Save frequent queries as Saved Search views.",
      "Open full workspace here for advanced filtering and export.",
      "Type commands like create note or open commercial hub in the palette.",
    ],
    metrics: [
      {
        id: "metric-relevance",
        term: "Result Grouping",
        definition: "Results grouped by Clients, Submissions, Carriers, Team, and Actions for fast scanning.",
        keywords: ["group", "results", "category"],
      },
      {
        id: "metric-saved",
        term: "Saved Views",
        definition: "Pinned filter combinations for recurring operational queries.",
        keywords: ["saved", "views", "filters"],
      },
    ],
    quickActions: ["Open palette", "Save search", "Export results", "Jump to record"],
  },
  analytics: {
    id: "analytics",
    title: "Analytics",
    icon: "bar-chart",
    hubAccent: "analytics",
    summary: "Agency-wide performance metrics — written premium pace, retention rate, commercial bind rate, quote velocity, and carrier mix. All metrics tied to active folio period.",
    dataSources: [
      { label: "AgencyZoom", type: "pipeline" },
      { label: "Google Sheets (Folio)", type: "config" },
    ],
    howToUse: [
      "Overview tab shows 6 KPI cards with 7-point sparklines for trend direction.",
      "Negative trends show in rose — positive in hub cyan.",
      "Carrier Mix shows premium distribution and bind rates by carrier for the current month.",
      "Production and Retention tabs show detailed breakdowns (coming in next build).",
    ],
    metrics: [
      {
        id: "metric-wp",
        term: "Written Premium (MTD)",
        definition: "Total bound premium for the current month-to-date vs the folio monthly pace target.",
        keywords: ["written", "premium", "mtd", "pace"],
      },
      {
        id: "metric-bind",
        term: "Commercial Bind Rate",
        definition: "Percentage of quoted commercial submissions that convert to a bound policy.",
        keywords: ["bind", "rate", "commercial", "conversion"],
      },
    ],
    quickActions: ["View production", "Export KPIs", "Compare folios"],
  },
};

export function getHubHelpContent(hubId: HubHelpId): HubHelpContent {
  return hubHelpContent[hubId];
}

export function buildHelpSearchIndex(content: HubHelpContent): HelpSearchEntry[] {
  const entries: HelpSearchEntry[] = [];

  entries.push({
    id: "summary",
    sectionId: "help-summary",
    label: "Overview",
    text: content.summary,
    keywords: ["overview", "about", content.title.toLowerCase()],
  });

  content.howToUse.forEach((item, i) => {
    entries.push({
      id: `how-${i}`,
      sectionId: "help-how-to",
      label: item,
      text: item,
      keywords: item.toLowerCase().split(/\s+/),
    });
  });

  content.metrics.forEach((metric) => {
    entries.push({
      id: metric.id,
      sectionId: `help-metric-${metric.id}`,
      label: metric.term,
      text: metric.definition,
      keywords: [metric.term.toLowerCase(), ...metric.keywords],
    });
  });

  content.extraSections?.forEach((section) => {
    section.items.forEach((item, i) => {
      entries.push({
        id: `${section.id}-${i}`,
        sectionId: `help-extra-${section.id}`,
        label: section.title,
        text: item,
        keywords: [...section.keywords, section.title.toLowerCase()],
      });
    });
  });

  return entries;
}

export function searchHelpEntries(entries: HelpSearchEntry[], query: string): HelpSearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return entries.filter(
    (entry) =>
      entry.label.toLowerCase().includes(q) ||
      entry.text.toLowerCase().includes(q) ||
      entry.keywords.some((kw) => kw.includes(q) || q.split(/\s+/).every((t) => kw.includes(t))),
  );
}

export function resolveHubHelpFromPath(pathname: string): HubHelpId | null {
  if (pathname.startsWith("/va-operations") || pathname === "/" || pathname === "/dashboard") {
    return "va-operations";
  }
  if (pathname.startsWith("/commercial-hub")) return "commercial-hub";
  if (pathname.startsWith("/send-center")) return "send-center";
  if (pathname.startsWith("/retention") || pathname.startsWith("/prime-agency")) return "retention";
  if (pathname.startsWith("/intake-forms")) return "intake-forms";
  if (pathname.startsWith("/carrier-library")) return "carrier-library";
  if (pathname.startsWith("/training-hub")) return "training-hub";
  if (pathname.startsWith("/epay-policy")) return "epay-policy";
  if (pathname.startsWith("/global-search")) return "global-search";
  if (pathname.startsWith("/farmers-edge")) return "farmers-edge";
  if (pathname.startsWith("/analytics")) return "analytics";
  return null;
}
