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

CardLevel {
  depth: number              // 0 = root, 1+ = drill-down levels
  parentId: string | null    // null for root
  title: string              // card header text
  items: ChecklistItem[]     // items at this level
  activeChildId: string | null  // which item is drilled into (highlighted)
}
```

## Navigation Model

The UI uses a **cascading stacked cards** pattern — drilling into an item adds a new card to the right while keeping all ancestor cards visible.

- `navStack: string[]` — array of item IDs representing the drill-down path
- Empty stack = root level only (one card)
- `[id1, id2]` = three cards visible: root → id1's subtasks → id2's subtasks
- `getAllLevels()` walks the tree following the navStack and returns a `CardLevel[]` — one entry per visible card
- When 3+ cards are open, ancestor cards (all except the last two) collapse to a narrow width with compact item rows

Animations always enter/exit from the right — no direction flag needed.

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
useChecklist({ initialItems, onItemsChange, checklistTitle }) -> {
  rootItems, navStack, editingItem
  cardLevels, breadcrumbPath
  addItem(text, path), toggleItem, deleteItem, startEdit, saveEdit, cancelEdit
  drillDown, navigateToDepth, navigateToRoot
  exportData, importData
}
```
Receives items from the manager and syncs changes back up via `onItemsChange`. The component using this hook is keyed by `activeChecklistId` so switching checklists remounts with fresh state. NavStack is auto-validated — if a tree mutation makes an entry invalid, the stack truncates.

### `useSidebar`
Controls sidebar visibility:
```
useSidebar() -> { isOpen, open, close, toggle }
```
Locks body scroll when sidebar is open.

### `useBarebonesMode`
Manages the barebones mode toggle:
```
useBarebonesMode() -> { barebones: boolean, toggle: () => void }
```
Reads/writes a separate localStorage key (`"checklist-ception-barebones"`). Exposed to the component tree via `BarebonesContext`.

No external state library — React `useState` + `useMemo` is sufficient for this app.

### Persistence

- Storage key: `"checklist-ception-app-state"` (stores full `AppState`)
- Barebones preference: `"checklist-ception-barebones"` (stores `"true"` or `"false"`, separate from AppState to avoid migration)
- Legacy migration: on first load, wraps existing `"checklist-ception-data"` items in a checklist titled "My Checklist"
- Validation: parsed data must match the `AppState` shape with valid `Checklist` and `ChecklistItem` structures; discard on failure
- Saves on every state change in `useChecklistManager`

## Component Tree

```
App (BarebonesContext.Provider)
├── AppContent
│   ├── Sidebar (fixed overlay; animated or instant based on barebones mode)
│   │   └── SidebarItem[] (per checklist)
│   ├── HamburgerButton
│   ├── BarebonesToggle (Zap/ZapOff icon in header)
│   ├── ChecklistView (keyed by activeChecklist.id)
│   │   ├── ExportImportBar
│   │   ├── Breadcrumbs
│   │   ├── CascadingCards (horizontal flex with overflow scroll)
│   │   │   └── motion.div[] or plain div[] (based on barebones mode)
│   │   │       ├── Card title header
│   │   │       └── ChecklistCard
│   │   │           ├── AddItemForm (hidden when collapsed)
│   │   │           └── ChecklistItemRow[] (compact when collapsed, active highlight)
│   │   └── EditItemModal (conditional)
```

## Animation Strategy

In **fancy mode** (default):
- `AnimatePresence mode="popLayout"` wraps the cascading cards
- Each card enters from the right (`x: 300, scale: 0.95`) and exits to the right
- `layout` prop on each card enables smooth width transitions when cards collapse/expand
- Sidebar slides in from left with spring animation (stiffness 400, damping 35)
- Backdrop fades in/out with 200ms transition
- Uses Motion spring transitions for natural feel

In **barebones mode**:
- All Motion components replaced with plain `<div>`s — zero animation overhead
- Auto-scroll uses `behavior: "instant"` instead of `"smooth"`
- Sidebar shows/hides instantly with a flat `border-r-2` instead of `shadow-xl`
- All `transition-colors`, `transition-opacity`, `rounded-*` classes stripped
- Action buttons always visible (no hover reveal)
- Flat borders (`border-2 border-gray-400`) instead of rounded shadows

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Multiple hooks, no state library | App is moderate size; hooks keep logic co-located by concern |
| Key-based remount for checklist switching | Avoids render-time setState; React handles cleanup/init naturally |
| Cascading cards, not single card swap | All ancestor levels stay visible; spatial context is preserved |
| Collapsed ancestor cards at 3+ levels | Saves horizontal space; focus stays on the deepest two cards |
| Path-aware addItem | Each card adds items to its own depth level independently |
| NavStack auto-validation | Deleting a drilled-into item automatically closes orphaned cards |
| localStorage, not a DB | Offline-first, zero setup, no auth needed |
| `crypto.randomUUID()` for IDs | Built into all modern browsers, no dependency |
| Immutable recursive updates | Safer than mutation; works well with React's diffing |
| Fixed overlay sidebar | Standard mobile pattern; backdrop click and Escape to close |
| Barebones mode via Context | Separate localStorage key avoids AppState migration; Context avoids prop drilling |
| Plain divs in barebones | Completely bypasses Motion runtime for zero animation overhead |
