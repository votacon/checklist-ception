import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Palette, Check } from "lucide-react";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";
import { THEME_ORDER, THEME_LABELS, type Theme } from "../types/theme";
import { Tooltip } from "./Tooltip";

const THEME_SWATCHES: Record<Theme, string[]> = {
  barebones: ["bg-white border border-black", "bg-gray-400", "bg-black"],
  fancy:     ["bg-blue-500", "bg-slate-200", "bg-slate-800"],
  vibrant:   ["bg-purple-500", "bg-pink-500", "bg-blue-500"],
  pastel:    ["bg-violet-300", "bg-rose-300", "bg-emerald-300"],
  playful:   ["bg-purple-500", "bg-teal-500", "bg-amber-500"],
  neon:      ["bg-cyan-400", "bg-pink-500", "bg-slate-800"],
};

export function ThemePicker() {
  const { theme, setTheme, isBarebones } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <Tooltip text="Theme" shortcut="B">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center ${s(theme, "theme-picker")}`}
          aria-label="Change theme"
        >
          <Palette className="h-5 w-5" />
        </button>
      </Tooltip>

      {isBarebones ? (
        open && (
          <div className={`absolute right-0 top-full mt-1 w-52 p-2 space-y-1 z-50 ${s(theme, "card")}`}>
            {THEME_ORDER.map((t) => (
              <button
                key={t}
                onClick={() => { setTheme(t); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${
                  t === theme ? s(theme, "sidebar-active") : `${s(theme, "text-body")} hover:bg-slate-50`
                }`}
              >
                <div className="flex gap-1">
                  {THEME_SWATCHES[t].map((swatch, i) => (
                    <span key={i} className={`h-3 w-3 rounded-full ${swatch}`} />
                  ))}
                </div>
                <span className="flex-1 text-left">{THEME_LABELS[t]}</span>
                {t === theme && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        )
      ) : (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className={`absolute right-0 top-full mt-1 w-52 p-2 space-y-1 z-50 ${s(theme, "card")}`}
            >
              {THEME_ORDER.map((t) => (
                <button
                  key={t}
                  onClick={() => { setTheme(t); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${s(theme, "row")} ${
                    t === theme ? s(theme, "sidebar-active") : `${s(theme, "text-body")} ${s(theme, "row-hover")}`
                  }`}
                >
                  <div className="flex gap-1">
                    {THEME_SWATCHES[t].map((swatch, i) => (
                      <span key={i} className={`h-3 w-3 rounded-full ${swatch}`} />
                    ))}
                  </div>
                  <span className="flex-1 text-left">{THEME_LABELS[t]}</span>
                  {t === theme && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
