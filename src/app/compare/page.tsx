'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { SAMPLE_PACKAGES } from '@/data/sample-packages';
import { HolidayPackage } from '@/types';
import { useQuoteModal } from '@/context/QuoteModalContext';
import { useCurrency } from '@/context/CurrencyContext';

function CompareContent() {
  const searchParams = useSearchParams();
  const { openQuoteModal } = useQuoteModal();
  const { formatPrice } = useCurrency();

  // Get initial slugs from URL or default to first 2 packages
  const queryParam = searchParams.get('packages');
  const initialSlugs = queryParam
    ? queryParam.split(',').filter(Boolean)
    : ['swiss-alps-glacier-express', 'vietnam-halong-cruise'];

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    initialSlugs.length > 0 ? initialSlugs.slice(0, 3) : ['swiss-alps-glacier-express', 'vietnam-halong-cruise']
  );

  const selectedPackages = selectedSlugs
    .map((slug) => SAMPLE_PACKAGES.find((p) => p.slug === slug))
    .filter(Boolean) as HolidayPackage[];

  const handleSwapPackage = (index: number, newSlug: string) => {
    setSelectedSlugs((prev) => {
      const updated = [...prev];
      updated[index] = newSlug;
      return updated;
    });
  };

  const handleAddThirdColumn = () => {
    const remaining = SAMPLE_PACKAGES.find((p) => !selectedSlugs.includes(p.slug));
    if (remaining) {
      setSelectedSlugs((prev) => [...prev, remaining.slug]);
    }
  };

  const handleRemoveColumn = (index: number) => {
    if (selectedSlugs.length <= 2) return;
    setSelectedSlugs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background text-on-surface pt-24 pb-20">
      {/* ── BREADCRUMB & HEADER ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-8 mb-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-outline mb-4">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/holidays" className="hover:text-primary transition-colors">
            Holidays
          </Link>
          <span>/</span>
          <span className="text-secondary">Side-by-Side Comparator</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-secondary block mb-2">
              Decision Clarity
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-primary mb-2">
              Compare Holiday Blueprints
            </h1>
            <p className="font-sans text-sm text-on-surface-variant max-w-xl">
              Compare inclusions, pricing assumptions, and pacing side-by-side to find the right fit for your group.
            </p>
          </div>

          {selectedSlugs.length < 3 && (
            <button
              type="button"
              onClick={handleAddThirdColumn}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 text-xs font-bold transition-colors cursor-pointer self-start md:self-auto border border-secondary/30"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Add 3rd Package to Compare</span>
            </button>
          )}
        </div>
      </div>

      {/* ── COMPARISON MATRIX TABLE ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 overflow-x-auto pb-8">
        <div className="min-w-[760px] bg-surface-container-lowest rounded-3xl border border-surface-container-high/80 shadow-xs overflow-hidden">
          {/* Header Row: Package Selector & Photo */}
          <div className="grid grid-cols-12 border-b border-surface-container-high bg-surface-container-low/40">
            <div className="col-span-3 p-6 font-serif text-base font-bold text-primary flex items-center">
              Selected Package
            </div>
            {selectedPackages.map((pkg, idx) => (
              <div
                key={pkg.id}
                className={`${
                  selectedPackages.length === 2 ? 'col-span-4' : 'col-span-3'
                } p-6 border-l border-surface-container-high relative`}
              >
                {selectedPackages.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveColumn(idx)}
                    className="absolute top-3 right-3 text-outline hover:text-error transition-colors p-1"
                    title="Remove column"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                )}

                {/* Dropdown to swap */}
                <select
                  value={pkg.slug}
                  onChange={(e) => handleSwapPackage(idx, e.target.value)}
                  className="w-full text-xs font-bold text-primary bg-white border border-surface-container-high rounded-xl px-3 py-2 mb-3 cursor-pointer outline-none focus:border-secondary"
                >
                  {SAMPLE_PACKAGES.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.title} ({p.durationDays}D/{p.durationNights}N)
                    </option>
                  ))}
                </select>

                <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-3">
                  <Image
                    src={pkg.heroImage}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-secondary text-on-secondary px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {pkg.style}
                  </div>
                </div>

                <h3 className="font-serif text-lg font-bold text-primary leading-snug">
                  {pkg.title}
                </h3>
                <span className="text-xs text-on-surface-variant font-medium mt-0.5 block">
                  {pkg.durationDays} Days / {pkg.durationNights} Nights
                </span>
              </div>
            ))}
          </div>

          {/* Row 1: Starting Benchmark Price */}
          <div className="grid grid-cols-12 border-b border-surface-container-high hover:bg-surface-container-low/20 transition-colors">
            <div className="col-span-3 p-5 font-sans text-xs font-bold uppercase tracking-wider text-outline flex items-center">
              Indicative Benchmark
            </div>
            {selectedPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`${
                  selectedPackages.length === 2 ? 'col-span-4' : 'col-span-3'
                } p-5 border-l border-surface-container-high`}
              >
                <div className="font-serif text-2xl font-bold text-primary">
                  {formatPrice(pkg.startingPrice)}
                </div>
                <span className="text-[11px] text-on-surface-variant">
                  per adult on twin sharing basis
                </span>
              </div>
            ))}
          </div>

          {/* Row 2: Accommodation Tier */}
          <div className="grid grid-cols-12 border-b border-surface-container-high hover:bg-surface-container-low/20 transition-colors">
            <div className="col-span-3 p-5 font-sans text-xs font-bold uppercase tracking-wider text-outline flex items-center">
              Accommodation Style
            </div>
            {selectedPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`${
                  selectedPackages.length === 2 ? 'col-span-4' : 'col-span-3'
                } p-5 border-l border-surface-container-high text-xs text-on-surface-variant leading-relaxed`}
              >
                <div className="font-semibold text-primary mb-1">
                  {pkg.slug.includes('maldives')
                    ? '5★ Overwater Villa with Private Pool'
                    : pkg.slug.includes('kashmir')
                    ? 'Carved Dal Lake Houseboat & Mountain Resort'
                    : pkg.slug.includes('kerala')
                    ? 'Private Alleppey Houseboat & Tea Estate Lodges'
                    : 'Handpicked 4★ Boutique & Heritage Hotels'}
                </div>
                <span>Central locations with hygienic verified breakfast.</span>
              </div>
            ))}
          </div>

          {/* Row 3: Dedicated Transport */}
          <div className="grid grid-cols-12 border-b border-surface-container-high hover:bg-surface-container-low/20 transition-colors">
            <div className="col-span-3 p-5 font-sans text-xs font-bold uppercase tracking-wider text-outline flex items-center">
              On-Ground Transit
            </div>
            {selectedPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`${
                  selectedPackages.length === 2 ? 'col-span-4' : 'col-span-3'
                } p-5 border-l border-surface-container-high text-xs text-on-surface-variant`}
              >
                {pkg.slug.includes('swiss') ? (
                  <div>
                    <span className="font-semibold text-primary block mb-0.5">Swiss Travel Pass (1st Class)</span>
                    <span>Unlimited trains, alpine cogwheels &amp; lake steamers.</span>
                  </div>
                ) : pkg.slug.includes('maldives') ? (
                  <div>
                    <span className="font-semibold text-primary block mb-0.5">Scenic Seaplane / Speedboat</span>
                    <span>Roundtrip scenic aerial transfer directly to resort island.</span>
                  </div>
                ) : (
                  <div>
                    <span className="font-semibold text-primary block mb-0.5">Dedicated Private AC Vehicle</span>
                    <span>Private Innova/Sedan with trusted local tourist driver for all legs.</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Row 4: Confirmed Inclusions */}
          <div className="grid grid-cols-12 border-b border-surface-container-high hover:bg-surface-container-low/20 transition-colors">
            <div className="col-span-3 p-5 font-sans text-xs font-bold uppercase tracking-wider text-outline flex items-start">
              Confirmed Inclusions
            </div>
            {selectedPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`${
                  selectedPackages.length === 2 ? 'col-span-4' : 'col-span-3'
                } p-5 border-l border-surface-container-high space-y-2`}
              >
                {pkg.inclusions.map((item) => (
                  <div key={item} className="flex items-start gap-1.5 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[13px] text-teal-600 mt-0.5 shrink-0">check</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Row 5: Exclusions & Price Basis */}
          <div className="grid grid-cols-12 border-b border-surface-container-high hover:bg-surface-container-low/20 transition-colors">
            <div className="col-span-3 p-5 font-sans text-xs font-bold uppercase tracking-wider text-outline flex items-start">
              Payable Separately
            </div>
            {selectedPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`${
                  selectedPackages.length === 2 ? 'col-span-4' : 'col-span-3'
                } p-5 border-l border-surface-container-high space-y-1.5 text-xs text-on-surface-variant`}
              >
                {pkg.exclusions.map((item) => (
                  <div key={item} className="flex items-start gap-1.5 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[13px] text-rose-500 mt-0.5 shrink-0">close</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Row 6: CTAs */}
          <div className="grid grid-cols-12 bg-surface-container-low/30 p-4">
            <div className="col-span-3 p-5 flex items-center text-xs font-bold text-outline">
              Take Next Step
            </div>
            {selectedPackages.map((pkg) => {
              const formattedPrice = formatPrice(pkg.startingPrice);

              return (
                <div
                  key={pkg.id}
                  className={`${
                    selectedPackages.length === 2 ? 'col-span-4' : 'col-span-3'
                  } p-5 border-l border-surface-container-high space-y-2.5`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      openQuoteModal({
                        packageTitle: pkg.title,
                        destination: pkg.title,
                        budgetRange: formattedPrice,
                        travelStyle: pkg.style,
                        duration: `${pkg.durationDays}D / ${pkg.durationNights}N`,
                        notes: `Enquired from Side-by-Side Comparator. Shortlisted alongside other options.`,
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Request Custom Quote</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>

                  <Link
                    href={`/holidays/${pkg.slug}`}
                    className="w-full inline-flex items-center justify-center gap-1 py-2 px-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary text-xs font-semibold transition-colors block text-center"
                  >
                    View Day Timeline
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-xs text-outline">Loading comparator...</div>}>
      <CompareContent />
    </Suspense>
  );
}
