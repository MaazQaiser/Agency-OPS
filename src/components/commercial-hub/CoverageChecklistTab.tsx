"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  canMarkChecklistComplete,
  canSendToProducer,
  coverageChecklistHeader,
  getBindBlockers,
  getCoverageCompletion,
  getDocumentsStatus,
  getRecommendedCoverageItems,
  getRequiredCoverageItems,
  getRiskScoreFactors,
  getStageBadgeClass,
  type CoverageItemStatus,
  type CoverageReviewItem,
} from "@/data/coverageChecklist";
import {
  getLinkedSubmissionMarkets,
  markChecklistComplete,
  requiredMarketCount,
  saveCoverage,
  sendToProducer,
  uploadDocument,
} from "@/data/coverageChecklistActions";
import { KpiSkeletonGrid, TableSkeleton } from "@/components/shared/loading";
import { DataStateView, HubEmptyState, HubErrorState } from "@/components/state";
import { getCommercialHubSnapshot } from "@/data/commercialHubStore";
import { useCommercialHubStore } from "@/hooks/useCommercialHubStore";
import { useHubDataState } from "@/hooks/useHubDataState";
import { useToast } from "@/hooks/useToast";
import { useCrossModuleHandoff } from "@/hooks/useCrossModuleHandoff";
import { useSyncBreadcrumbDetail } from "@/hooks/useSyncBreadcrumbDetail";
import { routes } from "@/lib/routes";
import { toastMessages } from "@/lib/toastMessages";
import { cn } from "@/lib/cn";
import { AddCoverageModal } from "./AddCoverageModal";
import { CoverageDetailDrawer } from "./CoverageDetailDrawer";
import { SendToProducerModal } from "./SendToProducerModal";
import { UploadDocumentModal } from "./UploadDocumentModal";
import { MarketReadinessScore } from "./MarketReadinessScore";
import { computeMarketReadiness } from "@/lib/marketReadiness";
import { commercialHubTabHeaders } from "@/data/commercialHubTabHeaders";
import { coverageChecklistTabKpis } from "@/lib/commercialHubTabKpis";
import {
  CommercialHubKpiStrip,
  CommercialHubTabFooter,
  CommercialHubTabHeader,
  CommercialHubTabShell,
  CommercialHubWorkspace,
} from "./CommercialHubTabLayout";

const coverageStatusClass: Record<CoverageItemStatus, string> = {
  Completed: "badge-green",
  Pending: "badge-yellow",
  "Not Added": "badge-gray",
};

function getRiskLevelTag(score: number): { label: string; className: string } {
  if (score >= 75) return { label: "Low", className: "badge-green" };
  if (score >= 50) return { label: "Medium", className: "badge-yellow" };
  return { label: "High", className: "badge-red" };
}

function cell(value: string | number | undefined) {
  if (value == null || value === "") return "-";
  return value;
}

function CoverageReviewRows({
  items,
  onSelect,
}: {
  items: CoverageReviewItem[];
  onSelect: (item: CoverageReviewItem) => void;
}) {
  return items.map((item) => (
    <tr
      key={item.id}
      className="coverage-table-row"
      tabIndex={0}
      role="button"
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(item);
        }
      }}
    >
      <td>
        <span className={cn("badge", coverageStatusClass[item.status])}>{item.status}</span>
      </td>
      <td className="commercial-hub-client-cell">{item.name}</td>
      <td>{cell(item.carrier)}</td>
      <td>{cell(item.limit)}</td>
      <td>{cell(item.payroll)}</td>
      <td>{cell(item.vehicles)}</td>
      <td className={item.driverList === "Missing" ? "coverage-cell-warning" : ""}>
        {cell(item.driverList)}
      </td>
      <td>{cell(item.recommendation)}</td>
      <td>{item.notes}</td>
    </tr>
  ));
}

export function CoverageChecklistTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { checklistClients } = useCommercialHubStore();
  const {
    status,
    retry,
    lastSyncedAt,
    isStale,
    retrying,
  } = useHubDataState({
    load: () => getCommercialHubSnapshot().checklistClients,
    errorPreset: "agencyzoom-unavailable",
  });
  const initialClient = searchParams.get("client");
  const [clientId, setClientId] = useState(
    initialClient && checklistClients.some((c) => c.id === initialClient)
      ? initialClient
      : (checklistClients[0]?.id ?? ""),
  );
  const [selectedCoverage, setSelectedCoverage] = useState<CoverageReviewItem | null>(null);
  const [addCoverageOpen, setAddCoverageOpen] = useState(false);
  const [uploadDocOpen, setUploadDocOpen] = useState(false);
  const [sendProducerOpen, setSendProducerOpen] = useState(false);
  const reviewPanelRef = useRef<HTMLDivElement>(null);

  const onRulesHandoff = useCallback((payload: Record<string, string | undefined>) => {
    toast.success(
      `Submission rules applied: ${payload.product ?? "product"}: ${payload.documents ?? "checklist updated"}`,
    );
    reviewPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [toast]);

  useCrossModuleHandoff("carrier-rules-to-checklist", onRulesHandoff);

  const client = useMemo(
    () => checklistClients.find((row) => row.id === clientId) ?? checklistClients[0],
    [checklistClients, clientId],
  );

  useSyncBreadcrumbDetail(client?.clientName ?? null, {
    paramKey: "client",
    paramValue: client?.id,
  });

  if (!client) {
    return (
      <DataStateView
        status={status}
        lastSyncedAt={lastSyncedAt}
        isStale={isStale}
        showFreshness={false}
        loading={
          <div className="va-ops-role-view coverage-checklist">
            <KpiSkeletonGrid count={3} />
            <TableSkeleton rows={5} />
          </div>
        }
        empty={<HubEmptyState preset="commercial-submissions" />}
        error={
          <HubErrorState
            preset="agencyzoom-unavailable"
            onRetry={retry}
            retrying={retrying}
            lastSyncedAt={lastSyncedAt}
          />
        }
      >
        {null}
      </DataStateView>
    );
  }

  const marketReadiness = computeMarketReadiness(client);
  const completion = getCoverageCompletion(client);
  const blockers = getBindBlockers(client);
  const documentsStatus = getDocumentsStatus(client);
  const requiredItems = getRequiredCoverageItems(client);
  const recommendedItems = getRecommendedCoverageItems(client);
  const riskFactors = getRiskScoreFactors(client);
  const marketsSubmitted = getLinkedSubmissionMarkets(client.id);

  const handleQuickAction = (actionId: string) => {
    if (actionId === "add-coverage") {
      setAddCoverageOpen(true);
      return;
    }

    if (actionId === "upload-doc") {
      setUploadDocOpen(true);
      return;
    }

    if (actionId === "mark-complete") {
      const validation = canMarkChecklistComplete(client);
      if (!validation.ok) {
        toast.error(validation.error ?? "Cannot complete checklist.");
        return;
      }

      markChecklistComplete(client.id);
      toast.success(toastMessages.commercialHub.coverageUpdated);
      return;
    }

    if (actionId === "send-producer") {
      const validation = canSendToProducer(client, marketsSubmitted, requiredMarketCount);
      if (!validation.ok) {
        toast.error(
          validation.error ??
            "Submission must be complete and meet minimum market requirement before producer review.",
        );
        return;
      }

      setSendProducerOpen(true);
    }
  };

  const handleConfirmSendToProducer = () => {
    const validation = canSendToProducer(client, marketsSubmitted, requiredMarketCount);
    if (!validation.ok) {
      toast.error(
        validation.error ??
          "Submission must be complete and meet minimum market requirement before producer review.",
      );
      setSendProducerOpen(false);
      return;
    }

    sendToProducer(client.id);
    setSendProducerOpen(false);
    toast.success("Submission sent to producer");
  };

  return (
    <DataStateView
      status={status}
      lastSyncedAt={lastSyncedAt}
      isStale={isStale}
      showFreshness={false}
      loading={
        <div className="va-ops-role-view coverage-checklist">
          <KpiSkeletonGrid count={3} />
          <TableSkeleton rows={5} />
        </div>
      }
      empty={<HubEmptyState preset="commercial-submissions" />}
      error={
        <HubErrorState
          preset="agencyzoom-unavailable"
          onRetry={retry}
          retrying={retrying}
          lastSyncedAt={lastSyncedAt}
        />
      }
    >
    <CommercialHubTabShell className="coverage-checklist">
      <CommercialHubTabHeader
        title={commercialHubTabHeaders.checklist.title}
        subtitle={commercialHubTabHeaders.checklist.subtitle}
        actions={coverageChecklistHeader.quickActions.map((action, index) => ({
          ...action,
          variant: index === 0 ? "primary" as const : "secondary" as const,
        }))}
        onActionClick={handleQuickAction}
      />

      <CommercialHubKpiStrip kpis={coverageChecklistTabKpis(client)} columns={6} />

      <section className="va-ops-panel coverage-client-summary" aria-label="Client summary">
        <div className="coverage-client-summary-top">
          <div>
            <h3 className="coverage-client-name">{client.clientName}</h3>
            <p className="coverage-client-type">{client.businessType}</p>
          </div>
          <div className="coverage-client-summary-actions">
            <MarketReadinessScore score={marketReadiness} />
            <label className="coverage-client-switcher">
            <span className="coverage-client-switcher-label">Switch client</span>
            <select
              className="header-filter-select"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
              {checklistClients.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.clientName}
                </option>
              ))}
            </select>
          </label>
          </div>
        </div>
        <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table coverage-summary-table">
            <thead>
              <tr>
                <th>Current Stage</th>
                <th>Assigned VA</th>
                <th>Assigned Producer</th>
                <th>Renewal Date</th>
                <th>Estimated Premium</th>
                <th>Industry</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className={cn("badge", getStageBadgeClass(client.currentStage))}>
                    {client.currentStage}
                  </span>
                </td>
                <td>{client.assignedVa}</td>
                <td>{client.assignedProducer}</td>
                <td>{client.renewalDate}</td>
                <td className="commercial-hub-premium">{client.estimatedPremium}</td>
                <td>{client.businessType}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="va-ops-panel coverage-completion-panel" aria-label="Coverage completion">
        <div className="coverage-completion-header">
          <div>
            <h3 className="va-ops-section-title">Coverage Completion</h3>
            <p className="va-ops-section-sub">Required coverages validated before market submission.</p>
          </div>
          <div className="coverage-completion-count">
            {completion.completed} / {completion.total} Complete
          </div>
        </div>
        <div
          className="progress-bar coverage-completion-bar coverage-completion-clickable"
          role="button"
          tabIndex={0}
          aria-label="View incomplete coverages"
          onClick={() => reviewPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              reviewPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        >
          <div className="progress-fill" style={{ width: `${completion.percent}%` }} />
        </div>
      </section>

      <section className="va-ops-panel coverage-docs-status-panel" aria-label="Documents status">
        <div className="coverage-docs-status-header">
          <div>
            <h3 className="va-ops-section-title">Documents Status</h3>
            <p className="va-ops-section-sub">
              {documentsStatus.received} of {documentsStatus.total} received
            </p>
          </div>
          <button
            type="button"
            className="va-ops-action-btn"
            onClick={() => router.push(`${routes.commercialHub}?view=missing-docs`, { scroll: false })}
          >
            View Missing Docs
          </button>
        </div>
      </section>

      <section className="va-ops-panel coverage-risk-compact" aria-label="Risk overview">
        <div className="va-ops-panel-header">
          <h3 className="va-ops-section-title">Risk Overview</h3>
          <p className="va-ops-section-sub">Compact underwriting signals before market submission.</p>
        </div>
        <div className="coverage-risk-compact-grid">
          <article className="coverage-risk-score-card">
            <div className="coverage-risk-score-card-header">
              <div className="coverage-risk-score-card-label">Risk Score</div>
              <span className={cn("badge", getRiskLevelTag(client.riskOverview.riskScore.score).className)}>
                {getRiskLevelTag(client.riskOverview.riskScore.score).label}
              </span>
            </div>
            <div className="coverage-risk-score-card-value">
              {client.riskOverview.riskScore.score}/100
            </div>
            <div className="coverage-risk-meter" aria-hidden="true">
              <div
                className="coverage-risk-meter-fill"
                style={{ width: `${client.riskOverview.riskScore.score}%` }}
              />
            </div>
            <ul className="coverage-risk-score-card-metrics">
              <li><span>Claims history</span><strong>{client.riskOverview.claimsHistory}</strong></li>
              <li><span>Payroll</span><strong>{client.riskOverview.payroll}</strong></li>
              <li><span>Employee count</span><strong>{client.riskOverview.employeeCount}</strong></li>
            </ul>
          </article>
          <article className="coverage-risk-flags-card">
            <div className="coverage-risk-flags-card-label">Flags</div>
            <ul className="coverage-risk-flags-list">
              {client.riskOverview.riskFlags.map((flag) => (
                <li key={flag}>
                  <AppIcon name="triangle-alert" size={14} strokeWidth={2} />
                  {flag}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <CommercialHubWorkspace
        ariaLabel="Coverage review"
        title="Coverage Review"
        subtitle="Validate required coverage before sending to market: click a row for details."
      >
        <div ref={reviewPanelRef} className="commercial-hub-table-wrap ops-responsive-table-wrap">
          <table className="commercial-hub-table coverage-review-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Coverage</th>
                <th>Carrier</th>
                <th>Limit</th>
                <th>Payroll</th>
                <th>Vehicles</th>
                <th>Driver List</th>
                <th>Recommendation</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="coverage-group-header-row">
                <td colSpan={9}>Required Coverage</td>
              </tr>
              <CoverageReviewRows items={requiredItems} onSelect={setSelectedCoverage} />
              {recommendedItems.length > 0 && (
                <>
                  <tr className="coverage-group-header-row">
                    <td colSpan={9}>Recommended Coverage</td>
                  </tr>
                  <CoverageReviewRows items={recommendedItems} onSelect={setSelectedCoverage} />
                </>
              )}
            </tbody>
          </table>
        </div>
      </CommercialHubWorkspace>

      <CommercialHubTabFooter title="Bind Blockers" subtitle="Items blocking market submission.">
        {blockers.length === 0 ? (
          <p className="coverage-blockers-empty">No blockers: account is market ready.</p>
        ) : (
          <ul className="coverage-blockers-list">
            {blockers.map((blocker) => (
              <li key={blocker} className="coverage-blockers-item">
                <AppIcon name="triangle-alert" size={14} strokeWidth={2} />
                {blocker}
              </li>
            ))}
          </ul>
        )}
      </CommercialHubTabFooter>

      <AddCoverageModal
        open={addCoverageOpen}
        client={client}
        onClose={() => setAddCoverageOpen(false)}
        onSave={(payload) => saveCoverage(client.id, payload)}
      />

      <UploadDocumentModal
        open={uploadDocOpen}
        client={client}
        onClose={() => setUploadDocOpen(false)}
        onUpload={(payload) => {
          uploadDocument(client.id, payload);
          toast.success(toastMessages.commercialHub.missingDocResolved);
        }}
      />

      <SendToProducerModal
        open={sendProducerOpen}
        client={client}
        marketsSubmitted={marketsSubmitted}
        onClose={() => setSendProducerOpen(false)}
        onConfirm={handleConfirmSendToProducer}
      />

      <CoverageDetailDrawer
        coverage={selectedCoverage}
        clientName={client.clientName}
        onClose={() => setSelectedCoverage(null)}
      />
    </CommercialHubTabShell>
    </DataStateView>
  );
}
