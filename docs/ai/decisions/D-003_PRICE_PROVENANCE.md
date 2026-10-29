# ADR D-003: Catalogue Price Transparency & Itinerary Provenance

## Status
Accepted

## Context
In early imports of the 433-package inventory, packages with missing or unparseable starting prices fell back to a default value of ₹25,000. In addition, automated scraper routines synthesized multi-day itineraries by distributing package inclusion tags across days.

Presenting invented pricing or synthesized day-by-day itineraries as verified facts creates legal liability, pricing disputes, and customer disappointment.

## Decision
1. **Elimination of Price Fallbacks**: `parsePrice()` in `src/data/packages-unified.ts` strictly returns `null` if a package does not declare a valid price. Detail pages and cards render `"Custom Quote on Request"` rather than a fabricated number.
2. **Provenance Tagging**: Every unified package item carries an explicit `itineraryType` flag:
   - `verified`: Manually audited and confirmed by Jeto travel desk.
   - `suggested_draft`: Auto-structured from raw package inclusions.
3. **Draft Disclaimer**: `InteractiveItineraryCustomizer.tsx` displays an informational banner whenever `itineraryType === 'suggested_draft'`, stating that the displayed schedule is a starting draft that the consultant will tailor to the traveler's exact flight timings and preferences.
4. **Strict Slug Matching**: `getPackageBySlug()` strictly matches the exact slug, preventing accidental route collisions or substring mismatches.

## Consequences
- Guaranteed pricing integrity across all 433 package routes.
- Clear distinction between guaranteed supplier itineraries and customizable drafts.
- Unit tests (`tests/package-parser.test.mjs`) enforce that no silent fallback can be reintroduced.
