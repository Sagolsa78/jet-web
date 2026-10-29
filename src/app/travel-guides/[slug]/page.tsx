import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getUnifiedGuideBySlug, getAllUnifiedGuideSlugs } from '@/data/travel-guides-unified';
import { UNIFIED_PACKAGES } from '@/data/packages-unified';
import { PackageQuoteButton } from '@/components/holidays/PackageQuoteButton';
import { SITE_BRAND, SITE_CONTACT } from '@/data/site-content';

export function generateStaticParams() {
  return getAllUnifiedGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getUnifiedGuideBySlug(slug);
  if (!guide) return { title: 'Guide Not Found' };

  return {
    title: `${guide.title} | ${SITE_BRAND.name} Travel Guides`,
    description: guide.subtitle,
    openGraph: {
      title: guide.title,
      description: guide.subtitle,
      images: [{ url: guide.heroImage }],
    },
  };
}

export default async function TravelGuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getUnifiedGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedPackage = guide.relatedPackageSlug
    ? UNIFIED_PACKAGES.find((p) => p.slug === guide.relatedPackageSlug)
    : guide.destination
    ? UNIFIED_PACKAGES.find((p) => p.destinationId.toLowerCase() === guide.destination?.toLowerCase() || p.destinationId.toLowerCase() === guide.destinationSlug?.toLowerCase())
    : null;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.subtitle,
    image: [guide.heroImage],
    datePublished: '2025-01-15T08:00:00+05:30',
    dateModified: '2025-02-10T09:00:00+05:30',
    author: {
      '@type': 'Person',
      name: guide.author.name,
      jobTitle: guide.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_BRAND.name,
      url: 'https://jetovacations.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://jetovacations.com/travel-guides/${guide.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* ── 1. ARTICLE HERO ── */}
      <section className="relative h-[60vh] min-h-[460px] w-full overflow-hidden bg-primary pt-24">
        <Image
          src={guide.heroImage}
          alt={guide.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />

        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-6 sm:px-10 pb-12 text-on-primary">
          <Link
            href="/travel-guides"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-surface-container-low/80 hover:text-white transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>All Travel Guides</span>
          </Link>

          <div className="flex items-center gap-3 text-xs text-secondary-container font-bold uppercase tracking-wider mb-2">
            <span>{guide.category} Travel</span>
            <span>•</span>
            <span>{guide.readTime}</span>
            <span>•</span>
            <span>{guide.publishedDate}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-on-primary leading-tight mb-4">
            {guide.title}
          </h1>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-9 h-9 rounded-full bg-secondary-container/40 text-secondary-container font-bold flex items-center justify-center text-sm border border-secondary-container/40">
              {guide.author.name[0]}
            </div>
            <div>
              <span className="font-sans text-xs font-bold block text-white">
                Written by {guide.author.name}
              </span>
              <span className="font-sans text-[11px] text-surface-container-low/70 block">
                {guide.author.role} at {SITE_BRAND.name}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ARTICLE BODY & SIDEBAR ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Reading Column (8 cols) */}
          <main className="lg:col-span-8 max-w-3xl">
            {/* Lead Summary Callout */}
            <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-secondary mb-10 text-sm sm:text-base text-primary font-medium leading-relaxed italic">
              &ldquo;{guide.summary}&rdquo;
            </div>

            {/* Chapters */}
            <div className="space-y-12">
              {guide.content.map((section, idx) => (
                <section key={idx} className="space-y-4">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary pt-2">
                    {section.sectionTitle}
                  </h2>

                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="font-sans text-base leading-relaxed text-on-surface-variant">
                      {p}
                    </p>
                  ))}

                  {/* Callout Box */}
                  {section.calloutBox && (
                    <div
                      className={`p-5 rounded-2xl border my-6 text-xs sm:text-sm leading-relaxed ${
                        section.calloutBox.type === 'food'
                          ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                          : section.calloutBox.type === 'logistics'
                          ? 'bg-sky-50/70 border-sky-200 text-sky-950'
                          : 'bg-teal-50/70 border-teal-200 text-teal-950'
                      }`}
                    >
                      <div className="font-bold mb-1.5 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">
                          {section.calloutBox.type === 'food'
                            ? 'restaurant'
                            : section.calloutBox.type === 'logistics'
                            ? 'commute'
                            : 'tips_and_updates'}
                        </span>
                        <span>{section.calloutBox.title}</span>
                      </div>
                      <p>{section.calloutBox.text}</p>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Article Tags */}
            <div className="pt-8 mt-12 border-t border-surface-container-high flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-outline uppercase tracking-wider mr-2">Tags:</span>
              {guide.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-surface-container text-on-surface-variant text-xs px-3 py-1 rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </main>

          {/* Right Sidebar (4 cols): Related Package & Consultant Card */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Related Package Card */}
            {relatedPackage && (
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-high shadow-md">
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-2">
                  Matching Curated Itinerary
                </span>
                <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={relatedPackage.heroImage}
                    alt={relatedPackage.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-primary/90 text-on-primary text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {relatedPackage.durationNights}N / {relatedPackage.durationDays}D
                  </div>
                </div>

                <h3 className="font-serif text-lg font-bold text-primary mb-1">
                  {relatedPackage.title}
                </h3>
                <p className="font-sans text-xs text-on-surface-variant line-clamp-2 mb-4">
                  {relatedPackage.description}
                </p>

                <div className="pt-3 border-t border-surface-container-high flex items-center justify-between mb-4">
                  <span className="text-xs font-serif font-bold text-primary">
                    Starting from ₹{relatedPackage.startingPrice?.toLocaleString('en-IN')}
                  </span>
                  <Link
                    href={`/holidays/${relatedPackage.slug}`}
                    className="text-xs font-bold text-secondary hover:underline"
                  >
                    View details &rarr;
                  </Link>
                </div>

                <PackageQuoteButton
                  packageTitle={relatedPackage.title}
                  destination={guide.tags[0]}
                  budgetRange={relatedPackage.startingPrice ? `₹${relatedPackage.startingPrice.toLocaleString('en-IN')}` : undefined}
                  travelStyle={relatedPackage.style}
                  duration={`${relatedPackage.durationDays}D / ${relatedPackage.durationNights}N`}
                  label="Customise This Trip"
                  className="w-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary text-xs font-bold py-3 px-4 rounded-xl shadow-sm text-center block"
                />
              </div>
            )}

            {/* Direct Consultant Contact Box */}
            <div className="bg-primary text-on-primary p-6 rounded-3xl space-y-4">
              <span className="font-sans text-[11px] font-bold text-secondary-container uppercase tracking-wider block">
                Speak with a Consultant
              </span>
              <h4 className="font-serif text-xl font-bold">
                Have specific family questions?
              </h4>
              <p className="font-sans text-xs text-surface-container-low/80 leading-relaxed">
                Connect directly with our planning desk on WhatsApp. We can review flight routings, wheelchair needs, and recommend vetted vegetarian dining for your journey.
              </p>
              <a
                href={`https://wa.me/91${SITE_CONTACT.phone}?text=Hi%20Jeto,%20I%20read%20your%20guide%20on%20${encodeURIComponent(guide.title)}%20and%20had%20some%20questions.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#25D366] text-white text-xs font-bold shadow-md hover:bg-[#22bf5b] transition-colors"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>Chat with {guide.author.name}</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
