import type { ChecklistItem, ItemColor } from "../types";

const VALID_COLORS: ItemColor[] = ["red", "yellow", "green", "blue", "purple"];

export function isValidItem(item: unknown): item is ChecklistItem {
  if (typeof item !== "object" || item === null) return false;
  const obj = item as Record<string, unknown>;
  if (
    typeof obj.id !== "string" ||
    typeof obj.text !== "string" ||
    typeof obj.completed !== "boolean" ||
    !Array.isArray(obj.subtasks) ||
    !obj.subtasks.every(isValidItem)
  ) {
    return false;
  }
  if (obj.color !== undefined && !VALID_COLORS.includes(obj.color as ItemColor)) {
    return false;
  }
  return true;
}

export function isValidData(data: unknown): data is ChecklistItem[] {
  return Array.isArray(data) && data.every(isValidItem);
}
