"use client";

import { cn } from "@/lib/cn";
import type { InvoiceClient } from "@/data/epayPolicy";
import { getExtendedPaymentLifecycle } from "@/data/epayPolicy";

type PaymentLifecycleStepperProps = {
  client: InvoiceClient;
};

export function PaymentLifecycleStepper({ client }: PaymentLifecycleStepperProps) {
  const stages = getExtendedPaymentLifecycle(client);

  return (
    <div className="epay-extended-lifecycle" aria-label="Payment lifecycle">
      <ol className="epay-extended-lifecycle-steps">
        {stages.map((stage, index) => (
          <li key={stage.id} className="epay-extended-lifecycle-wrap">
            {index > 0 && (
              <span
                className={cn(
                  "epay-extended-lifecycle-connector",
                  stage.state !== "pending" && stages[index - 1].state === "completed" && "completed",
                )}
                aria-hidden="true"
              />
            )}
            <div className={cn("epay-extended-lifecycle-step", stage.state)}>
              <span className="epay-extended-lifecycle-dot" aria-hidden="true" />
              <span className="epay-extended-lifecycle-label">{stage.label}</span>
              {stage.timestamp ? (
                <time className="epay-extended-lifecycle-time">{stage.timestamp}</time>
              ) : (
                <span className="epay-extended-lifecycle-time epay-extended-lifecycle-time--pending">-</span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
