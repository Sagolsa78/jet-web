'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import { useQuoteModal } from '@/context/QuoteModalContext';
import { useCurrency } from '@/context/CurrencyContext';
import { SAMPLE_PACKAGES } from '@/data/sample-packages';

export function WishlistDrawer() {
  const { isDrawerOpen, closeDrawer, wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { openQuoteModal } = useQuoteModal();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock scroll when open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const savedPackages = wishlist
    .map((slug) => SAMPLE_PACKAGES.find((p) => p.slug === slug))
    .filter(Boolean);

  const handleCompare = () => {
    const compareSlugs = wishlist.slice(0, 3).join(',');
    closeDrawer();
    router.push(`/compare?packages=${compareSlugs}`);
  };

  const handleConsultantQuote = () => {
    closeDrawer();
    const packageTitles = savedPackages.map((p) => p?.title).filter(Boolean).join(', ');
    openQuoteModal({
      packageTitle: `Shortlisted Trips: ${packageTitles}`,
      notes: `Traveler saved ${savedPackages.length} packages in their wishlist for family review: ${packageTitles}. Please provide a comparative proposal.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print">
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-primary/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeDrawer}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-container-lowest shadow-2xl flex flex-col border-l border-surface-container-high animate-fade-in-up">
          {/* Header */}
          <div className="p-6 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low/40">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">favorite</span>
              <h2 className="font-serif text-xl font-bold text-primary">
                Saved Itineraries ({savedPackages.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
              aria-label="Close saved trips drawer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {savedPackages.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-secondary mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl">favorite_border</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-primary mb-1">
                  Your Wishlist is Empty
                </h3>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed max-w-xs mx-auto mb-6">
                  Browse our curated holidays and click the heart icon to save itineraries for family review and side-by-side comparison.
                </p>
                <Link
                  href="/holidays"
                  onClick={closeDrawer}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-colors"
                >
                  <span>Explore Curated Packages</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            ) : (
              savedPackages.map((pkg) => {
                if (!pkg) return null;
                const formattedPrice = formatPrice(pkg.startingPrice);

                return (
                  <div
                    key={pkg.id}
                    className="p-4 rounded-2xl bg-surface-container-low/50 border border-surface-container-high flex gap-3.5 hover:shadow-xs transition-shadow relative group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={pkg.heroImage}
                        alt={pkg.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-6">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-0.5">
                        {pkg.style} • {pkg.durationDays}D/{pkg.durationNights}N
                      </span>
                      <Link
                        href={`/holidays/${pkg.slug}`}
                        onClick={closeDrawer}
                        className="font-serif text-sm font-bold text-primary hover:text-secondary transition-colors line-clamp-1 block"
                      >
                        {pkg.title}
                      </Link>
                      <div className="font-serif text-sm font-bold text-primary mt-1">
                        {formattedPrice}{' '}
                        <span className="text-[10px] font-normal text-on-surface-variant font-sans">
                          / person
                        </span>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(pkg.slug)}
                      className="absolute top-3 right-3 text-outline hover:text-error transition-colors p-1"
                      title="Remove from saved trips"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          {savedPackages.length > 0 && (
            <div className="p-6 border-t border-surface-container-high bg-surface-container-lowest space-y-3">
              {savedPackages.length >= 2 && (
                <button
                  type="button"
                  onClick={handleCompare}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary text-on-secondary hover:bg-secondary/90 text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">compare_arrows</span>
                  <span>Compare Side-by-Side ({Math.min(savedPackages.length, 3)})</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleConsultantQuote}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <span>Request Proposal for Shortlist</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </button>

              <div className="flex justify-between items-center pt-2 text-[11px] text-outline">
                <span>Stored securely on your device</span>
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="hover:text-error transition-colors underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
