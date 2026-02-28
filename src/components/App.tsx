import { AnimatePresence, motion } from "motion/react";
import { useChecklist } from "../hooks/useChecklist";
import { useChecklistManager } from "../hooks/useChecklistManager";
import { useSidebar } from "../hooks/useSidebar";
import type { Checklist, ChecklistItem } from "../types";
import { slideVariants, slideTransition } from "../utils/animation";
import { Breadcrumbs } from "./Breadcrumbs";
import { ChecklistCard } from "./ChecklistCard";
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
    navStack,
    editingItem,
    direction,
    currentItems,
    breadcrumbPath,
    addItem,
    toggleItem,
    deleteItem,
    startEdit,
    saveEdit,
    cancelEdit,
    drillDown,
    navigateTo,
    navigateToRoot,
    exportData,
    importData,
  } = useChecklist({
    initialItems: checklist.items,
    onItemsChange,
  });

  return (
    <>
      {/* Export/Import bar */}
      <ExportImportBar onExport={exportData} onImport={importData} />

      {/* Breadcrumbs */}
      <Breadcrumbs
        path={breadcrumbPath}
        onNavigateToRoot={navigateToRoot}
        onNavigateTo={navigateTo}
      />

      {/* Animated card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={navStack.join("/") || "root"}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
        >
          <ChecklistCard
            items={currentItems}
            onAdd={addItem}
            onToggle={toggleItem}
            onDelete={deleteItem}
            onEdit={startEdit}
            onDrillDown={drillDown}
          />
        </motion.div>
      </AnimatePresence>

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

      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {/* Header */}
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
          {/* Export/Import is rendered inside ChecklistView */}
        </div>

        {/* Checklist content — keyed so switching checklists remounts with fresh state */}
        <ChecklistView
          key={manager.activeChecklist.id}
          checklist={manager.activeChecklist}
          onItemsChange={manager.updateActiveItems}
        />
      </div>
    </div>
  );
}
