"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  clientRoutingStatus,
  intakeFormCards,
  intakeFormsKpis,
  recentSubmissions,
  type IntakeFormCard,
  type SubmissionStatus,
} from "@/data/intakeForms";
import { routes } from "@/lib/routes";
import { VaOpsKpiCard } from "@/components/kpi/VaOpsKpiCard";
import { cn } from "@/lib/cn";
import { CardSkeletonGrid } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { useHubDataState } from "@/hooks/useHubDataState";
import { FormSelectorDrawer } from "./FormSelectorDrawer";

const submissionStatusClass: Record<SubmissionStatus, string> = {
  Routed: "badge-blue",
  "Pending Review": "badge-yellow",
  Completed: "badge-green",
  Failed: "badge-red",
};

const riskBadgeClass = {
  Low: "badge-green",
  Medium: "badge-amber",
  High: "badge-red",
} as const;

const routingStatusClass: Record<string, string> = {
  Sent: "badge-blue",
  Success: "badge-green",
  Pending: "badge-amber",
  Failed: "badge-red",
  Assigned: "badge-teal",
  Created: "badge-violet",
  Linked: "badge-green",
};

export function FormSelectorTab() {
  const router = useRouter();
  const [selectedForm, setSelectedForm] = useState<IntakeFormCard | null>(null);
  const {
    status,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => intakeFormCards,
    errorPreset: "supabase-timeout",
  });

  const startForm = (formId: IntakeFormCard["id"]) => {
    router.push(`${routes.intakeForms}?view=new-submission&form=${formId}`, { scroll: false });
  };

  const viewRecent = (formId: IntakeFormCard["id"]) => {
    router.push(`${routes.intakeForms}?view=history&form=${formId}`, { scroll: false });
  };

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <div className="va-ops-role-view intake-form-selector">
          <CardSkeletonGrid count={6} />
        </div>
      }
      empty={<HubEmptyState preset="intake-forms" />}
      error={
        <HubErrorState
          preset="supabase-timeout"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      }
    >
      <div className="va-ops-role-view intake-form-selector">
        <section className="va-ops-kpi-strip" aria-label="Intake forms KPI summary">
          <div className="commercial-hub-kpi-grid intake-kpi-grid hub-kpi-grid">
            {intakeFormsKpis.map((kpi) => (
              <VaOpsKpiCard
                key={kpi.label}
                {...kpi}
                className="commercial-hub-kpi-uniform"
                sparkline={false}
              />
            ))}
          </div>
        </section>

        <section className="va-ops-panel" aria-label="Form selection">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Select Intake Form</h3>
            <p className="va-ops-section-sub">Choose the correct form type to start a new submission.</p>
          </div>
          <div className="intake-form-card-grid">
            {intakeFormCards.map((form) => (
              <article key={form.id} className="intake-form-card intake-form-card--enriched">
                <button
                  type="button"
                  className="intake-form-card-body"
                  onClick={() => setSelectedForm(form)}
                >
                  <div className="intake-form-card-top">
                    <div className="intake-form-card-icon" aria-hidden="true">
                      <AppIcon name={form.icon} size={24} strokeWidth={2} />
                    </div>
                    <div className="intake-form-card-badges">
                      <span className={cn("badge", riskBadgeClass[form.riskCategory])}>
                        {form.riskCategory} Risk
                      </span>
                      {form.recommended && <span className="badge badge-blue">Recommended</span>}
                    </div>
                  </div>
                  <h4 className="intake-form-card-title">{form.title}</h4>
                  <p className="intake-form-card-desc">{form.description}</p>
                  <dl className="intake-form-card-metrics">
                    <div>
                      <dt>Submissions</dt>
                      <dd>{form.submissionsThisMonth}</dd>
                    </div>
                    <div>
                      <dt>Avg time</dt>
                      <dd>{form.avgCompletionTime}</dd>
                    </div>
                    <div>
                      <dt>Success</dt>
                      <dd>{form.successRate}%</dd>
                    </div>
                    <div>
                      <dt>Pending</dt>
                      <dd>{form.pendingReview}</dd>
                    </div>
                    <div>
                      <dt>Failed</dt>
                      <dd>{form.failedRoutes}</dd>
                    </div>
                  </dl>
                </button>
                <div className="intake-form-card-actions">
                  <button
                    type="button"
                    className="intake-form-card-cta"
                    onClick={() => startForm(form.id)}
                  >
                    Start Form
                  </button>
                  <button
                    type="button"
                    className="intake-form-card-cta-secondary"
                    onClick={() => viewRecent(form.id)}
                  >
                    View Recent
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="commercial-hub-mid-grid">
          <section className="va-ops-panel" aria-label="Recent intake activity">
            <div className="va-ops-panel-header">
              <h3 className="va-ops-section-title">Recent Intake Activity</h3>
              <p className="va-ops-section-sub">Latest submissions across all form types.</p>
            </div>
            <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
              <table className="commercial-hub-table intake-table-dense">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Form</th>
                    <th>Submitted By</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((row) => (
                    <tr key={row.id}>
                      <td className="commercial-hub-client-cell">{row.client}</td>
                      <td>{row.form}</td>
                      <td>{row.submittedBy}</td>
                      <td>{row.time}</td>
                      <td>
                        <span className={cn("badge", submissionStatusClass[row.status])}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="va-ops-panel" aria-label="Per-client routing status">
            <div className="va-ops-panel-header">
              <h3 className="va-ops-section-title">Routing Status</h3>
              <p className="va-ops-section-sub">Per-submission routing visibility across systems.</p>
            </div>
            <div className="commercial-hub-table-wrap ops-responsive-table-wrap intake-routing-table-wrap">
              <table className="commercial-hub-table intake-routing-table intake-table-dense">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>AgencyZoom</th>
                    <th>Slack</th>
                    <th>Monday</th>
                    <th>Producer</th>
                    <th>Send Center</th>
                    <th>Commercial Hub</th>
                  </tr>
                </thead>
                <tbody>
                  {clientRoutingStatus.map((row) => (
                    <tr key={row.id}>
                      <td className="commercial-hub-client-cell">{row.client}</td>
                      {row.steps.map((step) => (
                        <td key={`${row.id}-${step.system}`}>
                          <span className={cn("badge intake-routing-badge", routingStatusClass[step.status])}>
                            {step.status}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <FormSelectorDrawer form={selectedForm} onClose={() => setSelectedForm(null)} />
      </div>
    </DataStateView>
  );
}
