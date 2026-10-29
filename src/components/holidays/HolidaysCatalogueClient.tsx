'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { PackageCatalogueSummary } from '@/types';
import { useQuoteModal } from '@/context/QuoteModalContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';

interface HolidaysCatalogueClientProps {
  packages: PackageCatalogueSummary[];
}

export default function HolidaysCatalogueClient({ packages }: HolidaysCatalogueClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openQuoteModal } = useQuoteModal();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedStyle, setSelectedStyle] = useState(searchParams.get('style') || 'All');
  const [duration, setDuration] = useState(searchParams.get('duration') || 'All');
  const [regionFilter, setRegionFilter] = useState(searchParams.get('region') || 'All');
  const [budgetFilter, setBudgetFilter] = useState(searchParams.get('budget') || 'All');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [visibleCount, setVisibleCount] = useState<number>(18);

  const styles = ['All', 'Honeymoon', 'Family', 'Adventure', 'Luxury', 'Culture', 'Weekend'];
  const durations = [
    { label: 'Any length', value: 'All' },
    { label: 'Up to 5 nights', value: '0-5' },
    { label: '6–8 nights', value: '6-8' },
    { label: '9+ nights', value: '9+' },
  ];
  const budgetOptions = [
    { label: 'Any budget', value: 'All' },
    { label: 'Under ₹25k', value: 'under-25k' },
    { label: '₹25k – ₹50k', value: '25k-50k' },
    { label: '₹50k – ₹1.2 Lakh', value: '50k-120k' },
    { label: '₹1.2 Lakh+', value: 'above-120k' },
  ];

  const filteredPackages = useMemo(() => {
    const list = packages.filter((pkg) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        pkg.title.toLowerCase().includes(query) ||
        pkg.description.toLowerCase().includes(query) ||
        pkg.destinationId.toLowerCase().includes(query) ||
        pkg.tags.some((t) => t.toLowerCase().includes(query));

      const matchesStyle =
        selectedStyle === 'All' || pkg.style === selectedStyle || pkg.tags.includes(selectedStyle);

      const matchesDuration =
        duration === 'All' ||
        (duration === '0-5' && pkg.durationNights <= 5) ||
        (duration === '6-8' && pkg.durationNights >= 6 && pkg.durationNights <= 8) ||
        (duration === '9+' && pkg.durationNights >= 9);

      // Check if domestic or international
      const destLower = pkg.destinationId.toLowerCase();
      const isDomestic =
        destLower.includes('kashmir') ||
        destLower.includes('kerala') ||
        destLower.includes('andaman') ||
        destLower.includes('rajasthan') ||
        destLower.includes('himachal') ||
        destLower.includes('goa') ||
        destLower.includes('uttarakhand') ||
        destLower.includes('ladakh') ||
        destLower.includes('sikkim') ||
        destLower.includes('northeast');

      const matchesRegion =
        regionFilter === 'All' ||
        (regionFilter === 'Domestic' && isDomestic) ||
        (regionFilter === 'International' && !isDomestic);

      const price = pkg.startingPrice || 0;
      const matchesBudget =
        budgetFilter === 'All' ||
        (budgetFilter === 'under-25k' && price > 0 && price < 25000) ||
        (budgetFilter === '25k-50k' && price >= 25000 && price <= 50000) ||
        (budgetFilter === '50k-120k' && price > 50000 && price <= 120000) ||
        (budgetFilter === 'above-120k' && price > 120000);

      return matchesSearch && matchesStyle && matchesDuration && matchesRegion && matchesBudget;
    });

    // Sorting logic
    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.startingPrice || 9999999) - (b.startingPrice || 9999999));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
    } else if (sortBy === 'duration-low') {
      list.sort((a, b) => a.durationDays - b.durationDays);
    } else if (sortBy === 'duration-high') {
      list.sort((a, b) => b.durationDays - a.durationDays);
    }

    return list;
  }, [packages, searchQuery, selectedStyle, duration, regionFilter, budgetFilter, sortBy]);

  const paginatedPackages = useMemo(() => {
    return filteredPackages.slice(0, visibleCount);
  }, [filteredPackages, visibleCount]);

  const updateParam = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== 'All') {
      params.set(key, val);
    } else {
      params.delete(key);
    }
    router.replace(`/holidays?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStyle('All');
    setDuration('All');
    setRegionFilter('All');
    setBudgetFilter('All');
    setSortBy('recommended');
    router.replace('/holidays', { scroll: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12">
      {/* Header & Title Bar */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-surface-container-high pb-8">
        <div>
          <span className="text-secondary font-sans text-xs font-bold uppercase tracking-widest block mb-2">
            Verified Outbound &amp; Domestic Escapes
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary">
            Curated Holiday Blueprints
          </h1>
          <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-2 leading-relaxed">
            Transparent pricing, truthful inclusions, and handcrafted itineraries designed for Indian travellers.
          </p>
        </div>

        <div className="text-xs font-semibold text-outline shrink-0">
          Showing <span className="text-primary font-bold">{filteredPackages.length}</span> verified holiday experiences
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high/80 shadow-xs mb-10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search destination, country..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Region selector */}
          <div>
            <select
              aria-label="Filter by region"
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                updateParam('region', e.target.value);
              }}
            >
              <option value="All">All Regions</option>
              <option value="International">International Only</option>
              <option value="Domestic">India (Domestic) Only</option>
            </select>
          </div>

          {/* Duration selector */}
          <div>
            <select
              aria-label="Filter by duration"
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
              value={duration}
              onChange={(e) => {
                setDuration(e.target.value);
                updateParam('duration', e.target.value);
              }}
            >
              {durations.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Budget selector */}
          <div>
            <select
              aria-label="Filter by budget"
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
              value={budgetFilter}
              onChange={(e) => {
                setBudgetFilter(e.target.value);
                updateParam('budget', e.target.value);
              }}
            >
              {budgetOptions.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Travel Style Filter Pills Row */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-surface-container-high/60 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider mr-2 shrink-0">
              Style:
            </span>
            {styles.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => {
                  setSelectedStyle(style);
                  updateParam('style', style);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  selectedStyle === style
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-outline font-semibold">Sort by:</span>
            <select
              aria-label="Sort packages by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-container-low font-medium cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration-low">Duration: Short to Long</option>
              <option value="duration-high">Duration: Long to Short</option>
            </select>
          </div>
        </div>
      </div>

      {/* Package Grid */}
      {paginatedPackages.length > 0 ? (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPackages.map((pkg) => {
              const destLower = pkg.destinationId.toLowerCase();
              const isDomestic =
                destLower.includes('kashmir') ||
                destLower.includes('kerala') ||
                destLower.includes('andaman') ||
                destLower.includes('rajasthan') ||
                destLower.includes('himachal') ||
                destLower.includes('goa') ||
                destLower.includes('uttarakhand') ||
                destLower.includes('ladakh') ||
                destLower.includes('sikkim') ||
                destLower.includes('northeast');

              const hasPrice = Boolean(pkg.startingPrice && pkg.startingPrice > 0);

              return (
                <article
                  key={pkg.id}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-surface-container-high/80 group"
                >
                  {/* Destination image with overlaid destination and duration */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={pkg.heroImage}
                      alt={pkg.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />

                    {/* True Badges Only */}
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

                    <div className="absolute top-3 right-3 bg-surface-container-lowest/90 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-secondary">
                      {isDomestic ? 'Domestic' : 'International'}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(pkg.slug);
                      }}
                      aria-label="Save to wishlist"
                      className="absolute bottom-3 right-3 bg-surface-container-lowest/80 backdrop-blur-xs p-1.5 rounded-full text-secondary hover:text-primary transition-transform active:scale-90 shadow-xs cursor-pointer z-10"
                    >
                      <span
                        className={`material-symbols-outlined text-base ${
                          isWishlisted(pkg.slug) ? 'text-rose-500 fill-current' : 'text-secondary'
                        }`}
                      >
                        {isWishlisted(pkg.slug) ? 'favorite' : 'bookmark'}
                      </span>
                    </button>

                    {/* Overlaid Destination & Duration */}
                    <div className="absolute bottom-3 left-3.5 right-12 text-on-primary">
                      <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-secondary-container mb-0.5">
                        <span className="capitalize">{pkg.destinationId}</span>
                        <span>•</span>
                        <span>{pkg.durationDays > 0 ? `${pkg.durationDays}D / ${pkg.durationNights}N` : 'Custom Duration'}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold leading-snug line-clamp-1">
                        <Link href={`/holidays/${pkg.slug}`}>{pkg.title}</Link>
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <p className="font-sans text-xs text-on-surface-variant mb-3 line-clamp-2 leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* 3 High-value inclusions as compact chips */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
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
                    </div>

                    {/* Price Hierarchy */}
                    <div className="pt-3 border-t border-surface-container-high flex items-baseline justify-between">
                      {hasPrice ? (
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-outline">From</span>
                            <span className="font-serif text-xl font-bold text-primary">
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

                      <Link
                        href={`/holidays/${pkg.slug}`}
                        className="text-secondary font-sans text-xs font-semibold hover:text-primary flex items-center gap-0.5"
                      >
                        <span>Itinerary</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </Link>
                    </div>

                    {/* Primary CTA: "Customize this package" */}
                    <button
                      type="button"
                      onClick={() =>
                        openQuoteModal({
                          packageTitle: pkg.title,
                          destination: pkg.destinationId,
                          packageId: pkg.id,
                          budgetRange: hasPrice ? formatPrice(pkg.startingPrice) : undefined,
                          travelStyle: pkg.style,
                          duration: pkg.durationDays > 0 ? `${pkg.durationDays}D / ${pkg.durationNights}N` : 'Custom Duration',
                          source: 'package_card',
                        })
                      }
                      className="w-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary py-2.5 px-4 rounded-full text-xs font-bold shadow-xs transition-all text-center cursor-pointer mt-auto"
                    >
                      Customize this package
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredPackages.length && (
            <div className="text-center pt-8">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 18)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-on-primary hover:bg-primary/90 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <span>Load More Curated Packages ({filteredPackages.length - visibleCount} remaining)</span>
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-24 text-center bg-surface-container-low rounded-3xl border border-surface-container-high">
          <span className="material-symbols-outlined text-5xl text-outline mb-3">travel_explore</span>
          <h3 className="text-2xl font-serif font-bold text-primary mb-2">
            No holiday blueprints match those criteria
          </h3>
          <p className="text-on-surface-variant text-sm mb-6 max-w-md mx-auto">
            Try adjusting your search terms, selecting &quot;All Travel Styles&quot;, or request a custom itinerary for any destination worldwide.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
