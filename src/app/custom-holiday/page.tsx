'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enquirySchema, type EnquiryFormData } from '@/lib/validations/enquiry';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { submitEnquiryAction } from '@/app/actions/enquiry';

const STEPS = [
  { id: 'destination', title: 'Destination', description: 'Where do you dream of going?' },
  { id: 'logistics', title: 'Logistics', description: 'When and from where?' },
  { id: 'travellers', title: 'Travellers', description: 'Who is coming along?' },
  { id: 'budget', title: 'Budget', description: 'What are we working with?' },
  { id: 'preferences', title: 'Preferences', description: 'Your travel style and tastes.' },
  { id: 'contact', title: 'Contact', description: 'How can we reach you?' },
  { id: 'review', title: 'Review', description: 'Check your details before submitting.' },
];

export default function CustomHolidayPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-primary/60">Loading trip planner...</div>}>
      <CustomHolidayContent />
    </Suspense>
  );
}

function CustomHolidayContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedLeadId, setSubmittedLeadId] = useState<string | undefined>();

  const paramDestination = searchParams.get('destination') || searchParams.get('q') || '';
  const paramPackage = searchParams.get('package') || '';
  const paramBudget = searchParams.get('budget') || '';
  const paramStyle = searchParams.get('style') || '';

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<EnquiryFormData, unknown, EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      destination: paramPackage ? `${paramPackage} (${paramDestination || 'Custom'})` : paramDestination,
      departureCity: 'Mumbai',
      travelMonth: 'Nov 2026',
      adults: 2,
      children: 0,
      budgetRange: paramBudget || '₹60,000 – ₹1,20,000',
      travelStyle: paramStyle || 'Luxury',
      contactChannel: 'whatsapp',
      consent: false,
    },
  });

  // Sync parameters if changed
  useEffect(() => {
    if (paramDestination && !getValues('destination')) {
      setValue('destination', paramDestination);
    }
    if (paramStyle && !getValues('travelStyle')) {
      setValue('travelStyle', paramStyle);
    }
  }, [paramDestination, paramStyle, setValue, getValues]);

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(step);
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const getFieldsForStep = (stepIndex: number): FieldPath<EnquiryFormData>[] => {
    switch (stepIndex) {
      case 0:
        return ['destination'];
      case 1:
        return ['departureCity', 'travelMonth'];
      case 2:
        return ['adults', 'children'];
      case 3:
        return ['budgetRange'];
      case 4:
        return ['travelStyle'];
      case 5:
        return ['fullName', 'email', 'phone', 'consent'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const result = await submitEnquiryAction(data);

      if (result.success) {
        setSubmittedLeadId(result.leadId);
        setSubmitStatus('success');
      } else {
        setErrorMessage(result.error || 'Submission failed. Please check your inputs.');
        setSubmitStatus('error');
      }
    } catch {
      setErrorMessage('A network error occurred. Please try again.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDemo = Boolean(submittedLeadId?.toLowerCase().startsWith('demo-'));

  if (submitStatus === 'success') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-24">
        <Card className="max-w-xl w-full p-8 sm:p-12 text-center space-y-6 border-surface-container-high bg-white shadow-2xl rounded-3xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">verified</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary">
            {isDemo ? 'Enquiry Captured (Demo Mode)' : 'Your Journey Begins!'}
          </h1>

          {/* Truthful Confirmation */}
          {isDemo ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed text-left">
              <p className="font-bold mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-amber-600">info</span>
                Demo Environment Notice
              </p>
              <p>
                Your request details have been validated and saved through the local CRM mock (Ref:{' '}
                <code className="font-mono font-bold">{submittedLeadId}</code>). In this development environment, the live
                CRM backend is not connected, so no sales representative has been notified.
              </p>
            </div>
          ) : (
            <p className="text-base text-on-surface-variant leading-relaxed">
              Thank you for sharing your travel dreams with us. Your enquiry reference is{' '}
              <strong className="text-primary font-bold">#{submittedLeadId}</strong>. Our regional destination specialist
              will review your preferences and contact you via your selected channel.
            </p>
          )}

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full">
                Return Home
              </Button>
            </Link>
            <Link href="/holidays" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full">
                Browse More Trips
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-6 sm:px-8 w-full">
      <div className="text-center mb-12">
        <span className="font-sans text-[12px] font-bold text-secondary uppercase tracking-[0.2em] block mb-2">
          Personal Concierge
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">
          Plan Your Bespoke Holiday
        </h1>
        <p className="font-sans text-base text-on-surface-variant max-w-lg mx-auto">
          Tell us about your dream escape, group dynamics, and preferred pace. We will design an initial blueprint for you.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="flex justify-between mb-10 relative px-2 overflow-x-auto no-scrollbar">
        <div className="absolute top-4 left-0 w-full h-0.5 bg-surface-container-high -z-10" />
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-col items-center gap-1.5 shrink-0 px-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i === step
                  ? 'bg-secondary text-white scale-110 ring-4 ring-secondary/20'
                  : i < step
                  ? 'bg-primary text-white'
                  : 'bg-white text-outline border border-surface-container-high'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span
              className={`text-[10px] uppercase tracking-wider font-bold ${
                i === step ? 'text-secondary' : 'text-outline'
              }`}
            >
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-8 md:p-12 min-h-[420px] flex flex-col bg-surface-container-lowest border-surface-container-high shadow-lg rounded-3xl">
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-primary mb-1">{STEPS[step].title}</h2>
            <p className="text-sm text-on-surface-variant">{STEPS[step].description}</p>
          </div>

          <div className="flex-grow space-y-6">
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                    Where do you want to go?
                  </label>
                  <input
                    {...register('destination')}
                    placeholder="e.g. Kashmir, Maldives, Swiss Alps, or 'Help me choose'"
                    className="w-full p-4 rounded-2xl border border-surface-container-high outline-none focus:ring-2 focus:ring-secondary transition-all bg-surface-container-low text-sm font-medium"
                  />
                  {errors.destination && (
                    <p className="text-red-500 text-xs mt-2">{errors.destination.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs text-outline font-semibold">Popular:</span>
                  {['Bali', 'Kashmir', 'Switzerland', 'Vietnam', 'Help me choose'].map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => setValue('destination', dest)}
                      className="text-xs bg-surface-container-low hover:bg-surface-container px-3 py-1 rounded-full text-on-surface-variant transition-colors cursor-pointer"
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Departure City
                  </label>
                  <input
                    {...register('departureCity')}
                    placeholder="e.g. Mumbai, Delhi, Bengaluru"
                    className="w-full p-4 rounded-2xl border border-surface-container-high outline-none focus:ring-2 focus:ring-secondary transition-all bg-surface-container-low text-sm font-medium"
                  />
                  {errors.departureCity && (
                    <p className="text-red-500 text-xs mt-1">{errors.departureCity.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Travel Month / Window
                  </label>
                  <input
                    {...register('travelMonth')}
                    placeholder="e.g. Nov 2026, Summer 2027, or Flexible"
                    className="w-full p-4 rounded-2xl border border-surface-container-high outline-none focus:ring-2 focus:ring-secondary transition-all bg-surface-container-low text-sm font-medium"
                  />
                  {errors.travelMonth && (
                    <p className="text-red-500 text-xs mt-1">{errors.travelMonth.message}</p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Adults (12+ years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    {...register('adults', { valueAsNumber: true })}
                    className="w-full p-4 rounded-2xl border border-surface-container-high outline-none focus:ring-2 focus:ring-secondary transition-all bg-surface-container-low text-sm font-medium"
                  />
                  {errors.adults && <p className="text-red-500 text-xs mt-1">{errors.adults.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Children (0-11 years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    {...register('children', { valueAsNumber: true })}
                    className="w-full p-4 rounded-2xl border border-surface-container-high outline-none focus:ring-2 focus:ring-secondary transition-all bg-surface-container-low text-sm font-medium"
                  />
                  {errors.children && (
                    <p className="text-red-500 text-xs mt-1">{errors.children.message}</p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Approximate Budget Per Person
                  </label>
                  <select
                    {...register('budgetRange')}
                    className="w-full p-4 rounded-2xl border border-surface-container-high outline-none focus:ring-2 focus:ring-secondary transition-all bg-surface-container-low text-sm font-medium cursor-pointer"
                  >
                    <option value="">Select a budget range</option>
                    <option value="₹35,000 – ₹60,000">₹35,000 – ₹60,000</option>
                    <option value="₹60,000 – ₹1,20,000">₹60,000 – ₹1,20,000</option>
                    <option value="₹1,20,000 – ₹2,50,000">₹1,20,000 – ₹2,50,000</option>
                    <option value="₹2,50,000+">₹2,50,000 + (Ultra Luxury)</option>
                  </select>
                  {errors.budgetRange && (
                    <p className="text-red-500 text-xs mt-1">{errors.budgetRange.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    What should this budget prioritize?
                  </label>
                  <textarea
                    {...register('budgetIncludes')}
                    placeholder="e.g. 5-star beachfront resorts, private chauffeur throughout, fine dining included, etc."
                    className="w-full p-4 rounded-2xl border border-surface-container-high outline-none focus:ring-2 focus:ring-secondary transition-all h-28 bg-surface-container-low text-sm font-medium"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Primary Travel Style
                  </label>
                  <select
                    {...register('travelStyle')}
                    className="w-full p-4 rounded-2xl border border-surface-container-high outline-none focus:ring-2 focus:ring-secondary transition-all bg-surface-container-low text-sm font-medium cursor-pointer"
                  >
                    <option value="Luxury">Luxury</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Family">Family</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Culture">Culture</option>
                    <option value="Weekend">Weekend</option>
                  </select>
                  {errors.travelStyle && (
                    <p className="text-red-500 text-xs mt-1">{errors.travelStyle.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Dietary &amp; Special Needs
                  </label>
                  <textarea
                    {...register('notes')}
                    placeholder="e.g. Pure Vegetarian or Jain meals, senior citizen ground-floor rooms, wheelchair assistance, etc."
                    className="w-full p-4 rounded-2xl border border-surface-container-high outline-none focus:ring-2 focus:ring-secondary transition-all h-28 bg-surface-container-low text-sm font-medium"
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('fullName')}
                    placeholder="Your Full Name"
                    className="w-full p-4 rounded-2xl border border-surface-container-high outline-none focus:ring-2 focus:ring-secondary transition-all bg-surface-container-low text-sm font-medium"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="name@example.com"
                    className="w-full p-4 rounded-2xl border border-surface-container-high outline-none focus:ring-2 focus:ring-secondary transition-all bg-surface-container-low text-sm font-medium"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('phone')}
                    placeholder="+91 98765 43210"
                    className="w-full p-4 rounded-2xl border border-surface-container-high outline-none focus:ring-2 focus:ring-secondary transition-all bg-surface-container-low text-sm font-medium"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div className="md:col-span-2 flex items-start gap-3 py-3">
                  <input
                    type="checkbox"
                    {...register('consent')}
                    id="consent"
                    className="mt-1 h-5 w-5 rounded border-outline text-secondary focus:ring-secondary"
                  />
                  <label htmlFor="consent" className="text-xs text-on-surface-variant leading-relaxed cursor-pointer">
                    I agree to the{' '}
                    <Link href="/privacy" className="text-secondary font-semibold underline">
                      Privacy Policy
                    </Link>
                    . Jeto will never spam or share your contact details.
                  </label>
                </div>
                {errors.consent && (
                  <p className="md:col-span-2 text-red-500 text-xs -mt-2">{errors.consent.message}</p>
                )}
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary mb-3">Review Your Trip Details</h3>
                <div className="bg-surface-container-low p-6 rounded-2xl space-y-4 text-xs sm:text-sm border border-surface-container-high">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-outline block uppercase text-[10px] font-bold">Destination</span>
                      <span className="font-semibold text-primary">{getValues('destination') || 'Not specified'}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-outline block uppercase text-[10px] font-bold">Departure &amp; Month</span>
                      <span className="font-semibold text-primary">
                        {getValues('departureCity')} • {getValues('travelMonth')}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-outline block uppercase text-[10px] font-bold">Travellers</span>
                      <span className="font-semibold text-primary">
                        {getValues('adults')} Adults{getValues('children') ? `, ${getValues('children')} Children` : ''}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-outline block uppercase text-[10px] font-bold">Budget &amp; Style</span>
                      <span className="font-semibold text-primary">
                        {getValues('budgetRange')} ({getValues('travelStyle')})
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-surface-container-high space-y-1">
                    <span className="text-outline block uppercase text-[10px] font-bold">Contact</span>
                    <span className="font-semibold text-primary">
                      {getValues('fullName')} • {getValues('phone')} ({getValues('email')})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex justify-between items-center pt-6 border-t border-surface-container-high">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={step === 0}
              className={step === 0 ? 'invisible' : 'cursor-pointer'}
            >
              &larr; Back
            </Button>

            {step < 6 ? (
              <Button variant="primary" onClick={nextStep} className="cursor-pointer">
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="px-10 bg-on-tertiary-container hover:bg-tertiary-fixed-dim text-on-primary font-bold cursor-pointer"
              >
                {isSubmitting ? 'Validating...' : 'Submit Custom Request'}
              </Button>
            )}
          </div>
        </Card>

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center text-sm font-medium border border-red-200">
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
}
