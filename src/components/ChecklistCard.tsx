import { useCallback, useRef, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ChecklistItem, DropZone, ItemColor } from "../types";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";
import { dropZoneCollision } from "../utils/dropZoneCollision";
import { AddItemForm } from "./AddItemForm";
import { ChecklistItemRow } from "./ChecklistItemRow";
import { EmptyState } from "./EmptyState";

interface DropIndicatorState {
  targetId: string;
  zone: DropZone;
}

interface ChecklistCardProps {
  items: ChecklistItem[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onDrillDown: (id: string) => void;
  onSetColor?: (id: string, color: ItemColor | undefined) => void;
  onMove?: (id: string) => void;
  showMoveButton?: boolean;
  activeChildId?: string | null;
  isCollapsed?: boolean;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onNest?: (sourceIndex: number, targetIndex: number) => void;
}

export function ChecklistCard({
  items,
  onAdd,
  onToggle,
  onDelete,
  onEdit,
  onDrillDown,
  onSetColor,
  onMove,
  showMoveButton = false,
  activeChildId = null,
  isCollapsed = false,
  onReorder,
  onNest,
}: ChecklistCardProps) {
  const { theme } = useTheme();
  const [dropIndicator, setDropIndicator] = useState<DropIndicatorState | null>(null);
  const lastIndicatorRef = useRef<DropIndicatorState | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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
    const last = lastIndicatorRef.current;
    if (last && last.targetId === targetId && last.zone === zone) return;

    const newIndicator = { targetId, zone };
    lastIndicatorRef.current = newIndicator;
    setDropIndicator(newIndicator);
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    setDropIndicator(null);
    lastIndicatorRef.current = null;

    const { active, collisions } = event;
    if (!collisions || collisions.length === 0) return;

    const collision = collisions[0];
    const overId = String(collision.id);
    if (active.id === overId) return;

    const zone = collision.data?.value as DropZone | undefined;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    if (zone === "nest" && onNest) {
      onNest(oldIndex, newIndex);
    } else {
      // Reorder: compute the correct target index
      let targetIndex: number;
      if (zone === "before") {
        targetIndex = oldIndex < newIndex ? newIndex - 1 : newIndex;
      } else if (zone === "after") {
        targetIndex = oldIndex > newIndex ? newIndex + 1 : newIndex;
      } else {
        // Fallback — same as closestCenter behavior
        targetIndex = newIndex;
      }
      if (oldIndex !== targetIndex) {
        onReorder(oldIndex, targetIndex);
      }
    }
  }

  // Use a no-op strategy when nesting to prevent visual shifts
  const sortingStrategy = dropIndicator?.zone === "nest"
    ? () => null
    : verticalListSortingStrategy;

  return (
    <div className={`p-4 space-y-3 ${s(theme, "card")}`}>
      {!isCollapsed && <AddItemForm onAdd={onAdd} />}
      <DndContext
        sensors={sensors}
        collisionDetection={dropZoneCollision}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={sortingStrategy}
        >
          <div className={`divide-y ${s(theme, "divider")}`}>
            {items.length === 0 ? (
              !isCollapsed && <EmptyState />
            ) : (
              items.map((item) => (
                <ChecklistItemRow
                  key={item.id}
                  item={item}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onDrillDown={onDrillDown}
                  onSetColor={onSetColor}
                  onMove={onMove}
                  showMoveButton={showMoveButton}
                  isActive={item.id === activeChildId}
                  isCompact={isCollapsed}
                  dropIndicator={
                    dropIndicator && dropIndicator.targetId === item.id
                      ? dropIndicator.zone
                      : null
                  }
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
