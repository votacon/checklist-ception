import type { ChecklistItem } from "../types";

const STORAGE_KEY = "checklist-ception-data";

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

function isValidData(data: unknown): data is ChecklistItem[] {
  return Array.isArray(data) && data.every(isValidItem);
}

export function loadFromStorage(): ChecklistItem[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (isValidData(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function saveToStorage(items: ChecklistItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — silently fail
  }
}
