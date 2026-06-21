import { Suspense } from "react";
import { CommercialHubModule } from "@/components/commercial-hub/CommercialHubModule";

export default function CommercialHubPage() {
  return (
    <div className="module-commercial-hub">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <CommercialHubModule />
      </Suspense>
    </div>
  );
}
