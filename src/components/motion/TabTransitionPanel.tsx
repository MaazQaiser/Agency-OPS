"use client";

import type { ReactNode } from "react";

type TabTransitionPanelProps = {
  tabKey: string;
  children: ReactNode;
  className?: string;
};

export function TabTransitionPanel({ tabKey, children, className }: TabTransitionPanelProps) {
  return (
    <div key={tabKey} className={className ?? "motion-tab-panel"}>
      {children}
    </div>
  );
}
