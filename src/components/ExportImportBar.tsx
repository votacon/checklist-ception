import { useRef } from "react";
import { Download, Upload, RotateCcw, Archive } from "lucide-react";
import { s } from "../utils/styles";
import { useBarebones } from "../contexts/BarebonesContext";
import { Tooltip } from "./Tooltip";

interface ExportImportBarProps {
  onExport: () => void;
  onExportAll: () => void;
  onImport: (fileName: string, text: string) => boolean;
  onResetChecks: () => void;
}

export function ExportImportBar({ onExport, onExportAll, onImport, onResetChecks }: ExportImportBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { barebones } = useBarebones();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const readFile = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.readAsText(file);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const failed: string[] = [];
    for (const file of Array.from(files)) {
      const text = await readFile(file);
      if (typeof text === "string") {
        const success = onImport(file.name, text);
        if (!success) failed.push(file.name);
      }
    }

    if (failed.length > 0) {
      alert(`Invalid file format: ${failed.join(", ")}`);
    }

    // Reset so the same files can be re-imported
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
      <Tooltip text="Export all checklists">
        <button onClick={onExportAll} className={buttonClass}>
          <Archive className="h-4 w-4" />
          Export All
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
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
