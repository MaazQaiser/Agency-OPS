"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  appendAuditEntry,
  getRoleLabel,
  loadActiveRole,
  loadAuditLog,
  roleHasPermission,
  roleCanAccessModule,
  saveActiveRole,
  type AgencyRole,
  type Permission,
  type PermissionAuditEntry,
} from "@/data/rolePermissions";
import { syncCurrentUserRole } from "@/lib/currentUser";
import { toastMessages } from "@/lib/toastMessages";
import { useToast } from "@/hooks/useToast";
import { PermissionDeniedModal } from "./PermissionDeniedModal";

type PermissionContextValue = {
  role: AgencyRole;
  setRole: (role: AgencyRole) => void;
  can: (permission: Permission) => boolean;
  canAccessModule: (module: Parameters<typeof roleCanAccessModule>[1]) => boolean;
  requirePermission: (permission: Permission, onAllowed: () => void) => void;
  auditLog: PermissionAuditEntry[];
  logAudit: (type: PermissionAuditEntry["type"], description: string) => void;
  deniedPermission: Permission | null;
  closeDeniedModal: () => void;
  isOwner: boolean;
};

const PermissionContext = createContext<PermissionContextValue | null>(null);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [role, setRoleState] = useState<AgencyRole>(() =>
    typeof window !== "undefined" ? loadActiveRole() : "owner",
  );
  const [hydrated, setHydrated] = useState(false);
  const [auditLog, setAuditLog] = useState<PermissionAuditEntry[]>([]);
  const [deniedPermission, setDeniedPermission] = useState<Permission | null>(null);

  useEffect(() => {
    const stored = loadActiveRole();
    setRoleState(stored);
    syncCurrentUserRole(stored);
    setAuditLog(loadAuditLog());
    setHydrated(true);
  }, []);

  const setRole = useCallback(
    (next: AgencyRole) => {
      const prev = role;
      setRoleState(next);
      saveActiveRole(next);
      syncCurrentUserRole(next);
      const updated = appendAuditEntry(
        "role-switched",
        `Role switched from ${getRoleLabel(prev)} to ${getRoleLabel(next)}`,
        next,
      );
      setAuditLog(updated);
    },
    [role],
  );

  const can = useCallback((permission: Permission) => roleHasPermission(role, permission), [role]);

  const canAccessModule = useCallback(
    (module: Parameters<typeof roleCanAccessModule>[1]) => roleCanAccessModule(role, module),
    [role],
  );

  const logAudit = useCallback(
    (type: PermissionAuditEntry["type"], description: string) => {
      const updated = appendAuditEntry(type, description, role);
      setAuditLog(updated);
    },
    [role],
  );

  const requirePermission = useCallback(
    (permission: Permission, onAllowed: () => void) => {
      if (roleHasPermission(role, permission)) {
        onAllowed();
        return;
      }
      appendAuditEntry("restricted-action", `Attempted: ${permission}`, role);
      setAuditLog(loadAuditLog());
      toast.error(toastMessages.vaOps.permissionDenied);
      setDeniedPermission(permission);
    },
    [role, toast],
  );

  const closeDeniedModal = useCallback(() => setDeniedPermission(null), []);

  const value = useMemo<PermissionContextValue>(
    () => ({
      role,
      setRole,
      can,
      canAccessModule,
      requirePermission,
      auditLog,
      logAudit,
      deniedPermission,
      closeDeniedModal,
      isOwner: role === "owner",
    }),
    [role, setRole, can, canAccessModule, requirePermission, auditLog, logAudit, deniedPermission, closeDeniedModal],
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
      {hydrated && (
        <PermissionDeniedModal permission={deniedPermission} onClose={closeDeniedModal} />
      )}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const ctx = useContext(PermissionContext);
  if (!ctx) {
    return {
      role: "owner" as AgencyRole,
      setRole: () => {},
      can: () => true,
      canAccessModule: () => true,
      requirePermission: (_p: Permission, fn: () => void) => fn(),
      auditLog: [] as PermissionAuditEntry[],
      logAudit: () => {},
      deniedPermission: null,
      closeDeniedModal: () => {},
      isOwner: true,
    };
  }
  return ctx;
}
