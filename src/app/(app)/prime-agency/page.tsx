import { PageHeader } from "@/components/ui/PageHeader";
import { PrimeAgencySection } from "@/components/retention/PrimeAgencySection";
import { retentionHeader } from "@/data/retentionScorecard";

export default function PrimeAgencyPage() {
  return (
    <div className="module-retention module-prime-agency">
      <div className="page-container">
        <PageHeader
          title="Prime Agency Scorecard"
          titleEmphasis="Scorecard"
          patent={retentionHeader.patent}
          variant="retention"
        />

        <PrimeAgencySection />
      </div>
    </div>
  );
}
