import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ChecklistItem, ItemColor } from "../types";
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
  onReorder: (fromIndex: number, toIndex: number) => void;
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
}: ChecklistCardProps) {
  const { theme } = useTheme();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(oldIndex, newIndex);
    }
  }

  return (
    <div className={`p-4 space-y-3 ${s(theme, "card")}`}>
      {!isCollapsed && <AddItemForm onAdd={onAdd} />}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
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
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
