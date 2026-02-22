# Checklist-ception

A recursive checklist app where every item can contain its own checklist. Drill down into items to manage subtasks, then navigate back with breadcrumbs — checklists all the way down.

## Features

- **Recursive checklists** — any item can have subtasks, which can have subtasks, infinitely
- **Card-based drill-down** — click an item to see its subtasks in a new card (not a tree)
- **Breadcrumb navigation** — clickable path to jump back to any level
- **Animated transitions** — smooth slide animations when navigating between levels
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

1. **Add items** — type in the input field and press Enter or click Add
2. **Toggle completion** — click the checkbox
3. **Drill down** — click the arrow on any item to see/add its subtasks
4. **Navigate back** — use the breadcrumb trail at the top
5. **Edit** — click the pencil icon to rename an item
6. **Delete** — click the trash icon to remove an item and all its subtasks
7. **Export** — click Export to download your data as JSON
8. **Import** — click Import to load a previously exported JSON file

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling |
| Motion | Spring-based animations |
| Lucide React | Icon set |
