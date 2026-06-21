"use client";

import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import { restoreScrollPosition, saveScrollPosition } from "@/lib/navigationMemory";
import type { BreadcrumbItem } from "@/lib/breadcrumbs";

type BreadcrumbNavProps = {
  items: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
  className?: string;
};

export function BreadcrumbNav({ items, backHref, backLabel, className }: BreadcrumbNavProps) {
  const router = useRouter();

  if (items.length === 0) return null;

  const navigate = (href: string) => {
    if (typeof window !== "undefined") {
      saveScrollPosition(window.location.pathname + window.location.search);
    }
    router.push(href, { scroll: false });
    restoreScrollPosition(href);
  };

  return (
    <div className={className ? `ops-breadcrumb-bar ${className}` : "ops-breadcrumb-bar"}>
      {backHref && backLabel && (
        <button
          type="button"
          className="training-detail-back ops-breadcrumb-back"
          onClick={() => navigate(backHref)}
        >
          <AppIcon name="chevron-down" size={16} strokeWidth={2.5} className="training-back-icon" />
          {backLabel}
        </button>
      )}

      <nav className="training-detail-breadcrumb ops-breadcrumb-nav" aria-label="Breadcrumb">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={`${item.label}-${index}`} className="ops-breadcrumb-segment">
              {index > 0 && (
                <span className="training-detail-breadcrumb-sep" aria-hidden="true">
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <button
                  type="button"
                  className="training-detail-breadcrumb-link"
                  onClick={() => navigate(item.href!)}
                >
                  {item.label}
                </button>
              ) : (
                <span
                  className={isLast ? "training-detail-breadcrumb-current" : "training-detail-breadcrumb-link"}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
