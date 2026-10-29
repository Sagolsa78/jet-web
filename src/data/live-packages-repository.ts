import crawledData from '@/data/live-crawled-packages.json';

export interface LivePackage {
  id: string;
  originalName: string;
  destination: string;
  destinationSlug: string;
  region: 'international' | 'domestic';
  duration: string;
  durationNights: number;
  durationDays: number;
  stay: string;
  hotelCategory: string;
  meals: string;
  priceWithoutFlightMin: number;
  priceWithoutFlightMax: number;
  priceWithFlightMin: number;
  priceWithFlightMax: number;
  priceRangeWithoutFlight: string;
  priceRangeWithFlight: string;
  inclusions: string[];
  customerType: string[];
  image: string;
  formattedTitle: string;
}

export interface LiveBlogSummary {
  slug: string;
  title: string;
  destination: string;
}

function parsePrice(rangeStr: string): { min: number; max: number } {
  if (!rangeStr) return { min: 0, max: 0 };
  const cleaned = rangeStr.replace(/,/g, '').trim();
  const parts = cleaned.split('-').map((s) => parseFloat(s.trim()));
  const min = !isNaN(parts[0]) ? parts[0] : 0;
  const max = parts.length > 1 && !isNaN(parts[1]) ? parts[1] : min;
  return { min, max };
}

function parseDuration(durationStr?: string | null): { nights: number; days: number } {
  if (!durationStr || !durationStr.trim()) return { nights: 0, days: 0 };
  const nMatch = durationStr.match(/(\d+)\s*N/i);
  const dMatch = durationStr.match(/(\d+)\s*D/i);
  const nights = nMatch ? parseInt(nMatch[1], 10) : (dMatch ? Math.max(0, parseInt(dMatch[1], 10) - 1) : 0);
  const days = dMatch ? parseInt(dMatch[1], 10) : (nights > 0 ? nights + 1 : 0);
  return { nights, days };
}

function formatTitle(name: string, destination: string, stay: string): string {
  if (stay && stay.trim()) {
    return `${destination} - ${stay.trim()}`;
  }
  return `${destination} Holiday Package (${name})`;
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

// Normalized array of all 433 live packages
export const LIVE_PACKAGES: LivePackage[] = (crawledData.allPackages as unknown as RawCrawledPackage[]).map((pkg) => {
  const withoutFlight = parsePrice(pkg.priceRangeWithoutFlight);
  const withFlight = parsePrice(pkg.priceRangeWithFlight);
  const { nights, days } = parseDuration(pkg.duration);

  // Fallback high quality image if asset is missing or low-res
  const defaultImage = pkg.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200';

  return {
    id: pkg.id,
    originalName: pkg.originalName,
    destination: pkg.destination,
    destinationSlug: pkg.destinationSlug,
    region: pkg.region,
    duration: pkg.duration,
    durationNights: nights,
    durationDays: days,
    stay: pkg.stay,
    hotelCategory: pkg.hotelCategory,
    meals: pkg.meals,
    priceWithoutFlightMin: withoutFlight.min,
    priceWithoutFlightMax: withoutFlight.max,
    priceWithFlightMin: withFlight.min,
    priceWithFlightMax: withFlight.max,
    priceRangeWithoutFlight: pkg.priceRangeWithoutFlight,
    priceRangeWithFlight: pkg.priceRangeWithFlight,
    inclusions: pkg.inclusions || [],
    customerType: pkg.customerType || ['For All'],
    image: defaultImage,
    formattedTitle: formatTitle(pkg.originalName, pkg.destination, pkg.stay),
  };
});

// Getter by destination slug
export function getLivePackagesByDestination(slug: string): LivePackage[] {
  const normalized = slug.toLowerCase().trim();
  return LIVE_PACKAGES.filter((p) => p.destinationSlug.toLowerCase() === normalized);
}

// Getter for blogs by destination
export function getLiveBlogsByDestination(slug: string): LiveBlogSummary[] {
  const blogsMap = (crawledData.blogs || {}) as Record<string, LiveBlogSummary[]>;
  return blogsMap[slug.toLowerCase()] || [];
}
