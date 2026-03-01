import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Plus } from "lucide-react";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";
import { Tooltip } from "./Tooltip";

export interface SidebarCreateFormHandle {
  startCreating: () => void;
}

interface SidebarCreateFormProps {
  onCreate: (title: string) => void;
}

export const SidebarCreateForm = forwardRef<SidebarCreateFormHandle, SidebarCreateFormProps>(
  function SidebarCreateForm({ onCreate }, ref) {
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const newTitleInputRef = useRef<HTMLInputElement>(null);
    const { theme } = useTheme();

    useImperativeHandle(ref, () => ({
      startCreating: () => setIsCreating(true),
    }));

    useEffect(() => {
      if (isCreating) {
        newTitleInputRef.current?.focus();
      }
    }, [isCreating]);

    const handleCreate = () => {
      const trimmed = newTitle.trim();
      if (trimmed) {
        onCreate(trimmed);
        setNewTitle("");
        setIsCreating(false);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCreate();
      } else if (e.key === "Escape") {
        setIsCreating(false);
        setNewTitle("");
      }
    };

    if (isCreating) {
      return (
        <div className="flex items-center gap-2">
          <input
            ref={newTitleInputRef}
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={() => {
              if (!newTitle.trim()) {
                setIsCreating(false);
                setNewTitle("");
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Checklist name…"
            className={`flex-1 min-w-0 px-3 py-2 text-sm outline-none focus:ring-2 ${s(theme, "focus-ring")} focus:border-transparent ${s(theme, "input")}`}
          />
        </div>
      );
    }

    return (
      <Tooltip text="New checklist" shortcut="N" position="top">
        <button
          onClick={() => setIsCreating(true)}
          className={`w-full min-h-[44px] flex items-center justify-center gap-2 text-sm font-medium ${s(theme, "accent-text")} ${s(theme, "btn-outline")}`}
        >
          <Plus className="h-4 w-4" />
          New Checklist
        </button>
      </Tooltip>
    );
  },
);
