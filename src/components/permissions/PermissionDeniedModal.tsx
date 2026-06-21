"use client";

import { permissionLabels, type Permission } from "@/data/rolePermissions";
import { AppIcon } from "@/components/ui/AppIcon";

type PermissionDeniedModalProps = {
  permission: Permission | null;
  onClose: () => void;
};

export function PermissionDeniedModal({ permission, onClose }: PermissionDeniedModalProps) {
  if (!permission) return null;

  const label = permissionLabels[permission] ?? permission.replace("action:", "").replace("access:", "").replace(/-/g, " ");

  return (
    <div className="permission-denied-root" role="presentation">
      <button type="button" className="permission-denied-backdrop" aria-label="Close" onClick={onClose} />
      <div className="permission-denied-modal" role="alertdialog" aria-modal="true" aria-labelledby="permission-denied-title">
        <div className="permission-denied-icon" aria-hidden="true">
          <AppIcon name="shield" size={28} strokeWidth={2} />
        </div>
        <h2 id="permission-denied-title" className="permission-denied-title">Permission Required</h2>
        <p className="permission-denied-desc">
          Your current role does not have access to <strong>{label}</strong>.
        </p>
        <p className="permission-denied-hint">Contact the agency owner to request elevated permissions.</p>
        <div className="permission-denied-actions">
          <button type="button" className="va-ops-drawer-action-btn primary" onClick={onClose}>
            Contact Owner
          </button>
          <button type="button" className="va-ops-drawer-action-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
