"use client";

import { useEffect } from "react";
import { DrawerSkeleton } from "@/components/shared/loading";
import { useDrawerLoading } from "@/hooks/useTabLoading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import type { GlobalSearchResult } from "@/data/globalSearch";
import { searchTypeHubClass } from "@/data/globalSearch";
import { resolveSearchNavigation } from "@/lib/crossModuleLinks";
import { useAvatarProfile } from "@/components/user-profile/AvatarProfileProvider";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

type QuickResultDrawerProps = {
  result: GlobalSearchResult | null;
  onClose: () => void;
  onNavigate?: (href: string) => void;
};

export function QuickResultDrawer({ result, onClose, onNavigate }: QuickResultDrawerProps) {
  const router = useRouter();
  const { openProfile } = useAvatarProfile();
  const drawerLoading = useDrawerLoading(result);

  useEffect(() => {
    if (!result) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.document.addEventListener("keydown", handleKeyDown);
    window.document.body.style.overflow = "hidden";

    return () => {
      window.document.removeEventListener("keydown", handleKeyDown);
      window.document.body.style.overflow = "";
    };
  }, [result, onClose]);

  if (!result) return null;

  const { drawer } = result;

  const openSource = () => {
    const nav = resolveSearchNavigation(result);
    if (nav.kind === "profile") {
      onClose();
      openProfile(nav.userId);
      return;
    }
    const href = nav.kind === "route" ? nav.href : result.href;
    if (onNavigate) onNavigate(href);
    else {
      router.push(href);
      onClose();
    }
  };

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop"
        aria-label="Close search preview"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer global-search-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Preview: ${result.title}`}
      >
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <div>
              <div className="va-ops-drawer-name">{result.title}</div>
              <div className="va-ops-drawer-role">
                <span className={cn("badge", searchTypeHubClass[result.type])}>{result.group}</span>
                <span>{result.hub}</span>
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          {drawerLoading ? (
            <DrawerSkeleton label="Loading result preview" />
          ) : (
            <>
          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Preview</div>
            <p className="va-ops-drawer-text">{drawer.summary}</p>
          </div>

          <dl className="va-ops-intel-grid va-ops-intel-grid-compact">
            {drawer.details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>

          {result.fields.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Quick Fields</div>
              <dl className="global-search-drawer-fields">
                {result.fields.map((field) => (
                  <div key={field.label}>
                    <dt>{field.label}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {drawer.notes.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Notes</div>
              <ul className="va-ops-gap-list">
                {drawer.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {drawer.relatedLinks.length > 0 && (
            <div className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Related</div>
              <ul className="global-search-related-links">
                {drawer.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="global-search-related-link" onClick={onClose}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Actions</div>
            <div className="va-ops-drawer-quick-actions">
              <button type="button" className="va-ops-drawer-action-btn primary" onClick={openSource}>
                <AppIcon name="folder" size={15} strokeWidth={2} />
                Open
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="user-plus" size={15} strokeWidth={2} />
                Assign
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="message-square" size={15} strokeWidth={2} />
                Add Note
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="send" size={15} strokeWidth={2} />
                Share
              </button>
              <button type="button" className="va-ops-drawer-action-btn">
                <AppIcon name="star" size={15} strokeWidth={2} />
                Save Search
              </button>
            </div>
          </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
