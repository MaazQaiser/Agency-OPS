export type SystemHealthStatus = "Healthy" | "Delayed" | "Degraded" | "Offline";

export type SystemType = "CRM" | "Communication" | "Workflow" | "Payment" | "Integration" | "Platform";

export type AlertSeverity = "Critical" | "High" | "Medium" | "Low";

export type SystemHealthSummaryFilter =
  | "all"
  | "online"
  | "degraded"
  | "offline"
  | "failedSyncs"
  | "activeAlerts"
  | "lastFullSync";

export type SystemHealthRecord = {
  id: string;
  name: string;
  type: SystemType;
  status: SystemHealthStatus;
  lastSync: string;
  lastSyncMs: number;
  responseTime: string;
  responseTimeMs: number;
  errorCount: number;
  healthScore: number;
  uptimePercent: number;
  avgLatency: string;
  lastSuccess: string;
  lastFailure: string | null;
  dependencies: string[];
  dependencyChain: string[];
  connectedModules: string[];
  syncPaused: boolean;
};

export type SystemErrorEntry = {
  id: string;
  systemId: string;
  timestamp: string;
  severity: AlertSeverity;
  message: string;
  module: string;
  failureType: string;
};

export type SystemRetryEntry = {
  id: string;
  systemId: string;
  timestamp: string;
  result: "Success" | "Failed" | "Pending";
  triggeredBy: string;
};

export type SystemHealthAlert = {
  id: string;
  title: string;
  detail: string;
  severity: AlertSeverity;
  systemId: string;
  timestamp: string;
};

export type SystemHealthSummaryCard = {
  id: string;
  label: string;
  value: string;
  filterKey: SystemHealthSummaryFilter;
};

export type SystemHealthFilters = {
  system: string;
  severity: string;
  dateRange: string;
  module: string;
  failureType: string;
};

export type DependencyNode = {
  id: string;
  label: string;
  broken?: boolean;
};

export type DependencyEdge = {
  from: string;
  to: string;
  broken?: boolean;
};

export const defaultSystemHealthFilters: SystemHealthFilters = {
  system: "All Systems",
  severity: "All Severities",
  dateRange: "Last 24 Hours",
  module: "All Modules",
  failureType: "All Failure Types",
};

export const systemStatusClass: Record<SystemHealthStatus, string> = {
  Healthy: "badge-green",
  Delayed: "badge-yellow",
  Degraded: "badge-amber",
  Offline: "badge-red",
};

export const alertSeverityClass: Record<AlertSeverity, string> = {
  Critical: "badge-red",
  High: "badge-amber",
  Medium: "badge-yellow",
  Low: "badge-blue",
};

export const healthScoreClass = (score: number): string => {
  if (score >= 90) return "health-score-high";
  if (score >= 70) return "health-score-mid";
  return "health-score-low";
};

export const systemFilterOptions = [
  "All Systems",
  "AgencyZoom",
  "Slack",
  "Monday.com",
  "ePayPolicy",
  "Carrier APIs",
  "Training Sync",
  "Search Engine",
  "Notification Engine",
  "DNC Compliance Engine",
  "Proposal Delivery Service",
];

export const severityFilterOptions = ["All Severities", "Critical", "High", "Medium", "Low"];

export const dateRangeFilterOptions = ["Last 24 Hours", "Last 7 Days", "Last 30 Days", "All Time"];

export const moduleFilterOptions = [
  "All Modules",
  "Commercial Hub",
  "Send Center",
  "VA Operations",
  "ePayPolicy",
  "Notifications",
  "Global Search",
  "Training Hub",
  "Intake Forms",
];

export const failureTypeFilterOptions = [
  "All Failure Types",
  "Timeout",
  "Auth Error",
  "Rate Limit",
  "Sync Failure",
  "Queue Stuck",
  "Latency Spike",
];

const now = Date.now();
const min = 60 * 1000;
const hour = 60 * min;

export const seedSystemHealthRecords: SystemHealthRecord[] = [
  {
    id: "sys-agencyzoom",
    name: "AgencyZoom",
    type: "CRM",
    status: "Delayed",
    lastSync: "12 mins ago",
    lastSyncMs: now - 12 * min,
    responseTime: "842ms",
    responseTimeMs: 842,
    errorCount: 2,
    healthScore: 74,
    uptimePercent: 99.2,
    avgLatency: "620ms",
    lastSuccess: "May 20, 2026 · 9:48 AM",
    lastFailure: "May 20, 2026 · 9:36 AM",
    dependencies: ["Search Engine"],
    dependencyChain: ["Commercial Hub", "AgencyZoom", "Client Records"],
    connectedModules: ["Commercial Hub", "Intake Forms", "VA Operations"],
    syncPaused: false,
  },
  {
    id: "sys-slack",
    name: "Slack",
    type: "Communication",
    status: "Healthy",
    lastSync: "2 mins ago",
    lastSyncMs: now - 2 * min,
    responseTime: "210ms",
    responseTimeMs: 210,
    errorCount: 0,
    healthScore: 98,
    uptimePercent: 99.9,
    avgLatency: "185ms",
    lastSuccess: "May 20, 2026 · 9:58 AM",
    lastFailure: null,
    dependencies: ["Notification Engine"],
    dependencyChain: ["Owner Alerts", "Slack", "Team Channels"],
    connectedModules: ["Notifications", "Send Center", "Owner Alerts"],
    syncPaused: false,
  },
  {
    id: "sys-monday",
    name: "Monday.com",
    type: "Workflow",
    status: "Healthy",
    lastSync: "5 mins ago",
    lastSyncMs: now - 5 * min,
    responseTime: "390ms",
    responseTimeMs: 390,
    errorCount: 0,
    healthScore: 96,
    uptimePercent: 99.7,
    avgLatency: "340ms",
    lastSuccess: "May 20, 2026 · 9:55 AM",
    lastFailure: null,
    dependencies: [],
    dependencyChain: ["VA Operations", "Monday.com", "Task Board"],
    connectedModules: ["VA Operations", "Commercial Hub"],
    syncPaused: false,
  },
  {
    id: "sys-epay",
    name: "ePayPolicy",
    type: "Payment",
    status: "Degraded",
    lastSync: "8 mins ago",
    lastSyncMs: now - 8 * min,
    responseTime: "1.2s",
    responseTimeMs: 1200,
    errorCount: 5,
    healthScore: 68,
    uptimePercent: 97.8,
    avgLatency: "980ms",
    lastSuccess: "May 20, 2026 · 9:50 AM",
    lastFailure: "May 20, 2026 · 9:42 AM",
    dependencies: ["Carrier APIs"],
    dependencyChain: ["Commercial Hub", "ePayPolicy", "Payment Gateway"],
    connectedModules: ["ePayPolicy", "Commercial Hub", "Notifications"],
    syncPaused: false,
  },
  {
    id: "sys-carrier",
    name: "Carrier APIs",
    type: "Integration",
    status: "Degraded",
    lastSync: "18 mins ago",
    lastSyncMs: now - 18 * min,
    responseTime: "2.4s",
    responseTimeMs: 2400,
    errorCount: 8,
    healthScore: 42,
    uptimePercent: 94.1,
    avgLatency: "1.8s",
    lastSuccess: "May 20, 2026 · 9:40 AM",
    lastFailure: "May 20, 2026 · 9:38 AM",
    dependencies: ["Proposal Delivery Service"],
    dependencyChain: ["Commercial Hub", "Carrier APIs", "Quote Response"],
    connectedModules: ["Commercial Hub", "Carrier Library", "Send Center"],
    syncPaused: false,
  },
  {
    id: "sys-training",
    name: "Training Sync",
    type: "Platform",
    status: "Healthy",
    lastSync: "15 mins ago",
    lastSyncMs: now - 15 * min,
    responseTime: "450ms",
    responseTimeMs: 450,
    errorCount: 0,
    healthScore: 94,
    uptimePercent: 99.5,
    avgLatency: "410ms",
    lastSuccess: "May 20, 2026 · 9:45 AM",
    lastFailure: null,
    dependencies: [],
    dependencyChain: ["Training Hub", "Training Sync", "Content CDN"],
    connectedModules: ["Training Hub"],
    syncPaused: false,
  },
  {
    id: "sys-search",
    name: "Search Engine",
    type: "Platform",
    status: "Delayed",
    lastSync: "22 mins ago",
    lastSyncMs: now - 22 * min,
    responseTime: "680ms",
    responseTimeMs: 680,
    errorCount: 3,
    healthScore: 78,
    uptimePercent: 98.6,
    avgLatency: "520ms",
    lastSuccess: "May 20, 2026 · 9:38 AM",
    lastFailure: "May 20, 2026 · 9:20 AM",
    dependencies: ["AgencyZoom"],
    dependencyChain: ["Global Search", "Search Engine", "Index Store"],
    connectedModules: ["Global Search", "Commercial Hub", "VA Operations"],
    syncPaused: false,
  },
  {
    id: "sys-notifications",
    name: "Notification Engine",
    type: "Platform",
    status: "Delayed",
    lastSync: "6 mins ago",
    lastSyncMs: now - 6 * min,
    responseTime: "320ms",
    responseTimeMs: 320,
    errorCount: 1,
    healthScore: 82,
    uptimePercent: 99.1,
    avgLatency: "280ms",
    lastSuccess: "May 20, 2026 · 9:54 AM",
    lastFailure: "May 20, 2026 · 8:10 AM",
    dependencies: ["Slack"],
    dependencyChain: ["App Events", "Notification Engine", "Delivery Queue"],
    connectedModules: ["Notifications", "Send Center", "Owner Alerts"],
    syncPaused: false,
  },
  {
    id: "sys-dnc",
    name: "DNC Compliance Engine",
    type: "Platform",
    status: "Healthy",
    lastSync: "3 mins ago",
    lastSyncMs: now - 3 * min,
    responseTime: "95ms",
    responseTimeMs: 95,
    errorCount: 0,
    healthScore: 99,
    uptimePercent: 99.95,
    avgLatency: "80ms",
    lastSuccess: "May 20, 2026 · 9:57 AM",
    lastFailure: null,
    dependencies: [],
    dependencyChain: ["VA Operations", "DNC Compliance Engine", "Outreach Block"],
    connectedModules: ["VA Operations", "Send Center", "Commercial Hub"],
    syncPaused: false,
  },
  {
    id: "sys-proposal",
    name: "Proposal Delivery Service",
    type: "Integration",
    status: "Offline",
    lastSync: "45 mins ago",
    lastSyncMs: now - 45 * min,
    responseTime: "-",
    responseTimeMs: 0,
    errorCount: 12,
    healthScore: 28,
    uptimePercent: 88.4,
    avgLatency: "-",
    lastSuccess: "May 20, 2026 · 9:15 AM",
    lastFailure: "May 20, 2026 · 9:15 AM",
    dependencies: ["Carrier APIs", "Slack"],
    dependencyChain: ["Send Center", "Email Service", "Client Delivery"],
    connectedModules: ["Send Center", "Notifications", "Commercial Hub"],
    syncPaused: false,
  },
];

export const seedSystemHealthAlerts: SystemHealthAlert[] = [
  {
    id: "sha-1",
    title: "AgencyZoom sync delayed by 12 mins",
    detail: "CRM sync queue behind schedule: client record updates may be stale.",
    severity: "High",
    systemId: "sys-agencyzoom",
    timestamp: "5m ago",
  },
  {
    id: "sha-2",
    title: "Carrier API timeout",
    detail: "Markel and Travelers endpoints returning 504: quote submissions affected.",
    severity: "Critical",
    systemId: "sys-carrier",
    timestamp: "12m ago",
  },
  {
    id: "sha-3",
    title: "Payment gateway latency spike",
    detail: "ePayPolicy response time exceeded 1s threshold for 8 consecutive checks.",
    severity: "High",
    systemId: "sys-epay",
    timestamp: "18m ago",
  },
  {
    id: "sha-4",
    title: "Search indexing backlog",
    detail: "Global Search index 22 mins behind: new submissions not yet discoverable.",
    severity: "Medium",
    systemId: "sys-search",
    timestamp: "22m ago",
  },
  {
    id: "sha-5",
    title: "Notification queue stuck",
    detail: "14 notifications pending delivery for 6+ minutes.",
    severity: "Medium",
    systemId: "sys-notifications",
    timestamp: "6m ago",
  },
  {
    id: "sha-6",
    title: "Proposal delivery offline",
    detail: "Email service unreachable: sent proposals not delivering to clients.",
    severity: "Critical",
    systemId: "sys-proposal",
    timestamp: "45m ago",
  },
];

export const seedSystemErrors: SystemErrorEntry[] = [
  { id: "err-1", systemId: "sys-carrier", timestamp: "May 20, 2026 · 9:38 AM", severity: "Critical", message: "Carrier API timeout: Markel endpoint 504", module: "Commercial Hub", failureType: "Timeout" },
  { id: "err-2", systemId: "sys-proposal", timestamp: "May 20, 2026 · 9:15 AM", severity: "Critical", message: "Proposal delivery service unreachable", module: "Send Center", failureType: "Sync Failure" },
  { id: "err-3", systemId: "sys-epay", timestamp: "May 20, 2026 · 9:42 AM", severity: "High", message: "Payment gateway latency spike: 1.2s avg", module: "ePayPolicy", failureType: "Latency Spike" },
  { id: "err-4", systemId: "sys-agencyzoom", timestamp: "May 20, 2026 · 9:36 AM", severity: "High", message: "AgencyZoom sync delayed: 12 min behind", module: "Commercial Hub", failureType: "Sync Failure" },
  { id: "err-5", systemId: "sys-search", timestamp: "May 20, 2026 · 9:20 AM", severity: "Medium", message: "Search indexing backlog: 847 records pending", module: "Global Search", failureType: "Queue Stuck" },
  { id: "err-6", systemId: "sys-notifications", timestamp: "May 20, 2026 · 8:10 AM", severity: "Medium", message: "Notification queue delivery delay", module: "Notifications", failureType: "Queue Stuck" },
  { id: "err-7", systemId: "sys-carrier", timestamp: "May 20, 2026 · 8:55 AM", severity: "High", message: "Travelers API rate limit exceeded", module: "Carrier Library", failureType: "Rate Limit" },
  { id: "err-8", systemId: "sys-epay", timestamp: "May 20, 2026 · 8:30 AM", severity: "Medium", message: "Auth token refresh failed: retried successfully", module: "ePayPolicy", failureType: "Auth Error" },
];

export const seedSystemRetries: SystemRetryEntry[] = [
  { id: "retry-1", systemId: "sys-carrier", timestamp: "May 20, 2026 · 9:40 AM", result: "Failed", triggeredBy: "System" },
  { id: "retry-2", systemId: "sys-proposal", timestamp: "May 20, 2026 · 9:20 AM", result: "Failed", triggeredBy: "Eva Chong" },
  { id: "retry-3", systemId: "sys-agencyzoom", timestamp: "May 20, 2026 · 9:48 AM", result: "Success", triggeredBy: "System" },
  { id: "retry-4", systemId: "sys-search", timestamp: "May 20, 2026 · 9:35 AM", result: "Pending", triggeredBy: "Eva Chong" },
  { id: "retry-5", systemId: "sys-epay", timestamp: "May 20, 2026 · 9:50 AM", result: "Success", triggeredBy: "System" },
];

export const globalDependencyNodes: DependencyNode[] = [
  { id: "commercial", label: "Commercial Hub" },
  { id: "carrier", label: "Carrier APIs", broken: true },
  { id: "proposal", label: "Proposal Delivery", broken: true },
  { id: "epay", label: "ePayPolicy", broken: true },
  { id: "notifications", label: "Notifications" },
  { id: "send-center", label: "Send Center", broken: true },
];

export const globalDependencyEdges: DependencyEdge[] = [
  { from: "commercial", to: "carrier", broken: true },
  { from: "carrier", to: "proposal", broken: true },
  { from: "proposal", to: "epay" },
  { from: "epay", to: "notifications" },
  { from: "send-center", to: "proposal", broken: true },
];

export const SYSTEM_HEALTH_STORAGE_KEY = "agency-ops-system-health";

export type SystemHealthOverrides = Record<string, Partial<Pick<SystemHealthRecord, "status" | "syncPaused" | "healthScore" | "errorCount">>>;

export function loadSystemHealthOverrides(): SystemHealthOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SYSTEM_HEALTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SystemHealthOverrides) : {};
  } catch {
    return {};
  }
}

export function saveSystemHealthOverrides(overrides: SystemHealthOverrides): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SYSTEM_HEALTH_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    /* ignore */
  }
}

export function mergeSystemRecords(base: SystemHealthRecord[], overrides: SystemHealthOverrides): SystemHealthRecord[] {
  return base.map((r) => {
    const o = overrides[r.id];
    return o ? { ...r, ...o } : r;
  });
}

export function computeSystemSummaryCards(records: SystemHealthRecord[], alerts: SystemHealthAlert[]): SystemHealthSummaryCard[] {
  const online = records.filter((r) => r.status === "Healthy" || r.status === "Delayed").length;
  const degraded = records.filter((r) => r.status === "Degraded").length;
  const offline = records.filter((r) => r.status === "Offline").length;
  const failedSyncs = records.filter((r) => r.status !== "Healthy" && r.errorCount > 0).length;
  const activeAlerts = alerts.length;

  return [
    { id: "online", label: "Systems Online", value: String(online), filterKey: "online" },
    { id: "degraded", label: "Systems Degraded", value: String(degraded), filterKey: "degraded" },
    { id: "offline", label: "Systems Offline", value: String(offline), filterKey: "offline" },
    { id: "failed", label: "Failed Syncs", value: String(failedSyncs), filterKey: "failedSyncs" },
    { id: "alerts", label: "Active Alerts", value: String(activeAlerts), filterKey: "activeAlerts" },
    { id: "sync", label: "Last Full Sync", value: "9:48 AM", filterKey: "lastFullSync" },
  ];
}

export function applySummaryFilter(records: SystemHealthRecord[], filterKey: SystemHealthSummaryFilter): SystemHealthRecord[] {
  switch (filterKey) {
    case "online":
      return records.filter((r) => r.status === "Healthy" || r.status === "Delayed");
    case "degraded":
      return records.filter((r) => r.status === "Degraded");
    case "offline":
      return records.filter((r) => r.status === "Offline");
    case "failedSyncs":
      return records.filter((r) => r.errorCount > 0);
    default:
      return records;
  }
}

export function matchesSystemSearch(record: SystemHealthRecord, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [record.name, record.type, record.status, ...record.connectedModules].join(" ").toLowerCase().includes(q);
}

export function matchesLogFilters(entry: SystemErrorEntry, filters: SystemHealthFilters, search: string): boolean {
  if (filters.system !== "All Systems") {
    const sys = seedSystemHealthRecords.find((s) => s.name === filters.system);
    if (sys && entry.systemId !== sys.id) return false;
  }
  if (filters.severity !== "All Severities" && entry.severity !== filters.severity) return false;
  if (filters.module !== "All Modules" && entry.module !== filters.module) return false;
  if (filters.failureType !== "All Failure Types" && entry.failureType !== filters.failureType) return false;
  const q = search.trim().toLowerCase();
  if (q && !entry.message.toLowerCase().includes(q)) return false;
  return true;
}

export function getSystemErrors(systemId: string): SystemErrorEntry[] {
  return seedSystemErrors.filter((e) => e.systemId === systemId);
}

export function getSystemRetries(systemId: string): SystemRetryEntry[] {
  return seedSystemRetries.filter((r) => r.systemId === systemId);
}

export function getSystemById(id: string): SystemHealthRecord | undefined {
  return seedSystemHealthRecords.find((s) => s.id === id);
}
