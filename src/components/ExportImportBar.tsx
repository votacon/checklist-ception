import { useRef } from "react";
import { Download, Upload } from "lucide-react";
import { useBarebones } from "../contexts/BarebonesContext";

interface ExportImportBarProps {
  onExport: () => void;
  onImport: (text: string) => boolean;
}

export function ExportImportBar({ onExport, onImport }: ExportImportBarProps) {
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

  const buttonClass = `min-h-[44px] px-4 flex items-center gap-2 text-slate-600 text-sm ${
    barebones
      ? "border-2 border-gray-400"
      : "rounded-xl border border-slate-200 hover:bg-white hover:border-slate-300 transition-colors"
  }`;

  return (
    <div className="flex gap-2">
      <button onClick={onExport} className={buttonClass}>
        <Download className="h-4 w-4" />
        Export
      </button>
      <button onClick={handleImportClick} className={buttonClass}>
        <Upload className="h-4 w-4" />
        Import
      </button>
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
