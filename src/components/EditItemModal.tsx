import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { ChecklistItem } from "../types";
import { useBarebones } from "../contexts/BarebonesContext";

interface EditItemModalProps {
  item: ChecklistItem;
  onSave: (newText: string) => void;
  onCancel: () => void;
}

export function EditItemModal({ item, onSave, onCancel }: EditItemModalProps) {
  const [text, setText] = useState(item.text);
  const inputRef = useRef<HTMLInputElement>(null);
  const { barebones } = useBarebones();

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
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
        className={`bg-white w-full max-w-md p-6 space-y-4 ${
          barebones
            ? "border-2 border-gray-400"
            : "rounded-2xl shadow-lg"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Edit Item</h2>
          <button
            onClick={onCancel}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 ${barebones ? "" : "transition-colors"}`}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full min-h-[44px] px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              barebones
                ? "border-2 border-gray-400 bg-white"
                : "rounded-xl border border-slate-200 bg-slate-50"
            }`}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className={`min-h-[44px] px-4 text-slate-600 ${
                barebones
                  ? "border-2 border-gray-400"
                  : "rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`min-h-[44px] px-4 text-white ${
                barebones
                  ? "bg-blue-600 border-2 border-blue-800"
                  : "rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-colors"
              }`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
