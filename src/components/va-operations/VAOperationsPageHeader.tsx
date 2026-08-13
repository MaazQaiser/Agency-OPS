"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { HubHelpTrigger } from "@/components/help/HubHelpTrigger";
import { vaOperationsHeader } from "@/data/vaOperations";
import { OwnerOverviewHero } from "./OwnerOverviewHero";

type VAOperationsPageHeaderProps = {
  variant?: "default" | "owner-overview";
};

export function VAOperationsPageHeader({ variant = "default" }: VAOperationsPageHeaderProps) {
  if (variant === "owner-overview") {
    return <OwnerOverviewHero />;
  }

  return (
    <header className="va-ops-page-header">
      <div className="va-ops-page-header-left">
        <div className="va-ops-page-title-block">
          <h1 className="va-ops-page-title">{vaOperationsHeader.title}</h1>
          <p className="va-ops-page-subtitle">{vaOperationsHeader.subtitle}</p>
        </div>
      </div>

      <div className="va-ops-page-header-toolbar">
        <label className="va-ops-search" aria-label="Global search">
          <AppIcon name="search" size={16} strokeWidth={2} className="va-ops-search-icon" />
          <input
            type="search"
            className="va-ops-search-input"
            placeholder={vaOperationsHeader.searchPlaceholder}
          />
        </label>
        <HubHelpTrigger hubId="va-operations" />
      </div>
    </header>
  );
}
