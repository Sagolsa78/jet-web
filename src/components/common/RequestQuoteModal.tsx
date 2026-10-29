'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuoteModal } from '@/context/QuoteModalContext';
import { submitCallbackLeadAction } from '@/app/actions/enquiry';
import { callbackLeadSchema, type CallbackLeadFormData } from '@/lib/validations/enquiry';
import { SITE_BRAND, SITE_CONTACT } from '@/data/site-content';
import { Phone, User, Calendar, Users, DollarSign, MessageSquare, Check, AlertCircle, X } from 'lucide-react';

const BUDGET_OPTIONS = [
  'Flexible / Advise Me',
  'Under ₹40,000 / person',
  '₹40,000 – ₹80,000 / person',
  '₹80,000 – ₹1,50,000 / person',
  'Luxury (₹1,50,000+ / person)',
];

export function LeadCallbackModal() {
  const { isOpen, prefillData, closeQuoteModal, openQuoteModal } = useQuoteModal();
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    leadId?: string;
    message?: string;
    isDemo?: boolean;
    whatsAppDirectUrl?: string;
    error?: string;
  } | null>(null);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CallbackLeadFormData>({
    resolver: zodResolver(callbackLeadSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      destination: '',
      packageTitle: '',
      packageId: '',
      travelMonth: 'Upcoming Season',
      travellers: 2,
      budget: 'Flexible / Advise Me',
      notes: '',
      consent: false,
      source: 'website',
      honeypot: '',
    },
  });

  const watchedName = watch('name');
  const watchedPhone = watch('phone');
  const watchedDestination = watch('destination') || prefillData?.destination || prefillData?.packageTitle || '';

  // Synchronize prefillData when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmissionResult(null);
      if (prefillData?.destination) setValue('destination', prefillData.destination);
      if (prefillData?.packageTitle) setValue('packageTitle', prefillData.packageTitle);
      if (prefillData?.packageId) setValue('packageId', prefillData.packageId);
      if (prefillData?.budgetRange) setValue('budget', prefillData.budgetRange);
      if (prefillData?.notes) setValue('notes', prefillData.notes);
      if (prefillData?.source) setValue('source', prefillData.source);
    }
  }, [isOpen, prefillData, setValue]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus first input on open for keyboard & screen reader accessibility
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const input = document.getElementById('callback-name');
        input?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeQuoteModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeQuoteModal]);

  // Subtle exit-intent popup: triggers only once per session, only after 30 seconds
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let hasTriggered = false;
    const sessionTriggered = sessionStorage.getItem('jeto_exit_popup_triggered');
    if (sessionTriggered) return;

    const timer = setTimeout(() => {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 10 && !hasTriggered && !isOpen) {
          hasTriggered = true;
          sessionStorage.setItem('jeto_exit_popup_triggered', 'true');
          openQuoteModal({
            notes: 'Visitor requested callback before leaving site',
            source: 'exit_popup',
          });
        }
      };
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, 30000);

    return () => clearTimeout(timer);
  }, [isOpen, openQuoteModal]);

  if (!isOpen) return null;

  const onSubmit = async (data: CallbackLeadFormData) => {
    try {
      const result = await submitCallbackLeadAction({
        ...data,
        destination: data.destination || prefillData?.destination || prefillData?.packageTitle || 'Unspecified',
        packageTitle: data.packageTitle || prefillData?.packageTitle || undefined,
        source: prefillData?.source || data.source || 'website',
      });
      setSubmissionResult(result);
    } catch {
      setSubmissionResult({
        success: false,
        error: `We couldn't connect to the server. Please call us directly at +91 ${SITE_CONTACT.phone} or tap WhatsApp.`,
      });
    }
  };

  const handleClose = () => {
    reset();
    setSubmissionResult(null);
    closeQuoteModal();
  };

  const isDemo = Boolean(
    submissionResult?.isDemo ||
    submissionResult?.leadId?.toLowerCase().startsWith('demo-')
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-2xl border border-surface-container-high/80 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container-high/80 bg-surface-container-low/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span id="modal-title" className="font-serif text-lg font-bold text-primary block leading-tight">
                {submissionResult ? 'Callback Status' : 'Request a Sales Callback'}
              </span>
              <span className="text-[11px] text-on-surface-variant">
                Direct phone consultation with a regional specialist
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {submissionResult ? (
            /* Post-Submission Result State */
            <div className="space-y-5 py-2 text-center">
              <div
                className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${
                  submissionResult.success && !isDemo
                    ? 'bg-teal-100 text-teal-700'
                    : isDemo
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {submissionResult.success && !isDemo ? (
                  <Check className="w-7 h-7" />
                ) : isDemo ? (
                  <AlertCircle className="w-7 h-7" />
                ) : (
                  <AlertCircle className="w-7 h-7" />
                )}
              </div>

              {/* Status Title & Message */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-primary mb-2">
                  {submissionResult.success && !isDemo
                    ? `Thank you, ${watchedName || 'Traveller'}!`
                    : isDemo
                    ? 'Simulation Mode (Demo Notice)'
                    : 'Submission Could Not Be Completed'}
                </h3>

                <p className="font-sans text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                  {submissionResult.success && !isDemo
                    ? `Our dedicated travel specialist will call you on ${watchedPhone || 'your phone'} shortly to discuss your custom travel plan.`
                    : isDemo
                    ? 'This website is currently running in local demonstration mode. Your callback request was captured locally and has NOT been transmitted to the sales team.'
                    : (submissionResult.error || `Please call our concierge at +91 ${SITE_CONTACT.phone} or chat directly on WhatsApp.`)}
                </p>
              </div>

              {/* Reference ID Pill */}
              {submissionResult.leadId && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high text-xs font-mono font-semibold text-primary">
                  <span>Reference:</span>
                  <span className="text-secondary">{submissionResult.leadId}</span>
                </div>
              )}

              {/* Direct WhatsApp Call to Action */}
              <div className="pt-3 border-t border-surface-container-high space-y-2.5">
                <a
                  href={submissionResult.whatsAppDirectUrl || `https://wa.me/91${SITE_CONTACT.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-sans text-xs font-bold transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Connect Immediately on WhatsApp</span>
                </a>

                <a
                  href={`tel:+91${SITE_CONTACT.phone}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-5 rounded-full border border-surface-container-high hover:bg-surface-container-low text-primary font-sans text-xs font-bold transition-all"
                >
                  <Phone className="w-4 h-4 text-secondary" />
                  <span>Call Direct: +91 {SITE_CONTACT.phone}</span>
                </a>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-outline hover:text-primary underline cursor-pointer mt-2"
              >
                Close Window
              </button>
            </div>
          ) : (
            /* Lead Callback Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Context Pill if prefilled */}
              {watchedDestination && (
                <div className="bg-secondary/10 border border-secondary/20 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-secondary font-medium truncate">
                    <span className="font-bold uppercase tracking-wider text-[10px]">Inquiring for:</span>
                    <span className="font-semibold text-primary truncate">{watchedDestination}</span>
                  </div>
                  <span className="text-[10px] text-secondary font-semibold shrink-0">Auto-filled</span>
                </div>
              )}

              {/* 1. Full Name */}
              <div>
                <label htmlFor="callback-name" className="block text-xs font-bold text-primary mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="callback-name"
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    {...register('name')}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all ${
                      errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-outline-variant/50 focus:border-secondary'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name.message}</p>
                )}
              </div>

              {/* 2. Phone Number */}
              <div>
                <label htmlFor="callback-phone" className="block text-xs font-bold text-primary mb-1">
                  Phone Number (for Callback) <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-outline-variant/50 bg-surface-container-low text-xs font-bold text-on-surface-variant font-mono">
                    🇮🇳 +91
                  </span>
                  <input
                    id="callback-phone"
                    type="tel"
                    placeholder="98765 43210"
                    {...register('phone')}
                    className={`w-full pl-3 pr-4 py-2.5 rounded-r-xl border text-sm font-medium bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all ${
                      errors.phone ? 'border-rose-400 focus:border-rose-500' : 'border-outline-variant/50 focus:border-secondary'
                    }`}
                  />
                </div>
                {errors.phone ? (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.phone.message}</p>
                ) : (
                  <p className="text-[11px] text-outline mt-1">Our sales consultant will call you on this number.</p>
                )}
              </div>

              {/* Optional Advanced Customization Accordion */}
              <div className="border border-surface-container-high/80 rounded-2xl p-3.5 bg-surface-container-low/30 space-y-3">
                <button
                  type="button"
                  onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                  className="w-full flex items-center justify-between text-xs font-bold text-secondary cursor-pointer"
                >
                  <span>{showAdvancedFields ? '− Hide Trip Specifications' : '+ Add Travel Dates, Travellers & Budget (Optional)'}</span>
                  <span className="text-[10px] text-outline font-normal">
                    {showAdvancedFields ? 'Fewer fields' : 'Helps consultant prepare pricing'}
                  </span>
                </button>

                {showAdvancedFields && (
                  <div className="space-y-3 pt-2 border-t border-surface-container-high/60 animate-fade-in">
                    {/* Destination Override if needed */}
                    {!watchedDestination && (
                      <div>
                        <label htmlFor="callback-dest" className="block text-[11px] font-bold text-on-surface-variant mb-1">
                          Destination of Interest
                        </label>
                        <input
                          id="callback-dest"
                          type="text"
                          placeholder="e.g. Bali, Switzerland, Kashmir"
                          {...register('destination')}
                          className="w-full px-3 py-2 rounded-xl border border-outline-variant/50 text-xs bg-surface-container-lowest focus:border-secondary focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Travel Month & Travellers Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="callback-month" className="block text-[11px] font-bold text-on-surface-variant mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-secondary" />
                          <span>Estimated Travel Month</span>
                        </label>
                        <input
                          id="callback-month"
                          type="text"
                          placeholder="e.g. May 2026 / Diwali"
                          {...register('travelMonth')}
                          className="w-full px-3 py-2 rounded-xl border border-outline-variant/50 text-xs bg-surface-container-lowest focus:border-secondary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="callback-travellers" className="block text-[11px] font-bold text-on-surface-variant mb-1 flex items-center gap-1">
                          <Users className="w-3 h-3 text-secondary" />
                          <span>Traveller Count</span>
                        </label>
                        <input
                          id="callback-travellers"
                          type="number"
                          min={1}
                          max={30}
                          defaultValue={2}
                          {...register('travellers', { valueAsNumber: true })}
                          className="w-full px-3 py-2 rounded-xl border border-outline-variant/50 text-xs bg-surface-container-lowest focus:border-secondary focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Target Budget */}
                    <div>
                      <label htmlFor="callback-budget" className="block text-[11px] font-bold text-on-surface-variant mb-1 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-secondary" />
                        <span>Approximate Budget</span>
                      </label>
                      <select
                        id="callback-budget"
                        {...register('budget')}
                        className="w-full px-3 py-2 rounded-xl border border-outline-variant/50 text-xs bg-surface-container-lowest focus:border-secondary focus:outline-none cursor-pointer"
                      >
                        {BUDGET_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Trip Notes */}
                    <div>
                      <label htmlFor="callback-notes" className="block text-[11px] font-bold text-on-surface-variant mb-1">
                        Special Notes or Dietary Requirements
                      </label>
                      <textarea
                        id="callback-notes"
                        rows={2}
                        placeholder="e.g. Pure veg food, senior citizen friendly pacing, anniversary celebration..."
                        {...register('notes')}
                        className="w-full px-3 py-2 rounded-xl border border-outline-variant/50 text-xs bg-surface-container-lowest focus:border-secondary focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bot Honeypot (Off-screen) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register('honeypot')}
                />
              </div>

              {/* Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('consent')}
                    className="mt-0.5 rounded border-outline-variant/50 text-secondary focus:ring-secondary/20 cursor-pointer"
                  />
                  <span className="text-[11px] text-on-surface-variant leading-tight">
                    I agree to be contacted by {SITE_BRAND.name} regarding my holiday requirements. We never spam.
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.consent.message}</p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary font-sans text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Phone className="w-4 h-4" />
                      <span>Request a Callback Now</span>
                    </>
                  )}
                </button>
              </div>

              {/* Privacy Trust footer */}
              <p className="text-[10px] text-outline text-center">
                Trusted by 4,500+ Indian travellers • Reg GSTIN: {SITE_CONTACT.gstin}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Backwards-compatible alias for existing layout references
export const RequestQuoteModal = LeadCallbackModal;
