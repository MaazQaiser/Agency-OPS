"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  getClientLanguage,
  getLanguageBadgeCode,
  hasBilingualSupport,
  needsLanguageSupport,
  type BilingualQueueItem,
  type ClientLanguageProfile,
} from "@/data/bilingualClient";
import { getNameInitials } from "@/lib/nameInitials";
import { cn } from "@/lib/cn";
import { UserChip } from "@/components/user-profile/UserProfileTrigger";
import { ClientLanguageBadges, LanguageMismatchWarning } from "./ClientLanguageBadges";

type BilingualQueueDrawerProps = {
  item: BilingualQueueItem | null;
  profile: ClientLanguageProfile | null;
  canAssign: boolean;
  canOverride: boolean;
  onClose: () => void;
  onAction: (action: string, item: BilingualQueueItem) => void;
};

export function BilingualQueueDrawer({
  item,
  profile,
  canAssign,
  canOverride,
  onClose,
  onAction,
}: BilingualQueueDrawerProps) {
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item || !profile) return null;

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close bilingual queue" onClick={onClose} />
      <aside className="va-ops-drawer va-ops-drawer-wide bilingual-drawer" role="dialog" aria-modal="true" aria-label={`Bilingual: ${item.client}`}>
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar" aria-hidden="true">
              {getNameInitials(item.client)}
            </span>
            <div>
              <div className="va-ops-drawer-name">{item.client}</div>
              <div className="va-ops-drawer-role">{item.module} · {getLanguageBadgeCode(item.language)}</div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <div className="bilingual-drawer-badges">
            <ClientLanguageBadges profile={profile} />
            <span className={cn("badge", item.priority === "High" ? "badge-red" : item.priority === "Medium" ? "badge-yellow" : "badge-gray")}>
              {item.priority}
            </span>
            <span className="badge badge-blue">{item.status}</span>
          </div>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Language Profile</div>
            <dl className="va-ops-lead-details">
              <div><dt>Preferred Language</dt><dd>{profile.preferredLanguage}</dd></div>
              <div><dt>Secondary Language</dt><dd>{profile.secondaryLanguage ?? "—"}</dd></div>
              <div><dt>Interpreter Needed</dt><dd>{profile.interpreterNeeded ? "Yes" : "No"}</dd></div>
              <div><dt>Assigned Bilingual VA</dt><dd>{profile.assignedBilingualVa ? <UserChip name={profile.assignedBilingualVa} /> : "Unassigned"}</dd></div>
              <div><dt>Communication Restriction</dt><dd>{profile.communicationRestriction ?? "None"}</dd></div>
              <div><dt>Proposal Language</dt><dd>{profile.proposalLanguagePreference}</dd></div>
            </dl>
          </section>

          <section className="va-ops-drawer-section">
            <div className="va-ops-drawer-section-label">Queue Notes</div>
            <p className="va-ops-drawer-text">{item.notes}</p>
          </section>

          {needsLanguageSupport(profile) && (
            <div className="bilingual-mismatch-warning" role="alert">
              <span className="badge badge-red">Needs Support</span>
              <span>No bilingual VA assigned for {profile.preferredLanguage} client.</span>
            </div>
          )}

          {(canAssign || canOverride) && (
            <section className="va-ops-drawer-section">
              <div className="va-ops-drawer-section-label">Owner Actions</div>
              <div className="va-ops-drawer-quick-actions">
                {canAssign && (
                <button type="button" className="va-ops-drawer-action-btn primary" onClick={() => onAction("Assign bilingual VA", item)}>
                  Assign bilingual VA
                </button>
                )}
                {canOverride && (
                <>
                <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Override language", item)}>
                  Override language
                </button>
                <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("Force translation", item)}>
                  Force translation
                </button>
                </>
                )}
                <button type="button" className="va-ops-drawer-action-btn" onClick={() => onAction("View bilingual workload", item)}>
                  View bilingual workload
                </button>
              </div>
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}

export function ClientLanguagePanel({ clientName }: { clientName: string }) {
  const profile = getClientLanguage(clientName);

  return (
    <section className="va-ops-drawer-section bilingual-client-panel">
      <div className="va-ops-drawer-section-label">Language Support</div>
      <div className="bilingual-drawer-badges">
        <ClientLanguageBadges profile={profile} />
      </div>
      <dl className="va-ops-lead-details">
        <div><dt>Preferred Language</dt><dd>{profile.preferredLanguage}</dd></div>
        <div><dt>Bilingual VA</dt><dd>{profile.assignedBilingualVa ?? "Unassigned"}</dd></div>
        <div><dt>Proposal Language</dt><dd>{profile.proposalLanguagePreference}</dd></div>
        {profile.interpreterNeeded && <div><dt>Interpreter</dt><dd className="bilingual-slow-text">Required</dd></div>}
      </dl>
      {!hasBilingualSupport(profile) && profile.preferredLanguage !== "English" && (
        <LanguageMismatchWarning message={`No bilingual support assigned for ${profile.preferredLanguage} client.`} />
      )}
    </section>
  );
}
