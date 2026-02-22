# Checklist-ception — Instructions for Claude Code

## Project Description
A recursive checklist manager built with React. Clicking a checklist item drills into a new card view showing that item's subtasks — checklists inside checklists, all the way down. Navigation uses a breadcrumb trail with animated card transitions (no tree view).

## Tech Stack
- **Framework:** React 19+ with TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS v4
- **Animation:** Motion (formerly Framer Motion)
- **Icons:** Lucide React
- **Storage:** localStorage (no backend)

## Security Rules
- **No XSS:** Never use `dangerouslySetInnerHTML` or `eval()`
- **Sanitize storage:** Always validate and type-check data loaded from localStorage; discard on failure
- **No secrets:** Never commit API keys, tokens, or credentials

## Git Rules
- **Author:** Commits must be authored by the human developer, not Claude
- **Co-Authored-By trailer** is acceptable
- **Commit messages:** Short imperative subject line; body if needed

## Code Style
- Functional components only — no class components
- Named exports (not default exports)
- Hooks live in `src/hooks/`
- Utilities live in `src/utils/`
- Types live in `src/types/`
- Components live in `src/components/`, one component per file
- Use `interface` over `type` for object shapes

## NPM Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## Documentation Rules
- Update README.md and ARCHITECTURE.md after significant changes
