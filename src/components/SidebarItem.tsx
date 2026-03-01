import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Checklist } from "../types";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";

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
  const { theme } = useTheme();

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
      className={`group flex items-center gap-2 min-h-[44px] px-3 py-2 cursor-pointer ${s(theme, "row")} ${
        isActive
          ? s(theme, "sidebar-active")
          : s(theme, "sidebar-inactive")
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
          className={`flex-1 min-w-0 px-2 py-1 text-sm ${s(theme, "text-body")} outline-none focus:ring-2 ${s(theme, "focus-ring")} ${s(theme, "input-inline")}`}
        />
      ) : (
        <>
          <span className="flex-1 min-w-0 text-sm font-medium break-words">
            {checklist.title}
          </span>
          {itemCount > 0 && (
            <span className={`text-xs ${s(theme, "text-muted")} px-2 py-0.5 shrink-0 ${s(theme, "badge")}`}>
              {itemCount}
            </span>
          )}
          <div className={`flex items-center gap-0.5 shrink-0 ${s(theme, "hover-reveal")}`}>
            <button
              onClick={handleStartEdit}
              className={`min-h-[32px] min-w-[32px] flex items-center justify-center ${s(theme, "icon-muted")} ${s(theme, "icon-hover")} ${s(theme, "btn-icon")}`}
              aria-label="Rename checklist"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            {!isLastChecklist && (
              <button
                onClick={handleDelete}
                className={`min-h-[32px] min-w-[32px] flex items-center justify-center ${s(theme, "icon-muted")} hover:text-red-500 ${s(theme, "btn-icon")}`}
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
