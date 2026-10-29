'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONTACT } from '@/data/site-content';
import { useQuoteModal } from '@/context/QuoteModalContext';

interface ComboPreset {
  id: string;
  name: string;
  tagline: string;
  cityA: string;
  cityB: string;
  defaultNightsA: number;
  defaultNightsB: number;
  transitMethod: string;
  transitDuration: string;
  heroImage: string;
  basePrice: number;
  highlightsA: string[];
  highlightsB: string[];
  logisticsNote: string;
}

const COMBO_PRESETS: ComboPreset[] = [
  {
    id: 'swiss-paris',
    name: 'Swiss Alps & Paris City of Lights',
    tagline: 'Snow-capped Jungfrau peaks seamlessly linked to Parisian boulangeries and the Eiffel Tower.',
    cityA: 'Swiss Alps (Lucerne & Interlaken)',
    cityB: 'Paris (Left Bank / Opera)',
    defaultNightsA: 4,
    defaultNightsB: 3,
    transitMethod: 'TGV Lyria High-Speed Train (1st Class)',
    transitDuration: '4 hours 15 mins (Point-to-point station transit)',
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200',
    basePrice: 165000,
    highlightsA: ['Glacier Express & Mt. Titlis Cable Car', 'Lake Lucerne Steamer Cruise', 'Kitchenette apartment hotel option'],
    highlightsB: ['Louvre & Musée d\'Orsay Skip-the-Line', 'Seine River Twilight Dinner Cruise', 'Montmartre artist village walk'],
    logisticsNote: 'First-class train departs central Basel/Zurich and arrives directly at Paris Gare de Lyon with zero airport baggage stress.',
  },
  {
    id: 'singapore-bali',
    name: 'Singapore Skylines & Bali Island Sanctuary',
    tagline: 'High-energy futuristic gardens followed by clifftop ocean sunsets and Ubud rice terraces.',
    cityA: 'Singapore (Marina Bay)',
    cityB: 'Bali (Ubud & Seminyak)',
    defaultNightsA: 3,
    defaultNightsB: 4,
    transitMethod: 'Direct Flight (Singapore to Denpasar)',
    transitDuration: '2 hours 40 mins flight time',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200',
    basePrice: 68000,
    highlightsA: ['Gardens by the Bay & Cloud Forest', 'Night Safari Wildlife Tour', 'Sentosa Island Cableway'],
    highlightsB: ['Private Pool Villa in Ubud', 'Uluwatu Clifftop Sunset & Kecak Dance', 'Nusa Penida Island Day Excursion'],
    logisticsNote: 'Chauffeur handles Singapore airport drop and your dedicated Balinese English-speaking chauffeur receives you at DPS airport.',
  },
  {
    id: 'dubai-abudhabi',
    name: 'Dubai Marvels & Abu Dhabi Oasis',
    tagline: 'Burj Khalifa and desert dunes paired with the serene marble domes of Sheikh Zayed Grand Mosque.',
    cityA: 'Dubai (Downtown / Palm)',
    cityB: 'Abu Dhabi (Saadiyat Island)',
    defaultNightsA: 3,
    defaultNightsB: 2,
    transitMethod: 'Private Chauffeur Luxury Sedan/SUV',
    transitDuration: '1 hour 20 mins highway drive',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200',
    basePrice: 52000,
    highlightsA: ['Burj Khalifa 124th Floor & Dubai Mall', 'Private Sunset Desert Dune Safari & BBQ', 'Dubai Marina Yacht Cruise'],
    highlightsB: ['Sheikh Zayed Grand Mosque guided visit', 'Louvre Abu Dhabi art pavilion', 'Yas Island Ferrari World pass'],
    logisticsNote: 'Smooth inter-emirate highway transfer with door-to-door luggage porterage from your Dubai hotel to Abu Dhabi resort.',
  },
  {
    id: 'kashmir-ladakh',
    name: 'Kashmir Meadows & Ladakh High-Pass Odyssey',
    tagline: 'Cedarwood houseboats on Dal Lake to the turquoise high-altitude waters of Pangong Lake.',
    cityA: 'Kashmir (Srinagar & Gulmarg)',
    cityB: 'Ladakh (Leh & Nubra Valley)',
    defaultNightsA: 4,
    defaultNightsB: 4,
    transitMethod: 'Scenic Mountain Flight (SXR to IXL)',
    transitDuration: '50 mins scenic flight over Himalayan glaciers',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200',
    basePrice: 58500,
    highlightsA: ['Luxury Dal Lake Houseboat Shikara Cruise', 'Gulmarg Gondola Phase 2 to 13,000ft', 'Betaab Valley & Lidder Riverwalk'],
    highlightsB: ['Pangong Tso Starlit Glamping', 'Nubra Valley Double-Humped Camel Ride', 'Khardung La World\'s Highest Motorable Pass'],
    logisticsNote: 'Oxygen cylinder-equipped private 4x4 Innova throughout Ladakh with mandatory rest day for gentle acclimatization.',
  },
];

interface HotelStandard {
  id: string;
  name: string;
  deltaPerNight: number;
  description: string;
}

const HOTEL_STANDARDS: HotelStandard[] = [
  {
    id: 'boutique-4',
    name: 'Verified 4★ Boutique Hotels',
    deltaPerNight: 0,
    description: 'Central locations, reliable high-speed Wi-Fi, hygienic buffet breakfast, and verified guest cleanliness scores.',
  },
  {
    id: 'luxury-5',
    name: 'Signature 5★ Luxury Collection',
    deltaPerNight: 2200,
    description: 'Balcony or ocean views, 24-hour concierge, multiple international restaurants, and expansive spa amenities.',
  },
  {
    id: 'family-kitchenette',
    name: 'Family Apartment / Villa with Kitchenette',
    deltaPerNight: 1400,
    description: 'Spacious multi-bedroom suites with private cooking facilities—ideal for families wanting comforting homemade meals.',
  },
];

export default function TripBuilderPage() {
  const { openQuoteModal } = useQuoteModal();

  const [selectedComboId, setSelectedComboId] = useState<string>('swiss-paris');
  const [selectedHotelStandard, setSelectedHotelStandard] = useState<string>('boutique-4');

  const activeCombo = useMemo(() => {
    return COMBO_PRESETS.find((c) => c.id === selectedComboId) || COMBO_PRESETS[0];
  }, [selectedComboId]);

  const [customNights, setCustomNights] = useState<Record<string, { a: number; b: number }>>({});

  const nightsA = customNights[activeCombo.id]?.a ?? activeCombo.defaultNightsA;
  const nightsB = customNights[activeCombo.id]?.b ?? activeCombo.defaultNightsB;

  const setNightsA = (val: number | ((prev: number) => number)) => {
    setCustomNights((prev) => {
      const cur = prev[activeCombo.id]?.a ?? activeCombo.defaultNightsA;
      const next = typeof val === 'function' ? val(cur) : val;
      return {
        ...prev,
        [activeCombo.id]: {
          a: next,
          b: prev[activeCombo.id]?.b ?? activeCombo.defaultNightsB,
        },
      };
    });
  };

  const setNightsB = (val: number | ((prev: number) => number)) => {
    setCustomNights((prev) => {
      const cur = prev[activeCombo.id]?.b ?? activeCombo.defaultNightsB;
      const next = typeof val === 'function' ? val(cur) : val;
      return {
        ...prev,
        [activeCombo.id]: {
          a: prev[activeCombo.id]?.a ?? activeCombo.defaultNightsA,
          b: next,
        },
      };
    });
  };

  const totalNights = nightsA + nightsB;
  const totalDays = totalNights + 1;

  // Real-time price calculation
  const { totalPrice, hotelObj } = useMemo(() => {
    const hotel = HOTEL_STANDARDS.find((h) => h.id === selectedHotelStandard) || HOTEL_STANDARDS[0];
    const hotelDelta = hotel.deltaPerNight * totalNights;
    const nightDelta = (totalNights - (activeCombo.defaultNightsA + activeCombo.defaultNightsB)) * 4500;
    const finalPrice = Math.max(activeCombo.basePrice, activeCombo.basePrice + hotelDelta + nightDelta);

    return {
      totalPrice: finalPrice,
      hotelObj: hotel,
    };
  }, [activeCombo, totalNights, selectedHotelStandard]);

  const handleOpenProposalModal = () => {
    const notes = [
      `Multi-City Route: ${activeCombo.name}`,
      `Split: ${nightsA} Nights in ${activeCombo.cityA} + ${nightsB} Nights in ${activeCombo.cityB}`,
      `Total: ${totalDays} Days / ${totalNights} Nights`,
      `Inter-City Transit: ${activeCombo.transitMethod}`,
      `Accommodation Standard: ${hotelObj.name}`,
      `Indicative Benchmark: ₹${totalPrice.toLocaleString('en-IN')} / person`,
    ].join('\n');

    openQuoteModal({
      packageTitle: `${activeCombo.name} (Multi-City)`,
      destination: `${activeCombo.cityA} + ${activeCombo.cityB}`,
      budgetRange: `₹${totalPrice.toLocaleString('en-IN')} / person`,
      travelStyle: 'Luxury',
      duration: `${totalDays}D / ${totalNights}N`,
      notes,
    });
  };

  return (
    <div className="min-h-screen bg-background text-on-surface pt-24 pb-20">
      {/* ── BREADCRUMB & HERO ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-8 pb-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-outline mb-4">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-secondary">Multi-City Combo Trip Builder</span>
        </div>

        <div className="max-w-3xl">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-secondary block mb-2">
            Seamless Cross-Destination Journeys
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-primary mb-4 leading-tight">
            Design Your 2-in-1 Combo Holiday
          </h1>
          <p className="font-sans text-base text-on-surface-variant leading-relaxed">
            Why limit your journey to a single city? Pair high-speed European rail, short Southeast Asian flights, or scenic desert drives. We coordinate all inter-city transfers, door-to-door luggage handling, and handpicked boutique stays.
          </p>
        </div>
      </section>

      {/* ── COMBO PRESET SELECTOR (TABS) ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 mb-10">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
          {COMBO_PRESETS.map((combo) => {
            const isSelected = combo.id === selectedComboId;
            return (
              <button
                key={combo.id}
                type="button"
                onClick={() => setSelectedComboId(combo.id)}
                className={`px-5 py-3 rounded-2xl shrink-0 font-sans text-xs font-bold transition-all cursor-pointer border text-left ${
                  isSelected
                    ? 'bg-primary text-on-primary border-primary shadow-md'
                    : 'bg-surface-container-lowest text-on-surface-variant border-surface-container-high hover:border-secondary/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-secondary-container">
                    {isSelected ? 'check_circle' : 'route'}
                  </span>
                  <span>{combo.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── MAIN INTERACTIVE BUILDER GRID ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column (8 cols): Route Visualizer & Night Allocator */}
          <div className="lg:col-span-8 space-y-10">
            {/* Visual Hero Banner for Active Combo */}
            <div className="relative h-72 sm:h-80 w-full rounded-3xl overflow-hidden shadow-lg border border-surface-container-high">
              <Image
                src={activeCombo.heroImage}
                alt={activeCombo.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-on-primary">
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-container bg-primary/60 px-3 py-1 rounded-full backdrop-blur-md inline-block mb-2">
                  Curated Multi-City Pairing
                </span>
                <h2 className="font-serif text-3xl font-bold mb-2">{activeCombo.name}</h2>
                <p className="font-sans text-xs sm:text-sm text-surface-container-low max-w-xl font-light leading-relaxed">
                  {activeCombo.tagline}
                </p>
              </div>
            </div>

            {/* Split Route Flow Card */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-surface-container-high/80 shadow-xs space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary block mb-1">
                  Leg-by-Leg Route Allocation
                </span>
                <h3 className="font-serif text-2xl font-bold text-primary">
                  Fine-Tune Your Stays &amp; Night Split
                </h3>
              </div>

              {/* Legs Container */}
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                {/* Leg 1: City A */}
                <div className="md:col-span-5 bg-surface-container-low/80 p-5 rounded-2xl border border-surface-container-high">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Leg 1: {activeCombo.cityA}
                    </span>
                    <span className="bg-secondary text-on-secondary text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {nightsA} Nights
                    </span>
                  </div>

                  {/* Night Stepper */}
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-surface-container-high mb-4">
                    <span className="text-xs font-semibold text-outline">Nights allocated:</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setNightsA(Math.max(2, nightsA - 1))}
                        className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-primary hover:bg-surface-container-highest cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-serif text-base font-bold text-primary">{nightsA}</span>
                      <button
                        type="button"
                        onClick={() => setNightsA(Math.min(7, nightsA + 1))}
                        className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-primary hover:bg-surface-container-highest cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 text-xs text-on-surface-variant">
                    {activeCombo.highlightsA.map((h) => (
                      <div key={h} className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[13px] text-teal-600 mt-0.5 shrink-0">check</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connecting Arrow & Transit */}
                <div className="md:col-span-1 text-center py-2 md:py-0 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-lg">connecting_airports</span>
                  </div>
                </div>

                {/* Leg 2: City B */}
                <div className="md:col-span-5 bg-surface-container-low/80 p-5 rounded-2xl border border-surface-container-high">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Leg 2: {activeCombo.cityB}
                    </span>
                    <span className="bg-secondary text-on-secondary text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {nightsB} Nights
                    </span>
                  </div>

                  {/* Night Stepper */}
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-surface-container-high mb-4">
                    <span className="text-xs font-semibold text-outline">Nights allocated:</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setNightsB(Math.max(2, nightsB - 1))}
                        className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-primary hover:bg-surface-container-highest cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-serif text-base font-bold text-primary">{nightsB}</span>
                      <button
                        type="button"
                        onClick={() => setNightsB(Math.min(7, nightsB + 1))}
                        className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-primary hover:bg-surface-container-highest cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 text-xs text-on-surface-variant">
                    {activeCombo.highlightsB.map((h) => (
                      <div key={h} className="flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[13px] text-teal-600 mt-0.5 shrink-0">check</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transit Details Box */}
              <div className="bg-primary-container text-on-primary p-5 rounded-2xl">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary-container text-2xl shrink-0">
                    transfer_within_a_station
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-container block mb-1">
                      Included Inter-City Logistics
                    </span>
                    <h4 className="font-serif text-base font-bold mb-1">
                      {activeCombo.transitMethod}
                    </h4>
                    <p className="font-sans text-xs text-surface-container-low/90 leading-relaxed">
                      {activeCombo.logisticsNote} ({activeCombo.transitDuration})
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hotel Standard Selector */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-surface-container-high/80 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary block mb-1">
                Accommodation Standard
              </span>
              <h3 className="font-serif text-2xl font-bold text-primary mb-4">
                Select Your Stay Tier Across Both Cities
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {HOTEL_STANDARDS.map((std) => {
                  const isSelected = selectedHotelStandard === std.id;
                  return (
                    <div
                      key={std.id}
                      onClick={() => setSelectedHotelStandard(std.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-secondary/5 border-secondary shadow-xs ring-2 ring-secondary/20'
                          : 'bg-surface-container-low/50 border-surface-container-high hover:border-secondary/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <span className="font-serif text-base font-bold text-primary">
                          {std.name}
                        </span>
                        {std.deltaPerNight > 0 && (
                          <span className="text-[10px] font-bold text-secondary shrink-0">
                            +₹{std.deltaPerNight}/N
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                        {std.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Summary Dock & Direct Proposal Trigger */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high shadow-xl space-y-6">
              <div>
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1">
                  Multi-City Blueprint
                </span>
                <h3 className="font-serif text-2xl font-bold text-primary">
                  {totalDays} Days / {totalNights} Nights
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-1">
                  {nightsA}N {activeCombo.cityA} + {nightsB}N {activeCombo.cityB}
                </p>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-surface-container-low p-5 rounded-2xl border border-surface-container-high/60 space-y-2">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                  Indicative Combo Benchmark
                </span>
                <div className="font-serif text-3xl font-bold text-primary">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-on-surface-variant block">
                  per adult on twin-sharing basis (Land Package)
                </span>
              </div>

              {/* Inclusions summary */}
              <div className="space-y-2 pt-2 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600">check</span>
                  <span>{totalNights} nights in verified {hotelObj.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600">check</span>
                  <span>Inter-city transit: {activeCombo.transitMethod}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600">check</span>
                  <span>Daily breakfast &amp; private airport chauffeurs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600">check</span>
                  <span>24/7 dedicated regional trip concierge</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleOpenProposalModal}
                  className="w-full inline-flex items-center justify-center gap-2 bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary py-3.5 px-6 rounded-full font-sans text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>Request Custom Multi-City Quote</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>

                <a
                  href={`https://wa.me/91${SITE_CONTACT.phone}?text=Hi%20Jeto,%20I'm%20interested%20in%20the%20${encodeURIComponent(activeCombo.name)}%20multi-city%20route.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10 text-xs font-bold transition-colors"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>Ask a Question on WhatsApp</span>
                </a>
              </div>

              {/* Trust Footer */}
              <p className="text-[11px] text-outline text-center">
                ✦ 100% human consultation. Zero pressure to book until you are completely satisfied with the proposal.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
