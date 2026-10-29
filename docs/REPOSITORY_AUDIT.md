# Repository Audit — Jeto Vacations Website

> Last updated: 2026-10-23 (Phase 0 Re-Discovery)

## 1. Repository Identity

| Attribute | Evidence |
|---|---|
| **Type** | Customer-facing public travel website for Jeto Vacations |
| **Working Directory** | `/mnt/Drive_01/Jeto-personal-build` |
| **Git Status** | **Not a git repository** — no `.git` folder. Recommend initializing immediately. |
| **Package Name** | `temp-app` (in `package.json` — should be renamed to `jeto-vacations-web`) |

## 2. Technology Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | **16.4.2** | Turbopack for CSS; `cacheComponents` + `partialPrefetching` enabled |
| Language | TypeScript | ^5 | Strict mode enabled |
| React | React | 19.3.0 | Server Components used by default |
| Styling | Tailwind CSS | ^4 | Via `@tailwindcss/turbopack` loader; `@theme inline` block in `globals.css` |
| Typography | Playfair Display + Inter | @fontsource | Imported in root layout |
| Forms | react-hook-form 7.90 + @hookform/resolvers 6.0 + Zod 4.6 | — | Multi-step wizard with server-side validation |
| Package Manager | npm | — | `package-lock.json` present (242 KB) |
| Linting | ESLint 9 + eslint-config-next | — | `npm run lint` |
| Testing | **None installed** | — | No test runner or test files found |

## 3. Design System Tokens (in `globals.css`)

| Token | Value | Usage |
|---|---|---|
| `--color-brand-navy` | `#0B233F` | Primary dark / headings / hero backgrounds |
| `--color-brand-teal` | `#078E9B` | Accents / CTAs / highlights |
| `--color-brand-sand` | `#F7F2E8` | Light backgrounds / borders |
| `--color-brand-coral` | `#F47C5C` | Secondary CTAs / emphasis |
| `--font-serif` | Playfair Display | Display headings |
| `--font-sans` | Inter | Body text |

## 4. Route Structure (16 pages, all building successfully)

| Route | File | Type | Status |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Static (Server Component) | ✅ Implemented |
| `/holidays` | `src/app/holidays/page.tsx` | Client Component | ✅ Implemented (search/filter/empty state) |
| `/holidays/[slug]` | `src/app/holidays/[slug]/page.tsx` | Static + Partial Prerender | ✅ Implemented (hero, itinerary, inclusions, sidebar) |
| `/destinations` | `src/app/destinations/page.tsx` | Static | ✅ Implemented |
| `/destinations/[slug]` | `src/app/destinations/[slug]/page.tsx` | Static + Partial Prerender | ✅ Implemented (hero, gallery, related packages) |
| `/themes/[slug]` | `src/app/themes/[slug]/page.tsx` | Static + Partial Prerender | ✅ Implemented |
| `/custom-holiday` | `src/app/custom-holiday/page.tsx` | Client Component | ✅ Implemented (7-step wizard, validation, submit) |
| `/about` | `src/app/about/page.tsx` | Static | ✅ Implemented |
| `/contact` | `src/app/contact/page.tsx` | Static | ✅ Implemented |
| `/privacy` | `src/app/privacy/page.tsx` | Static | ✅ Present (content TBD) |
| `/terms` | `src/app/terms/page.tsx` | Static | ✅ Present (content TBD) |
| `/not-found` | `src/app/not-found.tsx` | Static | ✅ Implemented |
| `/robots.txt` | `src/app/robots.ts` | Static | ✅ Implemented |
| `/sitemap.xml` | `src/app/sitemap.ts` | Dynamic | ✅ Implemented |

### Missing routes from sitemap reference:
- `/reviews` — Not created
- `/travel-guides/[slug]` — Not created (P2)
- `/cancellation-policy` — Not created
- `/cookies` — Not created
- `/track-enquiry` — Not created (P3, later phase)

## 5. Component Inventory

| Component | Path | Notes |
|---|---|---|
| `Header` | `src/components/layout/Header.tsx` | Client component, mobile menu, fixed top nav |
| `Footer` | `src/components/layout/Footer.tsx` | Server component, 4-column grid layout |
| `Button` | `src/components/ui/Button.tsx` | 4 variants (primary/secondary/outline/ghost), 3 sizes |
| `Card` | `src/components/ui/Card.tsx` | Simple container with rounded corners and hover shadow |

## 6. Data Layer

| File | Contents |
|---|---|
| `src/data/sample-destinations.ts` | 4 destinations (Maldives, Switzerland, Bali, Kashmir) with Unsplash hero images |
| `src/data/sample-packages.ts` | 3 packages with itineraries, inclusions/exclusions, pricing in INR |
| `src/types/index.ts` | `Destination`, `HolidayPackage`, `ItineraryDay`, `EnquiryFormInputs`, `TravelStyle` |

**Note:** Bali package has a broken image URL on line 61 of `sample-packages.ts` (truncated Unsplash URL).

## 7. API / CRM Adapter

| File | Purpose |
|---|---|
| `src/lib/api/client.ts` | Generic `apiRequest<T>()` using `JETO_CRM_API_BASE_URL` env var |
| `src/lib/api/crm-adapter.ts` | `getDestinations()`, `getPackages()`, `submitEnquiry()` with `DEMO_ENQUIRY_MODE` toggle |
| `src/lib/api/types.ts` | `ApiResponse<T>`, `CRMLeadResponse`, `PublicEnquiryPayload` |
| `src/lib/validations/enquiry.ts` | 6-step Zod schema (destination → logistics → travellers → budget → preferences → contact) |
| `src/app/actions/enquiry.ts` | Server Action wrapping validation + CRM adapter submission |

**Current mode:** No `.env` file present → API calls will throw. Demo mode is opt-in via `DEMO_ENQUIRY_MODE=true`.

## 8. Image Strategy

- All images reference **Unsplash URLs** (authorized via `next.config.ts` remote pattern).
- No local brand assets (logo, favicon is default Next.js).
- `next/image` used consistently with `fill` + `object-cover`.

## 9. Build & Lint Status

| Command | Result |
|---|---|
| `next build` | ✅ **Passes** — 26 pages generated, 0 TypeScript errors |
| `next lint` | Not verified in this audit |

## 10. Security Observations

- ✅ API base URL is server-only (not `NEXT_PUBLIC_*`)
- ✅ Server Action validates with Zod before CRM submission
- ⚠️ No rate limiting on enquiry endpoint
- ⚠️ No honeypot field for spam prevention
- ⚠️ Contact page contains **placeholder** phone/email that may not be real (`+91 98765 43210`, `hello@jetovacations.in`)
- ⚠️ No `.env.example` documenting required environment variables

## 11. Risks & Unknowns

| Risk | Severity | Mitigation |
|---|---|---|
| No git history — all work is uncommitted | **Critical** | Initialize git immediately |
| Legacy CRM endpoints unverified | High | Demo adapter exists; don't call live URLs without verification |
| Only 3 sample packages + 4 destinations | Medium | Sufficient for development; needs real content before launch |
| No test infrastructure | Medium | Install vitest or jest before Phase 4 |
| Placeholder contact information | Medium | Replace with real/configurable data or clearly label as placeholder |
| Homepage has duplicate nav (inline nav + Header component) | Low | The homepage `page.tsx` renders its own `<nav>` which overlaps the global `<Header>` |
| No `.env` file or `.env.example` | Medium | Create `.env.example` with `JETO_CRM_API_BASE_URL` and `DEMO_ENQUIRY_MODE` |
