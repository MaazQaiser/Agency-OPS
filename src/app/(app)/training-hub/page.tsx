import { Suspense } from "react";
import { TrainingHubModule } from "@/components/training-hub/TrainingHubModule";

export default function TrainingHubPage() {
  return (
    <div className="module-training-hub">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <TrainingHubModule />
      </Suspense>
    </div>
  );
}
