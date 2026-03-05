import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { ChecklistItem, ItemColor, CrossCardDropIndicator, SortableItemData } from "../types";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";
import { AddItemForm } from "./AddItemForm";
import { ChecklistItemRow } from "./ChecklistItemRow";
import { EmptyState } from "./EmptyState";

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
  dropIndicator?: CrossCardDropIndicator | null;
  levelPath?: string[];
  levelIndex?: number;
  isDragActive?: boolean;
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
  dropIndicator = null,
  levelPath = [],
  levelIndex = 0,
  isDragActive = false,
}: ChecklistCardProps) {
  const { theme } = useTheme();

  // End-of-card droppable zone for dropping at the end of the list
  const endZoneId = `__end-zone__${levelPath.join("/") || "root"}`;
  const endZoneData: SortableItemData = {
    path: levelPath,
    levelIndex,
    itemId: endZoneId,
  };
  const { setNodeRef: setEndZoneRef, isOver: isEndZoneOver } = useDroppable({
    id: endZoneId,
    data: endZoneData,
  });

  // Use a no-op strategy during cross-card drags to prevent visual shifts
  const sortingStrategy = isDragActive
    ? () => null
    : verticalListSortingStrategy;

  return (
    <div className={`p-4 space-y-3 ${s(theme, "card")}`}>
      {!isCollapsed && <AddItemForm onAdd={onAdd} />}
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
                levelPath={levelPath}
                levelIndex={levelIndex}
              />
            ))
          )}
        </div>
      </SortableContext>
      {/* End-of-card drop zone */}
      <div
        ref={setEndZoneRef}
        className={`min-h-[24px] transition-colors ${isEndZoneOver ? "bg-blue-500/10 border-2 border-dashed border-blue-500 rounded" : ""}`}
      />
    </div>
  );
}
