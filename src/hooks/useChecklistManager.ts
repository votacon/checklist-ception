import { useState, useCallback, useMemo } from "react";
import type { AppState, Checklist, ChecklistItem } from "../types";
import { loadAppState, saveAppState } from "../utils/storage";

function persist(state: AppState): void {
  saveAppState(state);
}

export function useChecklistManager() {
  const [state, setState] = useState<AppState>(loadAppState);

  const activeChecklist = useMemo(
    () =>
      state.checklists.find((c) => c.id === state.activeChecklistId) ??
      state.checklists[0],
    [state],
  );

  const switchChecklist = useCallback((id: string) => {
    setState((prev) => {
      const next = { ...prev, activeChecklistId: id };
      persist(next);
      return next;
    });
  }, []);

  const createChecklist = useCallback((title: string) => {
    const newChecklist: Checklist = {
      id: crypto.randomUUID(),
      title: title.trim(),
      items: [],
      createdAt: Date.now(),
    };
    setState((prev) => {
      const next: AppState = {
        checklists: [...prev.checklists, newChecklist],
        activeChecklistId: newChecklist.id,
      };
      persist(next);
      return next;
    });
  }, []);

  const renameChecklist = useCallback((id: string, title: string) => {
    setState((prev) => {
      const next: AppState = {
        ...prev,
        checklists: prev.checklists.map((c) =>
          c.id === id ? { ...c, title: title.trim() } : c,
        ),
      };
      persist(next);
      return next;
    });
  }, []);

  const deleteChecklist = useCallback((id: string) => {
    setState((prev) => {
      if (prev.checklists.length <= 1) return prev;
      const remaining = prev.checklists.filter((c) => c.id !== id);
      const next: AppState = {
        checklists: remaining,
        activeChecklistId:
          prev.activeChecklistId === id
            ? remaining[0].id
            : prev.activeChecklistId,
      };
      persist(next);
      return next;
    });
  }, []);

  const updateActiveItems = useCallback((items: ChecklistItem[]) => {
    setState((prev) => {
      const next: AppState = {
        ...prev,
        checklists: prev.checklists.map((c) =>
          c.id === prev.activeChecklistId ? { ...c, items } : c,
        ),
      };
      persist(next);
      return next;
    });
  }, []);

  return {
    checklists: state.checklists,
    activeChecklist,
    switchChecklist,
    createChecklist,
    renameChecklist,
    deleteChecklist,
    updateActiveItems,
  };
}
