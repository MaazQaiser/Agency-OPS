import { Suspense } from "react";
import { HubShell } from "@/components/layout/HubShell";
import { TrainingHubModule } from "@/components/training-hub/TrainingHubModule";

export default function TrainingHubPage() {
  return (
    <HubShell hub="training">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <TrainingHubModule />
      </Suspense>
    </HubShell>
  );
}
