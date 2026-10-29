'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SITE_BRAND, SITE_CONTACT, SITE_ORIGIN } from '@/data/site-content';
import { getProposalFromStorage, ProposalRecord } from '@/data/proposal-store';

function ProposalViewerContent() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string) || '';

  const [proposal] = useState<ProposalRecord | null>(() => getProposalFromStorage(id));
  const [copied, setCopied] = useState(false);

  if (!proposal) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-6 flex items-center justify-center bg-background">
        <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-high text-center shadow-lg">
          <div className="w-14 h-14 mx-auto rounded-full bg-surface-container-high text-secondary flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl">description</span>
          </div>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-1">
            Privacy &amp; Security Protected
          </span>
          <h1 className="font-serif text-2xl font-bold text-primary mb-3">
            Proposal Not Found or Expired
          </h1>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-6">
            For client confidentiality and data protection, holiday proposals are delivered directly by your personal Jeto travel designer via WhatsApp and official email.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/custom-holiday"
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary text-xs font-bold transition-all"
            >
              Plan a Custom Trip
            </Link>
            <a
              href={`https://wa.me/91${SITE_CONTACT.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const shareText = `✈️ *${SITE_BRAND.name} Holiday Proposal #${proposal.id}*
👤 *Prepared For:* ${proposal.fullName}
📍 *Destination:* ${proposal.destination}
⏱️ *Travel Window:* ${proposal.travelMonth} (Ex-${proposal.departureCity})
👥 *Group:* ${proposal.adults} Adults${proposal.children > 0 ? `, ${proposal.children} Children` : ''}
🏷️ *Benchmark Budget:* ${proposal.budgetRange}

📄 *View Full Proposal & Stays:*
${SITE_ORIGIN}/proposal/${proposal.id}

(Shared from Jeto Vacations — 100% human-designed private travel)`;

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-on-surface pt-24 pb-20">
      {/* ── BREADCRUMB & PROPOSAL STATUS (No print) ── */}
      <div className="max-w-4xl mx-auto px-6 pt-6 mb-6 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-outline">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/holidays" className="hover:text-primary transition-colors">
              Holidays
            </Link>
            <span>/</span>
            <span className="text-secondary">Proposal #{proposal.id}</span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 text-xs font-bold transition-colors border border-[#25D366]/30 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#128C7E]">share</span>
              <span>Share to Family WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-container-high/80 text-primary hover:bg-surface-container-high text-xs font-bold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN EDITORIAL PROPOSAL PAPER ── */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/80 p-8 sm:p-12 shadow-sm relative overflow-hidden">
          {/* Watermark Insignia */}
          <div className="absolute top-6 right-6 opacity-5 pointer-events-none font-serif text-9xl font-bold select-none">
            JETO
          </div>

          {/* Official Letterhead Header */}
          <div className="border-b-2 border-primary pb-8 mb-8 flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                  J
                </div>
                <span className="font-serif text-2xl font-bold text-primary tracking-tight">
                  {SITE_BRAND.name}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium">
                Reg GSTIN: {SITE_CONTACT.gstin || '07AAECJ6467D1ZI'} • Private Bespoke Travel Desk
              </p>
              <p className="text-xs text-on-surface-variant">
                Hotline: +91 {SITE_CONTACT.phone} • Email: {SITE_CONTACT.email}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider mb-2">
                Curated Travel Proposal
              </span>
              <div className="font-mono text-xs font-bold text-primary">
                Ref: #{proposal.id}
              </div>
              <div className="text-xs text-outline mt-0.5">
                Issued: {proposal.createdAt}
              </div>
            </div>
          </div>

          {/* Prepared For Banner */}
          <div className="bg-surface-container-low/70 p-6 rounded-2xl border border-surface-container-high mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary block mb-1">
              Custom Proposal Prepared For
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-2">
              {proposal.fullName}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant">
              <span><strong>Phone:</strong> {proposal.phone}</span>
              <span>•</span>
              <span><strong>Email:</strong> {proposal.email}</span>
              <span>•</span>
              <span><strong>Departure City:</strong> {proposal.departureCity}</span>
            </div>
          </div>

          {/* Trip Blueprint Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1">
                Destination
              </span>
              <div className="font-serif text-lg font-bold text-primary">
                {proposal.destination}
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1">
                Travel Party
              </span>
              <div className="font-serif text-lg font-bold text-primary">
                {proposal.adults} Adults {proposal.children > 0 ? `+ ${proposal.children} Kids` : ''}
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1">
                Season / Month
              </span>
              <div className="font-serif text-lg font-bold text-primary">
                {proposal.travelMonth}
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1">
                Travel Style
              </span>
              <div className="font-serif text-lg font-bold text-primary">
                {proposal.travelStyle} Style
              </div>
            </div>
          </div>

          {/* Price Benchmark & Assumptions */}
          <div className="bg-primary text-on-primary p-6 sm:p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary-container block mb-1">
                Indicative Benchmark Budget
              </span>
              <div className="font-serif text-3xl sm:text-4xl font-bold">
                {proposal.budgetRange}
              </div>
              <p className="font-sans text-xs text-surface-container-low/80 mt-1 max-w-md leading-relaxed">
                Land package benchmark on twin-sharing basis. Flights quoted at actual live fares upon booking confirmation.
              </p>
            </div>

            <div className="bg-primary-container p-4 rounded-xl border border-outline-variant/20 text-xs text-surface-container-low space-y-1.5 shrink-0">
              <div className="flex items-center gap-1.5 font-bold text-secondary-container">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span>Transparent Financial Truth</span>
              </div>
              <div>✦ Zero hidden fees or credit card surcharges</div>
              <div>✦ Direct hotel &amp; chauffeur vouchers</div>
              <div>✦ Unlimited itinerary tweaks before deposit</div>
            </div>
          </div>

          {/* Custom Traveler Notes & Accommodation Standard */}
          {proposal.notes && (
            <div className="mb-8 p-6 rounded-2xl bg-surface-container-low/40 border border-surface-container-high">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary block mb-2">
                Customized Blueprint &amp; Preferences
              </span>
              <div className="font-sans text-xs text-on-surface-variant whitespace-pre-line leading-relaxed">
                {proposal.notes}
              </div>
            </div>
          )}

          {/* Confirmed Inclusions & What's Excluded */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pt-6 border-t border-surface-container-high">
            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5 mb-3">
                <span className="material-symbols-outlined text-base text-teal-600">check_circle</span>
                <span>Confirmed Jeto Inclusions</span>
              </h3>
              <ul className="space-y-2 text-xs text-on-surface-variant">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600 mt-0.5">check</span>
                  <span>Handpicked verified central accommodations with daily breakfast</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600 mt-0.5">check</span>
                  <span>Dedicated private air-conditioned vehicle with trusted tourist driver</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600 mt-0.5">check</span>
                  <span>All scheduled sightseeing entry permits and parking fees</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600 mt-0.5">check</span>
                  <span>24/7 dedicated regional WhatsApp trip concierge support</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-3">
                <span className="material-symbols-outlined text-base text-rose-600">cancel</span>
                <span>Exclusions (Payable Separately)</span>
              </h3>
              <ul className="space-y-2 text-xs text-on-surface-variant">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm text-rose-500 mt-0.5">close</span>
                  <span>International or domestic flights (quoted at live airfares)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm text-rose-500 mt-0.5">close</span>
                  <span>Tourist visa fees and mandatory medical travel insurance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm text-rose-500 mt-0.5">close</span>
                  <span>Personal laundry, minibar, and dining not mentioned in inclusions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-sm text-rose-500 mt-0.5">close</span>
                  <span>Optional tips for local drivers and guides</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Dock (Bottom of Paper) */}
          <div className="pt-8 border-t-2 border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary text-xs font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  {copied ? 'check_circle' : 'link'}
                </span>
                <span>{copied ? 'Link Copied!' : 'Copy Proposal Link'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/91${SITE_CONTACT.phone}?text=Hi%20Jeto,%20I'm%20reviewing%20Proposal%20%23${proposal.id}%20for%20${encodeURIComponent(proposal.destination)}.%20I'd%20like%20to%20confirm%20dates%20and%20flights.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white hover:bg-[#1ebd59] text-xs font-bold shadow-md transition-all"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>Confirm on WhatsApp with Planner</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProposalViewerPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen pt-36 text-center text-xs text-outline">
          Loading proposal document...
        </div>
      }
    >
      <ProposalViewerContent />
    </React.Suspense>
  );
}
