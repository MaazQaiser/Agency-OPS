import { Suspense } from "react";
import { HubShell } from "@/components/layout/HubShell";
import { CommercialHubModule } from "@/components/commercial-hub/CommercialHubModule";

export default function CommercialHubPage() {
  return (
    <HubShell hub="commercial">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <CommercialHubModule />
      </Suspense>
    </HubShell>
  );
}
