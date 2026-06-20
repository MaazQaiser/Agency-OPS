import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";

type QuickAction = {
  id: string;
  label: string;
  icon: AppIconName;
};

type RoleTabHeaderProps = {
  title: string;
  subtitle: string;
  quickActions?: QuickAction[];
};

export function RoleTabHeader({ title, subtitle, quickActions }: RoleTabHeaderProps) {
  return (
    <header className="va-ops-role-header">
      <div className="va-ops-role-header-left">
        <h2 className="va-ops-role-title">{title}</h2>
        <p className="va-ops-role-subtitle">{subtitle}</p>
      </div>
      {quickActions && quickActions.length > 0 && (
        <div className="va-ops-role-actions">
          {quickActions.map((action) => (
            <button key={action.id} type="button" className="va-ops-role-action-btn">
              <AppIcon name={action.icon} size={15} strokeWidth={2} />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
