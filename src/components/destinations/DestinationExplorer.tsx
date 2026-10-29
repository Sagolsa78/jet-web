'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  DESTINATIONS,
  DESTINATION_REGION_LABELS,
  type DestinationRegion,
  type SiteDestination,
} from '@/data/destinations';

const regionOptions: Array<{
  value: DestinationRegion | 'all';
  label: string;
}> = [
  { value: 'all', label: 'All places' },
  { value: 'international', label: 'International' },
  { value: 'domestic', label: 'India' },
  { value: 'regional', label: 'Regional' },
];

const regionOrder: DestinationRegion[] = [
  'international',
  'domestic',
  'regional',
];

const regionHeadings: Record<DestinationRegion, string> = {
  international: 'Explore beyond India',
  domestic: 'Discover India',
  regional: 'Explore regional collections',
};

function DestinationCard({
  destination,
  index,
}: {
  destination: SiteDestination;
  index: number;
}) {
  const colorVariants = [
    'bg-surface-container-low',
    'bg-secondary-container/35',
    'bg-brand-coral/15',
  ];

  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={`group relative isolate flex min-h-64 w-[min(78vw,19rem)] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl border border-outline-variant/35 p-5 text-primary transition duration-300 hover:-translate-y-1 hover:border-secondary/50 hover:shadow-[0_18px_40px_rgba(11,35,63,0.13)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary sm:min-h-72 sm:w-[20rem] sm:p-6 ${
        destination.image
          ? 'bg-primary-container text-white'
          : colorVariants[index % colorVariants.length]
      }`}
    >
      {destination.image ? (
        <>
          <Image
            src={destination.image}
            alt={`${destination.name} destination`}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
            className="absolute inset-0 z-0 object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/85 via-primary/10 to-primary/5" />
        </>
      ) : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-5 -top-12 z-0 font-serif text-[10rem] font-semibold leading-none text-primary/5"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      )}

      <div className="relative z-20 flex items-start justify-between gap-4">
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
            destination.image
              ? 'text-white/75'
              : 'text-on-surface-variant'
          }`}
        >
          {DESTINATION_REGION_LABELS[destination.region]}
        </span>
        <span
          aria-hidden="true"
          className={`material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1 ${
            destination.image ? 'text-white' : 'text-secondary'
          }`}
        >
          arrow_outward
        </span>
      </div>

      <div className="relative z-20">
        <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
          {destination.name}
        </h2>
      </div>
    </Link>
  );
}

export function DestinationExplorer() {
  const [selectedRegion, setSelectedRegion] = useState<DestinationRegion | 'all'>('all');

  const visibleRegions = useMemo(() => {
    if (selectedRegion === 'all') {
      return regionOrder;
    }
    return [selectedRegion];
  }, [selectedRegion]);

  return (
    <section aria-label="Destination collections">
      {/* Filter Tabs */}
      <div className="mb-10 flex flex-wrap gap-2">
        {regionOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSelectedRegion(opt.value)}
            className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all ${
              selectedRegion === opt.value
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Region Sections */}
      <div className="space-y-12">
        {visibleRegions.map((region) => {
          const destinations = DESTINATIONS.filter((d) => d.region === region);
          if (destinations.length === 0) return null;

          return (
            <div key={region} className="space-y-5">
              <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-2xl font-bold text-primary">
                  {regionHeadings[region]}
                </h2>
                <span className="text-xs font-medium text-on-surface-variant">
                  {destinations.length} places
                </span>
              </div>

              <div className="-mx-5 flex gap-5 overflow-x-auto px-5 pb-4 pt-1 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
                {destinations.map((destination, idx) => (
                  <DestinationCard
                    key={destination.slug}
                    destination={destination}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
