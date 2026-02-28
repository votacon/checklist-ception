import { useState, useCallback } from "react";

export function useNavigation() {
  const [navStack, setNavStack] = useState<string[]>([]);

  const drillDown = useCallback((id: string) => {
    setNavStack((prev) => [...prev, id]);
  }, []);

  const navigateToDepth = useCallback((depth: number) => {
    setNavStack((prev) => prev.slice(0, depth));
  }, []);

  const navigateToRoot = useCallback(() => {
    setNavStack([]);
  }, []);

  const resetNavigation = useCallback(() => {
    setNavStack([]);
  }, []);

  return {
    navStack,
    setNavStack,
    drillDown,
    navigateToDepth,
    navigateToRoot,
    resetNavigation,
  };
}
