import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SITE_BRAND, SITE_CONTACT } from '@/data/site-content';

export const metadata = {
  title: `About ${SITE_BRAND.name} | Our Story & Travel Philosophy`,
  description:
    'Learn about Jeto Vacations, where luxury bespoke holiday planning meets personal human care for Indian families and couples.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface pt-24 pb-20">
      {/* ── 1. CINEMATIC HERO ── */}
      <section className="relative h-[55vh] min-h-[420px] w-full overflow-hidden bg-primary text-on-primary flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000"
            alt="Scenic coastline"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary-container/85 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent z-10" />
        </div>

        <div className="relative z-20 max-w-3xl mx-auto">
          <span className="text-secondary-container text-xs uppercase tracking-[0.2em] font-bold block mb-4">
            ✦ The Jeto Philosophy
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-on-primary mb-6 leading-tight">
            Travel planned by people, <br />
            <span className="italic font-normal text-on-tertiary-container">not algorithms.</span>
          </h1>
          <p className="font-sans text-base sm:text-lg text-surface-container-low/90 max-w-xl mx-auto font-light leading-relaxed">
            We build holidays around your family&apos;s real habits—preferred waking times, dietary needs, comfortable private vehicles, and authentic boutique stays.
          </p>
        </div>
      </section>

      {/* ── 2. STORY & PURPOSE ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-surface-container-high/80">
            <Image
              src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=1000"
              alt="Halong Bay cruise"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-xl max-w-xs border border-surface-container-high">
            <p className="text-primary font-serif italic text-base sm:text-lg leading-relaxed">
              &ldquo;A good holiday is more than a list of tourist stops. It is the peace of knowing every transfer is taken care of.&rdquo;
            </p>
            <span className="block mt-3 text-secondary font-sans font-bold text-xs uppercase tracking-wider">
              — The Jeto Team
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary block">
            Beyond the Booking Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary leading-tight">
            Why We Started Jeto Vacations
          </h2>
          <p className="text-base text-on-surface-variant leading-relaxed">
            The travel industry today is dominated by algorithmic marketplaces and rigid bus tours. Indian travelers are frequently forced to choose between cookie-cutter 40-person group tours with 6:00 AM departures or chaotic DIY booking across dozen websites without any local safety net.
          </p>
          <p className="text-base text-on-surface-variant leading-relaxed">
            At Jeto Vacations, we bridge that gap. Every holiday begins with a human conversation. Whether you need connecting rooms for elderly parents, pure Jain meals at remote Swiss mountain towns, or a private cliffside villa in Bali with vetted chauffeurs, we take ownership of every detail start to finish.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm">
              <h4 className="font-serif text-lg font-bold text-primary flex items-center gap-2 mb-1.5">
                <span className="text-secondary text-sm">✦</span> Truly Personal
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                One dedicated travel consultant designs your moodboard and supports you on WhatsApp throughout the journey.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-high shadow-sm">
              <h4 className="font-serif text-lg font-bold text-primary flex items-center gap-2 mb-1.5">
                <span className="text-secondary text-sm">✦</span> Transparent Inclusions
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Zero surprise commercial shopping stops or hidden fees. We explain exactly what you are paying for upfront.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. CORE COMMITMENTS ── */}
      <section className="bg-surface-container py-24 px-6 sm:px-10 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-2">
              Our Core Promises
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary">
              How We Protect Your Holiday Peace of Mind
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'verified',
                title: 'Clarity & Truth',
                desc: 'Honest price benchmarks, realistic travel pacing, and truthful inclusions. If a destination is crowded or under monsoons, we tell you frankly before you book.',
              },
              {
                icon: 'volunteer_activism',
                title: 'Family-Centric Care',
                desc: 'We design trips considering multi-generational realities: comfortable stair-free rooms, kid-friendly transit spacing, and vetted vegetarian dining partners.',
              },
              {
                icon: 'support_agent',
                title: '24/7 Real-Time Safety Net',
                desc: 'Our on-ground partners and dedicated WhatsApp concierge team are on standby round the clock to solve flight re-routings, driver delays, or room changes instantly.',
              },
            ].map((val) => (
              <div
                key={val.title}
                className="p-8 bg-surface-container-lowest rounded-3xl shadow-sm border border-surface-container-high text-left flex flex-col justify-between"
              >
                <div>
                  <span className="material-symbols-outlined text-3xl text-secondary mb-4 block">
                    {val.icon}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-primary mb-3">{val.title}</h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. CLOSING CTA ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-4">
          Ready to experience the Jeto difference?
        </h2>
        <p className="text-on-surface-variant max-w-lg mx-auto text-sm sm:text-base mb-8">
          Share your holiday ideas with us. We will craft a preliminary interactive itinerary with zero obligation to book.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/custom-holiday"
            className="px-8 py-3.5 rounded-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary font-bold text-sm shadow-md transition-all"
          >
            Plan My Trip
          </Link>
          <a
            href={`https://wa.me/91${SITE_CONTACT.phone}?text=Hi%20Jeto,%20I'd%20like%20to%20know%20more%20about%20your%20holiday%20planning.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full border border-secondary text-secondary hover:bg-secondary/10 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
}
