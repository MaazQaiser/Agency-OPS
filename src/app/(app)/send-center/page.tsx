import { Suspense } from "react";
import { SendCenterModule } from "@/components/send-center/SendCenterModule";

export default function SendCenterPage() {
  return (
    <div className="module-send-center">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <SendCenterModule />
      </Suspense>
    </div>
  );
}
