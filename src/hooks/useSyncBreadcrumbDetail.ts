"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type SyncBreadcrumbDetailOptions = {
  paramKey?: string;
  paramValue?: string;
  enabled?: boolean;
};

function buildParamUrl(pathname: string, paramKey: string, paramValue: string): string {
  const params = new URLSearchParams(window.location.search);
  params.delete("detail");
  params.set(paramKey, paramValue);
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

function buildClearedUrl(pathname: string, paramKey?: string): string {
  const params = new URLSearchParams(window.location.search);
  params.delete("detail");
  if (paramKey) params.delete(paramKey);
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

function currentPathWithSearch(pathname: string): string {
  return `${pathname}${window.location.search}`;
}

export function useSyncBreadcrumbDetail(
  detailLabel: string | null,
  options?: SyncBreadcrumbDetailOptions,
): void {
  const router = useRouter();
  const pathname = usePathname();
  const enabled = options?.enabled ?? true;
  const paramKey = options?.paramKey;
  const paramValue = options?.paramValue;
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !detailLabel || !paramKey || !paramValue) {
      if (!syncedRef.current) return;

      const cleared = buildClearedUrl(pathname, paramKey);
      if (currentPathWithSearch(pathname) !== cleared) {
        router.replace(cleared, { scroll: false });
      }
      syncedRef.current = false;
      return;
    }

    const next = buildParamUrl(pathname, paramKey, paramValue);
    if (currentPathWithSearch(pathname) === next) {
      syncedRef.current = true;
      return;
    }

    router.replace(next, { scroll: false });
    syncedRef.current = true;
  }, [detailLabel, enabled, paramKey, paramValue, pathname, router]);

  useEffect(() => {
    return () => {
      if (!syncedRef.current) return;
      const cleared = buildClearedUrl(pathname, paramKey);
      if (currentPathWithSearch(pathname) !== cleared) {
        router.replace(cleared, { scroll: false });
      }
      syncedRef.current = false;
    };
  }, [pathname, paramKey, router]);
}
