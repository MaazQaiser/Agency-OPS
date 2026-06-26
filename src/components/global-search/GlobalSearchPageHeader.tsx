"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { HubHelpTrigger } from "@/components/help/HubHelpTrigger";
import { globalSearchHeader } from "@/data/globalSearch";

export function GlobalSearchPageHeader() {
  const handleAction = (id: string) => {
    if (id === "filters") {
      document.querySelector(".global-search-toolbar-sticky")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (id === "saved") {
      document.querySelector('[aria-label="Saved search views"]')?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="va-ops-page-header">
      <div className="va-ops-page-header-left">
        <div className="va-ops-page-title-block">
          <h1 className="va-ops-page-title">{globalSearchHeader.title}</h1>
          <p className="va-ops-page-subtitle">{globalSearchHeader.subtitle}</p>
        </div>
      </div>

      <div className="va-ops-page-header-toolbar global-search-header-actions">
        {globalSearchHeader.quickActions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="va-ops-role-action-btn"
            onClick={() => handleAction(action.id)}
          >
            <AppIcon name={action.icon} size={15} strokeWidth={2} />
            {action.label}
          </button>
        ))}
        <HubHelpTrigger hubId="global-search" />
      </div>
    </header>
  );
}
