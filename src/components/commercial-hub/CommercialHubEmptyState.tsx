import { AppIcon } from "@/components/ui/AppIcon";

type CommercialHubEmptyStateProps = {
  icon?: "folder" | "check" | "search";
  title: string;
  description: string;
};

const iconMap = {
  folder: "folder",
  check: "check",
  search: "search",
} as const;

export function CommercialHubEmptyState({
  icon = "folder",
  title,
  description,
}: CommercialHubEmptyStateProps) {
  return (
    <div className="commercial-hub-empty-state" role="status">
      <AppIcon name={iconMap[icon]} size={28} strokeWidth={1.75} className="commercial-hub-empty-state-icon" />
      <div className="commercial-hub-empty-state-title">{title}</div>
      <p className="commercial-hub-empty-state-desc">{description}</p>
    </div>
  );
}
