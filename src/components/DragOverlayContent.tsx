import { GripVertical } from "lucide-react";
import type { ChecklistItem, ItemColor } from "../types";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";

const COLOR_DOT_CLASS: Record<ItemColor, string> = {
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
};

interface DragOverlayContentProps {
  item: ChecklistItem;
}

export function DragOverlayContent({ item }: DragOverlayContentProps) {
  const { theme } = useTheme();
  const subtaskCount = item.subtasks.length;

  return (
    <div
      className={`flex items-center gap-1.5 min-h-[40px] px-3 py-2 ${s(theme, "card")} shadow-lg opacity-90 cursor-grabbing`}
    >
      <span className={`flex items-center justify-center h-8 w-6 ${s(theme, "text-faint")}`}>
        <GripVertical className="h-4 w-4" />
      </span>

      {item.color && (
        <span className={`shrink-0 h-2.5 w-2.5 rounded-full ${COLOR_DOT_CLASS[item.color]}`} />
      )}

      <span className={`flex-1 text-lg ${item.completed ? `line-through ${s(theme, "text-muted")}` : s(theme, "text-body")}`}>
        {item.text}
      </span>

      {subtaskCount > 0 && (
        <span className={`text-xs ${s(theme, "text-muted")} px-2 py-0.5 ${s(theme, "badge")}`}>
          {subtaskCount}
        </span>
      )}
    </div>
  );
}
