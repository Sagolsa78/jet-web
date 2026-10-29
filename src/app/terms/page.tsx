import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_BRAND, SITE_CONTACT } from '@/data/site-content';

export const metadata: Metadata = {
  title: `Terms & Conditions | ${SITE_BRAND.name}`,
  description: `Booking terms, quotation assumptions, and travel conditions for bespoke holidays planned by ${SITE_BRAND.name}.`,
};

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-surface pb-24 pt-36 sm:pt-44">
      <div className="mx-auto max-w-4xl px-6 sm:px-10">
        <div className="mb-12 border-b border-surface-container-high pb-8">
          <span className="font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-secondary">
            Legal &amp; Booking Guidelines
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-primary sm:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 font-sans text-sm text-on-surface-variant">
            Last updated: October 2026 · Registered Entity GSTIN: {SITE_CONTACT.gstin}
          </p>
        </div>

        <div className="space-y-8 font-sans text-sm leading-relaxed text-on-surface-variant sm:text-base">
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-primary sm:text-2xl">
              1. Nature of Published Packages &amp; Quotations
            </h2>
            <p>
              All packages, itineraries, and costs presented on this website are indicative blueprints designed
              to demonstrate itinerary flow, curated boutique stays, and benchmark price ranges. Because flight
              airfares, resort seasonal surcharges, and currency exchange rates fluctuate continuously, no booking
              or price is binding until an official formal proposal is issued by our consultants and confirmed via deposit.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-primary sm:text-2xl">
              2. Customisation &amp; Revisions
            </h2>
            <p>
              We pride ourselves on offering bespoke itineraries. You are entitled to tailor day activities,
              upgrade hotel room categories, and adjust trip pacing with your dedicated travel consultant prior
              to voucher issuance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-primary sm:text-2xl">
              3. Visas, Passports &amp; Travel Regulations
            </h2>
            <p>
              While {SITE_BRAND.name} provides comprehensive visa guidance, check-post permit assistance, and
              application documentation support, the granting of any visa or transit authority remains at the
              sole discretion of the respective sovereign embassies and immigration departments. Indian passport
              holders must ensure a minimum of 6 months validity from their planned departure date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-primary sm:text-2xl">
              4. Payment &amp; Cancellation Policies
            </h2>
            <p>
              Standard booking confirmation requires a milestone deposit. Cancellation terms vary by destination,
              airline fare rules, and resort contractual obligations (particularly over peak holiday seasons such as
              Diwali, Christmas, and New Year). All applicable cancellation penalties will be stated explicitly in
              your booking confirmation paperwork before payment collection.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-primary sm:text-2xl">
              5. Dispute Resolution &amp; Jurisdiction
            </h2>
            <p>
              Any disputes arising from travel services coordinated under this agreement shall be governed by
              the laws of India and subject to the exclusive jurisdiction of the competent courts in New Delhi.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-container-high flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold text-secondary uppercase tracking-wider hover:underline"
          >
            ← Return to Homepage
          </Link>
          <Link
            href="/privacy"
            className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
          >
            Review Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
