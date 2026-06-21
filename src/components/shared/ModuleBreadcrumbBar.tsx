"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { getReturnBackTarget, resolveBreadcrumbs } from "@/lib/breadcrumbs";
import { BreadcrumbNav } from "./BreadcrumbNav";

type ModuleBreadcrumbBarProps = {
  proposalId?: string;
  notificationType?: string;
  notificationEntity?: string;
  className?: string;
};

export function ModuleBreadcrumbBar({
  proposalId,
  notificationType,
  notificationEntity,
  className,
}: ModuleBreadcrumbBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const items = useMemo(
    () =>
      resolveBreadcrumbs(pathname, searchParams, {
        proposalId,
        notificationType,
        notificationEntity,
      }),
    [pathname, searchParams, proposalId, notificationType, notificationEntity],
  );

  const returnTarget = useMemo(() => getReturnBackTarget(searchParams), [searchParams]);

  const backHref = returnTarget?.href;
  const backLabel = returnTarget ? `Back to ${returnTarget.label}` : undefined;

  if (items.length === 0 && !backHref) return null;

  return (
    <BreadcrumbNav
      items={items}
      backHref={backHref}
      backLabel={backLabel}
      className={className}
    />
  );
}
