"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import { defaultTrainingCategories } from "@/data/trainingHubActions";

type ManageCategoriesModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (categories: string[]) => void;
};

export function ManageCategoriesModal({ open, onClose, onSave }: ManageCategoriesModalProps) {
  const toast = useToast();
  const [categories, setCategories] = useState<string[]>(defaultTrainingCategories);
  const [newCategory, setNewCategory] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setCategories(defaultTrainingCategories);
    setNewCategory("");
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

  const handleCreate = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) {
      setError("Enter a category name.");
      return;
    }
    if (categories.some((category) => category.toLowerCase() === trimmed.toLowerCase())) {
      setError("This category already exists.");
      return;
    }

    setCategories((prev) => [...prev, trimmed]);
    setNewCategory("");
    setError(null);
  };

  const startRename = (index: number) => {
    setEditingIndex(index);
    setEditingValue(categories[index]);
    setError(null);
  };

  const saveRename = () => {
    if (editingIndex == null) return;

    const trimmed = editingValue.trim();
    if (!trimmed) {
      setError("Category name cannot be empty.");
      return;
    }
    if (
      categories.some(
        (category, index) => index !== editingIndex && category.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      setError("This category already exists.");
      return;
    }

    setCategories((prev) => prev.map((category, index) => (index === editingIndex ? trimmed : category)));
    setEditingIndex(null);
    setEditingValue("");
    setError(null);
  };

  const deleteCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditingValue("");
    }
    setError(null);
  };

  const handleSave = () => {
    onSave(categories);
    toast.success(toastMessages.training.categoryUpdated);
    onClose();
  };

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close manage categories modal" onClick={onClose} />
      <div className="va-ops-modal va-ops-modal-wide" role="dialog" aria-modal="true" aria-label="Manage categories">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Manage Categories</h2>
            <p className="va-ops-modal-subtitle">Create, rename, or delete Insurance Town department categories.</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-modal-body">
          <div className="training-hub-manage-add">
            <label className="intake-form-field training-hub-manage-add-field">
              <span className="intake-form-label">Create Category</span>
              <input
                className="intake-form-input"
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  setError(null);
                }}
                placeholder="New category name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreate();
                  }
                }}
              />
            </label>
            <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={handleCreate}>
              Create
            </button>
          </div>

          <div className="commercial-hub-table-wrap ops-responsive-table-wrap">
            <table className="commercial-hub-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={`${category}-${index}`}>
                    <td>
                      {editingIndex === index ? (
                        <input
                          className="intake-form-input"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              saveRename();
                            }
                          }}
                        />
                      ) : (
                        category
                      )}
                    </td>
                    <td>
                      <div className="training-hub-manage-row-actions">
                        {editingIndex === index ? (
                          <button type="button" className="va-ops-action-btn" onClick={saveRename}>Save</button>
                        ) : (
                          <button type="button" className="va-ops-action-btn" onClick={() => startRename(index)}>Rename</button>
                        )}
                        <button type="button" className="va-ops-action-btn" onClick={() => deleteCategory(index)}>Delete</button>
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
