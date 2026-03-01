import type { ReactNode } from "react";
import { s } from "../utils/styles";
import { useBarebones } from "../contexts/BarebonesContext";

interface TooltipProps {
  text: string;
  shortcut?: string;
  position?: "top" | "bottom";
  children: ReactNode;
}

export function Tooltip({ text, shortcut, position = "bottom", children }: TooltipProps) {
  const { barebones } = useBarebones();

  const positionClasses = position === "top"
    ? "bottom-full mb-2"
    : "top-full mt-2";

  return (
    <span className="relative inline-flex group">
      {children}
      <span
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 ${positionClasses} px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity delay-300 z-50 ${s(barebones, "tooltip")}`}
      >
        {text}
        {shortcut && (
          <kbd className={`ml-1.5 px-1 py-0.5 text-[10px] font-mono ${s(barebones, "kbd")}`}>
            {shortcut}
          </kbd>
        )}
      </span>
    </span>
  );
}
