import { ClipboardList } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
      <ClipboardList className="h-12 w-12 mb-3" />
      <p className="text-lg font-medium">No items yet</p>
      <p className="text-sm">Add one above to get started</p>
    </div>
  );
}
