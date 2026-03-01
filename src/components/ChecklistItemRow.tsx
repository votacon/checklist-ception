import { Check, ChevronRight, GripVertical, Pencil, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ChecklistItem as ChecklistItemType } from "../types";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";

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
  const { theme } = useTheme();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-1.5 overflow-hidden ${s(theme, "row")} ${
        isActive
          ? s(theme, "row-active")
          : s(theme, "row-hover")
      } ${isCompact ? "min-h-[32px] px-2 py-1" : "min-h-[40px] px-3 py-2"} ${
        isDragging ? "opacity-50 z-50" : ""
      }`}
    >
      {/* Drag handle */}
      {!isCompact && (
        <button
          {...attributes}
          {...listeners}
          className={`flex items-center justify-center h-8 w-6 ${s(theme, "text-faint")} ${s(theme, "icon-hover")} cursor-grab active:cursor-grabbing ${s(theme, "hover-reveal")}`}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}

      {/* Checkbox */}
      <button
        onClick={() => onToggle(item.id)}
        className={`flex items-center justify-center shrink-0 ${
          isCompact
            ? "h-7 w-7"
            : "h-8 w-8"
        }`}
        aria-label={item.completed ? "Mark incomplete" : "Mark complete"}
      >
        <div
          className={`border-2 flex items-center justify-center ${s(theme, "checkbox")} ${
            isCompact ? "h-5 w-5" : "h-6 w-6"
          } ${
            item.completed
              ? s(theme, "checkbox-checked")
              : s(theme, "checkbox-unchecked")
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
        className={`flex-1 min-w-0 text-left flex items-center gap-2 ${
          isCompact ? "min-h-[32px]" : "min-h-[36px]"
        }`}
      >
        <span
          className={`${isCompact ? "text-sm" : "text-lg"} ${
            item.completed ? `line-through ${s(theme, "text-muted")}` : s(theme, "text-body")
          }`}
        >
          {item.text}
        </span>
        {subtaskCount > 0 && !isCompact && (
          <span className={`text-xs ${s(theme, "text-muted")} px-2 py-0.5 ${s(theme, "badge")}`}>
            {subtaskCount}
          </span>
        )}
      </button>

      {/* Actions — hidden in compact mode */}
      {!isCompact && (
        <div className={`flex items-center gap-1 ${s(theme, "hover-reveal")}`}>
          <button
            onClick={() => onEdit(item.id)}
            className={`h-7 w-7 flex items-center justify-center ${s(theme, "icon-muted")} ${s(theme, "icon-hover")} ${s(theme, "btn-icon")}`}
            aria-label="Edit item"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className={`h-7 w-7 flex items-center justify-center ${s(theme, "icon-muted")} hover:text-red-500 ${s(theme, "btn-icon")}`}
            aria-label="Delete item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Drill-down arrow — hidden in compact mode */}
      {!isCompact && (
        <button
          onClick={() => onDrillDown(item.id)}
          className={`h-7 w-7 flex items-center justify-center ${s(theme, "text-faint")} ${s(theme, "icon-hover")} ${s(theme, "btn-icon")}`}
          aria-label="View subtasks"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
