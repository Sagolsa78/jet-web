import React from 'react';
import { Metadata } from 'next';
import { SITE_BRAND, SITE_CONTACT } from '@/data/site-content';
import { DestinationMatchmakerQuiz } from '@/components/home/DestinationMatchmakerQuiz';
import Link from 'next/link';

export const metadata: Metadata = {
  title: `Help Me Choose | Destination Matchmaker | ${SITE_BRAND.name}`,
  description:
    'Take our 60-second visual matchmaker quiz to find the perfect holiday itinerary tailored to your group size, pacing, and benchmark budget.',
  openGraph: {
    title: `Find Your Ideal Holiday Match | ${SITE_BRAND.name}`,
    description:
      'Answer 4 quick questions to discover handcrafted travel itineraries designed around your preferences.',
  },
};

export default function HelpMeChoosePage() {
  return (
    <div className="min-h-screen bg-background text-on-surface pt-24 pb-20">
      {/* Breadcrumb & Intro */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-8 mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-outline mb-4">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-secondary">Destination Matchmaker</span>
        </div>
      </div>

      {/* Main Quiz Container */}
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        <DestinationMatchmakerQuiz />

        {/* Human Concierge Callout */}
        <div className="mt-12 bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high/80 text-center max-w-2xl mx-auto shadow-xs">
          <span className="material-symbols-outlined text-3xl text-secondary mb-2">support_agent</span>
          <h3 className="font-serif text-xl font-bold text-primary mb-2">
            Prefer talking directly to a travel consultant?
          </h3>
          <p className="font-sans text-xs text-on-surface-variant max-w-md mx-auto mb-5 leading-relaxed">
            Our destination specialists are available Monday to Saturday, 9 AM – 7 PM IST. No automated robot menus—just knowledgeable human planners.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/91${SITE_CONTACT.phone}?text=Hi%20Jeto,%20I'd%20like%20guidance%20choosing%20the%20right%20holiday%20destination.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#1ebd59] text-xs font-bold transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              <span>Chat with a Planner on WhatsApp</span>
            </a>
            <a
              href={`tel:+91${SITE_CONTACT.phone}`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-surface-container-high text-primary hover:bg-surface-container-highest text-xs font-bold transition-all"
            >
              <span className="material-symbols-outlined text-sm">call</span>
              <span>Call +91 {SITE_CONTACT.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
