import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  getAllUnifiedGuideSlugs,
  getUnifiedGuideBySlug,
} from '@/data/travel-guides-unified';
import { SITE_BRAND } from '@/data/site-content';

export const instant = false;

export function generateStaticParams() {
  return getAllUnifiedGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getUnifiedGuideBySlug(slug);

  return {
    title: guide
      ? `${guide.title} | ${SITE_BRAND.name}`
      : `Travel Guide Not Available | ${SITE_BRAND.name}`,
  };
}

export default async function LegacyBlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getUnifiedGuideBySlug(slug);

  if (guide) {
    redirect(`/travel-guides/${encodeURIComponent(guide.slug)}`);
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-6 pb-20 pt-40">
      <h1 className="font-serif text-3xl font-semibold text-primary">
        This travel guide is not available in the current library
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
        We could not find a migrated article for this legacy URL. Browse the current verified travel
        guide collection instead.
      </p>
      <Link
        href="/travel-guides"
        className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary"
      >
        Browse travel guides
      </Link>
    </div>
  );
}
