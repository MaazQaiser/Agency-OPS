"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  carrierStatusClass,
  findCarrierById,
} from "@/data/carrierLibrary";
import {
  carrierProfileHeader,
  DEFAULT_CARRIER_PROFILE_ID,
  getCarrierProfile,
  productAppetiteStatusClass,
  productRiskTypeClass,
  stateAvailabilityClass,
  type CarrierProductAppetite,
} from "@/data/carrierProfile";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { CardSkeletonGrid, DrawerSkeleton } from "@/components/shared/loading";
import { useTabLoading } from "@/hooks/useTabLoading";
import { CarrierProductDrawer } from "./CarrierProductDrawer";

export function CarrierProfileTab() {
  const loading = useTabLoading();
  const router = useRouter();
  const searchParams = useSearchParams();
  const carrierId = searchParams.get("carrier") ?? DEFAULT_CARRIER_PROFILE_ID;
  const returnFrom = searchParams.get("from");

  const profile = useMemo(() => getCarrierProfile(carrierId), [carrierId]);
  const record = useMemo(() => findCarrierById(carrierId), [carrierId]);
  const [selectedProduct, setSelectedProduct] = useState<CarrierProductAppetite | null>(null);

  const goBack = () => {
    if (returnFrom === "search") {
      router.push(routes.carrierLibrary, { scroll: false });
      return;
    }
    router.back();
  };

  const startSubmission = () => {
    router.push(routes.intakeForms, { scroll: false });
  };

  if (loading) {
    return (
      <div className="va-ops-role-view carrier-profile">
        <DrawerSkeleton />
        <CardSkeletonGrid count={2} />
      </div>
    );
  }

  if (!profile || !record) {
    return (
      <div className="va-ops-role-view carrier-profile">
        <section className="va-ops-panel">
          <p>Carrier profile not found.</p>
          <button type="button" className="va-ops-role-action-btn" onClick={goBack}>
            Back to Search
          </button>
        </section>
      </div>
    );
  }

  const { performance } = profile;

  return (
    <div className="va-ops-role-view carrier-profile">
      <header className="carrier-profile-header">
        <div className="carrier-profile-header-left">
          <button type="button" className="carrier-profile-back" onClick={goBack}>
            <AppIcon name="chevron-down" size={16} strokeWidth={2.5} className="carrier-back-icon" />
            Back
          </button>
          <div>
            <h2 className="va-ops-role-title">{carrierProfileHeader.title}</h2>
            <p className="va-ops-role-subtitle">{carrierProfileHeader.subtitle}</p>
          </div>
        </div>
        <div className="va-ops-role-actions">
          {carrierProfileHeader.quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="va-ops-role-action-btn"
              onClick={action.id === "start-submission" ? startSubmission : undefined}
            >
              <AppIcon name={action.icon} size={15} strokeWidth={2} />
              {action.label}
            </button>
          ))}
        </div>
      </header>

      <section className="va-ops-panel carrier-profile-summary" aria-label="Carrier summary">
        <h3 className="carrier-profile-carrier-name">{profile.name}</h3>
        <dl className="carrier-profile-summary-grid">
          <div>
            <dt>Submission Type</dt>
            <dd>{profile.submissionType}</dd>
          </div>
          <div>
            <dt>MGA Contact</dt>
            <dd>{profile.mgaContact}</dd>
          </div>
          <div>
            <dt>Response Time</dt>
            <dd>{profile.responseTime}</dd>
          </div>
          <div>
            <dt>States Active</dt>
            <dd>{profile.statesActive}</dd>
          </div>
          <div>
            <dt>Risk Appetite Status</dt>
            <dd>
              <span className={cn("badge", carrierStatusClass[profile.appetiteStatus])}>
                {profile.appetiteStatus}
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <div className="carrier-profile-main">
        <section className="va-ops-panel" aria-label="Product appetite">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Product Appetite</h3>
            <p className="va-ops-section-sub">Click a product to view limits, exclusions, and submission details.</p>
          </div>
          <div className="carrier-product-list">
            {profile.productAppetite.map((item) => (
              <button
                key={item.id}
                type="button"
                className="carrier-product-row"
                onClick={() => setSelectedProduct(item)}
              >
                <div className="carrier-product-row-grid">
                  <div className="carrier-product-field">
                    <span className="carrier-product-label">Product</span>
                    <span className="carrier-product-value">{item.product}</span>
                  </div>
                  <div className="carrier-product-field">
                    <span className="carrier-product-label">Verticals</span>
                    <span className="carrier-product-value">{item.verticals.join(", ")}</span>
                  </div>
                  <div className="carrier-product-field">
                    <span className="carrier-product-label">Risk Type</span>
                    <span className={cn("badge", productRiskTypeClass[item.riskType])}>{item.riskType}</span>
                  </div>
                  <div className="carrier-product-field">
                    <span className="carrier-product-label">Status</span>
                    <span className={cn("badge", productAppetiteStatusClass[item.status])}>{item.status}</span>
                  </div>
                </div>
                <AppIcon name="chevron-down" size={16} strokeWidth={2} className="carrier-product-chevron" />
              </button>
            ))}
          </div>
        </section>

        <aside className="carrier-profile-sidebar">
          <section className="va-ops-panel" aria-label="Underwriting guidelines">
            <div className="va-ops-panel-header">
              <h3 className="va-ops-section-title">Underwriting Guidelines</h3>
              <p className="va-ops-section-sub">Quick fit check before submitting.</p>
            </div>
            <dl className="carrier-guidelines-list">
              <div>
                <dt>Minimum Premium</dt>
                <dd>{profile.underwritingGuidelines.minimumPremium}</dd>
              </div>
              <div>
                <dt>Max Revenue</dt>
                <dd>{profile.underwritingGuidelines.maxRevenue}</dd>
              </div>
              <div>
                <dt>Max Payroll</dt>
                <dd>{profile.underwritingGuidelines.maxPayroll}</dd>
              </div>
              <div>
                <dt>Years in Business</dt>
                <dd>{profile.underwritingGuidelines.yearsInBusiness}</dd>
              </div>
              <div>
                <dt>Loss History</dt>
                <dd>{profile.underwritingGuidelines.lossHistory}</dd>
              </div>
              <div>
                <dt>Excluded</dt>
                <dd>{profile.underwritingGuidelines.excludedRisks}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>

      <section className="va-ops-panel" aria-label="State availability">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">State Availability</h3>
          <p className="va-ops-section-sub">Regional appetite by state.</p>
        </div>
        <ul className="carrier-state-list">
          {profile.stateAvailability.map((item) => (
            <li key={item.id} className="carrier-state-item">
              <span className="carrier-state-name">{item.state}</span>
              <span className={cn("badge", stateAvailabilityClass[item.status])}>{item.status}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="carrier-profile-mid-grid">
        <section className="va-ops-panel" aria-label="Required documents">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Required Documents</h3>
            <p className="va-ops-section-sub">Submission readiness checklist.</p>
          </div>
          <ul className="carrier-doc-checklist">
            {profile.requiredDocuments.map((doc) => (
              <li key={doc} className="carrier-doc-checklist-item">
                <AppIcon name="check" size={16} strokeWidth={2.5} className="carrier-doc-check-icon" />
                {doc}
              </li>
            ))}
          </ul>
        </section>

        <section className="va-ops-panel" aria-label="Contacts">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Contacts</h3>
            <p className="va-ops-section-sub">MGA and underwriter access.</p>
          </div>
          <div className="carrier-contacts-list">
            {profile.contacts.map((contact) => (
              <article key={contact.id} className="carrier-contact-card">
                <h4 className="carrier-contact-name">{contact.name}</h4>
                <dl className="carrier-contact-details">
                  <div>
                    <dt>Role</dt>
                    <dd>{contact.role}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>
                      <a href={`mailto:${contact.email}`} className="carrier-contact-link">
                        {contact.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd>
                      <a href={`tel:${contact.phone.replace(/\D/g, "")}`} className="carrier-contact-link">
                        {contact.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Region</dt>
                    <dd>{contact.region}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="carrier-profile-mid-grid">
        <section className="va-ops-panel" aria-label="Internal notes">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Internal Notes</h3>
            <p className="va-ops-section-sub">Team intelligence and submission guidance.</p>
          </div>
          <ul className="carrier-notes-list">
            {profile.brokerNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        <section className="va-ops-panel" aria-label="Performance snapshot">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Performance Snapshot</h3>
            <p className="va-ops-section-sub">Recent submission performance with this carrier.</p>
          </div>
          <dl className="carrier-performance-grid">
            <div>
              <dt>Submissions Sent</dt>
              <dd>{performance.submissionsSent}</dd>
            </div>
            <div>
              <dt>Quotes Returned</dt>
              <dd>{performance.quotesReturned}</dd>
            </div>
            <div>
              <dt>Declines</dt>
              <dd>{performance.declines}</dd>
            </div>
            <div>
              <dt>Avg Turnaround</dt>
              <dd>{performance.avgTurnaround}</dd>
            </div>
            <div>
              <dt>Bind Wins</dt>
              <dd>{performance.bindWins}</dd>
            </div>
            <div>
              <dt>Win Rate</dt>
              <dd>{performance.winRate}</dd>
            </div>
          </dl>
        </section>
      </div>

      <CarrierProductDrawer
        product={selectedProduct}
        carrierName={profile.name}
        onClose={() => setSelectedProduct(null)}
        onStartSubmission={startSubmission}
      />
    </div>
  );
}
