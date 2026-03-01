import { useEffect, useCallback, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, PanelLeftClose } from "lucide-react";
import type { Checklist } from "../types";
import { sidebarTransition, backdropTransition } from "../utils/animation";
import { s } from "../utils/styles";
import { useTheme } from "../contexts/ThemeContext";
import { SidebarCreateForm, type SidebarCreateFormHandle } from "./SidebarCreateForm";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  isDesktop: boolean;
  onClose: () => void;
  checklists: Checklist[];
  activeChecklistId: string;
  onSwitch: (id: string) => void;
  onCreate: (title: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  createFormRef?: RefObject<SidebarCreateFormHandle | null>;
}

export function Sidebar({
  isOpen,
  isCollapsed,
  isDesktop,
  onClose,
  checklists,
  activeChecklistId,
  onSwitch,
  onCreate,
  onRename,
  onDelete,
  createFormRef,
}: SidebarProps) {
  const { theme, isBarebones } = useTheme();

  // Escape key closes/collapses sidebar
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    const shouldListen = isDesktop ? !isCollapsed : isOpen;
    if (shouldListen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, isCollapsed, isDesktop, handleKeyDown]);

  const handleSwitch = (id: string) => {
    onSwitch(id);
    if (!isDesktop) onClose();
  };

  const panelContent = (
    <>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-4 border-b ${s(theme, "border-subtle")}`}>
        <div>
          <p className={`text-xs font-medium uppercase tracking-wider ${s(theme, "text-muted")}`}>Checklist-ception</p>
          <h2 className={`text-lg font-bold ${s(theme, "text-heading")}`}>Checklists</h2>
        </div>
        <button
          onClick={onClose}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center ${s(theme, "icon-muted")} ${s(theme, "icon-close-hover")} ${s(theme, "btn-icon")}`}
          aria-label={isDesktop ? "Collapse sidebar" : "Close sidebar"}
        >
          {isDesktop ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {checklists.map((checklist) => (
          <SidebarItem
            key={checklist.id}
            checklist={checklist}
            isActive={checklist.id === activeChecklistId}
            isLastChecklist={checklists.length <= 1}
            onSwitch={handleSwitch}
            onRename={onRename}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* New checklist */}
      <div className={`px-3 py-3 border-t ${s(theme, "border-subtle")}`}>
        <SidebarCreateForm ref={createFormRef} onCreate={onCreate} />
      </div>
    </>
  );

  // Desktop: persistent inline panel
  if (isDesktop) {
    if (isCollapsed) return null;
    return (
      <aside
        className={`w-72 shrink-0 ${s(theme, "sidebar-bg")} flex flex-col h-screen sticky top-0 ${s(theme, "sidebar-border")}`}
      >
        {panelContent}
      </aside>
    );
  }

  // Mobile: overlay
  if (isBarebones) {
    if (!isOpen) return null;
    return (
      <>
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
        <div className={`fixed inset-y-0 left-0 w-72 max-w-[80vw] ${s(theme, "sidebar-bg")} border-r-2 border-gray-400 z-50 flex flex-col`}>
          {panelContent}
        </div>
      </>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={sidebarTransition}
            className={`fixed inset-y-0 left-0 w-72 max-w-[80vw] ${s(theme, "sidebar-bg")} shadow-xl z-50 flex flex-col`}
          >
            {panelContent}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
