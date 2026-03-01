import { useState, useCallback, useEffect } from "react";
import { BREAKPOINTS } from "../utils/constants";

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false); // mobile overlay
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop panel
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(BREAKPOINTS.DESKTOP).matches,
  );

  // Track viewport size changes
  useEffect(() => {
    const mq = window.matchMedia(BREAKPOINTS.DESKTOP);
    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      if (e.matches) setIsOpen(false); // close mobile overlay when switching to desktop
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const open = useCallback(() => {
    if (isDesktop) setIsCollapsed(false);
    else setIsOpen(true);
  }, [isDesktop]);

  const close = useCallback(() => {
    if (isDesktop) setIsCollapsed(true);
    else setIsOpen(false);
  }, [isDesktop]);

  const toggle = useCallback(() => {
    if (isDesktop) setIsCollapsed((prev) => !prev);
    else setIsOpen((prev) => !prev);
  }, [isDesktop]);

  // Lock body scroll only when mobile overlay is open
  useEffect(() => {
    if (!isDesktop && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isDesktop]);

  return { isOpen, isCollapsed, isDesktop, open, close, toggle };
}
