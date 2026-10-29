import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QuoteModalProvider } from "@/context/QuoteModalContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { RequestQuoteModal } from "@/components/common/RequestQuoteModal";
import { WishlistDrawer } from "@/components/common/WishlistDrawer";
import { SITE_ORIGIN, SITE_BRAND } from "@/data/site-content";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: `${SITE_BRAND.name} | Bespoke Holiday Planning for Curious Travelers`,
    template: `%s | ${SITE_BRAND.name}`,
  },
  description:
    'Curated international and domestic holiday packages designed for discerning Indian travelers. Thoughtfully crafted itineraries with transparent pricing and 24/7 on-trip concierge.',
  keywords: [
    'custom holidays India',
    'bespoke travel agency',
    'Switzerland family tour',
    'Maldives overwater villa honeymoon',
    'Vietnam Halong Bay cruise',
    'Kashmir valley tour package',
    'Jeto Vacations',
  ],
  authors: [{ name: 'Jeto Vacations Concierge Team' }],
  openGraph: {
    title: 'Jeto Vacations | Bespoke Holiday Planning for Curious Travelers',
    description:
      'Handcrafted holiday itineraries planned by real consultants. 100% customised, clear inclusions, and dedicated on-trip support.',
    url: SITE_ORIGIN,
    siteName: 'Jeto Vacations',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jeto Vacations | Bespoke Holiday Planning',
    description: 'Handcrafted holiday itineraries planned by real consultants. 100% customised with clear inclusions.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface">
        <QuoteModalProvider>
          <WishlistProvider>
            <CurrencyProvider>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <RequestQuoteModal />
              <WishlistDrawer />
            </CurrencyProvider>
          </WishlistProvider>
        </QuoteModalProvider>
      </body>
    </html>
  );
}
