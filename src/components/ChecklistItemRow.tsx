import { Check, ChevronRight, Pencil, Trash2 } from "lucide-react";
import type { ChecklistItem as ChecklistItemType } from "../types";

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onDrillDown: (id: string) => void;
}

export function ChecklistItemRow({
  item,
  onToggle,
  onDelete,
  onEdit,
  onDrillDown,
}: ChecklistItemProps) {
  const subtaskCount = item.subtasks.length;

  return (
    <div className="group flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
      {/* Checkbox */}
      <button
        onClick={() => onToggle(item.id)}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label={item.completed ? "Mark incomplete" : "Mark complete"}
      >
        <div
          className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
            item.completed
              ? "bg-blue-500 border-blue-500"
              : "border-slate-300 hover:border-blue-400"
          }`}
        >
          {item.completed && <Check className="h-4 w-4 text-white" />}
        </div>
      </button>

      {/* Text — click to drill down */}
      <button
        onClick={() => onDrillDown(item.id)}
        className="flex-1 text-left min-h-[44px] flex items-center gap-2"
      >
        <span
          className={`text-base ${
            item.completed ? "line-through text-slate-400" : "text-slate-900"
          }`}
        >
          {item.text}
        </span>
        {subtaskCount > 0 && (
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {subtaskCount}
          </span>
        )}
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(item.id)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors"
          aria-label="Edit item"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
          aria-label="Delete item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Drill-down arrow */}
      <button
        onClick={() => onDrillDown(item.id)}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-300 hover:text-blue-500 transition-colors"
        aria-label="View subtasks"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
