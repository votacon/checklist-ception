import { useMemo, useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { useChecklist } from "../hooks/useChecklist";
import { useChecklistManager } from "../hooks/useChecklistManager";
import { useThemeMode } from "../hooks/useThemeMode";
import { useSidebar } from "../hooks/useSidebar";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { ThemeContext, useTheme } from "../contexts/ThemeContext";
import { s } from "../utils/styles";
import type { Checklist, ChecklistItem } from "../types";
import { parseImportedJson, parseImportedBundleJson } from "../utils/exportImport";
import { ThemePicker } from "./ThemePicker";
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
  onExportAll: () => void;
  onImportChecklist: (fileName: string, text: string) => boolean;
}

const ChecklistView = forwardRef<ChecklistViewHandle, ChecklistViewProps>(
  function ChecklistView({ checklist, onItemsChange, onExportAll, onImportChecklist }, ref) {
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
          <ExportImportBar onExport={exportData} onExportAll={onExportAll} onImport={onImportChecklist} onResetChecks={resetChecks} />
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
  const { theme, setTheme, cycleTheme, isBarebones } = useThemeMode();
  const themeCtx = useMemo(
    () => ({ theme, setTheme, cycleTheme, isBarebones }),
    [theme, setTheme, cycleTheme, isBarebones],
  );

  return (
    <ThemeContext.Provider value={themeCtx}>
      <AppContent manager={manager} sidebar={sidebar} cycleTheme={cycleTheme} />
    </ThemeContext.Provider>
  );
}

function AppContent({
  manager,
  sidebar,
  cycleTheme,
}: {
  manager: ReturnType<typeof useChecklistManager>;
  sidebar: ReturnType<typeof useSidebar>;
  cycleTheme: () => void;
}) {
  const { theme } = useTheme();
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

  const handleImportChecklist = useCallback((fileName: string, text: string): boolean => {
    // Try multi-checklist bundle format first
    const bundle = parseImportedBundleJson(text);
    if (bundle) {
      for (const entry of bundle) {
        manager.importChecklist(entry.title, entry.items);
      }
      return true;
    }
    // Fall back to single checklist format
    const parsed = parseImportedJson(text);
    if (parsed) {
      const title = fileName.replace(/\.json$/i, "");
      manager.importChecklist(title, parsed);
      return true;
    }
    return false;
  }, [manager]);

  useKeyboardShortcuts({
    onFocusAddItem: handleFocusAddItem,
    onNewChecklist: handleNewChecklist,
    onToggleSidebar: sidebar.toggle,
    onNavigateBack: () => checklistViewRef.current?.navigateBack(),
    onNavigateHome: () => checklistViewRef.current?.navigateHome(),
    onCycleTheme: cycleTheme,
    onExport: () => checklistViewRef.current?.exportData(),
    onToggleHelp: handleToggleHelp,
  });

  return (
    <div className={`flex min-h-screen ${s(theme, "page-bg")}`}>
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
              <h1 className={`text-3xl font-bold ${s(theme, "text-heading")}`}>
                {manager.activeChecklist.title}
              </h1>
            </div>
            <ThemePicker />
          </div>
        </div>

        {/* Checklist content — full width for horizontal scroll */}
        <div className="space-y-4 pb-8">
          <ChecklistView
            ref={checklistViewRef}
            key={manager.activeChecklist.id}
            checklist={manager.activeChecklist}
            onItemsChange={manager.updateActiveItems}
            onExportAll={manager.exportAll}
            onImportChecklist={handleImportChecklist}
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
