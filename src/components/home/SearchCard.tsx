'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DESTINATIONS } from '@/data/destinations';
import { UNIFIED_PACKAGES } from '@/data/packages-unified';
import { TRAVEL_GUIDES } from '@/data/travel-guides';
import { useCurrency } from '@/context/CurrencyContext';

const SEARCH_TABS = [
  { label: 'Browse 430+ trips', href: '/holidays', icon: 'travel_explore' },
  { label: 'Multi-City Route Planner', href: '/multi-city', icon: 'route' },
  { label: 'Help Me Choose Quiz', href: '/help-me-choose', icon: 'psychology' },
  { label: 'Honeymoon', href: '/holidays?style=Honeymoon', icon: 'favorite' },
  { label: 'Family', href: '/holidays?style=Family', icon: 'family_restroom' },
];

const TRENDING_SEARCHES = ['Bali', 'Switzerland', 'Kashmir', 'Maldives', 'Dubai', 'Vietnam', 'Andaman', 'Kerala'];

export function SearchCard() {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [destinationQuery, setDestinationQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matching destinations, packages, and guides
  const autocompleteResults = useMemo(() => {
    const q = destinationQuery.trim().toLowerCase();
    if (!q) return { destinations: [], packages: [], guides: [] };

    const matchedDests = DESTINATIONS.filter(
      (d) => d.name.toLowerCase().includes(q) || d.region.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedPkgs = UNIFIED_PACKAGES.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.destinationId.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedGuides = TRAVEL_GUIDES.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.subtitle.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 2);

    return {
      destinations: matchedDests,
      packages: matchedPkgs,
      guides: matchedGuides,
    };
  }, [destinationQuery]);

  const allItems = useMemo(() => {
    const items: Array<{ type: 'dest' | 'pkg' | 'guide'; url: string; label: string }> = [];
    autocompleteResults.destinations.forEach((d) =>
      items.push({ type: 'dest', url: `/destinations/${d.slug}`, label: d.name })
    );
    autocompleteResults.packages.forEach((p) =>
      items.push({ type: 'pkg', url: `/holidays/${p.slug}`, label: p.title })
    );
    autocompleteResults.guides.forEach((g) =>
      items.push({ type: 'guide', url: `/travel-guides/${g.slug}`, label: g.title })
    );
    return items;
  }, [autocompleteResults]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < allItems.length) {
        e.preventDefault();
        router.push(allItems[selectedIndex].url);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectTrending = (dest: string) => {
    setDestinationQuery(dest);
    setIsOpen(false);
    router.push(`/holidays?q=${encodeURIComponent(dest)}`);
  };

  return (
    <section
      aria-label="Find a verified holiday"
      className="relative z-30 mx-auto -mt-16 mb-20 w-full max-w-6xl px-4 sm:px-6"
    >
      <div className="rounded-3xl border border-surface-container-high/80 bg-surface-container-lowest p-6 shadow-[0_24px_60px_rgba(11,35,63,0.14)] sm:p-8">
        {/* Navigation Tabs */}
        <nav aria-label="Trip planning options" className="overflow-x-auto border-b border-surface-container-high">
          <ul className="flex min-w-max items-center gap-4 text-sm font-semibold sm:gap-8">
            {SEARCH_TABS.map((tab, index) => (
              <li key={tab.label}>
                <Link
                  href={tab.href}
                  className={`flex items-center gap-2 border-b-2 px-1 pb-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
                    index === 0
                      ? 'border-secondary text-primary'
                      : 'border-transparent text-on-surface-variant hover:border-outline-variant hover:text-primary'
                  }`}
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-lg text-secondary">
                    {tab.icon}
                  </span>
                  {tab.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Form Container */}
        <form
          action="/holidays"
          method="get"
          className="grid grid-cols-1 items-end gap-3.5 pt-6 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
        >
          {/* Destination Field with Live Autocomplete */}
          <div ref={containerRef} className="relative">
            <label
              htmlFor="trip-destination"
              className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant"
            >
              Where do you want to go?
            </label>
            <div className="flex items-center rounded-xl border border-outline-variant/40 bg-surface-container-low px-3.5 py-3 transition-colors focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20">
              <span aria-hidden="true" className="material-symbols-outlined mr-2 text-lg text-secondary">
                location_on
              </span>
              <input
                id="trip-destination"
                name="q"
                type="search"
                autoComplete="off"
                value={destinationQuery}
                onFocus={() => setIsOpen(true)}
                onChange={(e) => {
                  setDestinationQuery(e.target.value);
                  setIsOpen(true);
                  setSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search Bali, Switzerland, Kashmir, Dubai..."
                className="w-full bg-transparent text-sm font-medium text-on-surface placeholder:text-outline focus:outline-none"
              />
              {destinationQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setDestinationQuery('');
                    setSelectedIndex(-1);
                  }}
                  className="text-outline hover:text-primary"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            {/* ── LIVE AUTOCOMPLETE OVERLAY ── */}
            {isOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-2xl z-50 overflow-hidden animate-fade-in max-h-[420px] overflow-y-auto">
                {destinationQuery.trim() ? (
                  <div>
                    {/* Destinations section */}
                    {autocompleteResults.destinations.length > 0 && (
                      <div className="p-3 border-b border-surface-container-high">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-outline px-2 block mb-1.5">
                          Destinations ({autocompleteResults.destinations.length})
                        </span>
                        {autocompleteResults.destinations.map((dest) => (
                          <Link
                            key={dest.slug}
                            href={`/destinations/${dest.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="material-symbols-outlined text-secondary text-base">pin_drop</span>
                              <span className="font-serif text-sm font-bold text-primary">{dest.name}</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                              Explore Spotlight
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Packages section */}
                    {autocompleteResults.packages.length > 0 && (
                      <div className="p-3 border-b border-surface-container-high">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-outline px-2 block mb-1.5">
                          Matching Holiday Blueprints ({autocompleteResults.packages.length})
                        </span>
                        {autocompleteResults.packages.map((pkg) => (
                          <Link
                            key={pkg.id}
                            href={`/holidays/${pkg.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-low transition-colors"
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface-container">
                              <Image src={pkg.heroImage} alt={pkg.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif text-xs font-bold text-primary truncate">{pkg.title}</h4>
                              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant mt-0.5">
                                <span>{pkg.durationDays > 0 ? `${pkg.durationDays}D / ${pkg.durationNights}N` : 'Custom Duration'}</span>
                                <span>•</span>
                                <span className="font-bold text-secondary">
                                  {formatPrice(pkg.startingPrice)}
                                </span>
                              </div>
                            </div>
                            <span className="material-symbols-outlined text-outline text-sm">arrow_forward</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Guides section */}
                    {autocompleteResults.guides.length > 0 && (
                      <div className="p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-outline px-2 block mb-1.5">
                          Editorial Travel Guides
                        </span>
                        {autocompleteResults.guides.map((guide) => (
                          <Link
                            key={guide.slug}
                            href={`/travel-guides/${guide.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 p-2 rounded-xl hover:bg-surface-container-low transition-colors text-xs text-primary font-medium"
                          >
                            <span className="material-symbols-outlined text-secondary text-sm">article</span>
                            <span className="truncate">{guide.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {autocompleteResults.destinations.length === 0 &&
                      autocompleteResults.packages.length === 0 &&
                      autocompleteResults.guides.length === 0 && (
                        <div className="p-6 text-center text-xs text-on-surface-variant">
                          <span>No direct match for &quot;{destinationQuery}&quot;. Press &quot;Find trips&quot; to search all 430+ packages.</span>
                        </div>
                      )}
                  </div>
                ) : (
                  /* Default Trending Suggestions */
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-outline block mb-2 px-1">
                      Trending Destinations This Season:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {TRENDING_SEARCHES.map((dest) => (
                        <button
                          key={dest}
                          type="button"
                          onClick={() => handleSelectTrending(dest)}
                          className="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-secondary hover:text-white text-xs font-semibold text-primary transition-all cursor-pointer"
                        >
                          {dest}
                        </button>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-surface-container-high flex justify-between text-xs text-outline px-1">
                      <span>Type to search 430+ verified itineraries</span>
                      <Link href="/help-me-choose" className="text-secondary font-bold hover:underline">
                        Need guidance? Take quiz
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Month of travel */}
          <div>
            <label
              htmlFor="trip-month"
              className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant"
            >
              When?
            </label>
            <select
              id="trip-month"
              name="month"
              defaultValue="All"
              className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3.5 py-3 text-sm font-medium text-on-surface focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer"
            >
              <option value="All">Any month</option>
              <option value="April-May">Apr – May (Summer Break)</option>
              <option value="June-July">Jun – Jul (Europe &amp; Bali)</option>
              <option value="Aug-Oct">Aug – Oct (Autumn / Wildlife)</option>
              <option value="Diwali-Winter">Nov – Jan (Diwali &amp; Winter)</option>
            </select>
          </div>

          {/* 3. Travellers */}
          <div>
            <label
              htmlFor="trip-travellers"
              className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant"
            >
              Travellers
            </label>
            <select
              id="trip-travellers"
              name="travellers"
              defaultValue="2"
              className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3.5 py-3 text-sm font-medium text-on-surface focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer"
            >
              <option value="2">2 Adults (Couple)</option>
              <option value="family">Family (2 Adults + Kids)</option>
              <option value="1">1 Adult (Solo)</option>
              <option value="group">Group (4+ Adults)</option>
            </select>
          </div>

          {/* 4. Budget per person */}
          <div>
            <label
              htmlFor="trip-budget"
              className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant"
            >
              Budget per person
            </label>
            <select
              id="trip-budget"
              name="budget"
              defaultValue="All"
              className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low px-3.5 py-3 text-sm font-medium text-on-surface focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer"
            >
              <option value="All">Any budget</option>
              <option value="under-25k">Under ₹25,000</option>
              <option value="25k-50k">₹25,000 – ₹50,000</option>
              <option value="50k-120k">₹50,000 – ₹1.2 Lakh</option>
              <option value="above-120k">Luxury (₹1.2L+)</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-on-tertiary-container px-6 text-sm font-bold text-on-primary shadow-sm transition-colors hover:bg-tertiary-fixed-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary cursor-pointer"
          >
            <span>Find trips</span>
            <span aria-hidden="true" className="material-symbols-outlined text-base">
              search
            </span>
          </button>
        </form>

        {/* Quick Suggestion Chips Footer */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-surface-container-high/60 pt-5 text-xs">
          <span className="mr-1 font-semibold uppercase tracking-wider text-outline">Popular searches:</span>
          {['Bali', 'Switzerland', 'Vietnam', 'Kashmir', 'Dubai'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleSelectTrending(item)}
              className="rounded-full bg-surface-container px-3 py-1.5 font-medium text-on-surface-variant transition-colors hover:bg-secondary hover:text-white cursor-pointer"
            >
              {item}
            </button>
          ))}
          <Link
            href="/help-me-choose"
            className="ml-auto inline-flex items-center gap-1 font-semibold text-secondary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          >
            Unsure where to start? 60s Matchmaker Quiz
            <span aria-hidden="true" className="material-symbols-outlined text-xs">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Reassuring Trust Note */}
        <p className="mt-3 text-xs text-on-surface-variant flex items-center gap-1.5">
          <span className="material-symbols-outlined text-secondary text-sm">verified</span>
          <span>430+ verified holiday itineraries with transparent pricing assumptions. Finalized 1-on-1 with human destination consultants.</span>
        </p>
      </div>
    </section>
  );
}
