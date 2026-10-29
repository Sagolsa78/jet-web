'use client';

import React, { useState } from 'react';
import { SITE_BRAND } from '@/data/site-content';

interface ShareItineraryActionsProps {
  packageTitle: string;
  duration: string;
  startingPrice: string;
  highlights: string[];
  inclusions: string[];
  slug: string;
}

export function ShareItineraryActions({
  packageTitle,
  duration,
  startingPrice,
  highlights,
  inclusions,
  slug,
}: ShareItineraryActionsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `✈️ *${SITE_BRAND.name} Holiday Proposal: ${packageTitle}*
⏱️ *Duration:* ${duration}
🏷️ *Indicative Benchmark:* ${startingPrice}/person (Twin Sharing)

🌟 *Key Highlights:*
${highlights.slice(0, 3).map((h) => `• ${h}`).join('\n')}

🛡️ *Inclusions:*
${inclusions.slice(0, 3).map((inc) => `• ${inc}`).join('\n')}

📄 *Explore & Customise Route:*
https://jetovacations.com/holidays/${slug}

(Shared from Jeto Vacations — 100% human travel planning)`;

  const handleWhatsAppShare = () => {
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-3 no-print">
      {/* WhatsApp Share to Family Group */}
      <button
        type="button"
        onClick={handleWhatsAppShare}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 text-xs font-bold transition-all border border-[#25D366]/30 cursor-pointer shadow-xs"
        title="Share this itinerary summary with family on WhatsApp"
      >
        <span className="material-symbols-outlined text-base text-[#128C7E]">share</span>
        <span>Share to WhatsApp Group</span>
      </button>

      {/* Copy Summary */}
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-surface-container-high/60 text-on-surface-variant hover:bg-surface-container-high text-xs font-semibold transition-all border border-surface-container-high cursor-pointer"
        title="Copy proposal summary to clipboard"
      >
        <span className="material-symbols-outlined text-sm">
          {copied ? 'check_circle' : 'content_copy'}
        </span>
        <span>{copied ? 'Copied Summary!' : 'Copy Summary'}</span>
      </button>

      {/* Print / Save PDF */}
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-surface-container-high/60 text-on-surface-variant hover:bg-surface-container-high text-xs font-semibold transition-all border border-surface-container-high cursor-pointer"
        title="Print or save 1-page itinerary moodboard as PDF"
      >
        <span className="material-symbols-outlined text-sm">print</span>
        <span>Print / PDF Moodboard</span>
      </button>
    </div>
  );
}
