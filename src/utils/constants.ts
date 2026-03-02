export const STORAGE_KEYS = {
  APP_STATE: "checklist-ception-app-state",
  BAREBONES: "checklist-ception-barebones",
  THEME: "checklist-ception-theme",
  LEGACY_DATA: "checklist-ception-data",
} as const;

export const CARD_LAYOUT = {
  COLLAPSED_WIDTH: "w-32",
  EXPANDED_WIDTH: "w-[48%]",
  FOCUS_WIDTH: "w-full max-w-2xl",
  COLLAPSE_THRESHOLD: 3,
} as const;

export const BREAKPOINTS = {
  DESKTOP: "(min-width: 1024px)",
} as const;
