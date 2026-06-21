"use client";

import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { useTabLoading } from "@/hooks/useTabLoading";
import { TableSkeleton } from "@/components/shared/loading";
import {
  defaultSendCenterFilters,
  sendCenterFilterOptions,
  type SendCenterFilterState,
} from "@/data/sendCenter";

const filterLabels: Record<keyof SendCenterFilterState, string> = {
  priority: "Priority",
  producer: "Producer",
  policyType: "Policy Type",
  status: "Status",
};

type SendCenterFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
  filters: SendCenterFilterState;
  onFilterChange: (key: keyof SendCenterFilterState, value: string) => void;
  filterKeys?: (keyof SendCenterFilterState)[];
};

export function SendCenterFilters({
  search,
  onSearchChange,
  placeholder,
  filters,
  onFilterChange,
  filterKeys = ["priority", "producer", "policyType", "status"],
}: SendCenterFiltersProps) {
  return (
    <div className="send-center-filters">
      <label className="va-ops-search send-center-search" aria-label="Search">
        <AppIcon name="search" size={16} strokeWidth={2} className="va-ops-search-icon" />
        <input
          type="search"
          className="va-ops-search-input"
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>
      <div className="send-center-filter-row">
        {filterKeys.length > 0 &&
          filterKeys.map((key) => (
          <label key={key} className="send-center-filter">
            <span className="send-center-filter-label">{filterLabels[key]}</span>
            <select
              className="header-filter-select send-center-select"
              value={filters[key]}
              onChange={(e) => onFilterChange(key, e.target.value)}
            >
              {sendCenterFilterOptions[key].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          ))}
      </div>
    </div>
  );
}

export function useSendCenterFilters() {
  return useState(defaultSendCenterFilters);
}

export { useTabLoading } from "@/hooks/useTabLoading";

export function SendCenterTableSkeleton({ rows = 4 }: { rows?: number }) {
  return <TableSkeleton rows={rows} />;
}

export function SendCenterEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="commercial-hub-empty-state" role="status">
      <div className="commercial-hub-empty-state-title">{title}</div>
      <p className="commercial-hub-empty-state-desc">{description}</p>
    </div>
  );
}
