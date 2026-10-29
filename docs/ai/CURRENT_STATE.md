# Current System State & Launch Readiness

Status report for Jeto Vacations (`jet-web`) as of **October 2026**.

---

## 1. Verified Build & Test Health

| Check | Tool / Command | Result | Notes |
|---|---|---|---|
| **Unit & Integration Tests** | `npm test` (`tsx --test`) | **31 / 31 PASSING** | Validates enquiry, package, rate-limit, CRM, proposal privacy, and official review-feed parsing behavior |
| **Linter** | `npm run lint` (`eslint`) | **0 ERRORS**, 4 warnings | Clean. Warnings relate to standard Google font preloads and React Compiler notice on RHF watch() |
| **Production Build** | `npm run build` | **PASSED** | 769 routes compiled, including the review page and legacy guide aliases |
| **Type Checking** | `npx tsc --noEmit` | **0 ERRORS** | Strict TypeScript adherence |
| **CI Automation** | `.github/workflows/ci.yml` | **CONFIGURED** | Automated lint, strict TypeScript, unit/integration tests, and Turbopack production build validation on main pushes and pull requests |

---

## 2. Feature Inventory & Verified Capabilities

### Core Catalogue & Search
- **433 Live Outbound Packages**: Crawled inventory merged with hand-crafted flagship tours in `src/data/packages-unified.ts`.
- **Server Component Catalogue Architecture**: `/holidays` is rendered as a Next.js Server Component that strips full itinerary structures, day descriptions, and crawler metadata before passing lightweight summary cards to `HolidaysCatalogueClient`, dramatically minimizing client JavaScript download and parse costs on mobile devices.
- **Slug Deduplication**: Automated slug uniqueness guard prevents duplicate package routing collisions.
- **Exact Slug Matching**: `getPackageBySlug()` requires exact kebab-case match; ambiguous substring matching eliminated.
- **Zero Fallback Durations & Prices**: `parseDuration()` returns `{ nights: 0, days: 0 }` for missing input rather than fabricating 4N/5D defaults. `parsePrice()` returns `hasValidPrice: false` rather than inventing ₹25,000.
- **SEO Schema.org Protection**: Package detail page omits `offers` / `AggregateOffer` when starting price is unknown, preventing search engines from receiving misleading `lowPrice: 0`.
- **Itinerary Provenance**: Auto-generated itineraries are tagged with `itineraryType: 'suggested_draft'` and display a disclaimer informing travelers that activities are customizable suggestions.
- **Conversion Package Cards**: Answer *Where, for how long, at what price, and what's included?* with destination & duration overlaid on images, 3 compact inclusion chips, truthful badges (`Bestseller`, `Limited dates`, `Family friendly`, `Honeymoon`), and primary CTA "Customize this package".
- **Live Search & Intent Card**: Autocomplete search on homepage (`SearchCard.tsx`) with Destination, Month, Travellers, and Budget, plus faceted filtering on `/holidays`.
- **Published Traveler Reviews**: Homepage displays published reviews from the official review feed; `/reviews` provides pagination and destination/rating filters. Feed records are schema-validated and cached for one hour.
- **Legacy Route Compatibility**: Original destination and utility URLs redirect to current routes. Of 162 unique source blog slugs checked, 127 match existing guide data; the remaining 35 show an explicit migration notice rather than fabricated article content.

### Video Hero & Visual Experience
- **Hero Video & Outcome Copy**: Background looping video with poster fallback, and outcome-driven headline *"Custom India & international holidays, planned by real travel experts"*, plus secondary CTA *"Talk to a Travel Expert"*.
- **Responsive Layouts**: Desktop navigation dropdowns and mobile slide-over drawer in `Header.tsx`.
- **Multi-Currency Converter**: Dynamic client-side rate switching (`INR`, `USD`, `EUR`, `GBP`, `AED`) across all cards and detail views.

### Sales Callback Lead Flow & Security
- **Affirmative User Consent**: Form default in `RequestQuoteModal.tsx` and `/custom-holiday` sets `consent: false`. Users must actively check the agreement box before submission.
- **Reusable `LeadCallbackModal`**: Intent-focused sales callback form powered by React Hook Form and Zod. Fields: Name (required), Phone (required, validated on blur), prefilled Destination/Package, and optional Month, Travellers, Budget, and Notes.
- **Server Action Architecture**: `submitCallbackLeadAction` and `submitEnquiryAction` in `src/app/actions/enquiry.ts`.
- **Bounded Sliding-Window Rate Limiter (`src/lib/security/rate-limiter.ts`)**: In-memory rate limiter strictly bounded to 5,000 entries with automatic expired entry pruning and FIFO eviction. Derived IP addresses are validated and normalized to prevent header injection or spoofing.
- **Duplicate Phone Throttling**: Restricts duplicate submissions from the same telephone number to 2 per 2-minute window.
- **Honeypot Spam Protection**: Hidden off-screen field catches automated bots and silently drops payloads.
- **Zero Customer PII Logging**: Server-side logs redact customer names and phone numbers; only non-sensitive metadata (destination, Pax, lead ID) is emitted.
- **Transparent Demo Mode & Production Safeguard**: `getEnquiryMode()` enforces `'demo' | 'live' | 'unconfigured'`. In development/test, demo mode returns `isDemo: true` and honest simulation disclosure. In `production`, missing CRM credentials cleanly reject submissions with an explicit maintenance notice (`status: 'error'`, `isDemo: false`) rather than silently faking demo success.
- **Webhook Dispatch with HMAC-SHA256**: When `CRM_WEBHOOK_URL` and `CRM_WEBHOOK_SECRET` are provided, submissions include signed `X-Jeto-Signature` and `X-Jeto-Timestamp` headers.
- **Server Action Validation**: `submitCallbackLeadAction` and `submitEnquiryAction` in `src/app/actions/enquiry.ts` verify adapter status and never claim `{ success: true }` when adapter returns `'error'`.
- **Truthful Package Inclusions**: `src/app/holidays/[slug]/page.tsx` renders `"Supplier-Verified Inclusions"` for verified packages and `"Indicative Inclusions (Customizable)"` for `suggested_draft` packages.
- **Customer PII Storage Elimination**: Zero customer PII in browser `localStorage`. Proposals route displays secure not-found notice without leaking mock client profiles or session state.
- **Sticky Mobile CTA**: Package detail pages feature a fixed bottom conversion bar (`Call` + `Get a Callback`) for instant mobile conversion.

### Domain & Compliance
- **Canonical Domain**: Standardized on `https://www.jetovacations.com` across metadata, OpenGraph, dynamic sitemap (`/sitemap.xml`), and robots (`/robots.txt`).
- **Verified Business Identity**: Legal footer and `/about` display official GSTIN `07AAECJ6467D1ZI` and registered New Delhi address.
- **Office Location in Footer**: Footer and contact page display the published Saidulajab, New Delhi office address; the original reviews route is linked from the footer.
- **Review Sitemap Entry**: `/reviews` is included in the canonical XML sitemap; legacy redirects are not advertised as canonical URLs.
- **Privacy & Terms**: Complete legal policies on `/privacy` and `/terms`.

---

## 3. Launch Blocker vs Improvement Backlog

> [!IMPORTANT]
> The website is **NOT production-ready for public lead acquisition** merely because the build passes and tests are green. Genuine lead capture remains a hard launch gate until external delivery pipelines are configured and verified.

### Priority 1: Launch Dependencies (Requires External Configuration)
1. **Live CRM Webhook Ingestion & Endpoint Contract**:
   - *Current Status*: Running in transparent Demo Mode (`isDemo: true`) locally and in development. In production mode, missing credentials safely return an explicit maintenance notice (`status: 'error'`, `isDemo: false`) rather than faking success.
   - *To Launch*: Obtain verified webhook URL and secret from the CRM desk and configure `CRM_WEBHOOK_URL` and `CRM_WEBHOOK_SECRET` in production environment variables.
2. **Distributed Rate Limiting Infrastructure**:
   - *Current Status*: Bounded in-memory sliding-window limiter (`src/lib/security/rate-limiter.ts`) capping map storage to 5,000 entries per Node process.
   - *To Launch*: In a multi-instance or serverless edge deployment across regions, memory state is not shared between instances. A shared key-value store (Upstash Redis or Cloudflare Rate Limiting) is required as an infrastructure dependency before public marketing campaigns.
3. **Server-Side Proposal Persistence & Authentication**:
   - *Current Status*: Proposal schema, RLS policies, and data contracts architected in `docs/database/001_proposals_schema.sql` and ADR `D-005_PROPOSAL_DATABASE_SCHEMA.md`. Public route `/proposal/[id]` currently renders the privacy-guarded notice until Supabase credentials are provisioned. Customer PII is strictly protected with zero browser `localStorage` leaks.
   - *To Launch*: Run migration in Supabase/PostgreSQL project and set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to activate real proposal generation.

### Priority 2: Post-Launch Enhancements (Can Wait)
1. **Third-Party Image CDN**: Migrate external Unsplash images to an optimized Cloudflare or AWS CloudFront CDN with pre-generated AVIF/WebP thumbnails.
2. **Automated E2E Playwright Suite**: Add headless browser tests to continuously verify modal tab indexing, mobile drawer toggles, and form submission flows across viewport sizes.
3. **Analytics & Turnstile Captcha**: Implement Cloudflare Turnstile token verification in `submitEnquiryAction` when traffic scales.

---

## 4. Operational & Filesystem Caveats
- **NTFS `/mnt/Drive_01` Mount**: On this Linux host, `.next` is symlinked to `/tmp/jeto-next-build` to prevent NTFS fuseblk inode concurrency locks during Turbopack builds. Keep this symlink intact.
