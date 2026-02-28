import { Menu } from "lucide-react";

interface HamburgerButtonProps {
  onClick: () => void;
}

export function HamburgerButton({ onClick }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
      aria-label="Open sidebar"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}
