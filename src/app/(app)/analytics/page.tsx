import { Suspense } from "react";
import { HubShell } from "@/components/layout/HubShell";
import { AnalyticsModule } from "@/components/analytics/AnalyticsModule";

export default function AnalyticsPage() {
  return (
    <HubShell hub="analytics">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <AnalyticsModule />
      </Suspense>
    </HubShell>
  );
}
