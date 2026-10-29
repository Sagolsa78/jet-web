import { HolidayPackage, ItineraryDay, TravelStyle } from '@/types';
import { SAMPLE_PACKAGES } from '@/data/sample-packages';
import crawledData from '@/data/live-crawled-packages.json';

export const toSlug = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function parsePrice(rangeStr?: string | null): { min: number; max: number; hasValidPrice: boolean } {
  if (!rangeStr || typeof rangeStr !== 'string') {
    return { min: 0, max: 0, hasValidPrice: false };
  }
  // Strip currency symbols (₹, $), commas, and whitespace
  const cleaned = rangeStr.replace(/[₹$,\s]/g, '').trim();
  if (!cleaned) return { min: 0, max: 0, hasValidPrice: false };

  const parts = cleaned.split('-').map((s) => parseFloat(s.trim()));
  const first = !isNaN(parts[0]) && parts[0] > 0 ? parts[0] : 0;
  const second = parts.length > 1 && !isNaN(parts[1]) && parts[1] > 0 ? parts[1] : first;

  if (first === 0 && second === 0) {
    return { min: 0, max: 0, hasValidPrice: false };
  }

  const min = Math.min(first, second);
  const max = Math.max(first, second);
  return { min, max, hasValidPrice: min > 0 };
}

export function parseDuration(durationStr?: string | null): { nights: number; days: number } {
  if (!durationStr || !durationStr.trim()) return { nights: 0, days: 0 };
  const nMatch = durationStr.match(/(\d+)\s*N/i);
  const dMatch = durationStr.match(/(\d+)\s*D/i);
  const nights = nMatch ? parseInt(nMatch[1], 10) : (dMatch ? Math.max(0, parseInt(dMatch[1], 10) - 1) : 0);
  const days = dMatch ? parseInt(dMatch[1], 10) : (nights > 0 ? nights + 1 : 0);
  return { nights, days };
}

export function inferTravelStyle(destination: string, customerType: string[] = []): TravelStyle {
  if (customerType.includes('Couple')) return 'Honeymoon';
  const destLower = destination.toLowerCase();
  if (destLower.includes('maldives') || destLower.includes('mauritius')) return 'Honeymoon';
  if (destLower.includes('swiss') || destLower.includes('dubai')) return 'Luxury';
  if (destLower.includes('ladakh') || destLower.includes('himachal') || destLower.includes('uttarakhand')) return 'Adventure';
  if (destLower.includes('rajasthan') || destLower.includes('vietnam') || destLower.includes('turkey') || destLower.includes('japan')) return 'Culture';
  if (destLower.includes('goa')) return 'Weekend';
  return 'Family';
}

function synthesizeItinerary(
  destination: string,
  stay: string,
  durationDays: number,
  inclusions: string[]
): ItineraryDay[] {
  const days: ItineraryDay[] = [];

  // Day 1: Arrival
  days.push({
    dayNumber: 1,
    title: `Arrival in ${destination} & Leisure`,
    description: `Private airport chauffeur pickup and check-in to your hotel. Relax after your flight and enjoy evening leisure strolls through nearby markets or promenade.`,
    activities: ['Private airport transfer', 'Hotel check-in', 'Evening leisure & dining'],
  });

  // Middle Days: Distribute inclusions
  const middleDayCount = Math.max(1, durationDays - 2);
  const activitiesPerDay = Math.ceil(inclusions.length / middleDayCount) || 1;

  for (let i = 0; i < middleDayCount; i++) {
    const dayNumber = i + 2;
    const startIdx = i * activitiesPerDay;
    const dayActs = inclusions.slice(startIdx, startIdx + activitiesPerDay);

    const title = dayActs[0] ? dayActs[0] : `${destination} Sightseeing & Discovery (Day ${dayNumber})`;
    const desc = dayActs.length > 0
      ? `Curated activity highlights: ${dayActs.join(' • ')}. Includes private vehicle transfers and local permits as arranged.`
      : `Explore the cultural landmarks, scenic viewpoints, and local artisan markets of ${destination} with your private driver.`;

    days.push({
      dayNumber,
      title,
      description: desc,
      activities: dayActs.length > 0 ? dayActs : ['Breakfast at hotel', 'Private sightseeing tour', 'Scenic photo stops'],
    });
  }

  // Final Day: Departure
  if (durationDays > 1) {
    days.push({
      dayNumber: durationDays,
      title: `Hotel Check-Out & Airport Departure`,
      description: `Enjoy buffet breakfast at your hotel. Dedicated private vehicle transfer to the airport for your onward flight back home with memories of ${destination}.`,
      activities: ['Buffet breakfast', 'Hotel check-out', 'Private airport transfer with baggage assistance'],
    });
  }

  return days;
}

interface RawCrawledPackage {
  id: string;
  originalName: string;
  destination: string;
  destinationSlug: string;
  region: 'international' | 'domestic';
  duration: string;
  stay: string;
  hotelCategory: string;
  meals: string;
  priceRangeWithoutFlight: string;
  priceRangeWithFlight: string;
  inclusions?: string[];
  customerType?: string[];
  image?: string;
}

// Convert all live crawled packages to HolidayPackage interface
const convertedLivePackages: HolidayPackage[] = (crawledData.allPackages as unknown as RawCrawledPackage[]).map((pkg) => {
  const { nights, days } = parseDuration(pkg.duration);
  const priceParsed = parsePrice(pkg.priceRangeWithoutFlight);
  const style = inferTravelStyle(pkg.destination, pkg.customerType || []);

  const rawCleanId = String(pkg.id).replace(/jeto-/i, '').trim();
  const slugBase = pkg.stay ? `${pkg.destinationSlug}-${toSlug(pkg.stay)}` : `${pkg.destinationSlug}-${toSlug(pkg.originalName)}`;
  const slug = `${slugBase}-${rawCleanId}`;

  const title = pkg.stay && pkg.stay.trim()
    ? `${pkg.destination}: ${pkg.stay.trim()}`
    : `${pkg.destination} ${pkg.originalName} Holiday`;

  const fallbackImages: Record<string, string> = {
    bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200',
    thailand: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200',
    singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=1200',
    kashmir: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200',
    andaman: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200',
    kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1200',
    rajasthan: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1200',
    himachal: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200',
    vietnam: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200',
  };

  const heroImage = pkg.image || fallbackImages[pkg.destinationSlug] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200';

  const hasExplicitInclusions = Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0;
  const inclusions: string[] = hasExplicitInclusions
    ? pkg.inclusions!
    : [
        nights > 0
          ? `${nights} Nights accommodation in ${pkg.hotelCategory || 'selected accommodation'}`
          : `Accommodation in ${pkg.hotelCategory || 'selected tier'}`,
        pkg.meals ? `Meal plan: ${pkg.meals}` : 'Daily breakfast (subject to hotel confirmation)',
        'Destination sightseeing as per customized itinerary',
        'Custom quote and inclusions confirmed upon enquiry',
      ];

  const itinerary = synthesizeItinerary(pkg.destination, pkg.stay, days, inclusions);

  return {
    id: pkg.id,
    slug,
    title,
    destinationId: pkg.destinationSlug,
    durationDays: days,
    durationNights: nights,
    startingPrice: priceParsed.hasValidPrice ? Math.round(priceParsed.min) : undefined,
    currency: 'INR',
    priceBasis: priceParsed.hasValidPrice
      ? 'per person · excluding flights'
      : 'Price on request / details being updated',
    includesFlights: false,
    priceAssumptions: priceParsed.hasValidPrice
      ? `Indicative land package price per person on twin-sharing basis (Low/Mid Season). Includes ${pkg.hotelCategory || 'hotel stays'}, ${pkg.meals || 'breakfast'}, airport transfers on private basis, and sightseeing permits. Flights quoted at actual live fares (~₹${pkg.priceRangeWithFlight || 'bundled upon request'}).`
      : 'Pricing depends on specific dates, selected hotel tiers, and seasonal airfares. Please request an exact quotation from our consultants.',
    style,
    heroImage,
    gallery: [heroImage],
    description: `Customizable ${pkg.duration || 'holiday'} itinerary exploring ${pkg.stay || pkg.destination}. Features recommended ${pkg.hotelCategory || 'selected accommodation'}, ${pkg.meals || 'breakfast as selected'}, and private land arrangements.`,
    itinerary,
    inclusions,
    exclusions: [
      'International or domestic flights (can be bundled at actual live rates)',
      'Tourist visa fees & mandatory medical insurance',
      'Personal expenses, laundry, and minibar charges',
      'Meals not specified in the confirmed inclusions list',
    ],
    tags: [pkg.destination, pkg.hotelCategory, ...(pkg.customerType || [])].filter(Boolean),
    isPublished: true,
    dataSource: 'official_crawl',
    contentStatus: 'published',
    itineraryType: 'suggested_draft',
    imageStatus: pkg.image ? 'verified' : 'curated_stock',
  };
});

// Curated sample packages with verified badge assignments
const curatedSamplePackages: HolidayPackage[] = SAMPLE_PACKAGES.map((pkg) => {
  let badge: HolidayPackage['badge'] = undefined;
  if (pkg.slug === 'swiss-alps-glacier-express' || pkg.slug === 'royal-rajasthan-palaces') {
    badge = 'Bestseller';
  } else if (pkg.slug === 'maldives-luxury-escape') {
    badge = 'Honeymoon';
  } else if (pkg.slug === 'japan-cherry-blossom') {
    badge = 'Limited dates';
  } else if (pkg.slug === 'kashmir-valley-retreat') {
    badge = 'Family friendly';
  }

  return {
    ...pkg,
    priceBasis: pkg.startingPrice ? 'per person · excluding flights' : 'Price on request / details being updated',
    includesFlights: false,
    itineraryType: 'verified',
    dataSource: 'curated_sample',
    contentStatus: 'verified',
    imageStatus: 'verified',
    badge,
  };
});

// Master unified inventory: Sample packages (with handcrafted deep itineraries) + all live crawled packages
// Deduplicate by slug to ensure 100% uniqueness and zero ambiguous collisions
const seenSlugs = new Set<string>();
export const UNIFIED_PACKAGES: HolidayPackage[] = [];

for (const pkg of [...curatedSamplePackages, ...convertedLivePackages]) {
  if (!seenSlugs.has(pkg.slug.toLowerCase())) {
    seenSlugs.add(pkg.slug.toLowerCase());
    UNIFIED_PACKAGES.push(pkg);
  }
}

// Helper to look up any package by slug (exact match only)
export function getPackageBySlug(slug: string): HolidayPackage | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();
  return UNIFIED_PACKAGES.find((p) => p.slug.toLowerCase() === normalized);
}

// Get all slugs for static generation
export function getAllPackageSlugs(): string[] {
  return UNIFIED_PACKAGES.map((p) => p.slug);
}
