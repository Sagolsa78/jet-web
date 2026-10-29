import type { Metadata } from 'next';
import { DestinationExplorer } from '@/components/destinations/DestinationExplorer';
import { SITE_BRAND } from '@/data/site-content';

export const metadata: Metadata = {
  title: `Destinations | ${SITE_BRAND.name}`,
  description:
    'Browse the international and domestic destinations listed by Jeto Vacations.',
};

export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-surface pb-20 pt-36 sm:pt-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <header className="mb-8 grid gap-5 sm:mb-10 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              Places to begin
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-primary sm:text-6xl">
              Where would you like to go?
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-on-surface-variant sm:text-lg">
              Explore Jeto Vacations&apos; international and India destination
              collections, then start planning around the places that interest
              you.
            </p>
          </div>
          <p className="max-w-xs text-sm leading-6 text-on-surface-variant sm:text-right">
            Trip details and current package information are shared as part of
            planning.
          </p>
        </header>
        <DestinationExplorer />
      </div>
    </div>
  );
}