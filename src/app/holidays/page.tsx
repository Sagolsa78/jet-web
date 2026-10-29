import { Suspense } from 'react';
import type { Metadata } from 'next';
import { UNIFIED_PACKAGES } from '@/data/packages-unified';
import type { PackageCatalogueSummary } from '@/types';
import HolidaysCatalogueClient from '@/components/holidays/HolidaysCatalogueClient';
import { SITE_ORIGIN } from '@/data/site-content';

export const metadata: Metadata = {
  title: 'Curated Outbound & Domestic Holidays | Jeto Vacations',
  description:
    'Explore 400+ handcrafted international and domestic luxury holidays with transparent pricing, verified inclusions, and personal concierge customisation.',
  alternates: {
    canonical: `${SITE_ORIGIN}/holidays`,
  },
};

export default function HolidaysPage() {
  // Extract strictly what is required for the catalogue cards to minimize client bundle payload
  const catalogueSummaries: PackageCatalogueSummary[] = UNIFIED_PACKAGES.map((pkg) => ({
    id: pkg.id,
    slug: pkg.slug,
    title: pkg.title,
    destinationId: pkg.destinationId,
    durationDays: pkg.durationDays,
    durationNights: pkg.durationNights,
    startingPrice: pkg.startingPrice,
    currency: pkg.currency,
    priceBasis: pkg.priceBasis,
    includesFlights: pkg.includesFlights,
    style: pkg.style,
    heroImage: pkg.heroImage,
    badge: pkg.badge,
    description: pkg.description,
    inclusions: pkg.inclusions.slice(0, 3),
    tags: pkg.tags,
  }));

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <Suspense
        fallback={
          <div className="py-32 text-center font-sans text-sm text-on-surface-variant">
            Loading curated holidays...
          </div>
        }
      >
        <HolidaysCatalogueClient packages={catalogueSummaries} />
      </Suspense>
    </div>
  );
}
