"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { defaultTrainingTags } from "@/data/trainingHubActions";

type ManageTagsModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (tags: string[]) => void;
};

export function ManageTagsModal({ open, onClose, onSave }: ManageTagsModalProps) {
  const [tags, setTags] = useState<string[]>(defaultTrainingTags);
  const [newTag, setNewTag] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setTags(defaultTrainingTags);
    setNewTag("");
    setEditingIndex(null);
    setEditingValue("");
    setError(null);

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

  if (!open) return null;

  const handleAdd = () => {
    const trimmed = newTag.trim();
    if (!trimmed) {
      setError("Enter a tag name.");
      return;
    }
    if (tags.some((tag) => tag.toLowerCase() === trimmed.toLowerCase())) {
      setError("This tag already exists.");
      return;
    }

    setTags((prev) => [...prev, trimmed]);
    setNewTag("");
    setError(null);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(tags[index]);
    setError(null);
  };

  const saveEdit = () => {
    if (editingIndex == null) return;

    const trimmed = editingValue.trim();
    if (!trimmed) {
      setError("Tag name cannot be empty.");
      return;
    }
    if (tags.some((tag, index) => index !== editingIndex && tag.toLowerCase() === trimmed.toLowerCase())) {
      setError("This tag already exists.");
      return;
    }

    setTags((prev) => prev.map((tag, index) => (index === editingIndex ? trimmed : tag)));
    setEditingIndex(null);
    setEditingValue("");
    setError(null);
  };

  const deleteTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditingValue("");
    }
    setError(null);
  };

  const handleSave = () => {
    onSave(tags);
    onClose();
  };

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close manage tags modal" onClick={onClose} />
      <div className="va-ops-modal va-ops-modal-wide" role="dialog" aria-modal="true" aria-label="Manage tags">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Manage Tags</h2>
            <p className="va-ops-modal-subtitle">Add, edit, or remove tags for Insurance Town training resources.</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-modal-body">
          <div className="training-hub-manage-add">
            <label className="intake-form-field training-hub-manage-add-field">
              <span className="intake-form-label">Add Tag</span>
              <input
                className="intake-form-input"
                value={newTag}
                onChange={(e) => {
                  setNewTag(e.target.value);
                  setError(null);
                }}
                placeholder="New tag name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
              />
            </label>
            <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={handleAdd}>
              Add
            </button>
          </div>

          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Tag</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {tags.map((tag, index) => (
                  <tr key={`${tag}-${index}`}>
                    <td>
                      {editingIndex === index ? (
                        <input
                          className="intake-form-input"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              saveEdit();
                            }
                          }}
                        />
                      ) : (
                        tag
                      )}
                    </td>
                    <td>
                      <div className="training-hub-manage-row-actions">
                        {editingIndex === index ? (
                          <button type="button" className="va-ops-action-btn" onClick={saveEdit}>Save</button>
                        ) : (
                          <button type="button" className="va-ops-action-btn" onClick={() => startEdit(index)}>Edit</button>
                        )}
                        <button type="button" className="va-ops-action-btn" onClick={() => deleteTag(index)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {error && <div className="add-market-alert add-market-alert-error">{error}</div>}
        </div>

        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
