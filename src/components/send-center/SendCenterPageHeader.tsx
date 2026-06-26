import { QuickActionButton } from "@/components/keyboard/QuickActionButton";
import { HubHelpTrigger } from "@/components/help/HubHelpTrigger";
import { sendCenterHeader } from "@/data/sendCenter";

type SendCenterPageHeaderProps = {
  onQuickActionClick?: (actionId: string) => void;
};

export function SendCenterPageHeader({ onQuickActionClick }: SendCenterPageHeaderProps) {
  return (
    <header className="va-ops-page-header">
      <div className="va-ops-page-header-left">
        <div className="va-ops-page-title-block">
          <h1 className="va-ops-page-title">{sendCenterHeader.title}</h1>
          <p className="va-ops-page-subtitle">{sendCenterHeader.subtitle}</p>
        </div>
      </div>

      <div className="va-ops-page-header-toolbar send-center-header-actions">
        {sendCenterHeader.quickActions.map((action) => (
          <QuickActionButton
            key={action.id}
            actionId={action.id}
            label={action.label}
            icon={action.icon}
            onClick={() => onQuickActionClick?.(action.id)}
          />
        ))}
        <HubHelpTrigger hubId="send-center" />
      </div>
    </header>
  );
}
