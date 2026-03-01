import { useRef } from "react";
import { Download, Upload, RotateCcw } from "lucide-react";
import { s } from "../utils/styles";
import { useBarebones } from "../contexts/BarebonesContext";
import { Tooltip } from "./Tooltip";

interface ExportImportBarProps {
  onExport: () => void;
  onImport: (text: string) => boolean;
  onResetChecks: () => void;
}

export function ExportImportBar({ onExport, onImport, onResetChecks }: ExportImportBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { barebones } = useBarebones();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        const success = onImport(text);
        if (!success) {
          alert("Invalid file format. Please select a valid Checklist-ception export.");
        }
      }
    };
    reader.readAsText(file);

    // Reset so the same file can be re-imported
    e.target.value = "";
  };

  const buttonClass = `min-h-[44px] px-4 flex items-center gap-2 text-slate-600 text-sm ${s(barebones, "btn-export")}`;

  return (
    <div className="flex gap-2">
      <Tooltip text="Export checklist" shortcut="E">
        <button onClick={onExport} className={buttonClass}>
          <Download className="h-4 w-4" />
          Export
        </button>
      </Tooltip>
      <Tooltip text="Import checklist">
        <button onClick={handleImportClick} className={buttonClass}>
          <Upload className="h-4 w-4" />
          Import
        </button>
      </Tooltip>
      <Tooltip text="Untick all checkboxes">
        <button onClick={onResetChecks} className={buttonClass}>
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </Tooltip>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
