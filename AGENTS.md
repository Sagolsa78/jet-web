# AGENTS.md — AI Agent Engineering Guide

Cross-agent operating instructions for Jeto Vacations (`jet-web`). Every AI agent must read this file and [`docs/ai/NEXT_TASK.md`](./docs/ai/NEXT_TASK.md) before executing tasks.

---

## 1. Project Overview & Tech Stack
- **Project**: Jeto Vacations (`https://www.jetovacations.com`) — Luxury outbound travel portal.
- **Stack**: Next.js 16 (App Router, Turbopack), React 19, TypeScript 5, Tailwind CSS v4.
- **Data Source**: 433 crawled packages, 29 destination routes, and 129 crawled plus 4 curated travel guides.
- **Enquiry Flow**: Client Modal (`RequestQuoteModal`) → Server Action (`submitEnquiryAction` in `src/app/actions/enquiry.ts`) with sliding-window rate limiting & honeypot → CRM Adapter (`src/lib/api/crm-adapter.ts`).

---

## 2. Token-Saving Workflow
1. **Read Entry Points First**: Read this file and [`docs/ai/NEXT_TASK.md`](./docs/ai/NEXT_TASK.md).
2. **Consult Codebase Map**: Check [`docs/ai/CODEBASE_MAP.md`](./docs/ai/CODEBASE_MAP.md) to locate relevant modules. Do **not** dump or read large files like `live-crawled-packages.json` directly into context.
3. **Inspect State & Decisions**: Review [`docs/ai/CURRENT_STATE.md`](./docs/ai/CURRENT_STATE.md) and [`docs/ai/decisions/`](./docs/ai/decisions/) before modifying core schemas.
4. **Make Targeted Changes**: Modify only the files strictly required for the active task.
5. **Verify Thoroughly**: Run lint, tests, and build before concluding.
6. **Update Tracking**: Append to [`docs/ai/CHANGELOG.md`](./docs/ai/CHANGELOG.md) and update [`docs/ai/CURRENT_STATE.md`](./docs/ai/CURRENT_STATE.md) / [`docs/ai/NEXT_TASK.md`](./docs/ai/NEXT_TASK.md) when task scope shifts.

---

## 3. Essential Commands
```bash
# Run unit & schema tests (31 tests)
npm test

# Run ESLint validation
npm run lint

# Compile Turbopack production build (769 routes)
npm run build

# Start local dev server (port 3000)
npm run dev
```

---

## 4. Non-Negotiable Engineering Rules
1. **Exact Slug Matching**: In `src/data/packages-unified.ts`, `getPackageBySlug(slug)` must match exact slugs. Never reintroduce ambiguous partial substring matching.
2. **Transparent Demo Mode**: When real CRM credentials (`CRM_WEBHOOK_URL`) are absent, CRM adapter returns `isDemo: true` and `DEMO-xxxx` IDs. The UI must explicitly disclose this is a local simulation. Never falsify real enquiry dispatch.
3. **No Fabricated Pricing or Itineraries**: Packages without explicit starting prices must display "Custom Quote on Request" (never silently fall back to ₹25,000). Auto-generated sample itineraries must retain the `suggested_draft` provenance tag and UI disclaimer.
4. **Customer Data Privacy**: Proposal routes (`/proposal/[id]`) must never fall back to hardcoded mock customer records (e.g. "Aditya & Family"). Unknown or invalid IDs must render the secure "Proposal Not Found or Expired" view.
5. **Canonical Domain**: Canonical URL is strictly `https://www.jetovacations.com`. Do not reference temporary or placeholder domains.
6. **Filesystem Caution (NTFS / Linux)**: The workspace is hosted on an NTFS mount. Build cache `.next` is symlinked to `/tmp/jeto-next-build` to prevent fuseblk inode locking. Do not remove the symlink.

---

## 5. Quick Links
- Architecture & Module Paths: [`docs/ai/CODEBASE_MAP.md`](./docs/ai/CODEBASE_MAP.md)
- Verified Status & Known Issues: [`docs/ai/CURRENT_STATE.md`](./docs/ai/CURRENT_STATE.md)
- Commit & Change History: [`docs/ai/CHANGELOG.md`](./docs/ai/CHANGELOG.md)
- Active Sprint Task: [`docs/ai/NEXT_TASK.md`](./docs/ai/NEXT_TASK.md)
- Architecture Decisions: [`docs/ai/decisions/`](./docs/ai/decisions/)
