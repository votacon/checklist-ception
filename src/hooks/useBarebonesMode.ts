import { useState, useCallback } from "react";

const STORAGE_KEY = "checklist-ception-barebones";

function loadBarebones(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
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
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Storage unavailable — continue with in-memory state
      }
      return next;
    });
  }, []);

  return { barebones, toggle };
}
