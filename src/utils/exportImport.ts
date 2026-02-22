import type { ChecklistItem } from "../types";

function isValidItem(item: unknown): item is ChecklistItem {
  if (typeof item !== "object" || item === null) return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.text === "string" &&
    typeof obj.completed === "boolean" &&
    Array.isArray(obj.subtasks) &&
    obj.subtasks.every(isValidItem)
  );
}

export function downloadJson(items: ChecklistItem[]): void {
  const json = JSON.stringify(items, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = url;
  a.download = `checklist-ception-export-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportedJson(text: string): ChecklistItem[] | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.every(isValidItem)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
