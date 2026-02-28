export const cardVariants = {
  enter: {
    x: 300,
    opacity: 0,
    scale: 0.95,
  },
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: {
    x: 300,
    opacity: 0,
    scale: 0.95,
  },
};

export const cardTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};
