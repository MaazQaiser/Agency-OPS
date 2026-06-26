"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/login/actions";
import { AppIcon } from "@/components/ui/AppIcon";
import { vaOperationsRoles } from "@/data/vaOperations";
import { navItems, routes } from "@/lib/routes";
import { agencyRoles, getRoleLabel } from "@/data/rolePermissions";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useKeyboardShortcuts } from "@/components/keyboard/KeyboardShortcutsProvider";
import { useOwnerQuickActions } from "@/components/owner-quick-actions/OwnerQuickActionsProvider";
import { ClickableAvatar } from "@/components/user-profile/UserProfileTrigger";
import { cn } from "@/lib/cn";
import { GlobalUtilityStrip } from "./GlobalUtilityStrip";

function isActive(pathname: string, href: string) {
  if (href === routes.vaOperations) {
    return (
      pathname === routes.vaOperations ||
      pathname.startsWith(`${routes.vaOperations}/`) ||
      pathname === routes.home ||
      pathname === "/dashboard"
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function vaOperationsRoleHref(roleId: string, view: string | null) {
  const params = new URLSearchParams();
  if (view && view !== "overview") params.set("view", view);
  if (roleId !== "owner") params.set("role", roleId);
  const query = params.toString();
  return query ? `${routes.vaOperations}?${query}` : routes.vaOperations;
}

export function TopHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isVaOperations = pathname === routes.vaOperations || pathname.startsWith(`${routes.vaOperations}/`);
  const activeVaView = searchParams.get("view") ?? "overview";
  const activeVaRole = searchParams.get("role") ?? "owner";
  const { openHelp } = useKeyboardShortcuts();
  const { toggle: toggleQuickActions } = useOwnerQuickActions();
  const { role, setRole, can } = usePermissions();
  const { canAccessModule } = useEntitlements();
  const showSystemHealth = can("access:system-health");
  const visibleNav = navItems.filter((item) => canAccessModule(item.key));
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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
    <header className="app-top-header">
      <div className="app-top-header-bar">
        <Link href={routes.vaOperations} className="top-header-brand" aria-label="Agency OPS home">
          <span className="top-header-brand-mark" aria-hidden="true">
            <img
              src="/brand/agency-os-mark.png"
              srcSet="/brand/agency-os-mark@2x.png 2x"
              alt=""
              width={32}
              height={16}
              className="top-header-brand-mark-img"
            />
          </span>
          <span className="top-header-brand-title" aria-hidden="true">
            gency OPS
          </span>
        </Link>

        <div className="top-header-right">
          <GlobalUtilityStrip />

          <div className="top-header-actions">
            <div className="top-header-profile-menu" ref={profileMenuRef}>
            <div className={cn("top-header-profile", profileOpen && "open")}>
              <ClickableAvatar
                userId="eva-chong"
                name="Eva Chong"
                size="md"
                className="top-header-avatar-btn"
                status="online"
              />
              <button
                type="button"
                className="top-header-profile-trigger"
                aria-label="User profile menu"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                onClick={() => setProfileOpen((open) => !open)}
              >
                <span className="top-header-user">
                  <span className="top-header-user-name">Eva Chong</span>
                  <span className="top-header-user-role">{getRoleLabel(role)}</span>
                </span>
                <AppIcon name="chevron-down" size={14} strokeWidth={2.25} className="top-header-profile-chevron" />
              </button>
            </div>

              {profileOpen && (
                <div className="top-header-profile-dropdown" role="menu">
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
                          isActive(pathname, routes.systemHealth) && "active",
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
                    {vaOperationsRoles.map((role) => (
                      <Link
                        key={role.id}
                        href={vaOperationsRoleHref(role.id, activeVaView)}
                        className={cn(
                          "top-header-profile-dropdown-item",
                          "top-header-profile-dropdown-role-item",
                          isVaOperations && activeVaRole === role.id && "active",
                        )}
                        role="menuitem"
                        onClick={() => setProfileOpen(false)}
                      >
                        <AppIcon name="users" size={15} strokeWidth={2.25} />
                        {role.label}
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
          </div>
        </div>
      </div>

      <nav className="top-header-nav" aria-label="Main navigation">
        {visibleNav.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`top-header-nav-link${isActive(pathname, item.href) ? " active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
