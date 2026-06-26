"use client";

import { Suspense } from "react";
import { GlobalSearchProvider } from "@/components/global-search/GlobalSearchProvider";
import { GlobalSyncProvider } from "@/components/sync/GlobalSyncProvider";
import { NotificationCenterProvider } from "@/components/notifications/NotificationCenterProvider";
import { AuditLogProvider } from "@/components/audit-log/AuditLogProvider";
import { OwnerQuickActionsProvider } from "@/components/owner-quick-actions/OwnerQuickActionsProvider";
import { AvatarProfileProvider } from "@/components/user-profile/AvatarProfileProvider";
import { CrossModuleLinkHandler } from "@/components/shared/CrossModuleLinkHandler";
import { ToastProvider } from "@/components/toast/ToastProvider";
import { KeyboardShortcutsProvider } from "@/components/keyboard/KeyboardShortcutsProvider";
import { PermissionProvider } from "@/components/permissions/PermissionProvider";
import { SubscriptionProvider } from "@/components/subscription/SubscriptionProvider";
import { ModuleAccessGate } from "@/components/permissions/ModuleAccessGate";
import { HubPageTransition } from "@/components/motion/HubPageTransition";
import { ContextualHelpProvider } from "@/components/help/ContextualHelpProvider";
import { TopHeader } from "./TopHeader";
import { MobileBottomNav } from "./MobileBottomNav";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <ToastProvider>
    <PermissionProvider>
      <SubscriptionProvider>
      <AvatarProfileProvider>
        <GlobalSearchProvider>
          <GlobalSyncProvider>
          <ContextualHelpProvider>
          <NotificationCenterProvider>
            <AuditLogProvider>
            <OwnerQuickActionsProvider>
              <KeyboardShortcutsProvider>
                <div className="app-shell">
                  <Suspense fallback={null}>
                    <CrossModuleLinkHandler />
                  </Suspense>
                  <div className="app-top-header-stack">
                    <Suspense fallback={<header className="app-top-header" aria-hidden="true" />}>
                      <TopHeader />
                    </Suspense>
                  </div>
                  <main className="app-content">
                    <ModuleAccessGate>
                      <HubPageTransition>{children}</HubPageTransition>
                    </ModuleAccessGate>
                  </main>
                  <Suspense fallback={null}>
                    <MobileBottomNav />
                  </Suspense>
                </div>
              </KeyboardShortcutsProvider>
            </OwnerQuickActionsProvider>
            </AuditLogProvider>
          </NotificationCenterProvider>
          </ContextualHelpProvider>
          </GlobalSyncProvider>
        </GlobalSearchProvider>
      </AvatarProfileProvider>
      </SubscriptionProvider>
    </PermissionProvider>
    </ToastProvider>
  );
}
