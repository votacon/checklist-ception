import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { s } from "../utils/styles";
import { useBarebones } from "../contexts/BarebonesContext";

interface SidebarCreateFormProps {
  onCreate: (title: string) => void;
}

export function SidebarCreateForm({ onCreate }: SidebarCreateFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const newTitleInputRef = useRef<HTMLInputElement>(null);
  const { barebones } = useBarebones();

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
          className={`flex-1 min-w-0 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${s(barebones, "input")}`}
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsCreating(true)}
      className={`w-full min-h-[44px] flex items-center justify-center gap-2 text-sm font-medium text-blue-600 ${s(barebones, "btn-outline")}`}
    >
      <Plus className="h-4 w-4" />
      New Checklist
    </button>
  );
}
