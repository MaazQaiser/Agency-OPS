"use client";

import Link from "next/link";
import { useState } from "react";
import evaChongAvatar from "@/assets/avatars/eva-chong.jpg";
import { AppIcon } from "@/components/ui/AppIcon";
import { vaOperationsHeader } from "@/data/vaOperations";
import { routes } from "@/lib/routes";

export function VAOperationsPageHeader() {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <header className="va-ops-page-header">
      <div className="va-ops-page-header-left">
        <Link href={routes.dashboard} className="va-ops-brand" aria-label="Agency OPS home">
          <span className="va-ops-brand-mark" aria-hidden="true">
            <img
              src="/brand/agency-os-mark.png"
              srcSet="/brand/agency-os-mark@2x.png 2x"
              alt=""
              width={32}
              height={16}
              className="va-ops-brand-mark-img"
            />
          </span>
        </Link>
        <div className="va-ops-page-title-block">
          <h1 className="va-ops-page-title">{vaOperationsHeader.title}</h1>
          <p className="va-ops-page-subtitle">{vaOperationsHeader.subtitle}</p>
        </div>
      </div>

      <div className="va-ops-page-header-center">
        <label className="va-ops-search" aria-label="Global search">
          <AppIcon name="search" size={16} strokeWidth={2} className="va-ops-search-icon" />
          <input
            type="search"
            className="va-ops-search-input"
            placeholder={vaOperationsHeader.searchPlaceholder}
          />
        </label>
      </div>

      <div className="va-ops-page-header-right">
        <button type="button" className="va-ops-utility va-ops-folio">
          <AppIcon name="folder" size={15} strokeWidth={2} />
          <span>{vaOperationsHeader.folioTracker}</span>
        </button>

        <button type="button" className="va-ops-utility va-ops-notifications" aria-label="Notifications">
          <AppIcon name="bell" size={16} strokeWidth={2} />
          <span className="va-ops-notifications-label">Notifications</span>
          <span className="va-ops-notifications-badge">
            {vaOperationsHeader.notificationCount} New
          </span>
        </button>

        <button type="button" className="va-ops-utility va-ops-language" aria-label="Switch language">
          <AppIcon name="globe" size={16} strokeWidth={2} />
          <span>EN</span>
          <AppIcon name="chevron-down" size={14} strokeWidth={2.25} />
        </button>

        <button type="button" className="va-ops-profile" aria-label="Profile">
          {avatarError ? (
            <span className="va-ops-profile-avatar va-ops-profile-avatar-fallback">EC</span>
          ) : (
            <img
              src={evaChongAvatar.src}
              alt="Eva Chong"
              width={32}
              height={32}
              className="va-ops-profile-avatar"
              onError={() => setAvatarError(true)}
            />
          )}
          <span className="va-ops-profile-name">Eva Chong</span>
        </button>
      </div>
    </header>
  );
}
