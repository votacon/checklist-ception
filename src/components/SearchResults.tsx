import { Check } from "lucide-react";
import type { SearchResult } from "../utils/search";
import type { ItemColor } from "../types";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";

const COLOR_DOT_CLASS: Record<ItemColor, string> = {
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
};

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: (path: string[]) => void;
  onToggle: (id: string) => void;
}

function HighlightedText({ text, ranges }: { text: string; ranges: SearchResult["ranges"] }) {
  const { theme } = useTheme();
  if (ranges.length === 0) return <>{text}</>;

  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  for (const range of ranges) {
    if (range.start > lastEnd) {
      parts.push(text.slice(lastEnd, range.start));
    }
    parts.push(
      <mark key={range.start} className={`${s(theme, "search-highlight")} rounded-sm`}>
        {text.slice(range.start, range.end)}
      </mark>,
    );
    lastEnd = range.end;
  }
  if (lastEnd < text.length) {
    parts.push(text.slice(lastEnd));
  }

  return <>{parts}</>;
}

export function SearchResults({ results, onSelect, onToggle }: SearchResultsProps) {
  const { theme } = useTheme();

  if (results.length === 0) {
    return (
      <div className={`p-8 text-center ${s(theme, "text-muted")}`}>
        No matching items found
      </div>
    );
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      {results.map((result) => (
        <div
          key={`${result.path.join("-")}-${result.item.id}`}
          className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${s(theme, "row")} ${s(theme, "row-hover")}`}
        >
          {/* Checkbox */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(result.item.id); }}
            className="flex items-center justify-center shrink-0 h-7 w-7"
          >
            <div
              className={`h-5 w-5 border-2 flex items-center justify-center ${s(theme, "checkbox")} ${
                result.item.completed
                  ? s(theme, "checkbox-checked")
                  : s(theme, "checkbox-unchecked")
              }`}
            >
              {result.item.completed && <Check className="h-3 w-3 text-white" />}
            </div>
          </button>

          {/* Content — click to navigate */}
          <button
            onClick={() => onSelect(result.path)}
            className="flex-1 min-w-0 text-left"
          >
            {result.pathTexts.length > 0 && (
              <div className={`text-xs truncate ${s(theme, "text-muted")}`}>
                {result.pathTexts.join(" › ")}
              </div>
            )}
            <div className={`flex items-center gap-1.5 ${
              result.item.completed ? `line-through ${s(theme, "text-muted")}` : s(theme, "text-body")
            }`}>
              {result.item.color && (
                <span className={`shrink-0 h-2 w-2 rounded-full ${COLOR_DOT_CLASS[result.item.color]}`} />
              )}
              <HighlightedText text={result.item.text} ranges={result.ranges} />
            </div>
          </button>
        </div>
      ))}
    </div>
  );
}
