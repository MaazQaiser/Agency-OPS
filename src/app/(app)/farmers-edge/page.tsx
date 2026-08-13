import { Suspense } from "react";
import { HubShell } from "@/components/layout/HubShell";
import { FarmersEdgeModule } from "@/components/farmers-edge/FarmersEdgeModule";

export default function FarmersEdgePage() {
  return (
    <HubShell hub="farmersEdge">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <FarmersEdgeModule />
      </Suspense>
    </HubShell>
  );
}
