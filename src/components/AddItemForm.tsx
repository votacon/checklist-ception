import { useState } from "react";
import { Plus } from "lucide-react";
import { s } from "../utils/styles";
import { useBarebones } from "../contexts/BarebonesContext";
import { Tooltip } from "./Tooltip";

interface AddItemFormProps {
  onAdd: (text: string) => void;
}

export function AddItemForm({ onAdd }: AddItemFormProps) {
  const [text, setText] = useState("");
  const { barebones } = useBarebones();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new item..."
        data-add-item-input
        className={`flex-1 h-8 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-transparent ${s(barebones, "input")}`}
      />
      <Tooltip text="Add item" shortcut="A">
        <button
          type="submit"
          className={`h-8 w-8 flex items-center justify-center text-white ${s(barebones, "btn-primary")}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </Tooltip>
    </form>
  );
}
