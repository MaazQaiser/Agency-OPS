"use client";

import { Suspense } from "react";
import { GlobalSearchPageHeader } from "./GlobalSearchPageHeader";
import { UniversalSearchTab } from "./UniversalSearchTab";

export function GlobalSearchModule() {
  return (
    <>
      <GlobalSearchPageHeader />
      <div className="va-ops-tab-content">
        <UniversalSearchTab />
      </div>
    </>
  );
}

export function GlobalSearchModuleShell() {
  return (
    <Suspense fallback={<div className="va-ops-tab-content" />}>
      <GlobalSearchModule />
    </Suspense>
  );
}
