"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { AppIconName } from "@/components/ui/AppIcon";
import { useGlobalSearch } from "@/components/global-search/GlobalSearchProvider";
import { useEntitlements } from "@/hooks/useEntitlements";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { MobileMoreSheet } from "./MobileMoreSheet";

type NavItem = {
  id: string;
  label: string;
  icon: AppIconName;
  href?: string;
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
            href: routes.commercialHub,
            isActive: (p: string) => p === routes.commercialHub || p.startsWith(`${routes.commercialHub}/`),
          },
        ]
      : []),
    {
      id: "va",
      label: "VA",
      icon: "users",
      href: `${routes.vaOperations}?view=tasks`,
      isActive: (p, view) =>
        (p === routes.vaOperations || p.startsWith(`${routes.vaOperations}/`)) && Boolean(view && view !== "overview"),
    },
    {
      id: "search",
      label: "Search",
      icon: "search",
      onClick: () => openCommandPalette(),
    },
    {
      id: "more",
      label: "More",
      icon: "more-horizontal",
      onClick: () => setMoreOpen(true),
    },
  ];

  return (
    <>
      <nav className="mobile-bottom-nav" aria-label="Primary navigation">
        <div className="mobile-bottom-nav-inner">
          {items.map((item) => {
            const active = item.isActive?.(pathname, activeView) ?? false;

            if (item.onClick) {
              return (
                <button
                  key={item.id}
                  type="button"
                  className={cn("mobile-bottom-nav-item", item.id === "more" && moreOpen && "active")}
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
