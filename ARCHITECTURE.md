# Architecture

## Data Model

The app manages multiple checklists, each containing a recursive tree of items:

```
Checklist {
  id: string            // crypto.randomUUID()
  title: string         // user-given name
  items: ChecklistItem[]
  createdAt: number     // Date.now()
}

ChecklistItem {
  id: string           // crypto.randomUUID()
  text: string         // user-entered label
  completed: boolean   // checked state
  subtasks: ChecklistItem[]  // recursive children
}

AppState {
  checklists: Checklist[]
  activeChecklistId: string
}
```

## Navigation Model

Instead of rendering a tree, the UI shows **one level at a time** using a card view.

- `navStack: string[]` — array of item IDs representing the drill-down path
- Empty stack = root level
- `[id1, id2]` = viewing subtasks of item `id2`, which is a subtask of `id1`

A `direction` flag (`"forward" | "backward"`) controls slide animation direction.

## State Management

State is split across three hooks:

### `useChecklistManager`
Manages the collection of checklists:
```
useChecklistManager() -> {
  checklists, activeChecklist
  switchChecklist, createChecklist, renameChecklist, deleteChecklist
  updateActiveItems
}
```
Loads/saves `AppState` to localStorage. Handles migration from the legacy single-checklist format.

### `useChecklist`
Manages items within the active checklist:
```
useChecklist({ initialItems, onItemsChange }) -> {
  rootItems, navStack, editingItem, direction
  currentItems, breadcrumbPath
  addItem, toggleItem, deleteItem, startEdit, saveEdit, cancelEdit
  drillDown, navigateTo, navigateToRoot
  exportData, importData
}
```
Receives items from the manager and syncs changes back up via `onItemsChange`. The component using this hook is keyed by `activeChecklistId` so switching checklists remounts with fresh state.

### `useSidebar`
Controls sidebar visibility:
```
useSidebar() -> { isOpen, open, close, toggle }
```
Locks body scroll when sidebar is open.

No external state library — React `useState` + `useMemo` is sufficient for this app.

### Persistence

- Storage key: `"checklist-ception-app-state"` (stores full `AppState`)
- Legacy migration: on first load, wraps existing `"checklist-ception-data"` items in a checklist titled "My Checklist"
- Validation: parsed data must match the `AppState` shape with valid `Checklist` and `ChecklistItem` structures; discard on failure
- Saves on every state change in `useChecklistManager`

## Component Tree

```
App
├── Sidebar (fixed overlay, animated)
│   └── SidebarItem[] (per checklist)
├── HamburgerButton
├── ChecklistView (keyed by activeChecklist.id)
│   ├── ExportImportBar
│   ├── Breadcrumbs
│   ├── AnimatePresence
│   │   └── ChecklistCard (keyed by navStack)
│   │       ├── AddItemForm
│   │       └── ChecklistItemRow[] (or EmptyState)
│   └── EditItemModal (conditional)
```

## Animation Strategy

- `AnimatePresence mode="wait"` wraps the `ChecklistCard`
- Card key changes when `navStack` changes, triggering exit → enter
- Direction-aware: drill-down slides left, navigate-back slides right
- Sidebar slides in from left with spring animation (stiffness 400, damping 35)
- Backdrop fades in/out with 200ms transition
- Uses Motion spring transitions for natural feel

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Multiple hooks, no state library | App is moderate size; hooks keep logic co-located by concern |
| Key-based remount for checklist switching | Avoids render-time setState; React handles cleanup/init naturally |
| Card view, not tree | Cleaner UX for mobile; avoids deep nesting layout issues |
| localStorage, not a DB | Offline-first, zero setup, no auth needed |
| `crypto.randomUUID()` for IDs | Built into all modern browsers, no dependency |
| Immutable recursive updates | Safer than mutation; works well with React's diffing |
| Fixed overlay sidebar | Standard mobile pattern; backdrop click and Escape to close |
