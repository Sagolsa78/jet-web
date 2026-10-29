import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parsePrice,
  parseDuration,
  toSlug,
  getPackageBySlug,
  getAllPackageSlugs,
  UNIFIED_PACKAGES,
} from '../src/data/packages-unified.ts';

test('parsePrice: correctly parses valid range with Indian rupee and commas', () => {
  const result = parsePrice('₹15,000 - ₹25,000');
  assert.equal(result.min, 15000);
  assert.equal(result.max, 25000);
  assert.equal(result.hasValidPrice, true);
});

test('parsePrice: correctly parses single price string', () => {
  const result = parsePrice('38,500');
  assert.equal(result.min, 38500);
  assert.equal(result.max, 38500);
  assert.equal(result.hasValidPrice, true);
});

test('parsePrice: corrects reversed min/max ranges', () => {
  const result = parsePrice('50,000 - 30,000');
  assert.equal(result.min, 30000);
  assert.equal(result.max, 50000);
  assert.equal(result.hasValidPrice, true);
});

test('parsePrice: NEVER silently falls back to 25,000 for empty or null input', () => {
  const empty = parsePrice('');
  assert.equal(empty.min, 0);
  assert.equal(empty.max, 0);
  assert.equal(empty.hasValidPrice, false);

  const nil = parsePrice(null);
  assert.equal(nil.min, 0);
  assert.equal(nil.max, 0);
  assert.equal(nil.hasValidPrice, false);

  const malformed = parsePrice('Contact for pricing');
  assert.equal(malformed.min, 0);
  assert.equal(malformed.max, 0);
  assert.equal(malformed.hasValidPrice, false);
});

test('parseDuration: correctly parses nights and days and NEVER invents 4N/5D for missing input', () => {
  const d1 = parseDuration('4N / 5D');
  assert.equal(d1.nights, 4);
  assert.equal(d1.days, 5);

  const d2 = parseDuration('7 Nights');
  assert.equal(d2.nights, 7);
  assert.equal(d2.days, 8);

  const d3 = parseDuration('6 Days');
  assert.equal(d3.nights, 5);
  assert.equal(d3.days, 6);

  const empty = parseDuration('');
  assert.equal(empty.nights, 0);
  assert.equal(empty.days, 0);

  const nil = parseDuration(null);
  assert.equal(nil.nights, 0);
  assert.equal(nil.days, 0);

  const invalid = parseDuration('Flexible trip');
  assert.equal(invalid.nights, 0);
  assert.equal(invalid.days, 0);
});

test('toSlug: normalizes accents, spaces, and special characters', () => {
  assert.equal(toSlug('Bali & Nusa Penida Luxury!'), 'bali-nusa-penida-luxury');
  assert.equal(toSlug('Zürich St. Moritz'), 'zurich-st-moritz');
});

test('getPackageBySlug: requires exact slug match and rejects ambiguous substring matches', () => {
  // Exact match must succeed
  const samplePkg = getPackageBySlug('swiss-alps-glacier-express');
  assert.ok(samplePkg, 'Sample package should be found by exact slug');
  assert.equal(samplePkg.slug, 'swiss-alps-glacier-express');

  // Ambiguous substring should NOT match
  const ambiguous = getPackageBySlug('swiss');
  assert.equal(ambiguous, undefined, 'Ambiguous partial slug "swiss" must return undefined');

  const nonexistent = getPackageBySlug('nonexistent-holiday-xyz-123');
  assert.equal(nonexistent, undefined);
});

test('UNIFIED_PACKAGES: all package slugs are unique and deduplicated', () => {
  const allSlugs = getAllPackageSlugs();
  const uniqueSlugs = new Set(allSlugs);
  assert.equal(
    allSlugs.length,
    uniqueSlugs.size,
    `Slugs must be strictly unique! Total: ${allSlugs.length}, Unique: ${uniqueSlugs.size}`
  );
  assert.ok(allSlugs.length >= 430, 'Should have over 430 imported and sample packages');
});

test('UNIFIED_PACKAGES: all packages declare truthful priceBasis and valid itineraryType', () => {
  for (const pkg of UNIFIED_PACKAGES) {
    if (pkg.startingPrice && pkg.startingPrice > 0) {
      assert.ok(
        pkg.priceBasis && pkg.priceBasis.includes('per person'),
        `Priced package ${pkg.slug} must declare per person price basis`
      );
    } else {
      assert.equal(
        pkg.priceBasis,
        'Price on request / details being updated',
        `Unpriced package ${pkg.slug} must declare Price on request`
      );
    }

    assert.ok(
      pkg.itineraryType === 'verified' || pkg.itineraryType === 'suggested_draft',
      `Package ${pkg.slug} must declare verified or suggested_draft provenance`
    );

    if (pkg.itineraryType === 'suggested_draft') {
      assert.equal(
        pkg.description.includes('Features verified'),
        false,
        `Draft package ${pkg.slug} must not claim "Features verified stays"`
      );
    }

    if (pkg.badge) {
      assert.ok(
        ['Bestseller', 'Limited dates', 'Family friendly', 'Honeymoon'].includes(pkg.badge),
        `Package ${pkg.slug} has invalid badge: ${pkg.badge}`
      );
    }
  }
});
