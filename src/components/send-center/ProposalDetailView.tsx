"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  commEventTypeClass,
  computeEngagementScore,
  engagementScoreClass,
  getDynamicNextActions,
  getProposalDetail,
  getStickyBarActions,
  loadProposalOverrides,
  saveProposalOverrides,
  sourceTabLabels,
  type ProposalInternalNotes,
  type ProposalLifecycleStatus,
  type ProposalSourceTab,
  type WorkflowStepKey,
} from "@/data/sendCenterProposals";
import { routes } from "@/lib/routes";
import { toastMessages } from "@/lib/toastMessages";
import {
  crossModuleRoutes,
  navigateWithHandoff,
  resolvePaymentId,
} from "@/lib/crossModuleLinks";
import { cn } from "@/lib/cn";
import { ClientLanguageBadges, LanguageMismatchWarning } from "@/components/bilingual/ClientLanguageBadges";
import {
  getClientLanguage,
  getProposalLanguageMeta,
  getTranslatePairLabel,
  isProposalLanguageMismatch,
  translationStatusClass,
  translateLanguagePairs,
} from "@/data/bilingualClient";
import { SendCenterAiInsight } from "./SendCenterAiInsight";
import { ProposalWorkflowStepper } from "./ProposalWorkflowStepper";

type ProposalDetailViewProps = {
  proposalId: string;
  onToast: (message: string, variant?: "success" | "error") => void;
};

const backTabHref: Record<ProposalSourceTab, string> = {
  "draft-queue": routes.sendCenter,
  approved: `${routes.sendCenter}?view=approved`,
  sent: `${routes.sendCenter}?view=sent`,
};

const lifecycleBadgeClass: Record<ProposalLifecycleStatus, string> = {
  Draft: "badge-gray",
  "Pending Review": "badge-yellow",
  Approved: "badge-blue",
  Sent: "badge-blue",
  Negotiating: "badge-yellow",
  Bound: "badge-green",
};

function ProposalDetailSkeleton() {
  return (
    <div className="va-ops-role-view send-center-proposal-detail" aria-busy="true" aria-label="Loading proposal">
      <div className="send-center-proposal-skeleton-breadcrumb" />
      <div className="send-center-proposal-skeleton-header" />
      <div className="send-center-proposal-skeleton-panel" />
      <div className="send-center-proposal-grid">
        <div className="send-center-proposal-main">
          <div className="send-center-proposal-skeleton-panel" />
          <div className="send-center-proposal-skeleton-panel tall" />
          <div className="send-center-proposal-skeleton-panel tall" />
        </div>
        <div className="send-center-proposal-sidebar">
          <div className="send-center-proposal-skeleton-panel" />
          <div className="send-center-proposal-skeleton-panel" />
          <div className="send-center-proposal-skeleton-panel" />
        </div>
      </div>
    </div>
  );
}

export function ProposalDetailView({ proposalId, onToast }: ProposalDetailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = (searchParams.get("from") ?? "draft-queue") as ProposalSourceTab;
  const baseDetail = getProposalDetail(proposalId);

  const [loading, setLoading] = useState(true);
  const [lifecycleStatus, setLifecycleStatus] = useState<ProposalLifecycleStatus | null>(null);
  const [notes, setNotes] = useState<ProposalInternalNotes | null>(null);
  const [commSearch, setCommSearch] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, [proposalId]);

  useEffect(() => {
    if (!baseDetail) return;
    const overrides = loadProposalOverrides(baseDetail.id);
    setLifecycleStatus(overrides?.lifecycleStatus ?? baseDetail.lifecycleStatus);
    setNotes(overrides?.internalNotes ?? { ...baseDetail.internalNotes });
    setDirty(false);
    setCommSearch("");
  }, [baseDetail]);

  const detail = useMemo(() => {
    if (!baseDetail) return null;
    return {
      ...baseDetail,
      lifecycleStatus: lifecycleStatus ?? baseDetail.lifecycleStatus,
      internalNotes: notes ?? baseDetail.internalNotes,
    };
  }, [baseDetail, lifecycleStatus, notes]);

  const workflowTimestamps = useMemo(() => {
    if (!detail) return {};
    return Object.fromEntries(
      detail.statusTimeline.map((step) => [step.key, step.timestamp]),
    ) as Partial<Record<WorkflowStepKey, string>>;
  }, [detail]);

  const filteredCommunications = useMemo(() => {
    if (!detail) return [];
    const q = commSearch.trim().toLowerCase();
    if (!q) return detail.communications;
    return detail.communications.filter((entry) =>
      [entry.label, entry.eventType, entry.actor, entry.detail, entry.timestamp]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [detail, commSearch]);

  if (loading) {
    return <ProposalDetailSkeleton />;
  }

  if (!detail) {
    return (
      <div className="va-ops-role-view send-center-proposal-detail">
        <section className="va-ops-panel">
          <p>Proposal not found.</p>
          <button type="button" className="va-ops-role-action-btn" onClick={() => router.push(routes.sendCenter)}>
            Back to Send Center
          </button>
        </section>
      </div>
    );
  }

  const tabLabel = sourceTabLabels[from] ?? sourceTabLabels[detail.sourceTab];
  const backHref = backTabHref[from] ?? backTabHref[detail.sourceTab];
  const engagementScore = computeEngagementScore(detail.engagement);
  const baseNextActions = getDynamicNextActions(detail.lifecycleStatus);
  const nextActions =
    detail.lifecycleStatus === "Approved" ||
    detail.lifecycleStatus === "Sent" ||
    detail.lifecycleStatus === "Negotiating"
      ? [...baseNextActions, "Create Invoice"]
      : detail.lifecycleStatus === "Bound"
        ? [...baseNextActions, "Open Invoice"]
        : baseNextActions;
  const stickyActions = getStickyBarActions(detail.lifecycleStatus);
  const langProfile = getClientLanguage(detail.client);
  const proposalLang = getProposalLanguageMeta(detail.id);
  const langMismatch = proposalLang ? isProposalLanguageMismatch(proposalLang) : false;

  const handleAction = (action: string) => {
    if (action === "Save Changes") {
      handleSave();
      return;
    }
    if (action === "Mark Bound") {
      setLifecycleStatus("Bound");
      saveProposalOverrides(detail.id, { lifecycleStatus: "Bound", lastUpdated: new Date().toLocaleString() });
      onToast(`Marked bound — ${detail.client}`, "success");
      return;
    }
    if (action === "Create Invoice") {
      navigateWithHandoff(
        router,
        crossModuleRoutes.epayInvoiceBuilder({ handoff: "proposal-to-invoice", client: detail.client }),
        {
          type: "proposal-to-invoice",
          sourcePath: `${routes.sendCenterProposal(detail.id)}?from=${from}`,
          returnLabel: detail.client,
          payload: {
            client: detail.client,
            policy: detail.policyType,
            premium: detail.summary.premium,
            fees: detail.summary.brokerFee,
            proposalId: detail.id,
          },
        },
        { href: backHref, label: tabLabel },
      );
      return;
    }
    if (action === "Open Invoice") {
      const paymentId = resolvePaymentId(detail.client);
      router.push(
        crossModuleRoutes.epayPaymentTracker(paymentId, { href: backHref, label: tabLabel }),
      );
      return;
    }
    if (action === "Archive") {
      onToast(toastMessages.sendCenter.proposalArchived, "success");
      return;
    }
    onToast(`${action} — ${detail.client}`, "success");
  };

  const handleSave = () => {
    saveProposalOverrides(detail.id, {
      lifecycleStatus: detail.lifecycleStatus,
      internalNotes: detail.internalNotes,
      lastUpdated: new Date().toLocaleString(),
    });
    setDirty(false);
    onToast(toastMessages.sendCenter.draftSaved, "success");
  };

  const updateNoteField = (field: keyof ProposalInternalNotes, value: string) => {
    setNotes((prev) => {
      const base = prev ?? detail.internalNotes;
      return { ...base, [field]: value };
    });
    setDirty(true);
  };

  return (
    <div className="va-ops-role-view send-center-proposal-detail">
      <header className="send-center-proposal-header">
        <div className="send-center-proposal-header-left">
          <button type="button" className="training-detail-back" onClick={() => router.push(backHref)}>
            <AppIcon name="chevron-down" size={16} strokeWidth={2.5} className="training-back-icon" />
            Back
          </button>
          <div>
            <h2 className="va-ops-role-title">{detail.client}</h2>
            <p className="va-ops-role-subtitle">{detail.businessName}</p>
          </div>
        </div>
        <div className="send-center-proposal-header-meta">
          <span className={cn("badge", lifecycleBadgeClass[detail.lifecycleStatus])}>
            {detail.currentStatus}
          </span>
        </div>
      </header>

      <dl className="send-center-proposal-meta-grid">
        <div><dt>Policy Type</dt><dd>{detail.policyType}</dd></div>
        <div><dt>Producer</dt><dd>{detail.producer}</dd></div>
        <div><dt>Proposal ID</dt><dd>{detail.proposalNumber}</dd></div>
        <div><dt>Created</dt><dd>{detail.createdDate}</dd></div>
        <div><dt>Last Updated</dt><dd>{detail.lastUpdated}</dd></div>
        {detail.sentDate && (
          <div><dt>Sent Date</dt><dd>{detail.sentDate}</dd></div>
        )}
      </dl>

      {langMismatch && proposalLang && (
        <LanguageMismatchWarning
          message={`Proposal sent in ${proposalLang.proposalLanguage} — client prefers ${proposalLang.clientPreferredLanguage}.`}
        />
      )}

      <section className="va-ops-panel bilingual-proposal-panel" aria-label="Proposal language">
        <div className="send-center-proposal-card-header">
          <h3 className="send-center-section-title">Proposal Language</h3>
          <div className="bilingual-proposal-actions">
            {translateLanguagePairs.map(([from, to]) => (
              <button
                key={`${from}-${to}`}
                type="button"
                className="va-ops-action-btn"
                onClick={() => onToast(`Translating proposal ${getTranslatePairLabel(from, to)} — ${detail.client}`, "success")}
              >
                Translate {getTranslatePairLabel(from, to)}
              </button>
            ))}
          </div>
        </div>
        <dl className="send-center-proposal-meta-grid">
          <div><dt>Client Preferred</dt><dd>{langProfile.proposalLanguagePreference}</dd></div>
          <div><dt>Proposal Language</dt><dd>{proposalLang?.proposalLanguage ?? "English"}</dd></div>
          <div><dt>Translation Status</dt><dd><span className={cn("badge", proposalLang ? translationStatusClass[proposalLang.translationStatus] : "badge-gray")}>{proposalLang?.translationStatus ?? "Not Required"}</span></dd></div>
          <div><dt>Bilingual VA</dt><dd>{langProfile.assignedBilingualVa ?? "Unassigned"}</dd></div>
        </dl>
        <ClientLanguageBadges profile={langProfile} />
      </section>

      <div className="send-center-proposal-grid">
        <div className="send-center-proposal-main">
          <section className="va-ops-panel" aria-label="Proposal summary">
            <div className="send-center-proposal-card-header">
              <h3 className="send-center-section-title">Proposal Summary</h3>
              <button
                type="button"
                className="va-ops-action-btn"
                onClick={() => onToast(`Downloading PDF — ${detail.proposalNumber}`, "success")}
              >
                <AppIcon name="download" size={14} strokeWidth={2} />
                Download PDF
              </button>
            </div>
            <dl className="send-center-proposal-summary-grid">
              <div><dt>Carrier</dt><dd>{detail.summary.carrier}</dd></div>
              <div><dt>Product Type</dt><dd>{detail.summary.productType}</dd></div>
              <div><dt>Coverage Limit</dt><dd>{detail.summary.coverageLimit}</dd></div>
              <div><dt>Deductible</dt><dd>{detail.summary.deductible}</dd></div>
              <div><dt>Premium</dt><dd>{detail.summary.premium}</dd></div>
              <div><dt>Broker Fee</dt><dd>{detail.summary.brokerFee}</dd></div>
              <div><dt>Taxes</dt><dd>{detail.summary.taxes}</dd></div>
              <div><dt>Total Cost</dt><dd>{detail.summary.totalCost}</dd></div>
              <div><dt>Effective Date</dt><dd>{detail.summary.effectiveDate}</dd></div>
              <div><dt>Expiration Date</dt><dd>{detail.summary.expirationDate}</dd></div>
            </dl>
          </section>

          <section className="va-ops-panel send-center-proposal-stepper-panel" aria-label="Status timeline">
            <h3 className="send-center-section-title">Status Timeline</h3>
            <ProposalWorkflowStepper
              progress={detail.workflowProgress}
              timestamps={workflowTimestamps}
            />
          </section>

          <section className="va-ops-panel" aria-label="Communication history">
            <div className="send-center-proposal-card-header">
              <h3 className="send-center-section-title">Communication History</h3>
              <div className="send-center-proposal-comm-search">
                <AppIcon name="search" size={14} strokeWidth={2} />
                <input
                  type="search"
                  placeholder="Search events…"
                  value={commSearch}
                  onChange={(e) => setCommSearch(e.target.value)}
                  aria-label="Search communication history"
                />
              </div>
            </div>
            {detail.communications.length === 0 ? (
              <p className="send-center-proposal-empty">No communication events yet.</p>
            ) : filteredCommunications.length === 0 ? (
              <p className="send-center-proposal-empty">No events match your search.</p>
            ) : (
              <ol className="send-center-timeline">
                {filteredCommunications.map((entry) => (
                  <li key={entry.id} className="send-center-timeline-item">
                    <div className="send-center-timeline-dot" aria-hidden="true" />
                    <div className="send-center-timeline-content">
                      <div className="send-center-timeline-header">
                        <span className={cn("badge", commEventTypeClass[entry.eventType] ?? "badge-gray")}>
                          {entry.eventType}
                        </span>
                        <span className="send-center-timeline-time">{entry.timestamp}</span>
                      </div>
                      <div className="send-center-timeline-subject">{entry.label}</div>
                      <div className="send-center-timeline-detail">{entry.detail}</div>
                      <div className="send-center-timeline-actor">by {entry.actor}</div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="va-ops-panel" aria-label="Internal notes">
            <h3 className="send-center-section-title">Internal Notes</h3>
            <div className="send-center-proposal-notes-form">
              {(
                [
                  ["notes", "Notes"],
                  ["conditions", "Conditions"],
                  ["objections", "Objections"],
                  ["clientRequests", "Client Requests"],
                ] as const
              ).map(([field, label]) => (
                <div key={field} className="send-center-proposal-notes-field">
                  <label htmlFor={`proposal-note-${field}`}>{label}</label>
                  <textarea
                    id={`proposal-note-${field}`}
                    rows={field === "notes" ? 4 : 2}
                    value={detail.internalNotes[field]}
                    onChange={(e) => updateNoteField(field, e.target.value)}
                    placeholder={`Add ${label.toLowerCase()}…`}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="send-center-proposal-sidebar">
          <section className="va-ops-panel" aria-label="Client engagement">
            <div className="send-center-proposal-card-header">
              <h3 className="send-center-section-title">Client Engagement</h3>
              <span className={cn("badge", engagementScoreClass[engagementScore])}>
                {engagementScore}
              </span>
            </div>
            <dl className="send-center-proposal-engagement-grid">
              <div><dt>Delivered</dt><dd>{detail.engagement.delivered ? "Yes" : "No"}</dd></div>
              <div><dt>Opened count</dt><dd>{detail.engagement.openCount}</dd></div>
              <div><dt>Last viewed</dt><dd>{detail.engagement.lastViewed}</dd></div>
              <div><dt>Link clicks</dt><dd>{detail.engagement.linkClicks}</dd></div>
              <div><dt>Attachment downloads</dt><dd>{detail.engagement.attachmentDownloads}</dd></div>
              <div><dt>Response time</dt><dd>{detail.engagement.responseTime}</dd></div>
            </dl>
          </section>

          <SendCenterAiInsight insights={detail.aiInsights} />

          <section className="va-ops-panel" aria-label="Next actions">
            <h3 className="send-center-section-title">Next Actions</h3>
            {nextActions.length === 0 ? (
              <p className="send-center-proposal-empty">No actions available.</p>
            ) : (
              <div className="send-center-proposal-next-actions">
                {nextActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    className="va-ops-action-btn send-center-proposal-next-btn"
                    onClick={() => handleAction(action)}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>

      <footer className="send-center-proposal-sticky-bar">
        <div className="send-center-proposal-sticky-inner">
          {dirty && <span className="send-center-proposal-unsaved">Unsaved changes</span>}
          <button
            type="button"
            className="va-ops-action-btn send-center-proposal-save-btn"
            onClick={() => handleAction(stickyActions.primary)}
          >
            {stickyActions.primary}
          </button>
          {stickyActions.secondary.map((action) => (
            <button
              key={action}
              type="button"
              className="va-ops-action-btn"
              onClick={() => handleAction(action)}
            >
              {action}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
