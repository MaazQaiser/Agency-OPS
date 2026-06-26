"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import type { AppIconName } from "@/components/ui/AppIcon";
import { useGlobalSearch } from "@/components/global-search/GlobalSearchProvider";
import { useNotificationCenter } from "@/components/notifications/NotificationCenterProvider";
import { useOwnerQuickActions } from "@/components/owner-quick-actions/OwnerQuickActionsProvider";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useEntitlements } from "@/hooks/useEntitlements";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

type NavItem = {
  id: string;
  label: string;
  icon: AppIconName;
  href?: string;
  onClick?: () => void;
  isActive?: (pathname: string) => boolean;
  badge?: number;
  pulse?: boolean;
};

export function MobileBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") ?? "overview";
  const { open: openCommandPalette } = useGlobalSearch();
  const { toggle: toggleNotifications, unreadCount, hasUrgentPulse } = useNotificationCenter();
  const { toggle: toggleQuickActions } = useOwnerQuickActions();
  const { can } = usePermissions();
  const { canAccessModule } = useEntitlements();
  const isOwner = can("action:owner-quick-actions");
  const showSendCenter = canAccessModule("send-center");
  const showCommercial = canAccessModule("commercial");

  const items: NavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: "home",
      href: routes.vaOperations,
      isActive: (p) =>
        p === routes.vaOperations ||
        p.startsWith(`${routes.vaOperations}/`) ||
        p === routes.home ||
        p === "/dashboard",
    },
    ...(showCommercial
      ? [
          {
            id: "commercial",
            label: "Commercial",
            icon: "target" as AppIconName,
            href: routes.commercialHub,
            isActive: (p: string) => p === routes.commercialHub || p.startsWith(`${routes.commercialHub}/`),
          },
        ]
      : []),
    ...(isOwner
      ? [
          {
            id: "quick-actions",
            label: "Actions",
            icon: "rocket" as AppIconName,
            onClick: toggleQuickActions,
          },
        ]
      : []),
    ...(showSendCenter
      ? [
          {
            id: "send-center",
            label: "Send",
            icon: "send" as AppIconName,
            href: routes.sendCenter,
            isActive: (p: string) => p === routes.sendCenter || p.startsWith(`${routes.sendCenter}/`),
          },
        ]
      : []),
    {
      id: "tasks",
      label: "Tasks",
      icon: "clipboard",
      href: `${routes.vaOperations}?view=tasks`,
      isActive: (p) =>
        (p === routes.vaOperations || p.startsWith(`${routes.vaOperations}/`)) && activeView === "tasks",
    },
    {
      id: "command",
      label: "Command",
      icon: "search",
      onClick: () => openCommandPalette(),
    },
    {
      id: "notifications",
      label: "Alerts",
      icon: "bell",
      onClick: toggleNotifications,
      badge: unreadCount,
      pulse: hasUrgentPulse,
    },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Primary navigation">
      <div className="mobile-bottom-nav-inner">
        {items.map((item) => {
          const active = item.isActive?.(pathname) ?? false;

          const content = (
            <>
              <span className={cn("mobile-bottom-nav-icon-wrap", item.pulse && "mobile-bottom-nav-icon-wrap--pulse")}>
                <AppIcon name={item.icon} size={22} strokeWidth={2} />
                {item.badge != null && item.badge > 0 && (
                  <span className="mobile-bottom-nav-badge">{item.badge > 99 ? "99+" : item.badge}</span>
                )}
              </span>
              <span className="mobile-bottom-nav-label">{item.label}</span>
            </>
          );

          if (item.id === "quick-actions") {
            return (
              <button
                key={item.id}
                type="button"
                className="mobile-bottom-nav-item mobile-bottom-nav-item--center"
                onClick={item.onClick}
                aria-label="Quick Actions"
              >
                <span className="mobile-bottom-nav-center-btn" aria-hidden="true">
                  <AppIcon name="rocket" size={24} strokeWidth={2.25} />
                </span>
                <span className="mobile-bottom-nav-label">{item.label}</span>
              </button>
            );
          }

          if (item.onClick) {
            return (
              <button
                key={item.id}
                type="button"
                className={cn("mobile-bottom-nav-item", active && "active")}
                onClick={item.onClick}
                aria-label={item.label}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href!}
              className={cn("mobile-bottom-nav-item", active && "active")}
              aria-current={active ? "page" : undefined}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
