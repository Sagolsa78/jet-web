'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { UNIFIED_GUIDES } from '@/data/travel-guides-unified';
import { useQuoteModal } from '@/context/QuoteModalContext';

const CATEGORIES = ['All Guides', 'Family', 'Honeymoon', 'Offbeat', 'Planning Advice', 'Culture'];

const POPULAR_DESTINATIONS = [
  'All',
  'Bali',
  'Kashmir',
  'Maldives',
  'Dubai',
  'Thailand',
  'Vietnam',
  'Singapore',
  'Kerala',
  'Himachal',
  'Switzerland',
  'Ladakh',
  'Rajasthan',
];

export default function TravelGuidesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-36 text-center font-sans text-sm text-on-surface-variant">
          Loading travel guides &amp; field notes...
        </div>
      }
    >
      <TravelGuidesContent />
    </Suspense>
  );
}

function TravelGuidesContent() {
  const searchParams = useSearchParams();
  const { openQuoteModal } = useQuoteModal();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Guides');
  const [selectedDestination, setSelectedDestination] = useState(searchParams.get('destination') || 'All');
  const [visibleCount, setVisibleCount] = useState(12);

  // Filter guides
  const filteredGuides = useMemo(() => {
    return UNIFIED_GUIDES.filter((guide) => {
      // Category filter
      if (selectedCategory !== 'All Guides' && guide.category !== selectedCategory) {
        return false;
      }

      // Destination filter
      if (selectedDestination !== 'All') {
        const dest = guide.destination || '';
        const destSlug = guide.destinationSlug || '';
        const match =
          dest.toLowerCase().includes(selectedDestination.toLowerCase()) ||
          destSlug.toLowerCase().includes(selectedDestination.toLowerCase()) ||
          guide.title.toLowerCase().includes(selectedDestination.toLowerCase());
        if (!match) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = guide.title.toLowerCase().includes(query);
        const matchesSubtitle = guide.subtitle.toLowerCase().includes(query);
        const matchesTags = guide.tags.some((t) => t.toLowerCase().includes(query));
        const matchesDest = (guide.destination || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesSubtitle && !matchesTags && !matchesDest) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDestination]);

  const featuredGuide = UNIFIED_GUIDES[0];
  const isDefaultView = selectedCategory === 'All Guides' && selectedDestination === 'All' && !searchQuery.trim();

  // Paginated slice
  const displayedGuides = useMemo(() => {
    if (isDefaultView) {
      // Exclude featured from grid
      return filteredGuides.filter((g) => g.id !== featuredGuide.id).slice(0, visibleCount);
    }
    return filteredGuides.slice(0, visibleCount);
  }, [filteredGuides, isDefaultView, featuredGuide, visibleCount]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setVisibleCount(12);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setVisibleCount(12);
  };

  const handleDestinationChange = (dest: string) => {
    setSelectedDestination(dest);
    setVisibleCount(12);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface pt-28 pb-24">
      {/* ── 1. EDITORIAL HEADER & SEARCH ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-8 pb-10">
        <div className="max-w-3xl">
          <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.2em] block mb-2">
            Editorial Dispatches &amp; Field Notes ({UNIFIED_GUIDES.length} Curated Stories)
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-4 leading-tight">
            Stories &amp; Practical Travel Guides
          </h1>
          <p className="font-sans text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Unfiltered travel advice, pacing tips for multi-generational Indian families, dietary recommendations, and authentic field notes from our regional specialists across 25 destinations.
          </p>
        </div>

        {/* Search Bar & Destination Quick Chips */}
        <div className="mt-8 space-y-4">
          <div className="relative max-w-2xl">
            <span className="material-symbols-outlined text-secondary absolute left-4 top-3.5 text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Search by destination (e.g. Bali, Kashmir, Switzerland), food, or topic..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-outline-variant/40 bg-surface-container-low text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary shadow-xs text-on-surface"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3.5 top-3.5 text-outline hover:text-primary cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Quick Destination Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline shrink-0 mr-1">
              Destination:
            </span>
            {POPULAR_DESTINATIONS.map((dest) => {
              const isSelected = selectedDestination === dest;
              return (
                <button
                  key={dest}
                  type="button"
                  onClick={() => handleDestinationChange(dest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-secondary text-on-secondary shadow-xs'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {dest}
                </button>
              );
            })}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline shrink-0 mr-1">
              Category:
            </span>
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`font-sans text-xs font-semibold rounded-full px-4 py-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high border border-surface-container-high'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 2. FEATURED LEAD STORY (Default view only) ── */}
      {isDefaultView && (
        <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 mb-16">
          <article className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-surface-container-high grid grid-cols-1 lg:grid-cols-12 group">
            <div className="lg:col-span-7 relative min-h-[340px] lg:min-h-[460px] overflow-hidden">
              <Image
                src={featuredGuide.heroImage}
                alt={featuredGuide.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1 rounded-full bg-primary text-on-primary font-sans text-xs font-bold uppercase tracking-wider shadow-sm">
                  Featured Lead Story
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-secondary font-bold uppercase tracking-wider mb-2">
                  <span>{featuredGuide.category} Travel</span>
                  <span>•</span>
                  <span>{featuredGuide.readTime}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-3 leading-snug group-hover:text-secondary transition-colors">
                  <Link href={`/travel-guides/${featuredGuide.slug}`}>{featuredGuide.title}</Link>
                </h2>

                <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-6">
                  {featuredGuide.subtitle}
                </p>
              </div>

              <div className="pt-6 border-t border-surface-container-high flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container/40 text-secondary font-bold flex items-center justify-center text-sm">
                    {featuredGuide.author.name[0]}
                  </div>
                  <div>
                    <span className="block font-sans text-xs font-bold text-primary">
                      {featuredGuide.author.name}
                    </span>
                    <span className="block font-sans text-[11px] text-outline">
                      {featuredGuide.author.role}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/travel-guides/${featuredGuide.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-primary transition-colors"
                >
                  <span>Read Guide</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* ── 3. RESULTS STATUS & ARTICLES GRID ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-surface-container-high/60">
          <div>
            <h2 className="font-serif text-2xl font-bold text-primary">
              {searchQuery.trim()
                ? `Results for "${searchQuery}"`
                : selectedCategory === 'All Guides'
                ? selectedDestination === 'All'
                  ? 'All Dispatches & Field Notes'
                  : `${selectedDestination} Field Guides`
                : `${selectedCategory} Guides`}
            </h2>
            <span className="text-xs text-on-surface-variant mt-0.5 block">
              Showing {displayedGuides.length} of {filteredGuides.length} curated articles
            </span>
          </div>

          {(searchQuery || selectedCategory !== 'All Guides' || selectedDestination !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Guides');
                setSelectedDestination('All');
                setVisibleCount(12);
              }}
              className="text-xs font-bold text-secondary hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {displayedGuides.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-3xl border border-surface-container-high p-8">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">menu_book</span>
            <h3 className="font-serif text-xl font-bold text-primary mb-1">
              No articles found matching your criteria
            </h3>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto mb-6">
              Try adjusting your search terms, removing destination filters, or selecting &quot;All Guides&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Guides');
                setSelectedDestination('All');
              }}
              className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedGuides.map((guide) => (
              <article
                key={guide.id}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-surface-container-high flex flex-col group"
              >
                <div className="relative h-52 w-full overflow-hidden bg-surface-container">
                  <Image
                    src={guide.heroImage}
                    alt={guide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/90 text-on-primary font-sans text-[10px] font-bold uppercase tracking-wider">
                      {guide.category}
                    </span>
                    {guide.destination && (
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-primary font-sans text-[10px] font-bold">
                        {guide.destination}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-outline font-medium mb-1.5">
                      <span>{guide.readTime}</span>
                      <span>•</span>
                      <span>{guide.author.name}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-primary mb-2 group-hover:text-secondary transition-colors leading-snug line-clamp-2">
                      <Link href={`/travel-guides/${guide.slug}`}>{guide.title}</Link>
                    </h3>

                    <p className="font-sans text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                      {guide.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {guide.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-surface-container text-on-surface-variant text-[10px] font-medium px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-surface-container-high flex items-center justify-between mt-auto">
                    <Link
                      href={`/travel-guides/${guide.slug}`}
                      className="text-secondary font-sans text-xs font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Read Story</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        openQuoteModal({
                          destination: guide.destination || guide.tags[0] || 'International',
                          travelStyle: guide.category === 'Honeymoon' ? 'Honeymoon' : 'Family',
                          packageTitle: `Inspired by: ${guide.title}`,
                        })
                      }
                      className="text-[11px] font-bold text-on-tertiary-container hover:underline cursor-pointer"
                    >
                      Plan this journey
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ── 4. LOAD MORE DISPATCHES ── */}
        {displayedGuides.length < filteredGuides.length && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary font-sans text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <span>Load More Dispatches</span>
              <span className="text-[10px] text-outline font-normal">
                ({filteredGuides.length - displayedGuides.length} remaining)
              </span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
        )}
      </section>

      {/* ── 5. DISPATCH NEWSLETTER SECTION ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 mt-20">
        <div className="bg-primary-container text-on-primary rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl mx-auto">
            <span className="material-symbols-outlined text-3xl text-secondary-container mb-2">
              mail
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
              Seasonal Travel Dispatches in Your Inbox
            </h3>
            <p className="font-sans text-xs sm:text-sm text-surface-container-low/80 leading-relaxed mb-6">
              Receive genuine destination insights, visa timing updates, and offbeat routes curated exclusively by our Indian travel designers. No promotional spam.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2.5 rounded-full bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                type="button"
                className="px-6 py-2.5 rounded-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary font-sans text-xs font-bold transition-colors cursor-pointer"
              >
                Join Private Dispatch
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
