import { Suspense } from "react";
import { HubShell } from "@/components/layout/HubShell";
import { EPayPolicyModule } from "@/components/epay-policy/EPayPolicyModule";

export default function EPayPolicyPage() {
  return (
    <HubShell hub="ePayPolicy">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <EPayPolicyModule />
      </Suspense>
    </HubShell>
  );
}
