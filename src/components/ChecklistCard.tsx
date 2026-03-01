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
import type { ChecklistItem } from "../types";
import { s } from "../utils/styles";
import { useBarebones } from "../contexts/BarebonesContext";
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
  activeChildId = null,
  isCollapsed = false,
  onReorder,
}: ChecklistCardProps) {
  const { barebones } = useBarebones();

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
    <div className={`bg-white p-4 space-y-3 ${s(barebones, "card")}`}>
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
          <div className="divide-y divide-slate-100">
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
