import { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/data/site-content';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/proposal/', '/api/'],
    },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
