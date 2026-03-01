import { ClipboardList } from "lucide-react";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";

export function EmptyState() {
  const { theme } = useTheme();

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${s(theme, "text-muted")}`}>
      <ClipboardList className="h-12 w-12 mb-3" />
      <p className="text-lg font-medium">No items yet</p>
      <p className="text-sm">Add one above to get started</p>
    </div>
  );
}
