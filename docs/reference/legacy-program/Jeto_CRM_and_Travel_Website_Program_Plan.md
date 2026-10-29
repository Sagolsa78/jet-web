# Jeto Vacations — CRM Rebuild + Customer Travel Website Program Plan

**Document type:** Product strategy, requirements, system design, and phased implementation plan  
**Prepared:** 20 October 2026  
**Status:** Planning baseline — not implementation evidence  
**Working brand assumption:** Jeto Vacations / Jeto CRM, based on names and legacy references in the supplied files. Confirm domain and brand ownership before launch.

---

## 1. Executive direction

Build two tightly integrated products:

1. **Jeto Vacations website (`www`):** a polished, mobile-first holiday discovery and enquiry experience that feels like a travel brand—not an internal CRM or generic admin template. It should use destination storytelling, curated holiday packages, transparent inclusions, clear starting prices, trust signals, and low-friction trip-planning calls to action.
2. **Jeto CRM (`crm`):** a private, role-protected workspace used by sales, operations, finance, marketing, support, HR and management to turn enquiries into quotes, bookings, travel operations, reconciled financial records and post-trip service.
3. **Shared API and data platform:** one system of record for published packages, destinations, enquiries, customers, quotes, trips, bookings and communications. The public website may submit enquiries and read explicitly published catalogue data; it must never expose internal supplier costs, staff data, private notes, finance records or privileged integrations.

### Recommended first commercial release

Ship an **enquiry-first website** with destination and package discovery, a custom-holiday form, WhatsApp/callback contact, SEO landing pages, and automatic lead creation in the CRM. Deliver the CRM sales core (lead intake, assignment, follow-ups, customer profile, trip pipeline and quote workflow) alongside it. Do not promise instant airline/hotel ticket issuance until provider access, pricing rules, payment reconciliation and cancellation/refund operations have been proven in staging.

### Why this approach

The uploaded API wrapper and compiled frontend imply a mature but inconsistent travel operations tool. Starting with a full rewrite of every legacy endpoint at once would carry hidden workflow and migration risk. A phased rebuild preserves the important capabilities while replacing the internal design, security model, data contracts, and user experience. Public website and CRM work can proceed in parallel after the shared domain model and enquiry contract are agreed.

---

## 2. Evidence, boundaries, and assumptions

### Evidence extracted from the supplied files

- The compiled React/webpack bundle declares **91 page path strings**. That is a frontend route inventory, not proof of 91 unique working screens or backend routes.
- The API service module contains **439 detected exported API-call occurrences** and **436 distinct literal HTTP-method/path pairs**. This excludes unresolvable dynamic paths and does not prove each path is registered or working on the backend.
- Source areas include leads, customers, trips/sales pipeline, quotes, hotel/tour/supplier records, flights and bookings, visa/documents, finance/currency, marketing and telephony, tasks/projects, HR/attendance/assets, analytics, AI extraction/call insights and configuration.
- The source references `https://jeto-crm-server.onrender.com` and `https://web-production-6467.up.railway.app`; other URLs appear in comments. `getActiveServer()` is imported, but its implementation is missing from the supplied files. These are legacy candidates to verify, not trusted production targets.
- The source includes token-like values and third-party integration credentials in client-visible code. Do not reproduce them in source control or this plan. Rotate genuine active credentials, inspect provider usage, and replace browser-side credentials with backend secrets.

### What is not available yet

The provided inputs do not include the original full frontend source, backend source, backend route registration, database schema/migrations, deployment definitions, staging access, or real provider contracts. Therefore, this document is a **plan based on source discovery and current reference research**, not a verified implementation audit.

### Working assumptions to validate in Phase 0

1. The working public brand is Jeto Vacations; confirm the legal/company name, logo, tone, and domain access.
2. First release is enquiry-first / sales-assisted. Direct payment, instant ticketing and live OTA inventory are deferred until the provider and operational requirements are known.
3. Primary audience includes Indian travellers searching domestic and international holiday packages; mobile traffic and WhatsApp/call conversion are important.
4. Initial CRM serves one company with teams/branches and role-based access. Keep a company/organization boundary in the data model if required, but do not build a multi-tenant SaaS control plane unless separate agencies/tenants are a real requirement.
5. Dates, costs and staffing are not yet committed. The roadmap uses relative phase estimates and should be re-estimated once repository, data and team capacity are reviewed.

---

## 3. Product vision and success measures

### Website vision

A visitor should be able to land on an inspiring destination or package page, understand who the holiday suits, see duration and indicative price, compare inclusions and exclusions, trust the agency, and ask for a quote in under two minutes on mobile.

### CRM vision

A salesperson should be able to identify the next best action immediately: new enquiries first, overdue follow-ups visible, customer and trip context in one place, quote versions traceable, hand-offs clear, and management reports based on defined metrics rather than duplicated route-specific calculations.

### Proposed launch KPIs (baseline first; targets are goals, not current performance)

| Area | Measure | Proposed initial acceptance/goal |
|---|---|---|
| Public website | Enquiry submission | Every valid submission creates exactly one CRM lead and returns a clear confirmation. |
| Public website | Mobile journey | Complete package discovery → enquiry using keyboard and touch at common phone widths. |
| Public website | Core Web Vitals | At the 75th percentile, target LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. See web.dev reference. |
| SEO | Indexability | Published destination/package pages have unique titles, descriptions, canonical URLs, sitemap entries and Open Graph metadata. |
| CRM | Lead response | Configurable SLA timer, visible overdue queue and audit of assignment/response events. Business chooses final SLA. |
| CRM | Data quality | Duplicate detection, validated fields, controlled statuses, owner/team and source on every lead. |
| CRM | Quote reliability | Quote versions are immutable snapshots; recalculation and currency/markup policies are tested. |
| Operations | Booking integrity | Retry/replay cannot create duplicate confirmed booking, payment or supplier instruction. |
| Security | Authorization | Automated positive and negative tests for every sensitive role/object/action before production. |
| Delivery | Release quality | CI tests, migration dry run, restore drill, staging sign-off, rollback steps and production monitoring. |

---

## 4. Product A — public holidays and travel website

### Positioning and visual direction

**Design goal:** an aspirational, travel-first website with the clarity of a holiday marketplace and the human service story of a specialist travel agency. Use competitive references for interaction patterns, not copied text, imagery or branding.

**Visual system proposal**

- **Mood:** cinematic, warm, welcoming, trustworthy, lightly premium—not corporate CRM and not a crowded discount portal.
- **Palette:** deep ocean/navy `#0B233F`, ocean teal `#078E9B`, warm sand `#F7F2E8`, coral accent `#F47C5C`, white `#FFFFFF`. Validate contrast and brand-owner preference before design freeze.
- **Type:** expressive editorial serif or humanist display face for hero/section headings; clean sans serif for controls, pricing, navigation and body copy.
- **Imagery:** licensed destination-first photography; people experiencing a place rather than only empty landmarks; consistent art direction; responsive crops; WebP/AVIF where supported; reserved dimensions to prevent layout shift. Do not use scraped competitor assets.
- **Layout:** generous white space, strong photography, simple sticky navigation, rounded but restrained package cards, obvious CTAs and a clear typographic hierarchy.
- **Motion:** subtle entrance/transitions only; respect reduced-motion preferences; do not make a heavy autoplay video the required first paint.

### Homepage composition

1. **Slim top bar:** phone/WhatsApp contact and service promise, without fake availability counters.
2. **Main navigation:** logo; Holidays; Destinations; Experiences; Honeymoon; Family; About; Contact; clear “Plan My Trip” CTA.
3. **Hero:** full-bleed destination image or a small controlled image rotation, overlay for contrast, headline such as “Your next great escape starts here”, short supporting line, and an integrated trip search/enquiry form.
4. **Search fields:** destination or “Help me choose”, departure city, travel month/date flexibility, travellers, holiday style and optional budget; submit to package search or custom enquiry.
5. **Popular destinations:** editorial cards for domestic and international destinations (initial launch content to be confirmed).
6. **Curated holiday packages:** price-from, nights/days, key highlights, inclusions, travel style, and “View trip”/“Request quote”.
7. **Browse by travel style:** honeymoon, family, friends, adventure, luxury, culture, weekend breaks and group departures as supported by actual inventory.
8. **Why travel with Jeto:** real service differentiators, transparent process, expert help and only substantiated trust claims.
9. **Recently featured / seasonal collection:** content controlled by CRM/admin, with expiry dates for offers.
10. **Real traveller stories/reviews:** only authentic and consented testimonials; no fabricated review totals or star ratings.
11. **Custom itinerary CTA:** step-based form for travellers who cannot find a package.
12. **Help/FAQ, newsletter (opt-in), contact and full footer:** policies, corporate details, social profiles and accessible support routes.

### Proposed public sitemap

| Route | Purpose | Main conversion/action |
|---|---|---|
| `/` | Homepage | Search or plan a trip |
| `/holidays` | Package discovery and filters | Open package / request quote |
| `/holidays/[slug]` | SEO landing/detail page for a package | Enquiry form with package pre-selected |
| `/destinations` | Destination directory | Explore destination |
| `/destinations/[slug]` | Destination landing page, guide, packages and FAQs | Browse packages / custom quote |
| `/themes/[slug]` | Honeymoon, family, adventure, luxury, etc. | Browse a curated collection |
| `/custom-holiday` | Guided trip brief | Create CRM lead with structured requirements |
| `/travel-guides/[slug]` | Search-led helpful travel content | Related package / enquiry |
| `/about` | Story, team/service proposition | Talk to an expert |
| `/reviews` | Verified testimonials/case stories | Enquiry |
| `/contact` | Contact options and office details | Call/WhatsApp/form |
| `/track-enquiry` | Optional later customer enquiry status | Verified identity only; not in first release unless needed |
| `/privacy`, `/terms`, `/cancellation-policy`, `/cookies` | Policy pages reviewed by business/legal | Consent and disclosure |

### Package listing requirements

- Filters: destination, region, travel style, nights/days, budget range, departure city, month/season, hotel tier, group/private, and “customisable” only where the data supports it.
- Sort: recommended, price low-to-high, duration, recently published.
- Cards: main image, package title, route/destinations, duration, “from ₹X per person” with price assumptions, inclusions icons, tags and enquiry CTA.
- Empty and error states must explain how to continue; filters should be shareable as safe URL query parameters.
- Price display must show “from” and relevant assumptions if dates, flights, room sharing, taxes or availability can change the final quote. Do not present stale supplier rates as guaranteed prices.

### Package detail page requirements

- Image gallery and destination overview.
- Who this trip suits / travel style.
- Duration, route, departure city, season notes and available customisation.
- Day-by-day itinerary with optional free time.
- Included / excluded items, accommodation tier, transport, meals, activities and visa/flight support where actually provided.
- Estimated price basis, what can change the price, cancellation terms and “last updated” on content/rate where relevant.
- FAQs, related packages, WhatsApp/call CTA, sticky mobile enquiry CTA.
- Structured data only where truthful and supported by the page; no invented ratings/reviews.

### Enquiry UX and integration contract

Website form fields: name, phone/email, destination or “not sure”, departure city, approximate dates/month, trip duration, adult/child traveller counts (with age where operationally required), budget range, travel style, notes, consent and hidden attribution metadata (UTM/source/referrer/landing slug, sanitized). Avoid collecting passport/document details at the public lead-capture stage.

Submit to a dedicated public endpoint such as `POST /api/v1/public/enquiries` with:

- server-side validation and normalized phone/email;
- rate limits, abuse detection, optional CAPTCHA/honeypot and request-size limits;
- explicit marketing consent separate from necessary enquiry processing;
- idempotency/dedupe key and duplicate detection;
- lead source=`website`, landing page, campaign and selected package references;
- a safe confirmation page and optional consented notification;
- no secrets or internal record IDs exposed unnecessarily.

If CRM/API is unavailable, queue or safely retry on the server, preserve the enquiry, log a correlation ID, and show a useful message. Avoid silently dropping an enquiry.

### Content operations

Use the CRM as the source of truth for package/destination commercial data: publish/unpublish state, slug, SEO title/description, hero image, package inclusions, itinerary, departure windows, price basis, terms, last-reviewed date and content owner. Public pages must query published/approved records only. A separate headless CMS may be added later if the marketing team needs richer editorial composition than CRM-managed records can support.

---

## 5. Product B — private CRM application

### Module catalogue and requirements

| Module | Core capabilities | Priority |
|---|---|---|
| Platform & security | Login/sessions, users, teams, roles/permissions, settings, audit history, notifications, imports, feature flags | P0 |
| Leads & enquiries | Omnichannel capture, duplicate check/merge, assignment rules, SLA timers, scoring, pipeline, follow-up tasks, lost reasons | P0 |
| Customer/traveller profiles | Contact details, traveller party, preferences, consent, past/future trips, activity timeline | P0 |
| Sales trip/deal pipeline | Requirements, destination/date/budget, owner/team, status history, forecast probability, postponements, cancellations, lead-to-trip conversion | P0 |
| Quotes & itineraries | Versioned quotes, day-wise itinerary, costing/markup/taxes/discount approvals, PDFs, quote delivery, acceptance and conversion | P0/P1 |
| Destinations & packages | Package content, SEO, images, inclusions, itinerary, price basis, publishing lifecycle, enquiry CTA settings | P0 for website integration |
| Hotels/tours/transfers | Search/catalogue, suppliers, destination/city tags, costs/rates, availability notes, quote associations | P1 |
| Bookings & travel operations | Flight/hotel/activity records, PNR/tickets, vouchers, confirmations, checklists, ops handover, departure calendar | P1 |
| Visa/documents | Per-traveller requirements, uploads, secure files, expiry reminders, extraction with review | P1 |
| Finance | Payments/allocations, receivable/payable, invoices/credit notes/refunds, commissions, FX snapshots, reconciliation, margin | P1/P2; validate accounting rules |
| Communications | Email/WhatsApp/call integrations, communication timeline, chat, templates, campaigns, opt-outs and webhook processing | P1 |
| Analytics | Lead funnel, conversion, SLA, source/campaign attribution, revenue, cancellations, gross margin, team/role dashboards | P1 |
| Workforce/admin | Tasks/projects/attendance/HR/assets, employee join/leave and operational permissions | P2; retain only workflows still used |
| AI/automation | Call summary/transcription, document extraction, quote/itinerary assistant, lead summaries, workflow rules and approval gates | P2 after core workflows stabilize |
| Provider integration admin | Secret references, connection health, job history, webhook deliveries, rate limits, retry and reconciliation tools | P1 |

P0/P1/P2 are proposed priority classifications, not commitments. Final scope depends on which legacy workflows are genuinely used and which external APIs are available.

### Primary CRM information architecture

- `/app` Overview: personal work queue, due follow-ups, recent activity, conversion snapshot, operational alerts.
- `/app/leads` List, filters, saved views, assignment, bulk actions, duplicate resolution.
- `/app/leads/[id]` Detail: source, contacts, activities, notes, call/email history, tasks, linked customer/trip, audit history.
- `/app/customers` List and `/app/customers/[id]` 360 profile.
- `/app/trips` Pipeline/list/board and `/app/trips/[id]` commercial, itinerary, suppliers, operations, finance and activity tabs.
- `/app/quotes` Drafts, approval queue, sent/accepted/expired; quote-version history.
- `/app/packages`, `/app/destinations`, `/app/inventory`, `/app/suppliers` Catalogue and publishing tools.
- `/app/bookings`, `/app/departures`, `/app/visa-documents`, `/app/operations` delivery workflows.
- `/app/finance` Reconciliation, payments, refunds, invoice/credit-note records and approval queues.
- `/app/inbox`, `/app/campaigns`, `/app/tasks`, `/app/reports`, `/app/team`, `/app/settings`, `/app/audit-log`, `/app/integrations`.

### Core workflows/state machines

**Lead:** `new → assigned → contacted → qualified → requirements_captured → quote_in_progress → quote_sent → negotiation → won/converted` or `lost / unresponsive / duplicate`. Transitions require timestamps/actor, optional reason and a next action. SLA pauses/escalation rules must be configurable.

**Trip/booking:** model as a related but separate workflow so commercial status is not overloaded with operational status. Suggested trip lifecycle: `draft → requirements_confirmed → proposal_ready → awaiting_confirmation → confirmed → pre_travel → in_travel → completed`, with explicit `postponed`, `cancelled` and `refund_pending/refunded` branches where relevant. Provider ticket/booking statuses remain separately modeled.

**Quote:** `draft → review_required → approved → sent → viewed (if tracked) → accepted/rejected/expired/superseded`. Each sent version is immutable; changing pricing produces a new version. Quote acceptance should not by itself claim a supplier booking is confirmed.

**Payment:** record amount, currency, date, source/reference, status, allocations, refunds and reconciliation; use immutable transactions/ledger-like events for adjustments, not edits that erase history.

### CRM design requirements

- Responsive but desktop-optimized workspace with persistent primary navigation and contextual detail tabs.
- Dense data tables with saved filters, server-side pagination/sort, column selection, bulk actions with confirmation and keyboard support.
- Activity timeline shared by lead/customer/trip while preserving record-level permissions.
- Every page has skeleton/loading, empty, error, permission-denied and retry states.
- Clear form validation and server error messages; never rely solely on browser validation.
- UI role visibility is a convenience only. The API must enforce all permissions and row ownership/branch/team access.

---

## 6. Shared architecture and technical design

### Proposed deployment boundaries

```text
Public visitors
    │
    ▼
apps/website (Next.js, public, SEO-first) ────┐
                                              │ published packages + enquiry API
Staff ──► apps/crm (Next.js, private UI) ─────┤
                                              ▼
                                      services/api (FastAPI)
                                              │
                     ┌────────────────────────┼──────────────────────┐
                     ▼                        ▼                      ▼
                PostgreSQL                 Redis/queue        private S3/R2 storage
                     │                        │                      │
                     └────────────────────────┼──────────────────────┘
                                              ▼
                                      services/worker
                         (email, webhook, AI, PDFs, reports, sync)
                                              │
                                              ▼
          provider adapters (travel inventory, telephony, WhatsApp, email, FX, payments)
```

### Suggested repository layout

```text
jeto-platform/
  apps/
    website/                 # public holiday website
    crm/                     # internal CRM application
  packages/
    ui/                      # accessible shared design primitives, not shared page chrome
    api-client/              # generated TypeScript client from OpenAPI
    config/                  # eslint, typescript, tokens, formatting
  services/
    api/                     # FastAPI modular monolith
      app/core/              # config, auth, errors, observability
      app/modules/           # leads, customers, trips, quotes, inventory, finance...
      app/integrations/      # providers and webhook handlers
      app/db/                # SQLAlchemy models, repositories, migrations
    worker/                  # durable asynchronous job workers
  infra/                     # container, deployment, monitoring, backup definitions
  docs/                      # ADRs, API contract, data dictionary, runbooks
  tests/                     # contract, integration, e2e and security tests
```

### Recommended stack

- **Public site and CRM UI:** Next.js App Router, React, TypeScript, design tokens, accessible primitives, a form library with schema validation, TanStack Query where client-cache behavior is useful, generated typed API client. Prefer Server Components/static or revalidated content for public SEO pages; use Client Components only for interactivity.
- **Backend:** FastAPI, Pydantic schemas, SQLAlchemy 2.x, Alembic migrations, explicit domain/service/repository separation, OpenAPI as the source for typed clients and contract tests.
- **Database:** PostgreSQL as the transactional source of truth. Redis for cache, rate limits and queue coordination—not the only store for a business transaction.
- **Worker:** a durable queue system selected based on hosting/runtime support; idempotent jobs with retries, backoff, dead-letter/failed-job UI and a reconciliation path.
- **Files:** S3-compatible private object storage (legacy Cloudflare R2/S3 references must be verified) with short-lived signed URLs, file type/size limits, malware scanning where feasible, metadata in PostgreSQL and retention policy.
- **Observability:** structured JSON logs with correlation IDs, traces/metrics, uptime/readiness checks, error reporting and provider/queue dashboards. Avoid putting secrets or unnecessary PII in logs.
- **Testing/quality:** pytest, API contract tests, Playwright E2E, component tests, type checking, linting, migration tests, security regression suite and dependency scanning.
- **Deployment:** separate staging and production environments, managed PostgreSQL with backups, preview builds, CI/CD, environment-scoped secrets, infrastructure config in source control and a documented rollback.

### Why not microservices initially?

The current requirements cross many domains, and the actual backend/data boundaries have not been inspected. A modular monolith keeps transactions and change velocity manageable while enforcing strong domain boundaries. Extract a service later only when a measured scaling, reliability, ownership or deployment problem warrants it.

---

## 7. Canonical data model (initial design hypothesis)

### Identity and access

`Organization` (if needed) → `Branch/Team`, `User`, `Role`, `Permission`, `RolePermission`, `UserTeamMembership`, `Session`, `AuditEvent`.

### Customer acquisition and sales

`Lead`, `LeadSource`, `LeadAssignment`, `LeadStatusHistory`, `LeadDuplicateMatch`, `Customer`, `ContactMethod`, `Traveller`, `Activity`, `Task`, `Campaign`, `ConsentRecord`, `Trip`, `TripTraveller`, `TripStageHistory`, `Quote`, `QuoteVersion`, `QuoteLineItem`, `ItineraryDay`, `QuoteApproval`, `TripNote`.

### Catalogue and fulfilment

`Destination`, `Package`, `PackageVersion` or publish snapshot, `PackageDestination`, `PackageDeparture`, `Hotel`, `RoomCategory`, `TourActivity`, `Transfer`, `Supplier`, `SupplierContract`, `SupplierRate`, `AvailabilitySnapshot`, `Booking`, `BookingItem`, `SupplierConfirmation`, `Ticket/PNR`, `Voucher`, `DepartureChecklist`, `VisaCase`, `TravellerDocument`.

### Finance and integrations

`Payment`, `PaymentAllocation`, `Refund`, `Invoice`, `CreditNote`, `SupplierBill`, `SupplierPayment`, `CommissionRule`, `CommissionEntry`, `FXRateSnapshot`, `ProviderAccountRef` (secret stored separately), `WebhookEvent`, `IntegrationJob`, `BackgroundJob`, `CommunicationThread`, `Message`, `CallRecord`, `CallInsight`, `FileAsset`, `PublishedPage`, `AuditEvent`.

### Data model rules

- Use UUIDs or stable opaque IDs; public slugs are not primary keys.
- Use foreign keys, unique constraints, database transactions and indexes based on measured queries.
- Store money as decimal/minor-unit-safe values with explicit currency; snapshot quote FX/rates/fees so old proposals do not silently change when rates update.
- Use UTC instants in storage and explicit business time zones for schedules/reports.
- Separate current status from status history/events, and preserve actor/time/reason for consequential transitions.
- Model privacy/consent, retention, deletion/anonymization and document access explicitly.
- Do not use loosely typed JSON blobs as a substitute for core relational entities. Use JSONB only for provider payload archives or flexible metadata with versioning.
- Use soft deletion only where business/audit needs justify it; define retention and restore behavior.
- Confirm exact fields and cardinalities after viewing the actual legacy schema and representative anonymized records.

---

## 8. API contract and integration standards

### API conventions

- Version new contracts under `/api/v1/` (or a documented equivalent) with consistent plural resources and standard verbs.
- Use `GET` for safe reads, `POST` to create/execute commands, `PATCH` for partial updates, and `DELETE` for deletion; do not encode mutations in `GET` routes.
- Use Pydantic input/output schemas; whitelist writable fields to prevent mass assignment; never return fields just because they exist on the ORM model.
- Standardize pagination (`cursor` or `limit/offset` chosen and documented), sorting, filters, validation errors and an error envelope with a correlation ID.
- Document all public, staff, admin and webhook endpoints in OpenAPI. Generate frontend types; add contract tests.
- Require `Idempotency-Key` for public enquiry, booking/confirmation, payment/refund commands and retryable webhooks as appropriate.
- Make webhooks signature-verified, replay-safe, observable and redrivable.

### Key endpoint families (examples, not final API spec)

- Public catalogue: `GET /api/v1/public/destinations`, `GET /api/v1/public/packages`, `GET /api/v1/public/packages/{slug}`
- Public enquiry: `POST /api/v1/public/enquiries`
- Leads: `GET/POST /api/v1/leads`, `GET/PATCH /api/v1/leads/{id}`, `POST /api/v1/leads/{id}/activities`, `POST /api/v1/leads/{id}/convert`
- Customers: `GET/POST /api/v1/customers`, `GET/PATCH /api/v1/customers/{id}`
- Trips: `GET/POST /api/v1/trips`, `GET/PATCH /api/v1/trips/{id}`, `POST /api/v1/trips/{id}/transitions`
- Quotes: `POST /api/v1/trips/{id}/quotes`, `POST /api/v1/quotes/{id}/versions`, `POST /api/v1/quotes/{id}/approve`, `POST /api/v1/quotes/{id}/send`
- Packages/content: `GET/POST /api/v1/packages`, `PATCH /api/v1/packages/{id}`, `POST /api/v1/packages/{id}/publish`
- Bookings/finance: `POST /api/v1/trips/{id}/bookings`, `POST /api/v1/payments`, `POST /api/v1/refunds/{id}/approve` (requires correct role and business rules)
- Integrations: `POST /api/v1/webhooks/{provider}`, `GET /api/v1/admin/integrations`, `GET /api/v1/admin/jobs/{id}`

Legacy endpoint migration must map each source call to a target contract and test whether to preserve, merge, replace or retire it. Do not blindly make all 436 path/method pairs permanent in the new design.

---

## 9. Legacy backend and data migration

### Server URL policy

Legacy candidates found in the source:

- `https://jeto-crm-server.onrender.com`
- `https://web-production-6467.up.railway.app`
- comments also reference `jetovacations.in`, an Azure host, a Heroku host and older AWS Elastic Beanstalk endpoints.

A backend adapter should use an environment variable such as `LEGACY_API_BASE_URL`. First verify domain ownership, HTTPS, `/healthcheck` or an agreed read-only health endpoint, build/version identity, database identity, authentication behavior and read-only API contract. A responding health endpoint alone does not prove that it contains authoritative production data.

Never implement silent write failover across two old backends unless there is a tested consistency/replication strategy. During the migration, read-only access and a rehearsed export is safer than routing user writes between potentially divergent databases.

### Migration steps

1. Acquire backend repository and database schema/migrations; inventory all tables and route handlers.
2. Take encrypted backup and test restore to an isolated environment; capture counts and key financial/customer totals.
3. Build a data dictionary, map old status values/owners/IDs/attachments to canonical entities.
4. Create a versioned, repeatable ETL/import job; never rely on manual copy-paste for production migration.
5. Run dry-run import in staging, review rejects, duplicate candidates, missing foreign keys and orphan attachments.
6. Reconcile customer/lead/trip counts, quote snapshots, payments/refunds, supplier balances, and document mappings.
7. Run representative user journeys against imported data and compare reports to trusted legacy reports.
8. Establish freeze/cutover window, final delta sync or write freeze, sign-off, redirect and rollback plan.
9. Keep old system read-only for a defined, approved retention period; archive access logs and document decommission criteria.

---

## 10. Security, privacy, and reliability gates

### Must be resolved before production

- Rotate genuine secrets exposed in the supplied frontend/API files; search repository history and deployment variables too. Do not assume deleting a literal from the next build invalidates it.
- Remove any hardcoded provider bearer token, telephony credential, travel supplier password or FX key from browser bundles; keep provider credentials in server-side secret storage and rotate/restrict them.
- Never put access tokens or customer PII in query strings; redact analytics URLs and logs.
- Use secure sessions (prefer `HttpOnly`, `Secure`, appropriate `SameSite` cookies or a reviewed OIDC flow), CSRF protection where applicable, short-lived access tokens, refresh/session rotation, logout invalidation, MFA for privileged roles and safe recovery flow.
- Authorization checks on every object and field: one staff member must not access another team's records unless permissions allow it; client-side hidden menus are not security controls.
- Protect public enquiry, login, search, export, booking and AI endpoints with rate limits, input bounds, abuse controls and cost budgets.
- Protect against OWASP API risks including broken object/function-level authorization, property-level exposure/mass assignment, resource exhaustion, SSRF and unsafe third-party API consumption.
- Private file storage, short-lived access, upload allowlist, size cap, malware scanning where feasible, no public passport links and access audits.
- Secret redaction, encryption in transit/at rest, dependency scanning, least-privilege database accounts, environment separation, backup encryption and restore drills.
- Consent and contact preferences; verified marketing opt-ins, suppression lists and opt-out propagation to messaging providers. Have qualified counsel validate current Indian privacy/consumer/travel/finance obligations and policy wording.

### Security test scenarios

- User changes a lead/customer/trip ID in the URL or request body and attempts cross-team access → denied and audited.
- Non-finance user tries to read supplier cost, payment or margin fields → hidden by API output schema/permissions.
- Website user submits malformed, oversized, repeated or scripted enquiries → rate-limited/validated with no duplicate leads.
- An old webhook is replayed, sent with an invalid signature or delivered twice → rejected or handled idempotently.
- An untrusted URL is submitted to document/AI extraction → backend prevents SSRF/private-network access.
- A provider times out after the operation succeeds remotely → retry does not duplicate ticket, booking, payment or campaign send without controlled idempotency.

---

## 11. Proposed execution phases and rough effort

**Planning estimate only:** around **22–30 calendar weeks** for a cross-functional team of roughly 4–6 people, assuming backend/frontend/QA/product-design/DevOps capacity and no prolonged provider contracting delays. Workstreams can overlap. With one developer, missing repositories, slow legacy exports or nonstandard travel-provider approval, the schedule will be substantially longer. Re-estimate after Phase 0.

| Phase | Indicative duration | Deliverable / exit gate |
|---|---:|---|
| 0. Discovery, access and security | 1–2 weeks | Full source/schema, provider list, secrets rotated, backup restore proven, legacy data source identified. |
| 1. Product/domain/UX blueprint | 2 weeks | Approved sitemap, CRM flows, canonical data model, design tokens, source-to-target route map, API contract draft. |
| 2. Platform foundation | 3–4 weeks | CI/CD, environments, auth/RBAC, migrations, audit/logging, files, job queue, test harness. |
| 3. Website and enquiry-led sales MVP (parallel streams) | 4–6 weeks | Responsive SEO website, published package catalogue, enquiry flow → CRM lead; CRM leads/customers/activities/trip pipeline/follow-ups. |
| 4. Quotations, packages and inventory | 4–5 weeks | Package management, quote versions, itinerary, costing/approval, suppliers/hotel/tours, customer-ready proposal. |
| 5. Bookings and travel operations | 4–6 weeks | Operations checklists, departure calendar, booking records, vouchers, ticket/PNR states, visa/documents. Provider integrations only where validated. |
| 6. Finance, communication and reporting | 4–6 weeks | Payments/reconciliation/refund approval, communications/campaigns/call log, business-defined reports and exports. |
| 7. AI/automation and admin polish | 2–4 weeks | Approved AI assistance, usage controls, job dashboard, rule automation, removed/deferred legacy functions documented. |
| 8. Migration, UAT and cutover | 2–3 weeks | Reconciled import, regression/E2E/security/performance evidence, restore and rollback drill, sign-off and launch. |

This is a sequence of work, not a promise that every legacy feature fits within the estimate. High-risk provider integrations, historical financial reconciliation and unresolved data contracts are schedule drivers.

---

## 12. Detailed work breakdown and acceptance gates

### Workstream A — Product/design

- [ ] Interview sales, operations, finance, marketing, support and management; confirm the workflows actually used.
- [ ] Confirm direct booking vs enquiry-first; destination/package strategy; launch geography; supported currencies; content editor ownership; roles and branch structure.
- [ ] Create information architecture for website and CRM separately.
- [ ] Create desktop/mobile wireframes for homepage, package listing/detail, custom-enquiry form, CRM lead list/detail, trip detail, quote editor and booking checklist.
- [ ] Create travel-brand design system (tokens, typography, photo treatments, cards, forms, validation, alerts and accessible states).
- [ ] Conduct usability test of key journeys before implementation freeze.

**Acceptance:** design review covers mobile, tablet and desktop; key journeys are tested with representatives of at least sales, operations and marketing; all claims/trust badges and published price semantics are approved by the business.

### Workstream B — platform/security

- [ ] Establish monorepo/repository policy, code ownership, formatting/lint/type checking and PR checks.
- [ ] Create dev/staging/prod configuration with secret management and separate databases/storage.
- [ ] Implement session/authentication, authorization policy layer, roles/teams and privileged MFA support.
- [ ] Add PostgreSQL migrations, fixture factory, transactional service boundaries and audit events.
- [ ] Establish structured logging, correlation IDs, metrics/traces, health/readiness, error monitoring and alert ownership.
- [ ] Create job queue conventions, retry/backoff, idempotency, dead-letter queue and admin redrive.
- [ ] Configure private file storage, signed download flow, access checks, retention and upload restrictions.

**Acceptance:** environment deploys from CI; migration and rollback tested; staff cannot access protected records via direct API without permission; secrets are absent from frontend bundles and logs.

### Workstream C — CRM sales MVP

- [ ] Leads list with server filters, sorting, pagination, saved views and assignment.
- [ ] Lead detail with activity timeline, notes, call/email records, tasks, duplicate warnings and next action.
- [ ] Lead deduplication/merge with explainable matching and reversible audit history.
- [ ] Customer/traveller profiles and customer 360 activity/trip linkage.
- [ ] Trip pipeline with allowed transitions, owner/team, destination, expected travel dates, budget and status history.
- [ ] Follow-up task generation, SLA timer, reminders and escalations.
- [ ] Public enquiry adapter writes a lead with attribution and idempotency.

**Acceptance:** enquiry can be captured from a package page, assigned, contacted, qualified, converted into a trip and displayed on a role-appropriate dashboard; all major changes are audited.

### Workstream D — holidays website

- [ ] Build reusable page shells and responsive navigation.
- [ ] Implement homepage hero/search, destination cards, travel theme collections, package cards, trust/story sections and footer.
- [ ] Build package/destination detail pages with day-by-day itinerary, inclusions/exclusions, price explanation and enquiry CTA.
- [ ] Build browse/search/filter/sort pages powered by published catalogue data.
- [ ] Build custom-holiday guided brief and form error/success/retry states.
- [ ] Add SEO metadata, canonical URLs, sitemap, robots, Open Graph images, internal linking and structured data where accurate.
- [ ] Add analytics events for page views, searches, package clicks, form starts/completions and CTA clicks; strip PII from URLs and event payloads.
- [ ] Verify image license/source, alt text, responsive sizes, modern formats and fixed dimensions.

**Acceptance:** all navigation and calls-to-action work; published pages have unique SEO metadata; no unpublished/private fields reach the browser; key pages pass accessibility, mobile and performance checks.

### Workstream E — quotations and catalogue

- [ ] Model destinations/packages, itinerary days, hotel/tour/transfer line items and suppliers.
- [ ] Implement quote version snapshots, pricing breakdown, costs vs sell price, markup/discount/tax rules, approvals and expiry.
- [ ] Generate branded PDF proposals and send via approved channels.
- [ ] Publish/unpublish package process with preview, SEO fields and content review date.
- [ ] Track source costs and customer sell prices separately with field-level permissions.

**Acceptance:** a staff member creates/revises/approves/sends a quote, an accepted quote can generate booking tasks without losing prior versions, and website pages update only after a publish action.

### Workstream F — operations, booking, finance and communications

- [ ] Trip checklist and handoff from sales to operations.
- [ ] Booking item models and distinct supplier/air/hotel statuses; provider adapters behind interfaces.
- [ ] Voucher/ticket/document generation and secure delivery.
- [ ] Payment collection record, allocation, refund request/approval and reconciliation workflow.
- [ ] Invoice, credit note, commission and margin calculation after finance/accounting rules are signed off.
- [ ] Messaging provider adapters, signed inbound webhooks, conversation history, consent checks and suppression handling.
- [ ] Failed job and provider reconciliation dashboard.

**Acceptance:** failed/replayed jobs do not duplicate financial or booking events; provider status differences are visible to operations; finance totals reconcile to agreed test fixtures.

### Workstream G — data migration and release

- [ ] Complete old route/API → new contract mapping; classify keep/merge/replace/retire/unknown.
- [ ] Import master data first, then leads/customers/trips/quotes, then financial records and files in dependency order.
- [ ] Reconcile counts/totals/orphans and sample critical records with business owners.
- [ ] Execute user-acceptance scenarios across roles and full enquiry-to-completion paths.
- [ ] Run security, accessibility, backup-restore, load and provider-failure tests.
- [ ] Rehearse cutover/rollback, freeze rules, support roster and communication plan.

**Acceptance:** each in-scope legacy workflow is either implemented and tested, formally retired with approval, or explicitly blocked with a named follow-up; data owners sign off reconciliation; rollback is demonstrated, not just documented.

---

## 13. Definition of done

A module is not done merely because a page exists. It is done when:

- business owner approves the workflow and state transitions;
- user interface has loading, empty, error, validation, permission and responsive states;
- API has schema validation, explicit permissions, transaction boundaries and auditable side effects;
- database migration and constraints exist;
- unit/integration/contract/E2E tests cover critical paths and failure modes;
- logs and operational monitoring are present without leaking secrets/PII;
- user guide/support notes exist where a workflow changes;
- accessibility and performance checks pass at defined thresholds;
- staging acceptance is recorded; and
- rollback/data-recovery procedure is understood by the team.

Suggested test coverage is to prioritize coverage of business-critical rules and branches; a raw percentage is not enough. A useful starting target is >80% statement/branch coverage for core domain services plus mandatory E2E flows, then adjust based on risk and testing reality.

---

## 14. High-priority risks and mitigations

| Risk | Impact | Mitigation / decision |
|---|---|---|
| Backend and database source missing | Cannot verify route behavior or data semantics | Make repository/schema/data export a Phase 0 gate. Do not invent behavior from frontend names. |
| Exposed third-party credentials | Provider account misuse, data or money risk | Rotate/revoke, review logs, remove from bundle/history, store server-side only. |
| Legacy environments may contain divergent data | Wrong records, duplicate writes, irreconcilable history | Identify authoritative DB; read-only verification; no silent write failover; use a repeatable migration and reconciliation. |
| Hundreds of legacy endpoints with overlap/duplicates | Scope and maintenance blow-up | Map each to workflow; consolidate to resource/action APIs; keep compatibility adapters only where needed. |
| Direct booking scope is unclear | Provider/payment complexity can dominate launch | Launch enquiry-first unless confirmed otherwise; isolate providers and defer instant booking until credentials/contracts exist. |
| Quotes/prices are time-sensitive | Customer disputes and margin leakage | Versioned quote snapshots, currency snapshots, timestamps and explicit terms; keep supplier and sell prices permission-separated. |
| Retry duplicates booking/payment/marketing actions | Financial or operational incident | Idempotency keys, outbox/inbox records, unique constraints, provider reconciliation and failure dashboard. |
| Website looks beautiful but does not convert | Wasted acquisition traffic | Track funnels, test mobile forms, use clear CTA and real trust proof, iterate with real enquiries. |
| Imagery/claims/content rights | Legal/reputation problem | Licensed assets, real reviews, approved policies/pricing language and content-owner checklist. |
| AI output is wrong or oversteps | Incorrect customer/travel/financial advice | Suggestive workflows with source context, human approval, output validation and audit logs; no unattended financial/provider actions at launch. |

---

## 15. External benchmark and implementation references

### Travel website patterns reviewed

- **MakeMyTrip holiday pages:** destination- and theme-led package discovery, departure-city context, itinerary duration, inclusions and price-from details. Use these patterns to make package comparison scannable; do not copy their brand or text. https://www.makemytrip.com/holidays-india/india-travel-packages.html
- **Expedia vacation packages:** explicit destination/date/traveller search and bundle concepts. Useful if a future direct booking product supports combined flight + stay inventory; do not expose bundle claims unless integrations support them. https://www.expedia.com/Vacation-Packages
- **Thrillophilia package pages:** curated domestic/international package categories, clear durations and itineraries, themes and customization options. Useful for the tour-operator/editorial model. https://www.thrillophilia.com/packages/from-delhi
- **Trivzza (current design benchmark):** premium bespoke travel positioning, search inputs for destination, departure city, month and travellers, clear trip-type shortcuts. Useful as a visual/conversion reference, not a factual source for Jeto claims. https://trivzza.com/
- **HiDa Holidays:** curated destination cards with duration, starting prices and plain-language inclusions; useful for a smaller agency's focused catalogue. https://hidaholidays.com/
- **Mark Your Trip:** trip-style categories and guided custom planning. Useful to help visitors who are not sure of a destination. https://www.markyourtrip.store/

### CRM/domain completeness references

- Salesforce Sales Cloud — lead/contact/opportunity and forecasting patterns: https://www.salesforce.com/in/sales/cloud/guide/
- HubSpot CRM object association model: https://knowledge.hubspot.com/records/understand-objects
- Zoho CRM module reference: https://www.zoho.com/crm/developer/docs/api/v8/modules-api.html
- Odoo CRM workflows: https://www.odoo.com/documentation/16.0/applications/sales/crm.html
- Travel-specific feature checklist (supplier/itinerary/booking/voucher/visa/finance concepts): https://www.travkonnect.com/in/features/ and https://www.createmycrm.com/crm/travel

### Technical/security references

- Next.js production checklist (accessibility, image optimization, metadata/SEO, security and Core Web Vitals): https://nextjs.org/docs/app/guides/production-checklist
- Next.js metadata and Open Graph: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- OWASP API Security Top 10 (2023): https://api-security.owasp.org/editions/2023/en/0x11-t10/
- FastAPI OAuth2/JWT and password-hashing guidance: https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
- PostgreSQL row security policies: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- OpenTelemetry signals: https://opentelemetry.io/docs/concepts/signals/
- Core Web Vitals thresholds: https://web.dev/articles/vitals

---

## 16. Decisions required before build kickoff

1. **Website conversion model:** enquiry-first (recommended) or live availability + checkout/payment from launch?
2. **Brand/domain:** exact public name, owned domain, logo, brand colors, imagery rights, office/contact details and policies.
3. **Operating model:** one company with branches/teams or multi-company/agency tenancy?
4. **Integrations:** which flight/hotel providers are contracted, whose account owns each credential, and which APIs support read/search/booking/cancel/refund/webhooks?
5. **Finance rules:** currency, FX snapshot policy, tax/invoice requirements, payment gateway and refund/commission policy—validated by finance/accounting owner.
6. **Legacy source/data:** repository access, DB engine/schema/migrations, authoritative legacy backend, attachments/recordings storage and allowed retention.
7. **Scope and capacity:** team size, budget band, launch window, required roles, and which legacy modules are actively used versus abandoned.
8. **Customer portal:** needed for the first release or deferred until public enquiries and CRM booking flow are stable?
9. **AI policy:** which tasks AI may suggest, which require approval, model/provider budget, and whether call recordings/transcripts are permitted to be processed.

### Recommended default decisions if the team wants to begin without delay

- Enquiry-first website with no unverified direct-booking promises.
- Separate public website and private CRM apps sharing one versioned API.
- FastAPI modular monolith + PostgreSQL + background workers + private object storage.
- Next.js App Router for both frontends, with different route layouts/security boundaries.
- CRM-managed destination/package publishing initially; evaluate a dedicated CMS only after content workflow needs are known.
- Rotate credentials and verify authoritative legacy data before migration.
- Migrate by modules and verified journeys, not by copying every old endpoint literally.

---

## 17. First 10 working days — kickoff checklist

### Days 1–2: access and source
- [ ] Obtain frontend repository, backend repository, DB schema/migrations, deployment manifests, redacted `.env.example`, provider integration list and safe test accounts.
- [ ] Confirm domain/DNS ownership, analytics properties, cloud projects and all environments.
- [ ] Rotate exposed keys/tokens; verify provider logs and limit credentials to required scope.

### Days 3–4: workflow discovery
- [ ] Interview one user from each active team.
- [ ] Identify top 10 daily CRM journeys and top 5 failure-prone operations.
- [ ] Classify the legacy page/API inventory as keep / merge / replace / retire / unclear.
- [ ] Validate the authoritative database and test encrypted backup/restore.

### Days 5–6: data/API/design
- [ ] Map lead/customer/trip/quote/booking/payment entities and critical transitions.
- [ ] Agree public enquiry payload, dedupe rule, source attribution and SLA.
- [ ] Approve website sitemap, home page sections, visual direction and initial destination/package content schema.
- [ ] Draft OpenAPI and error conventions; define authorization test matrix.

### Days 7–8: architecture scaffold
- [ ] Create repository/workspace structure, CI checks, staging deployment and environment secret setup.
- [ ] Set up migration tooling, auth skeleton, structured logs, audit events and basic health checks.
- [ ] Create design tokens and initial page shells for website and CRM.

### Days 9–10: first vertical slice
- [ ] Implement a publishable package record in CRM/admin.
- [ ] Render it on a public package detail page.
- [ ] Submit an enquiry from that page and create a deduplicated lead with attribution in the CRM.
- [ ] Add Playwright test for the flow and an authorization/security regression test.
- [ ] Demo to business stakeholders; record decisions before expanding scope.

**Best first milestone:** a real end-to-end vertical slice—publish package → visitor discovers it → visitor submits enquiry → CRM lead appears with source and package → sales owner follows up. This proves the shared architecture before adding the rest of the modules.
