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

## Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
