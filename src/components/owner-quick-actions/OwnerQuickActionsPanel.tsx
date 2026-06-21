"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  ownerQuickActionSections,
  ownerRecentActions as seedRecentActions,
  ownerSummaryCards,
  type OwnerQuickAction,
  type OwnerRecentAction,
  type OwnerSummaryCard,
} from "@/data/ownerQuickActions";
import { cn } from "@/lib/cn";
import type { PermissionAuditEntry } from "@/data/rolePermissions";

type OwnerQuickActionsPanelProps = {
  loading: boolean;
  recentActions: OwnerRecentAction[];
  auditLog: PermissionAuditEntry[];
  onClose: () => void;
  onAction: (action: OwnerQuickAction) => void;
  onSummaryCard: (card: OwnerSummaryCard) => void;
};

export function OwnerQuickActionsPanel({
  loading,
  recentActions,
  auditLog,
  onClose,
  onAction,
  onSummaryCard,
}: OwnerQuickActionsPanelProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const actions = recentActions.length > 0 ? recentActions : seedRecentActions;

  return (
    <div className="va-ops-drawer-root owner-quick-actions-root" role="presentation">
      <button
        type="button"
        className="va-ops-drawer-backdrop owner-quick-actions-backdrop"
        aria-label="Close quick actions"
        onClick={onClose}
      />
      <aside
        className="va-ops-drawer owner-quick-actions-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Quick Actions"
      >
        <header className="owner-quick-actions-header">
          <div>
            <h2>Quick Actions</h2>
            <p>Fast owner controls</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </header>

        <div className="owner-quick-actions-body">
          {loading ? (
            <div className="owner-quick-actions-skeleton" aria-busy="true" aria-label="Loading quick actions">
              <div className="owner-quick-actions-skeleton-cards" />
              <div className="owner-quick-actions-skeleton-section" />
              <div className="owner-quick-actions-skeleton-section tall" />
            </div>
          ) : (
            <>
              <section className="owner-quick-actions-summary" aria-label="Summary">
                <div className="owner-quick-actions-summary-grid">
                  {ownerSummaryCards.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      className={cn("owner-summary-card", `owner-summary-card-${card.variant}`)}
                      onClick={() => onSummaryCard(card)}
                    >
                      <span className="owner-summary-card-value">{card.value}</span>
                      <span className="owner-summary-card-label">{card.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {ownerQuickActionSections.map((section) => (
                <section key={section.id} className="owner-quick-actions-section" aria-label={section.title}>
                  <h3 className="owner-quick-actions-section-title">{section.title}</h3>
                  <div className="owner-quick-actions-grid">
                    {section.actions.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        className="owner-quick-action-btn"
                        onClick={() => onAction(action)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </section>
              ))}

              <section className="owner-quick-actions-section" aria-label="Permission audit log">
                <h3 className="owner-quick-actions-section-title">Permission Audit Log</h3>
                {auditLog.length === 0 ? (
                  <p className="owner-quick-actions-empty">No permission events logged yet.</p>
                ) : (
                  <ol className="owner-recent-actions permission-audit-log">
                    {auditLog.slice(0, 8).map((entry) => (
                      <li key={entry.id} className="owner-recent-action-item">
                        <span className={cn("permission-audit-dot", `permission-audit-${entry.type}`)} aria-hidden="true" />
                        <div>
                          <p className="owner-recent-action-desc">{entry.description}</p>
                          <time className="owner-recent-action-time">
                            {entry.timestamp} · {entry.role}
                          </time>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </section>

              <section className="owner-quick-actions-section" aria-label="Recent owner actions">
                <h3 className="owner-quick-actions-section-title">Recent Owner Actions</h3>
                {actions.length === 0 ? (
                  <p className="owner-quick-actions-empty">No recent actions yet.</p>
                ) : (
                  <ol className="owner-recent-actions">
                    {actions.map((entry) => (
                      <li key={entry.id} className="owner-recent-action-item">
                        <span className="owner-recent-action-dot" aria-hidden="true" />
                        <div>
                          <p className="owner-recent-action-desc">{entry.description}</p>
                          <time className="owner-recent-action-time">{entry.timestamp}</time>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
