import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { ChecklistItem } from "../types";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";

interface EditItemModalProps {
  item: ChecklistItem;
  onSave: (newText: string) => void;
  onCancel: () => void;
}

export function EditItemModal({ item, onSave, onCancel }: EditItemModalProps) {
  const [text, setText] = useState(item.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.focus();
      el.select();
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed) onSave(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        className={`w-full max-w-md p-6 space-y-4 ${s(theme, "modal")}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-semibold ${s(theme, "text-heading")}`}>Edit Item</h2>
          <button
            onClick={onCancel}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center ${s(theme, "icon-muted")} ${s(theme, "icon-close-hover")} ${s(theme, "btn-icon")}`}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            className={`w-full min-h-[44px] px-4 py-3 ${s(theme, "text-body")} resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${s(theme, "input")}`}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className={`min-h-[44px] px-4 ${s(theme, "btn-text")} ${s(theme, "btn-secondary")}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`min-h-[44px] px-4 text-white ${s(theme, "btn-primary")}`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
