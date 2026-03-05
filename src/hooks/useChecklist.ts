import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import type { ChecklistItem, ItemColor } from "../types";
import {
  findNodeById,
  updateNodeById,
  deleteNodeById,
  reorderChildrenAtPath,
  nestChildAtPath,
  getBreadcrumbPath,
  getAllLevels,
  uncheckAll,
  moveNodeToPath,
} from "../utils/findNode";
import { downloadJson, downloadMarkdown } from "../utils/exportImport";
import { useNavigation } from "./useNavigation";

interface UseChecklistParams {
  initialItems: ChecklistItem[];
  onItemsChange: (items: ChecklistItem[]) => void;
  checklistTitle: string;
}

const MAX_HISTORY = 50;

export function useChecklist({
  initialItems,
  onItemsChange,
  checklistTitle,
}: UseChecklistParams) {
  const [rootItems, setRootItems] = useState<ChecklistItem[]>(initialItems);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const isInitialRender = useRef(true);

  // Undo/Redo history
  const historyRef = useRef<{ past: ChecklistItem[][]; future: ChecklistItem[][] }>({ past: [], future: [] });
  const isUndoRedoRef = useRef(false);
  const prevItemsRef = useRef(rootItems);

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

  // Track changes for undo/redo history
  useEffect(() => {
    const prev = prevItemsRef.current;
    prevItemsRef.current = rootItems;

    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }

    if (prev !== rootItems) {
      historyRef.current.past.push(prev);
      if (historyRef.current.past.length > MAX_HISTORY) {
        historyRef.current.past.shift();
      }
      historyRef.current.future = [];
    }
  }, [rootItems]);

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

  const setItemColor = useCallback((id: string, color: ItemColor | undefined) => {
    setRootItems((prev) =>
      updateNodeById(prev, id, (node) => ({
        ...node,
        color,
      })),
    );
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

  const resetChecks = useCallback(() => {
    setRootItems((prev) => uncheckAll(prev));
  }, []);

  const reorderItems = useCallback(
    (path: string[], fromIndex: number, toIndex: number) => {
      setRootItems((prev) => reorderChildrenAtPath(prev, path, fromIndex, toIndex));
    },
    [],
  );

  const nestItem = useCallback(
    (path: string[], sourceIndex: number, targetIndex: number) => {
      setRootItems((prev) => nestChildAtPath(prev, path, sourceIndex, targetIndex));
    },
    [],
  );

  const moveItemToPath = useCallback(
    (itemId: string, targetPath: string[], targetIndex: number) => {
      setRootItems((prev) => moveNodeToPath(prev, itemId, targetPath, targetIndex));
    },
    [],
  );

  // Export / Import
  const exportData = useCallback(() => {
    downloadJson(rootItems);
  }, [rootItems]);

  const exportMarkdown = useCallback(() => {
    downloadMarkdown(rootItems, checklistTitle);
  }, [rootItems, checklistTitle]);

  // Undo / Redo
  const undo = useCallback(() => {
    const h = historyRef.current;
    if (h.past.length === 0) return;
    const prev = h.past.pop()!;
    h.future.unshift(prevItemsRef.current);
    isUndoRedoRef.current = true;
    setRootItems(prev);
  }, []);

  const redo = useCallback(() => {
    const h = historyRef.current;
    if (h.future.length === 0) return;
    const next = h.future.shift()!;
    h.past.push(prevItemsRef.current);
    isUndoRedoRef.current = true;
    setRootItems(next);
  }, []);

  return {
    rootItems,
    navStack,
    editingItem,
    cardLevels,
    breadcrumbPath,
    addItem,
    toggleItem,
    deleteItem,
    setItemColor,
    startEdit,
    saveEdit,
    cancelEdit,
    drillDown,
    navigateToDepth,
    reorderItems,
    nestItem,
    moveItemToPath,
    resetChecks,
    setNavStack,
    navigateToRoot: resetNavigation,
    exportData,
    exportMarkdown,
    undo,
    redo,
  };
}
