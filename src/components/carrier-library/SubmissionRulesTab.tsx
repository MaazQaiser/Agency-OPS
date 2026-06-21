"use client";

import { useRouter } from "next/navigation";
import { RoleTabHeader } from "@/components/va-operations/RoleTabHeader";
import { CardSkeletonGrid, KpiSkeletonGrid } from "@/components/shared/loading";
import { useTabLoading } from "@/hooks/useTabLoading";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import { crossModuleRoutes, navigateWithHandoff } from "@/lib/crossModuleLinks";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";
import {
  bindingRules,
  declineTriggers,
  requiredDocumentsByProduct,
  ruleStatusClass,
  specialCarrierConditions,
  submissionMethodMatrix,
  submissionRulesHeader,
  submissionRulesKpis,
} from "@/data/submissionRules";

export function SubmissionRulesTab() {
  const loading = useTabLoading();
  const router = useRouter();
  const toast = useToast();

  const applyRules = (product: string, documents: string[]) => {
    toast.success(toastMessages.carrierLibrary.rulesSaved, {
      action: {
        label: "View",
        onClick: () => {
          router.push(crossModuleRoutes.coverageChecklist({ product }));
        },
      },
    });
    navigateWithHandoff(
      router,
      crossModuleRoutes.coverageChecklist(
        { product, rules: documents.join(", ") },
        { href: `${routes.carrierLibrary}?view=rules`, label: "Submission Rules" },
      ),
      {
        type: "carrier-rules-to-checklist",
        sourcePath: `${routes.carrierLibrary}?view=rules`,
        returnLabel: "Submission Rules",
        payload: {
          product,
          documents: documents.join(", "),
        },
      },
      { href: `${routes.carrierLibrary}?view=rules`, label: "Submission Rules" },
    );
  };

  if (loading) {
    return (
      <div className="va-ops-role-view submission-rules">
        <KpiSkeletonGrid count={4} />
        <CardSkeletonGrid count={3} />
      </div>
    );
  }

  return (
    <div className="va-ops-role-view submission-rules">
      <RoleTabHeader
        title={submissionRulesHeader.title}
        subtitle={submissionRulesHeader.subtitle}
      />

      <section className="va-ops-kpi-strip" aria-label="Submission rules KPI summary">
        <div className="commercial-hub-kpi-grid carrier-kpi-grid">
          {submissionRulesKpis.map((kpi) => (
            <article key={kpi.label} className={cn("va-ops-kpi-card", kpi.color)}>
              <div className="va-ops-kpi-label">{kpi.label}</div>
              <div className="va-ops-kpi-value">{kpi.value}</div>
              <div className="va-ops-kpi-sub">{kpi.sub}</div>
              <div className="va-ops-kpi-helper">{kpi.helper}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="va-ops-panel" aria-label="Required documents by product">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Required Documents by Product</h3>
          <p className="va-ops-section-sub">Standard document requirements before carrier submission.</p>
        </div>
        <div className="commercial-hub-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Required Documents</th>
                <th>Status</th>
                <th>Notes</th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {requiredDocumentsByProduct.map((row) => (
                <tr key={row.id}>
                  <td className="commercial-hub-carrier-name">{row.product}</td>
                  <td>{row.documents.join(", ")}</td>
                  <td>
                    <span className={cn("badge", ruleStatusClass[row.status])}>{row.status}</span>
                  </td>
                  <td>{row.notes}</td>
                  <td>
                    <button
                      type="button"
                      className="va-ops-action-btn"
                      onClick={() => applyRules(row.product, row.documents)}
                    >
                      Apply Rules
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="va-ops-panel" aria-label="Binding rules">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Binding Rules</h3>
          <p className="va-ops-section-sub">Agency binding requirements and approval gates.</p>
        </div>
        <div className="commercial-hub-table-wrap">
          <table className="commercial-hub-table">
            <thead>
              <tr>
                <th>Rule</th>
                <th>Applies To</th>
                <th>Status</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {bindingRules.map((row) => (
                <tr key={row.id}>
                  <td className="commercial-hub-client-cell">{row.rule}</td>
                  <td>{row.appliesTo}</td>
                  <td>
                    <span className={cn("badge", ruleStatusClass[row.status])}>{row.status}</span>
                  </td>
                  <td>{row.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="commercial-hub-mid-grid">
        <section className="va-ops-panel" aria-label="Decline triggers">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Decline Triggers</h3>
            <p className="va-ops-section-sub">Conditions that block or restrict submission.</p>
          </div>
          <div className="commercial-hub-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Trigger</th>
                  <th>Severity</th>
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {declineTriggers.map((row) => (
                  <tr key={row.id}>
                    <td className="commercial-hub-client-cell">{row.trigger}</td>
                    <td>{row.severity}</td>
                    <td>{row.action}</td>
                    <td>
                      <span className={cn("badge", ruleStatusClass[row.status])}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="va-ops-panel" aria-label="Submission method matrix">
          <div className="va-ops-panel-header">
            <h3 className="va-ops-section-title">Submission Method Matrix</h3>
            <p className="va-ops-section-sub">Preferred submission channels by carrier and product.</p>
          </div>
          <div className="commercial-hub-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Carrier</th>
                  <th>Product</th>
                  <th>Method</th>
                  <th>Turnaround</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {submissionMethodMatrix.map((row) => (
                  <tr key={row.id}>
                    <td className="commercial-hub-carrier-name">{row.carrier}</td>
                    <td>{row.product}</td>
                    <td>{row.method}</td>
                    <td>{row.turnaround}</td>
                    <td>
                      <span className={cn("badge", ruleStatusClass[row.status])}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="va-ops-panel" aria-label="Special carrier conditions">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Special Carrier Conditions</h3>
          <p className="va-ops-section-sub">Carrier-specific overrides and market exceptions.</p>
        </div>
        <div className="carrier-recommended-grid">
          {specialCarrierConditions.map((item) => (
            <article key={item.id} className="carrier-recommended-card">
              <div className="submission-rules-card-top">
                <h4 className="carrier-recommended-label">{item.carrier}</h4>
                <span className={cn("badge", ruleStatusClass[item.status])}>{item.status}</span>
              </div>
              <p className="carrier-recommended-sub">{item.condition}</p>
              <div className="submission-rules-card-meta">Effective: {item.effective}</div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
