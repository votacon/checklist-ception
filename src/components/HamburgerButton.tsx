import { Menu } from "lucide-react";
import { Tooltip } from "./Tooltip";

interface HamburgerButtonProps {
  onClick: () => void;
}

export function HamburgerButton({ onClick }: HamburgerButtonProps) {
  return (
    <Tooltip text="Toggle sidebar" shortcut="S">
      <button
        onClick={onClick}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>
    </Tooltip>
  );
}
