import type { ChecklistItem } from "../types";

export function isValidItem(item: unknown): item is ChecklistItem {
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

export function isValidData(data: unknown): data is ChecklistItem[] {
  return Array.isArray(data) && data.every(isValidItem);
}
