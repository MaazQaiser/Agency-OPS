"use client";

import type { Permission } from "@/data/rolePermissions";
import { usePermissions } from "./PermissionProvider";

type IfCanProps = {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function IfCan({ permission, children, fallback = null }: IfCanProps) {
  const { can } = usePermissions();
  return can(permission) ? <>{children}</> : <>{fallback}</>;
}

type GuardedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  permission: Permission;
  onAllowedClick?: () => void;
};

export function GuardedButton({ permission, onAllowedClick, onClick, children, ...props }: GuardedButtonProps) {
  const { requirePermission } = usePermissions();

  return (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        requirePermission(permission, () => {
          onAllowedClick?.();
          onClick?.(e);
        });
      }}
    >
      {children}
    </button>
  );
}
