import { Suspense } from "react";
import { HubShell } from "@/components/layout/HubShell";
import { CarrierLibraryModule } from "@/components/carrier-library/CarrierLibraryModule";

export default function CarrierLibraryPage() {
  return (
    <HubShell hub="carrierLibrary">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <CarrierLibraryModule />
      </Suspense>
    </HubShell>
  );
}
