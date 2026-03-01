import { Menu } from "lucide-react";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";
import { Tooltip } from "./Tooltip";

interface HamburgerButtonProps {
  onClick: () => void;
}

export function HamburgerButton({ onClick }: HamburgerButtonProps) {
  const { theme } = useTheme();

  return (
    <Tooltip text="Toggle sidebar" shortcut="S">
      <button
        onClick={onClick}
        className={`min-h-[44px] min-w-[44px] flex items-center justify-center ${s(theme, "hamburger")}`}
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>
    </Tooltip>
  );
}
