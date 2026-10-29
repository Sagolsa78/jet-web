'use client';

import { useQuoteModal } from '@/context/QuoteModalContext';
import { SITE_CONTACT } from '@/data/site-content';

export function ClosingCta() {
  const { openQuoteModal } = useQuoteModal();

  return (
    <section className="max-w-6xl w-full mx-auto px-6 my-16">
      <div className="rounded-3xl p-12 sm:p-16 text-on-primary text-center shadow-2xl relative overflow-hidden bg-gradient-to-r from-secondary via-primary-container to-primary">
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="font-sans text-[12px] font-bold text-secondary-container tracking-[0.2em] block mb-3 uppercase">
            ✦ Your Dedicated Travel Partner
          </span>
          <h2 className="font-serif text-[42px] sm:text-[52px] font-bold text-on-primary mb-4 leading-tight">
            Ready when you are.
          </h2>
          <p className="font-sans text-lg text-surface-container-low/90 mb-8 max-w-xl mx-auto leading-relaxed">
            No automated chatbots or generic packages. Talk to a real travel designer who cares about getting every single detail right for your family.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openQuoteModal()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary font-sans text-sm font-bold shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <span>Plan My Trip</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <a
              href={`https://wa.me/91${SITE_CONTACT.phone}?text=Hi%20Jeto%20Vacations,%20I'd%20like%20to%20plan%20a%20holiday.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-on-primary border border-surface-container-lowest/30 font-sans text-sm font-semibold backdrop-blur-sm transition-all"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
