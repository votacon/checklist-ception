import { useState } from "react";
import { Plus } from "lucide-react";
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
        className={`flex-1 min-h-[44px] px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          barebones
            ? "border-2 border-gray-400 bg-white"
            : "rounded-xl border border-slate-200 bg-slate-50"
        }`}
      />
      <button
        type="submit"
        className={`min-h-[44px] min-w-[44px] flex items-center justify-center text-white ${
          barebones
            ? "bg-blue-600 border-2 border-blue-800"
            : "rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-colors"
        }`}
      >
        <Plus className="h-5 w-5" />
      </button>
    </form>
  );
}
