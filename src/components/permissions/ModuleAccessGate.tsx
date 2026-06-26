"use client";

import { usePathname } from "next/navigation";
import { ModuleUnavailable } from "@/components/subscription/ModuleUnavailable";
import { useEntitlements } from "@/hooks/useEntitlements";
import { pathnameToAccessTarget } from "@/lib/subscriptionAccess";
import { usePermissions } from "./PermissionProvider";

type ModuleAccessGateProps = {
  children: React.ReactNode;
};

export function ModuleAccessGate({ children }: ModuleAccessGateProps) {
  const pathname = usePathname();
  const { canAccessModule: roleCanAccessModule } = usePermissions();
  const { canAccessModule, canAccessPath } = useEntitlements();
  const target = pathnameToAccessTarget(pathname);

  if (target && !roleCanAccessModule(target)) {
    return (
      <div className="permission-denied-page">
        <div className="permission-denied-icon" aria-hidden="true">
          <span className="permission-denied-shield">🛡</span>
        </div>
        <h1 className="permission-denied-page-title">Permission Required</h1>
        <p className="permission-denied-page-desc">
          Your current role does not have access to this module.
        </p>
        <p className="permission-denied-hint">Contact the agency owner to request access.</p>
      </div>
    );
  }

  if (target && !canAccessModule(target)) {
    return <ModuleUnavailable />;
  }

  if (!target && !canAccessPath(pathname)) {
    return <ModuleUnavailable />;
  }

  return <>{children}</>;
}
