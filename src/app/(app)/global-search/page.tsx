import { Suspense } from "react";
import GlobalSearchRedirectPage from "./GlobalSearchRedirectClient";

export default function GlobalSearchPage() {
  return (
    <Suspense fallback={null}>
      <GlobalSearchRedirectPage />
    </Suspense>
  );
}
