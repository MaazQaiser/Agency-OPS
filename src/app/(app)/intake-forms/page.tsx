import { Suspense } from "react";
import { IntakeFormsModule } from "@/components/intake-forms/IntakeFormsModule";

export default function IntakeFormsPage() {
  return (
    <div className="module-intake-forms">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <IntakeFormsModule />
      </Suspense>
    </div>
  );
}
