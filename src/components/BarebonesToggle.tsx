import { Zap, ZapOff } from "lucide-react";
import { useBarebones } from "../contexts/BarebonesContext";

export function BarebonesToggle() {
  const { barebones, toggle } = useBarebones();

  return (
    <button
      onClick={toggle}
      className={`min-h-[44px] min-w-[44px] flex items-center justify-center ${
        barebones
          ? "border-2 border-gray-400 text-gray-600"
          : "rounded-xl text-slate-500 hover:text-slate-700 transition-colors"
      }`}
      aria-label={barebones ? "Switch to fancy mode" : "Switch to barebones mode"}
      title={barebones ? "Fancy mode" : "Barebones mode"}
    >
      {barebones ? <ZapOff className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
    </button>
  );
}
