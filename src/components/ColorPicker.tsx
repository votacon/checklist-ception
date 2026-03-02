import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { ItemColor } from "../types";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";

interface ColorPickerProps {
  currentColor?: ItemColor;
  onSelect: (color: ItemColor | undefined) => void;
  onClose: () => void;
}

const COLORS: { value: ItemColor; bg: string }[] = [
  { value: "red", bg: "bg-red-500" },
  { value: "yellow", bg: "bg-yellow-400" },
  { value: "green", bg: "bg-green-500" },
  { value: "blue", bg: "bg-blue-500" },
  { value: "purple", bg: "bg-purple-500" },
];

export function ColorPicker({ currentColor, onSelect, onClose }: ColorPickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={`absolute right-0 top-full mt-1 z-50 flex items-center gap-1.5 p-2 ${s(theme, "card")} shadow-lg`}
    >
      {COLORS.map((c) => (
        <button
          key={c.value}
          onClick={() => { onSelect(c.value); onClose(); }}
          className={`h-5 w-5 rounded-full ${c.bg} ${
            currentColor === c.value ? "ring-2 ring-offset-1 ring-current" : ""
          }`}
          aria-label={`Set color ${c.value}`}
        />
      ))}
      {currentColor && (
        <button
          onClick={() => { onSelect(undefined); onClose(); }}
          className={`h-5 w-5 flex items-center justify-center ${s(theme, "icon-muted")} ${s(theme, "icon-hover")}`}
          aria-label="Clear color"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
