"use client";

import type { VerticalMeta } from "@/hooks/useFarmersEdgeData";

type VerticalChipSelectorProps = {
  activeVertical: string;
  onSelect: (verticalId: string) => void;
  verticals?: VerticalMeta[];
};

export function VerticalChipSelector({ activeVertical, onSelect, verticals = [] }: VerticalChipSelectorProps) {
  return (
    <div className="fe-vertical-hero" role="navigation" aria-label="Select commercial vertical">
      <div className="fe-vertical-hero-label">Select a commercial vertical to load all intelligence</div>
      <div className="fe-vertical-chips" role="list">
        {verticals.map((v) => (
          <button
            key={v.id}
            type="button"
            role="listitem"
            className={`fe-v-chip${v.id === "all" ? " fe-v-chip--all" : ""}${activeVertical === v.id ? " active" : ""}`}
            onClick={() => onSelect(v.id)}
            aria-pressed={activeVertical === v.id}
            aria-label={`${v.emoji ? v.emoji + " " : ""}${v.label}`}
          >
            {v.emoji && <span aria-hidden="true">{v.emoji}</span>}
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
