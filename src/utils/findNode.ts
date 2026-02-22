import type { ChecklistItem } from "../types";

export function findNodeById(
  items: ChecklistItem[],
  id: string,
): ChecklistItem | undefined {
  for (const item of items) {
    if (item.id === id) return item;
    const found = findNodeById(item.subtasks, id);
    if (found) return found;
  }
  return undefined;
}

export function updateNodeById(
  items: ChecklistItem[],
  id: string,
  updater: (item: ChecklistItem) => ChecklistItem,
): ChecklistItem[] {
  return items.map((item) => {
    if (item.id === id) return updater(item);
    return { ...item, subtasks: updateNodeById(item.subtasks, id, updater) };
  });
}

export function deleteNodeById(
  items: ChecklistItem[],
  id: string,
): ChecklistItem[] {
  return items
    .filter((item) => item.id !== id)
    .map((item) => ({ ...item, subtasks: deleteNodeById(item.subtasks, id) }));
}

export function getItemsAtPath(
  items: ChecklistItem[],
  navStack: string[],
): ChecklistItem[] {
  let current = items;
  for (const id of navStack) {
    const node = current.find((item) => item.id === id);
    if (!node) return [];
    current = node.subtasks;
  }
  return current;
}

export function getBreadcrumbPath(
  items: ChecklistItem[],
  navStack: string[],
): { id: string; text: string }[] {
  const path: { id: string; text: string }[] = [];
  let current = items;
  for (const id of navStack) {
    const node = current.find((item) => item.id === id);
    if (!node) break;
    path.push({ id: node.id, text: node.text });
    current = node.subtasks;
  }
  return path;
}
