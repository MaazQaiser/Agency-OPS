"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import { useAuditLog } from "@/components/audit-log/AuditLogProvider";
import { useGlobalSearch } from "@/components/global-search/GlobalSearchProvider";
import { useEntitlements } from "@/hooks/useEntitlements";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { canOpenFarmersEdgeIntel } from "@/lib/farmersEdgeAccess";
import {
  isSidebarNavActive,
  sidebarAccentStyle,
  sidebarNavItems,
  type SidebarNavItem,
} from "@/lib/sidebarNavigation";
import { cn } from "@/lib/cn";

type MobileMoreSheetProps = {
  open: boolean;
  onClose: () => void;
};

function MoreNavItem({
  item,
  active,
  onAuditOpen,
  onNavigate,
}: {
  item: SidebarNavItem;
  active: boolean;
  onAuditOpen: () => void;
  onNavigate: () => void;
}) {
  const className = cn(
    "mobile-more-item",
    `mobile-more-item--${item.accentClass}`,
    active && "mobile-more-item--active",
  );
  const style = sidebarAccentStyle(item.accent);

  const inner = (
    <>
      <span className="mobile-more-item-icon" aria-hidden="true">
        <AppIcon name={item.icon} size={18} strokeWidth={2.1} />
      </span>
      <span className="mobile-more-item-label">{item.label}</span>
      {item.badge != null && <span className="mobile-more-item-badge">{item.badge}</span>}
    </>
  );

  if (item.action === "audit-log") {
    return (
      <button type="button" className={className} style={style} onClick={() => { onAuditOpen(); onNavigate(); }}>
        {inner}
      </button>
    );
  }

  return (
    <Link
      href={item.href!}
      className={className}
      style={style}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
    >
      {inner}
    </Link>
  );
}

export function MobileMoreSheet({ open, onClose }: MobileMoreSheetProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { canAccessModule } = useEntitlements();
  const { role } = usePermissions();
  const { toggle: toggleAuditLog, canView: canViewAuditLog } = useAuditLog();
  const { open: openSearch } = useGlobalSearch();

  if (!open) return null;

  const visibleItems = sidebarNavItems.filter((item) => {
    if (item.ownerOnly && !canViewAuditLog) return false;
    if (item.key === "farmers-edge" && !canOpenFarmersEdgeIntel(role)) return false;
    if (item.module && !canAccessModule(item.module)) return false;
    return true;
  });

  return (
    <div className="mobile-more-root" role="presentation">
      <button type="button" className="mobile-more-backdrop" aria-label="Close menu" onClick={onClose} />
      <div className="mobile-more-sheet" role="dialog" aria-modal="true" aria-label="More navigation">
        <header className="mobile-more-header">
          <h2>More</h2>
          <button type="button" className="mobile-more-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </header>

        <div className="mobile-more-actions">
          <button
            type="button"
            className="mobile-more-search"
            onClick={() => {
              onClose();
              openSearch();
            }}
          >
            <AppIcon name="search" size={18} strokeWidth={2} />
            <span>Search & Command</span>
            <kbd>⌘K</kbd>
          </button>
        </div>

        <div className="mobile-more-grid">
          {visibleItems.map((item) => (
            <MoreNavItem
              key={item.key}
              item={item}
              active={isSidebarNavActive(pathname, searchParams, item)}
              onAuditOpen={toggleAuditLog}
              onNavigate={onClose}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
