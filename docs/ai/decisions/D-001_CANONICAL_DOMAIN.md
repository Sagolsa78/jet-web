# ADR D-001: Standardization on Single Canonical Domain

## Status
Accepted

## Context
During initial development, multiple domains and origins were referenced across the codebase (`jetovacations.in`, `jet-web.vercel.app`, `localhost:3000`, `www.jetovacations.com`). Inconsistent hostnames damage search engine indexing, cause OpenGraph image loading failures, and create confusion in customer trust and branding.

## Decision
All absolute URLs, metadata base definitions, dynamic sitemaps (`sitemap.xml`), robots directives (`robots.txt`), OpenGraph meta tags, and structured data schemas are centralized to:
```typescript
export const SITE_ORIGIN = 'https://www.jetovacations.com';
```
defined in `src/data/site-content.ts`.

## Consequences
- Single source of truth for SEO and canonical resolution.
- Dynamic routes in `src/app/sitemap.ts` reference `SITE_ORIGIN` rather than request headers.
- Zero risk of staging or Vercel preview URLs accidentally leaking into production search index.
