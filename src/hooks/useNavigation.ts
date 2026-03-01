import { useState, useCallback } from "react";

export function useNavigation() {
  const [navStack, setNavStack] = useState<string[]>([]);

  const drillDown = useCallback((id: string, fromDepth?: number) => {
    setNavStack((prev) => {
      const base = fromDepth !== undefined ? prev.slice(0, fromDepth) : prev;
      return [...base, id];
    });
  }, []);

  const navigateToDepth = useCallback((depth: number) => {
    setNavStack((prev) => prev.slice(0, depth));
  }, []);

  const resetNavigation = useCallback(() => {
    setNavStack([]);
  }, []);

  return {
    navStack,
    setNavStack,
    drillDown,
    navigateToDepth,
    resetNavigation,
  };
}
