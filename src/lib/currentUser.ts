import { roleHasPermission, type AgencyRole, type Permission } from "@/data/rolePermissions";

export type UserRole = AgencyRole;

export const currentUser = {
  id: "eva-chong",
  name: "Eva Chong",
  role: "owner" as UserRole,
  title: "Agency Owner",
};

const roleTitles: Record<AgencyRole, string> = {
  owner: "Agency Owner",
  producer: "Producer",
  va: "Virtual Assistant",
  finance: "Finance",
  "training-admin": "Training Admin",
  "operations-manager": "Operations Manager",
};

export function syncCurrentUserRole(role: AgencyRole): void {
  currentUser.role = role;
  currentUser.title = roleTitles[role] ?? role;
}

export function getActiveRole(): AgencyRole {
  return currentUser.role;
}

export function isAgencyOwner(): boolean {
  return getActiveRole() === "owner";
}

export function isAgencyAdmin(): boolean {
  return getActiveRole() === "operations-manager";
}

export function canAccessSystemHealth(): boolean {
  return roleHasPermission(getActiveRole(), "access:system-health");
}

export function hasPermission(permission: Permission): boolean {
  return roleHasPermission(getActiveRole(), permission);
}
