import { useMemo, useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { useChecklist } from "../hooks/useChecklist";
import { useChecklistManager } from "../hooks/useChecklistManager";
import { useBarebonesMode } from "../hooks/useBarebonesMode";
import { useSidebar } from "../hooks/useSidebar";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { BarebonesContext, useBarebones } from "../contexts/BarebonesContext";
import type { Checklist, ChecklistItem } from "../types";
import { BarebonesToggle } from "./BarebonesToggle";
import { Breadcrumbs } from "./Breadcrumbs";
import { CascadingCards } from "./CascadingCards";
import { EditItemModal } from "./EditItemModal";
import { ExportImportBar } from "./ExportImportBar";
import { HamburgerButton } from "./HamburgerButton";
import { ShortcutHelpOverlay } from "./ShortcutHelpOverlay";
import { ShortcutLegend } from "./ShortcutLegend";
import { Sidebar } from "./Sidebar";
import type { SidebarCreateFormHandle } from "./SidebarCreateForm";

export interface ChecklistViewHandle {
  navigateBack: () => void;
  navigateHome: () => void;
  exportData: () => void;
}

interface ChecklistViewProps {
  checklist: Checklist;
  onItemsChange: (items: ChecklistItem[]) => void;
}

const ChecklistView = forwardRef<ChecklistViewHandle, ChecklistViewProps>(
  function ChecklistView({ checklist, onItemsChange }, ref) {
    const {
      editingItem,
      navStack,
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
      reorderItems,
      resetChecks,
      navigateToRoot,
      exportData,
      importData,
    } = useChecklist({
      initialItems: checklist.items,
      onItemsChange,
      checklistTitle: checklist.title,
    });

    useImperativeHandle(ref, () => ({
      navigateBack: () => {
        if (navStack.length > 0) {
          navigateToDepth(navStack.length - 1);
        }
      },
      navigateHome: () => navigateToRoot(),
      exportData: () => exportData(),
    }));

    return (
      <>
        {/* Export/Import bar */}
        <div className="max-w-lg px-4">
          <ExportImportBar onExport={exportData} onImport={importData} onResetChecks={resetChecks} />
        </div>

        {/* Breadcrumbs */}
        <div className="max-w-lg px-4">
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
            onReorder={reorderItems}
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
  },
);

export function App() {
  const manager = useChecklistManager();
  const sidebar = useSidebar();
  const { barebones, toggle } = useBarebonesMode();
  const barebonesCtx = useMemo(() => ({ barebones, toggle }), [barebones, toggle]);

  return (
    <BarebonesContext.Provider value={barebonesCtx}>
      <AppContent manager={manager} sidebar={sidebar} barebonesToggle={toggle} />
    </BarebonesContext.Provider>
  );
}

function AppContent({
  manager,
  sidebar,
  barebonesToggle,
}: {
  manager: ReturnType<typeof useChecklistManager>;
  sidebar: ReturnType<typeof useSidebar>;
  barebonesToggle: () => void;
}) {
  const { barebones } = useBarebones();
  const [showHelp, setShowHelp] = useState(false);
  const checklistViewRef = useRef<ChecklistViewHandle>(null);
  const createFormRef = useRef<SidebarCreateFormHandle>(null);

  const handleFocusAddItem = useCallback(() => {
    const inputs = document.querySelectorAll<HTMLInputElement>("[data-add-item-input]");
    const lastInput = inputs[inputs.length - 1];
    if (lastInput) {
      lastInput.scrollIntoView({ behavior: "smooth", block: "center" });
      lastInput.focus();
    }
  }, []);

  const handleNewChecklist = useCallback(() => {
    sidebar.open();
    // Small delay to ensure sidebar is visible before activating the form
    setTimeout(() => {
      createFormRef.current?.startCreating();
    }, 100);
  }, [sidebar]);

  const handleToggleHelp = useCallback(() => {
    setShowHelp((prev) => !prev);
  }, []);

  useKeyboardShortcuts({
    onFocusAddItem: handleFocusAddItem,
    onNewChecklist: handleNewChecklist,
    onToggleSidebar: sidebar.toggle,
    onNavigateBack: () => checklistViewRef.current?.navigateBack(),
    onNavigateHome: () => checklistViewRef.current?.navigateHome(),
    onToggleBarebones: barebonesToggle,
    onExport: () => checklistViewRef.current?.exportData(),
    onToggleHelp: handleToggleHelp,
  });

  return (
    <div className={`flex min-h-screen ${barebones ? "bg-white" : "bg-slate-50"}`}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebar.isOpen}
        isCollapsed={sidebar.isCollapsed}
        isDesktop={sidebar.isDesktop}
        onClose={sidebar.close}
        checklists={manager.checklists}
        activeChecklistId={manager.activeChecklist.id}
        onSwitch={manager.switchChecklist}
        onCreate={manager.createChecklist}
        onRename={manager.renameChecklist}
        onDelete={manager.deleteChecklist}
        createFormRef={createFormRef}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Header — stays constrained */}
        <div className="max-w-lg px-4 pt-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <HamburgerButton onClick={sidebar.toggle} />
              <h1 className="text-3xl font-bold text-slate-900">
                {manager.activeChecklist.title}
              </h1>
            </div>
            <BarebonesToggle />
          </div>
        </div>

        {/* Checklist content — full width for horizontal scroll */}
        <div className="space-y-4 pb-8">
          <ChecklistView
            ref={checklistViewRef}
            key={manager.activeChecklist.id}
            checklist={manager.activeChecklist}
            onItemsChange={manager.updateActiveItems}
          />
        </div>
      </div>

      {/* Shortcut legend */}
      <ShortcutLegend />

      {/* Help overlay */}
      {showHelp && <ShortcutHelpOverlay onClose={() => setShowHelp(false)} />}
    </div>
  );
}
