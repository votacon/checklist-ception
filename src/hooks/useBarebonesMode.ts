import { useState, useCallback } from "react";
import { STORAGE_KEYS } from "../utils/constants";

function loadBarebones(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.BAREBONES) === "true";
  } catch {
    return false;
  }
}

export function useBarebonesMode() {
  const [barebones, setBarebones] = useState(loadBarebones);

  const toggle = useCallback(() => {
    setBarebones((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.BAREBONES, String(next));
      } catch {
        // Storage unavailable — continue with in-memory state
      }
      return next;
    });
  }, []);

  return { barebones, toggle };
}
