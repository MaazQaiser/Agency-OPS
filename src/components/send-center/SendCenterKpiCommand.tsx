"use client";

import { cn } from "@/lib/cn";
import type { SendCenterTabId } from "@/data/sendCenter";

export type SendCenterKpiCommandItem = {
  id: string;
  label: string;
  value: string;
  sub: string;
  urgencyLabel: string;
  urgencyTone: "amber" | "red" | "green" | "blue";
  tab: SendCenterTabId;
  color: "yellow" | "red" | "green" | "primary";
};

type SendCenterKpiCommandProps = {
  items: readonly SendCenterKpiCommandItem[];
  activeTab: SendCenterTabId;
  onSelect: (tab: SendCenterTabId) => void;
};

const urgencyClass = {
  amber: "send-center-kpi-urgency--amber",
  red: "send-center-kpi-urgency--red",
  green: "send-center-kpi-urgency--green",
  blue: "send-center-kpi-urgency--blue",
} as const;

export function SendCenterKpiCommand({ items, activeTab, onSelect }: SendCenterKpiCommandProps) {
  return (
    <div className="send-center-kpi-command-grid">
      {items.map((item) => {
        const isActive = activeTab === item.tab;
        return (
          <button
            key={item.id}
            type="button"
            className={cn(
              "send-center-kpi-command",
              `send-center-kpi-command--${item.color}`,
              isActive && "active",
            )}
            onClick={() => onSelect(item.tab)}
            aria-pressed={isActive}
          >
            <span className="send-center-kpi-command-top">
              <span className="send-center-kpi-command-label">{item.label}</span>
              <span className={cn("send-center-kpi-urgency", urgencyClass[item.urgencyTone])}>
                {item.urgencyLabel}
              </span>
            </span>
            <span className="send-center-kpi-command-value">{item.value}</span>
            <span className="send-center-kpi-command-sub">{item.sub}</span>
          </button>
        );
      })}
    </div>
  );
}
