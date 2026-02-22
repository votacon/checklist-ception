import { useState } from "react";
import { Plus } from "lucide-react";

interface AddItemFormProps {
  onAdd: (text: string) => void;
}

export function AddItemForm({ onAdd }: AddItemFormProps) {
  const [text, setText] = useState("");

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
        className="flex-1 min-h-[44px] px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 transition-colors"
      >
        <Plus className="h-5 w-5" />
      </button>
    </form>
  );
}
