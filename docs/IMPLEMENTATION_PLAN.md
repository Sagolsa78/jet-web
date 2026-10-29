# Implementation Plan — Jeto Vacations Website

## Goal
Build a professional, cinema-led, enquiry-first public travel website that connects to the Jeto CRM via a typed adapter boundary.

## Phased Roadmap

### Phase 0: Discovery & Planning (Current)
- **Objective:** Establish repository baseline and safe implementation path.
- **Deliverables:** Repository Audit, Implementation Plan, Open Decisions log.
- **Acceptance:** Baseline confirmed; roadmap agreed.

### Phase 1: Foundation & Design System
- **Objective:** Initialize project and establish "Never Generic" visual identity.
- **Tasks:**
    - Initialize Next.js App Router + TS + Tailwind project.
    - Configure design tokens: Navy (`#0B233F`), Teal (`#078E9B`), Sand (`#F7F2E8`), Coral (`#F47C5C`).
    - Implement base typography (Expressive Serif + Clean Sans).
    - Build accessible UI primitives (buttons, inputs, cards) using shadcn/ui.
- **Acceptance:** Design system verified via a style guide page; project builds without errors.

### Phase 2: Homepage & Global Shell
- **Objective:** Create the first impression and core navigation.
- **Tasks:**
    - Implement global `Layout` (Header, Footer, Mobile Nav).
    - Build cinematic Hero section with search overlay.
    - Implement "Popular Destinations" and "Curated Packages" sections.
    - Build "Why Jeto" and Trust sections.
- **Acceptance:** Responsive layout across mobile/desktop; all links lead to intentional routes.

### Phase 3: Holiday & Destination Catalogue
- **Objective:** Enable discovery of travel packages and destinations.
- **Tasks:**
    - Implement `/holidays` listing with working server-side filters/sort/search.
    - Build `/holidays/[slug]` detail page (Itinerary, Inclusions, Price basis).
    - Build `/destinations` and `/destinations/[slug]` pages.
    - Populate these pages from typed content (initial JSON data).
- **Acceptance:** Users can filter packages and navigate to a matching detail page.

### Phase 4: Custom Trip Enquiry
- **Objective:** Capture high-intent leads via a guided wizard.
- **Tasks:**
    - Build `/custom-holiday` multi-step form.
    - Implement state preservation (prevents data loss on 'Back').
    - Add Zod-based validation for all fields.
    - Implement explicit success/error/retry UI states.
- **Acceptance:** Valid enquiry submission is captured; duplicate submissions prevented.

### Phase 5: CRM Adapter & Integration
- **Objective:** Connect the frontend to the real (or verified) CRM API.
- **Tasks:**
    - Create a typed API adapter boundary.
    - Implement `GET` for published packages/destinations.
    - Implement `POST` for public enquiries.
    - Configure environment-based API URLs.
- **Acceptance:** Data flows from CRM to site; enquiries flow from site to CRM.

### Phase 6: SEO, Accessibility & Performance
- **Objective:** Ensure the site is discoverable and usable by all.
- **Tasks:**
    - Implement dynamic metadata, canonicals, and Open Graph images.
    - Generate `sitemap.xml` and `robots.txt`.
    - Conduct a11y audit (WCAG 2.2) and fix barriers.
    - Optimize images (WebP/AVIF) and LCP/INP/CLS.
- **Acceptance:** Core Web Vitals targets met; a11y audit passed.

### Phase 7: Final Production Audit
- **Objective:** Verify the "working product" before launch.
- **Tasks:**
    - Full end-to-end regression test of the enquiry journey.
    - Security audit (input sanitization, secret leakage).
    - Mobile viewport verification.
- **Acceptance:** All "Implemented and Verified" labels achieved for core features.

## Vertical Slice Definition
The "First Win" will be:
`CRM (Mock/Real) → Published Package → Website Listing → Package Detail → Valid Enquiry → CRM Lead`.
