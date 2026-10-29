# Jeto Vacations — Bespoke Holiday Planning Platform

> **"The trip you've been dreaming of, designed around you."**  
> Modern customer-facing travel experience engineered for curious Indian and international travellers. Handcrafted itineraries, transparent inclusions, real-time customisation, and human-led concierge support.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2_Turbopack-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Lint](https://img.shields.io/badge/ESLint-9.x_Passing-brightgreen?style=flat&logo=eslint)](https://eslint.org/)

---

## 🌟 Key Features

### 1. 433-Package Inventory & Live Search
- **Curated Multi-Destination Blueprints**: Full inventory of 433 authentic itineraries spanning 15 International (Bali, Switzerland, Maldives, Thailand, Vietnam, Dubai, Singapore, Turkey, etc.) and 10 Domestic destinations (Kashmir, Kerala, Andaman, Ladakh, Goa, Himachal, Rajasthan, etc.).
- **Live Autocomplete Search Dock**: Search packages or destinations instantly with interactive category filters, duration badges, and pricing benchmarks.
- **Dynamic Multi-Faceted Filters**: Instant client-side filtering by travel style (Honeymoon, Family, Adventure, Luxury, Culture, Groups), budget range, duration, and region.

### 2. Atmospheric Background Video Hero
- **Self-Hosted Progressive Streaming**: 720p H.264 MP4 (`1.9 MB`) and VP9 WebM (`2.3 MB`) video loop with instant poster fallback (`124 KB`).
- **Cinematic Scrim Overlay**: High-contrast brand gradients (`#0B233F` deep navy, `#006973` teal, `#DA684A` coral) guaranteeing 100% WCAG AAA readability.
- **Floating Controls**: Integrated glassmorphic dock featuring Play/Pause, Mute/Unmute, and live location dispatch tagging.
- **Accessibility**: Subscribed to `(prefers-reduced-motion: reduce)` via React 19 `useSyncExternalStore` for zero layout shifts.

### 3. Interactive Itinerary Scrubber (Day-Customizer)
- **Real-Time Day Customisation**: Tweak hotel categories (3★ Boutique, 4★ Premium, 5★ Luxury Pool Villa) and swap day activities dynamically.
- **Floating Itinerary Dock**: Updates estimated benchmark costs in real-time as users customise their route.
- **One-Click Quotation**: Directly passes customised choices into the consultant quotation modal.

### 4. 60-Second "Help Me Choose" Destination Matchmaker Quiz
- Visual 4-step decision-tree quiz designed to combat choice paralysis for Indian couples and families.
- Evaluates travel party, ideal landscape, travel pace, and budget to provide 3 tailored destination matches.

### 5. Multi-City Cross-Border Route Planner
- Interactive builder (`/multi-city`) allowing travellers to assemble complex multi-stop itineraries (e.g. *Vietnam + Cambodia* or *Swiss Alps + Paris*).
- Calculates consolidated travel timelines, transfer recommendations, and per-person estimates.

### 6. Confidential Proposal Architecture & Direct WhatsApp Confirmation
- Pre-formats detailed itinerary summaries for direct one-click WhatsApp concierge consultation.
- Proposal route (`/proposal/[id]`) acts as a secure, privacy-guarded viewer; unauthenticated or expired links safely render a confidentiality notice without exposing customer records.

### 7. Persistent Wishlist Drawer & Side-by-Side Comparator
- Local-storage-backed trip bookmarking system.
- Side-by-side package matrix (`/compare`) contrasting inclusions, pacing, stay standards, and benchmark prices.

### 8. 130+ Field Travel Guides Hub
- Magazine-style editorial articles covering packing guides, visa requirements, senior-citizen accessibility, and vegetarian/Jain dining advice.

---

## 🎨 Design System: Stitch Editorial Voyage

Built around a sophisticated travel editorial aesthetic:

| Token | Hex | Role |
| :--- | :--- | :--- |
| **Deep Navy** | `#0B233F` | Primary brand canvas, typography, and contrast backgrounds |
| **Ocean Teal** | `#006973` | Secondary accents, progress indicators, and interactive links |
| **Sunset Coral** | `#DA684A` | Primary conversion callouts, buttons, and high-priority tags |
| **Warm Sand** | `#F7F2E8` | Organic card backgrounds, borders, and tactile surfaces |
| **Pure White** | `#FFFFFF` | Surface containers and card interiors |

**Typography**:
- **Display / Headlines**: *Playfair Display* (Editorial Serif)
- **Body / Interface**: *Inter* (Clean Modern Sans-Serif)
- **Icons**: *Material Symbols Outlined* (Google Fonts CDN)

---

## 📂 Project Architecture

```
├── public/
│   ├── videos/              # Compressed background video (MP4, WebM, Poster)
│   └── icons & svgs         # Brand assets and vectors
├── src/
│   ├── app/
│   │   ├── page.tsx         # Homepage with Video Hero, Search, Curated Escapes, FAQs
│   │   ├── holidays/        # 433-package catalogue & /holidays/[slug] detail scrubber
│   │   ├── destinations/    # Regional hubs & /destinations/[slug] logistics cards
│   │   ├── themes/          # Travel style hubs (Honeymoon, Family, Adventure, Luxury)
│   │   ├── custom-holiday/  # 7-step validated trip enquiry wizard
│   │   ├── multi-city/      # Cross-border multi-stop route planner
│   │   ├── help-me-choose/  # 60-second visual matchmaker quiz
│   │   ├── proposal/[id]/   # Secure client proposal view (privacy-protected)
│   │   ├── compare/         # Side-by-side package comparison matrix
│   │   ├── travel-guides/   # 130+ field dispatches & article reader
│   │   ├── about/           # Brand philosophy, human designers vs algorithms
│   │   ├── contact/         # Direct hotline, WhatsApp concierge & registered GSTIN
│   │   ├── privacy/         # GDPR & Indian statutory privacy policy
│   │   ├── terms/           # Package assumptions, cancellation & booking terms
│   │   ├── robots.ts        # Search crawler directives
│   │   ├── sitemap.ts       # Dynamic XML sitemap generator
│   │   └── api/og/route.tsx # Dynamic social OpenGraph image generator
│   ├── components/
│   │   ├── common/          # RequestQuoteModal, WishlistDrawer
│   │   ├── destinations/    # DestinationExplorer, DestinationPackagesView
│   │   ├── holidays/        # InteractiveItineraryCustomizer, PackageQuoteButton
│   │   ├── home/            # HeroBackgroundVideo, SearchCard, CuratedPackages
│   │   ├── layout/          # Fixed Glass Header, Multi-column Footer
│   │   └── ui/              # Button, Card
│   ├── context/
│   │   ├── CurrencyContext  # Multi-currency state (INR, USD, EUR, GBP, AED)
│   │   ├── QuoteModalContext# Global lead modal state
│   │   └── WishlistContext  # LocalStorage saved trips manager
│   ├── data/
│   │   ├── live-crawled-packages.json # 433 official scraped packages & 129 blogs
│   │   ├── packages-unified.ts        # Unified catalogue querying engine
│   │   ├── destination-logistics.ts   # Visa rules, flight hours & dining ease
│   │   └── site-content.ts            # Brand constants, promises & contact details
│   └── lib/
│       ├── api/             # Typed CRM adapter boundary & mock development engine
│       └── validations/     # Zod enquiry schemas & field validation rules
└── next.config.ts           # Turbopack loaders, image remote patterns & caching
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `18.x` or higher (Recommended: Node 20+)
- npm, pnpm, or yarn

### Installation
```bash
# 1. Clone repository
git clone https://github.com/Sagolsa78/jet-web.git
cd jet-web

# 2. Install dependencies
npm install

# 3. Start local development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Quality & Verification Scripts

```bash
# Type checking (TypeScript)
npx tsc --noEmit

# Code linting (ESLint 9)
npm run lint

# Production build (Turbopack compiles all 630+ routes)
npm run build

# Start production server
npm start
```

---

## 🛡️ Statutory & Business Details

- **Brand**: Jeto Vacations
- **Tagline**: *No Tension, Only Vacation*
- **Registered GSTIN**: `07AAECJ6467D1ZI`
- **Concierge WhatsApp & Phone**: `+91 88825 79628`
- **Support Email**: `support@jetovacations.com`
- **Working Hours**: Mon–Sat, 9:00 AM – 7:00 PM IST

---

## 📄 License

Proprietary © 2026 Jeto Vacations. All rights reserved.
