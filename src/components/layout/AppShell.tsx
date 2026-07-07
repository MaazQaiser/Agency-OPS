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
import { AgencySidebar } from "./AgencySidebar";
import { AppTopNav } from "./AppTopNav";
import { GlobalFolioStrip } from "./GlobalFolioStrip";
import { MobileBottomNav } from "./MobileBottomNav";
import { SidebarNavProvider, useSidebarNav } from "./SidebarNavProvider";

type AppShellProps = {
  children: React.ReactNode;
};

function AppShellLayout({ children }: AppShellProps) {
  const { collapsed, hydrated } = useSidebarNav();

  return (
    <div
      className="app-shell"
      data-sidebar-collapsed={hydrated ? collapsed : undefined}
    >
      <Suspense fallback={null}>
        <CrossModuleLinkHandler />
      </Suspense>
      <Suspense fallback={null}>
        <AgencySidebar />
      </Suspense>
      <div className="app-shell-main">
        <Suspense fallback={null}>
          <AppTopNav />
        </Suspense>
        <GlobalFolioStrip />
        <main className="app-content">
          <ModuleAccessGate>
            <HubPageTransition>{children}</HubPageTransition>
          </ModuleAccessGate>
        </main>
      </div>
      <Suspense fallback={null}>
        <MobileBottomNav />
      </Suspense>
    </div>
  );
}

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
                <SidebarNavProvider>
                  <AppShellLayout>{children}</AppShellLayout>
                </SidebarNavProvider>
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
