import type { AppIconName } from "@/components/ui/AppIcon";

export type ToastType = "success" | "warning" | "error" | "info" | "processing";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  action?: ToastAction;
  createdAt: number;
};

export type ToastOptions = {
  duration?: number;
  action?: ToastAction;
  id?: string;
};

export type ToastInput = {
  message: string;
  type?: ToastType;
  duration?: number;
  action?: ToastAction;
};

export const TOAST_DURATIONS: Record<ToastType, number> = {
  success: 4500,
  warning: 5000,
  error: 6000,
  info: 4500,
  processing: 0,
};

export const TOAST_ICONS: Record<ToastType, AppIconName> = {
  success: "check",
  warning: "triangle-alert",
  error: "x",
  info: "sparkles",
  processing: "refresh",
};
