"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

type VaOpsDrawerRootProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Portals drawer overlays to document.body so they stack above the sticky
 * app header (which lives in a sibling branch of app-content).
 */
export function VaOpsDrawerRoot({ children, className }: VaOpsDrawerRootProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className={cn("va-ops-drawer-root", className)} role="presentation">
      {children}
    </div>,
    document.body,
  );
}
