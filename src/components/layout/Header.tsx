'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { SITE_BRAND, SITE_CONTACT } from '@/data/site-content';
import { useQuoteModal } from '@/context/QuoteModalContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency, CURRENCY_RATES, CurrencyCode } from '@/context/CurrencyContext';

const navLinks = [
  { name: 'Holidays', href: '/holidays' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'Multi-City', href: '/multi-city' },
  { name: 'Trip Builder', href: '/trip-builder' },
  { name: 'Help Me Choose', href: '/help-me-choose' },
  { name: 'Travel Guides', href: '/travel-guides' },
  { name: 'Contact', href: '/contact' },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openQuoteModal } = useQuoteModal();
  const { wishlistCount, openDrawer } = useWishlist();
  const { currency, setCurrency, currentRate } = useCurrency();
  const currencyMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close currency dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Top Announcement Bar */}
      <div className="flex items-center justify-between bg-primary-container px-4 py-2 text-[12px] font-medium text-surface-container-low sm:px-8">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-secondary-container">auto_awesome</span>
          <span>Handcrafted holidays planned by real consultants</span>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <span>+91 {SITE_CONTACT.phone} • WhatsApp us anytime</span>
          <span className="h-2 w-2 rounded-full bg-secondary-container" />
        </div>
      </div>

      {/* Main Navigation */}
      <div
        className={`flex h-20 items-center justify-between border-b px-4 transition-all duration-300 sm:px-6 lg:px-10 ${
          scrolled
            ? 'border-outline-variant/30 bg-surface-container-lowest/95 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-md'
            : 'border-outline-variant/20 bg-surface-container-lowest/90 backdrop-blur-md'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-container text-lg font-bold text-on-primary">
            J
          </div>
          <span className="font-serif text-[22px] font-semibold tracking-tight text-primary">
            {SITE_BRAND.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-on-surface-variant transition-colors hover:text-secondary"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Dropdown */}
          <div className="relative" ref={currencyMenuRef}>
            <button
              type="button"
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-outline-variant/40 bg-surface-container-lowest text-xs font-semibold text-primary hover:bg-surface-container-low transition-colors shadow-sm cursor-pointer"
              aria-label="Select currency"
              title="Change Currency"
            >
              <span>{currentRate.flag}</span>
              <span className="font-mono">{currency}</span>
              <span className="material-symbols-outlined text-[14px] text-outline">
                {currencyDropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-surface-container-lowest p-2 shadow-2xl border border-outline-variant/30 z-50 animate-fade-in">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-outline border-b border-surface-container-high/40 mb-1">
                  Display Currency
                </div>
                {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((code) => {
                  const rate = CURRENCY_RATES[code];
                  const isSelected = currency === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setCurrency(code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-secondary/10 font-bold text-secondary'
                          : 'text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{rate.flag}</span>
                        <span>{code}</span>
                      </span>
                      <span className="text-[11px] text-outline font-mono">{rate.symbol}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={openDrawer}
            className="relative flex items-center justify-center p-2 rounded-full text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
            aria-label="View saved itineraries"
            title="Saved Itineraries"
          >
            <span className="material-symbols-outlined text-2xl text-secondary">
              {wishlistCount > 0 ? 'favorite' : 'favorite_border'}
            </span>
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-on-tertiary-container text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => openQuoteModal({ source: 'header', notes: 'Callback requested from website navigation header' })}
            className="hidden items-center gap-2 rounded-full bg-on-tertiary-container px-5 py-2.5 text-xs font-bold text-on-primary shadow-sm transition-all hover:bg-tertiary-fixed-dim sm:inline-flex cursor-pointer"
          >
            <span>Talk to an Expert</span>
            <span className="material-symbols-outlined text-sm">phone_in_talk</span>
          </button>

          <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary lg:flex">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="p-2 text-primary xl:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            <span className="material-symbols-outlined text-2xl">{isOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav
          id="mobile-navigation"
          className="flex animate-fade-in flex-col gap-1 border-b border-outline-variant/30 bg-surface-container-lowest p-4 shadow-xl xl:hidden max-h-[85vh] overflow-y-auto"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="rounded-xl px-4 py-3 text-base font-medium text-on-surface transition-colors hover:bg-surface-container-low"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Currency Bar */}
          <div className="mt-2 border-t border-surface-container-high/60 pt-3 px-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline mb-2 block">
              Display Currency
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map((code) => {
                const rate = CURRENCY_RATES[code];
                const isSelected = currency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-secondary text-on-secondary font-bold shadow-sm'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="text-sm">{rate.flag}</span>
                    <span className="text-[10px] font-mono mt-0.5">{code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-2 border-t border-surface-container-high pt-3">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-on-tertiary-container px-6 py-3 text-sm font-semibold text-on-primary cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                openQuoteModal({ source: 'header', notes: 'Mobile navigation callback request' });
              }}
            >
              <span>Talk to an Expert</span>
              <span className="material-symbols-outlined text-sm">phone_in_talk</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
