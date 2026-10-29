'use client';

import React, { createContext, useContext, useSyncExternalStore, ReactNode } from 'react';

export type CurrencyCode = 'INR' | 'USD' | 'AED' | 'EUR' | 'GBP';

interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // multiplier from INR (1 INR = rate Foreign Currency)
  flag: string;
}

export const CURRENCY_RATES: Record<CurrencyCode, CurrencyRate> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 1, flag: '🇮🇳' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.0118, flag: '🇺🇸' },
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rate: 0.0435, flag: '🇦🇪' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.011, flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0092, flag: '🇬🇧' },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInINR: number | undefined | null) => string;
  currentRate: CurrencyRate;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'jeto_preferred_currency';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot(): CurrencyCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode;
    return stored && CURRENCY_RATES[stored] ? stored : 'INR';
  } catch {
    return 'INR';
  }
}

function getServerSnapshot(): CurrencyCode {
  return 'INR';
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const currency = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setCurrency = (code: CurrencyCode) => {
    try {
      localStorage.setItem(STORAGE_KEY, code);
      window.dispatchEvent(new Event('storage'));
    } catch {
      // Ignore
    }
  };

  const currentRate = CURRENCY_RATES[currency];

  const formatPrice = (amountInINR: number | undefined | null): string => {
    if (amountInINR === undefined || amountInINR === null || isNaN(amountInINR) || amountInINR <= 0) {
      return 'Custom quote';
    }

    if (currency === 'INR') {
      return `₹${Math.round(amountInINR).toLocaleString('en-IN')}`;
    }

    const converted = amountInINR * currentRate.rate;
    const rounded = Math.round(converted);
    return `${currentRate.symbol}${rounded.toLocaleString('en-US')}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        currentRate,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
