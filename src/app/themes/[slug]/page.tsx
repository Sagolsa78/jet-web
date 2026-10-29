import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SITE_BRAND } from '@/data/site-content';
import { SAMPLE_PACKAGES } from '@/data/sample-packages';
import { SAMPLE_DESTINATIONS } from '@/data/sample-destinations';
import { PackageQuoteButton } from '@/components/holidays/PackageQuoteButton';

interface ThemeConfig {
  slug: string;
  name: string;
  styleKey: string;
  headline: string;
  description: string;
  heroImage: string;
}

const TRAVEL_THEMES: ThemeConfig[] = [
  {
    slug: 'honeymoon',
    name: 'Honeymoon',
    styleKey: 'Honeymoon',
    headline: 'Intimate Escapes for Two',
    description:
      'Overwater ocean villas, private candlelight dining on deserted sandbanks, sunset catamarans, and handpicked boutique sanctuaries designed for romance.',
    heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=1600',
  },
  {
    slug: 'family',
    name: 'Family',
    styleKey: 'Family',
    headline: 'Multi-Generational Travel Made Easy',
    description:
      'Relaxed travel pacing, apart-hotels with kitchenettes, smooth private transfers, kid-friendly adventures, and reassuring pure vegetarian & Jain dining support.',
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1600',
  },
  {
    slug: 'adventure',
    name: 'Adventure',
    styleKey: 'Adventure',
    headline: 'Big Landscapes & Scenic Thrills',
    description:
      'Self-drive SUV routes across New Zealand fjords, glacier walks in the Swiss Alps, coral reef dives in the Andaman Sea, and alpine trails in Kashmir.',
    heroImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&q=80&w=1600',
  },
  {
    slug: 'luxury',
    name: 'Luxury',
    styleKey: 'Luxury',
    headline: 'Uncompromised Comfort & Privacy',
    description:
      '5-star private island retreats, dedicated chauffeur service, royal heritage palaces, private seaplane charters, and bespoke culinary concierge.',
    heroImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1600',
  },
  {
    slug: 'culture',
    name: 'Culture',
    styleKey: 'Culture',
    headline: 'Artisan Heritage & Culinary Rhythms',
    description:
      'Private tea master ceremonies in Kyoto, sandstone fortresses in Rajasthan, colonial quarters in Hanoi, and sacred temple walks across Bali.',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1600',
  },
  {
    slug: 'weekend',
    name: 'Weekend',
    styleKey: 'Weekend',
    headline: 'Short Rejuvenating Getaways',
    description:
      'Curated 4 to 5-day retreats to Kerala, Goa, and Andaman designed to maximize relaxation and recharge without exhausting your annual leave balance.',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1600',
  },
];

function getThemeBySlug(slug: string) {
  return TRAVEL_THEMES.find((theme) => theme.slug === slug);
}

export function generateStaticParams() {
  return TRAVEL_THEMES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const theme = getThemeBySlug(slug);

  if (!theme) {
    return { title: `Travel style not found | ${SITE_BRAND.name}` };
  }

  return {
    title: `${theme.name} Holiday Packages | ${SITE_BRAND.name}`,
    description: theme.description,
    openGraph: {
      title: `${theme.name} Holidays | ${SITE_BRAND.name}`,
      description: theme.description,
      images: [{ url: theme.heroImage }],
    },
  };
}

export default async function ThemePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = getThemeBySlug(slug);

  if (!theme) {
    notFound();
  }

  // Filter matching packages
  const matchingPackages = SAMPLE_PACKAGES.filter(
    (pkg) => pkg.style === theme.styleKey || pkg.tags.includes(theme.styleKey)
  );

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* ── 1. EDITORIAL HERO ── */}
      <section className="relative h-[55vh] min-h-[420px] w-full overflow-hidden bg-primary text-on-primary flex items-center justify-center text-center px-6 pt-24">
        <Image
          src={theme.heroImage}
          alt={theme.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/75 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <Link
            href="/holidays"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-surface-container-low/80 hover:text-white transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>All Travel Styles</span>
          </Link>

          <span className="text-secondary-container text-xs uppercase tracking-[0.2em] font-bold block mb-2">
            ✦ Curated Travel Theme
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-on-primary mb-4 leading-tight">
            {theme.headline}
          </h1>
          <p className="font-sans text-sm sm:text-base text-surface-container-low/90 max-w-xl mx-auto font-light leading-relaxed">
            {theme.description}
          </p>
        </div>
      </section>

      {/* ── 2. MATCHING PACKAGES ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">
              Handpicked Itineraries
            </span>
            <h2 className="font-serif text-3xl font-bold text-primary">
              Signature {theme.name} Packages
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant">
            Showing {matchingPackages.length} curated blueprints for {theme.name.toLowerCase()} travelers
          </p>
        </div>

        {matchingPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matchingPackages.map((pkg) => {
              const destination = SAMPLE_DESTINATIONS.find((d) => d.id === pkg.destinationId);
              const formattedPrice = pkg.startingPrice
                ? `₹${pkg.startingPrice.toLocaleString('en-IN')}`
                : 'Custom';

              return (
                <article
                  key={pkg.id}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-surface-container-high/80 group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={pkg.heroImage}
                      alt={pkg.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-60" />

                    <div className="absolute top-3 left-3 bg-primary/90 text-on-primary text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {pkg.durationNights}N / {pkg.durationDays}D
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-secondary font-sans text-xs font-semibold mb-1">
                        <span>{destination?.name}</span>
                        <span className="text-outline text-[11px]">{pkg.style}</span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                        <Link href={`/holidays/${pkg.slug}`}>{pkg.title}</Link>
                      </h3>

                      <p className="font-sans text-xs text-on-surface-variant mb-4 line-clamp-2 leading-relaxed">
                        {pkg.description}
                      </p>

                      <div className="border-t border-surface-container-high/60 pt-3 pb-3 mb-2">
                        <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
                          Inclusions Highlight
                        </span>
                        <ul className="space-y-1 text-xs text-on-surface-variant">
                          {pkg.inclusions.slice(0, 3).map((inc) => (
                            <li key={inc} className="flex items-start gap-1.5">
                              <span className="material-symbols-outlined text-sm text-teal-600 shrink-0 mt-0.5">check</span>
                              <span className="truncate">{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-surface-container-high flex items-center justify-between mt-auto">
                      <div>
                        <span className="block font-sans text-[10px] text-outline uppercase tracking-wider">
                          Starting from
                        </span>
                        <span className="font-serif text-lg font-bold text-primary">
                          {formattedPrice}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/holidays/${pkg.slug}`}
                          className="text-secondary font-sans text-xs font-semibold hover:text-primary flex items-center gap-0.5"
                        >
                          <span>Itinerary</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>

                        <PackageQuoteButton
                          packageTitle={pkg.title}
                          destination={destination?.name || pkg.title}
                          budgetRange={formattedPrice}
                          travelStyle={pkg.style}
                          duration={`${pkg.durationDays}D / ${pkg.durationNights}N`}
                          label="Customise"
                          className="bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-surface-container-low rounded-3xl border border-surface-container-high">
            <h3 className="text-xl font-serif font-bold text-primary mb-2">
              Bespoke {theme.name} itineraries planned upon request
            </h3>
            <p className="text-on-surface-variant text-sm mb-6 max-w-md mx-auto">
              Tell our trip designers what you have in mind and we will craft a private {theme.name.toLowerCase()} itinerary from scratch.
            </p>
            <PackageQuoteButton
              packageTitle={`${theme.name} Custom Holiday`}
              destination="Custom"
              travelStyle={theme.styleKey}
              label={`Plan a Custom ${theme.name} Trip`}
              className="bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary px-6 py-2.5 rounded-full text-xs font-bold shadow-md"
            />
          </div>
        )}

        {/* Footer Explorer CTA */}
        <div className="mt-16 text-center">
          <p className="text-xs text-on-surface-variant mb-4">
            Looking for other destinations or travel styles?
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/holidays"
              className="px-6 py-2.5 rounded-full border border-surface-container-high bg-surface-container-lowest hover:bg-surface-container text-primary text-xs font-bold transition-colors"
            >
              Browse All 9 Packages
            </Link>
            <Link
              href="/destinations"
              className="px-6 py-2.5 rounded-full border border-surface-container-high bg-surface-container-lowest hover:bg-surface-container text-primary text-xs font-bold transition-colors"
            >
              Explore Destinations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
