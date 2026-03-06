export interface ShortcutDefinition {
  key: string;
  label: string;
  description: string;
}

export const SHORTCUTS = {
  FOCUS_ADD_ITEM: { key: "a", label: "A", description: "Focus add-item input" },
  NEW_CHECKLIST: { key: "n", label: "N", description: "New checklist" },
  TOGGLE_SIDEBAR: { key: "s", label: "S", description: "Toggle sidebar" },
  NAVIGATE_BACK: { key: "Backspace", label: "⌫", description: "Go back one level" },
  NAVIGATE_HOME: { key: "h", label: "H", description: "Go to root" },
  CYCLE_THEME: { key: "b", label: "B", description: "Cycle theme" },
  EXPORT: { key: "e", label: "E", description: "Export checklist" },
  SHOW_HELP: { key: "?", label: "?", description: "Show keyboard shortcuts" },
  FOCUS_MODE: { key: "f", label: "F", description: "Toggle focus mode" },
  SEARCH: { key: "/", label: "/", description: "Search items" },
  ITEM_NAV: { key: "↑↓", label: "↑↓/JK", description: "Navigate items" },
  ITEM_ACTION: { key: "Enter", label: "Enter/→", description: "Drill into item" },
  ITEM_TOGGLE: { key: " ", label: "Space", description: "Toggle item" },
  UNDO: { key: "z", label: "Ctrl+Z", description: "Undo" },
  REDO: { key: "y", label: "Ctrl+Y", description: "Redo" },
} as const satisfies Record<string, ShortcutDefinition>;
