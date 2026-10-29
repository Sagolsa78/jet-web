import { MetadataRoute } from 'next';
import { DESTINATIONS } from '@/data/destinations';
import { getAllPackageSlugs } from '@/data/packages-unified';
import { getAllUnifiedGuideSlugs } from '@/data/travel-guides-unified';
import { SITE_ORIGIN } from '@/data/site-content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_ORIGIN;

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/holidays`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/destinations`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/multi-city`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${baseUrl}/travel-guides`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.85 },
    { url: `${baseUrl}/trip-builder`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/help-me-choose`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/custom-holiday`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/reviews`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.6 },
  ];

  const destinationPages: MetadataRoute.Sitemap = DESTINATIONS.map((dest) => ({
    url: `${baseUrl}/destinations/${dest.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const packagePages: MetadataRoute.Sitemap = getAllPackageSlugs().map((slug) => ({
    url: `${baseUrl}/holidays/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  const guidePages: MetadataRoute.Sitemap = getAllUnifiedGuideSlugs().map((slug) => ({
    url: `${baseUrl}/travel-guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...destinationPages, ...packagePages, ...guidePages];
}