"use client";

import { AppFooter } from "@/components/layout/AppFooter";
import { Alert } from "@/components/ui/Alert";
import { PageHeader, SectionLabel } from "@/components/ui/PageHeader";
import { AgencyZoomSection } from "@/components/retention/AgencyZoomSection";
import { CompensationSection } from "@/components/retention/CompensationSection";
import { RetentionKpiTabs } from "@/components/retention/RetentionKpiTabs";
import { RetentionHelpAnchor } from "@/components/retention/RetentionHelpAnchor";
import { RetentionLanguageToggle } from "@/components/retention/RetentionLanguageToggle";
import { useRetentionLocale } from "@/components/retention/RetentionLanguageProvider";
import { FutureRoadmapSection, SystemOwnershipSection } from "@/components/retention/SystemOwnershipSection";

export function RetentionPageContent() {
  const { copy } = useRetentionLocale();

  return (
    <>
      <div className="page-container retention-locale-surface">
        <div className="retention-page-header-row module-page-header-row">
          <PageHeader
            title={copy.pageTitle}
            titleEmphasis={copy.pageTitleEmphasis}
            patent={copy.patent}
            variant="retention"
          />
          <div className="retention-page-header-actions">
            <RetentionLanguageToggle />
            <RetentionHelpAnchor />
          </div>
        </div>

        <div className="retention-dept-badge" aria-live="polite">
          <span className="retention-dept-badge-dot" aria-hidden="true" />
          {copy.departmentName}
        </div>

        <section className="retention-scorecard-section retention-scorecard-section--context" aria-label={copy.sectionArchitecture}>
          <SectionLabel>{copy.sectionArchitecture}</SectionLabel>

          <div className="two-col">
            <Alert variant="blue" title={copy.ecosystemNewBusiness.title} className="aos-card--info">
              <ul>
                {copy.ecosystemNewBusiness.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="retention-alert-note">{copy.ecosystemNewBusiness.footer}</p>
            </Alert>
            <Alert variant="purple" title={copy.ecosystemRetention.title} className="aos-card--info">
              <ul>
                {copy.ecosystemRetention.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="retention-alert-note">{copy.ecosystemRetention.footer}</p>
            </Alert>
          </div>

          <Alert variant="green" title={copy.valerieTracieTitles.title} className="aos-card--info">
            <ul>
              {copy.valerieTracieTitles.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="retention-alert-note">{copy.valerieTracieTitles.footer}</p>
          </Alert>
        </section>

        <section className="retention-scorecard-section retention-scorecard-section--primary" aria-label={copy.sectionScorecard}>
          <SectionLabel>{copy.sectionScorecard}</SectionLabel>
          <RetentionKpiTabs />
        </section>

        <section className="retention-scorecard-section" aria-label={copy.compensation.section}>
          <CompensationSection />
        </section>

        <section className="retention-scorecard-section" aria-label={copy.agencyZoom.section}>
          <AgencyZoomSection />
        </section>

        <section className="retention-scorecard-section" aria-label={copy.systemOwnership.section}>
          <SystemOwnershipSection />
        </section>

        <section className="retention-scorecard-section" aria-label={copy.futureRoadmap.section}>
          <FutureRoadmapSection />
        </section>
      </div>
      <AppFooter text={copy.footer} />
    </>
  );
}
