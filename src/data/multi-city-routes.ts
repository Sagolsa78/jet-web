export interface MultiCityStop {
  city: string;
  country: string;
  defaultNights: number;
  minNights: number;
  maxNights: number;
  highlights: string[];
  recommendedStayArea: string;
}

export interface MultiCityRoute {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  region: 'Southeast Asia' | 'Europe' | 'Middle East' | 'Domestic India';
  heroImage: string;
  stops: MultiCityStop[];
  interCityTransit: {
    description: string;
    mode: 'Flight' | 'High-Speed Train' | 'Private Road Chauffeur' | 'Speedboat & Flight';
    duration: string;
  };
  baseBenchmarkPrice: number; // in INR twin sharing
  flightEstimateFromIndia: {
    min: number;
    max: number;
    departureHubs: string;
  };
  bestSeason: string;
  visaSummary: string;
  suitableFor: string;
  inclusions: string[];
}

export const MULTI_CITY_ROUTES: MultiCityRoute[] = [
  {
    id: 'mc-1',
    slug: 'singapore-bali',
    title: 'Singapore Futuristic Skyline & Balinese Sanctuaries',
    subtitle: 'Pair the urban marvels and Michelin dining of Marina Bay with the spiritual calm, lush rice terraces, and private pool villas of Bali.',
    region: 'Southeast Asia',
    heroImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=1200',
    stops: [
      {
        city: 'Singapore',
        country: 'Singapore',
        defaultNights: 3,
        minNights: 2,
        maxNights: 5,
        highlights: ['Gardens by the Bay Cloud Forest', 'Sentosa Island Cable Car', 'Marina Bay Sands SkyPark', 'Chinatown & Little India food walks'],
        recommendedStayArea: 'Robertson Quay or Marina Bay',
      },
      {
        city: 'Bali (Ubud & Seminyak)',
        country: 'Indonesia',
        defaultNights: 4,
        minNights: 3,
        maxNights: 7,
        highlights: ['Tegallalang Rice Terrace swing', 'Private pool villa stay in Ubud', 'Uluwatu Sunset Temple & Kecak Dance', 'Seminyak beach clubs'],
        recommendedStayArea: 'Ubud Jungle + Seminyak Beachfront',
      },
    ],
    interCityTransit: {
      description: 'Changi Airport (SIN) to Ngurah Rai Bali (DPS) non-stop flight',
      mode: 'Flight',
      duration: '2 hours 40 minutes',
    },
    baseBenchmarkPrice: 88500,
    flightEstimateFromIndia: {
      min: 24000,
      max: 36000,
      departureHubs: 'BOM / DEL / BLR / MAA',
    },
    bestSeason: 'April to October (Dry season across both)',
    visaSummary: 'Singapore eVisa (valid 30 days) + Bali 30-day Visa on Arrival (IDR 500k / ~₹2,800)',
    suitableFor: 'Couples, Honeymooners, Families with teens',
    inclusions: [
      '3 Nights 4★/5★ Singapore Hotel with Daily Breakfast',
      '2 Nights Ubud Private Pool Villa + 2 Nights Seminyak Resort',
      'Private airport & inter-hotel transfers in AC private vehicles',
      'Gardens by the Bay Double Conservatories passes',
      'Private Full-day Kintamani & Tegallalang tour with English guide',
      'SIM Cards & 24/7 dedicated WhatsApp support desk',
    ],
  },
  {
    id: 'mc-2',
    slug: 'switzerland-paris',
    title: 'Swiss Alpine Majesty & Parisian Haute Elegance',
    subtitle: 'From snowy Jungfraujoch summits and scenic Glacier Express lakes to the romantic boulevards, Louvre museum, and Seine river cruises.',
    region: 'Europe',
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200',
    stops: [
      {
        city: 'Swiss Alps (Lucerne & Interlaken)',
        country: 'Switzerland',
        defaultNights: 5,
        minNights: 4,
        maxNights: 8,
        highlights: ['Jungfraujoch - Top of Europe', 'Lake Lucerne panoramic boat cruise', 'Mt. Titlis rotating cable car & Cliff Walk', 'Interlaken town & Harder Kulm'],
        recommendedStayArea: 'Interlaken Ost or Lucerne Old Town',
      },
      {
        city: 'Paris',
        country: 'France',
        defaultNights: 3,
        minNights: 2,
        maxNights: 5,
        highlights: ['Eiffel Tower 2nd floor or summit access', 'Seine River glass-canopy dinner cruise', 'Louvre Museum priority entry', 'Champs-Élysées stroll'],
        recommendedStayArea: 'Opera district or Saint-Germain-des-Prés',
      },
    ],
    interCityTransit: {
      description: 'High-speed TGV Lyria train from Basel SBB directly to Paris Gare de Lyon',
      mode: 'High-Speed Train',
      duration: '3 hours 05 minutes (speeds up to 320 km/h)',
    },
    baseBenchmarkPrice: 185000,
    flightEstimateFromIndia: {
      min: 55000,
      max: 78000,
      departureHubs: 'DEL / BOM Open-jaw (In Zurich, Out Paris)',
    },
    bestSeason: 'May to October (Scenic lush trails) or Dec–Feb (Snow winter wonderland)',
    visaSummary: 'Single Schengen Visa (Apply via Switzerland or France VFS with Jeto dossier)',
    suitableFor: 'Honeymooners, Multi-generational milestone family celebrations',
    inclusions: [
      '5 Nights in Swiss 4★ Apart-hotel / Boutique hotel with breakfast',
      '3 Nights in Paris 4★ Central Boutique Hotel',
      'Consecutive Swiss Travel Pass (Unlimited trains, boats & city buses)',
      'High-speed 1st/2nd Class TGV Lyria train ticket Basel to Paris',
      'Jungfraujoch Mountain Excursion ticket',
      'Illuminated 1-hour Seine River Cruise ticket in Paris',
    ],
  },
  {
    id: 'mc-3',
    slug: 'vietnam-cambodia',
    title: 'Indochina Odyssey: Halong Bay Cruise & Angkor Wat',
    subtitle: 'Sail emerald limestone karst waters on a luxury overnight junk cruise before witnessing the mystical stone towers of Angkor at sunrise.',
    region: 'Southeast Asia',
    heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1200',
    stops: [
      {
        city: 'Hanoi & Halong Bay',
        country: 'Vietnam',
        defaultNights: 4,
        minNights: 3,
        maxNights: 6,
        highlights: ['5★ Luxury overnight cruise in Halong/Lan Ha Bay', 'Hanoi French Quarter & Hoan Kiem Lake', 'Traditional Water Puppet theater', 'Street food walking safari'],
        recommendedStayArea: 'Hanoi Old Quarter & Cruise cabin with private balcony',
      },
      {
        city: 'Siem Reap (Angkor)',
        country: 'Cambodia',
        defaultNights: 3,
        minNights: 2,
        maxNights: 4,
        highlights: ['Angkor Wat dawn reflection pool', 'Bayon Temple giant smiling stone faces', 'Ta Prohm jungle temple (Tomb Raider)', 'Phare Cambodian Circus show'],
        recommendedStayArea: 'Siem Reap boutique riverfront hotel',
      },
    ],
    interCityTransit: {
      description: 'Hanoi Noi Bai (HAN) to Siem Reap Angkor (SAI) direct flight',
      mode: 'Flight',
      duration: '1 hour 45 minutes',
    },
    baseBenchmarkPrice: 72000,
    flightEstimateFromIndia: {
      min: 22000,
      max: 32000,
      departureHubs: 'DEL / BOM / CCU / HYD',
    },
    bestSeason: 'November to March (Dry, breezy, comfortable temple exploring)',
    visaSummary: 'Vietnam eVisa (~$25) + Cambodia eVisa or Visa on Arrival ($30)',
    suitableFor: 'Culture lovers, photographers, couples, active families',
    inclusions: [
      '3 Nights 4★ Boutique Hotel in Hanoi Old Quarter',
      '1 Night 5★ Luxury Halong Bay Cruise with full-board gourmet meals',
      '3 Nights 4★/5★ Tropical Resort in Siem Reap with pool',
      'Private air-conditioned transfers for all sightseeing & airport legs',
      'Angkor Archaeological Park 1-day pass & licensed Khmer guide',
      'Bamboo rowing boat / kayaking in Halong hidden grottos',
    ],
  },
  {
    id: 'mc-4',
    slug: 'dubai-abudhabi',
    title: 'Emirati Grandeur: Dubai Marina & Abu Dhabi Culture',
    subtitle: 'Experience futuristic Dubai architecture and desert dunes paired with Abu Dhabi’s world-class Louvre museum and Ferrari World thrill rides.',
    region: 'Middle East',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200',
    stops: [
      {
        city: 'Dubai',
        country: 'United Arab Emirates',
        defaultNights: 4,
        minNights: 3,
        maxNights: 6,
        highlights: ['Burj Khalifa 124th floor observation deck', 'Red Dunes Desert Safari with BBQ dinner & dune bashing', 'Dubai Marina luxury yacht or Dhow cruise', 'Dubai Mall & Fountain show'],
        recommendedStayArea: 'Dubai Marina or Downtown Dubai',
      },
      {
        city: 'Abu Dhabi',
        country: 'United Arab Emirates',
        defaultNights: 2,
        minNights: 1,
        maxNights: 3,
        highlights: ['Sheikh Zayed Grand Mosque private guided tour', 'Louvre Abu Dhabi domed architecture', 'Ferrari World or Warner Bros theme park', 'Qasr Al Watan Presidential Palace'],
        recommendedStayArea: 'Corniche Beachfront or Yas Island',
      },
    ],
    interCityTransit: {
      description: 'Private chauffeured luxury transfer via Sheikh Zayed Road (E11 highway)',
      mode: 'Private Road Chauffeur',
      duration: '1 hour 15 minutes',
    },
    baseBenchmarkPrice: 54500,
    flightEstimateFromIndia: {
      min: 16000,
      max: 26000,
      departureHubs: 'Direct flights from all major Indian airports',
    },
    bestSeason: 'October to April (Pleasant 24°C–28°C outdoor climate)',
    visaSummary: 'Simple 30-day UAE Tourist eVisa processed in 24–48 hours (~₹6,500)',
    suitableFor: 'Families with children, shopping enthusiasts, short luxury getaways',
    inclusions: [
      '4 Nights in Dubai 4★/5★ Hotel with daily international buffet breakfast',
      '2 Nights in Abu Dhabi 4★/5★ Hotel or Yas Island Theme Park resort',
      'Intercity private one-way transfer between Dubai & Abu Dhabi hotels',
      'Private Red Dune Desert Safari in 4x4 Land Cruiser with BBQ banquet',
      'Burj Khalifa Level 124/125 non-prime time tickets',
      'Sheikh Zayed Grand Mosque visit with private vehicle waiting',
    ],
  },
  {
    id: 'mc-5',
    slug: 'kashmir-ladakh',
    title: 'Himalayan Crown: Paradise Valley & High Altitude Moonscapes',
    subtitle: 'Drift across Srinagar’s lotus-filled Dal Lake and ride the Gulmarg gondola before crossing high passes into Ladakh’s surreal Pangong lake and Nubra sand dunes.',
    region: 'Domestic India',
    heroImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=1200',
    stops: [
      {
        city: 'Kashmir (Srinagar & Gulmarg)',
        country: 'India',
        defaultNights: 4,
        minNights: 3,
        maxNights: 6,
        highlights: ['Heritage Dal Lake luxury wooden houseboat stay', 'Gulmarg Gondola cable car ride (Phase 1 & 2)', 'Pahalgam Betaab Valley pine forests', 'Traditional Shikara ride with saffron Kahwa'],
        recommendedStayArea: 'Nigeen/Dal Lake Houseboat + Gulmarg Resort',
      },
      {
        city: 'Ladakh (Leh, Nubra & Pangong)',
        country: 'India',
        defaultNights: 4,
        minNights: 3,
        maxNights: 6,
        highlights: ['Khardung La Pass (17,582 ft)', 'Nubra Valley double-humped camel safari at Hunder', 'Pangong Tso color-shifting high altitude lake', 'Diskit Monastery giant Buddha statue'],
        recommendedStayArea: 'Leh Boutique Hotel + Hunder Luxury Swiss Camp',
      },
    ],
    interCityTransit: {
      description: 'Morning scenic mountain flight from Srinagar (SXR) to Leh (IXL) over snow peaks',
      mode: 'Flight',
      duration: '45 minutes',
    },
    baseBenchmarkPrice: 46000,
    flightEstimateFromIndia: {
      min: 12000,
      max: 20000,
      departureHubs: 'DEL / BOM direct to SXR, Out from IXL',
    },
    bestSeason: 'May to September (Warm sunshine, high passes clear, blooming valleys)',
    visaSummary: 'Domestic India (No passport/visa required; Inner Line Permit included by Jeto)',
    suitableFor: 'Nature photographers, adventurous couples, friends, road trippers',
    inclusions: [
      '1 Night Premium Houseboat in Srinagar + 3 Nights Kashmir Resorts',
      '2 Nights Leh Hotel + 1 Night Nubra Camp + 1 Night Pangong Lake Camp',
      'Daily Breakfast and Dinner throughout entire route (MAP Plan)',
      'Dedicated private Innova / Scorpio vehicle with seasoned mountain driver',
      'All Inner Line Permits, Wildlife fees & green taxes for Ladakh',
      'Oxygen cylinder in vehicle during high altitude passes (Khardung La / Chang La)',
    ],
  },
  {
    id: 'mc-6',
    slug: 'phuket-krabi-bangkok',
    title: 'Thailand Grand Trio: Island Hopping & Metropolitan Energy',
    subtitle: 'Sun-drenched limestone karst cliffs in Krabi, emerald sea lagoons in Phuket, and vibrant night markets and golden temples in Bangkok.',
    region: 'Southeast Asia',
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=1200',
    stops: [
      {
        city: 'Phuket',
        country: 'Thailand',
        defaultNights: 3,
        minNights: 2,
        maxNights: 5,
        highlights: ['Phi Phi Islands & Maya Bay luxury speedboat day trip', 'Big Buddha view over Chalong Bay', 'Patong / Kata beach sunset relaxation', 'Phuket Old Town Sino-Portuguese architecture'],
        recommendedStayArea: 'Kata Beach or Patong',
      },
      {
        city: 'Krabi',
        country: 'Thailand',
        defaultNights: 2,
        minNights: 2,
        maxNights: 4,
        highlights: ['Four Islands sunset tour with bioluminescent plankton', 'Railay Beach towering karst rock climbing views', 'Emerald Pool & Hot Springs thermal bath', 'Ao Nang night food street'],
        recommendedStayArea: 'Ao Nang Beach or Railay Bay',
      },
      {
        city: 'Bangkok',
        country: 'Thailand',
        defaultNights: 2,
        minNights: 2,
        maxNights: 4,
        highlights: ['Grand Palace & Wat Pho reclining Buddha', 'Chao Phraya White Orchid dinner cruise', 'IconSiam indoor floating market', 'Chatuchak weekend market / Siam Paragon shopping'],
        recommendedStayArea: 'Sukhumvit or Riverside',
      },
    ],
    interCityTransit: {
      description: 'Speedboat ferry from Phuket to Krabi (2h 15m) + domestic flight Krabi to Bangkok (1h 20m)',
      mode: 'Speedboat & Flight',
      duration: 'Ferry: 2h 15m | Flight: 1h 20m',
    },
    baseBenchmarkPrice: 52000,
    flightEstimateFromIndia: {
      min: 18000,
      max: 28000,
      departureHubs: 'BOM / DEL / BLR / MAA / CCU',
    },
    bestSeason: 'November to April (Crisp sunny skies, calm turquoise sea)',
    visaSummary: 'Visa-Free Entry for Indian Passport Holders (Free 60-day tourist exemption)',
    suitableFor: 'First-time international travelers, friend groups, bachelor/bachelorette trips',
    inclusions: [
      '3 Nights Phuket 4★ Resort + 2 Nights Krabi 4★ Resort + 2 Nights Bangkok 4★ Hotel',
      'Daily international buffet breakfast at all hotels',
      'All airport, inter-city ferry, and hotel transfers on private basis',
      'Full-day Phi Phi & Maya Bay Speedboat tour with national park fees & buffet lunch',
      'Chao Phraya River luxury dinner cruise with live entertainment in Bangkok',
      'Thai 4G Tourist SIM Card upon arrival',
    ],
  },
];
