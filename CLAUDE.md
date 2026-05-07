# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Start dev server
npm run build         # Typecheck (tsc -b) + build
npm run lint          # ESLint
npm run format        # Prettier (run after code changes)
npm run test          # Vitest (watch)
npm run test:run      # Vitest (one-shot)
npm run test:e2e      # Playwright E2E
```

Run a single test file: `npx vitest run src/path/to/file.test.ts`

## Architecture

Clean Architecture / DDD with **enforced layer boundaries via ESLint** (`eslint-plugin-boundaries`). Violating these import rules will fail the lint check:

- `domain` → can only import from `domain`
- `application` → can import `domain`, `application`
- `infrastructure` → can import `domain`, `infrastructure`
- `presentation` → can import `domain`, `application`, `presentation`

```
src/
├── domain/           # Entities (Todo, Filter), pure functions, repository interfaces
├── application/      # Zustand store (useTodoStore) — bridges domain + infrastructure
├── infrastructure/   # LocalStorageTodoRepository — concrete repo implementation
└── presentation/     # React UI: features/todo, pages, layout, shared components/hooks/utils
```

Use the `@/` alias for all imports from `src/` (e.g., `import { cn } from '@/presentation/shared/utils/cn'`).

Each layer's public API is re-exported through its `index.ts`.

## Key Patterns

**State**: `useTodoStore` (Zustand) is the single source of truth. Every mutation calls `repository.save()` immediately after `set()` to persist to localStorage.

**Conditional classes**: Always use the `cn` utility at `src/presentation/shared/utils/cn.ts` (clsx + tailwind-merge wrapper).

**Icons**: Use the `Icon` component with Material Symbols Outlined ligature names (e.g., `<Icon name="check_circle" fill />`). The font is loaded from `/public/fonts/`.

**Tests**: Unit/component tests are co-located with source files (`*.test.ts(x)`). E2E tests are in `e2e/` with Page Object models in `e2e/pages/`.

## Design System

The UI follows a design system inspired by The Verge (dark editorial, hazard accents). Full spec in `DESIGN.md`. Tailwind tokens are pre-configured — prefer them over raw hex values:

- Canvas: `bg-canvas` (`#131313`)
- Accents: `text-mint` / `bg-mint` (`#3cffd0`), `bg-ultraviolet` (`#5200ff`)
- Text: `text-text-primary`, `text-text-secondary` (`#949494`), `text-text-muted`
- Fonts: `font-display` (Bebas Neue), `font-sans` (Space Grotesk), `font-mono` (Space Mono)
- Border radii: `rounded-20`, `rounded-24`, `rounded-40` — never use square corners on cards/buttons
- No `box-shadow` for elevation — use 1px borders or accent fills instead

## Coding Guidelines

**Think before coding.** State assumptions explicitly. If multiple interpretations exist, surface them — don't pick silently.

**Minimum code that solves the problem.** No speculative features, no abstractions for single-use code, no flexibility that wasn't requested.

**Touch only what you must.** Don't improve adjacent code, comments, or formatting. Match existing style. Every changed line should trace directly to the request.

**Define success criteria.** For bug fixes: write a test that reproduces it, then make it pass. For multi-step tasks, state a brief plan with verifiable steps before implementing.
