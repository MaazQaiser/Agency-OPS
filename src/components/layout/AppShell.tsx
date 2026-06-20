import { Suspense } from "react";
import { TopHeader } from "./TopHeader";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Suspense fallback={<header className="app-top-header" aria-hidden="true" />}>
        <TopHeader />
      </Suspense>
      <main className="app-content">{children}</main>
    </div>
  );
}
