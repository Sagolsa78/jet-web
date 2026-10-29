import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { SAMPLE_DESTINATIONS } from '@/data/sample-destinations';
import { SITE_BRAND, SITE_CONTACT, SITE_ORIGIN } from '@/data/site-content';
import { getPackageBySlug, getAllPackageSlugs } from '@/data/packages-unified';
import { PackageQuoteButton } from '@/components/holidays/PackageQuoteButton';
import { InteractiveItineraryCustomizer } from '@/components/holidays/InteractiveItineraryCustomizer';
import { ShareItineraryActions } from '@/components/holidays/ShareItineraryActions';

export function generateStaticParams() {
  return getAllPackageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) return { title: 'Package Not Found' };

  const durationFormatted =
    pkg.durationDays > 0 ? `${pkg.durationDays}D / ${pkg.durationNights}N` : 'Custom Duration';
  const ogImageUrl = `/api/og?title=${encodeURIComponent(pkg.title)}&subtitle=${encodeURIComponent(`${durationFormatted} · ${pkg.style} Style`)}&tag=CURATED+BLUEPRINT&badge=${encodeURIComponent(`₹${pkg.startingPrice ? pkg.startingPrice.toLocaleString('en-IN') : 'Custom'} / person`)}`;

  return {
    title: `${pkg.title} | ${SITE_BRAND.name}`,
    description: pkg.description,
    openGraph: {
      title: `${pkg.title}${pkg.durationDays > 0 ? ` - ${durationFormatted}` : ''} | ${SITE_BRAND.name}`,
      description: pkg.description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pkg.title} | ${SITE_BRAND.name}`,
      description: pkg.description,
      images: [ogImageUrl],
    },
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  const destination = SAMPLE_DESTINATIONS.find((d) => d.id === pkg.destinationId);
  const formattedPrice = pkg.startingPrice
    ? `₹${pkg.startingPrice.toLocaleString('en-IN')}`
    : 'Custom quote';
  const durationFormatted =
    pkg.durationDays > 0 ? `${pkg.durationDays}D / ${pkg.durationNights}N` : 'Custom Duration';
  const durationText =
    pkg.durationDays > 0
      ? `${pkg.durationDays} Days / ${pkg.durationNights} Nights`
      : 'Custom Duration';

  // Schema.org TouristTrip JSON-LD for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.description,
    image: pkg.heroImage,
    touristType: [pkg.style, 'Families', 'Couples', 'Indian Travellers'],
    ...(pkg.startingPrice && pkg.startingPrice > 0
      ? {
          offers: {
            '@type': 'AggregateOffer',
            lowPrice: pkg.startingPrice,
            priceCurrency: 'INR',
            description:
              'Indicative benchmark price per person on twin-sharing basis. Exact live pricing tailored to selected departure dates, flights, and room tier.',
          },
        }
      : {}),
    provider: {
      '@type': 'TravelAgency',
      name: SITE_BRAND.name,
      telephone: `+91${SITE_CONTACT.phone}`,
      email: SITE_CONTACT.email,
      url: SITE_ORIGIN,
    },
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: pkg.itinerary.length,
      itemListElement: pkg.itinerary.map((day, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'TouristAttraction',
          name: day.title,
          description: day.description,
        },
      })),
    },
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── PRINT-ONLY PROPOSAL HEADER (visible only during Cmd+P / window.print) ── */}
      <div className="hidden print:block p-8 border-b-2 border-primary mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">{SITE_BRAND.name}</h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Bespoke Holiday Proposals • Reg GSTIN: 07AAECJ6467D1ZI
            </p>
            <p className="text-xs text-on-surface-variant">
              Phone: +91 {SITE_CONTACT.phone} • Email: {SITE_CONTACT.email}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Proposal Moodboard
            </span>
            <div className="text-xl font-bold font-serif text-primary mt-1">{pkg.title}</div>
            <div className="text-xs text-on-surface-variant">
              {durationText} • Benchmark: {formattedPrice}/person
            </div>
          </div>
        </div>
      </div>

      {/* ── 1. EDITORIAL HERO SECTION ── */}
      <section className="relative h-[65vh] min-h-[480px] w-full overflow-hidden bg-primary pt-24 no-print">
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-12">
          {/* Back link */}
          <Link
            href="/holidays"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-surface-container-low/80 hover:text-white transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Curated Holidays</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl text-on-primary">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {pkg.style}
                </span>
                <span className="bg-surface-container-lowest/20 backdrop-blur-md text-surface-container-low px-3 py-1 rounded-full text-xs font-medium">
                  {destination?.name ?? 'Curated Destination'}
                </span>
                <span className="text-secondary-container text-xs font-semibold">
                  ✦ {durationText}
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-on-primary mb-3 leading-tight">
                {pkg.title}
              </h1>

              <p className="font-sans text-base sm:text-lg text-surface-container-low/90 max-w-2xl font-light leading-relaxed">
                {pkg.description}
              </p>
            </div>

            {/* Quick Pricing Card on Hero */}
            <div className="bg-surface-container-lowest/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl text-primary border border-surface-container-high/60 shrink-0 w-full sm:w-auto">
              <span className="text-[11px] uppercase tracking-wider font-bold text-outline block mb-1">
                Indicative Benchmark
              </span>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-serif text-3xl font-bold text-primary">
                  {formattedPrice}
                </span>
                <span className="text-xs text-on-surface-variant font-medium">/ person*</span>
              </div>
              <p className="text-[11px] text-outline mb-4">
                Twin sharing • Flights quoted separately
              </p>

              <PackageQuoteButton
                packageTitle={pkg.title}
                destination={destination?.name || pkg.title}
                budgetRange={formattedPrice}
                travelStyle={pkg.style}
                duration={durationFormatted}
                label="Customise &amp; Request Quote"
                className="w-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary font-sans text-xs font-bold py-3 px-6 rounded-xl shadow-md text-center block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. TRUTHFUL PRICE ASSUMPTIONS & SHARE BAR ── */}
      <section className="bg-surface-container-low border-b border-surface-container-high py-4 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs text-on-surface-variant">
          <div className="flex items-start gap-2 max-w-3xl">
            <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">info</span>
            <div>
              <strong className="text-primary font-semibold">Transparent Pricing Basis: </strong>
              <span>{pkg.priceAssumptions}</span>
            </div>
          </div>

          {/* Social Proof & Family Share Actions */}
          <div className="shrink-0 flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            <ShareItineraryActions
              packageTitle={pkg.title}
              duration={durationFormatted}
              startingPrice={formattedPrice}
              highlights={pkg.itinerary.map((d) => d.title)}
              inclusions={pkg.inclusions}
              slug={pkg.slug}
            />
          </div>
        </div>
      </section>

      {/* ── 3. MAIN CONTENT: INCLUSIONS, INTERACTIVE CUSTOMIZER & SIDEBAR ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column (8 cols): Inclusions + Interactive Customizer */}
          <div className="lg:col-span-8 space-y-16">
            {/* Inclusions & Exclusions */}
            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high/80 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-primary mb-6">
                What&apos;s Included &amp; What&apos;s Not
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Inclusions */}
                <div>
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-2 mb-4 bg-teal-50 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-base text-teal-600">check_circle</span>
                    <span>
                      {pkg.itineraryType === 'suggested_draft'
                        ? 'Indicative Inclusions (Customizable)'
                        : 'Supplier-Verified Inclusions'}
                    </span>
                  </h3>
                  <ul className="space-y-2.5 text-xs text-on-surface-variant">
                    {pkg.inclusions.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-sm text-teal-600 shrink-0 mt-0.5">check</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div>
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2 mb-4 bg-rose-50 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-base text-rose-600">cancel</span>
                    <span>Excluded / Payable Separately</span>
                  </h3>
                  <ul className="space-y-2.5 text-xs text-on-surface-variant">
                    {pkg.exclusions.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-sm text-rose-500 shrink-0 mt-0.5">close</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* ── CANCELLATION & PAYMENT TERMS (Transparent Supplier Policies) ── */}
            <section className="bg-surface-container-low/50 p-6 sm:p-8 rounded-3xl border border-surface-container-high/60 space-y-4">
              <h3 className="font-serif text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">policy</span>
                <span>Booking Terms &amp; Cancellation Safeguards</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-on-surface-variant leading-relaxed">
                <div>
                  <h4 className="font-bold text-primary uppercase tracking-wider text-[11px] mb-2">
                    Flexible Cancellation Schedule
                  </h4>
                  <ul className="space-y-1.5 list-disc pl-4">
                    <li><strong>30+ Days Before Departure:</strong> 100% land package refund minus non-refundable park/monument permits.</li>
                    <li><strong>15–29 Days Before Departure:</strong> 75% refund on land arrangements. Date change assistance provided.</li>
                    <li><strong>Under 15 Days:</strong> Subject to verified hotel partner policies. Flights governed by airline rules.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-primary uppercase tracking-wider text-[11px] mb-2">
                    Transparent Payment Milestones
                  </h4>
                  <ul className="space-y-1.5 list-disc pl-4">
                    <li><strong>25% Booking Deposit:</strong> Locks dates, secures private chauffeur allocation, and reserves rooms.</li>
                    <li><strong>50% Mid-Payment:</strong> Due upon delivery of confirmed hotel and transfer vouchers.</li>
                    <li><strong>25% Balance:</strong> 10 days before flight departure. Official GST tax invoice issued.</li>
                  </ul>
                </div>
              </div>

              <p className="text-[11px] text-outline pt-2 border-t border-surface-container-high/60">
                *Final itinerary and price will be confirmed by a travel consultant based on exact travel dates and flight connections.
              </p>
            </section>

            {/* ── INTERACTIVE DAY-CUSTOMIZER & ITINERARY SCRUBBER ── */}
            <InteractiveItineraryCustomizer
              pkg={pkg}
              destinationName={destination?.name}
            />
          </div>

          {/* Right Column (4 cols): Sticky Booking Dock & Sales Callback Panel */}
          <aside className="lg:col-span-4 space-y-6 no-print">
            <div className="sticky top-28 bg-surface-container-lowest p-7 sm:p-8 rounded-3xl border border-surface-container-high shadow-lg space-y-5">
              <div>
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1">
                  Sales Callback Request
                </span>
                <h3 className="font-serif text-2xl font-bold text-primary">
                  Speak With a Travel Specialist
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Request a callback from our regional desk. We will review your dates and group size before preparing a tailored quote.
                </p>
              </div>

              {/* Price summary */}
              <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-container-high/60">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                  Starting benchmark
                </span>
                <div className="font-serif text-3xl font-bold text-primary mt-1">
                  {formattedPrice}
                </div>
                <span className="text-[11px] text-on-surface-variant block mt-0.5">
                  {pkg.priceBasis || 'per adult on twin-sharing basis'}
                </span>
              </div>

              {/* Date & Group Flexibility Selector note */}
              <div className="bg-secondary/5 rounded-xl p-3 border border-secondary/15 text-xs text-on-surface-variant space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-primary text-[11px]">
                  <span className="material-symbols-outlined text-sm text-secondary">tune</span>
                  <span>100% Customizable Pacing &amp; Stays</span>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-snug">
                  Choose your departure dates, upgrade room tiers, or add kid-friendly activities with zero lock-in.
                </p>
              </div>

              {/* CTAs */}
              <div className="space-y-2.5">
                <PackageQuoteButton
                  packageTitle={pkg.title}
                  destination={destination?.name || pkg.title}
                  budgetRange={formattedPrice}
                  travelStyle={pkg.style}
                  duration={durationFormatted}
                  label="Get a Callback"
                  className="w-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary font-sans text-sm font-bold py-3.5 px-6 rounded-full shadow-md text-center block cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/91${SITE_CONTACT.phone}?text=Hi%20Jeto,%20I'm%20interested%20in%20the%20${encodeURIComponent(pkg.title)}%20package.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full border border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10 text-xs font-bold transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:+91${SITE_CONTACT.phone}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full border border-surface-container-high hover:bg-surface-container-low text-primary text-xs font-bold transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm text-secondary">call</span>
                    <span>Direct Call</span>
                  </a>
                </div>
              </div>

              {/* Truthful Trust Signals & Disclaimer */}
              <div className="pt-4 border-t border-surface-container-high space-y-2 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600">verified</span>
                  <span>Dedicated regional travel planner</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600">receipt_long</span>
                  <span>Official GST Tax Invoice provided</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600">support_agent</span>
                  <span>24/7 on-ground assistance</span>
                </div>
              </div>

              <p className="text-[10px] text-outline leading-tight pt-1">
                Final itinerary and price will be confirmed by a travel consultant based on real-time flight and hotel availability.
              </p>
            </div>

            {/* Travel Style Tile */}
            <div className="bg-primary text-on-primary p-6 rounded-3xl space-y-3">
              <span className="font-sans text-xs font-bold text-secondary-container tracking-wider uppercase">
                Travel Style
              </span>
              <h4 className="font-serif text-xl font-bold">{pkg.style} Experience</h4>
              <p className="font-sans text-xs text-surface-container-low/80 leading-relaxed">
                Designed for discerning travellers who value hand-selected properties, reliable private chauffeurs, and zero commercial stopovers.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ── STICKY MOBILE CONVERSION BAR (Visible on mobile viewports) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md p-3 px-4 border-t border-surface-container-high sm:hidden flex items-center justify-between gap-3 shadow-2xl">
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-bold text-outline block leading-tight">Indicative From</span>
          <span className="font-serif text-base font-bold text-primary truncate block">{formattedPrice}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`tel:+91${SITE_CONTACT.phone}`}
            className="p-2.5 rounded-full border border-surface-container-high text-primary hover:bg-surface-container-low transition-colors"
            aria-label="Call travel consultant"
          >
            <span className="material-symbols-outlined text-base text-secondary">call</span>
          </a>
          <PackageQuoteButton
            packageTitle={pkg.title}
            destination={destination?.name || pkg.title}
            budgetRange={formattedPrice}
            travelStyle={pkg.style}
            duration={durationFormatted}
            label="Get a Callback"
            className="bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary font-sans text-xs font-bold py-2.5 px-4 rounded-full shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
