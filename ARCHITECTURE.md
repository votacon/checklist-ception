# Architecture

## Data Model

The entire state is a recursive tree of `ChecklistItem` nodes:

```
ChecklistItem {
  id: string           // crypto.randomUUID()
  text: string         // user-entered label
  completed: boolean   // checked state
  subtasks: ChecklistItem[]  // recursive children
}
```

Root state is `ChecklistItem[]` — a flat array of top-level items, each potentially containing nested subtasks.

## Navigation Model

Instead of rendering a tree, the UI shows **one level at a time** using a card view.

- `navStack: string[]` — array of item IDs representing the drill-down path
- Empty stack = root level
- `[id1, id2]` = viewing subtasks of item `id2`, which is a subtask of `id1`

A `direction` flag (`"forward" | "backward"`) controls slide animation direction.

## State Management

All state lives in a single custom hook: `useChecklist`.

```
useChecklist() -> {
  // State
  rootItems, navStack, editingItem, direction

  // Derived
  currentItems, breadcrumbPath

  // CRUD
  addItem, toggleItem, deleteItem, startEdit, saveEdit, cancelEdit

  // Navigation
  drillDown, navigateTo, navigateToRoot

  // Persistence
  exportData, importData
}
```

No external state library — React `useState` + `useMemo` is sufficient for this app.

### Persistence

- On mount: load from `localStorage` key `"checklist-ception-data"`
- On `rootItems` change: save to `localStorage`
- Validation: parsed data must be an array of objects with required fields; discard on failure

## Component Tree

```
App
├── Breadcrumbs
├── ExportImportBar
├── AnimatePresence
│   └── ChecklistCard (keyed by navStack depth)
│       ├── AddItemForm
│       └── ChecklistItem[]  (or EmptyState)
└── EditItemModal (conditional)
```

## Animation Strategy

- `AnimatePresence mode="wait"` wraps the `ChecklistCard`
- Card key changes when `navStack` changes, triggering exit → enter
- Direction-aware: drill-down slides left, navigate-back slides right
- Uses Motion spring transitions for natural feel

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Single hook, no state library | App is small; one hook keeps logic co-located |
| Card view, not tree | Cleaner UX for mobile; avoids deep nesting layout issues |
| localStorage, not a DB | Offline-first, zero setup, no auth needed |
| `crypto.randomUUID()` for IDs | Built into all modern browsers, no dependency |
| Immutable recursive updates | Safer than mutation; works well with React's diffing |
