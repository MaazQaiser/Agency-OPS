"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { intakeFormsTabs, type IntakeFormsTabId } from "@/data/intakeForms";
import { routes } from "@/lib/routes";
import { ModuleBreadcrumbBar } from "@/components/shared/ModuleBreadcrumbBar";
import { TabTransitionPanel } from "@/components/motion/TabTransitionPanel";
import { DraftsTab } from "./DraftsTab";
import { FormBuilderTab } from "./FormBuilderTab";
import { SubmissionHistoryTab } from "./SubmissionHistoryTab";
import { FormSelectorTab } from "./FormSelectorTab";
import { IntakeFormsPageHeader } from "./IntakeFormsPageHeader";

const validTabIds = new Set<string>(intakeFormsTabs.map((tab) => tab.id));

function resolveTab(view: string | null): IntakeFormsTabId {
  if (view === "builder") return "new-submission";
  if (view && validTabIds.has(view)) return view as IntakeFormsTabId;
  return "selector";
}

export function IntakeFormsModule() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = resolveTab(searchParams.get("view"));

  const setActive = useCallback(
    (tabId: IntakeFormsTabId) => {
      const href =
        tabId === "selector"
          ? routes.intakeForms
          : `${routes.intakeForms}?view=${tabId}`;
      router.push(href, { scroll: false });
    },
    [router],
  );

  return (
    <>
      <IntakeFormsPageHeader />
      <ModuleBreadcrumbBar />

      <nav className="va-ops-tab-nav" aria-label="Intake Forms views">
        {intakeFormsTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`va-ops-tab-btn${active === tab.id ? " active" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="va-ops-tab-content">
        <TabTransitionPanel tabKey={active}>
        {active === "selector" && <FormSelectorTab />}
        {active === "new-submission" && <FormBuilderTab />}
        {active === "drafts" && <DraftsTab />}
        {active === "history" && <SubmissionHistoryTab />}
        </TabTransitionPanel>
      </div>
    </>
  );
}
