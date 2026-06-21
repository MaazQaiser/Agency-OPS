"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { clearHandoff, loadHandoff, type HandoffType } from "@/lib/crossModuleLinks";

export function useCrossModuleHandoff<T extends HandoffType>(
  expectedType: T,
  onHandoff: (payload: Record<string, string | undefined>, sourcePath: string) => void,
) {
  const searchParams = useSearchParams();
  const consumedRef = useRef(false);

  useEffect(() => {
    if (consumedRef.current) return;
    const handoffParam = searchParams.get("handoff");
    if (handoffParam && handoffParam !== expectedType) return;

    const handoff = loadHandoff(expectedType);
    if (!handoff) return;

    consumedRef.current = true;
    onHandoff(handoff.payload, handoff.sourcePath);
    clearHandoff();
  }, [expectedType, onHandoff, searchParams]);
}
