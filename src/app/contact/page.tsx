'use client';

import React from 'react';
import Image from 'next/image';
import { SITE_CONTACT } from '@/data/site-content';
import { useQuoteModal } from '@/context/QuoteModalContext';

export default function ContactPage() {
  const { openQuoteModal } = useQuoteModal();

  return (
    <div className="min-h-screen bg-background text-on-surface pt-24 pb-20">
      {/* ── 1. HERO ── */}
      <section className="relative h-[48vh] min-h-[380px] w-full overflow-hidden bg-primary text-on-primary flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000"
            alt="Dubai skyline and dunes"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary-container/85 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent z-10" />
        </div>

        <div className="relative z-20 max-w-3xl mx-auto">
          <span className="text-secondary-container text-xs uppercase tracking-[0.2em] font-bold block mb-3">
            ✦ We&apos;re Here to Help
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-on-primary mb-4 leading-tight">
            Let&apos;s start the <span className="italic font-normal text-on-tertiary-container">conversation.</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-surface-container-low/90 max-w-lg mx-auto font-light leading-relaxed">
            Speak directly with experienced holiday planners. No automated switchboards or robotic chatbots.
          </p>
        </div>
      </section>

      {/* ── 2. CONTACT OPTIONS & DIRECT DESK ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column (7 cols): Contact Avenues */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-secondary block mb-1">
              Direct Communication Desks
            </span>
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">
              Get in Touch with our Trip Designers
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Whether you have exact travel dates or just an early moodboard idea, we are delighted to talk through destinations, visa feasibility, and flight connections.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* WhatsApp Box */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">chat</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-primary mb-1">WhatsApp Concierge</h4>
                <p className="text-xs text-on-surface-variant mb-4">
                  Quickest way to ask queries, share vacation moodboards, or request a callback.
                </p>
              </div>
              <a
                href={`https://wa.me/91${SITE_CONTACT.phone}?text=Hi%20Jeto,%20I'd%20like%20to%20plan%20a%20holiday.`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#128C7E] hover:underline flex items-center gap-1"
              >
                <span>Chat +91 {SITE_CONTACT.phone}</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </a>
            </div>

            {/* Direct Phone */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">call</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-primary mb-1">Phone Consultation</h4>
                <p className="text-xs text-on-surface-variant mb-4">
                  Mon – Sat: 9:00 AM – 7:00 PM IST. Dedicated Indian holiday planners.
                </p>
              </div>
              <a
                href={`tel:${SITE_CONTACT.phone}`}
                className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
              >
                <span>Call +91 {SITE_CONTACT.phone}</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </a>
            </div>

            {/* Email Support */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">mail</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-primary mb-1">Email Inquiries</h4>
                <p className="text-xs text-on-surface-variant mb-4">
                  Send detailed RFP, corporate group specifications, or family briefs.
                </p>
              </div>
              <a
                href={`mailto:${SITE_CONTACT.email}`}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>{SITE_CONTACT.email}</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </a>
            </div>

            {/* Verified Business Details */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-surface-container text-outline flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">verified</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-primary mb-1">Registered Entity</h4>
                <p className="text-xs text-on-surface-variant mb-2">
                  Jeto Vacations Pvt. Ltd. Verified luxury travel curator.
                </p>
                <address className="text-xs not-italic leading-relaxed text-on-surface-variant">
                  {SITE_CONTACT.registeredAddress}
                </address>
              </div>
              <span className="text-[11px] font-mono text-outline font-semibold">
                GSTIN: {SITE_CONTACT.gstin}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Interactive Quote Shortcut Card */}
        <div className="lg:col-span-5 bg-surface-container p-8 sm:p-10 rounded-3xl border border-surface-container-high flex flex-col justify-between text-center">
          <div>
            <div className="w-14 h-14 mx-auto rounded-full bg-on-tertiary-container/10 text-on-tertiary-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">edit_calendar</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-primary mb-3">
              Request a Custom Proposal
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
              Skip the back-and-forth. Fill out our 2-step holiday preferences modal to receive a tailored itinerary blueprint on WhatsApp or email.
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => openQuoteModal()}
              className="w-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary font-sans font-bold text-sm py-3.5 px-6 rounded-full shadow-md transition-all cursor-pointer"
            >
              Plan My Trip Now
            </button>
            <p className="text-[11px] text-outline italic">
              Zero obligation to book • Handcrafted by humans
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
