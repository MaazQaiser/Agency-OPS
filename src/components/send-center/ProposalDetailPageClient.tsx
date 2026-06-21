"use client";

import { useCallback } from "react";
import { useToast, createLegacyToastHandler } from "@/hooks/useToast";
import { ModuleBreadcrumbBar } from "@/components/shared/ModuleBreadcrumbBar";
import { SendCenterPageHeader } from "./SendCenterPageHeader";
import { ProposalDetailView } from "./ProposalDetailView";

type ProposalDetailPageClientProps = {
  proposalId: string;
};

export function ProposalDetailPageClient({ proposalId }: ProposalDetailPageClientProps) {
  const toast = useToast();
  const showToast = useCallback(createLegacyToastHandler(toast), [toast]);

  return (
    <>
      <SendCenterPageHeader />
      <ModuleBreadcrumbBar proposalId={proposalId} />
      <div className="va-ops-tab-content">
        <ProposalDetailView proposalId={proposalId} onToast={showToast} />
      </div>
    </>
  );
}
