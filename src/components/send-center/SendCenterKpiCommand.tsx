"use client";

import { cn } from "@/lib/cn";
import type { SendCenterTabId } from "@/data/sendCenter";
import { StatusPill } from "@/components/kpi/StatusPill";
import { kpiToneFromColor } from "@/lib/kpiTone";

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

export function SendCenterKpiCommand({ items, activeTab, onSelect }: SendCenterKpiCommandProps) {
  return (
    <div className="send-center-kpi-command-grid">
      {items.map((item, index) => {
        const isActive = activeTab === item.tab;
        return (
          <button
            key={item.id}
            type="button"
            className={cn(
              "send-center-kpi-command aos-kpi-card",
              `send-center-kpi-command--${item.color}`,
              `aos-kpi-card--${kpiToneFromColor(item.color)}`,
              isActive && "active",
              index < 2 ? "ih-kpi--primary" : "ih-kpi--secondary",
            )}
            onClick={() => onSelect(item.tab)}
            aria-pressed={isActive}
          >
            <span className="send-center-kpi-command-top">
              <span className="send-center-kpi-command-label">{item.label}</span>
              <StatusPill tone={kpiToneFromColor(item.urgencyTone)}>{item.urgencyLabel}</StatusPill>
            </span>
            <span className="send-center-kpi-command-value">{item.value}</span>
            <span className="send-center-kpi-command-sub">{item.sub}</span>
          </button>
        );
      })}
    </div>
  );
}
