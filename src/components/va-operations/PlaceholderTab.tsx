import { tabPlaceholders, type PlaceholderTabId } from "@/data/vaOperations";
import { cn } from "@/lib/cn";

type PlaceholderTabProps = {
  tabId: PlaceholderTabId;
  embedded?: boolean;
};

export function PlaceholderTab({ tabId, embedded = false }: PlaceholderTabProps) {
  const content = tabPlaceholders[tabId];

  return (
    <div className={cn("va-ops-placeholder", embedded && "embedded")}>
      <div className="va-ops-placeholder-inner">
        {!embedded && <div className="va-ops-placeholder-label">Role workspace</div>}
        <h2 className="va-ops-placeholder-title">{content.title}</h2>
        <p className="va-ops-placeholder-desc">{content.description}</p>
        {!embedded && (
          <p className="va-ops-placeholder-note">
            This tab will show role-specific operational views. Use Overview for the owner command center.
          </p>
        )}
      </div>
    </div>
  );
}
