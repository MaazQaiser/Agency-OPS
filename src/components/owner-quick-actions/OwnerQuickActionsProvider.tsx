"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { useEntitlements } from "@/hooks/useEntitlements";
import {
  loadRecentActions,
  prependRecentAction,
  type OwnerQuickAction,
  type OwnerQuickActionModal,
  type OwnerRecentAction,
  type OwnerSummaryCard,
} from "@/data/ownerQuickActions";
import {
  evaActionModalConfig,
  type EvaQuickActionId,
} from "@/data/evaQuickActions";
import { useNotificationCenter } from "@/components/notifications/NotificationCenterProvider";
import { useToast } from "@/hooks/useToast";
import {
  OwnerActionModal,
  assignTaskFields,
  overridePriorityFields,
  reassignSubmissionFields,
} from "./OwnerActionModal";
import { OwnerQuickActionsPanel } from "./OwnerQuickActionsPanel";
import { EvaQuickActionsCluster } from "@/components/eva-quick-actions/EvaQuickActionsCluster";
import { EvaActionModal } from "@/components/eva-quick-actions/EvaActionModal";

type OwnerQuickActionsContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOwner: boolean;
};

const OwnerQuickActionsContext = createContext<OwnerQuickActionsContextValue | null>(null);

const modalConfig: Record<
  OwnerQuickActionModal,
  { title: string; fields: typeof assignTaskFields; submitLabel: string; successMessage: (v: Record<string, string>) => string }
> = {
  "assign-task": {
    title: "Assign Task",
    fields: assignTaskFields,
    submitLabel: "Assign",
    successMessage: (v) => `Task assigned to ${v.assignee ?? "team member"}`,
  },
  "reassign-submission": {
    title: "Reassign Submission",
    fields: reassignSubmissionFields,
    submitLabel: "Reassign",
    successMessage: (v) => `Submission reassigned to ${v.producer ?? "producer"}`,
  },
  "override-priority": {
    title: "Override Priority",
    fields: overridePriorityFields,
    submitLabel: "Apply Override",
    successMessage: (v) => `Priority set to ${v.priority ?? "updated"} for ${v.item ?? "item"}`,
  },
};

export function OwnerQuickActionsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { can, auditLog, logAudit } = usePermissions();
  const { hasFeature } = useEntitlements();
  const isOwner = can("action:owner-quick-actions");
  const isHubModule =
    pathname?.startsWith("/intake-forms") ||
    pathname?.startsWith("/training-hub") ||
    pathname?.startsWith("/carrier-library") ||
    pathname?.startsWith("/epay-policy");
  const showEvaCluster = isOwner || isHubModule;
  const showCoachesCorner = hasFeature("coaches-corner-ai");
  const { open: openNotifications } = useNotificationCenter();
  const toast = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentActions, setRecentActions] = useState<OwnerRecentAction[]>([]);
  const [activeModal, setActiveModal] = useState<OwnerQuickActionModal | null>(null);
  const [activeEvaAction, setActiveEvaAction] = useState<EvaQuickActionId | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const open = useCallback(() => {
    if (!isOwner) return;
    setIsOpen(true);
  }, [isOwner]);

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveModal(null);
  }, []);

  const closeFab = useCallback(() => {
    setFabOpen(false);
  }, []);

  const toggleFab = useCallback(() => {
    if (!showEvaCluster) return;
    setFabOpen((prev) => !prev);
  }, [showEvaCluster]);

  const toggle = useCallback(() => {
    if (!isOwner) return;
    setIsOpen((prev) => !prev);
  }, [isOwner]);

  useEffect(() => {
    setRecentActions(loadRecentActions());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 360);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    close();
    closeFab();
  }, [pathname, close, closeFab]);

  const recordAction = useCallback((description: string) => {
    setRecentActions(prependRecentAction(description));
  }, []);

  const handleAction = useCallback(
    (action: OwnerQuickAction) => {
      if (action.modal) {
        setActiveModal(action.modal);
        return;
      }
      if (action.route) {
        recordAction(action.label);
        close();
        router.push(action.route);
        toast.success(`${action.label}: opening`);
      }
    },
    [close, recordAction, router, toast],
  );

  const handleSummaryCard = useCallback(
    (card: OwnerSummaryCard) => {
      if (card.special === "open-notifications") {
        close();
        openNotifications();
        toast.success("Opening urgent notifications");
        return;
      }
      if (card.route) {
        recordAction(`Opened ${card.label}`);
        close();
        router.push(card.route);
        toast.success(`${card.label}: ${card.value} items`);
      }
    },
    [close, openNotifications, recordAction, router, toast],
  );

  const handleModalSubmit = useCallback(
    (values: Record<string, string>) => {
      if (!activeModal) return;
      const config = modalConfig[activeModal];
      const message = config.successMessage(values);
      recordAction(message);
      setActiveModal(null);
      close();
      toast.success(message);
    },
    [activeModal, close, recordAction, toast],
  );

  const handleEvaAction = useCallback((actionId: EvaQuickActionId) => {
    setActiveEvaAction(actionId);
    setFabOpen(false);
  }, []);

  const handleEvaModalSubmit = useCallback(
    (values: Record<string, string>) => {
      if (!activeEvaAction) return;
      const config = evaActionModalConfig[activeEvaAction];
      const message = config.successMessage(values);
      recordAction(message);
      setActiveEvaAction(null);
      toast.success(message);
      logAudit("approval-made", message);
    },
    [activeEvaAction, logAudit, recordAction, toast],
  );

  const contextValue = useMemo(
    () => ({ isOpen, open, close, toggle, isOwner }),
    [isOpen, open, close, toggle, isOwner],
  );

  const modalProps = activeModal ? modalConfig[activeModal] : null;
  const evaModalProps = activeEvaAction ? evaActionModalConfig[activeEvaAction] : null;

  return (
    <OwnerQuickActionsContext.Provider value={contextValue}>
      {children}
      {hydrated && showEvaCluster && (
        <EvaQuickActionsCluster
          open={fabOpen}
          onToggle={toggleFab}
          onClose={closeFab}
          onAction={handleEvaAction}
        />
      )}
      {hydrated && isOwner && isOpen && (
        <OwnerQuickActionsPanel
          loading={loading}
          recentActions={recentActions}
          auditLog={auditLog}
          onClose={close}
          onAction={handleAction}
          onSummaryCard={handleSummaryCard}
        />
      )}
      {modalProps && (
        <OwnerActionModal
          open={Boolean(activeModal)}
          title={modalProps.title}
          fields={modalProps.fields}
          submitLabel={modalProps.submitLabel}
          onClose={() => setActiveModal(null)}
          onSubmit={handleModalSubmit}
        />
      )}
      {evaModalProps && (
        <EvaActionModal
          open={Boolean(activeEvaAction)}
          title={evaModalProps.title}
          fields={evaModalProps.fields}
          submitLabel={evaModalProps.submitLabel}
          onClose={() => setActiveEvaAction(null)}
          onSubmit={handleEvaModalSubmit}
        />
      )}
    </OwnerQuickActionsContext.Provider>
  );
}

export function useOwnerQuickActions() {
  const ctx = useContext(OwnerQuickActionsContext);
  if (!ctx) throw new Error("useOwnerQuickActions must be used within OwnerQuickActionsProvider");
  return ctx;
}
