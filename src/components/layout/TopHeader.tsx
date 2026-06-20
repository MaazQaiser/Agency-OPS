"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logoutAction } from "@/app/login/actions";
import evaChongAvatar from "@/assets/avatars/eva-chong.jpg";
import { AppIcon } from "@/components/ui/AppIcon";
import { vaOperationsTabs } from "@/data/vaOperations";
import { navItems, routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string) {
  if (href === routes.dashboard) return pathname === routes.dashboard || pathname === routes.home;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function vaOperationsViewHref(tabId: string) {
  return tabId === "overview" ? routes.vaOperations : `${routes.vaOperations}?view=${tabId}`;
}

export function TopHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isVaOperations = pathname === routes.vaOperations || pathname.startsWith(`${routes.vaOperations}/`);
  const activeVaView = searchParams.get("view") ?? "overview";
  const [avatarError, setAvatarError] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (profileMenuRef.current?.contains(event.target as Node)) return;
      setProfileOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  return (
    <header className="app-top-header">
      <Link href={routes.dashboard} className="top-header-brand" aria-label="Agency OPS home">
        <span className="top-header-brand-mark" aria-hidden="true">
          <img
            src="/brand/agency-os-mark.png"
            srcSet="/brand/agency-os-mark@2x.png 2x"
            alt=""
            width={32}
            height={16}
            className="top-header-brand-mark-img"
          />
        </span>
        <span className="top-header-brand-title" aria-hidden="true">
          gency OPS
        </span>
      </Link>

      <nav className="top-header-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`top-header-nav-link${isActive(pathname, item.href) ? " active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="top-header-right">
        <div className="top-header-actions">
          <button type="button" className="top-header-btn" aria-label="Notifications">
            <AppIcon name="bell" size={16} strokeWidth={2} />
            <span className="top-header-badge">4</span>
          </button>

          <button type="button" className="top-header-btn top-header-btn-ai">
            <AppIcon name="sparkles" size={16} strokeWidth={2} />
            <span className="top-header-btn-ai-label">AI Insights</span>
          </button>

          <div className="top-header-profile-menu" ref={profileMenuRef}>
            <button
              type="button"
              className={`top-header-profile${profileOpen ? " open" : ""}`}
              aria-label="User profile menu"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              onClick={() => setProfileOpen((open) => !open)}
            >
              {avatarError ? (
                <span className="top-header-avatar top-header-avatar-fallback">EC</span>
              ) : (
                <img
                  src={evaChongAvatar.src}
                  alt="Eva Chong"
                  width={32}
                  height={32}
                  className="top-header-avatar"
                  onError={() => setAvatarError(true)}
                />
              )}
              <span className="top-header-user">
                <span className="top-header-user-name">Eva Chong</span>
                <span className="top-header-user-role">Executive</span>
              </span>
              <AppIcon name="chevron-down" size={14} strokeWidth={2.25} className="top-header-profile-chevron" />
            </button>

            {profileOpen && (
              <div className="top-header-profile-dropdown" role="menu">
                <div className="top-header-profile-dropdown-header">
                  <span className="top-header-profile-dropdown-name">Eva Chong</span>
                  <span className="top-header-profile-dropdown-role">Executive · Insurance Town</span>
                </div>
                <div className="top-header-profile-dropdown-section">
                  <div className="top-header-profile-dropdown-section-label">VA Role Views</div>
                  {vaOperationsTabs.map((tab) => (
                    <Link
                      key={tab.id}
                      href={vaOperationsViewHref(tab.id)}
                      className={cn(
                        "top-header-profile-dropdown-item",
                        "top-header-profile-dropdown-role-item",
                        isVaOperations && activeVaView === tab.id && "active",
                      )}
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                    >
                      <AppIcon name="users" size={15} strokeWidth={2.25} />
                      {tab.label}
                    </Link>
                  ))}
                </div>
                <button
                  type="button"
                  className="top-header-profile-dropdown-item"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                >
                  <AppIcon name="settings" size={15} strokeWidth={2.25} />
                  Profile Settings
                </button>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="top-header-profile-dropdown-item top-header-profile-dropdown-item-danger"
                    role="menuitem"
                  >
                    <AppIcon name="log-out" size={15} strokeWidth={2.25} />
                    Logout
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
