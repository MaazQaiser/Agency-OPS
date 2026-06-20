import { tabPlaceholders, type PlaceholderTabId } from "@/data/vaOperations";

type PlaceholderTabProps = {
  tabId: PlaceholderTabId;
};

export function PlaceholderTab({ tabId }: PlaceholderTabProps) {
  const content = tabPlaceholders[tabId];

  return (
    <div className="va-ops-placeholder">
      <div className="va-ops-placeholder-inner">
        <div className="va-ops-placeholder-label">Role workspace</div>
        <h2 className="va-ops-placeholder-title">{content.title}</h2>
        <p className="va-ops-placeholder-desc">{content.description}</p>
        <p className="va-ops-placeholder-note">
          This tab will show role-specific operational views. Use Overview for the owner command center.
        </p>
      </div>
    </div>
  );
}
