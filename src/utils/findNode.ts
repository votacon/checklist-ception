import type { ChecklistItem, BreadcrumbItem, CardLevel } from "../types";

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

export function getAllLevels(
  rootItems: ChecklistItem[],
  navStack: string[],
  rootTitle: string,
): CardLevel[] {
  const levels: CardLevel[] = [];
  let currentItems = rootItems;

  // Root level
  levels.push({
    depth: 0,
    parentId: null,
    title: rootTitle,
    items: currentItems,
    activeChildId: navStack.length > 0 ? navStack[0] : null,
  });

  // Each drill-down level
  for (let i = 0; i < navStack.length; i++) {
    const node = currentItems.find((item) => item.id === navStack[i]);
    if (!node) break;
    levels.push({
      depth: i + 1,
      parentId: node.id,
      title: node.text,
      items: node.subtasks,
      activeChildId: i + 1 < navStack.length ? navStack[i + 1] : null,
    });
    currentItems = node.subtasks;
  }

  return levels;
}

export function getBreadcrumbPath(
  items: ChecklistItem[],
  navStack: string[],
): BreadcrumbItem[] {
  const path: BreadcrumbItem[] = [];
  let current = items;
  for (const id of navStack) {
    const node = current.find((item) => item.id === id);
    if (!node) break;
    path.push({ id: node.id, text: node.text });
    current = node.subtasks;
  }
  return path;
}
