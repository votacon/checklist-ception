import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Checklist } from "../types";

interface SidebarItemProps {
  checklist: Checklist;
  isActive: boolean;
  isLastChecklist: boolean;
  onSwitch: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function SidebarItem({
  checklist,
  isActive,
  isLastChecklist,
  onSwitch,
  onRename,
  onDelete,
}: SidebarItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(checklist.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(checklist.title);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== checklist.title) {
      onRename(checklist.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${checklist.title}"? This cannot be undone.`)) {
      onDelete(checklist.id);
    }
  };

  const itemCount = checklist.items.length;

  return (
    <div
      onClick={() => !isEditing && onSwitch(checklist.id)}
      className={`group flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-xl cursor-pointer transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-700"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 px-2 py-1 rounded-lg border border-blue-300 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-400"
        />
      ) : (
        <>
          <span className="flex-1 min-w-0 truncate text-sm font-medium">
            {checklist.title}
          </span>
          {itemCount > 0 && (
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
              {itemCount}
            </span>
          )}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={handleStartEdit}
              className="min-h-[32px] min-w-[32px] flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors"
              aria-label="Rename checklist"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            {!isLastChecklist && (
              <button
                onClick={handleDelete}
                className="min-h-[32px] min-w-[32px] flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                aria-label="Delete checklist"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
