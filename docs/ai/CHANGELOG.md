# AI Engineering Changelog

Chronological log of changes executed by AI agents on Jeto Vacations (`jet-web`).

---

### Website Content & Route Alignment
**Date**: October 30, 2026
**Type**: `content` / `routing` / `seo`
**Test Status**: 31/31 passing, 0 lint errors, type-check passed, production build passed (769 routes)

#### Changes Made:
1. **Published Reviews**: Replaced the homepage's review placeholder with published traveler feedback from the official review feed. Added `/reviews` with destination/rating filters and pagination; feed records are validated and cached for one hour.
2. **Legacy Route Coverage**: Added redirects for all 26 destination URLs and the original about, review, selector, quote, terms, blog-index, and utility paths. Existing migrated blog slugs redirect to current guides; source blog slugs absent from the current guide data show an explicit notice instead of fabricated article copy.
3. **Office Address**: Added the published Saidulajab, New Delhi address to the footer and contact page.
4. **SEO & Verification**: Added `/reviews` to the canonical sitemap; smoke-tested legacy redirects, destination pages, review filtering, migrated and unavailable blog paths.

---

### Sprint 2 — Production-Readiness Hardening & Abuse Boundaries
**Date**: October 2026  
**Type**: `security` / `performance` / `seo` / `ci`  
**Test Status**: 29/29 passing, 0 lint errors, build succeeded (633 routes)

#### Changes Made:
1. **Bounded Rate Limiter & Abuse Boundary (`src/lib/security/rate-limiter.ts`)**:
   - Replaced unbounded in-memory maps with `BoundedRateLimiter` strictly capped at 5,000 entries.
   - Implemented automatic pruning of expired timestamps and FIFO eviction when capacity is reached, preventing server OOM.
   - Added `normalizeClientIp` to validate length, character set, and extract leftmost client IP, guarding against header injection.
2. **Affirmative User Consent (`RequestQuoteModal.tsx`)**:
   - Changed default `consent` value from `true` to `false`. Requires visitors to affirmatively opt-in by checking the agreement box before lead submission can proceed.
   - Added auto-focus to first form field (`#callback-name`) upon modal open for keyboard and screen-reader accessibility.
3. **Zero Fallback Durations & Descriptions (`packages-unified.ts`, `live-packages-repository.ts`)**:
   - Modified `parseDuration()` to return `{ nights: 0, days: 0 }` for missing input rather than fabricating 4N/5D defaults.
   - Resiliently formats duration across package cards, detail page, moodboard, and quiz (`Custom Duration` when nights/days = 0).
   - Refactored package conversion to omit "Features verified boutique stays" claims on `suggested_draft` packages and distinguish confirmed inclusions from suggested inclusions.
4. **Schema.org Zero-Price Elimination (`src/app/holidays/[slug]/page.tsx`)**:
   - Omitted `offers` / `AggregateOffer` when starting price is undefined or zero, preventing invalid or deceptive `lowPrice: 0` rich snippet indexing by search engines.
5. **Catalogue Bundle Optimization (`src/app/holidays/page.tsx` & `HolidaysCatalogueClient.tsx`)**:
   - Converted `/holidays` from a client-rendered monolith to a Next.js Server Component with server metadata and canonical tags.
   - Stripped heavy day-by-day itinerary structures, descriptions, and crawler JSON on the server, passing lightweight `PackageCatalogueSummary[]` cards to `HolidaysCatalogueClient`.
6. **Customer PII Redaction in Server Logs (`crm-adapter.ts`)**:
   - Removed plaintext customer name and phone logging from the demo callback simulation path; emitted logs now only contain destination and lead ID.
7. **Automated CI Validation Pipeline (`.github/workflows/ci.yml`)**:
   - Added GitHub Actions workflow running ESLint, strict TypeScript checking (`tsc --noEmit`), automated test suite, and Turbopack production build.
8. **Automated Security & Limiter Tests (`tests/rate-limiter.test.mjs`, `tests/crm-adapter.test.mjs`)**:
   - Added 6 automated tests verifying IP normalization, sliding-window throttling, phone duplicate throttle, memory boundary eviction, zero external HTTP calls in demo mode, and 500 error handling. Total suite expanded to **29/29 passing**.
9. **Footer Mobile Responsiveness & WCAG Contrast (`src/components/layout/Footer.tsx`)**:
   - Fixed illegible dark charcoal text on midnight navy background (`#44474d` on `#000d20`), updating navigation links to `text-slate-300 hover:text-white` for full WCAG AAA contrast.
   - Replaced tedious single-column mobile stack with a compact 2-column navigation grid (`grid-cols-2 sm:grid-cols-3`) for Destinations and Holiday Planning.
   - Made newsletter subscription form ergonomically adapt (`flex flex-col sm:flex-row gap-2`) to eliminate squashed inputs on small viewports.
   - Added `pb-24 sm:pb-14` safe padding to prevent fixed mobile bottom CTAs from obscuring copyright or utility links.

---

### Sprint 1 — Local Stabilization & Truthful Data Contract
**Date**: October 2026  
**Type**: `fix` / `security` / `data-trust` / `test`  
**Test Status**: 23/23 passing, 0 lint errors, build succeeded (633 routes)

#### Changes Made:
1. **Production Mode Guard in CRM Adapter (`src/lib/api/crm-adapter.ts`)**:
   - Introduced `getEnquiryMode()` returning `'demo' | 'live' | 'unconfigured'`.
   - Prevented silent fallback to demo mode in production: missing credentials return `status: 'error'`, `isDemo: false`, and an explicit maintenance disclosure instead of a fake lead confirmation.
   - Enforced HMAC-SHA256 signature generation (`X-Jeto-Signature`, `X-Jeto-Timestamp`) when `CRM_WEBHOOK_SECRET` is configured.
2. **Server Action Truthful Status (`src/app/actions/enquiry.ts`)**:
   - Fixed bug where `submitEnquiryAction` returned `{ success: true }` unconditionally even when `crmAdapter.submitEnquiry` failed or returned `'error'`.
   - Action now accurately evaluates `result.status !== 'error'` and propagates error messages.
3. **Demo Mode Display Case-Sensitivity Bug (`src/app/custom-holiday/page.tsx`)**:
   - Fixed case-sensitive lead ID comparison `submittedLeadId?.startsWith('demo-')` to `Boolean(submittedLeadId?.toLowerCase().startsWith('demo-'))`, ensuring uppercase `DEMO-xxxx` IDs display the demo alert banner instead of falsely claiming production submission.
4. **Package Inclusions Truthfulness (`src/app/holidays/[slug]/page.tsx`)**:
   - Dynamically labels inclusions as `"Supplier-Verified Inclusions"` for verified packages versus `"Indicative Inclusions (Customizable)"` for `suggested_draft` packages.
5. **Proposal Privacy Alignment (`src/app/proposal/[id]/page.tsx`)**:
   - Updated copy on not-found/expired view to eliminate outdated reference to browser session retention, truthfully stating proposals are delivered directly by a travel designer.
6. **Automated CRM Integration Test Suite (`tests/crm-adapter.test.mjs`)**:
   - Added 6 integration tests verifying:
     - `getEnquiryMode` environment detection.
     - Demo mode disclosure and `DEMO-` prefix.
     - Production unconfigured error guard.
     - Ephemeral HTTP server webhook delivery with HMAC verification.
     - Proposal storage privacy and zero mock record fallback.
   - Test suite expanded from 17 to **23 passing tests**.
7. **Environment Documentation (`.env.example`)**:
   - Documented `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_SECRET`, and mode semantics.

---

### Commit `9681b8e` — Conversion UI & Data-Trust Sprint
**Date**: October 2026  
**Type**: `feat` / `conversion` / `security` / `data-trust`  
**Test Status**: 17/17 passing, 0 lint errors, build succeeded (633 routes)

#### Changes Made:
1. **Sales Callback Modal (`LeadCallbackModal` / `RequestQuoteModal`)**:
   - Rebuilt enquiry modal into an intent-focused sales callback form powered by `react-hook-form` and `@hookform/resolvers/zod`.
   - Fields: Name (required), Phone (required, with `+91` selector, validated on blur), auto-filled Destination/Package, optional Month, Travellers, Budget, and Notes.
   - Pre-fills destination/package context from card, detail page, or header navigation.
   - Transparent post-submit states: Confirms consultant will call when live; displays honest demo notice when in demo simulation mode; returns actionable phone error if CRM fails.
   - Duplicate-phone throttling and honeypot spam protection added to `src/app/actions/enquiry.ts`.
2. **Customer PII Storage Elimination**:
   - Removed all `localStorage` writes of customer names, phone numbers, and emails in `src/data/proposal-store.ts`.
   - Replaced fake dummy customer proposal generation in `src/app/multi-city/page.tsx` with direct callback modal trigger.
3. **Accurate Catalogue & Truthful States**:
   - Added `priceBasis`, `includesFlights`, `badge`, `verifiedAt`, and `imageStatus` to `HolidayPackage`.
   - Populated `priceBasis` as `"per person · excluding flights"` or clean `"Price on request / details being updated"` for unpriced items (no invented prices).
   - Restricted badges strictly to verified items (`Bestseller`, `Limited dates`, `Family friendly`, `Honeymoon`).
4. **Package Cards Conversion Overhaul**:
   - Redesigned package cards on homepage (`CuratedPackages.tsx`) and `/holidays` to answer: *Where, for how long, at what price, and what's included?*
   - Overlaid destination and duration on large images with subtle gradient.
   - 3 high-value inclusions rendered as compact chips.
   - Primary CTA: **"Customize this package"**, opening callback modal with package prefilled.
5. **Package Detail Page & Sticky Mobile CTA**:
   - Added transparent Cancellation Safeguards and Payment Milestones to detail layout.
   - Built sticky booking dock with date flexibility notes, "Get a Callback" CTA, direct WhatsApp, and phone links.
   - Added fixed **Sticky Mobile Conversion Bar** (`Call` + `Get a Callback`) at viewport bottom on mobile.
6. **Homepage Intent & Outcome Focus**:
   - Updated hero headline: *"Custom India & international holidays, planned by real travel experts."*
   - Added secondary hero CTA: **"Talk to a Travel Expert"**.
   - Updated `SearchCard.tsx` with Destination (autocomplete), Month of travel, Travellers, and Budget.
   - Displayed 6–8 curated packages rather than an overwhelming unverified catalogue.
   - Surfaced real business verification (GSTIN `07AAECJ6467D1ZI`, 4,500+ trips curated since 2018).
7. **Automated Testing Suite**:
   - Added 5 new tests in `tests/enquiry-validation.test.mjs` and `tests/package-parser.test.mjs` covering callback lead schemas, phone length validation, mandatory consent, and truthful `priceBasis`.
   - Total test suite now at **17/17 passing**.

---

### Commit `5f01ac1` — AI Agent Documentation Framework & Decision Records
**Date**: October 2026  
**Type**: `docs` / `chore`  
**Test Status**: 12/12 passing, 0 lint errors, build succeeded (633 routes)

#### Changes Made:
- Established cross-agent entry point in [`AGENTS.md`](file:///mnt/Drive_01/Jeto-personal-build/AGENTS.md) (57 lines, high token efficiency).
- Authored concise Claude Code instructions in [`CLAUDE.md`](file:///mnt/Drive_01/Jeto-personal-build/CLAUDE.md).
- Created architectural codebase and route map in [`docs/ai/CODEBASE_MAP.md`](file:///mnt/Drive_01/Jeto-personal-build/docs/ai/CODEBASE_MAP.md).
- Authored verified runtime health and feature inventory in [`docs/ai/CURRENT_STATE.md`](file:///mnt/Drive_01/Jeto-personal-build/docs/ai/CURRENT_STATE.md).
- Formatted prioritized next milestone with acceptance criteria in [`docs/ai/NEXT_TASK.md`](file:///mnt/Drive_01/Jeto-personal-build/docs/ai/NEXT_TASK.md).
- Authored formal Architecture Decision Records:
  - `D-001_CANONICAL_DOMAIN.md`: Single origin `https://www.jetovacations.com`.
  - `D-002_DEMO_TRANSPARENCY.md`: Explicit demo flag, `DEMO-xxxx` IDs, honest simulation banner.
  - `D-003_PRICE_PROVENANCE.md`: Elimination of default ₹25k fallbacks, `suggested_draft` provenance banners.
  - `D-004_PROPOSAL_PRIVACY.md`: Elimination of fake client fallbacks; secure 404/expired handling.
- Removed `CLAUDE.md` from `.gitignore` so both agent instruction files remain tracked in Git.

---

### Commit `73930fc` — P0/P1 Audit Resolution Sprint
**Date**: October 2026  
**Type**: `fix` / `security` / `test`  
**Test Status**: 12/12 passing, 0 lint errors, build succeeded (633 routes)

#### Changes Made:
1. **Canonical Domain & Metadata Alignment**:
   - Centralized primary domain in `src/data/site-content.ts` as `https://www.jetovacations.com`.
   - Updated `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/layout.tsx`, and `src/app/page.tsx` to reference `SITE_ORIGIN`.
   - Replaced placeholder office details with verified registered business identity (GSTIN `07AAECJ6467D1ZI`).
2. **Transparent Enquiry Demo Mode & Spam Protection**:
   - Updated `src/lib/api/types.ts` and `src/lib/api/crm-adapter.ts` to return explicit `isDemo: true` flag and `DEMO-xxxx` IDs when `CRM_WEBHOOK_URL` is unset.
   - Updated `src/components/common/RequestQuoteModal.tsx` to display an honest, amber-accented notice explaining local demo mode when `isDemo` is returned.
   - Added in-memory sliding-window rate limiting (max 5 requests per 10 minutes per IP) and honeypot bot trap to `src/app/actions/enquiry.ts`.
3. **Price & Itinerary Provenance Safeguards**:
   - Removed silent ₹25,000 fallback in `src/data/packages-unified.ts`. Packages with unparseable prices now display `"Custom Quote on Request"`.
   - Added provenance tagging (`itineraryType: 'suggested_draft'`) and disclaimer banner in `src/components/holidays/InteractiveItineraryCustomizer.tsx` notifying travelers that auto-generated day plans are customizable suggestions.
   - Removed ambiguous partial substring matching in `getPackageBySlug` in favor of strict exact kebab-case matching. Added slug deduplication.
4. **Customer Data Privacy**:
   - Removed hardcoded fake customer record ("Aditya & Family") from `src/data/proposal-store.ts`.
   - Updated `src/app/proposal/[id]/page.tsx` to display a secure "Proposal Not Found or Expired" notice for invalid or expired tokens.
5. **Native Test Suite**:
   - Implemented `tests/package-parser.test.mjs` (price parsing, slug normalization, uniqueness, exact lookup).
   - Implemented `tests/enquiry-validation.test.mjs` (Zod validation, email/phone rules, privacy policy requirement).

---

### Commit `586aee3` — ESLint NTFS Path Exclusion
**Date**: October 2026  
**Type**: `chore`  
**Test Status**: Lint passed (0 errors)

#### Changes Made:
- Added `.src_corrupted_io/**`, `.git_corrupted/**`, and `.next_old*/**` to `globalIgnores` in `eslint.config.mjs` to prevent ESLint 9 from inspecting corrupted NTFS recovery residue.

---

### Commit `eaaff6e` — Hygiene & Comprehensive Project README
**Date**: October 2026  
**Type**: `chore` / `docs`  
**Test Status**: Clean

#### Changes Made:
- Removed obsolete root prompt files (`prompt`, `prompts/`).
- Updated `.gitignore` to prevent tracking discovery packs and raw dumps.
- Authored professional, comprehensive `README.md` detailing tech stack, local setup, architecture, and deployment instructions.

---

### Commit `966b800` — Repository Cleanup
**Date**: October 2026  
**Type**: `chore`  
**Test Status**: Clean

#### Changes Made:
- Untracked bulky discovery packs (`Jeto_CRM_Rebuild_Discovery_Pack`, `Jeto_Copilot_Website_Redesign_Pack`, `stitch_jeto_vacations_homepage_redesign`, and `backups`).

---

### Commit `db5c57d` — Full Platform Rebuild & 433-Package Inventory
**Date**: October 2026  
**Type**: `feat`  
**Test Status**: Build succeeded (633 routes compiled)

#### Changes Made:
- Reconstructed complete 56-file Next.js 16 App Router application.
- Unified 433 crawled packages across 25 destinations in `src/data/live-crawled-packages.json`.
- Restored 129 travel guides in `src/data/travel-guides.ts`.
- Integrated background video hero (`hero-travel.mp4`) with poster fallback and controls.
- Implemented instant live autocomplete search with keyboard navigation (`SearchCard.tsx`).
- Created multi-currency switcher (`CurrencyContext.tsx`) supporting INR, USD, EUR, GBP, AED.
