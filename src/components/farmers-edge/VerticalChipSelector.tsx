"use client";

import type { VerticalMeta } from "@/hooks/useFarmersEdgeData";

type VerticalChipSelectorProps = {
  activeVertical: string;
  onSelect: (verticalId: string) => void;
  verticals?: VerticalMeta[];
};

export function VerticalChipSelector({ activeVertical, onSelect, verticals = [] }: VerticalChipSelectorProps) {
  return (
    <select
      className="header-filter-select fe-vertical-select"
      value={activeVertical}
      onChange={(e) => onSelect(e.target.value)}
      aria-label="Select commercial vertical"
    >
        {verticals.map((v) => (
          <option key={v.id} value={v.id}>
            {v.emoji ? `${v.emoji} ${v.label}` : v.label}
          </option>
        ))}
      </select>
  );
}
