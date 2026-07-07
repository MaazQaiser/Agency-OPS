"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/login/actions";
import { AppIcon } from "@/components/ui/AppIcon";
import { vaOperationsRoles } from "@/data/vaOperations";
import { routes } from "@/lib/routes";
import { agencyRoles, getRoleLabel } from "@/data/rolePermissions";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useKeyboardShortcuts } from "@/components/keyboard/KeyboardShortcutsProvider";
import { useOwnerQuickActions } from "@/components/owner-quick-actions/OwnerQuickActionsProvider";
import { TeamAvatar } from "@/components/user-profile/TeamAvatar";
import { cn } from "@/lib/cn";

function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function vaOperationsRoleHref(roleId: string, view: string | null) {
  const params = new URLSearchParams();
  if (view && view !== "overview") params.set("view", view);
  if (roleId !== "owner") params.set("role", roleId);
  const query = params.toString();
  return query ? `${routes.vaOperations}?${query}` : routes.vaOperations;
}

type SidebarProfileMenuProps = {
  collapsed?: boolean;
  variant?: "sidebar" | "top";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SidebarProfileMenu({
  collapsed = false,
  variant = "sidebar",
  open: controlledOpen,
  onOpenChange,
}: SidebarProfileMenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isVaOperations = pathname === routes.vaOperations || pathname.startsWith(`${routes.vaOperations}/`);
  const activeVaView = searchParams.get("view") ?? "overview";
  const activeVaRole = searchParams.get("role") ?? "owner";
  const { openHelp } = useKeyboardShortcuts();
  const { toggle: toggleQuickActions } = useOwnerQuickActions();
  const { role, setRole, can } = usePermissions();
  const showSystemHealth = can("access:system-health");
  const [internalOpen, setInternalOpen] = useState(false);
  const profileOpen = controlledOpen ?? internalOpen;
  const setProfileOpen = onOpenChange ?? setInternalOpen;
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const isTop = variant === "top";

  useEffect(() => {
    if (!profileOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (profileMenuRef.current?.contains(event.target as Node)) return;
      setProfileOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  return (
    <div className={cn("sidebar-profile-menu", isTop && "sidebar-profile-menu--top")} ref={profileMenuRef}>
      <button
        type="button"
        className={cn(
          isTop ? "top-nav-action-btn top-nav-action-btn--profile" : "sidebar-footer-btn sidebar-footer-btn--profile",
          profileOpen && "open",
        )}
        aria-label="User profile menu"
        aria-expanded={profileOpen}
        aria-haspopup="menu"
        onClick={() => setProfileOpen(!profileOpen)}
        data-tooltip={!isTop && collapsed ? "Eva Chong" : undefined}
      >
        <TeamAvatar
          userId="eva-chong"
          name="Eva Chong"
          size="sm"
          className={isTop ? "top-nav-profile-avatar" : "sidebar-profile-avatar"}
          status="online"
          showTooltip={false}
        />
        {(!collapsed || isTop) && (
          <span className={isTop ? "top-nav-profile-meta" : "sidebar-profile-meta"}>
            <span className={isTop ? "top-nav-profile-name" : "sidebar-profile-name"}>Eva Chong</span>
            <span className={isTop ? "top-nav-profile-role" : "sidebar-profile-role"}>{getRoleLabel(role)}</span>
          </span>
        )}
        {(!collapsed || isTop) && (
          <AppIcon
            name="chevron-down"
            size={14}
            strokeWidth={2.25}
            className={isTop ? "top-nav-profile-chevron" : "sidebar-profile-chevron"}
          />
        )}
      </button>

      {profileOpen && (
        <div
          className={cn(
            "sidebar-profile-dropdown top-header-profile-dropdown",
            isTop && "sidebar-profile-dropdown--top",
            !isTop && collapsed && "sidebar-profile-dropdown--collapsed",
          )}
          role="menu"
        >
          <div className="top-header-profile-dropdown-header">
            <span className="top-header-profile-dropdown-name">Eva Chong</span>
            <span className="top-header-profile-dropdown-role">{getRoleLabel(role)} · Insurance Town</span>
          </div>
          <div className="top-header-profile-dropdown-section">
            <div className="top-header-profile-dropdown-section-label">Tools</div>
            {showSystemHealth && (
              <Link
                href={routes.systemHealth}
                className={cn(
                  "top-header-profile-dropdown-item",
                  isPathActive(pathname, routes.systemHealth) && "active",
                )}
                role="menuitem"
                onClick={() => setProfileOpen(false)}
              >
                <AppIcon name="refresh" size={15} strokeWidth={2.25} />
                System Health
              </Link>
            )}
            <button
              type="button"
              className="top-header-profile-dropdown-item top-header-profile-dropdown-item-with-kbd"
              role="menuitem"
              aria-label="Keyboard shortcuts. Press question mark"
              onClick={() => {
                setProfileOpen(false);
                openHelp();
              }}
            >
              <AppIcon name="clipboard" size={15} strokeWidth={2.25} />
              <span>Shortcuts</span>
              <kbd className="top-header-search-kbd top-header-profile-dropdown-kbd">?</kbd>
            </button>
            {can("action:owner-quick-actions") && (
              <button
                type="button"
                className="top-header-profile-dropdown-item top-header-profile-dropdown-item-with-kbd"
                role="menuitem"
                aria-label="Quick Actions. Shift+O"
                onClick={() => {
                  setProfileOpen(false);
                  toggleQuickActions();
                }}
              >
                <AppIcon name="rocket" size={15} strokeWidth={2.25} />
                <span>Quick Actions</span>
                <kbd className="top-header-search-kbd top-header-profile-dropdown-kbd">⇧O</kbd>
              </button>
            )}
            <button
              type="button"
              className="top-header-profile-dropdown-item"
              role="menuitem"
              aria-label="Switch language"
              onClick={() => setProfileOpen(false)}
            >
              <AppIcon name="globe" size={15} strokeWidth={2.25} />
              Language · EN
            </button>
          </div>
          <div className="top-header-profile-dropdown-section">
            <div className="top-header-profile-dropdown-section-label">Access Role</div>
            {agencyRoles.map((r) => (
              <button
                key={r.id}
                type="button"
                className={cn(
                  "top-header-profile-dropdown-item",
                  "top-header-profile-dropdown-role-item",
                  role === r.id && "active",
                )}
                role="menuitem"
                onClick={() => {
                  setRole(r.id);
                  setProfileOpen(false);
                }}
              >
                <AppIcon name="users" size={15} strokeWidth={2.25} />
                <span>
                  {r.label}
                  <span className="top-header-role-desc">{r.description}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="top-header-profile-dropdown-section">
            <div className="top-header-profile-dropdown-section-label">VA Role Views</div>
            {vaOperationsRoles.map((vaRole) => (
              <Link
                key={vaRole.id}
                href={vaOperationsRoleHref(vaRole.id, activeVaView)}
                className={cn(
                  "top-header-profile-dropdown-item",
                  "top-header-profile-dropdown-role-item",
                  isVaOperations && activeVaRole === vaRole.id && "active",
                )}
                role="menuitem"
                onClick={() => setProfileOpen(false)}
              >
                <AppIcon name="users" size={15} strokeWidth={2.25} />
                {vaRole.label}
              </Link>
            ))}
          </div>
          <button
            type="button"
            className="top-header-profile-dropdown-item"
            role="menuitem"
            onClick={() => setProfileOpen(false)}
          >
            <AppIcon name="settings" size={15} strokeWidth={2.25} />
            Profile Settings
          </button>
          <form action={logoutAction}>
            <button
              type="submit"
              className="top-header-profile-dropdown-item top-header-profile-dropdown-item-danger"
              role="menuitem"
            >
              <AppIcon name="log-out" size={15} strokeWidth={2.25} />
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
