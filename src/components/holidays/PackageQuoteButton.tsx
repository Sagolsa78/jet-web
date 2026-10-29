'use client';

import { useQuoteModal } from '@/context/QuoteModalContext';

interface PackageQuoteButtonProps {
  packageTitle: string;
  destination: string;
  budgetRange?: string;
  travelStyle?: string;
  duration?: string;
  className?: string;
  label?: string;
}

export function PackageQuoteButton({
  packageTitle,
  destination,
  budgetRange,
  travelStyle,
  duration,
  className = '',
  label = 'Request a Quote',
}: PackageQuoteButtonProps) {
  const { openQuoteModal } = useQuoteModal();

  return (
    <button
      type="button"
      onClick={() =>
        openQuoteModal({
          packageTitle,
          destination,
          budgetRange,
          travelStyle,
          duration,
          source: 'package_detail',
        })
      }
      className={`cursor-pointer transition-all active:scale-95 ${className}`}
    >
      {label}
    </button>
  );
}
