"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { AppIconName } from "@/components/ui/AppIcon";
import { useGlobalSearch } from "@/components/global-search/GlobalSearchProvider";
import { useEntitlements } from "@/hooks/useEntitlements";
import { HUB_THEMES } from "@/lib/hubThemes";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { MobileMoreSheet } from "./MobileMoreSheet";
import { sidebarAccentStyle } from "@/lib/sidebarNavigation";

type NavItem = {
  id: string;
  label: string;
  icon: AppIconName;
  href?: string;
  accent: string;
  onClick?: () => void;
  isActive?: (pathname: string, view: string | null) => boolean;
};

export function MobileBottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view");
  const { open: openCommandPalette } = useGlobalSearch();
  const { canAccessModule } = useEntitlements();
  const [moreOpen, setMoreOpen] = useState(false);
  const showCommercial = canAccessModule("commercial");

  const items: NavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: "home",
      accent: HUB_THEMES.vaOperations.navAccent,
      href: `${routes.vaOperations}?view=overview`,
      isActive: (p, view) =>
        (p === routes.vaOperations || p.startsWith(`${routes.vaOperations}/`) || p === routes.home || p === "/dashboard") &&
        (!view || view === "overview"),
    },
    ...(showCommercial
      ? [
          {
            id: "commercial",
            label: "Commercial",
            icon: "target" as AppIconName,
            accent: HUB_THEMES.commercial.navAccent,
            href: routes.commercialHub,
            isActive: (p: string) => p === routes.commercialHub || p.startsWith(`${routes.commercialHub}/`),
          },
        ]
      : []),
    {
      id: "va",
      label: "VA",
      icon: "users",
      accent: HUB_THEMES.vaOperations.navAccent,
      href: `${routes.vaOperations}?view=tasks`,
      isActive: (p, view) =>
        (p === routes.vaOperations || p.startsWith(`${routes.vaOperations}/`)) && Boolean(view && view !== "overview"),
    },
    {
      id: "search",
      label: "Search",
      icon: "search",
      accent: HUB_THEMES.globalSearch.navAccent,
      onClick: () => openCommandPalette(),
    },
    {
      id: "more",
      label: "More",
      icon: "more-horizontal",
      accent: "#1C2B35",
      onClick: () => setMoreOpen(true),
    },
  ];

  return (
    <>
      <nav className="mobile-bottom-nav" aria-label="Primary navigation">
        <div className="mobile-bottom-nav-inner">
          {items.map((item) => {
            const active = item.isActive?.(pathname, activeView) ?? false;
            const style = sidebarAccentStyle(item.accent);

            if (item.onClick) {
              return (
                <button
                  key={item.id}
                  type="button"
                  className={cn("mobile-bottom-nav-item", item.id === "more" && moreOpen && "active")}
                  style={style}
                  onClick={item.onClick}
                  aria-label={item.label}
                  aria-expanded={item.id === "more" ? moreOpen : undefined}
                >
                  <span className="mobile-bottom-nav-icon-wrap">
                    <AppIcon name={item.icon} size={22} strokeWidth={2} />
                  </span>
                  <span className="mobile-bottom-nav-label">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href!}
                className={cn("mobile-bottom-nav-item", active && "active")}
                style={style}
                aria-current={active ? "page" : undefined}
              >
                <span className="mobile-bottom-nav-icon-wrap">
                  <AppIcon name={item.icon} size={22} strokeWidth={2} />
                </span>
                <span className="mobile-bottom-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <MobileMoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
