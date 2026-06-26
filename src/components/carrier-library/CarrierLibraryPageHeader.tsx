import { QuickActionButton } from "@/components/keyboard/QuickActionButton";
import { HubHelpTrigger } from "@/components/help/HubHelpTrigger";
import { carrierLibraryHeader } from "@/data/carrierLibrary";

type CarrierLibraryPageHeaderProps = {
  onQuickActionClick?: (actionId: string) => void;
};

export function CarrierLibraryPageHeader({ onQuickActionClick }: CarrierLibraryPageHeaderProps) {
  return (
    <header className="va-ops-page-header">
      <div className="va-ops-page-header-left">
        <div className="va-ops-page-title-block">
          <h1 className="va-ops-page-title">{carrierLibraryHeader.title}</h1>
          <p className="va-ops-page-subtitle">{carrierLibraryHeader.subtitle}</p>
        </div>
      </div>

      <div className="va-ops-page-header-toolbar carrier-library-header-actions">
        {carrierLibraryHeader.quickActions.map((action) => (
          <QuickActionButton
            key={action.id}
            actionId={action.id}
            label={action.label}
            icon={action.icon}
            onClick={() => onQuickActionClick?.(action.id)}
          />
        ))}
        <HubHelpTrigger hubId="carrier-library" />
      </div>
    </header>
  );
}
