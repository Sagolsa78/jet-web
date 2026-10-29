import { SAMPLE_DESTINATIONS } from '@/data/sample-destinations';
import { DESTINATION_COLLECTIONS } from '@/data/site-content';

export type DestinationRegion = 'international' | 'domestic' | 'regional';

export type SiteDestination = {
  slug: string;
  name: string;
  region: DestinationRegion;
  image?: string;
};

const imageByName = new Map(
  SAMPLE_DESTINATIONS.map((destination) => [
    destination.name,
    destination.heroImage,
  ]),
);

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const DESTINATIONS: SiteDestination[] = [
  ...DESTINATION_COLLECTIONS.international.map((name) => ({
    slug: toSlug(name),
    name,
    region: 'international' as const,
    image: imageByName.get(name),
  })),
  ...DESTINATION_COLLECTIONS.domestic.map((name) => ({
    slug: toSlug(name),
    name,
    region: 'domestic' as const,
    image: imageByName.get(name),
  })),
  {
    slug: 'north-east',
    name: 'North-East',
    region: 'regional',
  },
];

export function getDestinationBySlug(slug: string) {
  return DESTINATIONS.find((destination) => destination.slug === slug);
}

export const DESTINATION_REGION_LABELS: Record<DestinationRegion, string> = {
  international: 'International',
  domestic: 'India',
  regional: 'Regional collection',
};