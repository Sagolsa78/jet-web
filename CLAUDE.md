# CLAUDE.md — Claude Code Project Instructions

This project follows the unified agent documentation framework. Refer to [`AGENTS.md`](./AGENTS.md) as the primary instruction source.

## Quick Reference
- **Entry Point**: Read [`AGENTS.md`](./AGENTS.md) and [`docs/ai/NEXT_TASK.md`](./docs/ai/NEXT_TASK.md) before starting any task.
- **Codebase Index**: Check [`docs/ai/CODEBASE_MAP.md`](./docs/ai/CODEBASE_MAP.md) for file paths and route trees.
- **Current State**: Check [`docs/ai/CURRENT_STATE.md`](./docs/ai/CURRENT_STATE.md) for current health and known launch items.
- **Architecture Decisions**: Review [`docs/ai/decisions/`](./docs/ai/decisions/) before proposing schema or architectural refactors.

## Token Economy
- **Do NOT** read or dump `src/data/live-crawled-packages.json` (433 packages, >400 KB) into context. Use targeted functions in `src/data/packages-unified.ts` or shell greps.
- Keep diffs small, targeted, and atomic.
- After finishing a task, record changes in [`docs/ai/CHANGELOG.md`](./docs/ai/CHANGELOG.md).

## Verification Commands
```bash
npm test        # Fast unit & validation test suite (tsx --test)
npm run lint    # ESLint check
npm run build   # Next.js Turbopack production compilation
```
