"use client";

import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";
import type { VerticalMeta } from "@/hooks/useFarmersEdgeData";

type VerticalChipSelectorProps = {
  activeVertical: string;
  onSelect: (verticalId: string) => void;
  verticals?: VerticalMeta[];
};

const verticalIcons: Record<string, AppIconName> = {
  all: "layout-grid",
  landscapers: "leaf",
  contractors: "hammer",
  restaurants: "utensils",
  cleaning: "sparkles",
  trucking: "truck",
  beauty: "scissors",
};

export function VerticalChipSelector({ activeVertical, onSelect, verticals = [] }: VerticalChipSelectorProps) {
  return (
    <div className="fe-vertical-chips" role="tablist" aria-label="Commercial vertical">
      {verticals.map((vertical) => {
        const selected = vertical.id === activeVertical;
        return (
          <button
            key={vertical.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`fe-v-chip${selected ? " is-active" : ""}`}
            onClick={() => onSelect(vertical.id)}
          >
            <AppIcon name={verticalIcons[vertical.id] ?? "target"} size={15} strokeWidth={1.75} />
            <span>{vertical.label}</span>
          </button>
        );
      })}
    </div>
  );
}
