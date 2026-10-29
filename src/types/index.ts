export type TravelStyle = 'Honeymoon' | 'Family' | 'Adventure' | 'Luxury' | 'Culture' | 'Weekend';

export interface Destination {
  id: string;
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  gallery: string[];
  region: string;
  tags: string[];
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  image?: string;
}

export interface HolidayPackage {
  id: string;
  slug: string;
  title: string;
  destinationId: string;
  durationDays: number;
  durationNights: number;
  startingPrice?: number;
  currency: string;
  priceAssumptions?: string;
  priceBasis?: string;
  includesFlights?: boolean;
  style: TravelStyle;
  heroImage: string;
  gallery: string[];
  description: string;
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  tags: string[];
  badge?: 'Bestseller' | 'Limited dates' | 'Family friendly' | 'Honeymoon';
  isPublished: boolean;
  dataSource?: 'curated_sample' | 'official_crawl' | 'supplier_direct';
  itineraryType?: 'verified' | 'suggested_draft';
  contentStatus?: 'published' | 'draft' | 'needs_review' | 'verified';
  verifiedAt?: string;
  imageStatus?: 'verified' | 'curated_stock' | 'pending';
}

export interface PackageCatalogueSummary {
  id: string;
  slug: string;
  title: string;
  destinationId: string;
  durationDays: number;
  durationNights: number;
  startingPrice?: number;
  currency: string;
  priceBasis?: string;
  includesFlights?: boolean;
  style: TravelStyle;
  heroImage: string;
  badge?: 'Bestseller' | 'Limited dates' | 'Family friendly' | 'Honeymoon';
  description: string;
  inclusions: string[];
  tags: string[];
}

export interface EnquiryFormInputs {
  fullName: string;
  email: string;
  phone: string;
  destination?: string;
  departureCity: string;
  travelDate?: string;
  durationDays?: number;
  travellerCount: {
    adults: number;
    children: number;
  };
  budgetRange: string;
  travelStyle?: TravelStyle;
  notes: string;
  consent: boolean;
}