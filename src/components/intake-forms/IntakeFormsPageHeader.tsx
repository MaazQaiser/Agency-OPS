import { AppIcon } from "@/components/ui/AppIcon";
import { intakeFormsHeader } from "@/data/intakeForms";

type IntakeFormsPageHeaderProps = {
  onQuickActionClick?: (actionId: string) => void;
};

export function IntakeFormsPageHeader({ onQuickActionClick }: IntakeFormsPageHeaderProps) {
  return (
    <header className="va-ops-page-header">
      <div className="va-ops-page-header-left">
        <div className="va-ops-page-title-block">
          <h1 className="va-ops-page-title">{intakeFormsHeader.title}</h1>
          <p className="va-ops-page-subtitle">{intakeFormsHeader.subtitle}</p>
        </div>
      </div>

      <div className="va-ops-page-header-toolbar intake-forms-header-actions">
        {intakeFormsHeader.quickActions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="va-ops-role-action-btn"
            onClick={() => onQuickActionClick?.(action.id)}
          >
            <AppIcon name={action.icon} size={15} strokeWidth={2} />
            {action.label}
          </button>
        ))}
      </div>
    </header>
  );
}
