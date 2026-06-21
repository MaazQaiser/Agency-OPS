"use client";

import { useEffect } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { ReadyToBindItem } from "@/data/submissionTracker";

type BindPolicyConfirmModalProps = {
  open: boolean;
  item: ReadyToBindItem | null;
  onClose: () => void;
  onConfirm: (item: ReadyToBindItem) => void;
};

export function BindPolicyConfirmModal({ open, item, onClose, onConfirm }: BindPolicyConfirmModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !item) return null;

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close bind confirmation" onClick={onClose} />
      <div className="va-ops-modal" role="dialog" aria-modal="true" aria-label="Confirm policy bind">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Confirm Bind Policy</h2>
            <p className="va-ops-modal-subtitle">Issue policy for {item.client} with {item.carrier}.</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>
        <div className="va-ops-modal-body">
          <dl className="quote-review-producer-meta bind-confirm-meta">
            <div>
              <dt>Client</dt>
              <dd>{item.client}</dd>
            </div>
            <div>
              <dt>Carrier</dt>
              <dd>{item.carrier}</dd>
            </div>
            <div>
              <dt>Premium</dt>
              <dd>{item.premium}</dd>
            </div>
            <div>
              <dt>Broker Fee</dt>
              <dd>{item.brokerFee}</dd>
            </div>
            <div>
              <dt>Assigned VA</dt>
              <dd>{item.va}</dd>
            </div>
          </dl>
          <p className="va-ops-modal-subtitle">
            This will mark the submission as bound and remove it from the Ready to Bind queue.
          </p>
        </div>
        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={() => onConfirm(item)}>
            Confirm Bind
          </button>
        </div>
      </div>
    </div>
  );
}
