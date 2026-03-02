import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClose: () => void;
  resultCount: number;
}

export function SearchBar({ query, onQueryChange, onClose, resultCount }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-2 ${s(theme, "search-bar")}`}>
      <Search className={`h-4 w-4 shrink-0 ${s(theme, "icon-muted")}`} />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search items..."
        className={`flex-1 bg-transparent outline-none ${s(theme, "text-body")} placeholder:${s(theme, "text-muted")}`}
      />
      {query && (
        <span className={`text-xs shrink-0 ${s(theme, "text-muted")}`}>
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </span>
      )}
      <button
        onClick={onClose}
        className={`h-6 w-6 flex items-center justify-center shrink-0 ${s(theme, "icon-muted")} ${s(theme, "icon-close-hover")}`}
        aria-label="Close search"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
