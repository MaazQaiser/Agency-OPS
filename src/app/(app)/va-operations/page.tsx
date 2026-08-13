import { Suspense } from "react";
import { HubShell } from "@/components/layout/HubShell";
import { VAOperationsModule } from "@/components/va-operations/VAOperationsModule";

export default function VAOperationsPage() {
  return (
    <HubShell hub="vaOperations">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <VAOperationsModule />
      </Suspense>
    </HubShell>
  );
}
