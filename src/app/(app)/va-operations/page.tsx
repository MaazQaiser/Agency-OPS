import { Suspense } from "react";
import { VAOperationsModule } from "@/components/va-operations/VAOperationsModule";

export default function VAOperationsPage() {
  return (
    <div className="module-va-operations">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <VAOperationsModule />
      </Suspense>
    </div>
  );
}
