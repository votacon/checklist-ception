import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import type { ChecklistItem } from "../types";
import {
  findNodeById,
  updateNodeById,
  deleteNodeById,
  reorderChildrenAtPath,
  getBreadcrumbPath,
  getAllLevels,
} from "../utils/findNode";
import { downloadJson, parseImportedJson } from "../utils/exportImport";
import { useNavigation } from "./useNavigation";

interface UseChecklistParams {
  initialItems: ChecklistItem[];
  onItemsChange: (items: ChecklistItem[]) => void;
  checklistTitle: string;
}

export function useChecklist({
  initialItems,
  onItemsChange,
  checklistTitle,
}: UseChecklistParams) {
  const [rootItems, setRootItems] = useState<ChecklistItem[]>(initialItems);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const isInitialRender = useRef(true);

  const {
    navStack,
    setNavStack,
    drillDown,
    navigateToDepth,
    resetNavigation,
  } = useNavigation();

  // Sync items up to parent (skip initial render to avoid circular updates)
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    onItemsChange(rootItems);
  }, [rootItems, onItemsChange]);

  // NavStack validation: truncate if tree mutations make an entry invalid
  useEffect(() => {
    let currentItems = rootItems;
    for (let i = 0; i < navStack.length; i++) {
      const node = currentItems.find((item) => item.id === navStack[i]);
      if (!node) {
        setNavStack(navStack.slice(0, i));
        return;
      }
      currentItems = node.subtasks;
    }
  }, [rootItems, navStack, setNavStack]);

  // Derived state
  const cardLevels = useMemo(
    () => getAllLevels(rootItems, navStack, checklistTitle),
    [rootItems, navStack, checklistTitle],
  );

  const breadcrumbPath = useMemo(
    () => getBreadcrumbPath(rootItems, navStack),
    [rootItems, navStack],
  );

  // CRUD — path-aware addItem
  const addItem = useCallback(
    (text: string, path: string[]) => {
      const newItem: ChecklistItem = {
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
        subtasks: [],
      };

      if (path.length === 0) {
        setRootItems((prev) => [...prev, newItem]);
      } else {
        const parentId = path[path.length - 1];
        setRootItems((prev) =>
          updateNodeById(prev, parentId, (node) => ({
            ...node,
            subtasks: [...node.subtasks, newItem],
          })),
        );
      }
    },
    [],
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

  const reorderItems = useCallback(
    (path: string[], fromIndex: number, toIndex: number) => {
      setRootItems((prev) => reorderChildrenAtPath(prev, path, fromIndex, toIndex));
    },
    [],
  );

  // Export / Import
  const exportData = useCallback(() => {
    downloadJson(rootItems);
  }, [rootItems]);

  const importData = useCallback(
    (text: string): boolean => {
      const parsed = parseImportedJson(text);
      if (parsed) {
        setRootItems(parsed);
        resetNavigation();
        return true;
      }
      return false;
    },
    [resetNavigation],
  );

  return {
    rootItems,
    navStack,
    editingItem,
    cardLevels,
    breadcrumbPath,
    addItem,
    toggleItem,
    deleteItem,
    startEdit,
    saveEdit,
    cancelEdit,
    drillDown,
    navigateToDepth,
    reorderItems,
    navigateToRoot: resetNavigation,
    exportData,
    importData,
  };
}
