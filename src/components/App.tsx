import { useChecklist } from "../hooks/useChecklist";
import { useChecklistManager } from "../hooks/useChecklistManager";
import { useSidebar } from "../hooks/useSidebar";
import type { Checklist, ChecklistItem } from "../types";
import { Breadcrumbs } from "./Breadcrumbs";
import { CascadingCards } from "./CascadingCards";
import { EditItemModal } from "./EditItemModal";
import { ExportImportBar } from "./ExportImportBar";
import { HamburgerButton } from "./HamburgerButton";
import { Sidebar } from "./Sidebar";

interface ChecklistViewProps {
  checklist: Checklist;
  onItemsChange: (items: ChecklistItem[]) => void;
}

function ChecklistView({ checklist, onItemsChange }: ChecklistViewProps) {
  const {
    editingItem,
    cardLevels,
    breadcrumbPath,
    addItem,
    toggleItem,
    deleteItem,
    startEdit,
    saveEdit,
    cancelEdit,
    drillDown,
    navigateToDepth,
    navigateToRoot,
    exportData,
    importData,
  } = useChecklist({
    initialItems: checklist.items,
    onItemsChange,
    checklistTitle: checklist.title,
  });

  return (
    <>
      {/* Export/Import bar */}
      <div className="max-w-lg mx-auto px-4">
        <ExportImportBar onExport={exportData} onImport={importData} />
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-lg mx-auto px-4">
        <Breadcrumbs
          path={breadcrumbPath}
          onNavigateToRoot={navigateToRoot}
          onNavigateToDepth={navigateToDepth}
        />
      </div>

      {/* Cascading cards */}
      <div className="px-4">
        <CascadingCards
          levels={cardLevels}
          onAdd={addItem}
          onToggle={toggleItem}
          onDelete={deleteItem}
          onEdit={startEdit}
          onDrillDown={drillDown}
        />
      </div>

      {/* Edit modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onSave={saveEdit}
          onCancel={cancelEdit}
        />
      )}
    </>
  );
}

export function App() {
  const manager = useChecklistManager();
  const sidebar = useSidebar();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebar.isOpen}
        onClose={sidebar.close}
        checklists={manager.checklists}
        activeChecklistId={manager.activeChecklist.id}
        onSwitch={manager.switchChecklist}
        onCreate={manager.createChecklist}
        onRename={manager.renameChecklist}
        onDelete={manager.deleteChecklist}
      />

      {/* Header — stays constrained */}
      <div className="max-w-lg mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <HamburgerButton onClick={sidebar.toggle} />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Checklist-ception
              </h1>
              <p className="text-sm text-slate-500 -mt-0.5">
                {manager.activeChecklist.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist content — full width for horizontal scroll */}
      <div className="space-y-4 pb-8">
        <ChecklistView
          key={manager.activeChecklist.id}
          checklist={manager.activeChecklist}
          onItemsChange={manager.updateActiveItems}
        />
      </div>
    </div>
  );
}
