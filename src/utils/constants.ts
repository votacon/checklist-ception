export const STORAGE_KEYS = {
  APP_STATE: "checklist-ception-app-state",
  BAREBONES: "checklist-ception-barebones",
  LEGACY_DATA: "checklist-ception-data",
} as const;

export const CARD_LAYOUT = {
  COLLAPSED_WIDTH: "w-48",
  EXPANDED_WIDTH: "w-80",
  COLLAPSE_THRESHOLD: 3,
} as const;

export const BREAKPOINTS = {
  DESKTOP: "(min-width: 1024px)",
} as const;
