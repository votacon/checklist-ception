import { Check, ChevronRight, Pencil, Trash2 } from "lucide-react";
import type { ChecklistItem as ChecklistItemType } from "../types";
import { useBarebones } from "../contexts/BarebonesContext";

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onDrillDown: (id: string) => void;
  isActive?: boolean;
  isCompact?: boolean;
}

export function ChecklistItemRow({
  item,
  onToggle,
  onDelete,
  onEdit,
  onDrillDown,
  isActive = false,
  isCompact = false,
}: ChecklistItemProps) {
  const subtaskCount = item.subtasks.length;
  const { barebones } = useBarebones();

  return (
    <div
      className={`group flex items-center gap-2 ${
        barebones ? "" : "rounded-xl transition-colors"
      } ${
        isActive
          ? "border-l-3 border-blue-500 bg-blue-50"
          : barebones ? "" : "hover:bg-slate-50"
      } ${isCompact ? "min-h-[36px] px-2 py-1" : "min-h-[44px] px-3 py-2"}`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(item.id)}
        className={`flex items-center justify-center ${
          isCompact
            ? "min-h-[36px] min-w-[36px]"
            : "min-h-[44px] min-w-[44px]"
        }`}
        aria-label={item.completed ? "Mark incomplete" : "Mark complete"}
      >
        <div
          className={`border-2 flex items-center justify-center ${
            barebones ? "" : "rounded-lg transition-colors"
          } ${
            isCompact ? "h-5 w-5" : "h-6 w-6"
          } ${
            item.completed
              ? "bg-blue-500 border-blue-500"
              : "border-slate-300 hover:border-blue-400"
          }`}
        >
          {item.completed && (
            <Check className={isCompact ? "h-3 w-3 text-white" : "h-4 w-4 text-white"} />
          )}
        </div>
      </button>

      {/* Text — click to drill down */}
      <button
        onClick={() => onDrillDown(item.id)}
        className={`flex-1 text-left flex items-center gap-2 ${
          isCompact ? "min-h-[36px]" : "min-h-[44px]"
        }`}
      >
        <span
          className={`${isCompact ? "text-sm" : "text-base"} ${
            item.completed ? "line-through text-slate-400" : "text-slate-900"
          } truncate`}
        >
          {item.text}
        </span>
        {subtaskCount > 0 && !isCompact && (
          <span className={`text-xs text-slate-400 px-2 py-0.5 ${
            barebones
              ? "border border-gray-400"
              : "rounded-full bg-slate-100"
          }`}>
            {subtaskCount}
          </span>
        )}
      </button>

      {/* Actions — hidden in compact mode */}
      {!isCompact && (
        <div className={`flex items-center gap-1 ${
          barebones ? "" : "opacity-0 group-hover:opacity-100 transition-opacity"
        }`}>
          <button
            onClick={() => onEdit(item.id)}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-blue-500 ${barebones ? "" : "transition-colors"}`}
            aria-label="Edit item"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-red-500 ${barebones ? "" : "transition-colors"}`}
            aria-label="Delete item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Drill-down arrow — hidden in compact mode */}
      {!isCompact && (
        <button
          onClick={() => onDrillDown(item.id)}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-300 hover:text-blue-500 ${barebones ? "" : "transition-colors"}`}
          aria-label="View subtasks"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
