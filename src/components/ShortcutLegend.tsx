import { SHORTCUTS } from "../utils/shortcuts";
import { s } from "../utils/styles";
import { useBarebones } from "../contexts/BarebonesContext";

const shortcutEntries = Object.values(SHORTCUTS);

export function ShortcutLegend() {
  const { barebones } = useBarebones();

  return (
    <div className="fixed top-4 right-4 z-30 hidden lg:block">
      <div className={`px-3 py-2 text-xs space-y-1 bg-white/80 backdrop-blur-sm ${s(barebones, "tooltip")}`}>
        {shortcutEntries.map((shortcut) => (
          <div key={shortcut.key} className="flex items-center justify-between gap-4">
            <span className="opacity-70">{shortcut.description}</span>
            <kbd className={`px-1.5 py-0.5 text-[10px] font-mono leading-none ${s(barebones, "kbd")}`}>
              {shortcut.label}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
}
