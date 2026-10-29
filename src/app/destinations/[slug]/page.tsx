import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  DESTINATIONS,
  DESTINATION_REGION_LABELS,
  getDestinationBySlug,
} from '@/data/destinations';
import { SAMPLE_PACKAGES } from '@/data/sample-packages';
import { SAMPLE_DESTINATIONS } from '@/data/sample-destinations';
import { SITE_BRAND, SITE_CONTACT } from '@/data/site-content';
import { getDestinationLogistics } from '@/data/destination-logistics';
import {
  getLivePackagesByDestination,
  getLiveBlogsByDestination,
} from '@/data/live-packages-repository';
import { PackageQuoteButton } from '@/components/holidays/PackageQuoteButton';
import { DestinationPackagesView } from '@/components/destinations/DestinationPackagesView';

export const instant = false;

export function generateStaticParams() {
  return DESTINATIONS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    return { title: `Destination Not Found | ${SITE_BRAND.name}` };
  }

  const livePackages = getLivePackagesByDestination(slug);

  return {
    title: `${destination.name} Holiday Packages & Itineraries (${livePackages.length} Curated Options) | ${SITE_BRAND.name}`,
    description: `Explore ${livePackages.length} verified holiday packages for ${destination.name}. Transparent land package & flight prices, handpicked hotels, and 24/7 concierge support.`,
    openGraph: {
      title: `${destination.name} Holiday Packages | ${SITE_BRAND.name}`,
      description: `Plan your custom trip to ${destination.name}. Handcrafted itineraries with transparent inclusions.`,
      images: destination.image ? [{ url: destination.image }] : undefined,
    },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const logistics = getDestinationLogistics(slug);
  const livePackages = getLivePackagesByDestination(slug);
  const liveBlogs = getLiveBlogsByDestination(slug);

  // Match sample deep blueprint packages if available
  const sampleMatch = SAMPLE_PACKAGES.find((pkg) => {
    const pkgSlug = pkg.slug.toLowerCase();
    const pkgTitle = pkg.title.toLowerCase();
    const destSlug = destination.slug.toLowerCase();
    const destName = destination.name.toLowerCase();

    const sampleDest = SAMPLE_DESTINATIONS.find((d) => d.slug === destSlug || d.name.toLowerCase() === destName);
    if (sampleDest && pkg.destinationId === sampleDest.id) return true;
    return pkgSlug.includes(destSlug) || pkgTitle.includes(destName) || destSlug.includes(pkgSlug);
  });

  const otherDestinations = DESTINATIONS.filter(
    (item) => item.slug !== destination.slug,
  ).slice(0, 4);

  const totalPackageCount = livePackages.length > 0 ? livePackages.length : (sampleMatch ? 1 : 0);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* ── 1. EDITORIAL HERO SECTION ── */}
      <section className="relative h-[62vh] min-h-[480px] w-full overflow-hidden bg-primary pt-24">
        {destination.image ? (
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-primary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-12 text-on-primary">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-surface-container-low/80 hover:text-white transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>All Destinations</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {DESTINATION_REGION_LABELS[destination.region]} Collection
                </span>
                <span className="bg-surface-container-lowest/20 backdrop-blur-md text-surface-container-low px-3 py-1 rounded-full text-xs font-medium">
                  {totalPackageCount} Verified Itineraries Available
                </span>
                {livePackages[0]?.priceRangeWithoutFlight && (
                  <span className="text-secondary-container text-xs font-semibold">
                    ✦ Starting from ₹{livePackages[0].priceRangeWithoutFlight} / person
                  </span>
                )}
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-3">
                {destination.name}
              </h1>

              <p className="font-sans text-base sm:text-lg text-surface-container-low/90 max-w-2xl font-light leading-relaxed">
                Experience {destination.name} with verified private chauffeurs, handpicked central hotels, and zero forced commercial shopping stops.
              </p>
            </div>

            {/* Quick Hero CTA Card */}
            <div className="bg-surface-container-lowest/95 backdrop-blur-md p-6 rounded-2xl shadow-xl text-primary border border-surface-container-high/60 shrink-0 w-full sm:w-auto">
              <span className="text-[11px] uppercase tracking-wider font-bold text-outline block mb-1">
                Verified Pricing
              </span>
              <div className="font-serif text-2xl font-bold text-primary mb-1">
                {destination.name} Holidays
              </div>
              <p className="text-xs text-on-surface-variant mb-4">
                {livePackages.length} verified packages • 100% customisable
              </p>
              <PackageQuoteButton
                destination={destination.name}
                packageTitle={`Bespoke ${destination.name} Holiday`}
                travelStyle="Luxury"
                label={`Request ${destination.name} Quote`}
                className="w-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary font-sans text-xs font-bold py-3 px-6 rounded-xl shadow-md text-center block cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. INDIAN TRAVELER LOGISTICS BAR ── */}
      <section className="bg-surface-container-low border-b border-surface-container-high py-8 px-6 sm:px-10 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary text-lg">travel_explore</span>
            <span className="font-sans text-xs font-bold text-secondary uppercase tracking-widest">
              Indian Traveler Quick Guide
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Best Season */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/80 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5 text-secondary">
                <span className="material-symbols-outlined text-lg">calendar_month</span>
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Best Months</span>
              </div>
              <div className="font-serif text-base font-bold text-primary mb-0.5">
                {logistics.bestMonths}
              </div>
              <span className="text-[11px] text-on-surface-variant">Recommended for clear skies &amp; sightseeing</span>
            </div>

            {/* 2. Flight Duration */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/80 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5 text-secondary">
                <span className="material-symbols-outlined text-lg">flight_takeoff</span>
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Transit from India</span>
              </div>
              <div className="font-serif text-base font-bold text-primary mb-0.5">
                {logistics.flightDuration}
              </div>
              <span className="text-[11px] text-on-surface-variant">Convenient flight connections ex-BOM/DEL</span>
            </div>

            {/* 3. Visa Policy */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/80 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5 text-secondary">
                <span className="material-symbols-outlined text-lg">verified_user</span>
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Visa Policy</span>
              </div>
              <div className="font-serif text-base font-bold text-primary mb-0.5">
                {logistics.visaPolicy}
              </div>
              <span className="text-[11px] text-on-surface-variant">Assistance provided by our concierge team</span>
            </div>

            {/* 4. Vegetarian Dining Ease */}
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-high/80 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-secondary">
                  <span className="material-symbols-outlined text-lg">restaurant</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-outline">Veg &amp; Jain Food</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    logistics.vegDiningEase === 'High'
                      ? 'bg-teal-100 text-teal-800'
                      : logistics.vegDiningEase === 'Moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {logistics.vegDiningEase} Ease
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-snug">
                {logistics.vegTip}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. MAIN CONTENT: VERIFIED PACKAGES & SIDEBAR ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column (8 cols): Packages & Experiences */}
          <div className="lg:col-span-8 space-y-16">
            {/* Featured Interactive Blueprint if available */}
            {sampleMatch && (
              <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-surface-container-high/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary text-lg">auto_fix_high</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary">
                    Featured Interactive Blueprint
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-primary mb-2">
                  {sampleMatch.title}
                </h3>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-5 max-w-xl">
                  {sampleMatch.description}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-surface-container-high">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-outline block">
                      Starting Benchmark
                    </span>
                    <span className="font-serif text-2xl font-bold text-primary">
                      ₹{sampleMatch.startingPrice?.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal font-sans text-on-surface-variant">/ person</span>
                    </span>
                  </div>
                  <Link
                    href={`/holidays/${sampleMatch.slug}`}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary/90 text-xs font-bold transition-colors"
                  >
                    <span>Customise Day-by-Day Timeline</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </Link>
                </div>
              </section>
            )}

            {/* Section A: Live Packages Feed */}
            <section>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.2em] block mb-1">
                    Verified Inventory ({livePackages.length} Itineraries)
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-primary">
                    {destination.name} Holiday Packages
                  </h2>
                </div>
                <p className="font-sans text-xs text-on-surface-variant">
                  Toggle between Land Package &amp; Flight-Inclusive rates
                </p>
              </div>

              {livePackages.length > 0 ? (
                <DestinationPackagesView
                  packages={livePackages}
                  destinationName={destination.name}
                />
              ) : (
                /* Bespoke Route Card when no package is found */
                <div className="bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-primary mb-2">
                    Bespoke Itinerary Planning for {destination.name}
                  </h3>
                  <p className="font-sans text-xs text-on-surface-variant max-w-md mx-auto mb-6 leading-relaxed">
                    Our destination specialists design custom private journeys for {destination.name} around your preferred pacing, hotel category, and dining comfort.
                  </p>
                  <PackageQuoteButton
                    destination={destination.name}
                    packageTitle={`Custom ${destination.name} Exploration`}
                    travelStyle="Luxury"
                    label={`Craft a Custom ${destination.name} Proposal`}
                    className="inline-flex items-center gap-2 bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary px-6 py-3 rounded-full font-sans text-xs font-bold shadow-md transition-all cursor-pointer"
                  />
                </div>
              )}
            </section>

            {/* Section B: Editorial Blogs & Travel Guides */}
            {liveBlogs.length > 0 && (
              <section className="bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high/80 shadow-xs">
                <div className="mb-6">
                  <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.2em] block mb-1">
                    Authentic Travel Dispatches
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-primary">
                    Stories &amp; Guides for {destination.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {liveBlogs.map((blog) => (
                    <div
                      key={blog.slug}
                      className="p-5 rounded-2xl bg-surface-container-low/70 border border-surface-container-high/60 flex items-start gap-3.5 hover:shadow-xs transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-xl">menu_book</span>
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-primary mb-1">
                          {blog.title}
                        </h4>
                        <span className="text-xs font-semibold text-secondary flex items-center gap-1 mt-1">
                          <span>Curated Indian Guide</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section C: Regional Highlights */}
            <section className="bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high/80 shadow-xs">
              <div className="mb-6">
                <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.2em] block mb-1">
                  Signature Moments
                </span>
                <h3 className="font-serif text-2xl font-bold text-primary">
                  Top Experiential Highlights in {destination.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {logistics.highlights.map((item) => (
                  <div
                    key={item.title}
                    className="p-5 rounded-2xl bg-surface-container-low/70 border border-surface-container-high/60 flex items-start gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-primary mb-1">
                        {item.title}
                      </h4>
                      <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section D: Field Notes & Local Guides */}
            {liveBlogs.length > 0 && (
              <section className="bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high/80 shadow-xs">
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.2em] block mb-1">
                      Local Intelligence &amp; Field Notes
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-primary">
                      {destination.name} Travel Guides &amp; Insider Articles
                    </h3>
                  </div>
                  <Link
                    href="/travel-guides"
                    className="text-xs font-bold text-secondary hover:underline hidden sm:flex items-center gap-1"
                  >
                    <span>All travel guides</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {liveBlogs.slice(0, 6).map((blog, idx) => (
                    <div
                      key={blog.slug || idx}
                      className="p-5 rounded-2xl bg-surface-container-low/60 border border-surface-container-high/70 hover:border-secondary/40 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">
                            Local Dispatch
                          </span>
                          <span className="text-[10px] text-outline">Verified by Jeto Desk</span>
                        </div>
                        <h4 className="font-serif text-base font-bold text-primary leading-snug">
                          {blog.title}
                        </h4>
                      </div>

                      <div className="mt-4 pt-3 border-t border-surface-container-high/50 flex items-center justify-between text-xs">
                        <span className="text-outline text-[11px]">4–6 min read</span>
                        <Link
                          href={`/travel-guides?q=${encodeURIComponent(destination.name)}`}
                          className="font-bold text-secondary hover:text-primary inline-flex items-center gap-0.5"
                        >
                          <span>Read Field Note</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column (4 cols): Sticky Concierge Box */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high shadow-lg space-y-6">
              <div>
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1">
                  Dedicated Holiday Designer
                </span>
                <h3 className="font-serif text-2xl font-bold text-primary">
                  Plan Your {destination.name} Trip
                </h3>
                <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Tell us your dates, traveller count, and preferred hotel style. We will send a complete proposal on WhatsApp or email.
                </p>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <PackageQuoteButton
                  destination={destination.name}
                  packageTitle={`Custom ${destination.name} Journey`}
                  travelStyle="Luxury"
                  label={`Request a Custom Proposal`}
                  className="w-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary font-sans text-xs font-bold py-3.5 px-6 rounded-full shadow-md text-center block cursor-pointer"
                />

                <a
                  href={`https://wa.me/91${SITE_CONTACT.phone}?text=Hi%20Jeto,%20I'm%20planning%20a%20trip%20to%20${encodeURIComponent(destination.name)}.%20Can%20you%20help%20me%20with%20itinerary%20ideas?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full border border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10 text-xs font-bold transition-colors"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>Ask a Question on WhatsApp</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-surface-container-high space-y-2 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600">verified</span>
                  <span>Direct regional coordinator</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600">tune</span>
                  <span>Unlimited itinerary tweaks before booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600">support_agent</span>
                  <span>24/7 on-ground WhatsApp support</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── 4. MORE DESTINATIONS TO EXPLORE ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-20">
        <div className="mb-6 flex items-end justify-between gap-4 border-t border-surface-container-high pt-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary block mb-1">
              Keep Exploring
            </span>
            <h2 className="font-serif text-2xl font-bold text-primary">
              More Places to Discover
            </h2>
          </div>
          <Link
            href="/destinations"
            className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
          >
            <span>View all destinations</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherDestinations.map((item) => (
            <Link
              key={item.slug}
              href={`/destinations/${item.slug}`}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high/80 hover:border-secondary/50 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
                  {DESTINATION_REGION_LABELS[item.region]}
                </span>
                <span className="font-serif text-lg font-bold text-primary block mt-0.5">
                  {item.name}
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary text-base">arrow_forward</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
