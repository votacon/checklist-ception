import { Zap, ZapOff } from "lucide-react";
import { s } from "../utils/styles";
import { useBarebones } from "../contexts/BarebonesContext";
import { Tooltip } from "./Tooltip";

export function BarebonesToggle() {
  const { barebones, toggle } = useBarebones();

  return (
    <Tooltip text={barebones ? "Fancy mode" : "Barebones mode"} shortcut="B">
      <button
        onClick={toggle}
        className={`min-h-[44px] min-w-[44px] flex items-center justify-center ${s(barebones, "barebones-toggle")}`}
        aria-label={barebones ? "Switch to fancy mode" : "Switch to barebones mode"}
      >
        {barebones ? <ZapOff className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
      </button>
    </Tooltip>
  );
}
