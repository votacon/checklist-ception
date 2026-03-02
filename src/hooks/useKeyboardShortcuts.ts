import { useEffect, useRef } from "react";
import { SHORTCUTS } from "../utils/shortcuts";

interface KeyboardShortcutHandlers {
  onFocusAddItem: () => void;
  onNewChecklist: () => void;
  onToggleSidebar: () => void;
  onNavigateBack: () => void;
  onNavigateHome: () => void;
  onCycleTheme: () => void;
  onExport: () => void;
  onToggleHelp: () => void;
  onToggleFocusMode: () => void;
  onOpenSearch: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

function isInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd shortcuts — skip when input is focused to preserve native undo
      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        if (e.key === "f") {
          e.preventDefault();
          handlersRef.current.onOpenSearch();
          return;
        }
        if (isInputFocused()) return;
        const h = handlersRef.current;
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          h.onUndo();
          return;
        }
        if (e.key === "y" || (e.key === "z" && e.shiftKey) || (e.key === "Z" && e.shiftKey)) {
          e.preventDefault();
          h.onRedo();
          return;
        }
        return;
      }
      if (e.altKey) return;
      if (isInputFocused()) return;

      const h = handlersRef.current;

      switch (e.key) {
        case SHORTCUTS.FOCUS_ADD_ITEM.key:
          e.preventDefault();
          h.onFocusAddItem();
          break;
        case SHORTCUTS.NEW_CHECKLIST.key:
          e.preventDefault();
          h.onNewChecklist();
          break;
        case SHORTCUTS.TOGGLE_SIDEBAR.key:
          e.preventDefault();
          h.onToggleSidebar();
          break;
        case SHORTCUTS.NAVIGATE_BACK.key:
          e.preventDefault();
          h.onNavigateBack();
          break;
        case SHORTCUTS.NAVIGATE_HOME.key:
          e.preventDefault();
          h.onNavigateHome();
          break;
        case SHORTCUTS.CYCLE_THEME.key:
          e.preventDefault();
          h.onCycleTheme();
          break;
        case SHORTCUTS.EXPORT.key:
          e.preventDefault();
          h.onExport();
          break;
        case SHORTCUTS.SHOW_HELP.key:
          e.preventDefault();
          h.onToggleHelp();
          break;
        case SHORTCUTS.FOCUS_MODE.key:
          e.preventDefault();
          h.onToggleFocusMode();
          break;
        case SHORTCUTS.SEARCH.key:
          e.preventDefault();
          h.onOpenSearch();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
}
