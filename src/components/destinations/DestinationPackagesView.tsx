'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { LivePackage } from '@/data/live-packages-repository';
import { useQuoteModal } from '@/context/QuoteModalContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';

interface DestinationPackagesViewProps {
  packages: LivePackage[];
  destinationName: string;
}

export function DestinationPackagesView({
  packages,
  destinationName,
}: DestinationPackagesViewProps) {
  const { openQuoteModal } = useQuoteModal();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [priceMode, setPriceMode] = useState<'withoutFlight' | 'withFlight'>('withoutFlight');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const parseNumPrice = (val: string | number | undefined) => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    return parseFloat(val.replace(/,/g, '')) || 0;
  };

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // Duration filter
      if (selectedDuration === 'short' && pkg.durationDays > 5) return false;
      if (selectedDuration === 'medium' && (pkg.durationDays < 6 || pkg.durationDays > 7)) return false;
      if (selectedDuration === 'long' && pkg.durationDays < 8) return false;

      // Search filter
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchesStay = pkg.stay.toLowerCase().includes(query);
        const matchesInclusions = pkg.inclusions.some((inc) => inc.toLowerCase().includes(query));
        const matchesName = pkg.originalName.toLowerCase().includes(query);
        if (!matchesStay && !matchesInclusions && !matchesName) return false;
      }

      return true;
    });
  }, [packages, selectedDuration, searchFilter]);

  const handleRequestQuote = (pkg: LivePackage) => {
    const rawVal = priceMode === 'withFlight' ? pkg.priceRangeWithFlight : pkg.priceRangeWithoutFlight;
    const numPrice = parseNumPrice(rawVal);
    const selectedPrice = `${formatPrice(numPrice)} (${priceMode === 'withFlight' ? 'With Flights' : 'Land Package'})`;

    const notes = [
      `Selected Itinerary: ${pkg.originalName} (${pkg.destination})`,
      `Stay: ${pkg.stay || 'Custom'}`,
      `Duration: ${pkg.duration}`,
      `Hotel Category: ${pkg.hotelCategory}`,
      `Meals: ${pkg.meals}`,
      `Pricing Basis: ${selectedPrice}`,
      `Inclusions: ${pkg.inclusions.slice(0, 4).join(', ')}`,
    ].join('\n');

    openQuoteModal({
      packageTitle: `${pkg.destination}: ${pkg.stay || pkg.originalName}`,
      destination: pkg.destination,
      budgetRange: selectedPrice,
      duration: pkg.duration,
      notes,
    });
  };

  return (
    <div className="space-y-8">
      {/* ── FILTER & TOGGLE CONTROL BAR ── */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Flight Mode Toggle */}
        <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-surface-container-high">
          <button
            type="button"
            onClick={() => setPriceMode('withoutFlight')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              priceMode === 'withoutFlight'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Land Package (Excl. Flights)
          </button>
          <button
            type="button"
            onClick={() => setPriceMode('withFlight')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              priceMode === 'withFlight'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            With Flights Included ✈️
          </button>
        </div>

        {/* Duration Pills & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: `All (${packages.length})` },
              { id: 'short', label: '4–5 Days' },
              { id: 'medium', label: '6–7 Days' },
              { id: 'long', label: '8+ Days' },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setSelectedDuration(pill.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  selectedDuration === pill.id
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="material-symbols-outlined text-outline text-sm absolute left-3 top-2">
              search
            </span>
            <input
              type="text"
              placeholder="Filter stay or hotel..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full sm:w-48 pl-8 pr-3 py-1.5 rounded-full border border-surface-container-high bg-surface-container-low text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-secondary text-on-surface"
            />
          </div>
        </div>
      </div>

      {/* ── PACKAGES GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPackages.map((pkg) => {
          const displayPrice =
            priceMode === 'withFlight'
              ? pkg.priceRangeWithFlight || pkg.priceRangeWithoutFlight
              : pkg.priceRangeWithoutFlight;

          return (
            <article
              key={pkg.id}
              className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/80 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Header */}
                <div className="relative h-52 w-full overflow-hidden bg-surface-container">
                  <Image
                    src={pkg.image}
                    alt={pkg.formattedTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-70" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 bg-secondary text-on-secondary px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                    {pkg.duration}
                  </div>

                  {/* Wishlist Heart */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(pkg.id);
                    }}
                    className="absolute top-3 right-3 bg-surface-container-lowest/80 backdrop-blur-sm p-1.5 rounded-full text-secondary hover:text-primary transition-transform active:scale-90 shadow-xs cursor-pointer z-10"
                    title="Save to wishlist"
                  >
                    <span
                      className={`material-symbols-outlined text-base ${
                        isWishlisted(pkg.id) ? 'text-rose-500 fill-current' : 'text-secondary'
                      }`}
                    >
                      {isWishlisted(pkg.id) ? 'favorite' : 'bookmark'}
                    </span>
                  </button>

                  {/* Stay Title on Image Bottom */}
                  <div className="absolute bottom-3 left-4 right-4 text-on-primary">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-container block">
                      {pkg.stay || pkg.destination}
                    </span>
                    <h3 className="font-serif text-lg font-bold leading-snug line-clamp-1">
                      {pkg.originalName}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-surface-container-low/70 p-2.5 rounded-xl border border-surface-container-high/60">
                      <span className="text-[10px] font-bold uppercase text-outline block mb-0.5">
                        Accommodations
                      </span>
                      <span className="font-semibold text-primary block truncate">
                        {pkg.hotelCategory || 'Verified Hotel'}
                      </span>
                    </div>

                    <div className="bg-surface-container-low/70 p-2.5 rounded-xl border border-surface-container-high/60">
                      <span className="text-[10px] font-bold uppercase text-outline block mb-0.5">
                        Meals
                      </span>
                      <span className="font-semibold text-primary block truncate">
                        {pkg.meals || 'Daily Breakfast'}
                      </span>
                    </div>
                  </div>

                  {/* Confirmed Inclusions */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-outline block mb-2">
                      Confirmed Inclusions:
                    </span>
                    <ul className="space-y-1.5 text-xs text-on-surface-variant">
                      {pkg.inclusions.slice(0, 4).map((inc) => (
                        <li key={inc} className="flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-[13px] text-teal-600 shrink-0 mt-0.5">
                            check
                          </span>
                          <span className="line-clamp-1">{inc}</span>
                        </li>
                      ))}
                      {pkg.inclusions.length > 4 && (
                        <li className="text-[11px] text-secondary font-semibold pl-4">
                          + {pkg.inclusions.length - 4} more activities &amp; transfers
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card Footer: Pricing & Proposal Button */}
              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-surface-container-high flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-[10px] text-outline font-bold uppercase tracking-wider block">
                      {priceMode === 'withFlight' ? 'Flights Included*' : 'Land Package Price*'}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-2xl font-bold text-primary">
                        {displayPrice ? formatPrice(parseNumPrice(displayPrice)) : 'Custom Quote'}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">/ person</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-outline font-medium">Twin Sharing</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRequestQuote(pkg)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <span>Customise &amp; Request Quote</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12 bg-surface-container-lowest rounded-3xl border border-surface-container-high">
          <span className="material-symbols-outlined text-3xl text-outline mb-2">search_off</span>
          <h4 className="font-serif text-lg font-bold text-primary mb-1">
            No Packages Found Matching Filter
          </h4>
          <p className="font-sans text-xs text-on-surface-variant max-w-sm mx-auto mb-4">
            Try adjusting your duration filter to view other itineraries for {destinationName}.
          </p>
          <button
            type="button"
            onClick={() => setSelectedDuration('all')}
            className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold"
          >
            Show All {packages.length} Packages
          </button>
        </div>
      )}
    </div>
  );
}
