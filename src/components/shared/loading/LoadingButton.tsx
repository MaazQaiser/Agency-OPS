"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingLabel?: string;
  icon?: ReactNode;
  variant?: "primary" | "default" | "action";
};

export function LoadingButton({
  loading = false,
  loadingLabel,
  children,
  disabled,
  className,
  icon,
  variant = "default",
  type = "button",
  ...rest
}: LoadingButtonProps) {
  const variantClass =
    variant === "primary"
      ? "va-ops-drawer-action-btn primary"
      : variant === "action"
        ? "va-ops-action-btn"
        : "va-ops-drawer-action-btn";

  return (
    <button
      type={type}
      className={cn(variantClass, loading && "ops-btn-loading", className)}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <>
          <AppIcon name="refresh" size={15} strokeWidth={2} className="ops-btn-spinner" aria-hidden="true" />
          {loadingLabel ?? children}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
