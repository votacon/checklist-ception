import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { CardLevel, ChecklistItem, CrossCardDropIndicator, DropZone, ItemColor, SortableItemData } from "../types";
import { cardVariants, cardTransition } from "../utils/animation";
import { CARD_LAYOUT } from "../utils/constants";
import { countItems, findNodeById, isAncestorOf } from "../utils/findNode";
import { crossCardCollision } from "../utils/dropZoneCollision";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";
import { ChecklistCard } from "./ChecklistCard";
import { DragOverlayContent } from "./DragOverlayContent";

interface CascadingCardsProps {
  levels: CardLevel[];
  rootItems: ChecklistItem[];
  onAdd: (text: string, path: string[]) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onDrillDown: (id: string, fromDepth?: number) => void;
  onReorder: (path: string[], fromIndex: number, toIndex: number) => void;
  onNest?: (path: string[], sourceIndex: number, targetIndex: number) => void;
  onMoveItemToPath?: (itemId: string, targetPath: string[], targetIndex: number) => void;
  onSetColor?: (id: string, color: ItemColor | undefined) => void;
  onMove?: (id: string) => void;
  showMoveButton?: boolean;
  focusMode?: boolean;
  focusedItemId?: string | null;
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
  rootItems,
  onAdd,
  onToggle,
  onDelete,
  onEdit,
  onDrillDown,
  onReorder,
  onNest,
  onMoveItemToPath,
  onSetColor,
  onMove,
  showMoveButton = false,
  focusMode = false,
  focusedItemId = null,
}: CascadingCardsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme, isBarebones } = useTheme();

  // Centralized drag state
  const [activeDragItem, setActiveDragItem] = useState<ChecklistItem | null>(null);
  const [activeDragData, setActiveDragData] = useState<SortableItemData | null>(null);
  const [dropIndicator, setDropIndicator] = useState<CrossCardDropIndicator | null>(null);
  const lastIndicatorRef = useRef<CrossCardDropIndicator | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Auto-scroll to rightmost card when levels change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: isBarebones ? "instant" : "smooth",
      });
    }
  }, [levels.length, isBarebones]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as SortableItemData | undefined;
    if (!data) return;
    const item = findNodeById(rootItems, data.itemId);
    if (item) {
      setActiveDragItem(item);
      setActiveDragData(data);
    }
  }, [rootItems]);

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    const { collisions } = event;
    if (!collisions || collisions.length === 0) {
      if (lastIndicatorRef.current !== null) {
        lastIndicatorRef.current = null;
        setDropIndicator(null);
      }
      return;
    }

    const collision = collisions[0];
    const zone = collision.data?.value as DropZone | undefined;
    if (!zone) {
      if (lastIndicatorRef.current !== null) {
        lastIndicatorRef.current = null;
        setDropIndicator(null);
      }
      return;
    }

    const targetId = String(collision.id);
    const overData = collision.data?.droppableContainer?.data?.current as SortableItemData | undefined;
    const levelIndex = overData?.levelIndex ?? 0;

    // Prevent dropping into own descendants (nest zone)
    if (zone === "nest" && activeDragData) {
      const activeId = activeDragData.itemId;
      if (isAncestorOf(rootItems, activeId, targetId) || activeId === targetId) {
        if (lastIndicatorRef.current !== null) {
          lastIndicatorRef.current = null;
          setDropIndicator(null);
        }
        return;
      }
    }

    const last = lastIndicatorRef.current;
    if (last && last.targetId === targetId && last.zone === zone && last.levelIndex === levelIndex) return;

    const newIndicator: CrossCardDropIndicator = { targetId, zone, levelIndex };
    lastIndicatorRef.current = newIndicator;
    setDropIndicator(newIndicator);
  }, [activeDragData, rootItems]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setDropIndicator(null);
    lastIndicatorRef.current = null;
    const dragItem = activeDragItem;
    const dragData = activeDragData;
    setActiveDragItem(null);
    setActiveDragData(null);

    if (!dragItem || !dragData) return;

    const { collisions } = event;
    if (!collisions || collisions.length === 0) return;

    const collision = collisions[0];
    const overId = String(collision.id);
    const zone = collision.data?.value as DropZone | undefined;
    if (!zone) return;

    const overData = collision.data?.droppableContainer?.data?.current as SortableItemData | undefined;
    if (!overData) return;

    const activeId = dragData.itemId;
    if (activeId === overId) return;

    // Prevent dropping into own descendants
    if (zone === "nest" && (isAncestorOf(rootItems, activeId, overId) || activeId === overId)) {
      return;
    }

    const sourcePath = dragData.path;
    const targetPath = overData.path;
    const isEndZone = overId.startsWith("__end-zone__");

    // Check if same card (same path)
    const isSameCard = sourcePath.length === targetPath.length &&
      sourcePath.every((id, i) => id === targetPath[i]);

    if (isEndZone) {
      // Dropping at end of card — find the items at target path
      const targetLevel = levels.find((_l, i) => {
        const p = getPathForLevel(levels, i);
        return p.length === targetPath.length && p.every((id, j) => id === targetPath[j]);
      });
      const targetItems = targetLevel?.items ?? [];

      if (isSameCard) {
        // Same card: reorder to end
        const oldIndex = targetItems.findIndex((item) => item.id === activeId);
        if (oldIndex !== -1 && oldIndex !== targetItems.length - 1) {
          onReorder(sourcePath, oldIndex, targetItems.length - 1);
        }
      } else if (onMoveItemToPath) {
        // Cross-card: move to end of target
        onMoveItemToPath(activeId, targetPath, targetItems.length);
      }
      return;
    }

    if (isSameCard) {
      // Same-card drag: use existing reorder/nest logic
      const cardLevel = levels.find((_l, i) => {
        const p = getPathForLevel(levels, i);
        return p.length === sourcePath.length && p.every((id, j) => id === sourcePath[j]);
      });
      if (!cardLevel) return;

      const oldIndex = cardLevel.items.findIndex((item) => item.id === activeId);
      const newIndex = cardLevel.items.findIndex((item) => item.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      if (zone === "nest" && onNest) {
        onNest(sourcePath, oldIndex, newIndex);
      } else {
        let targetIndex: number;
        if (zone === "before") {
          targetIndex = oldIndex < newIndex ? newIndex - 1 : newIndex;
        } else if (zone === "after") {
          targetIndex = oldIndex > newIndex ? newIndex + 1 : newIndex;
        } else {
          targetIndex = newIndex;
        }
        if (oldIndex !== targetIndex) {
          onReorder(sourcePath, oldIndex, targetIndex);
        }
      }
    } else if (onMoveItemToPath) {
      // Cross-card drag
      if (zone === "nest") {
        // Drop into target item's subtasks
        const targetItem = findNodeById(rootItems, overId);
        const nestPath = [...targetPath, overId];
        const nestIndex = targetItem ? targetItem.subtasks.length : 0;
        onMoveItemToPath(activeId, nestPath, nestIndex);
      } else {
        // Insert before/after the target in the target's card
        const targetLevel = levels.find((_l, i) => {
          const p = getPathForLevel(levels, i);
          return p.length === targetPath.length && p.every((id, j) => id === targetPath[j]);
        });
        if (!targetLevel) return;

        const overIndex = targetLevel.items.findIndex((item) => item.id === overId);
        if (overIndex === -1) return;

        const targetIndex = zone === "before" ? overIndex : overIndex + 1;
        onMoveItemToPath(activeId, targetPath, targetIndex);
      }
    }
  }, [activeDragItem, activeDragData, rootItems, levels, onReorder, onNest, onMoveItemToPath]);

  const handleDragCancel = useCallback(() => {
    setDropIndicator(null);
    lastIndicatorRef.current = null;
    setActiveDragItem(null);
    setActiveDragData(null);
  }, []);

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

    // Only pass drop indicator to the card that owns the target
    const cardDropIndicator = dropIndicator && dropIndicator.levelIndex === index
      ? dropIndicator
      : null;

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
          focusedItemId={isLastCard ? focusedItemId : null}
          isCollapsed={isCollapsed}
          dropIndicator={cardDropIndicator}
          levelPath={path}
          levelIndex={index}
          isDragActive={!!activeDragItem}
        />
      </CardWrapper>
    );
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={crossCardCollision}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        ref={scrollRef}
        className="flex overflow-x-auto pb-2 scrollbar-hide"
      >
        {isBarebones ? cards : <AnimatePresence mode="popLayout">{cards}</AnimatePresence>}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeDragItem ? <DragOverlayContent item={activeDragItem} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
