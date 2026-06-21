import { Suspense } from "react";
import { ProposalDetailPageClient } from "@/components/send-center/ProposalDetailPageClient";

type ProposalDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProposalDetailPage({ params }: ProposalDetailPageProps) {
  const { id } = await params;

  return (
    <div className="module-send-center">
      <Suspense fallback={<div className="va-ops-tab-content" />}>
        <ProposalDetailPageClient proposalId={id} />
      </Suspense>
    </div>
  );
}
