import { Suspense } from "react";
import { EPayPolicyModule } from "@/components/epay-policy/EPayPolicyModule";

export default function EPayPolicyPage() {
  return (
    <div className="module-epay-policy">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <EPayPolicyModule />
      </Suspense>
    </div>
  );
}
