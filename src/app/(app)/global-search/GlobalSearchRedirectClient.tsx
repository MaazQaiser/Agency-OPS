"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGlobalSearch } from "@/components/global-search/GlobalSearchProvider";
import { routes } from "@/lib/routes";

/** Legacy route — opens the universal overlay and returns to VA Operations without a dedicated page. */
export default function GlobalSearchRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { open } = useGlobalSearch();

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    open(q);
    router.replace(routes.vaOperations);
  }, [open, router, searchParams]);

  return null;
}
