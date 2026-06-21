"use client";

import { useCallback, useState } from "react";

type AsyncActionOptions = {
  minDurationMs?: number;
};

/**
 * Wraps async/sync handlers with inline loading state for buttons.
 * Keeps buttons disabled while the action runs.
 */
export function useAsyncAction<T extends unknown[]>(
  handler: (...args: T) => void | Promise<void>,
  options: AsyncActionOptions = {},
) {
  const { minDurationMs = 320 } = options;
  const [loading, setLoading] = useState(false);

  const run = useCallback(
    async (...args: T) => {
      if (loading) return;
      setLoading(true);
      const started = Date.now();
      try {
        await handler(...args);
      } finally {
        const elapsed = Date.now() - started;
        const remaining = Math.max(0, minDurationMs - elapsed);
        window.setTimeout(() => setLoading(false), remaining);
      }
    },
    [handler, loading, minDurationMs],
  );

  return { run, loading, disabled: loading };
}
