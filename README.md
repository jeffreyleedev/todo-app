# Todo App

A drag-and-drop todo application built with React, TypeScript, and Vite, following Clean Architecture and Domain-Driven Design principles.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Zustand** — State management
- **Tailwind CSS** — Styling
- **@dnd-kit** — Drag-and-drop
- **Vitest** + **Testing Library** — Unit/component tests
- **Playwright** — E2E tests

## Getting Started

```bash
npm install
npm run dev
```

## Architecture

```
src/
├── domain/           # Core business logic, entities, repository interfaces
├── application/      # State management (Zustand store)
├── infrastructure/   # Repository implementations (e.g., LocalStorage)
└── presentation/     # React UI — features, pages, layout, shared components
```

Imports use the `@/` alias for the `src/` directory (e.g., `import { cn } from '@/presentation/shared/utils/cn'`).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Typecheck and build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run test` | Run unit/component tests (Vitest) |
| `npm run test:run` | Run tests once (non-watch) |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI |
| `npm run preview` | Preview production build |
| `npm run format:check` | Check formatting with Prettier |
