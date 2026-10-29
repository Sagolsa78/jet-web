# Open Decisions — Jeto Vacations Website

This document tracks pending technical and product decisions required to move from planning to implementation.

## Technical Decisions

| Decision | Options | Status | Recommendation / Current Path |
|---|---|---|---|
| **Backend Strategy** | 1. Mock Adapter $\rightarrow$ Verified API <br> 2. Direct attempt to verify legacy APIs | Pending | **Option 1**: Start with a typed mock adapter to unblock UI development, then swap for real API once contract is verified. |
| **Content Storage** | 1. Local JSON/Markdown <br> 2. Headless CMS <br> 3. CRM-managed | Pending | **Option 1 $\rightarrow$ 3**: Start with local JSON for speed, then migrate to CRM-managed records for production. |
| **Image Hosting** | 1. `/public` folder $\rightarrow$ 2. S3/R2 $\rightarrow$ 3. CDN | Pending | **Option 1 $\rightarrow$ 2**: Start with local assets, migrate to S3/R2 for production performance. |
| **Deployment Target** | 1. Vercel <br> 2. Railway <br> 3. Custom VPS | Pending | **Option 1**: Vercel for optimal Next.js performance and preview deployments. |

## Product Decisions

| Decision | Options | Status | Recommendation / Current Path |
|---|---|---|---|
| **Conversion Model** | 1. Enquiry-first (Sales assisted) <br> 2. Live booking + Checkout | Pending | **Option 1**: Enquiry-first to ensure quality and high-touch service. |
| **Brand Assets** | 1. Provided Logo/Styleguide $\rightarrow$ 2. Agent-proposed $\rightarrow$ 3. Business-approved | Pending | Need confirmation of official logo and brand colors from business owner. |
| **Content Ownership** | 1. Agent-generated $\rightarrow$ 2. Business-provided $\rightarrow$ 3. Hybrid | Pending | **Option 3**: Agent creates templates; business provides final approved descriptions/prices. |

## Prerequisite Gates
- [ ] **Domain Access:** Confirmation of the production domain and DNS control.
- [ ] **Secret Rotation:** Rotation of all credentials found in legacy frontend files.
- [ ] **API Health:** Verification of a `healthcheck` endpoint on the authoritative legacy server.
