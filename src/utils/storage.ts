import type { AppState, Checklist } from "../types";
import { isValidData } from "./validation";

const APP_STATE_KEY = "checklist-ception-app-state";
const LEGACY_KEY = "checklist-ception-data";

function createEmptyChecklist(title = "My Checklist"): Checklist {
  return {
    id: crypto.randomUUID(),
    title,
    items: [],
    createdAt: Date.now(),
  };
}

function isValidChecklist(value: unknown): value is Checklist {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.createdAt === "number" &&
    isValidData(obj.items)
  );
}

function isValidAppState(value: unknown): value is AppState {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.activeChecklistId === "string" &&
    Array.isArray(obj.checklists) &&
    obj.checklists.length > 0 &&
    obj.checklists.every(isValidChecklist)
  );
}

export function loadAppState(): AppState {
  try {
    // Try new key first
    const raw = localStorage.getItem(APP_STATE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isValidAppState(parsed)) return parsed;
    }

    // Try migrating legacy data
    const legacyRaw = localStorage.getItem(LEGACY_KEY);
    if (legacyRaw) {
      const legacyParsed: unknown = JSON.parse(legacyRaw);
      if (isValidData(legacyParsed)) {
        const checklist = createEmptyChecklist("My Checklist");
        checklist.items = legacyParsed;
        const state: AppState = {
          checklists: [checklist],
          activeChecklistId: checklist.id,
        };
        saveAppState(state);
        localStorage.removeItem(LEGACY_KEY);
        return state;
      }
    }
  } catch {
    // Fall through to fresh state
  }

  // Fresh state
  const checklist = createEmptyChecklist();
  return {
    checklists: [checklist],
    activeChecklistId: checklist.id,
  };
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — silently fail
  }
}
