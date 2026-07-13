import { HubEmptyState } from "@/components/state/HubEmptyState";
import type { HubEmptyPresetId } from "@/data/hubStatePresets";
import type { AppIconName } from "@/components/ui/AppIcon";

type CommercialHubEmptyStateProps = {
  icon?: "folder" | "check" | "search";
  title: string;
  description: string;
  ctaLabel?: string;
  onAction?: () => void;
  preset?: HubEmptyPresetId;
};

const iconMap: Record<string, AppIconName> = {
  folder: "folder",
  check: "check",
  search: "search",
};

/** @deprecated Use HubEmptyState: kept for backward compatibility */
export function CommercialHubEmptyState({
  icon = "folder",
  title,
  description,
  ctaLabel,
  onAction,
  preset,
}: CommercialHubEmptyStateProps) {
  return (
    <HubEmptyState
      preset={preset}
      icon={iconMap[icon]}
      title={title}
      description={description}
      ctaLabel={ctaLabel}
      onAction={onAction}
      className="commercial-hub-empty-state-compat"
    />
  );
}
