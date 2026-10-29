'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { MULTI_CITY_ROUTES } from '@/data/multi-city-routes';
import { useCurrency } from '@/context/CurrencyContext';
import { useQuoteModal } from '@/context/QuoteModalContext';
import { SITE_CONTACT } from '@/data/site-content';

export default function MultiCityPage() {
  const { formatPrice } = useCurrency();
  const { openQuoteModal } = useQuoteModal();

  const [selectedRouteId, setSelectedRouteId] = useState<string>(MULTI_CITY_ROUTES[0].id);
  const activeRoute = useMemo(
    () => MULTI_CITY_ROUTES.find((r) => r.id === selectedRouteId) || MULTI_CITY_ROUTES[0],
    [selectedRouteId]
  );

  // State for customized nights per stop
  const [stopNights, setStopNights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    MULTI_CITY_ROUTES.forEach((route) => {
      route.stops.forEach((stop) => {
        initial[`${route.id}-${stop.city}`] = stop.defaultNights;
      });
    });
    return initial;
  });

  const [hotelTier, setHotelTier] = useState<'4star' | '5star'>('4star');
  const [includeFlights, setIncludeFlights] = useState<boolean>(true);

  const getStopNights = useCallback(
    (routeId: string, city: string, def: number) => {
      return stopNights[`${routeId}-${city}`] ?? def;
    },
    [stopNights]
  );

  const handleUpdateNights = (city: string, delta: number, min: number, max: number) => {
    const key = `${activeRoute.id}-${city}`;
    const current = stopNights[key] ?? min;
    const updated = Math.min(max, Math.max(min, current + delta));
    setStopNights((prev) => ({ ...prev, [key]: updated }));
  };

  // Calculate total nights
  const totalNights = useMemo(() => {
    return activeRoute.stops.reduce((acc, stop) => {
      return acc + getStopNights(activeRoute.id, stop.city, stop.defaultNights);
    }, 0);
  }, [activeRoute, getStopNights]);

  const defaultTotalNights = useMemo(() => {
    return activeRoute.stops.reduce((acc, s) => acc + s.defaultNights, 0);
  }, [activeRoute]);

  // Price calculations
  const nightDelta = totalNights - defaultTotalNights;
  const extraNightCost = nightDelta * 7500; // ~₹7,500 per extra night land package benchmark
  const hotelTierMultiplier = hotelTier === '5star' ? 16500 : 0;
  const estimatedFlightCost = includeFlights
    ? Math.round((activeRoute.flightEstimateFromIndia.min + activeRoute.flightEstimateFromIndia.max) / 2)
    : 0;

  const totalCalculatedBenchmark = Math.max(
    30000,
    activeRoute.baseBenchmarkPrice + extraNightCost + hotelTierMultiplier + estimatedFlightCost
  );

  const nightsBreakdownString = activeRoute.stops
    .map((s) => `${getStopNights(activeRoute.id, s.city, s.defaultNights)}N ${s.city}`)
    .join(' + ');

  const handleRequestQuote = () => {
    const notes = [
      `Multi-City Route: ${activeRoute.title}`,
      `Split: ${nightsBreakdownString} (${totalNights} Nights / ${totalNights + 1} Days)`,
      `Accommodations: ${hotelTier === '5star' ? '5★ Luxury & Pool Villas' : '4★ Handpicked Boutique'}`,
      `Inter-city Transit: ${activeRoute.interCityTransit.description} (${activeRoute.interCityTransit.mode})`,
      `Flights Included in Quote: ${includeFlights ? 'Yes (Ex-India estimate included)' : 'No (Land package only)'}`,
      `Calculated Benchmark Budget: ${formatPrice(totalCalculatedBenchmark)} / person`,
    ].join('\n');

    openQuoteModal({
      packageTitle: `${activeRoute.title} (${nightsBreakdownString})`,
      destination: activeRoute.region,
      budgetRange: `${formatPrice(totalCalculatedBenchmark)} / person`,
      duration: `${totalNights + 1} Days / ${totalNights} Nights`,
      travelStyle: hotelTier === '5star' ? 'Luxury' : 'Boutique',
      notes,
    });
  };

  const handleGenerateProposal = () => {
    openQuoteModal({
      destination: activeRoute.title,
      packageTitle: `${activeRoute.title} (${nightsBreakdownString})`,
      budgetRange: `${formatPrice(totalCalculatedBenchmark)} / person`,
      travelStyle: hotelTier === '5star' ? '5★ Luxury & Private Villas' : '4★ Handpicked Boutique',
      duration: `${totalNights} Nights`,
      notes: `Custom Multi-City Split: ${nightsBreakdownString} (${totalNights} Nights). Inter-city Transit: ${activeRoute.interCityTransit.description}.`,
      source: 'package_detail',
    });
  };

  const handleWhatsAppChat = () => {
    const text = `Hi Jeto Vacations! I'm planning a custom Multi-City Holiday:
📍 *Route:* ${activeRoute.title}
⏱️ *Night Split:* ${nightsBreakdownString} (${totalNights + 1} Days)
🏨 *Tier:* ${hotelTier === '5star' ? '5★ Luxury & Pool Villas' : '4★ Handpicked Boutique'}
✈️ *Inter-City:* ${activeRoute.interCityTransit.mode} (${activeRoute.interCityTransit.duration})
🏷️ *Calculated Benchmark:* ${formatPrice(totalCalculatedBenchmark)} / person
Could you check current flight connections and share a detailed day-by-day plan?`;

    window.open(`https://wa.me/91${SITE_CONTACT.phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest pt-28 pb-24 text-on-surface">
      {/* ── HEADER BANNER ── */}
      <section className="border-b border-surface-container-high/60 bg-gradient-to-b from-surface-container-low/80 to-surface-container-lowest py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">hub</span>
              Seamless Combo Travel
            </span>
            <span className="text-xs text-outline font-medium">· Two or More Destinations in One Itinerary</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-primary max-w-3xl leading-tight">
            Multi-City Route Planner &amp; Split-Night Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Long-haul flights from India deserve more than one stop. Connect seamless high-speed rails, island speedboats, and regional flights without dealing with messy point-to-point booking logistics.
          </p>

          {/* Quick Route Selector Pills */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {MULTI_CITY_ROUTES.map((route) => {
              const isSelected = route.id === activeRoute.id;
              return (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {route.region === 'Europe' ? 'train' : 'flight_takeoff'}
                  </span>
                  <span>{route.stops.map((s) => s.city.split(' ')[0]).join(' + ')}</span>
                  <span className="text-[10px] opacity-75 font-normal">({route.region})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MAIN INTERACTIVE BUILDER GRID ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Route Details & Stops Timeline (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Active Route Overview Card */}
            <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/80 overflow-hidden shadow-xs p-6 sm:p-8">
              <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden mb-6">
                <Image
                  src={activeRoute.heroImage}
                  alt={activeRoute.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-on-primary">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-wider mb-2">
                    {activeRoute.region}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
                    {activeRoute.title}
                  </h2>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
                {activeRoute.subtitle}
              </p>

              {/* Logistics Snapshot */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-high/60 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block mb-0.5">Best Season</span>
                  <span className="font-semibold text-primary">{activeRoute.bestSeason}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block mb-0.5">Visa Policy</span>
                  <span className="font-semibold text-primary">{activeRoute.visaSummary}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-outline block mb-0.5">Recommended For</span>
                  <span className="font-semibold text-primary">{activeRoute.suitableFor}</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step City Stops & Inter-City Transit */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-primary">
                    Customise Your Stay Split
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Adjust nights in each destination. Our system recalibrates the benchmark instantly.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                  Total: {totalNights} Nights / {totalNights + 1} Days
                </div>
              </div>

              {activeRoute.stops.map((stop, index) => {
                const nights = getStopNights(activeRoute.id, stop.city, stop.defaultNights);
                const isLast = index === activeRoute.stops.length - 1;

                return (
                  <React.Fragment key={stop.city}>
                    {/* City Stop Card */}
                    <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 p-5 sm:p-6 shadow-xs hover:border-secondary/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container-high/50">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-on-primary">
                              {index + 1}
                            </span>
                            <h4 className="font-serif text-lg font-bold text-primary">
                              {stop.city}
                            </h4>
                            <span className="text-xs text-outline">({stop.country})</span>
                          </div>
                          <span className="text-[11px] text-on-surface-variant block mt-1">
                            📍 Recommended Base: <strong className="text-primary font-medium">{stop.recommendedStayArea}</strong>
                          </span>
                        </div>

                        {/* Night Stepper */}
                        <div className="flex items-center gap-3 bg-surface-container-low px-3 py-1.5 rounded-xl border border-surface-container-high shrink-0 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleUpdateNights(stop.city, -1, stop.minNights, stop.maxNights)}
                            disabled={nights <= stop.minNights}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold shadow-xs cursor-pointer"
                          >
                            –
                          </button>
                          <span className="text-xs font-bold font-mono text-primary min-w-[70px] text-center">
                            {nights} Nights
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateNights(stop.city, 1, stop.minNights, stop.maxNights)}
                            disabled={nights >= stop.maxNights}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold shadow-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* City Highlights Checklist */}
                      <div className="pt-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-outline block mb-2">
                          Key Experiences &amp; Handled Sightseeing:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {stop.highlights.map((hl) => (
                            <div key={hl} className="flex items-center gap-2 text-xs text-on-surface-variant">
                              <span className="material-symbols-outlined text-sm text-teal-600 shrink-0">
                                check_circle
                              </span>
                              <span className="truncate">{hl}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Inter-City Transit Connector (Between stops) */}
                    {!isLast && (
                      <div className="relative py-2 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-dashed border-outline-variant/60" />
                        </div>
                        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold shadow-xs">
                          <span className="material-symbols-outlined text-sm">
                            {activeRoute.interCityTransit.mode === 'High-Speed Train'
                              ? 'train'
                              : activeRoute.interCityTransit.mode === 'Flight'
                              ? 'flight'
                              : 'directions_car'}
                          </span>
                          <span>
                            {activeRoute.interCityTransit.mode}: {activeRoute.interCityTransit.duration}
                          </span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Inclusions Card */}
            <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 p-6 shadow-xs">
              <h4 className="font-serif text-base font-bold text-primary mb-3">
                Verified Multi-City Inclusions Checklist
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-on-surface-variant">
                {activeRoute.inclusions.map((inc) => (
                  <li key={inc} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm text-teal-600 shrink-0 mt-0.5">
                      verified
                    </span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Sticky Pricing & Action Calculator Dock (5 Cols) */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-surface-container-lowest rounded-3xl border border-secondary/20 p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full pointer-events-none" />

              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-1">
                Multi-City Investment Benchmark
              </span>
              <h3 className="font-serif text-2xl font-bold text-primary">
                Your Tailored Blueprint
              </h3>

              <div className="mt-4 p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-high/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-outline">Route Split:</span>
                  <span className="font-bold text-primary">{nightsBreakdownString}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-outline">Duration:</span>
                  <span className="font-semibold text-primary">{totalNights} Nights / {totalNights + 1} Days</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-outline">Inter-City Transit:</span>
                  <span className="font-semibold text-primary">{activeRoute.interCityTransit.mode}</span>
                </div>
              </div>

              {/* Accommodation Tier Picker */}
              <div className="mt-6">
                <span className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-2">
                  Select Accommodation Tier
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHotelTier('4star')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      hotelTier === '4star'
                        ? 'border-secondary bg-secondary/10 font-bold text-primary'
                        : 'border-surface-container-high bg-surface-container-low/50 text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="block font-bold">4★ Boutique Handpicked</span>
                    <span className="text-[10px] text-outline mt-0.5 block">Standard Benchmark</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHotelTier('5star')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      hotelTier === '5star'
                        ? 'border-secondary bg-secondary/10 font-bold text-primary'
                        : 'border-surface-container-high bg-surface-container-low/50 text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="block font-bold">5★ Luxury / Pool Villas</span>
                    <span className="text-[10px] text-secondary mt-0.5 block">+ {formatPrice(16500)} / person</span>
                  </button>
                </div>
              </div>

              {/* Flights Toggle */}
              <div className="mt-4 pt-4 border-t border-surface-container-high">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-primary block">
                      Include Estimated Ex-India Flights
                    </span>
                    <span className="text-[10px] text-outline">
                      {activeRoute.flightEstimateFromIndia.departureHubs} (~{formatPrice(estimatedFlightCost)})
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeFlights}
                    onChange={(e) => setIncludeFlights(e.target.checked)}
                    className="w-4 h-4 text-secondary rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Total Price Display */}
              <div className="mt-6 pt-5 border-t border-surface-container-high">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
                    Indicative Total Investment*
                  </span>
                  <span className="text-[10px] text-outline">Twin sharing</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-primary">
                    {formatPrice(totalCalculatedBenchmark)}
                  </span>
                  <span className="text-xs text-on-surface-variant">/ person</span>
                </div>
                <p className="text-[10px] text-outline mt-1">
                  *Transparent indicative benchmark. Final price locked during live date &amp; room selection without hidden surcharges.
                </p>
              </div>

              {/* Conversion CTAs */}
              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={handleRequestQuote}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Send Route to Senior Consultant</span>
                </button>

                <button
                  type="button"
                  onClick={handleGenerateProposal}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary text-xs font-bold transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">description</span>
                  <span>Generate Shareable Proposal Paper</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppChat}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>Discuss Route on WhatsApp</span>
                </button>
              </div>

              {/* Trust Disclosures */}
              <div className="mt-6 pt-4 border-t border-surface-container-high/60 flex items-center justify-center gap-4 text-[10px] text-outline">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-teal-600">verified</span>
                  GST Registered
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-teal-600">verified</span>
                  No High-Pressure Sales
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-teal-600">verified</span>
                  Dedicated Concierge
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
