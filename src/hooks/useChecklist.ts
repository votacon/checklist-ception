import { useState, useMemo, useEffect, useCallback } from "react";
import type { ChecklistItem } from "../types";
import {
  findNodeById,
  updateNodeById,
  deleteNodeById,
  getItemsAtPath,
  getBreadcrumbPath,
} from "../utils/findNode";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { downloadJson, parseImportedJson } from "../utils/exportImport";

export type Direction = "forward" | "backward";

export function useChecklist() {
  const [rootItems, setRootItems] = useState<ChecklistItem[]>(() => {
    return loadFromStorage() ?? [];
  });
  const [navStack, setNavStack] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [direction, setDirection] = useState<Direction>("forward");

  // Persist on change
  useEffect(() => {
    saveToStorage(rootItems);
  }, [rootItems]);

  // Derived state
  const currentItems = useMemo(
    () => getItemsAtPath(rootItems, navStack),
    [rootItems, navStack],
  );

  const breadcrumbPath = useMemo(
    () => getBreadcrumbPath(rootItems, navStack),
    [rootItems, navStack],
  );

  // CRUD
  const addItem = useCallback(
    (text: string) => {
      const newItem: ChecklistItem = {
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
        subtasks: [],
      };

      if (navStack.length === 0) {
        setRootItems((prev) => [...prev, newItem]);
      } else {
        const parentId = navStack[navStack.length - 1];
        setRootItems((prev) =>
          updateNodeById(prev, parentId, (node) => ({
            ...node,
            subtasks: [...node.subtasks, newItem],
          })),
        );
      }
    },
    [navStack],
  );

  const toggleItem = useCallback((id: string) => {
    setRootItems((prev) =>
      updateNodeById(prev, id, (node) => ({
        ...node,
        completed: !node.completed,
      })),
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setRootItems((prev) => deleteNodeById(prev, id));
  }, []);

  const startEdit = useCallback(
    (id: string) => {
      const node = findNodeById(rootItems, id);
      if (node) setEditingItem(node);
    },
    [rootItems],
  );

  const saveEdit = useCallback(
    (newText: string) => {
      if (!editingItem) return;
      setRootItems((prev) =>
        updateNodeById(prev, editingItem.id, (node) => ({
          ...node,
          text: newText.trim(),
        })),
      );
      setEditingItem(null);
    },
    [editingItem],
  );

  const cancelEdit = useCallback(() => {
    setEditingItem(null);
  }, []);

  // Navigation
  const drillDown = useCallback((id: string) => {
    setDirection("forward");
    setNavStack((prev) => [...prev, id]);
  }, []);

  const navigateTo = useCallback(
    (index: number) => {
      if (index < navStack.length - 1) {
        setDirection("backward");
        setNavStack((prev) => prev.slice(0, index + 1));
      }
    },
    [navStack.length],
  );

  const navigateToRoot = useCallback(() => {
    if (navStack.length > 0) {
      setDirection("backward");
      setNavStack([]);
    }
  }, [navStack.length]);

  // Export / Import
  const exportData = useCallback(() => {
    downloadJson(rootItems);
  }, [rootItems]);

  const importData = useCallback((text: string): boolean => {
    const parsed = parseImportedJson(text);
    if (parsed) {
      setRootItems(parsed);
      setNavStack([]);
      return true;
    }
    return false;
  }, []);

  return {
    rootItems,
    navStack,
    editingItem,
    direction,
    currentItems,
    breadcrumbPath,
    addItem,
    toggleItem,
    deleteItem,
    startEdit,
    saveEdit,
    cancelEdit,
    drillDown,
    navigateTo,
    navigateToRoot,
    exportData,
    importData,
  };
}
