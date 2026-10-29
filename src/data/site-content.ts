export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://www.jetovacations.com';

export const SITE_BRAND = {
  name: 'Jeto Vacations',
  tagline: 'No Tension, Only Vacation',
  canonicalUrl: SITE_ORIGIN,
};

export const SITE_CONTACT = {
  phone: process.env.NEXT_PUBLIC_JETO_PHONE || '8882579628',
  email: process.env.NEXT_PUBLIC_JETO_EMAIL || 'support@jetovacations.com',
  gstin: process.env.NEXT_PUBLIC_JETO_GSTIN || '07AAECJ6467D1ZI',
  registeredAddress:
    '1st floor, H-103, Lane No. 2, Saidulajab, Near Saket Metro station, New Delhi 110030',
  supportHours: 'Mon–Sat, 9:00 AM – 7:00 PM IST',
  registeredCity: 'New Delhi',
  registeredCountry: 'India',
};

export const DESTINATION_COLLECTIONS = {
  international: [
    'Switzerland',
    'Maldives',
    'Bali',
    'Japan',
    'Vietnam',
    'Dubai',
    'New Zealand',
    'Thailand',
    'Singapore',
    'Malaysia',
    'Mauritius',
    'Sri Lanka',
    'Turkey',
    'Hong Kong',
    'Philippines',
    'Azerbaijan',
    'Kazakhstan',
    'Georgia',
  ],
  domestic: [
    'Kerala',
    'Goa',
    'Rajasthan',
    'Himachal',
    'Andaman',
    'Kashmir',
    'Sikkim-Darjeeling',
    'Meghalaya',
    'Ladakh',
    'Uttarakhand',
  ],
};

export const SERVICE_PROMISES = [
  {
    icon: 'explore',
    title: 'Right Guidance',
    description:
      'Travel experts help you compare options and shape an itinerary around your needs.',
  },
  {
    icon: 'price_check',
    title: 'Clear Pricing',
    description:
      'Transparent pricing and value benchmarking, with trip details explained.',
  },
  {
    icon: 'support_agent',
    title: 'Travel Support',
    description:
      'Help with visa paperwork and on-ground travel questions.',
  },
];

export const TRIP_PLANNING_STEPS = [
  {
    number: '01',
    title: 'Understand your needs',
    description:
      'Talk through your budget, interests, dates, and travel concerns.',
  },
  {
    number: '02',
    title: 'Expert customisation',
    description:
      'Review a tailored itinerary and travel-partner options.',
  },
  {
    number: '03',
    title: 'Seamless execution',
    description:
      'Coordinate flights, visas, stays, and transport for your trip.',
  },
  {
    number: '04',
    title: 'On-ground care',
    description:
      'Get support with local drivers, guides, and travel issues.',
  },
];