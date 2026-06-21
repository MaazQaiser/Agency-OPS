"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ToastViewport } from "./ToastViewport";
import {
  TOAST_DURATIONS,
  type ToastAction,
  type ToastItem,
  type ToastOptions,
  type ToastType,
} from "./types";

type TimerMeta = {
  timeoutId: number;
  expiresAt: number;
};

type ToastContextValue = {
  toasts: ToastItem[];
  success: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  processing: (message: string, options?: ToastOptions) => string;
  show: (message: string, type?: ToastType, options?: ToastOptions) => string;
  update: (id: string, message: string, type: ToastType, options?: ToastOptions) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  run: <T>(
    processingMessage: string,
    task: () => T | Promise<T>,
    outcomes: {
      success: string | ((result: T) => string);
      error?: string | ((err: unknown) => string);
      errorAction?: ToastAction;
    },
  ) => Promise<T>;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function createId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, TimerMeta>>(new Map());
  const pausedRemainingRef = useRef<Map<string, number>>(new Map());

  const clearTimer = useCallback((id: string) => {
    const meta = timersRef.current.get(id);
    if (meta) {
      window.clearTimeout(meta.timeoutId);
      timersRef.current.delete(id);
    }
    pausedRemainingRef.current.delete(id);
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      clearTimer(id);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    },
    [clearTimer],
  );

  const dismissAll = useCallback(() => {
    timersRef.current.forEach((meta) => window.clearTimeout(meta.timeoutId));
    timersRef.current.clear();
    pausedRemainingRef.current.clear();
    setToasts([]);
  }, []);

  const scheduleDismiss = useCallback(
    (id: string, durationMs: number) => {
      clearTimer(id);
      if (durationMs <= 0) return;

      const expiresAt = Date.now() + durationMs;
      const timeoutId = window.setTimeout(() => dismiss(id), durationMs);
      timersRef.current.set(id, { timeoutId, expiresAt });
    },
    [clearTimer, dismiss],
  );

  const pushToast = useCallback(
    (message: string, type: ToastType, options?: ToastOptions): string => {
      const id = options?.id ?? createId();
      const duration = options?.duration ?? TOAST_DURATIONS[type];

      setToasts((prev) => {
        const without = options?.id ? prev.filter((t) => t.id !== id) : prev;
        return [...without, { id, message, type, action: options?.action, createdAt: Date.now() }];
      });

      scheduleDismiss(id, duration);
      return id;
    },
    [scheduleDismiss],
  );

  const show = useCallback(
    (message: string, type: ToastType = "info", options?: ToastOptions) =>
      pushToast(message, type, options),
    [pushToast],
  );

  const success = useCallback(
    (message: string, options?: ToastOptions) => pushToast(message, "success", options),
    [pushToast],
  );

  const warning = useCallback(
    (message: string, options?: ToastOptions) => pushToast(message, "warning", options),
    [pushToast],
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) => pushToast(message, "error", options),
    [pushToast],
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) => pushToast(message, "info", options),
    [pushToast],
  );

  const processing = useCallback(
    (message: string, options?: ToastOptions) => pushToast(message, "processing", options),
    [pushToast],
  );

  const update = useCallback(
    (id: string, message: string, type: ToastType, options?: ToastOptions) => {
      pushToast(message, type, { ...options, id });
    },
    [pushToast],
  );

  const pauseToast = useCallback(
    (id: string) => {
      const meta = timersRef.current.get(id);
      if (!meta) return;
      window.clearTimeout(meta.timeoutId);
      timersRef.current.delete(id);
      pausedRemainingRef.current.set(id, Math.max(0, meta.expiresAt - Date.now()));
    },
    [],
  );

  const resumeToast = useCallback(
    (id: string) => {
      const remaining = pausedRemainingRef.current.get(id);
      if (remaining == null) return;
      pausedRemainingRef.current.delete(id);
      scheduleDismiss(id, remaining);
    },
    [scheduleDismiss],
  );

  const run = useCallback(
    async <T,>(
      processingMessage: string,
      task: () => T | Promise<T>,
      outcomes: {
        success: string | ((result: T) => string);
        error?: string | ((err: unknown) => string);
        errorAction?: ToastAction;
      },
    ): Promise<T> => {
      const id = processing(processingMessage);
      try {
        const result = await task();
        const successMessage =
          typeof outcomes.success === "function" ? outcomes.success(result) : outcomes.success;
        update(id, successMessage, "success");
        return result;
      } catch (err) {
        const errorMessage =
          typeof outcomes.error === "function"
            ? outcomes.error(err)
            : outcomes.error ?? "Something went wrong — please try again";
        update(id, errorMessage, "error", { action: outcomes.errorAction });
        throw err;
      }
    },
    [processing, update],
  );

  const value = useMemo(
    () => ({
      toasts,
      success,
      warning,
      error,
      info,
      processing,
      show,
      update,
      dismiss,
      dismissAll,
      run,
    }),
    [toasts, success, warning, error, info, processing, show, update, dismiss, dismissAll, run],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport
        toasts={toasts}
        onDismiss={dismiss}
        onPause={pauseToast}
        onResume={resumeToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/** Maps legacy `(message, "success" | "error")` handlers to the global toast API. */
export function createLegacyToastHandler(toast: ToastContextValue) {
  return (message: string, variant: "success" | "error" | "warning" | "info" = "success") => {
    if (variant === "error") toast.error(message);
    else if (variant === "warning") toast.warning(message);
    else if (variant === "info") toast.info(message);
    else toast.success(message);
  };
}
