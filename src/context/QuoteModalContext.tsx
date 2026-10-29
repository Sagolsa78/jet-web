'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface QuotePrefillData {
  destination?: string;
  packageId?: string;
  packageTitle?: string;
  budgetRange?: string;
  travelStyle?: string;
  duration?: string;
  notes?: string;
  source?: 'header' | 'package_card' | 'package_detail' | 'exit_popup';
}

interface QuoteModalContextType {
  isOpen: boolean;
  prefillData: QuotePrefillData | null;
  openQuoteModal: (data?: QuotePrefillData) => void;
  closeQuoteModal: () => void;
}

const QuoteModalContext = createContext<QuoteModalContextType | undefined>(undefined);

export function QuoteModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<QuotePrefillData | null>(null);

  const openQuoteModal = (data?: QuotePrefillData) => {
    setPrefillData(data || null);
    setIsOpen(true);
  };

  const closeQuoteModal = () => {
    setIsOpen(false);
  };

  return (
    <QuoteModalContext.Provider
      value={{
        isOpen,
        prefillData,
        openQuoteModal,
        closeQuoteModal,
      }}
    >
      {children}
    </QuoteModalContext.Provider>
  );
}

export function useQuoteModal() {
  const context = useContext(QuoteModalContext);
  if (!context) {
    throw new Error('useQuoteModal must be used within a QuoteModalProvider');
  }
  return context;
}
