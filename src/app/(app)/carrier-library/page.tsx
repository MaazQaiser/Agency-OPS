import { Suspense } from "react";
import { CarrierLibraryModule } from "@/components/carrier-library/CarrierLibraryModule";

export default function CarrierLibraryPage() {
  return (
    <div className="module-carrier-library">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <CarrierLibraryModule />
      </Suspense>
    </div>
  );
}
