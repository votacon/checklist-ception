import { X } from "lucide-react";
import type { Checklist } from "../types";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";

interface MoveItemModalProps {
  checklists: Checklist[];
  currentChecklistId: string;
  onSelect: (targetChecklistId: string) => void;
  onCancel: () => void;
}

export function MoveItemModal({ checklists, currentChecklistId, onSelect, onCancel }: MoveItemModalProps) {
  const { theme } = useTheme();
  const targets = checklists.filter((c) => c.id !== currentChecklistId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        className={`w-full max-w-sm p-6 space-y-4 ${s(theme, "modal")}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-semibold ${s(theme, "text-heading")}`}>Move to...</h2>
          <button
            onClick={onCancel}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center ${s(theme, "icon-muted")} ${s(theme, "icon-close-hover")} ${s(theme, "btn-icon")}`}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className={`divide-y ${s(theme, "divider")}`}>
          {targets.map((checklist) => (
            <button
              key={checklist.id}
              onClick={() => onSelect(checklist.id)}
              className={`w-full text-left px-3 py-3 ${s(theme, "text-body")} ${s(theme, "row-hover")} ${s(theme, "row")}`}
            >
              {checklist.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
