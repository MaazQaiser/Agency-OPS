"use client";

import { useEffect, useState } from "react";

/** Simulates initial tab mount delay — matches production data-fetch feel. */
export function useTabLoading(delayMs = 420) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  return loading;
}

/** Loading state while a drawer/modal is opening with new content. */
export function useDrawerLoading(active: unknown, delayMs = 380) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!active) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), delayMs);
    return () => window.clearTimeout(timer);
  }, [active, delayMs]);

  return loading;
}
