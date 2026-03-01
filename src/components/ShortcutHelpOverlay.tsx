import { useEffect } from "react";
import { X } from "lucide-react";
import { SHORTCUTS } from "../utils/shortcuts";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";

interface ShortcutHelpOverlayProps {
  onClose: () => void;
}

const shortcutEntries = Object.values(SHORTCUTS);

export function ShortcutHelpOverlay({ onClose }: ShortcutHelpOverlayProps) {
  const { theme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-sm p-6 space-y-4 ${s(theme, "modal")}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-semibold ${s(theme, "text-heading")}`}>Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center ${s(theme, "icon-muted")} ${s(theme, "icon-close-hover")} ${s(theme, "btn-icon")}`}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-2">
          {shortcutEntries.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between py-1">
              <span className={`text-sm ${s(theme, "btn-text")}`}>{shortcut.description}</span>
              <kbd className={`px-2 py-1 text-xs font-mono ${s(theme, "kbd")}`}>
                {shortcut.label}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
