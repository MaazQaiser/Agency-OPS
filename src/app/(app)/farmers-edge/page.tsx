import { Suspense } from "react";
import { FarmersEdgeModule } from "@/components/farmers-edge/FarmersEdgeModule";

export default function FarmersEdgePage() {
  return (
    <div className="module-farmers-edge">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <FarmersEdgeModule />
      </Suspense>
    </div>
  );
}
