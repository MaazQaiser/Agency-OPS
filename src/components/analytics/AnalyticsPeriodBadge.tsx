import type { AnalyticsTimeFilterId } from "@/data/analytics";
import { getAnalyticsPeriodLabel } from "@/data/analytics";

export function AnalyticsPeriodBadge({ period }: { period: AnalyticsTimeFilterId }) {
  return (
    <span className="analytics-period-badge" aria-label={`Showing data for ${getAnalyticsPeriodLabel(period)}`}>
      {getAnalyticsPeriodLabel(period)}
    </span>
  );
}
