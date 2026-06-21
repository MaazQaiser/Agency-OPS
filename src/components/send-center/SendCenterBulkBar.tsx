type SendCenterBulkBarProps = {
  selectedCount: number;
  actions: readonly string[];
  onAction: (action: string) => void;
  onClear: () => void;
};

export function SendCenterBulkBar({ selectedCount, actions, onAction, onClear }: SendCenterBulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="send-center-bulk-bar" role="toolbar" aria-label="Bulk actions">
      <span className="send-center-bulk-count">{selectedCount} selected</span>
      <div className="send-center-bulk-actions">
        {actions.map((action) => (
          <button key={action} type="button" className="va-ops-action-btn" onClick={() => onAction(action)}>
            {action}
          </button>
        ))}
      </div>
      <button type="button" className="send-center-bulk-clear" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}

export function useBulkSelection<T extends { id: string }>() {
  const toggle = (ids: Set<string>, id: string): Set<string> => {
    const next = new Set(ids);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };

  const toggleAll = (ids: Set<string>, rows: T[]): Set<string> => {
    if (ids.size === rows.length) return new Set();
    return new Set(rows.map((r) => r.id));
  };

  return { toggle, toggleAll };
}
