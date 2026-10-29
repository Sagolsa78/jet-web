import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_BRAND, SITE_CONTACT } from '@/data/site-content';

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_BRAND.name}`,
  description: `Privacy policy and personal data protection principles for travellers of ${SITE_BRAND.name}.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-surface pb-24 pt-36 sm:pt-44">
      <div className="mx-auto max-w-4xl px-6 sm:px-10">
        <div className="mb-12 border-b border-surface-container-high pb-8">
          <span className="font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-secondary">
            Transparency &amp; Trust
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-primary sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 font-sans text-sm text-on-surface-variant">
            Last updated: October 2026 · Registered Entity GSTIN: {SITE_CONTACT.gstin}
          </p>
        </div>

        <div className="space-y-8 font-sans text-sm leading-relaxed text-on-surface-variant sm:text-base">
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-primary sm:text-2xl">
              1. Our Data Commitment
            </h2>
            <p>
              At {SITE_BRAND.name}, we believe ethical travel begins with clear, honest data practices.
              We only collect information necessary to design, quote, book, and coordinate your holiday
              itineraries. We do not sell your personal data to marketing brokers or automated lead networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-primary sm:text-2xl">
              2. Information We Collect
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Trip Requirements:</strong> Desired destinations, dates, duration, hotel tiers,
                number of adult and child travellers, dietary needs (e.g. Jain or Pure Veg), and travel pace.
              </li>
              <li>
                <strong>Contact Details:</strong> Your name, phone/WhatsApp number, email address, and departure city.
              </li>
              <li>
                <strong>Booking Documentation:</strong> When you proceed to confirmed bookings, passport details,
                visa paperwork, and flight preferences required by hotels, airlines, and local ground handlers.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-primary sm:text-2xl">
              3. How We Use Your Data
            </h2>
            <p>
              Your details are shared solely with verified ground travel partners (drivers, local tour guides,
              resorts) directly responsible for executing your trip. Our dedicated human travel consultants use
              your contact channels exclusively to share proposals, itineraries, and on-trip assistance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-primary sm:text-2xl">
              4. Security &amp; Retention
            </h2>
            <p>
              We maintain industry-standard security controls. We retain booking and tax records in accordance
              with Indian statutory requirements for our GST registration ({SITE_CONTACT.gstin}).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-primary sm:text-2xl">
              5. Contact Our Privacy Team
            </h2>
            <p>
              For data access, correction requests, or questions regarding this policy, reach us directly at{' '}
              <a href={`mailto:${SITE_CONTACT.email}`} className="font-semibold text-secondary underline">
                {SITE_CONTACT.email}
              </a>{' '}
              or via WhatsApp at{' '}
              <a
                href={`https://wa.me/91${SITE_CONTACT.phone}`}
                className="font-semibold text-secondary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                +91 {SITE_CONTACT.phone}
              </a>.
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
            href="/terms"
            className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
          >
            Read Terms &amp; Conditions →
          </Link>
        </div>
      </div>
    </div>
  );
}
