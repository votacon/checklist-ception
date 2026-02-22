import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbsProps {
  path: { id: string; text: string }[];
  onNavigateToRoot: () => void;
  onNavigateTo: (index: number) => void;
}

export function Breadcrumbs({
  path,
  onNavigateToRoot,
  onNavigateTo,
}: BreadcrumbsProps) {
  if (path.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-sm text-slate-500 overflow-x-auto pb-1">
      <button
        onClick={onNavigateToRoot}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors shrink-0"
        aria-label="Go to root"
      >
        <Home className="h-4 w-4" />
      </button>

      {path.map((crumb, index) => (
        <span key={crumb.id} className="flex items-center gap-1 shrink-0">
          <ChevronRight className="h-4 w-4 text-slate-300" />
          {index < path.length - 1 ? (
            <button
              onClick={() => onNavigateTo(index)}
              className="min-h-[44px] px-2 flex items-center hover:text-blue-500 transition-colors"
            >
              {crumb.text}
            </button>
          ) : (
            <span className="min-h-[44px] px-2 flex items-center font-medium text-slate-900">
              {crumb.text}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
