"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { HubHelpTrigger } from "@/components/help/HubHelpTrigger";
import { vaOperationsHeader } from "@/data/vaOperations";
import { currentUser } from "@/lib/currentUser";
import { VaTeamPresenceStrip } from "./VaTeamPresenceStrip";

function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function OwnerOverviewHero() {
  const firstName = currentUser.name.split(" ")[0] || currentUser.name;
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    setGreeting(greetingForHour(new Date().getHours()));
  }, []);

  return (
    <header className="va-ops-page-header owner-overview-hero">
      <div className="owner-overview-hero-main">
        <div className="owner-overview-hero-top">
          <div className="owner-overview-hero-copy">
            <p className="owner-overview-hero-eyebrow">Owner Overview</p>
            <h1 className="va-ops-page-title owner-overview-hero-title">
              {greeting}, {firstName}
            </h1>
            <p className="va-ops-page-subtitle owner-overview-hero-subtitle">
              Your whole team and every open item, at a glance.
            </p>
          </div>

          <div className="va-ops-page-header-toolbar owner-overview-hero-toolbar">
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
        </div>

        <VaTeamPresenceStrip variant="hero" />
      </div>
    </header>
  );
}
