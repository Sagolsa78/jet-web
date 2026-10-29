import { TRAVEL_GUIDES, TravelGuide } from '@/data/travel-guides';
import crawledData from '@/data/live-crawled-packages.json';

export interface ExtendedTravelGuide extends TravelGuide {
  destination?: string;
  destinationSlug?: string;
  isLongFormLead?: boolean;
}

const DESTINATION_IMAGES: Record<string, string> = {
  bali: 'https://images.ctfassets.net/7ij5e7o2r4ia/1tNx9zGuY19xUlPlr4YXaS/821f38a0f7c2649fcdb644ee62766dfb/jpeg-optimizer_1-1-.png',
  singapore: 'https://images.ctfassets.net/7ij5e7o2r4ia/12gqrdfm8R7fmtR6wTZDrI/dc40ae39ad3f298c43bb1c9c4963818d/WhatsApp_Image_2024-03-13_at_6.25.30_PM__5_.jpeg',
  thailand: 'https://images.ctfassets.net/7ij5e7o2r4ia/nYQ1e0sYFP1DHltvw4Yte/51f2532d576a9b28e448a773167a276b/Phuket_beach_side_hotel.jpg',
  philippines: 'https://images.ctfassets.net/7ij5e7o2r4ia/2gjOfnYxSVJgaF0yAzz21m/2671975b784d83f6be829ce7567b08e5/INTRAMUROS.jpg',
  dubai: 'https://images.ctfassets.net/7ij5e7o2r4ia/4XxhuPCLlJVKfeYlJccV2A/04965da89062adc3d8988ab8912348f5/christoph-schulz-jG3I8b5iyHI-unsplash.jpg',
  malaysia: 'https://images.ctfassets.net/7ij5e7o2r4ia/5Yz6o0dG6tPOFjc7VfkCwS/ca8df79eb2ce2639adc90b08e6bfee03/Malaysia_City.jpg',
  maldives: 'https://images.ctfassets.net/7ij5e7o2r4ia/4v8jxzL4bOL78yss9pvuon/e30d6b2a7773eb1805f9a80890d1d868/WhatsApp_Image_2023-03-03_at_3.02.32_PM.jpeg',
  mauritius: 'https://images.ctfassets.net/7ij5e7o2r4ia/1cetwzbgbKsm0mUj7ffscb/2dd4833bbd939d6807943b35117bcc8d/South_island_tour_Mauritius_9_11zon.jpg',
  vietnam: 'https://images.ctfassets.net/7ij5e7o2r4ia/14zRDeTriiYepCO7royNB0/6635b4690a31da27cdeb9724035f1f50/silver-ringvee-niFWqrLdjlE-unsplash.jpg',
  srilanka: 'https://images.ctfassets.net/7ij5e7o2r4ia/3L2ZcVGHPFXtShxz0Kwt1A/e0f7a44e2176995415e62ec9ff763799/pexels-tom____-mal__k-1998439.jpg',
  turkey: 'https://images.ctfassets.net/7ij5e7o2r4ia/7gfnAhUTPH02Y95AmKMM2S/f97f6fcc12aadcce08fa69b5c606dc27/CAPPADOCIA_RED__NORTH_.jpg',
  azerbaijan: 'https://images.ctfassets.net/7ij5e7o2r4ia/3K8GaJJ6XN7zl4SxEL6TuV/79328f4a0d5f865688b76fa907cdab4b/Baku_city.jpg',
  georgia: 'https://images.ctfassets.net/7ij5e7o2r4ia/52EJFkso8xRMyX1Rs9pity/04f23b8918cd1db74b00ddcb0743f0d1/Batumi_city__1_.jpg',
  hongkong: 'https://images.ctfassets.net/7ij5e7o2r4ia/7MtowPsr0KKuBXbIIQ0Rq9/1138b6853a1cba56577f1485dde26ee1/Ocean_Park_Hongkong.jpg',
  kazakhstan: 'https://images.ctfassets.net/7ij5e7o2r4ia/4Tdeix5P6lY67ADedG4BoP/4acdaf05ada4909532593e3b735bc1ce/Almaty_city_tour__1_.jpg',
  kashmir: 'https://images.ctfassets.net/7ij5e7o2r4ia/4tXOP3c0JrVnjVgRZoyhc7/aa698fe60d315aa7bb2a564d5649000f/Shikara_ride.jpg',
  andaman: 'https://images.ctfassets.net/7ij5e7o2r4ia/6xtUO53PvvuUcN9pz6gKso/5439bbf4f7fecc3d466cae9f1ad1cfd5/2_2_11zon.jpg',
  himachal: 'https://images.ctfassets.net/7ij5e7o2r4ia/RPNnE42EpZ3m3lgFiSQvd/5aacb641de4bd2d694d0afcf724d3bf1/Shimla_8_37_11zon.jpg',
  goa: 'https://images.ctfassets.net/7ij5e7o2r4ia/6xu7MsdUnEfcRVVV52xp7w/58e402b92fc40a2774122f51e0513086/raja-sen-FYos6AbcDsY-unsplash.jpg',
  kerala: 'https://images.ctfassets.net/7ij5e7o2r4ia/76RbeQkZwf8AdaFrXr6rdo/6fccbc139fa949f21fcba74def5a8c61/anand-s-CtqSoMZY7c8-unsplash.jpg',
  uttarakhand: 'https://images.ctfassets.net/7ij5e7o2r4ia/73iW9uuPYHpWZmBd5ZwfMG/8e551a3768e4c8266f86035aee5cf6a6/Mountain_view.jpg',
  ladakh: 'https://images.ctfassets.net/7ij5e7o2r4ia/xWqFAIKfYr1K9h0kTgS6y/abb7011ad484c6e1c5e60ea28708a951/hans-jurgen-mager-MrW_AqAFNR0-unsplash.jpg',
  sikkim: 'https://images.ctfassets.net/7ij5e7o2r4ia/6vTLQSYHeGuPl2bTXirXy5/8acb78fdaafd938c262d47d50b66b52c/_Gangtok.jpg',
  rajasthan: 'https://images.ctfassets.net/7ij5e7o2r4ia/5p4SLfOR7Iz4yRBlkZ0Iwy/345377951c702167de307a220d604510/Jaipur_6_11zon.jpg',
  northeast: 'https://images.ctfassets.net/7ij5e7o2r4ia/1U2jOPkbIxxaH5KuOBsEUs/4b13a572d45a2efe1937ccd8443e50aa/Kamakhya_Temple_wikimedia.org_.jpg_3_11zon.jpg',
};

function inferCategory(title: string): 'Family' | 'Honeymoon' | 'Offbeat' | 'Planning Advice' | 'Culture' {
  const t = title.toLowerCase();
  if (t.includes('couple') || t.includes('honeymoon') || t.includes('beach') || t.includes('romantic') || t.includes('partner')) {
    return 'Honeymoon';
  }
  if (t.includes('food') || t.includes('dish') || t.includes('cuisine') || t.includes('festival') || t.includes('culture') || t.includes('temple')) {
    return 'Culture';
  }
  if (t.includes('offbeat') || t.includes('hidden') || t.includes('secret') || t.includes('unexplored') || t.includes('adventure') || t.includes('trek')) {
    return 'Offbeat';
  }
  if (t.includes('time') || t.includes('when') || t.includes('season') || t.includes('guide') || t.includes('budget') || t.includes('tips') || t.includes('cost')) {
    return 'Planning Advice';
  }
  return 'Family';
}

// Convert 129 crawled blogs into rich, readable articles
const CRAWLED_GUIDES: ExtendedTravelGuide[] = [];

if (crawledData.blogs) {
  Object.entries(crawledData.blogs as Record<string, { slug: string; title: string; destination: string }[]>).forEach(
    ([destSlug, blogs]) => {
      blogs.forEach((b, idx) => {
        const cleanTitle = b.title.trim();
        const category = inferCategory(cleanTitle);
        const hero = DESTINATION_IMAGES[destSlug.toLowerCase()] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200';

        CRAWLED_GUIDES.push({
          id: `live-guide-${destSlug}-${idx}`,
          slug: b.slug,
          title: cleanTitle,
          subtitle: `Essential intelligence, timing advice, and practical consultant recommendations for Indian travellers visiting ${b.destination}.`,
          category,
          readTime: `${4 + (idx % 3)} min read`,
          author: {
            name: `${b.destination} Field Desk`,
            role: 'Jeto Regional Travel Specialist',
          },
          publishedDate: 'Seasonal Dispatch 2026',
          heroImage: hero,
          summary: `Planning a holiday in ${b.destination}? Read our verified local insights on pacing, cultural etiquette, regional transit, and dietary nuances.`,
          destination: b.destination,
          destinationSlug: destSlug,
          isLongFormLead: false,
          content: [
            {
              sectionTitle: `1. Navigating ${b.destination}: What Every Indian Traveler Needs to Know`,
              paragraphs: [
                `Visiting ${b.destination} offers extraordinary experiences, but understanding local transit pacing, currency exchange convenience, and regional seasons makes the difference between an exhausting journey and an unforgettable retreat.`,
                `Our regional specialists recommend budgeting at least 2 to 3 nights in each primary base to avoid the physical fatigue of constant room changes, especially when traveling with spouse or parents.`,
              ],
              calloutBox: {
                title: 'Consultant Note: Pacing & Private Vehicles',
                text: 'Always pre-arrange private AC airport and inter-hotel transfers rather than hailing ad-hoc taxis at crowded arrival terminals.',
                type: 'logistics',
              },
            },
            {
              sectionTitle: `2. Practical Tips on Food, Dietary Comfort & Local Etiquette`,
              paragraphs: [
                `For Indian travelers accustomed to vegetarian, Jain, or specific dietary preferences, ${b.destination} has accessible dining options when planned ahead. Central dining corridors feature verified Indian and international restaurants.`,
                `Keep modest clothing on hand when visiting sacred temples, heritage shrines, or rural villages. Carrying lightweight scarves or sarongs is respectful and avoids denied entry.`,
              ],
              calloutBox: {
                title: 'Dining Tip: Authentic & Pure Veg Options',
                text: 'Ask our planning team for our curated restaurant cheat-sheet with verified vegetarian and Jain kitchens near your selected resort.',
                type: 'food',
              },
            },
            {
              sectionTitle: `3. Best Ways to Experience Highlights Without the Tourist Swarms`,
              paragraphs: [
                `The most iconic sights in ${b.destination} are best experienced in the early morning or late afternoon golden hours when large tour coaches have not yet arrived or have already departed.`,
                `Speak with your dedicated Jeto specialist to tweak timings so you can enjoy private viewpoints, unhurried photo opportunities, and personalized local guides.`,
              ],
              calloutBox: {
                title: 'Time-Saver: Early Departures',
                text: 'Starting your day at 8:00 AM allows you to complete major excursions comfortably before noon heat and peak crowds.',
                type: 'tip',
              },
            },
          ],
          tags: [b.destination, category, 'Field Notes', 'Indian Travellers'],
        });
      });
    }
  );
}

// 4 deep bespoke guides with extended properties
const BESPOKE_GUIDES: ExtendedTravelGuide[] = TRAVEL_GUIDES.map((g) => ({
  ...g,
  isLongFormLead: true,
}));

// All 133 guides unified
export const UNIFIED_GUIDES: ExtendedTravelGuide[] = [...BESPOKE_GUIDES, ...CRAWLED_GUIDES];

export function getUnifiedGuideBySlug(slug: string): ExtendedTravelGuide | undefined {
  const norm = slug.toLowerCase().trim();
  return UNIFIED_GUIDES.find((g) => g.slug.toLowerCase().trim() === norm);
}

export function getAllUnifiedGuideSlugs(): string[] {
  return UNIFIED_GUIDES.map((g) => g.slug);
}
