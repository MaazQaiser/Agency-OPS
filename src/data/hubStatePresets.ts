import type { AppIconName } from "@/components/ui/AppIcon";

export type HubEmptyPresetId =
  | "va-operations-tasks"
  | "commercial-submissions"
  | "commercial-missing-docs"
  | "commercial-ready-bind"
  | "commercial-follow-ups"
  | "commercial-outreach"
  | "send-center-drafts"
  | "send-center-sent"
  | "notifications"
  | "epay-invoices"
  | "epay-payments"
  | "retention-records"
  | "training-content"
  | "carrier-search"
  | "global-search"
  | "intake-forms"
  | "farmers-edge-content"
  | "analytics-data"
  | "generic-list";

export type HubEmptyPreset = {
  id: HubEmptyPresetId;
  icon: AppIconName;
  title: string;
  description: string;
  ctaLabel?: string;
  hub?: string;
};

export const hubEmptyPresets: Record<HubEmptyPresetId, HubEmptyPreset> = {
  "va-operations-tasks": {
    id: "va-operations-tasks",
    icon: "clipboard",
    title: "No tasks in this view",
    description: "Tasks assigned to this role will appear here when work is queued.",
    ctaLabel: "Open VA Operations",
    hub: "va-operations",
  },
  "commercial-submissions": {
    id: "commercial-submissions",
    icon: "target",
    title: "No active submissions",
    description: "Add your first lead to start tracking pipeline movement.",
    ctaLabel: "Add Submission",
    hub: "commercial-hub",
  },
  "commercial-missing-docs": {
    id: "commercial-missing-docs",
    icon: "check",
    title: "No missing documents",
    description: "All required documents are received: queue is clear.",
  },
  "commercial-ready-bind": {
    id: "commercial-ready-bind",
    icon: "check",
    title: "Nothing ready to bind",
    description: "Submissions move here after quote selection and producer approval.",
  },
  "commercial-follow-ups": {
    id: "commercial-follow-ups",
    icon: "check",
    title: "No carrier follow-ups due",
    description: "Outstanding carrier responses will appear in this queue.",
  },
  "commercial-outreach": {
    id: "commercial-outreach",
    icon: "users",
    title: "Outreach queue is clear",
    description: "Clients needing retention or cross-sell outreach will appear here.",
  },
  "send-center-drafts": {
    id: "send-center-drafts",
    icon: "file-text",
    title: "No pending drafts",
    description: "Create your first draft for licensed review.",
    ctaLabel: "Create Draft",
    hub: "send-center",
  },
  "send-center-sent": {
    id: "send-center-sent",
    icon: "send",
    title: "No sent proposals",
    description: "Approved proposals sent to clients will appear here.",
  },
  notifications: {
    id: "notifications",
    icon: "bell",
    title: "You're all caught up",
    description: "No pending alerts right now. Time-sensitive signals from across Agency OPS will appear here.",
  },
  "epay-invoices": {
    id: "epay-invoices",
    icon: "dollar",
    title: "No invoices created yet",
    description: "Create your first invoice to begin tracking payments.",
    ctaLabel: "Create Invoice",
    hub: "epay-policy",
  },
  "epay-payments": {
    id: "epay-payments",
    icon: "dollar",
    title: "No payments to track",
    description: "Payment activity appears here once invoices are sent.",
  },
  "retention-records": {
    id: "retention-records",
    icon: "users",
    title: "No retention records for this folio yet",
    description: "Renewal and cross-sell activity will populate as the folio progresses.",
  },
  "training-content": {
    id: "training-content",
    icon: "trophy",
    title: "No Insurance Town training available for your role",
    description: "Resources assigned to your department will appear here.",
    ctaLabel: "Upload Training",
    hub: "training-hub",
  },
  "carrier-search": {
    id: "carrier-search",
    icon: "shield",
    title: "No carriers match your search",
    description: "Try a different market name, product, or vertical filter.",
    ctaLabel: "Add Carrier",
    hub: "carrier-library",
  },
  "global-search": {
    id: "global-search",
    icon: "search",
    title: "Search across Agency OS",
    description: "Search clients, carriers, submissions, tasks, and actions. Press ⌘K for instant access.",
    ctaLabel: "Open Command Palette",
  },
  "intake-forms": {
    id: "intake-forms",
    icon: "file-text",
    title: "No intake forms selected",
    description: "Choose a form template to begin a new commercial submission.",
  },
  "farmers-edge-content": {
    id: "farmers-edge-content",
    icon: "shield",
    title: "No content for this vertical yet",
    description: "Eva adds content for this vertical in Google Sheets. Check back after the next sync.",
    hub: "farmers-edge",
  },
  "analytics-data": {
    id: "analytics-data",
    icon: "bar-chart",
    title: "No analytics data for this period",
    description: "Performance data will appear once activity is recorded for this folio period.",
    hub: "analytics",
  },
  "generic-list": {
    id: "generic-list",
    icon: "folder",
    title: "Nothing here yet",
    description: "Records will appear when data is available for this view.",
  },
};

export type HubErrorPresetId =
  | "agencyzoom-unavailable"
  | "supabase-timeout"
  | "sheets-cache-failed"
  | "generic-fetch"
  | "partial-section";

export const hubErrorPresets: Record<
  HubErrorPresetId,
  { title: string; message: string; severity: "critical" | "warning"; retryLabel?: string }
> = {
  "agencyzoom-unavailable": {
    title: "AgencyZoom unavailable",
    message: "Unable to fetch pipeline data. Your last successful sync is shown below.",
    severity: "warning",
    retryLabel: "Retry",
  },
  "supabase-timeout": {
    title: "Connection lost",
    message: "Supabase timed out. Please try again.",
    severity: "critical",
    retryLabel: "Reconnect",
  },
  "sheets-cache-failed": {
    title: "Config temporarily unavailable",
    message: "Google Sheets cache failed to refresh. Operating on last known config.",
    severity: "warning",
    retryLabel: "Refresh",
  },
  "generic-fetch": {
    title: "Unable to load data",
    message: "Something went wrong while fetching this view. Please try again.",
    severity: "critical",
    retryLabel: "Retry",
  },
  "partial-section": {
    title: "Section unavailable",
    message: "This section failed to load. Other data on the page may still be available.",
    severity: "warning",
    retryLabel: "Retry section",
  },
};
