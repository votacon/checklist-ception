import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { SHORTCUTS } from "../utils/shortcuts";
import { s } from "../utils/styles";
import { useBarebones } from "../contexts/BarebonesContext";

const shortcutEntries = Object.values(SHORTCUTS);

export function ShortcutLegend() {
  const { barebones } = useBarebones();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-30 hidden lg:block">
      {open ? (
        <div className={`px-3 py-2 text-xs space-y-1 backdrop-blur-sm ${s(barebones, "tooltip")}`}>
          <button
            onClick={() => setOpen(false)}
            className="w-full text-right text-[10px] opacity-50 hover:opacity-100 cursor-pointer mb-1"
          >
            close
          </button>
          {shortcutEntries.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between gap-4">
              <span className="opacity-70">{shortcut.description}</span>
              <kbd className={`px-1.5 py-0.5 text-[10px] font-mono leading-none ${s(barebones, "kbd")}`}>
                {shortcut.label}
              </kbd>
            </div>
          ))}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className={`h-8 w-8 flex items-center justify-center cursor-pointer backdrop-blur-sm ${s(barebones, "tooltip")}`}
          aria-label="Show keyboard shortcuts"
        >
          <CircleHelp className="h-4 w-4 opacity-60" />
        </button>
      )}
    </div>
  );
}
