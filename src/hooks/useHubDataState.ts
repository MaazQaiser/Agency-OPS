"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  isDataStale,
  type DataStatus,
  type HubErrorInfo,
} from "@/lib/dataState";
import { hubErrorPresets, type HubErrorPresetId } from "@/data/hubStatePresets";
import { emitGlobalSync } from "@/lib/globalSync";

type UseHubDataStateOptions<T> = {
  load: () => T | Promise<T>;
  isEmpty?: (data: T) => boolean;
  delayMs?: number;
  staleAfterMs?: number;
  deps?: unknown[];
  errorPreset?: HubErrorPresetId;
  /** Demo: simulate failure on first load attempt */
  simulateError?: boolean;
};

type UseHubDataStateResult<T> = {
  status: DataStatus;
  data: T | null;
  error: HubErrorInfo | null;
  retry: () => void;
  lastSyncedAt: Date | null;
  isStale: boolean;
  retrying: boolean;
};

export function useHubDataState<T>({
  load,
  isEmpty = (data: T) => (Array.isArray(data) ? data.length === 0 : !data),
  delayMs = 420,
  staleAfterMs = 15 * 60 * 1000,
  deps = [],
  errorPreset = "generic-fetch",
  simulateError = false,
}: UseHubDataStateOptions<T>): UseHubDataStateResult<T> {
  const [status, setStatus] = useState<DataStatus>("loading");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<HubErrorInfo | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [retrying, setRetrying] = useState(false);
  const attemptRef = useRef(0);
  const mountedRef = useRef(true);
  const loadRef = useRef(load);
  const isEmptyRef = useRef(isEmpty);

  loadRef.current = load;
  isEmptyRef.current = isEmpty;

  const runLoad = useCallback(async () => {
    setStatus("loading");
    setError(null);
    emitGlobalSync({ phase: "syncing" });
    attemptRef.current += 1;
    const attempt = attemptRef.current;

    await new Promise((resolve) => window.setTimeout(resolve, delayMs));

    if (!mountedRef.current || attempt !== attemptRef.current) return;

    try {
      if (simulateError && attempt === 1) {
        throw new Error("simulated");
      }
      const result = await loadRef.current();
      if (!mountedRef.current || attempt !== attemptRef.current) return;

      setData(result);
      setLastSyncedAt(new Date());
      setStatus(isEmptyRef.current(result) ? "empty" : "success");
      setRetrying(false);
      emitGlobalSync({ phase: "synced", at: new Date().toISOString() });
    } catch {
      if (!mountedRef.current || attempt !== attemptRef.current) return;
      const preset = hubErrorPresets[errorPreset];
      setError({
        title: preset.title,
        message: preset.message,
        severity: preset.severity,
      });
      setStatus("error");
      setRetrying(false);
      emitGlobalSync({ phase: "error" });
    }
  }, [delayMs, errorPreset, simulateError]);

  useEffect(() => {
    mountedRef.current = true;
    void runLoad();
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runLoad, ...deps]);

  const retry = useCallback(() => {
    setRetrying(true);
    void runLoad();
  }, [runLoad]);

  const isStale = isDataStale(lastSyncedAt, staleAfterMs);

  return { status, data, error, retry, lastSyncedAt, isStale, retrying };
}

/** @deprecated Use useHubDataState for full state support */
export function useTabLoading(delayMs = 420) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);
  return loading;
}

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
