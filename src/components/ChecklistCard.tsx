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
}: ChecklistCardProps) {
  const { barebones } = useBarebones();

  return (
    <div className={`bg-white p-4 space-y-3 ${s(barebones, "card")}`}>
      {!isCollapsed && <AddItemForm onAdd={onAdd} />}
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
    </div>
  );
}
