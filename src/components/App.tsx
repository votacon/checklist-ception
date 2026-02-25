import { AnimatePresence, motion } from "motion/react";
import { useChecklist } from "../hooks/useChecklist";
import { slideVariants, slideTransition } from "../utils/animation";
import { Breadcrumbs } from "./Breadcrumbs";
import { ChecklistCard } from "./ChecklistCard";
import { EditItemModal } from "./EditItemModal";
import { ExportImportBar } from "./ExportImportBar";

export function App() {
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
  } = useChecklist();

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            Checklist-ception
          </h1>
          <ExportImportBar onExport={exportData} onImport={importData} />
        </div>

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
      </div>
    </div>
  );
}
