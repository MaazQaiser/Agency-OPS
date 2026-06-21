import { Suspense } from "react";
import { SystemHealthModule } from "@/components/system-health/SystemHealthModule";

export default function SystemHealthPage() {
  return (
    <div className="module-system-health">
      <Suspense fallback={<div className="system-health-view" />}>
        <SystemHealthModule />
      </Suspense>
    </div>
  );
}
