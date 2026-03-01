import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Plus, PanelLeftClose } from "lucide-react";
import type { Checklist } from "../types";
import { useBarebones } from "../contexts/BarebonesContext";
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
}: SidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const newTitleInputRef = useRef<HTMLInputElement>(null);
  const { barebones } = useBarebones();

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

  useEffect(() => {
    if (isCreating) {
      newTitleInputRef.current?.focus();
    }
  }, [isCreating]);

  const handleCreate = () => {
    const trimmed = newTitle.trim();
    if (trimmed) {
      onCreate(trimmed);
      setNewTitle("");
      setIsCreating(false);
    }
  };

  const handleCreateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreate();
    } else if (e.key === "Escape") {
      setIsCreating(false);
      setNewTitle("");
    }
  };

  const handleSwitch = (id: string) => {
    onSwitch(id);
    if (!isDesktop) onClose();
  };

  const panelContent = (
    <>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-4 border-b ${barebones ? "border-gray-400" : "border-slate-200"}`}>
        <h2 className="text-lg font-bold text-slate-900">Checklists</h2>
        <button
          onClick={onClose}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 ${barebones ? "" : "transition-colors"}`}
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
      <div className={`px-3 py-3 border-t ${barebones ? "border-gray-400" : "border-slate-200"}`}>
        {isCreating ? (
          <div className="flex items-center gap-2">
            <input
              ref={newTitleInputRef}
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={() => {
                if (!newTitle.trim()) {
                  setIsCreating(false);
                  setNewTitle("");
                }
              }}
              onKeyDown={handleCreateKeyDown}
              placeholder="Checklist name…"
              className={`flex-1 min-w-0 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                barebones
                  ? "border-2 border-gray-400 bg-white"
                  : "rounded-xl border border-slate-200"
              }`}
            />
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className={`w-full min-h-[44px] flex items-center justify-center gap-2 text-sm font-medium text-blue-600 ${
              barebones
                ? "border-2 border-gray-400 hover:bg-blue-50"
                : "rounded-xl hover:bg-blue-50 transition-colors"
            }`}
          >
            <Plus className="h-4 w-4" />
            New Checklist
          </button>
        )}
      </div>
    </>
  );

  // Desktop: persistent inline panel
  if (isDesktop) {
    if (isCollapsed) return null;
    return (
      <aside
        className={`w-72 shrink-0 bg-white flex flex-col h-screen sticky top-0 ${
          barebones ? "border-r-2 border-gray-400" : "border-r border-slate-200"
        }`}
      >
        {panelContent}
      </aside>
    );
  }

  // Mobile: overlay
  if (barebones) {
    if (!isOpen) return null;
    return (
      <>
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
        <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white border-r-2 border-gray-400 z-50 flex flex-col">
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white shadow-xl z-50 flex flex-col"
          >
            {panelContent}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
