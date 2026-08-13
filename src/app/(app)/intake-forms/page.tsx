import { Suspense } from "react";
import { HubShell } from "@/components/layout/HubShell";
import { IntakeFormsModule } from "@/components/intake-forms/IntakeFormsModule";

export default function IntakeFormsPage() {
  return (
    <HubShell hub="intakeForms">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <IntakeFormsModule />
      </Suspense>
    </HubShell>
  );
}
