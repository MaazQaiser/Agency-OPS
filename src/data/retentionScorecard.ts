import type { RetentionKpi } from "@/types";

export const retentionHeader = {
  tag: "Agency OS · Retention + Prime Agency Intelligence",
  title: "Retention Scorecard + Prime Agency Module",
  titleEmphasis: "Scorecard",
  meta: [
    { label: "Owner", value: "Eva Chong · Insurance Town · California" },
    { label: "Retention Leads", value: "Valerie (English) · Tracie (Korean)" },
    { label: "Module Type", value: "Permanent Operational Intelligence" },
    { label: "Updated", value: "May 29, 2026" },
  ],
  patent: "Patent Pending · USPTO #64/053,057",
  confBanner: "⚠ Confidential — Insurance Town Agency OS — Retention + Prime Agency Scorecard Module",
  footer: "Insurance Town | Agency OS · Retention + Prime Agency Scorecard Module · Patent Pending USPTO #64/053,057 · Confidential · May 29, 2026",
};

export const ecosystemNewBusiness = {
  title: "Ecosystem 1 — New Business Production",
  items: ["Sarah — Personal Lines + Life", "Jazmín — Commercial SDR (warm transfers only)", "Pedro Torres — Commercial follow-up (trial)", "Zahra Gul — Farmers captive new business (trial)"],
  footer: "Measured on: premium production, close rate, policies bound, households opened.",
};

export const ecosystemRetention = {
  title: "Ecosystem 2 — Retention / Account Management",
  items: ["Valerie — English Retention + Cross-Sell Dept", "Tracie — Korean Retention + Cross-Sell Dept"],
  footer: "Measured on: retention %, PIF, household retention, saves, cross-sell points, Prime Agency contribution. Not premium production alone.",
};

export const valerieTracieTitles = {
  title: "How Valerie + Tracie Are Titled in Agency OS",
  items: ["Account Manager", "Retention Specialist", "Household Protection Advisor", "Cross-Sell Opportunity Manager"],
  footer: "These are not service-only roles. They are profit protection + growth acceleration positions with full KPI accountability and performance compensation.",
};

export const valerieKpis: RetentionKpi[] = [
  { label: "Retention %", value: "94.2%", sub: "Goal: 93%+ (Tier 2)", color: "green" },
  { label: "PIF (Policies in Force)", value: "312", sub: "Month-over-month trend", color: "primary" },
  { label: "Cancellation Saves", value: "7", sub: "60-day hold verified", color: "blue" },
  { label: "Cross-Sell Points", value: "142", sub: "Goal: 100/month", color: "primary" },
  { label: "ACRs Completed", value: "18", sub: "Annual Coverage Reviews", color: "green" },
  { label: "Life Referrals", value: "3", sub: "Sent to Sarah this month", color: "amber" },
];

export const tracieKpis: RetentionKpi[] = [
  { label: "Retention %", value: "91.8%", sub: "Goal: 93%+ (currently Tier 1)", color: "amber" },
  { label: "PIF (Korean Dept)", value: "87", sub: "Month-over-month trend", color: "primary" },
  { label: "Cancellation Saves", value: "2", sub: "60-day hold verified", color: "blue" },
  { label: "Cross-Sell Points", value: "64", sub: "Goal: 100/month", color: "amber" },
  { label: "ACRs Completed", value: "9", sub: "Annual Coverage Reviews", color: "green" },
  { label: "Life Referrals", value: "1", sub: "Sent to Sarah this month", color: "amber" },
];

export const combinedExecutiveTable = [
  { kpi: "Retention %", valerie: "94.2%", valerieColor: "green", tracie: "91.8%", tracieColor: "amber", combined: "93.1%", goal: "93%+ (Tier 2)" },
  { kpi: "PIF", valerie: "312", tracie: "87", combined: "399", goal: "Grow MoM" },
  { kpi: "Cancellation Saves", valerie: "7", tracie: "2", combined: "9", goal: "Track + bonus" },
  { kpi: "Cross-Sell Points", valerie: "142", tracie: "64", combined: "206", goal: "200+/month combined" },
  { kpi: "ACRs", valerie: "18", tracie: "9", combined: "27", goal: "Eva sets monthly target" },
  { kpi: "Life Referrals to Sarah", valerie: "3", tracie: "1", combined: "4", goal: "Eva sets monthly target" },
  { kpi: "Commercial Referral Opps", valerie: "—", tracie: "—", combined: "—", goal: "Track — bonus eligible" },
];

export const retentionBonusTiers = [
  { badge: "No Bonus", tierClass: "tier-none", body: "Below 90% retention · No performance bonus this period" },
  { badge: "Tier 1", tierClass: "tier-1", body: "91–92% retention · Base bonus applies · Eva sets dollar amount", strong: "91–92% retention" },
  { badge: "Tier 2", tierClass: "tier-2", body: "93–94% retention · Enhanced bonus · Eligible for Prime Agency alignment bonus", strong: "93–94% retention" },
  { badge: "Tier 3", tierClass: "tier-3", body: "95%+ retention · Maximum bonus · Full Prime Agency + 5-Star Agency bonus eligibility", strong: "95%+ retention" },
];

export const crossSellPoints = [
  { activity: "Annual Coverage Review (ACR) completed", points: "10 pts", pill: "pill-blue", notes: "Must be documented in AZ" },
  { activity: "Auto + Home bundle added to existing client", points: "15 pts", pill: "pill-green", notes: "Policy must bind" },
  { activity: "Umbrella added to existing household", points: "12 pts", pill: "pill-green", notes: "Policy must bind" },
  { activity: "Renters policy added", points: "8 pts", pill: "pill-blue", notes: "Policy must bind" },
  { activity: "Life appointment booked (referred to Sarah)", points: "10 pts", pill: "pill-blue", notes: "Appointment set + documented in AZ" },
  { activity: "Life policy issued (from referral)", points: "20 pts", pill: "pill-green", notes: "Sarah confirms + documents referral source" },
  { activity: "Commercial referral opportunity identified", points: "8 pts", pill: "pill-blue", notes: "Client name + commercial need logged in AZ" },
  { activity: "Commercial policy bound from referral", points: "25 pts", pill: "pill-green", notes: "Highest value activity" },
  { activity: "EPLI conversation initiated", points: "5 pts", pill: "pill-blue", notes: "Commercial client — must be documented" },
  { activity: "Existing client referral (new household)", points: "8 pts", pill: "pill-blue", notes: "Referral received + logged in AZ" },
];

export const cancellationSaveEligibility = [
  "Policy remains active for 60+ days after the save",
  "Premium successfully collected for that period",
  "Save documented properly in AgencyZoom notes",
  "No rewrite manipulation — genuine save only",
];

export const cancellationSaveTypes = [
  { type: "Personal Lines save", value: "Standard", pill: "pill-blue", notes: "Base save bonus — Eva sets dollar amount" },
  { type: "Commercial Lines save", value: "Higher weighted", pill: "pill-green", notes: "Commercial carries higher premium — higher bonus value" },
  { type: "Multi-policy household save", value: "Higher weighted", pill: "pill-green", notes: "Preserving bundle = higher retention impact" },
  { type: "Rewrite (same carrier)", value: "Reduced or Zero", pill: "pill-amber", notes: "Rewrite to avoid cancellation — not a genuine save" },
];

export const primeAgencyKpis = [
  { metric: "PIF movement (growth/loss)", frequency: "Monthly · Quarterly · Rolling 12mo", source: "Farmers system → Kyle's Sheets", owner: "Eva + Valerie + Tracie" },
  { metric: "Retention %", frequency: "Monthly · Quarterly · Rolling 12mo", source: "Farmers system → Kyle's Sheets", owner: "Valerie (English) + Tracie (Korean)" },
  { metric: "Growth % (new policies ÷ PIF)", frequency: "Monthly · Quarterly", source: "AgencyZoom + Farmers system", owner: "Sarah + Eva" },
  { metric: "Life production", frequency: "Monthly · Quarterly", source: "AgencyZoom pipeline 3 (Life/FFS)", owner: "Sarah (production) + Valerie/Tracie (referrals)" },
  { metric: "Commercial production", frequency: "Monthly · Quarterly", source: "AgencyZoom pipelines 4+5", owner: "Jazmín + Pedro" },
  { metric: "Prime Agency status", frequency: "Quarterly", source: "Farmers scorecard", owner: "Eva executive view only" },
  { metric: "Quarterly ranking movement", frequency: "Quarterly", source: "Farmers system", owner: "Eva executive view only" },
  { metric: "Persistency rate", frequency: "Monthly · Rolling 12mo", source: "Farmers system", owner: "Eva + retention team" },
  { metric: "Household penetration", frequency: "Monthly · Quarterly", source: "AgencyZoom + Farmers system", owner: "Valerie + Tracie" },
  { metric: "Cancellation rate", frequency: "Monthly · Rolling 12mo", source: "AgencyZoom + Farmers system", owner: "Valerie + Tracie" },
  { metric: "RC alignment goals", frequency: "Monthly", source: "Farmers system", owner: "Eva" },
];

export const agencyZoomPipelines = [
  { pipeline: "Renewal Review Pipeline", owner: "Valerie (English) + Tracie (Korean)", automation: "21-day/14-day/7-day/30-day SLA flows — separate by language", monday: "Valerie board + Tracie board (never shared)" },
  { pipeline: "Cancellation Save Pipeline", owner: "Valerie + Tracie (by language)", automation: "Save trigger → 60-day verification → bonus calculation signal", monday: "Each VA's Monday board" },
  { pipeline: "Cross-Sell Pipeline", owner: "Valerie + Tracie", automation: "Cross-sell point calculation + AZ activity log sync", monday: "Cross-sell group on each VA board" },
  { pipeline: "Life Referral Pipeline", owner: "Valerie/Tracie (referral) → Sarah (production)", automation: "AZ activity → Sarah's pipeline trigger → Slack alert [Sarah]", monday: "Sarah's board" },
  { pipeline: "Commercial Opportunity Pipeline", owner: "Valerie/Tracie (identify) → Jazmín (outreach)", automation: "Commercial opp identified → Slack alert [Jazmín] + Monday card", monday: "Jazmín's SDR board" },
  { pipeline: "Annual Coverage Review Pipeline", owner: "Valerie + Tracie", automation: "ACR scheduled → completion logged → points awarded", monday: "Each VA's Monday board" },
];

export const systemOwnership = [
  { system: "AgencyZoom", who: "Kyle (sequences) + Arminda (data entry) + Eva (design)", what: "6 retention pipelines above. Sequences: renewal reminders, save follow-ups, ACR scheduling, cross-sell prompts." },
  { system: "Monday.com", who: "Kyle", what: "Retention task queues per VA. Overdue alerts. SLA tracking. Manager visibility for Eva." },
  { system: "Agency OS Dashboard", who: "Hassan", what: "KPI dashboards, compensation calculations, weighted cross-sell scoring, retention analytics, Prime Agency score tracking, executive reporting, leaderboard, quarterly trend forecasting." },
  { system: "Make.com automation", who: "Kyle", what: "AZ → Monday retention triggers. Save verification flows. Scorecard sync. Overdue escalation. Cross-sell point calculation. Dashboard data pipeline." },
  { system: "Compensation calculation", who: "Hassan (dashboard display) + Kyle (data sync)", what: "Eva sets tier dollar values once in a config Sheets tab. Agency OS reads retention % → applies tier → displays calculated bonus in each person's scorecard. Automatic. Never manual." },
];

export const futureRoadmap = [
  { feature: "Weighted account scoring", description: "Each client scored by household value, policy count, retention risk — helps prioritize who to call first", phase: "Phase 3", pill: "pill-blue" },
  { feature: "Predictive cancellation risk", description: "AI flags clients likely to cancel based on payment patterns, tenure, policy changes — proactive save opportunities", phase: "Phase 3", pill: "pill-blue" },
  { feature: "Household penetration scoring", description: "Visual score per household showing coverage gaps and cross-sell opportunities remaining", phase: "Phase 3", pill: "pill-blue" },
  { feature: "Automated compensation calculations", description: "Full bonus calculation automation — Eva reviews and approves, system does the math", phase: "Phase 2", pill: "pill-amber" },
  { feature: "Prime Agency forecasting", description: "Dashboard shows projected Prime status at end of quarter based on current trajectory", phase: "Phase 2", pill: "pill-amber" },
  { feature: "AI recommendation engine", description: "Suggests which clients to call for ACR, cross-sell, or save based on policy data", phase: "Phase 3", pill: "pill-blue" },
  { feature: "Retention risk heat maps", description: "Visual map of all clients by risk level — high risk clients surface to the top of each VA's queue", phase: "Phase 3", pill: "pill-blue" },
  { feature: "Executive forecasting dashboards", description: "Eva sees full agency trend: where Prime status will land, what needs to change, which department is behind", phase: "Phase 2", pill: "pill-amber" },
];

export const retentionTabs = [
  { id: "valerie", label: "Valerie — English Dept" },
  { id: "tracie", label: "Tracie — Korean Dept" },
  { id: "combined", label: "Eva Executive View" },
];

export const commercialHeader = {
  brand: "InsuranceTown",
  brandSub: "/ Commercial",
  version: "v1.0 · May 2026",
  confBanner: "⚠️   Internal Insurance Town Resource  |  Authorized Internal Use Only  |  Do Not Share Outside Agency",
};

export const commercialTabs = [
  { id: "exec", label: "Executive" },
  { id: "va", label: "VA Dashboard" },
  { id: "pipeline", label: "Pipeline" },
  { id: "aging", label: "Aging Report" },
  { id: "daily", label: "Daily" },
  { id: "formulas", label: "Sheets Setup" },
];
