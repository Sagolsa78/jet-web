'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UNIFIED_PACKAGES } from '@/data/packages-unified';
import { SAMPLE_DESTINATIONS } from '@/data/sample-destinations';
import { useQuoteModal } from '@/context/QuoteModalContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';

const CATEGORIES = [
  'All Packages',
  'Honeymoon',
  'Family',
  'Adventure',
  'Luxury',
  'Weekend',
];

const BUDGET_PRESETS = [
  { label: 'Any Budget', value: 250000 },
  { label: 'Under ₹35k', value: 35000 },
  { label: 'Under ₹65k', value: 65000 },
  { label: 'Under ₹1.2L', value: 120000 },
  { label: 'Luxury (₹1.5L+)', value: 999999 },
];

export function CuratedPackages() {
  const [selectedCategory, setSelectedCategory] = useState('All Packages');
  const [maxBudget, setMaxBudget] = useState<number>(250000);
  const { openQuoteModal } = useQuoteModal();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const filteredPackages = useMemo(() => {
    return UNIFIED_PACKAGES.filter((pkg) => {
      // Style / Category filter
      if (selectedCategory !== 'All Packages') {
        const matchesStyle = pkg.style === selectedCategory;
        const matchesTag = pkg.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());
        if (!matchesStyle && !matchesTag) return false;
      }

      // Budget filter
      if (maxBudget === 999999) {
        // Luxury preset: starting price >= 150000
        return (pkg.startingPrice || 0) >= 150000;
      }

      if (maxBudget < 250000) {
        if (!pkg.startingPrice) return false;
        return pkg.startingPrice <= maxBudget;
      }

      return true;
    }).slice(0, 8);
  }, [selectedCategory, maxBudget]);

  return (
    <section className="w-full bg-surface-container py-20 px-6 sm:px-10 lg:px-12 my-10" id="curated-holidays">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.2em] block mb-2">
            Curated Holiday Blueprints ({UNIFIED_PACKAGES.length} Options)
          </span>
          <h2 className="font-serif text-[38px] sm:text-[46px] font-semibold leading-tight text-primary mb-3">
            Handcrafted Packages &amp; Indicative Pricing
          </h2>
          <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Every itinerary is a flexible starting blueprint tailored to your family&apos;s preferred wake-up times, food habits, and private transfer needs.
          </p>
        </div>

        {/* ── INTERACTIVE BUDGET SLIDER & CONTROLS DOCK ── */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs border border-surface-container-high/80 mb-10 max-w-4xl mx-auto">
          {/* Top Row: Budget Readout & Presets */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-secondary block mb-0.5">
                Target Land Benchmark (Per Person)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                  {maxBudget === 999999
                    ? `${formatPrice(150000)}+`
                    : maxBudget >= 250000
                    ? 'All Budgets'
                    : `Up to ${formatPrice(maxBudget)}`}
                </span>
                <span className="text-xs text-outline font-medium">twin sharing</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {BUDGET_PRESETS.map((preset) => {
                const isActive = maxBudget === preset.value;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setMaxBudget(preset.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-secondary text-on-secondary shadow-xs'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min={25000}
              max={250000}
              step={5000}
              value={maxBudget > 250000 ? 250000 : maxBudget}
              onChange={(e) => setMaxBudget(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary focus:outline-none"
              aria-label="Filter packages by maximum budget"
            />
            <div className="flex justify-between text-[11px] text-outline font-mono">
              <span>{formatPrice(25000)}</span>
              <span>{formatPrice(75000)}</span>
              <span>{formatPrice(150000)}</span>
              <span>{formatPrice(250000)}+</span>
            </div>
          </div>

          {/* Category Filter Pills (Sub-row) */}
          <div className="pt-6 mt-6 border-t border-surface-container-high/60 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold uppercase tracking-wider text-outline shrink-0 mr-1">
                Travel Style:
              </span>
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`font-sans text-xs font-semibold rounded-full px-3.5 py-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <span className="text-xs text-on-surface-variant font-medium shrink-0">
              Showing <strong className="text-primary">{filteredPackages.length}</strong> matched escapes
            </span>
          </div>
        </div>

        {/* ── PACKAGE CARDS GRID ── */}
        {filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest rounded-3xl border border-surface-container-high p-8 max-w-xl mx-auto">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
            <h3 className="font-serif text-xl font-bold text-primary mb-1">
              No packages found under {formatPrice(maxBudget)}
            </h3>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Try sliding the budget range higher or resetting your selected travel style.
            </p>
            <button
              type="button"
              onClick={() => {
                setMaxBudget(250000);
                setSelectedCategory('All Packages');
              }}
              className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPackages.map((pkg) => {
              const destination = SAMPLE_DESTINATIONS.find((d) => d.id === pkg.destinationId);
              const destName = destination?.name || pkg.destinationId;
              const hasPrice = Boolean(pkg.startingPrice && pkg.startingPrice > 0);

              return (
                <article
                  key={pkg.id}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group border border-surface-container-high/80"
                >
                  {/* Image Container with destination & duration overlaid */}
                  <div className="relative h-52 w-full overflow-hidden bg-surface-container">
                    <Image
                      src={pkg.heroImage}
                      alt={pkg.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />

                    {/* Top Badges: Real Badges Only */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-10">
                      {pkg.badge && (
                        <span
                          className={`font-sans text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${
                            pkg.badge === 'Bestseller'
                              ? 'bg-amber-500 text-white'
                              : pkg.badge === 'Limited dates'
                              ? 'bg-rose-600 text-white'
                              : pkg.badge === 'Honeymoon'
                              ? 'bg-pink-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(pkg.id);
                      }}
                      className="absolute top-3 right-3 bg-surface-container-lowest/80 backdrop-blur-xs p-1.5 rounded-full text-secondary hover:text-primary transition-transform active:scale-90 shadow-xs cursor-pointer z-10"
                      aria-label={isWishlisted(pkg.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <span
                        className={`material-symbols-outlined text-base ${
                          isWishlisted(pkg.id) ? 'text-rose-500 fill-current' : 'text-secondary'
                        }`}
                      >
                        {isWishlisted(pkg.id) ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>

                    {/* Overlaid Destination & Duration */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 text-on-primary">
                      <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase text-secondary-container mb-0.5">
                        <span>{destName}</span>
                        <span className="bg-primary/80 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] text-white">
                          {pkg.durationDays > 0 ? `${pkg.durationDays}D / ${pkg.durationNights}N` : 'Custom Duration'}
                        </span>
                      </div>
                      <h3 className="font-serif text-base font-bold leading-snug line-clamp-1">
                        {pkg.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    {/* 3 High-Value Inclusions as Compact Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.inclusions.slice(0, 3).map((inc) => (
                        <span
                          key={inc}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container-low text-[10px] text-on-surface-variant font-medium max-w-full truncate border border-surface-container-high/40"
                          title={inc}
                        >
                          <span className="material-symbols-outlined text-[11px] text-teal-600 shrink-0">check</span>
                          <span className="truncate">{inc}</span>
                        </span>
                      ))}
                    </div>

                    {/* Price Hierarchy */}
                    <div className="pt-2 border-t border-surface-container-high/60">
                      {hasPrice ? (
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-outline">From</span>
                            <span className="font-serif text-lg font-bold text-primary">
                              {formatPrice(pkg.startingPrice)}
                            </span>
                          </div>
                          <span className="text-[10px] text-on-surface-variant block leading-tight">
                            {pkg.priceBasis || 'per person · excluding flights'}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-serif text-sm font-bold text-primary block">
                            Price on request
                          </span>
                          <span className="text-[10px] text-outline block leading-tight">
                            details being updated
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: Primary "Customize this package" + Itinerary Link */}
                    <div className="pt-1 flex flex-col gap-1.5 mt-auto">
                      <button
                        type="button"
                        onClick={() =>
                          openQuoteModal({
                            packageTitle: pkg.title,
                            destination: destName,
                            packageId: pkg.id,
                            budgetRange: hasPrice ? formatPrice(pkg.startingPrice) : undefined,
                            travelStyle: pkg.style,
                            duration: pkg.durationDays > 0 ? `${pkg.durationDays} Days / ${pkg.durationNights} Nights` : 'Custom Duration',
                            source: 'package_card',
                          })
                        }
                        className="w-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary py-2.5 px-3 rounded-full text-xs font-bold shadow-xs transition-all text-center cursor-pointer"
                      >
                        Customize this package
                      </button>

                      <Link
                        href={`/holidays/${pkg.slug}`}
                        className="w-full text-center text-[11px] font-semibold text-secondary hover:text-primary transition-colors py-1 flex items-center justify-center gap-1"
                      >
                        <span>View Verified Itinerary</span>
                        <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom CTA to View Entire Catalogue */}
        <div className="mt-12 text-center">
          <Link
            href="/holidays"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-on-primary hover:bg-primary/90 text-xs font-bold shadow-md transition-all"
          >
            <span>Explore All {UNIFIED_PACKAGES.length} Curated Itineraries</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
          <p className="font-sans text-[11px] text-outline text-center mt-4">
            *Indicative land package price per adult on twin-sharing basis. Live quotes customized to your travel dates, flights, and room tier.
          </p>
        </div>
      </div>
    </section>
  );
}
