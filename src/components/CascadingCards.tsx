import { type ReactNode, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { CardLevel, ItemColor } from "../types";
import { cardVariants, cardTransition } from "../utils/animation";
import { CARD_LAYOUT } from "../utils/constants";
import { countItems } from "../utils/findNode";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";
import { ChecklistCard } from "./ChecklistCard";

interface CascadingCardsProps {
  levels: CardLevel[];
  onAdd: (text: string, path: string[]) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onDrillDown: (id: string, fromDepth?: number) => void;
  onReorder: (path: string[], fromIndex: number, toIndex: number) => void;
  onSetColor?: (id: string, color: ItemColor | undefined) => void;
  onMove?: (id: string) => void;
  showMoveButton?: boolean;
  focusMode?: boolean;
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

interface CardWrapperProps {
  isBarebones: boolean;
  isCollapsed: boolean;
  cardKey: string;
  zIndex: number;
  overlapMargin: string;
  widthOverride?: string;
  children: ReactNode;
}

function CardWrapper({ isBarebones, isCollapsed, cardKey, zIndex, overlapMargin, widthOverride, children }: CardWrapperProps) {
  const width = widthOverride ?? (isCollapsed ? CARD_LAYOUT.COLLAPSED_WIDTH : CARD_LAYOUT.EXPANDED_WIDTH);
  if (isBarebones) {
    return <div key={cardKey} className={`shrink-0 ${width} relative ${overlapMargin}`} style={{ zIndex }}>{children}</div>;
  }
  return (
    <motion.div
      key={cardKey}
      layout
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={cardTransition}
      className={`shrink-0 ${width} relative ${overlapMargin}`}
      style={{ zIndex }}
    >
      {children}
    </motion.div>
  );
}

export function CascadingCards({
  levels,
  onAdd,
  onToggle,
  onDelete,
  onEdit,
  onDrillDown,
  onReorder,
  onSetColor,
  onMove,
  showMoveButton = false,
  focusMode = false,
}: CascadingCardsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme, isBarebones } = useTheme();

  // Auto-scroll to rightmost card when levels change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: isBarebones ? "instant" : "smooth",
      });
    }
  }, [levels.length, isBarebones]);

  const levelsToRender = focusMode ? [levels[levels.length - 1]] : levels;

  const cards = levelsToRender.map((level) => {
    const index = levels.indexOf(level);
    const isLastCard = index === levels.length - 1;
    const isCollapsed = !focusMode && levels.length > CARD_LAYOUT.COLLAPSE_THRESHOLD && index < levels.length - 2;
    const path = getPathForLevel(levels, index);
    const cardKey = level.parentId ?? "root";
    const overlapMargin = focusMode || index === 0
      ? ""
      : levels.length <= 2
        ? "ml-[2%]"
        : "-ml-6";

    return (
      <CardWrapper
        key={cardKey}
        cardKey={cardKey}
        isBarebones={isBarebones}
        isCollapsed={isCollapsed}
        zIndex={index}
        overlapMargin={overlapMargin}
        widthOverride={focusMode ? CARD_LAYOUT.FOCUS_WIDTH : undefined}
      >
        <div className="px-1 pb-2">
          <h3
            className={`font-semibold truncate ${
              isLastCard
                ? `${s(theme, "card-title")} text-sm`
                : `${s(theme, "card-title-muted")} text-xs`
            }`}
          >
            {level.title}
          </h3>
          {isCollapsed && level.items.length > 0 && (() => {
            const { completed, total } = countItems(level.items);
            return (
              <span className={`text-xs ${s(theme, "text-muted")}`}>
                {completed}/{total}
              </span>
            );
          })()}
        </div>
        <ChecklistCard
          items={level.items}
          onAdd={(text) => onAdd(text, path)}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onDrillDown={(id) => onDrillDown(id, level.depth)}
          onSetColor={onSetColor}
          onMove={onMove}
          showMoveButton={showMoveButton}
          activeChildId={level.activeChildId}
          isCollapsed={isCollapsed}
          onReorder={(from, to) => onReorder(path, from, to)}
        />
      </CardWrapper>
    );
  });

  return (
    <div
      ref={scrollRef}
      className="flex overflow-x-auto pb-2 scrollbar-hide"
    >
      {isBarebones ? cards : <AnimatePresence mode="popLayout">{cards}</AnimatePresence>}
    </div>
  );
}
