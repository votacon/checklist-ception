import type { ChecklistItem } from "../types";
import { isValidData } from "./validation";

const STORAGE_KEY = "checklist-ception-data";

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
