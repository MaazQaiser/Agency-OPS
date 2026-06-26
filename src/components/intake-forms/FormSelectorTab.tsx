"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  intakeFormCards,
  intakeFormsKpis,
  recentSubmissions,
  routingStatus,
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
          <div className="commercial-hub-kpi-grid intake-kpi-grid">
            {intakeFormsKpis.map((kpi) => (
              <VaOpsKpiCard key={kpi.label} {...kpi} />
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
              <article key={form.id} className="intake-form-card">
                <button
                  type="button"
                  className="intake-form-card-body"
                  onClick={() => setSelectedForm(form)}
                >
                  <div className="intake-form-card-icon" aria-hidden="true">
                    <AppIcon name={form.icon} size={24} strokeWidth={2} />
                  </div>
                  <h4 className="intake-form-card-title">{form.title}</h4>
                  <p className="intake-form-card-desc">{form.description}</p>
                  <dl className="intake-form-card-stats">
                    <div>
                      <dt>Submissions this month</dt>
                      <dd>{form.submissionsThisMonth}</dd>
                    </div>
                    <div>
                      <dt>Last submitted</dt>
                      <dd>{form.lastSubmitted}</dd>
                    </div>
                    <div>
                      <dt>Avg completion time</dt>
                      <dd>{form.avgCompletionTime}</dd>
                    </div>
                  </dl>
                </button>
                <button
                  type="button"
                  className="intake-form-card-cta"
                  onClick={() => startForm(form.id)}
                >
                  Start Form
                </button>
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
              <table className="commercial-hub-table">
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

          <section className="va-ops-panel" aria-label="Routing status">
            <div className="va-ops-panel-header">
              <h3 className="va-ops-section-title">Routing Status</h3>
              <p className="va-ops-section-sub">System health after form submit.</p>
            </div>
            <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
              <table className="commercial-hub-table">
                <thead>
                  <tr>
                    <th>System</th>
                    <th>Status</th>
                    <th>Last Sync</th>
                  </tr>
                </thead>
                <tbody>
                  {routingStatus.map((row) => (
                    <tr key={row.id}>
                      <td className="commercial-hub-client-cell">{row.system}</td>
                      <td><span className="badge badge-green">{row.status}</span></td>
                      <td>{row.lastSync}</td>
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
