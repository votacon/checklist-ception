import { useState } from "react";
import { Plus } from "lucide-react";
import { s } from "../utils/styles";
import { useBarebones } from "../contexts/BarebonesContext";

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
        className={`flex-1 min-h-[44px] px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-transparent ${s(barebones, "input")}`}
      />
      <button
        type="submit"
        className={`min-h-[44px] min-w-[44px] flex items-center justify-center text-white ${s(barebones, "btn-primary")}`}
      >
        <Plus className="h-5 w-5" />
      </button>
    </form>
  );
}
