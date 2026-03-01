import { useEffect, useRef } from "react";
import { SHORTCUTS } from "../utils/shortcuts";

interface KeyboardShortcutHandlers {
  onFocusAddItem: () => void;
  onNewChecklist: () => void;
  onToggleSidebar: () => void;
  onNavigateBack: () => void;
  onNavigateHome: () => void;
  onToggleBarebones: () => void;
  onExport: () => void;
  onToggleHelp: () => void;
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
      if (e.ctrlKey || e.metaKey || e.altKey) return;
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
        case SHORTCUTS.TOGGLE_BAREBONES.key:
          e.preventDefault();
          h.onToggleBarebones();
          break;
        case SHORTCUTS.EXPORT.key:
          e.preventDefault();
          h.onExport();
          break;
        case SHORTCUTS.SHOW_HELP.key:
          e.preventDefault();
          h.onToggleHelp();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
}
