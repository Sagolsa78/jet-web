import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    const legacyDestinationSlugs: Record<string, string> = {
      andaman: 'andaman',
      azerbaijan: 'azerbaijan',
      bali: 'bali',
      dubai: 'dubai',
      georgia: 'georgia',
      goa: 'goa',
      himachal: 'himachal',
      hongkong: 'hong-kong',
      kashmir: 'kashmir',
      kazakhstan: 'kazakhstan',
      kerala: 'kerala',
      ladakh: 'ladakh',
      malaysia: 'malaysia',
      maldives: 'maldives',
      mauritius: 'mauritius',
      meghalaya: 'meghalaya',
      northeast: 'north-east',
      philippines: 'philippines',
      rajasthan: 'rajasthan',
      sikkim: 'sikkim-darjeeling',
      singapore: 'singapore',
      srilanka: 'sri-lanka',
      thailand: 'thailand',
      turkey: 'turkey',
      uttarakhand: 'uttarakhand',
      vietnam: 'vietnam',
    };

    return [
      { source: '/newabout', destination: '/about', permanent: true },
      { source: '/newreview', destination: '/reviews', permanent: true },
      { source: '/newselector', destination: '/help-me-choose', permanent: true },
      { source: '/quoteform/qr1', destination: '/custom-holiday', permanent: true },
      { source: '/tnc', destination: '/terms', permanent: true },
      { source: '/newlogin', destination: '/contact', permanent: true },
      { source: '/hiring', destination: '/contact', permanent: true },
      { source: '/newblogs', destination: '/travel-guides', permanent: true },
      ...Object.entries(legacyDestinationSlugs).map(([legacySlug, slug]) => ({
        source: `/new/${legacySlug}`,
        destination: `/destinations/${slug}`,
        permanent: true,
      })),
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        pathname: '/**',
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
