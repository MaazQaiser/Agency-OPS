"use client";

import { cn } from "@/lib/cn";
import { analyticsTimeFilters, type AnalyticsTimeFilterId } from "@/data/analytics";

type AnalyticsTimeFilterProps = {
  value: AnalyticsTimeFilterId;
  onChange: (id: AnalyticsTimeFilterId) => void;
};

export function AnalyticsTimeFilter({ value, onChange }: AnalyticsTimeFilterProps) {
  return (
    <div className="analytics-time-filter" role="group" aria-label="Time period filter">
      {analyticsTimeFilters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={cn("analytics-time-filter-btn", value === filter.id && "active")}
          onClick={() => onChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
