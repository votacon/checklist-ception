# Checklist-ception

A recursive checklist app where every item can contain its own checklist. Drill down into items to manage subtasks, then navigate back with breadcrumbs — checklists all the way down.

## Features

- **Multiple checklists** — create, rename, and delete named checklists (e.g., "Groceries", "Work Tasks")
- **Collapsible sidebar** — slide-out panel to switch between checklists with animated transitions
- **Recursive checklists** — any item can have subtasks, which can have subtasks, infinitely
- **Cascading stacked cards** — drill into an item and its subtasks appear as a new card to the right, with all ancestor cards staying visible
- **Cascade collapse** — at 3+ levels deep, ancestor cards shrink to save space while keeping context
- **Breadcrumb navigation** — clickable path to jump back to any level
- **Animated transitions** — smooth spring animations when cards enter, exit, and resize
- **Persistent storage** — data saved to localStorage, survives refresh
- **Export/Import** — download your data as JSON, import it on another device
- **Mobile-friendly** — 44px+ touch targets, responsive layout

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

```bash
git clone <repo-url>
cd checklist-ception
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Usage

1. **Open sidebar** — click the hamburger menu (top-left) to view all checklists
2. **Create a checklist** — click "New Checklist" in the sidebar
3. **Switch checklists** — click any checklist in the sidebar
4. **Rename a checklist** — hover and click the pencil icon in the sidebar
5. **Delete a checklist** — hover and click the trash icon (can't delete the last one)
6. **Add items** — type in the input field and press Enter or click Add
7. **Toggle completion** — click the checkbox
8. **Drill down** — click the arrow on any item to open its subtasks as a new card to the right
9. **Navigate back** — use the breadcrumb trail at the top, or scroll left to interact with ancestor cards
10. **Edit an item** — click the pencil icon to rename an item
11. **Delete an item** — click the trash icon to remove an item and all its subtasks
12. **Export** — click Export to download the active checklist as JSON
13. **Import** — click Import to load a previously exported JSON file

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling |
| Motion | Spring-based animations |
| Lucide React | Icon set |
