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
} as const satisfies Record<string, ShortcutDefinition>;
