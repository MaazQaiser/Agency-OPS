import { AppIcon } from "@/components/ui/AppIcon";
import { vaOperationsHeader } from "@/data/vaOperations";

export function VAOperationsPageHeader() {
  return (
    <header className="va-ops-page-header">
      <div className="va-ops-page-header-left">
        <div className="va-ops-page-title-block">
          <h1 className="va-ops-page-title">{vaOperationsHeader.title}</h1>
          <p className="va-ops-page-subtitle">{vaOperationsHeader.subtitle}</p>
        </div>
      </div>

      <div className="va-ops-page-header-toolbar">
        <label className="va-ops-search" aria-label="Global search">
          <AppIcon name="search" size={16} strokeWidth={2} className="va-ops-search-icon" />
          <input
            type="search"
            className="va-ops-search-input"
            placeholder={vaOperationsHeader.searchPlaceholder}
          />
        </label>

        <div className="va-ops-page-header-right">
          <button type="button" className="va-ops-utility va-ops-folio">
            <AppIcon name="folder" size={15} strokeWidth={2} />
            <span>{vaOperationsHeader.folioTracker}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
