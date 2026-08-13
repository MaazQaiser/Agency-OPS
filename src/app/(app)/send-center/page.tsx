import { Suspense } from "react";
import { HubShell } from "@/components/layout/HubShell";
import { SendCenterModule } from "@/components/send-center/SendCenterModule";

export default function SendCenterPage() {
  return (
    <HubShell hub="sendCenter">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <SendCenterModule />
      </Suspense>
    </HubShell>
  );
}
