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
import { findNodeById } from "../utils/findNode";
import { useSearch } from "../hooks/useSearch";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";
import { MoveItemModal } from "./MoveItemModal";
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
  undo: () => void;
  redo: () => void;
  openSearch: () => void;
  deleteItem: (id: string) => void;
  getRootItems: () => ChecklistItem[];
  itemUp: () => void;
  itemDown: () => void;
  itemEnter: () => void;
  itemToggle: () => void;
  itemDelete: () => void;
  clearItemFocus: () => void;
}

interface ChecklistViewProps {
  checklist: Checklist;
  onItemsChange: (items: ChecklistItem[]) => void;
  onExportAll: () => void;
  onImportChecklist: (fileName: string, text: string) => boolean;
  focusMode?: boolean;
  allChecklists?: Checklist[];
  onMoveItem?: (itemId: string) => void;
}

const ChecklistView = forwardRef<ChecklistViewHandle, ChecklistViewProps>(
  function ChecklistView({ checklist, onItemsChange, onExportAll, onImportChecklist, focusMode = false, allChecklists = [], onMoveItem }, ref) {
    const {
      rootItems,
      editingItem,
      navStack,
      cardLevels,
      breadcrumbPath,
      addItem,
      toggleItem,
      deleteItem,
      setItemColor,
      startEdit,
      saveEdit,
      cancelEdit,
      drillDown,
      navigateToDepth,
      reorderItems,
      nestItem,
      moveItemToPath,
      resetChecks,
      setNavStack,
      navigateToRoot,
      exportData,
      exportMarkdown,
      undo,
      redo,
    } = useChecklist({
      initialItems: checklist.items,
      onItemsChange,
      checklistTitle: checklist.title,
    });

    const search = useSearch(rootItems);
    const [focusedItemIdRaw, setFocusedItemId] = useState<string | null>(null);

    const activeCardItems = useMemo(
      () => cardLevels[cardLevels.length - 1]?.items ?? [],
      [cardLevels],
    );

    // Derived: clear focus if focused item is no longer in active card
    const focusedItemId = focusedItemIdRaw && activeCardItems.some((item) => item.id === focusedItemIdRaw)
      ? focusedItemIdRaw
      : null;

    const scrollFocusedIntoView = useCallback((id: string) => {
      setTimeout(() => {
        const el = document.querySelector(`[data-item-id="${id}"]`);
        el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 0);
    }, []);

    const handleItemUp = useCallback(() => {
      if (activeCardItems.length === 0) return;
      setFocusedItemId((prev) => {
        if (!prev) {
          const id = activeCardItems[activeCardItems.length - 1].id;
          scrollFocusedIntoView(id);
          return id;
        }
        const idx = activeCardItems.findIndex((item) => item.id === prev);
        const newIdx = idx <= 0 ? activeCardItems.length - 1 : idx - 1;
        const id = activeCardItems[newIdx].id;
        scrollFocusedIntoView(id);
        return id;
      });
    }, [activeCardItems, scrollFocusedIntoView]);

    const handleItemDown = useCallback(() => {
      if (activeCardItems.length === 0) return;
      setFocusedItemId((prev) => {
        if (!prev) {
          const id = activeCardItems[0].id;
          scrollFocusedIntoView(id);
          return id;
        }
        const idx = activeCardItems.findIndex((item) => item.id === prev);
        const newIdx = idx >= activeCardItems.length - 1 ? 0 : idx + 1;
        const id = activeCardItems[newIdx].id;
        scrollFocusedIntoView(id);
        return id;
      });
    }, [activeCardItems, scrollFocusedIntoView]);

    const handleItemEnter = useCallback(() => {
      if (focusedItemId) {
        drillDown(focusedItemId);
        setFocusedItemId(null);
      }
    }, [focusedItemId, drillDown]);

    const handleItemToggle = useCallback(() => {
      if (focusedItemId) {
        toggleItem(focusedItemId);
      }
    }, [focusedItemId, toggleItem]);

    const handleItemDelete = useCallback(() => {
      if (!focusedItemId) return;
      const idx = activeCardItems.findIndex((item) => item.id === focusedItemId);
      deleteItem(focusedItemId);
      // Move focus to next item, or previous, or null
      if (activeCardItems.length <= 1) {
        setFocusedItemId(null);
      } else if (idx < activeCardItems.length - 1) {
        setFocusedItemId(activeCardItems[idx + 1].id);
      } else {
        setFocusedItemId(activeCardItems[idx - 1].id);
      }
    }, [focusedItemId, activeCardItems, deleteItem]);

    const handleClearItemFocus = useCallback(() => {
      setFocusedItemId(null);
    }, []);

    const handleSearchSelect = useCallback((path: string[]) => {
      setNavStack(path);
      search.close();
      setFocusedItemId(null);
    }, [setNavStack, search]);

    useImperativeHandle(ref, () => ({
      navigateBack: () => {
        if (navStack.length > 0) {
          navigateToDepth(navStack.length - 1);
          setFocusedItemId(null);
        }
      },
      navigateHome: () => { navigateToRoot(); setFocusedItemId(null); },
      exportData: () => exportData(),
      undo: () => undo(),
      redo: () => redo(),
      openSearch: () => search.open(),
      deleteItem: (id: string) => deleteItem(id),
      getRootItems: () => rootItems,
      itemUp: handleItemUp,
      itemDown: handleItemDown,
      itemEnter: handleItemEnter,
      itemToggle: handleItemToggle,
      itemDelete: handleItemDelete,
      clearItemFocus: handleClearItemFocus,
    }));

    return (
      <>
        {/* Export/Import bar */}
        <div className="max-w-lg px-4">
          <ExportImportBar onExport={exportData} onExportAll={onExportAll} onExportMarkdown={exportMarkdown} onImport={onImportChecklist} onResetChecks={resetChecks} />
        </div>

        {/* Search bar */}
        {search.isOpen && (
          <div className="max-w-lg px-4">
            <SearchBar
              query={search.query}
              onQueryChange={search.setQuery}
              onClose={search.close}
              resultCount={search.results.length}
            />
            {search.query && (
              <SearchResults
                results={search.results}
                onSelect={handleSearchSelect}
                onToggle={toggleItem}
              />
            )}
          </div>
        )}

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
            rootItems={rootItems}
            onAdd={addItem}
            onToggle={toggleItem}
            onDelete={deleteItem}
            onEdit={startEdit}
            onDrillDown={drillDown}
            onReorder={reorderItems}
            onNest={nestItem}
            onMoveItemToPath={moveItemToPath}
            onSetColor={setItemColor}
            onMove={onMoveItem}
            showMoveButton={allChecklists.length > 1}
            focusMode={focusMode}
            focusedItemId={focusedItemId}
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
  const [focusMode, setFocusMode] = useState(false);
  const [movingItemId, setMovingItemId] = useState<string | null>(null);
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

  const handleToggleFocusMode = useCallback(() => {
    setFocusMode((prev) => !prev);
  }, []);

  const handleMoveConfirm = useCallback((targetChecklistId: string) => {
    if (!movingItemId) return;
    const rootItems = checklistViewRef.current?.getRootItems();
    if (!rootItems) return;
    const item = findNodeById(rootItems, movingItemId);
    if (!item) return;
    manager.moveItemToChecklist(item, targetChecklistId);
    checklistViewRef.current?.deleteItem(movingItemId);
    setMovingItemId(null);
  }, [movingItemId, manager]);

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
    onToggleFocusMode: handleToggleFocusMode,
    onOpenSearch: () => checklistViewRef.current?.openSearch(),
    onItemUp: () => checklistViewRef.current?.itemUp(),
    onItemDown: () => checklistViewRef.current?.itemDown(),
    onItemEnter: () => checklistViewRef.current?.itemEnter(),
    onItemToggle: () => checklistViewRef.current?.itemToggle(),
    onItemDelete: () => checklistViewRef.current?.itemDelete(),
    onClearItemFocus: () => checklistViewRef.current?.clearItemFocus(),
    onUndo: () => checklistViewRef.current?.undo(),
    onRedo: () => checklistViewRef.current?.redo(),
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
            focusMode={focusMode}
            allChecklists={manager.checklists}
            onMoveItem={(id) => setMovingItemId(id)}
          />
        </div>
      </div>

      {/* Shortcut legend */}
      <ShortcutLegend />

      {/* Help overlay */}
      {showHelp && <ShortcutHelpOverlay onClose={() => setShowHelp(false)} />}

      {/* Move item modal */}
      {movingItemId && (
        <MoveItemModal
          checklists={manager.checklists}
          currentChecklistId={manager.activeChecklist.id}
          onSelect={handleMoveConfirm}
          onCancel={() => setMovingItemId(null)}
        />
      )}
    </div>
  );
}
