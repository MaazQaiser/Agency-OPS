import { Suspense } from "react";
import { AnalyticsModule } from "@/components/analytics/AnalyticsModule";

export default function AnalyticsPage() {
  return (
    <div className="module-analytics">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <AnalyticsModule />
      </Suspense>
    </div>
  );
}
