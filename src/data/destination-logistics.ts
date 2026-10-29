export interface DestinationLogistics {
  bestMonths: string;
  flightDuration: string;
  visaPolicy: string;
  vegDiningEase: 'High' | 'Moderate' | 'Requires Planning';
  vegTip: string;
  idealDuration: string;
  currency: string;
  highlights: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export const DESTINATION_LOGISTICS_MAP: Record<string, DestinationLogistics> = {
  bali: {
    bestMonths: 'April to October (Dry & breezy)',
    flightDuration: 'Approx 5h 30m non-stop from Delhi/Mumbai',
    visaPolicy: '30-day Visa on Arrival (IDR 500k / ~₹2,800) or e-VOA',
    vegDiningEase: 'High',
    vegTip: 'Ubud and Seminyak have hundreds of pure vegetarian and vegan cafes; Indian restaurants with Jain options are widespread.',
    idealDuration: '6 to 8 Days',
    currency: 'Indonesian Rupiah (IDR)',
    highlights: [
      { title: 'Clifftop Uluwatu Sunsets', description: 'Dramatic ocean views with traditional Kecak fire dance against glowing orange skies.', icon: 'wb_twilight' },
      { title: 'Private Ubud Pool Villas', description: 'Secluded infinity pools overlooking lush rainforest valleys and tiered emerald rice paddies.', icon: 'pool' },
      { title: 'Tirta Empul Water Cleansing', description: 'Ancient holy spring temple where locals and travelers partake in traditional purification rituals.', icon: 'temple_hindu' },
      { title: 'Nusa Penida Catamaran Cruise', description: 'Fast boat crossing to dramatic Kelingking T-Rex cliff and tranquil crystal bay waters.', icon: 'directions_boat' },
    ],
  },
  switzerland: {
    bestMonths: 'May to Oct (Lakes & rails) / Dec to Feb (Snow peaks)',
    flightDuration: 'Approx 8h 30m direct from Delhi/Mumbai (Zurich/Geneva)',
    visaPolicy: 'Schengen Visa (Requires biometrics; 15–20 days processing)',
    vegDiningEase: 'Moderate',
    vegTip: 'All Swiss cities feature pure vegetarian Indian dining. We book apartments with kitchenettes for easy family home cooking.',
    idealDuration: '7 to 10 Days',
    currency: 'Swiss Franc (CHF)',
    highlights: [
      { title: 'Glacier Express Panoramic Train', description: 'Traverse 291 bridges and 91 tunnels through dramatic alpine valleys with floor-to-ceiling glass windows.', icon: 'train' },
      { title: 'Jungfraujoch - Top of Europe', description: 'Ascend to 3,454m via the ultra-modern Eiger Express tricable gondola to walk inside the ice palace.', icon: 'ac_unit' },
      { title: 'Lake Lucerne Steamer Cruise', description: 'Glide across crystalline waters beneath Mount Pilatus and historic wooden Chapel Bridge.', icon: 'sailing' },
      { title: 'Lauterbrunnen Valley of 72 Waterfalls', description: 'Gentle valley strolls framed by towering limestone cliffs and cascading glacier falls.', icon: 'waterfall_chart' },
    ],
  },
  maldives: {
    bestMonths: 'November to April (Calm turquoise waters)',
    flightDuration: 'Approx 3h 45m direct from Delhi/Mumbai/Bengaluru to Male',
    visaPolicy: 'Free 30-Day Tourist Visa on Arrival for Indian passports',
    vegDiningEase: 'High',
    vegTip: 'Luxury private resorts feature dedicated Indian chefs offering customizable Jain, Gujarati, and North Indian menus.',
    idealDuration: '4 to 6 Days',
    currency: 'Maldivian Rufiyaa (MVR) / USD',
    highlights: [
      { title: 'Overwater Lagoon Villas', description: 'Step directly from your sun terrace into crystalline coral lagoons filled with baby reef sharks and turtles.', icon: 'water' },
      { title: 'Scenic Seaplane Transfer', description: 'Aerial panoramas over emerald atolls and ring-shaped coral reefs during transfers to private island resorts.', icon: 'flight' },
      { title: 'Sunset Dolphin Safaris', description: 'Private wooden dhoni cruise watching spinner dolphins play in the boat bow waves.', icon: 'cruelty_free' },
      { title: 'Private Sandbank Dining', description: 'Intimate candlelight dinners set on a deserted white sandbank surrounded by the Indian Ocean.', icon: 'dinner_dining' },
    ],
  },
  vietnam: {
    bestMonths: 'October to April (Pleasant temperature, low rainfall)',
    flightDuration: 'Approx 4h 15m non-stop from Delhi/Mumbai to Hanoi/Ho Chi Minh',
    visaPolicy: 'Single-entry eVisa approved online in 3 working days (~$25)',
    vegDiningEase: 'Moderate',
    vegTip: 'Say "An Chay" for vegetarian. Major tourist centers have fantastic Indian restaurants and fresh Buddhist vegetarian cuisine.',
    idealDuration: '7 to 9 Days',
    currency: 'Vietnamese Dong (VND)',
    highlights: [
      { title: 'Overnight Halong Bay Cruise', description: 'Sail through thousands of towering limestone karsts aboard a luxury private-balcony junk boat.', icon: 'directions_boat' },
      { title: 'Hanoi French Quarter & Old Lanes', description: 'Ride cyclos through ancient silk guilds and sample traditional egg coffee in heritage courtyards.', icon: 'local_cafe' },
      { title: 'Ninh Binh River Sampan', description: 'Paddled along peaceful karst rivers through cathedral-like water caves.', icon: 'rowing' },
      { title: 'Lantern Lit Hoi An', description: 'Stroll cobblestone alleys illuminated by thousands of silk lanterns at twilight.', icon: 'flare' },
    ],
  },
  kashmir: {
    bestMonths: 'April to October (Gardens & greenery) / Dec to Feb (Snow)',
    flightDuration: 'Approx 1h 30m direct from Delhi to Srinagar (SXR)',
    visaPolicy: 'Domestic Travel (No passport or permit required)',
    vegDiningEase: 'High',
    vegTip: 'All houseboats and mountain resorts cater with warmth to pure vegetarian and Jain dietary needs alongside local Kashmiri delicacies.',
    idealDuration: '5 to 7 Days',
    currency: 'Indian Rupee (INR)',
    highlights: [
      { title: 'Dal Lake Heritage Houseboats', description: 'Ornate hand-carved cedarwood houseboats with private verandas overlooking Zabarwan mountain reflections.', icon: 'house' },
      { title: 'Gulmarg Gondola Phase 2', description: 'One of the world\'s highest cable cars rising to Apharwat Peak at 13,780 feet for panoramic snow views.', icon: 'cable_car' },
      { title: 'Betaab Valley & Lidder River', description: 'Lush green alpine meadows, pine forests, and crystal-clear mountain streams in Pahalgam.', icon: 'park' },
      { title: 'Mughal Terraced Gardens', description: 'Cascading water fountains, historic chinar trees, and vibrant flowerbeds built by emperors in the 17th century.', icon: 'yard' },
    ],
  },
  rajasthan: {
    bestMonths: 'October to March (Pleasant daytime sun, cool desert nights)',
    flightDuration: 'Direct flights to Udaipur, Jaipur, and Jodhpur from major Indian cities',
    visaPolicy: 'Domestic Travel (No passport required)',
    vegDiningEase: 'High',
    vegTip: 'World capital of vegetarian cuisine. Savor authentic Dal Baati Churma, Gatte ki Sabzi, and royal thalis with zero dietary concerns.',
    idealDuration: '6 to 8 Days',
    currency: 'Indian Rupee (INR)',
    highlights: [
      { title: 'Lake Pichola Sunset Boat Cruise', description: 'Private boat glides past the illuminated City Palace and Jag Mandir island under starry skies.', icon: 'sailing' },
      { title: 'Mehrangarh Fort Sandstone Ramparts', description: 'Towering 400 feet above Jodhpur with museum exhibits of royal palanquins and armory.', icon: 'fort' },
      { title: 'Heritage Haveli Stays', description: 'Restored royal mansions with marble courtyards, jharokha balconies, and evening folk sitar performances.', icon: 'castle' },
      { title: 'Bishnoi Tribal Village Safari', description: 'Jeep excursions meeting traditional potters, weavers, and observing wild blackbucks in conservation reserves.', icon: 'explore' },
    ],
  },
  japan: {
    bestMonths: 'March to May (Cherry blossoms) / Sept to Nov (Autumn foliage)',
    flightDuration: 'Approx 8h 30m direct from Delhi/Bengaluru to Tokyo (NRT/HND)',
    visaPolicy: 'Japan Tourist eVisa processed online in 5–7 working days',
    vegDiningEase: 'Moderate',
    vegTip: 'Dedicated Indian dining options in Tokyo, Kyoto, and Osaka; Buddhist shojin ryori vegetarian dining available in temples.',
    idealDuration: '8 to 11 Days',
    currency: 'Japanese Yen (JPY)',
    highlights: [
      { title: 'Shinkansen Bullet Train at 300 km/h', description: 'Ultra-smooth, punctually timed rail transits connecting Tokyo, Kyoto, and Osaka with panoramic Mt. Fuji views.', icon: 'speed' },
      { title: 'Fushimi Inari Torii Shrines', description: 'Walk through thousands of vermilion shrine gates winding up sacred mountain trails in Kyoto.', icon: 'temple_buddhist' },
      { title: 'Traditional Onsen Ryokan Stays', description: 'Sleep on tatami mats, wear cotton yukatas, and soak in mineral-rich natural hot spring baths.', icon: 'hot_tub' },
      { title: 'Private Tea Master Ceremony', description: 'Experience the mindful centuries-old art of matcha preparation inside a wooden machiya townhouse.', icon: 'local_cafe' },
    ],
  },
  andaman: {
    bestMonths: 'October to May (Calm seas and clear sunny skies)',
    flightDuration: 'Approx 2h 30m direct from Kolkata/Chennai/Bengaluru/Delhi to Port Blair (IXZ)',
    visaPolicy: 'Domestic Travel (No passport required; Indian citizens free access)',
    vegDiningEase: 'High',
    vegTip: 'Resorts across Havelock and Port Blair cater extensively with vegetarian and Jain food prepared in dedicated kitchens.',
    idealDuration: '5 to 7 Days',
    currency: 'Indian Rupee (INR)',
    highlights: [
      { title: 'Radhanagar Beach Sunset Walk', description: 'Crowned one of Asia\'s best beaches, featuring powdery white sands and gentle turquoise waves.', icon: 'beach_access' },
      { title: 'Luxury Makruzz Catamaran', description: 'High-speed air-conditioned sea catamaran journeys connecting Port Blair, Havelock, and Neil Island.', icon: 'directions_boat' },
      { title: 'Elephant Beach Snorkeling', description: 'Shallow coral reef exploration with certified dive instructors in crystal-clear waters.', icon: 'scuba_diving' },
      { title: 'Cellular Jail Sound & Light Show', description: 'Poignant historical narration commemorating freedom fighters at the national memorial in Port Blair.', icon: 'history_edu' },
    ],
  },
  'new-zealand': {
    bestMonths: 'November to April (Warm summer & vibrant outdoor trails)',
    flightDuration: 'Approx 15h 30m with 1 stop (via Singapore/Malaysia) to Auckland/Christchurch',
    visaPolicy: 'Visitor Visa online or NZeTA (requires 20–30 days processing)',
    vegDiningEase: 'Moderate',
    vegTip: 'Indian restaurants available in all major towns (Queenstown, Christchurch, Rotorua). Apartment stays allow convenient self-cooking.',
    idealDuration: '9 to 14 Days',
    currency: 'New Zealand Dollar (NZD)',
    highlights: [
      { title: 'Milford Sound Nature Cruise', description: 'Sail beneath towering Mitre Peak and thunderous Stirling waterfalls surrounded by sheer fjord cliffs.', icon: 'waterfall_chart' },
      { title: 'Skyline Queenstown & Luge', description: 'Ride the iconic gondola for 220-degree alpine lake panoramas and thrilling downhill luge tracks.', icon: 'terrain' },
      { title: 'Lake Tekapo Dark Sky Reserve', description: 'Witness the Southern Cross and cosmic Milky Way from world-renowned high-altitude observatories.', icon: 'nights_stay' },
      { title: 'Hooker Valley Glacier Hike', description: 'Gentle walk over swing bridges towards iceberg-dotted glacial lakes at the foot of Mount Cook.', icon: 'hiking' },
    ],
  },
  kerala: {
    bestMonths: 'September to March (Pleasant greenery and dry backwaters)',
    flightDuration: 'Direct flights to Kochi (COK) and Thiruvananthapuram (TRV) from all Indian cities',
    visaPolicy: 'Domestic Travel (No passport required)',
    vegDiningEase: 'High',
    vegTip: 'Traditional Kerala Sadhya served on banana leaves is 100% vegetarian; Jain options readily prepared on request.',
    idealDuration: '5 to 7 Days',
    currency: 'Indian Rupee (INR)',
    highlights: [
      { title: 'Private Alleppey Houseboat', description: 'Cruise slowly through palm-fringed backwaters aboard a private air-conditioned kettuvallam with your personal chef.', icon: 'houseboat' },
      { title: 'Munnar Mist-Veiled Tea Plantations', description: 'Rolling emerald hills, aromatic tea factory tours, and crisp mountain mornings in the Western Ghats.', icon: 'forest' },
      { title: 'Thekkady Organic Spice Trails', description: 'Guided walking discovery through plantations of green cardamom, black pepper, and cinnamon bark.', icon: 'spa' },
      { title: 'Authentic Kathakali & Kalaripayattu', description: 'Witness elaborate facial makeup and traditional ancient martial arts performances in cultural pavilions.', icon: 'theater_comedy' },
    ],
  },
  dubai: {
    bestMonths: 'October to April (Pleasant sunshine and outdoor weather)',
    flightDuration: 'Approx 3h 30m direct from Delhi/Mumbai/Ahmedabad/Bengaluru to DXB',
    visaPolicy: 'Simple 30-day or 60-day eVisa processed in 48 hours (~₹6,500)',
    vegDiningEase: 'High',
    vegTip: 'Thousands of pure vegetarian, Jain, Marwari, and South Indian restaurants across Bur Dubai, Karama, and Downtown.',
    idealDuration: '5 to 7 Days',
    currency: 'UAE Dirham (AED)',
    highlights: [
      { title: 'Burj Khalifa Top-Floor Views', description: 'High-speed elevator to the 124th and 148th floors for breathtaking views of the illuminated metropolis.', icon: 'apartment' },
      { title: 'Private Sunset Desert Dune Safari', description: '4x4 dune bashing, camel rides, and starlit barbecue dinner in an Arabian desert camp.', icon: 'landscape' },
      { title: 'Sheikh Zayed Mosque in Abu Dhabi', description: 'Day trip to one of the world\'s largest and most magnificent marble mosques.', icon: 'temple_buddhist' },
      { title: 'Dubai Marina Luxury Yacht Cruise', description: 'Glide past glittering futuristic towers with refreshing mocktails and sunset views.', icon: 'sailing' },
    ],
  },
  singapore: {
    bestMonths: 'Year-round tropical climate (November to January has seasonal rains)',
    flightDuration: 'Approx 5h non-stop from Delhi/Mumbai/Chennai to Singapore (SIN)',
    visaPolicy: 'Singapore eVisa processed via authorized visa agents in 3–5 working days',
    vegDiningEase: 'High',
    vegTip: 'Little India and central malls offer abundant pure vegetarian, North Indian, and South Indian vegetarian choices.',
    idealDuration: '4 to 6 Days',
    currency: 'Singapore Dollar (SGD)',
    highlights: [
      { title: 'Gardens by the Bay & Supertrees', description: 'Walk through the climate-controlled Cloud Forest with indoor waterfall and illuminated nightly Supertree light show.', icon: 'park' },
      { title: 'Night Safari Wildlife Tram', description: 'World\'s first nocturnal zoo observing free-roaming leopards, rhinos, and tapirs in naturalistic enclosures.', icon: 'pets' },
      { title: 'Sentosa Island Cableway & Beaches', description: 'Scenic cable car crossing over the harbor to sandy coves and world-class theme parks.', icon: 'cable_car' },
      { title: 'Marina Bay Waterfront Twilight', description: 'Iconic architectural panoramas from the Marina Bay Sands observation deck.', icon: 'location_city' },
    ],
  },
  thailand: {
    bestMonths: 'November to April (Dry season, ideal beach conditions)',
    flightDuration: 'Approx 4h non-stop from Delhi/Mumbai to Bangkok/Phuket',
    visaPolicy: 'Visa-free entry for Indian passport holders (temporary scheme) or Visa on Arrival',
    vegDiningEase: 'Moderate',
    vegTip: 'Indian restaurants located in every tourist hub; local Thai "Jay" food is strictly vegetarian and vegan.',
    idealDuration: '5 to 8 Days',
    currency: 'Thai Baht (THB)',
    highlights: [
      { title: 'Phi Phi Islands Speedboat Cruise', description: 'Turquoise lagoons, limestone cliffs, and snorkeling with colorful tropical reef fish in Maya Bay.', icon: 'waves' },
      { title: 'Grand Palace & Wat Pho Shrines', description: 'Gilded stupas, ancient murals, and the magnificent 46-meter Reclining Buddha in Bangkok.', icon: 'temple_buddhist' },
      { title: 'Chiang Mai Ethical Elephant Sanctuary', description: 'Observe and bathe rescued elephants respectfully in lush northern mountain valleys.', icon: 'pets' },
      { title: 'Vibrant Night Food Markets', description: 'Lively evening night bazaars filled with local street crafts, fresh tropical fruit, and acoustic music.', icon: 'storefront' },
    ],
  },
};

export function getDestinationLogistics(slug: string): DestinationLogistics {
  const normalized = slug.toLowerCase().trim();
  if (DESTINATION_LOGISTICS_MAP[normalized]) {
    return DESTINATION_LOGISTICS_MAP[normalized];
  }

  // Fallback defaults for other destinations
  return {
    bestMonths: 'October to April (Pleasant weather)',
    flightDuration: 'Connected with convenient flights from major Indian hubs',
    visaPolicy: 'Convenient tourist visa or eVisa assistance provided by Jeto concierge',
    vegDiningEase: 'Moderate',
    vegTip: 'Our concierge pre-screens hotel restaurants to arrange pure vegetarian dining and reliable breakfasts.',
    idealDuration: '5 to 8 Days',
    currency: 'Local Currency / USD',
    highlights: [
      { title: 'Handpicked Boutique Accommodations', description: 'Verified central properties offering genuine local hospitality and comfort.', icon: 'hotel' },
      { title: 'Private Chauffeur & Transfers', description: 'Dedicated air-conditioned vehicle with trusted, experienced local drivers.', icon: 'directions_car' },
      { title: 'Curated Cultural Walks', description: 'Flexible pacing designed around your family\'s preferences without commercial shopping stops.', icon: 'palette' },
      { title: '24/7 On-Ground WhatsApp Support', description: 'Direct access to regional coordinators for smooth check-ins and emergency assistance.', icon: 'support_agent' },
    ],
  };
}
