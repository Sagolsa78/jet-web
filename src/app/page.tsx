import Link from 'next/link';
import Image from 'next/image';
import { SITE_BRAND, SITE_CONTACT, SITE_ORIGIN } from '@/data/site-content';
import { SearchCard } from '@/components/home/SearchCard';
import { CuratedPackages } from '@/components/home/CuratedPackages';
import { FaqAccordion } from '@/components/home/FaqAccordion';
import { WhatsAppButton } from '@/components/home/WhatsAppButton';
import { ClosingCta } from '@/components/home/ClosingCta';
import { DestinationMatchmakerQuiz } from '@/components/home/DestinationMatchmakerQuiz';
import { HeroBackgroundVideo } from '@/components/home/HeroBackgroundVideo';
import { PackageQuoteButton } from '@/components/holidays/PackageQuoteButton';
import { CustomerReviews } from '@/components/home/CustomerReviews';

export const metadata = {
  title: `${SITE_BRAND.name} | Bespoke Holiday Planning for Curious Travelers`,
  description:
    'Handcrafted international and domestic holiday itineraries planned by real consultants. 100% customised, clear inclusions, and dedicated on-trip support.',
  openGraph: {
    title: `${SITE_BRAND.name} | Bespoke Holiday Planning`,
    description:
      'Explore handpicked wanderlust destinations and curated holiday itineraries tailored to your family pace.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
      },
    ],
  },
};

const TRAVEL_STYLES = [
  {
    name: 'Honeymoon',
    icon: 'favorite',
    description: 'Intimate villas, sunset cruises & private dining',
    hoverColor: 'group-hover:bg-on-tertiary-container group-hover:text-on-primary',
    href: '/holidays?style=Honeymoon',
  },
  {
    name: 'Family',
    icon: 'family_restroom',
    description: 'Kid-friendly pacing, connecting suites & veg options',
    hoverColor: 'group-hover:bg-secondary group-hover:text-on-secondary',
    href: '/holidays?style=Family',
  },
  {
    name: 'Adventure',
    icon: 'explore',
    description: 'Trekking, safari wildlife tracking & scenic peaks',
    hoverColor: 'group-hover:bg-secondary group-hover:text-on-secondary',
    href: '/holidays?style=Adventure',
  },
  {
    name: 'Luxury',
    icon: 'diamond',
    description: '5-star boutique collection, butler service & transfers',
    hoverColor: 'group-hover:bg-on-tertiary-container group-hover:text-on-primary',
    href: '/holidays?style=Luxury',
  },
  {
    name: 'Culture',
    icon: 'temple_buddhist',
    description: 'Historic monuments, culinary walks & artisan encounters',
    hoverColor: 'group-hover:bg-secondary group-hover:text-on-secondary',
    href: '/holidays?style=Culture',
  },
  {
    name: 'Groups',
    icon: 'celebration',
    description: 'Milestone celebrations, reunions & corporate retreats',
    hoverColor: 'group-hover:bg-secondary group-hover:text-on-secondary',
    href: '/holidays?style=Groups',
  },
];

const POPULAR_ESCAPES = [
  {
    title: 'Bali & Nusa Islands',
    subtitle:
      'Clifftop private villas in Uluwatu, sunrise above Ubud rice terraces, and bespoke driver services for hassle-free island hops.',
    type: 'International',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200',
    className: 'lg:row-span-2 lg:col-span-2 min-h-[340px] lg:min-h-0',
    href: '/destinations/bali',
  },
  {
    title: 'Kashmir Valley',
    subtitle: 'Pristine houseboats on Dal Lake and pine-draped slopes of Gulmarg.',
    type: 'Domestic',
    image:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800',
    className: 'min-h-[250px] lg:min-h-0',
    href: '/destinations/kashmir',
  },
  {
    title: 'Dubai & Dunes',
    subtitle: 'Ultra-modern skyscrapers paired with serene sunset desert retreats.',
    type: 'International',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800',
    className: 'min-h-[250px] lg:min-h-0',
    href: '/destinations/dubai',
  },
  {
    title: 'Maldives Atolls',
    subtitle:
      'Overwater private villas with seaplane arrival and custom Jain & Pure Veg culinary arrangements.',
    type: 'International',
    image:
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1200',
    className: 'lg:col-span-2 min-h-[250px] lg:min-h-0',
    href: '/destinations/maldives',
  },
  {
    title: 'Kerala Backwaters',
    subtitle: 'Slow-paced luxury houseboat cruises and misty Munnar tea hills.',
    type: 'Domestic',
    image:
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800',
    className: 'min-h-[250px] lg:min-h-0',
    href: '/destinations/kerala',
  },
  {
    title: 'South Goa Heritage',
    subtitle: 'Secluded heritage Portuguese estates and private sunset catamaran charters.',
    type: 'Domestic',
    image:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800',
    className: 'min-h-[250px] lg:min-h-0',
    href: '/destinations/goa',
  },
];

const PLANNING_STEPS = [
  {
    step: '01',
    title: 'Tell us your plan',
    description:
      'Share your dream destinations, dates, and family preferences in a quick 2-minute conversation or WhatsApp chat.',
    tag: 'Initial Discovery',
  },
  {
    step: '02',
    title: 'Get a proposal',
    description:
      'Receive a comprehensive day-by-day interactive itinerary complete with hotel choices and transparent estimates.',
    tag: 'Interactive Itinerary',
  },
  {
    step: '03',
    title: 'Refine together',
    description:
      'Tweak boutique stays, swap day activities, and fine-tune pacing until the entire plan is 100% right for you.',
    tag: 'Unlimited Tweaks',
  },
  {
    step: '04',
    title: 'Travel with support',
    description:
      'Relax with all confirmed vouchers, dedicated drivers, and our 24/7 WhatsApp concierge on call throughout.',
    tag: 'Complete Peace of Mind',
  },
];

export default function HomePage() {
  const travelAgencyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE_BRAND.name,
    description:
      'Bespoke holiday planning for curious travelers. Handcrafted itineraries, transparent inclusions, and human travel designers.',
    url: SITE_ORIGIN,
    telephone: `+91${SITE_CONTACT.phone}`,
    email: SITE_CONTACT.email,
    taxID: SITE_CONTACT.gstin,
    priceRange: '₹₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_CONTACT.registeredCity,
      addressCountry: 'IN',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
  };

  return (
    <main id="main-content" className="flex flex-col w-full bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(travelAgencyJsonLd) }}
      />
      {/* ── 1. CINEMATIC HERO SECTION ── */}
      <section className="relative w-full overflow-hidden bg-primary pt-36 sm:pt-44 pb-32">
        {/* Dynamic Atmospheric Background Video */}
        <HeroBackgroundVideo />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="max-w-2xl text-on-primary">
            {/* Eyebrow */}
            <div className="font-sans text-[12px] font-bold text-secondary-container tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="text-secondary-container">✦</span>
              <span>BESPOKE INDIAN &amp; INTERNATIONAL ITINERARIES</span>
            </div>

            {/* Headline focused on outcomes */}
            <h1 className="font-serif text-[42px] sm:text-[54px] lg:text-[60px] font-bold leading-[1.1] tracking-[-0.02em] text-on-primary mb-5">
              Custom India &amp; international holidays,{' '}
              <span className="italic text-on-tertiary-container font-normal">planned by real travel experts.</span>
            </h1>

            {/* Description */}
            <p className="font-sans text-base sm:text-lg text-surface-container-low/90 font-light mb-6 max-w-xl leading-relaxed">
              Hand-selected boutique stays, private chauffeurs, and dedicated regional destination specialists who understand how Indian families and couples truly travel.
            </p>

            {/* Outcome-focused CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <a
                href="#curated-holidays"
                className="px-6 py-3.5 rounded-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary text-xs font-bold tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Curated Packages</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </a>

              <PackageQuoteButton
                label="Talk to a Travel Expert"
                destination="General Holiday Consultation"
                packageTitle="Bespoke Travel Inquiry"
                className="px-6 py-3.5 rounded-full border border-white/40 hover:bg-white/10 text-white text-xs font-bold tracking-wide transition-all flex items-center gap-2"
              />
            </div>

            {/* Real Social Proof / Verification Badges */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-surface-container-low font-sans text-xs pt-1 border-t border-white/15">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                <span>GSTIN Reg: {SITE_CONTACT.gstin}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                <span>4,500+ Trips Curated Since 2018</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                <span>100% Tailored • Zero Commission Stops</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. MAKEMYTRIP-STYLE SEARCH CARD (Overlaps Hero) ── */}
      <SearchCard />

      {/* ── 3. POPULAR ESCAPES (Asymmetric Mosaic Grid) ── */}
      <section className="max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-12 py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.2em] block mb-2">
              Handpicked Wanderlust
            </span>
            <h2 className="font-serif text-[38px] sm:text-[44px] font-semibold text-primary leading-tight">
              Popular Escapes for This Season
            </h2>
          </div>
          <p className="font-sans text-base text-on-surface-variant max-w-md">
            From serene backwaters to dramatic volcanic calderas, curated by our regional destination
            specialists.
          </p>
        </div>

        {/* Mosaic Grid: 4 cols, 2 rows on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 h-auto lg:h-[580px]">
          {POPULAR_ESCAPES.map((escape) => (
            <Link
              key={escape.title}
              href={escape.href}
              className={`rounded-2xl overflow-hidden relative group shadow-md transition-all duration-300 hover:shadow-2xl ${escape.className}`}
            >
              <div
                className="bg-cover bg-center absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${escape.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />

              <div className="absolute top-4 left-4 z-10">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider ${
                    escape.type === 'International'
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-primary text-on-primary'
                  }`}
                >
                  {escape.type}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-10 text-on-primary">
                <h3 className="font-serif text-2xl font-semibold text-on-primary mb-1.5 group-hover:text-secondary-container transition-colors">
                  {escape.title}
                </h3>
                <p className="font-sans text-sm text-surface-container-low/90 line-clamp-2 leading-relaxed">
                  {escape.subtitle}
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-secondary-container group-hover:underline">
                  <span>Explore Itineraries</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. CURATED PACKAGES ON WARM SAND BACKGROUND ── */}
      <CuratedPackages />

      {/* ── 5. BROWSE BY TRAVEL STYLE (6 Columns) ── */}
      <section className="max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-12 py-16">
        <div className="mb-10 text-center">
          <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.2em] block mb-2">
            How Do You Like To Travel?
          </span>
          <h2 className="font-serif text-[40px] font-semibold text-primary">
            Browse by Travel Style
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {TRAVEL_STYLES.map((style) => (
            <Link
              key={style.name}
              href={style.href}
              className="bg-surface-container-lowest rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all group flex flex-col items-center border border-surface-container-high/60"
            >
              <div
                className={`w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-secondary ${style.hoverColor} transition-colors mb-4`}
              >
                <span className="material-symbols-outlined text-2xl">{style.icon}</span>
              </div>
              <h4 className="font-serif text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition-colors">
                {style.name}
              </h4>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                {style.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 5.5 DESTINATION MATCHMAKER QUIZ ── */}
      <section className="max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-12 py-8">
        <DestinationMatchmakerQuiz />
      </section>

      {/* ── 6. DARK NAVY "WHY JETO" SECTION ── */}
      <section className="w-full bg-primary-container text-on-primary py-24 px-6 sm:px-10 lg:px-20 my-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Narrative & Pillars */}
          <div>
            <span className="font-sans text-[12px] font-bold text-secondary-container tracking-[0.2em] block mb-3 uppercase">
              The Jeto Difference
            </span>
            <h2 className="font-serif text-[38px] lg:text-[46px] font-semibold leading-[1.15] text-on-primary mb-10">
              Travel planned by people,{' '}
              <span className="italic text-on-tertiary-container font-normal">not algorithms</span>.
            </h2>

            <div className="space-y-8">
              {/* Pillar 1 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary shrink-0 flex items-center justify-center text-secondary-container shadow-sm">
                  <span className="material-symbols-outlined text-xl">palette</span>
                </div>
                <div>
                  <h4 className="font-serif text-xl font-semibold text-surface-bright mb-1">
                    Truly Custom
                  </h4>
                  <p className="font-sans text-sm text-surface-container-low/85 leading-relaxed">
                    Zero cookie-cutter templates. Every itinerary is built around your preferred wake-up
                    times, food habits, and travel style.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary shrink-0 flex items-center justify-center text-secondary-container shadow-sm">
                  <span className="material-symbols-outlined text-xl">visibility</span>
                </div>
                <div>
                  <h4 className="font-serif text-xl font-semibold text-surface-bright mb-1">
                    Clear Inclusions
                  </h4>
                  <p className="font-sans text-sm text-surface-container-low/85 leading-relaxed">
                    No hidden surprise fees or forced commercial shopping stops. Every voucher clearly
                    states what is included.
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary shrink-0 flex items-center justify-center text-secondary-container shadow-sm">
                  <span className="material-symbols-outlined text-xl">person_pin</span>
                </div>
                <div>
                  <h4 className="font-serif text-xl font-semibold text-surface-bright mb-1">
                    One Point of Contact
                  </h4>
                  <p className="font-sans text-sm text-surface-container-low/85 leading-relaxed">
                    Talk to the same seasoned travel designer from the initial moodboard till you
                    unpack your bags back home.
                  </p>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary shrink-0 flex items-center justify-center text-secondary-container shadow-sm">
                  <span className="material-symbols-outlined text-xl">support_agent</span>
                </div>
                <div>
                  <h4 className="font-serif text-xl font-semibold text-surface-bright mb-1">
                    24/7 On-Trip Support
                  </h4>
                  <p className="font-sans text-sm text-surface-container-low/85 leading-relaxed">
                    Real-time WhatsApp support team ready to assist with flight updates, driver
                    re-routing, or dining reservations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Collage */}
          <div className="relative flex justify-center items-center py-6">
            <div className="relative w-full max-w-md">
              {/* Photo 1: Couple cliffside */}
              <div className="w-4/5 h-80 rounded-2xl overflow-hidden shadow-2xl relative border-4 border-primary-container">
                <Image
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=900"
                  alt="Couple overlooking coastal scenery"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Photo 2: Family in tea garden (Overlapping) */}
              <div className="w-3/4 h-72 rounded-2xl overflow-hidden shadow-2xl -mt-28 ml-auto relative border-4 border-primary-container">
                <Image
                  src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=900"
                  alt="Family walking through scenic tea estate"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Tilted coral stamp badge */}
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2 -rotate-6 bg-on-tertiary-container text-on-primary p-5 rounded-2xl shadow-2xl text-center">
                <span className="material-symbols-outlined text-2xl block mb-1">hotel_class</span>
                <span className="block font-serif text-xl font-bold">Your trip,</span>
                <span className="block font-serif text-sm italic font-normal">your way.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. HOW IT WORKS (4 Planning Steps) ── */}
      <section className="max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-12 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.2em] block mb-2">
            Seamless Planning Process
          </span>
          <h2 className="font-serif text-[40px] font-semibold text-primary">
            From Idea to Boarding Pass in Four Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PLANNING_STEPS.map((step) => (
            <div
              key={step.step}
              className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between border border-surface-container-high/60"
            >
              <div>
                <span className="font-serif text-4xl text-secondary-container block mb-3 font-bold">
                  {step.step}
                </span>
                <h4 className="font-serif text-xl font-semibold text-primary mb-2">
                  {step.title}
                </h4>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-surface-container-high flex items-center text-secondary font-sans text-xs font-semibold">
                <span>{step.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. STORIES & PRACTICAL GUIDES (Editorial Dispatches) ── */}
      <section className="max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-12 py-16">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.2em] block mb-2">
              Editorial Dispatches
            </span>
            <h2 className="font-serif text-[40px] font-semibold text-primary">
              Stories &amp; Practical Guides
            </h2>
          </div>
          <Link
            href="/travel-guides"
            className="text-secondary font-sans text-sm font-semibold hover:underline flex items-center gap-1"
          >
            <span>View all travel guides</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Editorial Layout: Left 7 cols + Right 5 cols */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Feature Card (Left, 7 cols) */}
          <article className="lg:col-span-7 bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col border border-surface-container-high/60">
            <div className="relative h-80 w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200"
                alt="European scenic alpine rail journey"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-sans text-xs font-semibold uppercase tracking-wider">
                  Family Travel Guide
                </span>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl lg:text-[28px] font-semibold text-primary mb-3 leading-snug">
                  Traveling to Europe with Indian Parents: Complete Packing, Food &amp; Transit Guide
                </h3>
                <p className="font-sans text-base text-on-surface-variant leading-relaxed">
                  From securing apartment stays with kitchenettes to arranging wheelchair assistance
                  and finding comforting dal-rice across Swiss mountain towns without losing the
                  magic of the Alps.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-surface-container-high flex items-center justify-between text-outline font-sans text-xs">
                <span>8 min read • By Devina Roy</span>
                <Link
                  href="/travel-guides/traveling-to-europe-with-indian-parents"
                  className="text-secondary font-bold flex items-center gap-1 hover:underline"
                >
                  Read Guide <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            </div>
          </article>

          {/* Right 2 Stacked Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Card 2: Maldives Honeymoon */}
            <article className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row lg:flex-col flex-1 border border-surface-container-high/60">
              <div className="h-48 sm:w-1/2 lg:w-full overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800"
                  alt="Maldives luxury overwater villa deck"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-sans text-[11px] font-bold uppercase tracking-wider">
                    Honeymoon Special
                  </span>
                </div>
              </div>
              <div className="p-6 sm:w-1/2 lg:w-full flex-1 flex flex-col justify-between">
                <h4 className="font-serif text-xl font-semibold text-primary mb-2 leading-snug">
                  The Best Secluded Overwater Villas in Maldives for Uninterrupted Privacy
                </h4>
                <div className="flex items-center justify-between text-outline font-sans text-xs pt-4">
                  <span>5 min read</span>
                  <Link
                    href="/travel-guides/maldives-secluded-overwater-villas"
                    className="text-secondary font-bold flex items-center gap-1 hover:underline"
                  >
                    Read Guide <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </article>

            {/* Card 3: Offbeat Kashmir */}
            <article className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row lg:flex-col flex-1 border border-surface-container-high/60">
              <div className="h-48 sm:w-1/2 lg:w-full overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800"
                  alt="Pristine mountain valley in Kashmir"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-sans text-[11px] font-bold uppercase tracking-wider">
                    Domestic Secrets
                  </span>
                </div>
              </div>
              <div className="p-6 sm:w-1/2 lg:w-full flex-1 flex flex-col justify-between">
                <h4 className="font-serif text-xl font-semibold text-primary mb-2 leading-snug">
                  Offbeat Kashmir: Experiencing Gurez Valley Beyond the Tourist Circuits
                </h4>
                <div className="flex items-center justify-between text-outline font-sans text-xs pt-4">
                  <span>6 min read</span>
                  <Link
                    href="/travel-guides/offbeat-kashmir-gurez-valley"
                    className="text-secondary font-bold flex items-center gap-1 hover:underline"
                  >
                    Read Guide <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── 9. PUBLISHED TRAVELER REVIEWS ── */}
      <CustomerReviews />

      {/* ── 10. FAQ ACCORDION ── */}
      <FaqAccordion />

      {/* ── 11. CLOSING HIGH-CONVERSION CTA BAND ── */}
      <ClosingCta />

      {/* ── 12. FLOATING WHATSAPP CONCIERGE ── */}
      <WhatsAppButton />
    </main>
  );
}
