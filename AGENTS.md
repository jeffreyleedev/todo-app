# OpenCode Instructions

## Architecture

This React application follows Clean Architecture / Domain-Driven Design (DDD) principles:

- `src/domain/`: Core business logic, entities (e.g., `Todo.ts`), and repository interfaces.
- `src/application/`: Application state management, specifically using Zustand (`useTodoStore.ts`).
- `src/infrastructure/`: Concrete implementations of domain interfaces (e.g., `LocalStorageTodoRepository.ts`).
- `src/presentation/`: React UI layer. Grouped by `features` (e.g., `todo`), `pages`, `layout`, and `shared` components.

## Testing

- **Unit/Component Tests:** Run with `npm run test` (Vitest). Test files are co-located alongside source files (e.g., `*.test.tsx`).
- **E2E Tests:** Run with `npm run test:e2e` (Playwright). Test files are located in the `e2e/` directory.

## Styling & Utilities

- Tailwind CSS is the primary styling solution.
- For conditional or dynamic class names, use the `cn` utility (wrapper around clsx + tailwind-merge) located at `src/presentation/shared/utils/cn.ts`.

## Development Workflow

- **Lint:** `npm run lint` (ESLint)
- **Format:** `npm run format` (Prettier)
- **Typecheck & Build:** `npm run build` (`tsc -b && vite build`)
- **Dev Server:** `npm run dev`

## Imports

- Use the `@/` alias for absolute imports pointing to the `src/` directory (e.g., `import { cn } from '@/presentation/shared/utils/cn';`).
