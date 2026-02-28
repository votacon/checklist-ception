import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import type { ChecklistItem } from "../types";
import {
  findNodeById,
  updateNodeById,
  deleteNodeById,
  getItemsAtPath,
  getBreadcrumbPath,
} from "../utils/findNode";
import { downloadJson, parseImportedJson } from "../utils/exportImport";
import { useNavigation } from "./useNavigation";

interface UseChecklistParams {
  initialItems: ChecklistItem[];
  onItemsChange: (items: ChecklistItem[]) => void;
}

export function useChecklist({
  initialItems,
  onItemsChange,
}: UseChecklistParams) {
  const [rootItems, setRootItems] = useState<ChecklistItem[]>(initialItems);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const isInitialRender = useRef(true);

  const {
    navStack,
    direction,
    drillDown,
    navigateTo,
    navigateToRoot,
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
