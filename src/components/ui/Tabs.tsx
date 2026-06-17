"use client";

import { useState } from "react";

type Tab = { id: string; label: string };

type TabsProps = {
  tabs: Tab[];
  defaultTab: string;
  variant?: "default" | "retention" | "commercial";
  children: (activeTab: string) => React.ReactNode;
};

export function Tabs({ tabs, defaultTab, variant = "default", children }: TabsProps) {
  const [active, setActive] = useState(defaultTab);

  return (
    <>
      <div className={`tab-bar${variant === "commercial" ? " commercial" : ""}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${variant === "commercial" ? "tab-btn" : "tab"}${variant === "retention" ? " retention" : ""}${active === tab.id ? " active" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children(active)}
    </>
  );
}
