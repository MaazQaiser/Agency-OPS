"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { useAuditLog } from "@/components/audit-log/AuditLogProvider";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useEntitlements } from "@/hooks/useEntitlements";
import { canOpenFarmersEdgeIntel } from "@/lib/farmersEdgeAccess";
import { useSubscription } from "@/components/subscription/SubscriptionProvider";
import { routes } from "@/lib/routes";
import {
  isSidebarNavActive,
  sidebarAccentStyle,
  sidebarNavItems,
  type SidebarNavItem,
} from "@/lib/sidebarNavigation";
import { cn } from "@/lib/cn";
import { useSidebarNav } from "./SidebarNavProvider";

function SidebarNavLink({
  item,
  collapsed,
  active,
  onAuditOpen,
}: {
  item: SidebarNavItem;
  collapsed: boolean;
  active: boolean;
  onAuditOpen: () => void;
}) {
  const content = (
    <>
      <span className="sidebar-nav-icon-wrap" aria-hidden="true">
        <AppIcon name={item.icon} size={18} strokeWidth={2.1} />
      </span>
      {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
      {!collapsed && item.badge != null && (
        <span className="sidebar-nav-badge" aria-label={`${item.badge} pending`}>
          {item.badge}
        </span>
      )}
      {collapsed && item.badge != null && (
        <span className="sidebar-nav-badge sidebar-nav-badge--dot" aria-hidden="true" />
      )}
      <span className="sidebar-nav-active-bar" aria-hidden="true" />
    </>
  );

  const className = cn(
    "sidebar-nav-item",
    `sidebar-nav-item--${item.accentClass}`,
    active && "sidebar-nav-item--active",
    collapsed && "sidebar-nav-item--collapsed",
  );

  const style = sidebarAccentStyle(item.accent);

  if (item.action === "audit-log") {
    return (
      <button
        type="button"
        className={className}
        style={style}
        onClick={onAuditOpen}
        aria-label={item.label}
        data-tooltip={collapsed ? item.label : undefined}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={item.href!}
      className={className}
      style={style}
      aria-current={active ? "page" : undefined}
      data-tooltip={collapsed ? item.label : undefined}
    >
      {content}
    </Link>
  );
}

export function AgencySidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { collapsed, hydrated, toggleCollapsed } = useSidebarNav();
  const { tenant } = useSubscription();
  const { canAccessModule } = useEntitlements();
  const { role } = usePermissions();
  const { toggle: toggleAuditLog, canView: canViewAuditLog } = useAuditLog();

  const visibleItems = useMemo(
    () =>
      sidebarNavItems.filter((item) => {
        if (item.ownerOnly && !canViewAuditLog) return false;
        if (item.key === "farmers-edge" && !canOpenFarmersEdgeIntel(role)) return false;
        if (item.module && !canAccessModule(item.module)) return false;
        return true;
      }),
    [canAccessModule, canViewAuditLog, role],
  );

  return (
    <aside
      className={cn(
        "agency-sidebar",
        collapsed && "agency-sidebar--collapsed",
        !hydrated && "agency-sidebar--hydrating",
      )}
      aria-label="Agency OS navigation"
    >
      <div className="agency-sidebar-inner">
        <div className="agency-sidebar-top">
          <div className="agency-sidebar-brand-row">
            <Link href={routes.vaOperations} className="agency-sidebar-brand" aria-label="Agency OS home">
              <span className="agency-sidebar-brand-mark" aria-hidden="true">
                <img
                  src="/brand/agency-os-mark.png"
                  srcSet="/brand/agency-os-mark@2x.png 2x"
                  alt=""
                  width={32}
                  height={16}
                  className="agency-sidebar-brand-img"
                />
              </span>
              {!collapsed && (
                <span className="agency-sidebar-brand-text">
                  <span className="agency-sidebar-brand-title">Agency OS</span>
                </span>
              )}
            </Link>

            <button
              type="button"
              className="agency-sidebar-collapse-btn"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
            >
              <AppIcon
                name="chevron-down"
                size={16}
                strokeWidth={2.25}
                className={cn("agency-sidebar-collapse-icon", !collapsed && "agency-sidebar-collapse-icon--expanded")}
              />
            </button>
          </div>

          <button
            type="button"
            className="agency-sidebar-tenant"
            aria-label={`Workspace: ${tenant.name}. Multi-tenant selector coming soon.`}
            data-tooltip={collapsed ? tenant.name : undefined}
          >
            {!collapsed && (
              <>
                <span className="agency-sidebar-tenant-copy">
                  <span className="agency-sidebar-tenant-label">Workspace</span>
                  <span className="agency-sidebar-tenant-name">{tenant.name}</span>
                </span>
                <AppIcon name="chevron-down" size={14} strokeWidth={2.25} className="agency-sidebar-tenant-chevron" />
              </>
            )}
            {collapsed && <AppIcon name="globe" size={16} strokeWidth={2} aria-hidden="true" />}
          </button>
        </div>

        <nav className="agency-sidebar-nav" aria-label="Hub navigation">
          <ul className="agency-sidebar-nav-list">
            {visibleItems.map((item) => (
              <li key={item.key}>
                <SidebarNavLink
                  item={item}
                  collapsed={collapsed}
                  active={isSidebarNavActive(pathname, searchParams, item)}
                  onAuditOpen={toggleAuditLog}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
