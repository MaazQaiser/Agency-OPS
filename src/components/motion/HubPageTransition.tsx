"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type HubPageTransitionProps = {
  children: ReactNode;
};

export function HubPageTransition({ children }: HubPageTransitionProps) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="motion-hub-page">
      {children}
    </div>
  );
}
