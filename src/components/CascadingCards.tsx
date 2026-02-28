import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { CardLevel } from "../types";
import { cardVariants, cardTransition } from "../utils/animation";
import { ChecklistCard } from "./ChecklistCard";

interface CascadingCardsProps {
  levels: CardLevel[];
  onAdd: (text: string, path: string[]) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onDrillDown: (id: string) => void;
}

function getPathForLevel(levels: CardLevel[], levelIndex: number): string[] {
  const path: string[] = [];
  for (let i = 1; i <= levelIndex; i++) {
    const parentId = levels[i].parentId;
    if (parentId) {
      path.push(parentId);
    }
  }
  return path;
}

export function CascadingCards({
  levels,
  onAdd,
  onToggle,
  onDelete,
  onEdit,
  onDrillDown,
}: CascadingCardsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to rightmost card when levels change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [levels.length]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin"
    >
      <AnimatePresence mode="popLayout">
        {levels.map((level, index) => {
          const isLastCard = index === levels.length - 1;
          const isCollapsed = levels.length > 3 && index < levels.length - 2;
          const path = getPathForLevel(levels, index);

          return (
            <motion.div
              key={level.parentId ?? "root"}
              layout
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={cardTransition}
              className={`shrink-0 ${
                isCollapsed ? "w-48" : "w-80"
              }`}
            >
              {/* Card title header */}
              <div className="px-1 pb-2">
                <h3
                  className={`font-semibold truncate ${
                    isLastCard
                      ? "text-slate-900 text-sm"
                      : "text-slate-500 text-xs"
                  }`}
                >
                  {level.title}
                </h3>
              </div>
              <ChecklistCard
                items={level.items}
                onAdd={(text) => onAdd(text, path)}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
                onDrillDown={onDrillDown}
                activeChildId={level.activeChildId}
                isCollapsed={isCollapsed}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
