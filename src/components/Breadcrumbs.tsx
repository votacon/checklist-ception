import { ChevronRight, Home } from "lucide-react";
import type { BreadcrumbItem } from "../types";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";
import { Tooltip } from "./Tooltip";

interface BreadcrumbsProps {
  path: BreadcrumbItem[];
  onNavigateToRoot: () => void;
  onNavigateToDepth: (depth: number) => void;
}

export function Breadcrumbs({
  path,
  onNavigateToRoot,
  onNavigateToDepth,
}: BreadcrumbsProps) {
  const { theme } = useTheme();

  if (path.length === 0) return null;

  return (
    <nav className={`flex items-center gap-1 text-sm ${s(theme, "text-muted")} overflow-x-auto scrollbar-hide`}>
      <Tooltip text="Go to root" shortcut="H">
        <button
          onClick={onNavigateToRoot}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center ${s(theme, "icon-muted")} ${s(theme, "icon-hover")} transition-colors shrink-0`}
          aria-label="Go to root"
        >
          <Home className="h-4 w-4" />
        </button>
      </Tooltip>

      {path.map((crumb, index) => (
        <span key={crumb.id} className="flex items-center gap-1 shrink-0">
          <ChevronRight className={`h-4 w-4 ${s(theme, "text-faint")}`} />
          {index < path.length - 1 ? (
            <button
              onClick={() => onNavigateToDepth(index + 1)}
              className={`min-h-[44px] px-2 flex items-center ${s(theme, "icon-hover")} transition-colors`}
            >
              {crumb.text}
            </button>
          ) : (
            <span className={`min-h-[44px] px-2 flex items-center font-medium ${s(theme, "text-heading")}`}>
              {crumb.text}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
