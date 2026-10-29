'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SITE_BRAND, SITE_CONTACT } from '@/data/site-content';

const currentYear = new Date().getFullYear();

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full border-t border-white/10 bg-primary px-5 pb-24 pt-16 text-slate-300 sm:px-8 sm:pb-14 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Main Grid: Responsive 12-column layout */}
        <div className="grid grid-cols-1 gap-10 pb-14 lg:grid-cols-12 lg:gap-12">
          {/* Brand & Newsletter (12 cols on mobile, 5 cols on lg) */}
          <div className="space-y-6 lg:col-span-5">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 group">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary font-serif text-lg font-bold text-white shadow-md transition-transform group-hover:scale-105">
                  J
                </span>
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  {SITE_BRAND.name}
                </span>
              </Link>
              <p className="mt-3 max-w-sm text-sm text-slate-300 leading-relaxed">
                Handcrafted international and domestic holiday itineraries planned by real travel experts. Transparent pricing, verified inclusions, and 24/7 on-trip concierge.
              </p>
            </div>

            {/* Direct Contact Bar */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-300">
              <a
                href={`tel:+91${SITE_CONTACT.phone}`}
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-sm text-secondary-container">call</span>
                <span>+91 {SITE_CONTACT.phone}</span>
              </a>
              <span className="text-white/20">•</span>
              <a
                href={`https://wa.me/91${SITE_CONTACT.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
              >
                <span className="material-symbols-outlined text-sm text-emerald-400">chat</span>
                <span>WhatsApp Concierge</span>
              </a>
              <span className="text-white/20">•</span>
              <span className="text-slate-400">{SITE_CONTACT.supportHours}</span>
            </div>

            {/* Newsletter Dispatch Card */}
            <div className="max-w-md rounded-2xl bg-primary-container/70 border border-white/10 p-4 sm:p-5 shadow-inner">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-secondary-container">
                The Voyage Dispatch
              </span>
              <p className="mb-3 text-xs text-slate-300 leading-relaxed">
                Receive private seasonal flight routes, secluded villa collections, and early booking perks.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 p-2.5 text-xs text-emerald-300">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Thank you for joining our private dispatch.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Email address for private dispatch"
                    className="w-full flex-1 rounded-full bg-white/10 border border-white/15 px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto rounded-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim px-5 py-2.5 text-xs font-bold text-on-primary transition-all shadow-md shrink-0 cursor-pointer text-center whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Navigation Links Grid: 2 columns on mobile, 3 on tablet/desktop */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 pt-2 lg:pt-0">
            {/* Column 1: Featured Destinations */}
            <nav aria-label="Footer Destinations" className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2">
                Destinations
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {[
                  { name: 'Switzerland', slug: 'switzerland' },
                  { name: 'Maldives', slug: 'maldives' },
                  { name: 'Bali', slug: 'bali' },
                  { name: 'Dubai', slug: 'dubai' },
                  { name: 'Vietnam', slug: 'vietnam' },
                  { name: 'Kashmir Valley', slug: 'kashmir' },
                  { name: 'Kerala Backwaters', slug: 'kerala' },
                  { name: 'Rajasthan Heritage', slug: 'rajasthan' },
                ].map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/destinations/${item.slug}`}
                      className="text-slate-300 hover:text-white hover:translate-x-0.5 transition-all inline-block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Column 2: Holiday Planning */}
            <nav aria-label="Footer Holiday Planning" className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2">
                Planning
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link href="/holidays" className="text-slate-300 hover:text-white transition-colors">
                    All 400+ Packages
                  </Link>
                </li>
                <li>
                  <Link href="/custom-holiday" className="text-slate-300 hover:text-white transition-colors">
                    Bespoke Trip Designer
                  </Link>
                </li>
                <li>
                  <Link href="/multi-city" className="text-slate-300 hover:text-white transition-colors">
                    Multi-City Planner
                  </Link>
                </li>
                <li>
                  <Link href="/help-me-choose" className="text-slate-300 hover:text-white transition-colors">
                    Holiday Matchmaker Quiz
                  </Link>
                </li>
                <li>
                  <Link href="/compare" className="text-slate-300 hover:text-white transition-colors">
                    Side-by-Side Compare
                  </Link>
                </li>
                <li>
                  <Link href="/travel-guides" className="text-slate-300 hover:text-white transition-colors">
                    Editorial Travel Guides
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Column 3: Company & Trust (Spans 2 cols on mobile if odd, or 1 on sm+) */}
            <nav aria-label="Footer Company & Trust" className="col-span-2 sm:col-span-1 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2">
                Company &amp; Trust
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                    Our Story &amp; Team
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
                    Contact Concierge
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="text-slate-300 hover:text-white transition-colors">
                    Traveler Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-300 hover:text-white transition-colors">
                    Booking Safeguards &amp; Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">
                    Privacy Policy (DPDP)
                  </Link>
                </li>
              </ul>

              {/* Registered Legal Credentials */}
              <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">Office Address</p>
                <address className="not-italic leading-relaxed">{SITE_CONTACT.registeredAddress}</address>
                <p>GSTIN: <span className="font-mono text-slate-300">{SITE_CONTACT.gstin}</span></p>
              </div>
            </nav>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal Utility Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-400 text-center sm:text-left">
          <p>© {currentYear} {SITE_BRAND.name} Pvt Ltd. All rights reserved. Handcrafted luxury travel curation.</p>
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs">
            <Link href="/terms" className="text-slate-300 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/sitemap.xml" className="text-slate-300 hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
