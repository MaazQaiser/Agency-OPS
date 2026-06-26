import type { AppModule } from "@/lib/routes";
import { commercialHubTabs } from "@/data/commercialHub";
import { sendCenterTabs } from "@/data/sendCenter";
import { epayPolicyTabs } from "@/data/epayPolicy";
import { vaOperationsTabs } from "@/data/vaOperations";

export type AgencyRole =
  | "owner"
  | "producer"
  | "va"
  | "finance"
  | "training-admin"
  | "operations-manager";

export type Permission =
  | "access:va-operations"
  | "access:commercial-hub"
  | "access:farmers-edge"
  | "access:intake-forms"
  | "access:training-hub"
  | "access:carrier-library"
  | "access:epay-policy"
  | "access:send-center"
  | "access:global-search"
  | "access:analytics"
  | "access:system-health"
  | "action:approve-proposals"
  | "action:approve-drafts"
  | "action:send-proposals"
  | "action:bind-policy"
  | "action:reconcile-trust"
  | "action:clear-dnc"
  | "action:approve-dnc-override"
  | "action:view-system-health"
  | "action:retry-systems"
  | "action:force-stage"
  | "action:override-owner"
  | "action:assign-tasks"
  | "action:release-funds"
  | "action:upload-training"
  | "action:assign-training"
  | "action:manage-training"
  | "action:create-invoices"
  | "action:export-ledger"
  | "action:reassign-tasks"
  | "action:escalate-queues"
  | "action:manage-workloads"
  | "action:owner-quick-actions"
  | "action:review-quotes"
  | "action:add-notes"
  | "action:request-revisions"
  | "action:create-drafts"
  | "action:upload-docs"
  | "action:follow-up"
  | "action:update-submissions";

export type AuditEventType =
  | "role-switched"
  | "override-used"
  | "restricted-action"
  | "approval-made"
  | "dnc-cleared";

export type PermissionAuditEntry = {
  id: string;
  type: AuditEventType;
  description: string;
  role: AgencyRole;
  actor: string;
  timestamp: string;
  timestampMs: number;
};

export const agencyRoles: { id: AgencyRole; label: string; description: string }[] = [
  { id: "owner", label: "Owner", description: "Full system access" },
  { id: "producer", label: "Producer", description: "Commercial & Send Center" },
  { id: "va", label: "VA", description: "Operations & intake" },
  { id: "finance", label: "Finance", description: "ePayPolicy only" },
  { id: "training-admin", label: "Training Admin", description: "Training Hub admin" },
  { id: "operations-manager", label: "Operations Manager", description: "Team & queue management" },
];

export const ROLE_STORAGE_KEY = "agency-ops-active-role";
export const AUDIT_STORAGE_KEY = "agency-ops-permission-audit";

const modulePermissionMap: Record<AppModule | "system-health", Permission> = {
  "va-operations": "access:va-operations",
  commercial: "access:commercial-hub",
  "farmers-edge": "access:farmers-edge",
  "intake-forms": "access:intake-forms",
  "training-hub": "access:training-hub",
  "carrier-library": "access:carrier-library",
  "epay-policy": "access:epay-policy",
  "send-center": "access:send-center",
  "global-search": "access:global-search",
  analytics: "access:analytics",
  producer: "access:commercial-hub",
  retention: "access:commercial-hub",
  "prime-agency": "access:commercial-hub",
  "system-health": "access:system-health",
};

const rolePermissions: Record<AgencyRole, Permission[]> = {
  owner: [],
  producer: [
    "access:commercial-hub",
    "access:farmers-edge",
    "access:send-center",
    "access:carrier-library",
    "access:intake-forms",
    "access:global-search",
    "access:analytics",
    "action:review-quotes",
    "action:approve-drafts",
    "action:send-proposals",
    "action:add-notes",
    "action:request-revisions",
    "action:approve-proposals",
    "action:create-drafts",
    "action:follow-up",
    "action:update-submissions",
  ],
  va: [
    "access:va-operations",
    "access:intake-forms",
    "access:training-hub",
    "access:commercial-hub",
    "access:farmers-edge",
    "access:send-center",
    "access:global-search",
    "action:create-drafts",
    "action:upload-docs",
    "action:follow-up",
    "action:update-submissions",
    "action:add-notes",
  ],
  finance: [
    "access:epay-policy",
    "access:analytics",
    "action:create-invoices",
    "action:reconcile-trust",
    "action:export-ledger",
  ],
  "training-admin": [
    "access:training-hub",
    "action:upload-training",
    "action:assign-training",
    "action:manage-training",
  ],
  "operations-manager": [
    "access:va-operations",
    "access:commercial-hub",
    "access:farmers-edge",
    "access:send-center",
    "access:global-search",
    "access:analytics",
    "action:reassign-tasks",
    "action:escalate-queues",
    "action:manage-workloads",
    "action:assign-tasks",
    "action:follow-up",
    "action:update-submissions",
    "action:review-quotes",
    "action:add-notes",
  ],
};

const vaCommercialHubTabs = new Set([
  "submissions",
  "checklist",
  "missing-docs",
  "follow-ups",
  "outreach",
]);

export function roleHasPermission(role: AgencyRole, permission: Permission): boolean {
  if (role === "owner") return true;
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function roleCanAccessModule(role: AgencyRole, module: AppModule | "system-health"): boolean {
  const perm = modulePermissionMap[module];
  if (!perm) return role === "owner";
  return roleHasPermission(role, perm);
}

export function getVisibleNavModules(role: AgencyRole): (AppModule | "system-health")[] {
  const modules: (AppModule | "system-health")[] = [
    "va-operations",
    "commercial",
    "intake-forms",
    "training-hub",
    "carrier-library",
    "epay-policy",
    "send-center",
    "global-search",
  ];
  return modules.filter((m) => roleCanAccessModule(role, m));
}

export function getVisibleCommercialHubTabs(role: AgencyRole) {
  if (role === "owner" || role === "producer" || role === "operations-manager") {
    return [...commercialHubTabs];
  }
  if (role === "va") {
    return commercialHubTabs.filter((t) => vaCommercialHubTabs.has(t.id));
  }
  return [];
}

export function getVisibleSendCenterTabs(role: AgencyRole) {
  if (role === "owner" || role === "producer" || role === "operations-manager") {
    return [...sendCenterTabs];
  }
  if (role === "va") {
    return sendCenterTabs.filter((t) => t.id === "draft-queue");
  }
  return [];
}

export function getVisibleEpayTabs(role: AgencyRole) {
  if (role === "owner" || role === "finance") return [...epayPolicyTabs];
  return [];
}

export function getVisibleVaOpsTabs(role: AgencyRole) {
  if (role === "owner" || role === "operations-manager") return [...vaOperationsTabs];
  if (role === "va") return vaOperationsTabs.filter((t) => t.id !== "automations");
  return [];
}

export function getRoleLabel(role: AgencyRole): string {
  return agencyRoles.find((r) => r.id === role)?.label ?? role;
}

export function loadActiveRole(): AgencyRole {
  if (typeof window === "undefined") return "owner";
  try {
    const raw = localStorage.getItem(ROLE_STORAGE_KEY);
    if (raw && agencyRoles.some((r) => r.id === raw)) return raw as AgencyRole;
  } catch {
    /* ignore */
  }
  return "owner";
}

export function saveActiveRole(role: AgencyRole): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  } catch {
    /* ignore */
  }
}

export function loadAuditLog(): PermissionAuditEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PermissionAuditEntry[]) : [];
  } catch {
    return [];
  }
}

export function appendAuditEntry(
  type: AuditEventType,
  description: string,
  role: AgencyRole,
  actor = "Eva Chong",
): PermissionAuditEntry[] {
  const entry: PermissionAuditEntry = {
    id: `audit-${Date.now()}`,
    type,
    description,
    role,
    actor,
    timestamp: new Date().toLocaleString(),
    timestampMs: Date.now(),
  };
  const next = [entry, ...loadAuditLog()].slice(0, 100);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }
  return next;
}

export function pathnameToModule(pathname: string): AppModule | "system-health" | null {
  if (pathname.startsWith("/commercial-hub")) return "commercial";
  if (pathname.startsWith("/va-operations")) return "va-operations";
  if (pathname.startsWith("/intake-forms")) return "intake-forms";
  if (pathname.startsWith("/training-hub")) return "training-hub";
  if (pathname.startsWith("/carrier-library")) return "carrier-library";
  if (pathname.startsWith("/epay-policy")) return "epay-policy";
  if (pathname.startsWith("/send-center")) return "send-center";
  if (pathname.startsWith("/global-search")) return "global-search";
  if (pathname.startsWith("/retention")) return "retention";
  if (pathname.startsWith("/producer") || pathname.startsWith("/production")) return "producer";
  if (pathname.startsWith("/prime-agency")) return "prime-agency";
  if (pathname.startsWith("/system-health")) return "system-health";
  if (pathname === "/dashboard" || pathname === "/") return "va-operations";
  return null;
}

export const permissionLabels: Partial<Record<Permission, string>> = {
  "action:approve-proposals": "Approve proposals",
  "action:approve-drafts": "Approve drafts",
  "action:bind-policy": "Bind policy",
  "action:reconcile-trust": "Reconcile trust",
  "action:clear-dnc": "Clear DNC",
  "action:view-system-health": "View system health",
  "action:retry-systems": "Retry systems",
  "action:force-stage": "Force stage movement",
  "action:override-owner": "Override owner actions",
  "action:release-funds": "Release funds",
  "action:owner-quick-actions": "Owner quick actions",
};

export const commercialHubQuickActionPermissions: Record<string, Permission> = {
  "new-submission": "action:update-submissions",
  "add-market": "action:review-quotes",
  "export-pipeline": "action:review-quotes",
};

export const epayQuickActionPermissions: Record<string, Permission> = {
  "new-invoice": "action:create-invoices",
  export: "action:export-ledger",
  reconcile: "action:reconcile-trust",
};

export const trainingHubQuickActionPermissions: Record<string, Permission> = {
  upload: "action:upload-training",
  "add-resource": "action:manage-training",
  "manage-tags": "action:manage-training",
};

export function filterQuickActions<T extends { id: string }>(
  actions: readonly T[],
  permissionMap: Record<string, Permission>,
  can: (permission: Permission) => boolean,
): T[] {
  return actions.filter((action) => {
    const perm = permissionMap[action.id];
    return !perm || can(perm);
  });
}
