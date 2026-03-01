import { useEffect } from "react";
import { X } from "lucide-react";
import { SHORTCUTS } from "../utils/shortcuts";
import { s } from "../utils/styles";
import { useBarebones } from "../contexts/BarebonesContext";

interface ShortcutHelpOverlayProps {
  onClose: () => void;
}

const shortcutEntries = Object.values(SHORTCUTS);

export function ShortcutHelpOverlay({ onClose }: ShortcutHelpOverlayProps) {
  const { barebones } = useBarebones();

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
        className={`bg-white w-full max-w-sm p-6 space-y-4 ${s(barebones, "modal")}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 ${s(barebones, "btn-icon")}`}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-2">
          {shortcutEntries.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between py-1">
              <span className="text-sm text-slate-600">{shortcut.description}</span>
              <kbd className={`px-2 py-1 text-xs font-mono ${s(barebones, "kbd")}`}>
                {shortcut.label}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
