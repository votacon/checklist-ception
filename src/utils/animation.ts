import type { Direction } from "../types";

export const slideVariants = {
  enter: (direction: Direction) => ({
    x: direction === "forward" ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: Direction) => ({
    x: direction === "forward" ? -300 : 300,
    opacity: 0,
  }),
};

export const slideTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};
