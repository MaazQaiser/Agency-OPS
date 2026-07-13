"use client";

import { useMemo } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { useEntitlements } from "@/hooks/useEntitlements";
import {
  getBrokerFeeTriggerSummary,
  isAgencyBillRecord,
  type BillingType,
  type BrokerFeeTriggerStep,
  type BrokerFeeTriggerStepStatus,
} from "@/data/epayPolicy";
import { cn } from "@/lib/cn";

type BrokerFeeTriggerConfirmationProps = {
  billingType: BillingType;
  steps: BrokerFeeTriggerStep[];
  className?: string;
};

const statusLabels: Record<BrokerFeeTriggerStepStatus, string> = {
  pending: "Pending",
  success: "Success",
  failed: "Failed",
};

const summaryStatusClass: Record<BrokerFeeTriggerStepStatus, string> = {
  pending: "epay-trigger-summary--pending",
  success: "epay-trigger-summary--success",
  failed: "epay-trigger-summary--failed",
};

const stepStatusClass: Record<BrokerFeeTriggerStepStatus, string> = {
  pending: "epay-trigger-step--pending",
  success: "epay-trigger-step--success",
  failed: "epay-trigger-step--failed",
};

const stepIcon: Record<BrokerFeeTriggerStepStatus, "refresh" | "check" | "x"> = {
  pending: "refresh",
  success: "check",
  failed: "x",
};

function isActiveStep(steps: BrokerFeeTriggerStep[], index: number): boolean {
  const step = steps[index];
  if (step.status !== "pending") return false;
  const priorComplete = steps.slice(0, index).every((s) => s.status === "success");
  return priorComplete;
}

export function BrokerFeeTriggerConfirmation({
  billingType,
  steps,
  className,
}: BrokerFeeTriggerConfirmationProps) {
  const { hasFeature } = useEntitlements();
  const displaySteps = useMemo(
    () =>
      hasFeature("custom-webhooks")
        ? steps
        : steps.filter((step) => step.id !== "make-webhook"),
    [hasFeature, steps],
  );
  const visible = isAgencyBillRecord(billingType) && displaySteps.length > 0;

  const summary = useMemo(() => getBrokerFeeTriggerSummary(displaySteps), [displaySteps]);
  const activeIndex = useMemo(
    () => displaySteps.findIndex((_, i) => isActiveStep(displaySteps, i)),
    [displaySteps],
  );

  if (!visible) return null;

  return (
    <section
      className={cn("epay-broker-fee-trigger", className)}
      aria-label="Broker fee trigger compliance tracker"
    >
      <div className="epay-broker-fee-trigger-header">
        <div>
          <h4 className="epay-broker-fee-trigger-title">Broker Fee Trigger</h4>
          <p className="epay-broker-fee-trigger-sub">Agency Bill compliance sequence · AZ E-Sign</p>
        </div>
        <span className={cn("epay-broker-fee-trigger-summary badge", summaryStatusClass[summary])}>
          {statusLabels[summary]}
        </span>
      </div>

      <ol className="epay-broker-fee-trigger-timeline">
        {displaySteps.map((step, index) => {
          const active = index === activeIndex;
          const isLast = index === displaySteps.length - 1;

          return (
            <li
              key={step.id}
              className={cn(
                "epay-broker-fee-trigger-step",
                stepStatusClass[step.status],
                active && "epay-broker-fee-trigger-step--active",
                !isLast && "epay-broker-fee-trigger-step--connected",
              )}
            >
              <div className="epay-broker-fee-trigger-rail" aria-hidden="true">
                <span className={cn("epay-broker-fee-trigger-node", active && "epay-broker-fee-trigger-node--pulse")}>
                  <AppIcon name={stepIcon[step.status]} size={12} strokeWidth={2.5} />
                </span>
                {!isLast && <span className="epay-broker-fee-trigger-connector" />}
              </div>

              <div className="epay-broker-fee-trigger-content">
                <div className="epay-broker-fee-trigger-step-top">
                  <span className="epay-broker-fee-trigger-step-label">{step.label}</span>
                  <span
                    className={cn(
                      "epay-broker-fee-trigger-status",
                      `epay-broker-fee-trigger-status--${step.status}`,
                    )}
                  >
                    {statusLabels[step.status]}
                  </span>
                </div>
                {step.updatedAt && (
                  <time className="epay-broker-fee-trigger-time">{step.updatedAt}</time>
                )}
                {step.detail && (
                  <p className="epay-broker-fee-trigger-detail">{step.detail}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {activeIndex >= 0 && (
        <p className="epay-broker-fee-trigger-live" role="status" aria-live="polite">
          <span className="epay-broker-fee-trigger-live-dot" aria-hidden="true" />
          Processing step {activeIndex + 1} of {steps.length}…
        </p>
      )}
    </section>
  );
}
