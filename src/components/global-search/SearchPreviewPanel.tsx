"use client";

import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import type { GlobalSearchResult } from "@/data/globalSearch";
import { searchTypeHubClass } from "@/data/globalSearch";
import {
  getEntityQuickActions,
  getLinkedRecords,
  getRecentActivity,
  getResultPriority,
} from "@/data/globalSearchCommandCenter";
import { resolveSearchNavigation } from "@/lib/crossModuleLinks";
import { useAvatarProfile } from "@/components/user-profile/AvatarProfileProvider";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/cn";

type SearchPreviewPanelProps = {
  result: GlobalSearchResult | null;
  onNavigate?: () => void;
};

function detailValue(result: GlobalSearchResult, ...labels: string[]) {
  for (const label of labels) {
    const field = result.fields.find((f) => f.label === label);
    if (field) return field.value;
    const detail = result.drawer.details.find((d) => d.label === label);
    if (detail) return detail.value;
  }
  return undefined;
}

export function SearchPreviewPanel({ result, onNavigate }: SearchPreviewPanelProps) {
  const router = useRouter();
  const toast = useToast();
  const { openProfile } = useAvatarProfile();

  if (!result) {
    return (
      <aside className="global-search-preview-panel global-search-preview-panel--empty global-search-inspector" aria-label="Result preview">
        <div className="global-search-preview-empty">
          <AppIcon name="search" size={28} strokeWidth={1.75} />
          <h3>Operational Preview</h3>
          <p>Select any result to inspect entity summary, linked records, activity, risk flags, and quick actions.</p>
        </div>
      </aside>
    );
  }

  const { drawer } = result;
  const producer = detailValue(result, "Producer");
  const assignedVa = detailValue(result, "Assigned VA", "Assigned");
  const openItems = drawer.openItems ?? [];
  const policies = drawer.policies ?? [];
  const riskFlags = drawer.riskFlags ?? [];
  const priority = getResultPriority(result);
  const linkedRecords = getLinkedRecords(result);
  const recentActivity = getRecentActivity(result);
  const quickActions = getEntityQuickActions(result);

  const openSource = () => {
    const nav = resolveSearchNavigation(result);
    if (nav.kind === "profile") {
      openProfile(nav.userId);
      onNavigate?.();
      return;
    }
    router.push(nav.kind === "route" ? nav.href : result.href, { scroll: false });
    onNavigate?.();
  };

  const runAction = (href: string, message?: string) => {
    router.push(href, { scroll: false });
    if (message) toast.success(message);
  };

  return (
    <aside className="global-search-preview-panel global-search-inspector" aria-label={`Preview: ${result.title}`}>
      <header className="global-search-preview-header">
        <div>
          <p className="global-search-preview-eyebrow">{result.hub}</p>
          <h3 className="global-search-preview-title">{result.title}</h3>
          <div className="global-search-preview-badges">
            <span className={cn("badge", searchTypeHubClass[result.type])}>{result.group}</span>
            <span className="badge badge-gray">{priority} priority</span>
            <span className={cn("badge", result.status.toLowerCase().includes("overdue") ? "badge-red" : "badge-green")}>
              {result.status}
            </span>
          </div>
        </div>
      </header>

      <div className="global-search-preview-body">
        <section className="global-search-preview-block">
          <h4>Entity Summary</h4>
          <dl className="global-search-preview-dl">
            <div><dt>Type</dt><dd>{result.group}</dd></div>
            <div><dt>Active status</dt><dd>{result.status}</dd></div>
            {assignedVa && <div><dt>Assigned VA</dt><dd>{assignedVa}</dd></div>}
            {producer && <div><dt>Producer</dt><dd>{producer}</dd></div>}
          </dl>
          <p className="global-search-preview-summary">{drawer.summary}</p>
        </section>

        {linkedRecords.length > 0 && (
          <section className="global-search-preview-block">
            <h4>Linked Records</h4>
            <ul className="global-search-preview-linked-list">
              {linkedRecords.map((record) => (
                <li key={`${record.label}-${record.value}`}>
                  <span>{record.label}</span>
                  <strong>{record.value}</strong>
                </li>
              ))}
            </ul>
          </section>
        )}

        {recentActivity.length > 0 && (
          <section className="global-search-preview-block">
            <h4>Recent Activity</h4>
            <ul className="global-search-preview-activity-list">
              {recentActivity.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        )}

        {(openItems.length > 0 || policies.length > 0) && (
          <section className="global-search-preview-block">
            <h4>Open Items</h4>
            <ul className="global-search-preview-list">
              {openItems.map((item) => (
                <li key={`${item.label}-${item.value}`} className={item.urgent ? "is-urgent" : undefined}>
                  <strong>{item.label}</strong>: {item.value}
                </li>
              ))}
              {policies.map((policy) => (
                <li key={policy.label}>
                  <strong>{policy.label}</strong>: {policy.value}
                </li>
              ))}
            </ul>
          </section>
        )}

        {riskFlags.length > 0 && (
          <section className="global-search-preview-block">
            <h4>Risk Flags</h4>
            <ul className="global-search-preview-risk-list">
              {riskFlags.map((flag) => (
                <li key={flag.label} className={`risk-${flag.level}`}>
                  {flag.label}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <footer className="global-search-preview-actions global-search-inspector-actions">
        <button type="button" className="va-ops-action-btn commercial-hub-btn-teal primary" onClick={openSource}>
          Open record
        </button>
        {quickActions.slice(1).map((action) => (
          <button
            key={action.id}
            type="button"
            className="va-ops-action-btn"
            onClick={() => runAction(action.href, action.toastMessage)}
          >
            <AppIcon name={action.icon} size={14} strokeWidth={2} />
            {action.label}
          </button>
        ))}
      </footer>
    </aside>
  );
}
