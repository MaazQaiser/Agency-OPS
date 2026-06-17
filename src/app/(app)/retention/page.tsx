import { AppFooter } from "@/components/layout/AppFooter";
import { Alert } from "@/components/ui/Alert";
import { PageHeader, SectionLabel } from "@/components/ui/PageHeader";
import { AgencyZoomSection } from "@/components/retention/AgencyZoomSection";
import { CompensationSection } from "@/components/retention/CompensationSection";
import { RetentionKpiTabs } from "@/components/retention/RetentionKpiTabs";
import { FutureRoadmapSection, SystemOwnershipSection } from "@/components/retention/SystemOwnershipSection";
import {
  ecosystemNewBusiness,
  ecosystemRetention,
  retentionHeader,
  valerieTracieTitles,
} from "@/data/retentionScorecard";

export default function RetentionPage() {
  return (
    <div className="module-retention">
      <div className="page-container">
        <PageHeader
          title="Retention Scorecard"
          titleEmphasis="Scorecard"
          patent={retentionHeader.patent}
          variant="retention"
        />

        <SectionLabel>
          Core Architecture Decision — Two Separate Compensation Ecosystems
        </SectionLabel>

        <div className="two-col">
          <Alert variant="blue" title={ecosystemNewBusiness.title}>
            <ul>
              {ecosystemNewBusiness.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p style={{ marginTop: 8, fontSize: "var(--font-size-12)" }}>{ecosystemNewBusiness.footer}</p>
          </Alert>
          <Alert variant="purple" title={ecosystemRetention.title}>
            <ul>
              {ecosystemRetention.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p style={{ marginTop: 8, fontSize: "var(--font-size-12)" }}>{ecosystemRetention.footer}</p>
          </Alert>
        </div>

        <Alert variant="green" title={valerieTracieTitles.title}>
          <ul>
            {valerieTracieTitles.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p style={{ marginTop: 6, fontSize: "var(--font-size-12)" }}>{valerieTracieTitles.footer}</p>
        </Alert>

        <SectionLabel>
          Retention KPI Scorecard — Max 6 Core KPIs Per Department (Eva&apos;s Rule)
        </SectionLabel>

        <RetentionKpiTabs />
        <CompensationSection />
        <AgencyZoomSection />
        <SystemOwnershipSection />
        <FutureRoadmapSection />
      </div>
      <AppFooter text={retentionHeader.footer} />
    </div>
  );
}
