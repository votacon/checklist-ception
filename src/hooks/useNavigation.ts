import { useState, useCallback } from "react";
import type { Direction } from "../types";

export function useNavigation() {
  const [navStack, setNavStack] = useState<string[]>([]);
  const [direction, setDirection] = useState<Direction>("forward");

  const drillDown = useCallback((id: string) => {
    setDirection("forward");
    setNavStack((prev) => [...prev, id]);
  }, []);

  const navigateTo = useCallback(
    (index: number) => {
      if (index < navStack.length - 1) {
        setDirection("backward");
        setNavStack((prev) => prev.slice(0, index + 1));
      }
    },
    [navStack.length],
  );

  const navigateToRoot = useCallback(() => {
    if (navStack.length > 0) {
      setDirection("backward");
      setNavStack([]);
    }
  }, [navStack.length]);

  const resetNavigation = useCallback(() => {
    setNavStack([]);
  }, []);

  return {
    navStack,
    direction,
    drillDown,
    navigateTo,
    navigateToRoot,
    resetNavigation,
  };
}
