"use client";

import type { TenantSubscriptionConfig } from "@/data/subscriptionTiers";

type UpgradePromptProps = {
  tenant: TenantSubscriptionConfig;
};

/** Owner-only CTA: generic copy with no tier or feature names. */
export function UpgradePrompt({ tenant }: UpgradePromptProps) {
  if (!tenant.showUpgradePrompts) return null;

  const mailto = tenant.upgradeContactEmail
    ? `mailto:${tenant.upgradeContactEmail}?subject=${encodeURIComponent("Agency OS access request")}`
    : undefined;

  return (
    <div className="subscription-upgrade-prompt">
      <p className="subscription-upgrade-prompt-text">
        Your agency account may be eligible for additional capabilities. Contact your account team to
        review options.
      </p>
      {mailto ? (
        <a className="subscription-upgrade-prompt-btn" href={mailto}>
          Request access
        </a>
      ) : null}
    </div>
  );
}
