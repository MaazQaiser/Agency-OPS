"use client";

import { Suspense } from "react";
import { GlobalSearchProvider } from "@/components/global-search/GlobalSearchProvider";
import { NotificationCenterProvider } from "@/components/notifications/NotificationCenterProvider";
import { OwnerQuickActionsProvider } from "@/components/owner-quick-actions/OwnerQuickActionsProvider";
import { AvatarProfileProvider } from "@/components/user-profile/AvatarProfileProvider";
import { CrossModuleLinkHandler } from "@/components/shared/CrossModuleLinkHandler";
import { ToastProvider } from "@/components/toast/ToastProvider";
import { KeyboardShortcutsProvider } from "@/components/keyboard/KeyboardShortcutsProvider";
import { PermissionProvider } from "@/components/permissions/PermissionProvider";
import { ModuleAccessGate } from "@/components/permissions/ModuleAccessGate";
import { TopHeader } from "./TopHeader";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <ToastProvider>
    <PermissionProvider>
      <AvatarProfileProvider>
        <GlobalSearchProvider>
          <NotificationCenterProvider>
            <OwnerQuickActionsProvider>
              <KeyboardShortcutsProvider>
                <div className="app-shell">
                  <Suspense fallback={null}>
                    <CrossModuleLinkHandler />
                  </Suspense>
                  <Suspense fallback={<header className="app-top-header" aria-hidden="true" />}>
                    <TopHeader />
                  </Suspense>
                  <main className="app-content">
                    <ModuleAccessGate>{children}</ModuleAccessGate>
                  </main>
                </div>
              </KeyboardShortcutsProvider>
            </OwnerQuickActionsProvider>
          </NotificationCenterProvider>
        </GlobalSearchProvider>
      </AvatarProfileProvider>
    </PermissionProvider>
    </ToastProvider>
  );
}
