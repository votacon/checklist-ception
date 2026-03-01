import { useState, useCallback } from "react";
import { STORAGE_KEYS } from "../utils/constants";
import { THEME_ORDER, type Theme } from "../types/theme";

const VALID_THEMES = new Set<string>(THEME_ORDER);

function loadTheme(): Theme {
  try {
    // Try new key first
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored && VALID_THEMES.has(stored)) {
      return stored as Theme;
    }
    // Migrate from old barebones key
    const oldKey = localStorage.getItem(STORAGE_KEYS.BAREBONES);
    if (oldKey !== null) {
      const migrated: Theme = oldKey === "true" ? "barebones" : "fancy";
      try {
        localStorage.setItem(STORAGE_KEYS.THEME, migrated);
        localStorage.removeItem(STORAGE_KEYS.BAREBONES);
      } catch {
        // Storage unavailable
      }
      return migrated;
    }
  } catch {
    // Storage unavailable
  }
  return "fancy";
}

export function useThemeMode() {
  const [theme, setThemeState] = useState<Theme>(loadTheme);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, next);
    } catch {
      // Storage unavailable
    }
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((prev) => {
      const idx = THEME_ORDER.indexOf(prev);
      const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
      try {
        localStorage.setItem(STORAGE_KEYS.THEME, next);
      } catch {
        // Storage unavailable
      }
      return next;
    });
  }, []);

  return { theme, setTheme, cycleTheme, isBarebones: theme === "barebones" };
}
