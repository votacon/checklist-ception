import type { Checklist, ChecklistItem } from "../types";
import { isValidData } from "./validation";

export interface ChecklistExport {
  title: string;
  items: ChecklistItem[];
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

export function downloadAllJson(checklists: Checklist[]): void {
  const bundle: ChecklistExport[] = checklists.map((c) => ({
    title: c.title,
    items: c.items,
  }));
  const json = JSON.stringify(bundle, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = url;
  a.download = `checklist-ception-all-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function itemsToMarkdown(items: ChecklistItem[], indent: number): string {
  let md = "";
  const prefix = "  ".repeat(indent);
  for (const item of items) {
    const check = item.completed ? "x" : " ";
    md += `${prefix}- [${check}] ${item.text}\n`;
    if (item.subtasks.length > 0) {
      md += itemsToMarkdown(item.subtasks, indent + 1);
    }
  }
  return md;
}

export function downloadMarkdown(items: ChecklistItem[], title: string): void {
  const md = `# ${title}\n\n${itemsToMarkdown(items, 0)}`;
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "-").toLowerCase()}-${date}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportedJson(text: string): ChecklistItem[] | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (isValidData(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function isValidChecklistExport(item: unknown): item is ChecklistExport {
  if (typeof item !== "object" || item === null) return false;
  const obj = item as Record<string, unknown>;
  return typeof obj.title === "string" && isValidData(obj.items);
}

export function parseImportedBundleJson(text: string): ChecklistExport[] | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (
      Array.isArray(parsed) &&
      parsed.length > 0 &&
      parsed.every(isValidChecklistExport)
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
