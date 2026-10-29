'use client';

import React, { useState, useMemo } from 'react';
import { HolidayPackage, ItineraryDay } from '@/types';
import { useQuoteModal } from '@/context/QuoteModalContext';

interface HotelTier {
  id: string;
  name: string;
  badge: string;
  description: string;
  deltaPrice: number;
}

const HOTEL_TIERS: HotelTier[] = [
  {
    id: 'boutique-4star',
    name: 'Curated 4★ Boutique & Heritage',
    badge: 'Included in Benchmark',
    description: 'Central location, verified hygienic breakfast, authentic local architecture, and modern air-conditioning.',
    deltaPrice: 0,
  },
  {
    id: 'luxury-5star',
    name: 'Premium 5★ Luxury Resorts',
    badge: '+ ₹7,500 / person',
    description: 'Balcony or lagoon views, multiple on-site gourmet restaurants, infinity pool, and luxury spa access.',
    deltaPrice: 7500,
  },
  {
    id: 'ultra-villa',
    name: 'Ultra-Luxe Private Pool Villas',
    badge: '+ ₹16,500 / person',
    description: 'Secluded private pool, dedicated 24/7 personal butler service, premium sunset orientation, and club lounge privileges.',
    deltaPrice: 16500,
  },
];

interface PaceMode {
  id: string;
  name: string;
  subtitle: string;
  deltaPrice: number;
}

const PACE_MODES: PaceMode[] = [
  {
    id: 'balanced',
    name: 'Balanced Discovery',
    subtitle: 'Morning excursions, relaxing free afternoons',
    deltaPrice: 0,
  },
  {
    id: 'relaxed',
    name: 'Slow & Leisure',
    subtitle: 'Late starts, relaxed dining & private spa time',
    deltaPrice: 0,
  },
  {
    id: 'adventure',
    name: 'Active & Intensive',
    subtitle: 'Added sunset cruises & guided artisan masterclasses',
    deltaPrice: 2200,
  },
];

interface InteractiveItineraryCustomizerProps {
  pkg: HolidayPackage;
  destinationName?: string;
}

export function InteractiveItineraryCustomizer({
  pkg,
  destinationName,
}: InteractiveItineraryCustomizerProps) {
  const { openQuoteModal } = useQuoteModal();

  const [selectedHotelTier, setSelectedHotelTier] = useState<string>('boutique-4star');
  const [selectedPace, setSelectedPace] = useState<string>('balanced');
  // dayCustomizations: key = dayNumber, value = 'standard' | 'exclusive' | 'leisure'
  const [dayChoices, setDayChoices] = useState<Record<number, 'standard' | 'exclusive' | 'leisure'>>({});

  const basePrice = pkg.startingPrice || 50000;

  // Calculate price dynamically
  const { totalPrice, priceDelta, selectedTierObj, selectedPaceObj, dayTweaksCount } = useMemo(() => {
    const tier = HOTEL_TIERS.find((t) => t.id === selectedHotelTier) || HOTEL_TIERS[0];
    const pace = PACE_MODES.find((p) => p.id === selectedPace) || PACE_MODES[0];

    let dayDelta = 0;
    let tweaksCount = 0;
    Object.entries(dayChoices).forEach(([, choice]) => {
      if (choice === 'exclusive') {
        dayDelta += 1800;
        tweaksCount += 1;
      } else if (choice === 'leisure') {
        dayDelta -= 400; // slight deduction for skipping guided excursions
        tweaksCount += 1;
      }
    });

    const delta = tier.deltaPrice + pace.deltaPrice + dayDelta;
    const total = Math.max(basePrice, basePrice + delta);

    return {
      totalPrice: total,
      priceDelta: delta,
      selectedTierObj: tier,
      selectedPaceObj: pace,
      dayTweaksCount: tweaksCount,
    };
  }, [selectedHotelTier, selectedPace, dayChoices, basePrice]);

  const handleDayChoiceChange = (dayNumber: number, choice: 'standard' | 'exclusive' | 'leisure') => {
    setDayChoices((prev) => {
      if (choice === 'standard') {
        const next = { ...prev };
        delete next[dayNumber];
        return next;
      }
      return { ...prev, [dayNumber]: choice };
    });
  };

  const resetCustomizer = () => {
    setSelectedHotelTier('boutique-4star');
    setSelectedPace('balanced');
    setDayChoices({});
  };

  const handleOpenConsultantModal = () => {
    const tweaksSummary = Object.entries(dayChoices)
      .map(([day, choice]) => {
        if (choice === 'exclusive') return `Day ${day}: Upgraded with Exclusive Private Excursion`;
        if (choice === 'leisure') return `Day ${day}: Set as Free Leisure / Personal Pace`;
        return null;
      })
      .filter(Boolean)
      .join('; ');

    const notes = [
      `Selected Hotel Tier: ${selectedTierObj.name}`,
      `Pacing Preference: ${selectedPaceObj.name}`,
      tweaksSummary ? `Day-by-Day Tweaks: ${tweaksSummary}` : 'Standard day timeline maintained',
      `Calculated Benchmark Budget: ₹${totalPrice.toLocaleString('en-IN')} / person`,
    ].join('\n');

    openQuoteModal({
      packageTitle: `${pkg.title} (Customized)`,
      destination: destinationName || pkg.title,
      budgetRange: `₹${totalPrice.toLocaleString('en-IN')} / person`,
      travelStyle: pkg.style,
      duration: `${pkg.durationDays}D / ${pkg.durationNights}N`,
      notes,
    });
  };

  return (
    <div className="space-y-12">
      {/* ── CUSTOMIZATION CONTROL PANELS ── */}
      <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-surface-container-high/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-surface-container-high">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-secondary text-xl">tune</span>
              <span className="font-sans text-xs font-bold text-secondary uppercase tracking-widest">
                Interactive Itinerary Scrubber
              </span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-primary">
              Personalise Stays &amp; Daily Pacing
            </h3>
            <p className="font-sans text-xs text-on-surface-variant mt-1">
              Tweak your accommodation tier and day activities. The benchmark price updates transparently in real time.
            </p>
          </div>

          {(selectedHotelTier !== 'boutique-4star' || selectedPace !== 'balanced' || dayTweaksCount > 0) && (
            <button
              type="button"
              onClick={resetCustomizer}
              className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-secondary font-semibold underline underline-offset-4 cursor-pointer self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              <span>Reset to Standard</span>
            </button>
          )}
        </div>

        {/* Provenance Disclosure for Crawled Itineraries */}
        {pkg.itineraryType === 'suggested_draft' && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-950">
            <span className="material-symbols-outlined text-amber-700 text-lg shrink-0 mt-0.5">edit_calendar</span>
            <div>
              <strong className="font-semibold block mb-0.5 text-amber-900">Suggested Itinerary Blueprint</strong>
              <span>
                This day-by-day outline is an indicative planning route. Specific inclusions, hotel properties, and private transfers are fully customized with your dedicated Jeto consultant before confirmation.
              </span>
            </div>
          </div>
        )}

        {/* 1. Hotel Style Selector */}
        <div className="mb-8">
          <label className="font-sans text-xs font-bold uppercase tracking-wider text-outline block mb-3">
            1. Select Accommodation Standard
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {HOTEL_TIERS.map((tier) => {
              const isSelected = selectedHotelTier === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedHotelTier(tier.id)}
                  className={`relative p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-secondary/5 border-secondary shadow-sm ring-2 ring-secondary/20'
                      : 'bg-surface-container-low/60 border-surface-container-high hover:border-secondary/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-serif text-base font-bold text-primary">
                      {tier.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isSelected
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {tier.badge}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    {tier.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Pacing & Travel Rhythm */}
        <div>
          <label className="font-sans text-xs font-bold uppercase tracking-wider text-outline block mb-3">
            2. Travel Rhythm &amp; Pacing
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {PACE_MODES.map((pace) => {
              const isSelected = selectedPace === pace.id;
              return (
                <div
                  key={pace.id}
                  onClick={() => setSelectedPace(pace.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-secondary/5 border-secondary shadow-xs ring-1 ring-secondary/30'
                      : 'bg-surface-container-low/60 border-surface-container-high hover:border-secondary/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-sans text-sm font-bold text-primary">{pace.name}</span>
                    {pace.deltaPrice > 0 && (
                      <span className="text-[10px] font-bold text-secondary">
                        + ₹{pace.deltaPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant">{pace.subtitle}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DAY-BY-DAY TIMELINE WITH CUSTOM TWEAK CARDS ── */}
      <section>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.2em] block mb-1">
              Customisable Timeline
            </span>
            <h2 className="font-serif text-3xl font-bold text-primary">
              Day-by-Day Itinerary Blueprint
            </h2>
            <p className="font-sans text-xs text-on-surface-variant mt-1">
              Click &quot;Customize Day Focus&quot; on any day below to swap activities or reserve free leisure time.
            </p>
          </div>
          <div className="text-xs text-outline font-medium">
            {pkg.durationDays} Days / {pkg.durationNights} Nights • All private transfers
          </div>
        </div>

        {/* Timeline Continuous Spine */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-surface-container-high before:hidden sm:before:block">
          {pkg.itinerary.map((day: ItineraryDay) => {
            const currentChoice = dayChoices[day.dayNumber] || 'standard';

            return (
              <div key={day.dayNumber} className="relative flex items-start gap-6">
                {/* Number Node */}
                <div
                  className={`hidden sm:flex w-10 h-10 rounded-full items-center justify-center font-serif font-bold text-base shadow-xs shrink-0 z-10 border-2 ${
                    currentChoice !== 'standard'
                      ? 'bg-secondary text-on-secondary border-surface-container-lowest ring-2 ring-secondary/30'
                      : 'bg-primary text-secondary-container border-surface-container-lowest'
                  }`}
                >
                  {day.dayNumber}
                </div>

                {/* Day Content Card */}
                <div className="flex-1 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high/80 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-secondary font-sans text-xs font-bold uppercase tracking-wider sm:hidden">
                      Day {day.dayNumber}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-primary">
                      {day.title}
                    </h3>

                    {currentChoice !== 'standard' && (
                      <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-xs">auto_awesome</span>
                        <span>Customised</span>
                      </span>
                    )}
                  </div>

                  <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-4">
                    {day.description}
                  </p>

                  {/* Standard Activities Chips */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-surface-container-high/60 mb-5">
                    {day.activities.map((act) => (
                      <span
                        key={act}
                        className="inline-flex items-center gap-1 bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full text-xs font-medium"
                      >
                        <span className="material-symbols-outlined text-[13px] text-secondary">check</span>
                        <span>{act}</span>
                      </span>
                    ))}
                  </div>

                  {/* Day Tweaker Sub-card */}
                  <div className="bg-surface-container-low/70 p-3.5 rounded-xl border border-surface-container-high">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-outline block mb-2">
                      Customise Day {day.dayNumber} Focus:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* Standard */}
                      <button
                        type="button"
                        onClick={() => handleDayChoiceChange(day.dayNumber, 'standard')}
                        className={`px-3 py-2 rounded-lg text-left text-xs font-medium transition-all cursor-pointer ${
                          currentChoice === 'standard'
                            ? 'bg-white shadow-xs text-primary font-bold border border-secondary/40'
                            : 'text-on-surface-variant hover:bg-white/60'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs text-secondary">
                            {currentChoice === 'standard' ? 'radio_button_checked' : 'radio_button_unchecked'}
                          </span>
                          <span>Default Route</span>
                        </div>
                      </button>

                      {/* Leisure */}
                      <button
                        type="button"
                        onClick={() => handleDayChoiceChange(day.dayNumber, 'leisure')}
                        className={`px-3 py-2 rounded-lg text-left text-xs font-medium transition-all cursor-pointer ${
                          currentChoice === 'leisure'
                            ? 'bg-white shadow-xs text-primary font-bold border border-secondary/40'
                            : 'text-on-surface-variant hover:bg-white/60'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs text-secondary">
                            {currentChoice === 'leisure' ? 'radio_button_checked' : 'radio_button_unchecked'}
                          </span>
                          <span>Free Leisure Pace</span>
                        </div>
                      </button>

                      {/* Exclusive Excursion */}
                      <button
                        type="button"
                        onClick={() => handleDayChoiceChange(day.dayNumber, 'exclusive')}
                        className={`px-3 py-2 rounded-lg text-left text-xs font-medium transition-all cursor-pointer ${
                          currentChoice === 'exclusive'
                            ? 'bg-white shadow-xs text-primary font-bold border border-secondary/40'
                            : 'text-on-surface-variant hover:bg-white/60'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs text-secondary">
                            {currentChoice === 'exclusive' ? 'radio_button_checked' : 'radio_button_unchecked'}
                          </span>
                          <span>Private Excursion (+₹1.8k)</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FLOATING / STICKY CUSTOMIZED ITINERARY DOCK ── */}
      <aside className="sticky bottom-4 z-40 bg-primary text-on-primary p-4 sm:p-5 rounded-2xl shadow-2xl border border-primary-container/80 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-11 h-11 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0">
            <span className="material-symbols-outlined text-2xl">auto_fix_high</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-secondary-container">
                Custom Blueprint:
              </span>
              <span className="text-xs font-medium text-surface-container-low">
                {selectedTierObj.name}
              </span>
              {dayTweaksCount > 0 && (
                <span className="bg-on-tertiary-container text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {dayTweaksCount} day adjustments
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-serif text-2xl font-bold text-on-primary">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-surface-container-low/80">/ person*</span>
              {priceDelta !== 0 && (
                <span className="text-xs font-semibold text-secondary-container">
                  ({priceDelta > 0 ? `+₹${priceDelta.toLocaleString('en-IN')}` : `-₹${Math.abs(priceDelta).toLocaleString('en-IN')}`})
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={handleOpenConsultantModal}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary px-6 py-3 rounded-xl font-sans text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <span>Send Custom Route to Consultant</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
