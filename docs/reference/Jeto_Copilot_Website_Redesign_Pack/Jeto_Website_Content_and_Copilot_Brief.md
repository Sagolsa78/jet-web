# Jeto Vacations — Website Redesign Content Brief & Copilot Implementation Prompt

Prepared: 23 October 2026

## Purpose

Redesign the existing public Jeto Vacations website using the user's existing Google Stitch design files in the project directory. This phase is **public website redesign only**; the CRM rebuild comes later. Preserve the user's design as the visual authority while using the existing public Jeto Vacations website as the source of approved business facts and initial content.

Reference website: https://www.jetovacations.com/

Key source pages inspected:
- Homepage: https://www.jetovacations.com/
- Quote form: https://www.jetovacations.com/quoteform/qr1
- Thailand packages: https://www.jetovacations.com/new/thailand
- Maldives packages: https://www.jetovacations.com/new/maldives
- Goa packages: https://www.jetovacations.com/new/goa
- Terms & conditions entry point: https://www.jetovacations.com/tnc
- Reviews page: https://www.jetovacations.com/newreview

This brief summarizes the pages reviewed, not every page or all available inventory. Copilot should inspect the live first-party source pages before importing more package details. Never present unverified or stale information as current.

---

# Part A — Source-derived business content

## Brand

- Brand name: Jeto Vacations
- Existing tagline: “No Tension, Only Vacation”
- Existing homepage CTA: “Plan a Trip”
- Existing secondary CTA: “Know About Us”
- Existing primary conversion copy: “Ready to Plan Your Stress-Free Vacation?”
- Quote form CTA: “Request Quote”
- Homepage process positioning: personalized consultation, customized itinerary, coordinated travel arrangements, and traveller support.

## Contact details shown on the official site

- Phone: `8882579628`
- Email: `support@jetovacations.com`
- GSTIN shown: `07AAECJ6467D1ZI`

Do not invent a postal address, alternate phone, office hours, social media handle, legal entity name, or WhatsApp deep link. Show the current phone/email as supplied above and make them environment/configuration-backed in the application. A WhatsApp URL should only be generated after confirming the correct E.164 number/country code.

## Homepage service promises

The official homepage uses these three labels:

1. **Right Guidance** — travel experts help travellers make decisions and shape an itinerary.
2. **Right Price** — transparent pricing and value benchmarking; the original site's text says there are no hidden fees.
3. **Right Services** — support with visa paperwork and on-ground issues; the original site's text describes 24/7 human support.

These are existing marketing claims. Before representing “24/7”, “no hidden fees” or guarantees as contractual facts, have the business owner approve them. If not confirmed, soften to “Clear pricing”, “Personal guidance”, and “Support throughout your trip”.

## “How we plan your trip” steps

1. **Understand Your Needs** — consultation about budget, interests, dates, and concerns.
2. **Expert Customization** — tailored itinerary and travel-partner selection.
3. **Seamless Execution** — flights, visas, hotels, and transport coordination.
4. **24/7 On-Ground Care** — support with drivers, guides, and traveller issues.

Again, retain the 24/7 promise only if the business confirms it is current.

## Destinations listed on the existing homepage

### International

- Thailand
- Bali
- Singapore
- Vietnam
- Malaysia
- Dubai
- Maldives
- Mauritius
- Sri Lanka
- Turkey
- Hong Kong
- Philippines
- Azerbaijan
- Kazakhstan
- Georgia

### Domestic

- Kerala
- Goa
- Rajasthan
- Himachal
- Andaman
- Kashmir
- Sikkim–Darjeeling
- Meghalaya
- Ladakh
- Uttarakhand

The quote form's additional destination list includes **North-East**. Avoid creating duplicate destination records for “Meghalaya” and “North-East”; model North-East as a broader region/collection unless business data says otherwise.

## Promotions shown on the existing homepage (MUST VERIFY BEFORE DISPLAY)

International destination promotional percentages shown in the captured page:

- Thailand 20%
- Bali 15%
- Singapore 18%
- Vietnam 22%
- Malaysia 12%
- Dubai 25%
- Maldives 10%
- Mauritius 17%
- Sri Lanka 20%
- Turkey 15%
- Hong Kong 10%
- Philippines 18%
- Azerbaijan 20%
- Kazakhstan 22%
- Georgia 20%

Domestic percentages shown:

- Kerala 15%
- Goa 20%
- Rajasthan 18%
- Himachal 12%
- Andaman 22%
- Kashmir 20%
- Sikkim–Darjeeling 15%
- Meghalaya 18%
- Ladakh 10%
- Uttarakhand 20%

These percentages may be campaign-specific or outdated. Implement a promotion field in the content model, but set promotions to **unpublished / not shown by default** until approved by the owner. Do not present them as currently available discounts without confirmation and terms.

## Claims on the existing site requiring confirmation

- The homepage booking count varies between crawls (58 vs 66 in the past seven days).
- The quote form claims a 4.8/5 Google rating, 2,000+ reviews, and 100,000+ vacationers.
- The public `/newreview` page currently renders “No reviews found.”
- The homepage displays testimonials, but the review inventory and actual verified source were not established in this review.

Therefore:
- Do **not** hardcode live booking counters.
- Do **not** display the 4.8/5, 2,000+ reviews, 100,000+ travellers, or “booked in last 7 days” claims until verified by the owner and an authoritative source.
- Never fabricate testimonials, reviewer names, ratings, review dates, badges, certifications, or customer counts.
- If no verified review data is available, replace the carousel with a “What to expect” / “Why travel with Jeto” section.

---

# Part B — Quote popup requirements

## Expected entry points

The quote modal should be reachable from:

- Main navigation “Plan My Trip” / “Request a Quote” button
- Homepage hero CTA
- Destination card CTAs
- Holiday-package cards
- Package detail page CTA
- End-of-page CTA
- A tasteful mobile sticky action, if it fits the Stitch design

Do not immediately block first-time visitors with an unsolicited popup. Open it after a deliberate user click. Optional timed/exit-intent promotions are out of scope until tested for usability.

## Modal behavior

- Match the user's Stitch design and brand tokens.
- Desktop: polished centered dialog with a clear title, short intro, comfortable width, sensible max-height, and an internal scrolling form area.
- Mobile: responsive full-height or bottom-sheet pattern that keeps the form legible and the close action accessible.
- Close icon has an accessible label.
- Close on Escape; clicking the backdrop may close it only if it will not discard entered data unexpectedly.
- Lock background scrolling while open.
- Keep keyboard focus inside the dialog and restore focus to the CTA when it closes.
- Use proper dialog semantics (`role="dialog"`, `aria-modal="true"`, labelled title) or a well-tested accessible dialog component.
- Do not create an inaccessible hand-written focus trap when a compatible dialog component exists in the project's stack.
- Prefill the destination and package when the modal is opened from a destination/package CTA.
- Preserve entered values if a validation issue occurs.
- Prevent double submissions.
- Present inline errors and a visible submission state.
- Show genuine success only after the server/integration confirms that the enquiry was accepted. In demo mode, explicitly say it was not sent to the travel team.

## Fields found in the existing Jeto quote form

Required according to the existing page:

1. **Destination** — required select; include all listed domestic/international destinations plus “Not sure yet / Help me choose”.
2. **Approximate travel date** — required.
3. **Adults** — required; existing form labels adults as age 12 years or older.
4. **Children** — child count; existing form indicates ages 3–11. If children may be younger than 3, add a separate infant category only after owner approval.
5. **Name** — required.
6. **Email address** — required.
7. **Mobile number** — existing form labels this as WhatsApp/call contact; treat as required but validate this requirement with the owner.
8. **Contact on WhatsApp only** — checkbox/consent preference.
9. **Trip planning status** — required select.
10. **Time to book** — required select.
11. **Have you received quotes from other companies?** — optional select.
12. **Referral code** — optional.
13. **Additional details** — optional free text.
14. **Have you been referred by someone?** — Yes/No.
15. **Terms and conditions consent** — required checkbox linked to the real policy URL.

The current page also asks the traveller to confirm the entered phone number after submitting. In the redesign, prefer inline confirmation/validation before submission or a clearly accessible review step; only add SMS/OTP verification if the business has a verified delivery service for it.

### Suggested dropdown values (proposals, not confirmed source data)

Use accessible and meaningful values, and label these as proposed configuration until owner approval:

- Trip planning status: `Just exploring`, `Comparing destinations`, `Shortlisting packages`, `Ready to book`.
- Time to book: `As soon as possible`, `Within 2 weeks`, `Within 1 month`, `1–3 months`, `More than 3 months`, `Flexible / not sure`.
- Other quotes: `Yes`, `No`, `Prefer not to say`.

Do not tell the user these are the exact old dropdown values; they were not visible in the text extraction.

## Validation and data protection

- Validate email syntax, name length, travel date, traveller counts, and phone input.
- Prevent negative/inconsistent traveller counts.
- Set reasonable length limits on text fields.
- Use Zod or the existing project's equivalent; repeat all validation server-side.
- Require the terms acceptance checkbox to submit. Newsletter/marketing consent must be separate and optional if introduced.
- Include a honeypot or equivalent anti-bot mechanism plus server-side rate limiting when the backend exists.
- Do not collect passport number, passport scans, card details, or sensitive health details in the initial quote form.
- Do not log full enquiry PII in console logs or analytics.
- Provide a short privacy message explaining the contact purpose, linked to the approved privacy policy.

## Submission behavior and CRM-later boundary

This stage is the public website redesign; the complete CRM rebuild comes later. However, design a typed enquiry adapter so CRM integration can be added without rewriting the modal.

Suggested payload:

```ts
export type QuoteEnquiryInput = {
  destination: string;
  travelDate: string; // ISO date or explicit flexible-month value
  adults: number;
  children: number;
  name: string;
  email: string;
  phone: string;
  whatsappOnly: boolean;
  tripPlanningStatus: string;
  bookingTimeline: string;
  competitorQuotes?: string;
  referralCode?: string;
  additionalDetails?: string;
  referredBySomeone?: boolean;
  termsAccepted: boolean;
  sourcePage: string;
  packageSlug?: string;
  destinationSlug?: string;
  campaign?: { source?: string; medium?: string; campaign?: string };
};
```

Implementation requirements:

- Add a clean interface such as `src/lib/enquiries/enquiry-service.ts` or its equivalent in the existing project.
- Validate on the client and server.
- Create a server-side route/action only if compatible with the project's framework.
- Do not call private CRM routes directly from browser code.
- Do not hardcode legacy server URLs in components or expose credentials.
- Previously seen candidate URLs are `https://jeto-crm-server.onrender.com` and `https://web-production-6467.up.railway.app`; both are unverified legacy references, not approved production APIs.
- Use a server-only environment variable for any future integration, e.g. `JETOVACATIONS_ENQUIRY_API_URL`; never use a `NEXT_PUBLIC_` prefix for a secret.
- If a real API is not configured, development mode must display a clear “Demo mode — this enquiry has not been sent to Jeto” state. Do not fabricate an accepted lead.
- In production, if no real submission destination is configured, show a clear failure/alternative contact method. Never show a false success.
- Once a backend is verified, add idempotency/deduplication and an integration test for successful lead creation.

---

# Part C — Starter package data (verified from public package pages; refresh before use)

These are examples captured from the website, not guarantees of current availability or price. Pricing is described on destination pages as average price per person; shown prices have a Terms & Conditions footnote and may vary. Store these as dated content records and keep them unpublished until a human verifies current itinerary, rate, inclusions, and terms.

## Thailand package examples

### Thailand 1
- Duration: 3 nights / 4 days
- Stay: 3 nights Phuket
- Hotel: 3-star hotel
- Meals: 3 breakfasts, 1 lunch
- Activities: half-day Phuket city tour; Phi Phi Island tour by shared big boat with lunch (island fees excluded); two-way airport transfer
- Logistics: tours on sharing basis; airport transfers on private basis
- Price without flight (per person): ₹8,999–₹11,999
- Price with flight (per person): ₹39,999–₹41,999
- Source: https://www.jetovacations.com/new/thailand

### Thailand 2
- Duration: 4 nights / 5 days
- Stay: 2 nights Pattaya + 2 nights Bangkok
- Hotel: 3-star hotel
- Meals: 4 breakfasts, 2 lunches
- Activities: Coral Island tour with lunch; Pattaya-to-Bangkok transfer plus Bangkok city tour; Safari World and Marine Park with lunch; two-way airport transfer
- Logistics: tours on sharing basis; airport transfers on private basis
- Price without flight (per person): ₹15,999–₹19,999
- Price with flight (per person): ₹40,999–₹44,999
- Source: https://www.jetovacations.com/new/thailand

### Thailand 3
- Duration: 3 nights / 4 days
- Stay: 3 nights Bangkok
- Hotel: 3-star hotel
- Meals: 3 breakfasts, 1 lunch, 1 dinner
- Activities: Chao Phraya dinner cruise; Safari World & Marine Park; two-way airport transfer
- Price without flight (per person): ₹12,999–₹15,999
- Price with flight (per person): ₹37,999–₹40,999
- Source: https://www.jetovacations.com/new/thailand

### Thailand 4
- Duration: 4 nights / 5 days
- Stay: 2 nights Krabi + 2 nights Phuket
- Hotel: 3-star hotel
- Meals: 4 breakfasts, 2 lunches
- Activities: Krabi 4 Island tour with lunch by shared long-tail boat (island fees excluded); Krabi-to-Phuket transfer; Phi Phi Island tour by shared big boat with lunch (island fees excluded); two-way airport transfer
- Logistics: tours on sharing basis; airport transfers on private basis
- Price without flight (per person): ₹14,999–₹17,999
- Price with flight (per person): ₹44,999–₹47,999
- Source: https://www.jetovacations.com/new/thailand

### Thailand 5
- Duration: 5 nights / 6 days
- Stay: 2 nights Krabi + 3 nights Phuket
- Hotel: 4-star hotel
- Meals: 5 breakfasts, 2 lunches
- Activities: Krabi 4 Island tour with lunch; Krabi-to-Phuket private transfer and half-day Phuket city tour; Phi Phi Island tour with lunch; Tiger Kingdom; two-way airport transfer
- Logistics: source page says tours on sharing basis and airport transfers on private basis; this package also explicitly lists the Krabi–Phuket leg as private cab
- Price without flight (per person): ₹22,999–₹26,999
- Price with flight (per person): ₹52,999–₹56,999
- Source: https://www.jetovacations.com/new/thailand

## Maldives package examples

### Maldives 1
- Duration: 3 nights / 4 days
- Stay: 3 nights Maafushi Island
- Hotel: 3/4-star resort
- Meals: 3 breakfasts, 3 dinners
- Activities/services: shared transfers, half-board basis, 24/7 concierge according to source page
- Price without flight (per person): ₹32,999–₹36,499
- Price with flight (per person): ₹57,999–₹61,999
- Source: https://www.jetovacations.com/new/maldives

### Maldives 2
- Duration: 3 nights / 4 days
- Stay: 3 nights Maafushi Island
- Hotel: 3/4-star hotel
- Meals: 3 breakfasts, 2 lunches, 3 dinners
- Activities/services: shared transfers, full-board basis, 24/7 concierge according to source page
- Price without flight (per person): ₹38,999–₹42,499
- Price with flight (per person): ₹63,499–₹67,999
- Source: https://www.jetovacations.com/new/maldives

### Maldives 3
- Duration: 4 nights / 5 days
- Stay: 4 nights Maafushi Island
- Hotel: 3/4-star hotel
- Meals: 4 breakfasts, 4 dinners
- Activities/services: shared transfers, half-board basis, 24/7 concierge according to source page
- Price without flight (per person): ₹41,999–₹45,999
- Price with flight (per person): ₹66,999–₹70,999
- Source: https://www.jetovacations.com/new/maldives

IMPORTANT: Do not assume these prices, hotels, schedules, availability, visas, flights, or provider terms remain current. Keep a field such as `verifiedAt`, `published`, and `priceDisclaimer`; never claim a live or confirmed price without backend/provider confirmation. Preserve the distinction between prices with and without flights.

---

# Part D — Suggested normalized content model

Use the framework and conventions already present in the repository. Do not replace the project stack without justification.

```ts
export type Destination = {
  slug: string;
  name: string;
  region: "international" | "domestic" | "regional";
  shortDescription: string;
  heroImage: string;
  gallery: string[];
  travelThemes: string[];
  relatedPackageSlugs: string[];
  published: boolean;
};

export type HolidayPackage = {
  slug: string;
  title: string;
  destinationSlug: string;
  durationNights: number;
  durationDays: number;
  staySummary: string;
  hotelCategory?: string;
  meals: string[];
  inclusions: string[];
  exclusions: string[];
  priceWithoutFlight?: { min: number; max: number; currency: "INR" };
  priceWithFlight?: { min: number; max: number; currency: "INR" };
  priceBasis: "per-person";
  priceDisclaimer: string;
  heroImage: string;
  published: boolean;
  verifiedAt?: string;
};
```

Do not invent destination descriptions, itineraries, photos, packages, ratings, or price facts. For marketing copy that is not source-derived, label it as draft content awaiting owner approval. Use licensed imagery or existing permitted site assets; do not hotlink competitor images.

---

# Part E — Ready-to-paste prompt for GitHub Copilot (or another coding agent)

You are modifying my existing Jeto Vacations website repository. The existing Google Stitch export/design files are stored in this project's directory. The reference business website is https://www.jetovacations.com/ and its current public quote form is https://www.jetovacations.com/quoteform/qr1.

This task is the **public website redesign only**. CRM rebuild is a later phase. You must inspect the real repo before editing. Do not ask me to rebuild the app from scratch if a valid existing application is present.

## Task 1 — Inspect the design and repository

1. Run `pwd`, inspect Git status, project instructions, package.json/lockfile, actual routes, styling, current components and public assets.
2. Locate and read the Stitch reference material in this directory, especially DESIGN.md, HTML exports, screenshots, SVGs and image assets.
3. Follow Stitch visual direction as the UI authority; use the public Jeto site as the source of business content only. Do not simply clone its old visual layout.
4. Preserve all uncommitted changes and reference files. Do not disclose or copy old production secrets.
5. Create a short checklist in a project doc if useful, then implement immediately. Do not stop at planning.

## Task 2 — Populate the website with real, structured Jeto content

Create data-driven sections and routes for:
- Homepage brand/tagline, service promises and trip-planning process.
- International and domestic destinations listed in this brief.
- Holiday listing pages and package detail pages.
- Travel themes/collections.
- Contact section using phone `8882579628`, email `support@jetovacations.com`, and GSTIN `07AAECJ6467D1ZI`.
- Policy pages linked to approved live policy URLs.

Use package records from Part C as initial data with the explicit “prices and availability subject to confirmation” disclaimer. These records must be marked unverified/unpublished until an authorized person confirms current details. Promotions are also disabled until confirmed.

Separate content from components; do not duplicate package content in multiple React files. Use typed data and stable slugs, and make every card navigate to the appropriate route. Do not invent reviews or trust claims. Ensure that search, filters, navigation and CTAs work.

## Task 3 — Build the Request a Quote popup

Build a branded, accessible popup/dialog based on the user's Stitch design. Open it from all meaningful Plan My Trip/Request Quote buttons. Prefill destination/package context when opened from a package or destination page.

Include the fields listed in Part B: destination, approximate travel date, adult count (12+), children count (3–11), name, email, mobile number, WhatsApp-only preference, trip planning status, booking timeline, optional competitor quotes, referral code, additional notes, referred-by choice, and required terms consent.

Provide a sensible responsive layout and progress/review step only if it improves form usability. Ensure Escape closes the modal, focus is managed accessibly, body scroll is locked when open, labels are associated with inputs, errors are shown inline, counts are validated, values are preserved on errors, and double submits are prevented.

The source page's exact dropdown option lists could not be established from text extraction. Treat the proposed options in this brief as configurable draft values, not verified legacy options.

## Task 4 — Form integration must be truthful

Create a typed enquiry service boundary and server-side validation. Do not send directly to old CRM endpoints until the backend and endpoint contracts are verified. The legacy URLs mentioned in old source are not confirmed production APIs.

If no real submission service exists, implement a clearly marked development/demo mode that says the enquiry was not sent. In production, display a genuine service error/alternative contact route if there is no configured API. Do not silently lose submissions or show a false success. Never expose API keys or secrets in browser code.

## Task 5 — Validate the result

- Run relevant type-check, lint, test, and build commands available in this repository.
- Run the app locally if tools allow it.
- Inspect key pages in desktop/mobile widths and compare them to Stitch.
- Test keyboard access, form validation, destination prefill, close behavior, loading/error/success states, and no-JS/server failure handling as applicable.
- Fix regressions introduced by your changes.
- Report actual changed files and commands/results. Distinguish fully working, mock/demo, unpublished, unverified and blocked items.

Do not rebuild the CRM in this task. First complete a polished, working public website and enquiry UI while preserving the repository's existing architecture.

Begin by inspecting the repository and Stitch files, then make actual code edits in focused milestones.

---

# Part F — Acceptance criteria before moving to CRM

- [ ] Existing Stitch design is recognizable in the coded website; no generic replacement layout.
- [ ] Header, footer, responsive menu and all public routes function.
- [ ] Destination cards and holiday cards use normalized data.
- [ ] Package pages clearly distinguish price with flights vs without flights.
- [ ] Unverified prices, discounts, review counts and testimonials are not publicly shown as facts.
- [ ] Quote modal opens from header, hero, destination and package CTAs.
- [ ] Destination/package context is prefilled where relevant.
- [ ] Required fields, email/phone formats, dates and traveller counts validate.
- [ ] Dialog supports keyboard navigation and small screen sizes.
- [ ] API submission has clear loading/success/error states and cannot double-submit.
- [ ] Demo mode never claims a real enquiry reached the Jeto team.
- [ ] No legacy production credentials are copied into new source or client bundles.
- [ ] Actual build/lint/type checks have been run; failures are reported and addressed.
- [ ] README documents content-data editing, environment variables, demo mode, and steps needed for verified backend integration.

