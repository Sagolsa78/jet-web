'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SAMPLE_PACKAGES } from '@/data/sample-packages';
import { HolidayPackage } from '@/types';
import { useQuoteModal } from '@/context/QuoteModalContext';
import { useCurrency } from '@/context/CurrencyContext';

const QUESTIONS = [
  {
    id: 'companion',
    title: 'Who is traveling on this journey?',
    subtitle: 'We tailor the pacing, vehicle type, and dining choices to your group.',
    options: [
      {
        id: 'couple',
        label: 'Couple / Honeymoon',
        sublabel: 'Romantic seclusion, private dining & scenic vistas',
        icon: 'favorite',
      },
      {
        id: 'family-parents',
        label: 'Family with Senior Parents',
        sublabel: 'Gentle pacing, lift access & comforting veg meals',
        icon: 'elderly',
      },
      {
        id: 'family-kids',
        label: 'Family with Children',
        sublabel: 'Spacious suites, beach lagoons & interactive fun',
        icon: 'family_restroom',
      },
      {
        id: 'friends-solo',
        label: 'Friends or Solo Explorer',
        sublabel: 'Outdoor thrill, road trips & vibrant local food',
        icon: 'groups',
      },
    ],
  },
  {
    id: 'vibe',
    title: 'What holiday setting are you daydreaming about?',
    subtitle: 'Pick the atmospheric scenery that inspires you right now.',
    options: [
      {
        id: 'beaches',
        label: 'Tropical Lagoons & White Sands',
        sublabel: 'Overwater stays, turquoise coral reefs & catamaran sails',
        icon: 'beach_access',
      },
      {
        id: 'mountains',
        label: 'Snow Peaks & Scenic Alpine Trains',
        sublabel: 'Glacier peaks, pine forests & panoramic glass cars',
        icon: 'landscape',
      },
      {
        id: 'culture',
        label: 'Royal Palaces, Shrines & Old Quarters',
        sublabel: 'Heritage havelis, tea ceremonies & artisan bazaars',
        icon: 'temple_buddhist',
      },
      {
        id: 'nature',
        label: 'Wild Backwaters & Green Wilderness',
        sublabel: 'Tea plantations, private houseboats & fjord highways',
        icon: 'forest',
      },
    ],
  },
  {
    id: 'duration',
    title: 'How long can you unplug for?',
    subtitle: 'Duration determines whether we recommend close flights or multi-region circuits.',
    options: [
      {
        id: 'short',
        label: 'Quick Reset (4–5 Days)',
        sublabel: 'Effortless short flights, zero jetlag',
        icon: 'bolt',
      },
      {
        id: 'medium',
        label: 'Classic Holiday (6–8 Days)',
        sublabel: 'Balanced deep dive with relaxed downtime',
        icon: 'schedule',
      },
      {
        id: 'long',
        label: 'Grand Tour (9+ Days)',
        sublabel: 'Full multi-city immersion & epic road journeys',
        icon: 'explore',
      },
    ],
  },
  {
    id: 'budget',
    title: 'Comfortable benchmark budget per adult?',
    subtitle: 'Transparent land package benchmark (excluding international airfare).',
    options: [
      {
        id: 'value',
        label: '₹35,000 – ₹65,000',
        sublabel: 'Verified 4★ boutique stays, private AC vehicle',
        icon: 'savings',
      },
      {
        id: 'premium',
        label: '₹70,000 – ₹1,50,000',
        sublabel: 'Premium 4★/5★ resorts, signature excursions',
        icon: 'diamond',
      },
      {
        id: 'luxury',
        label: '₹1,50,000+',
        sublabel: 'Overwater villas, private pool sanctuaries, top-tier luxury',
        icon: 'crown',
      },
    ],
  },
];

interface ScoredPackage {
  pkg: HolidayPackage;
  matchScore: number;
  matchReason: string;
}

export function DestinationMatchmakerQuiz() {
  const { openQuoteModal } = useQuoteModal();
  const { formatPrice } = useCurrency();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectOption = (questionId: string, optionId: string) => {
    const updated = { ...answers, [questionId]: optionId };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
  };

  // Algorithmic Matchmaker
  const matches = React.useMemo<ScoredPackage[]>(() => {
    if (!showResults) return [];

    const scored: ScoredPackage[] = SAMPLE_PACKAGES.map((pkg) => {
      let score = 0;
      let reason = '';

      // 1. Companion matching
      const companion = answers['companion'];
      if (companion === 'couple') {
        if (pkg.style === 'Honeymoon' || pkg.tags.includes('Couples') || pkg.slug.includes('maldives')) {
          score += 35;
          reason = 'Tailored for couples with intimate private dining and secluded pool stays.';
        }
      } else if (companion === 'family-parents') {
        if (pkg.style === 'Family' || pkg.tags.includes('Family Friendly') || pkg.slug.includes('swiss') || pkg.slug.includes('kashmir') || pkg.slug.includes('kerala')) {
          score += 35;
          reason = 'Gentle pacing, minimal walking strain, and trusted vegetarian dining options.';
        }
      } else if (companion === 'family-kids') {
        if (pkg.style === 'Family' || pkg.tags.includes('Family Friendly') || pkg.slug.includes('andaman') || pkg.slug.includes('swiss')) {
          score += 30;
          reason = 'Exciting alpine trains or calm island lagoons that kids and parents equally love.';
        }
      } else if (companion === 'friends-solo') {
        if (pkg.style === 'Adventure' || pkg.tags.includes('Self-Drive SUV') || pkg.slug.includes('vietnam')) {
          score += 35;
          reason = 'Dynamic scenic drives, vibrant night markets, and thrilling outdoor activities.';
        }
      }

      // 2. Vibe matching
      const vibe = answers['vibe'];
      if (vibe === 'beaches') {
        if (pkg.slug.includes('maldives') || pkg.slug.includes('andaman') || pkg.tags.includes('Island Escape')) {
          score += 30;
        }
      } else if (vibe === 'mountains') {
        if (pkg.slug.includes('swiss') || pkg.slug.includes('kashmir') || pkg.tags.includes('Snow Peaks')) {
          score += 30;
        }
      } else if (vibe === 'culture') {
        if (pkg.style === 'Culture' || pkg.slug.includes('rajasthan') || pkg.slug.includes('japan') || pkg.slug.includes('vietnam')) {
          score += 30;
        }
      } else if (vibe === 'nature') {
        if (pkg.slug.includes('kerala') || pkg.slug.includes('new-zealand') || pkg.tags.includes('Pure Nature')) {
          score += 30;
        }
      }

      // 3. Duration matching
      const duration = answers['duration'];
      if (duration === 'short' && pkg.durationDays <= 6) score += 20;
      if (duration === 'medium' && pkg.durationDays >= 6 && pkg.durationDays <= 8) score += 20;
      if (duration === 'long' && pkg.durationDays >= 8) score += 20;

      // 4. Budget matching
      const budget = answers['budget'];
      const price = pkg.startingPrice || 50000;
      if (budget === 'value' && price <= 65000) score += 20;
      if (budget === 'premium' && price > 65000 && price <= 150000) score += 20;
      if (budget === 'luxury' && price > 140000) score += 20;

      if (!reason) {
        reason = `Matches your preference for ${pkg.style.toLowerCase()} travel with handpicked verified accommodations.`;
      }

      return {
        pkg,
        matchScore: score,
        matchReason: reason,
      };
    });

    // Sort descending by score
    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  }, [showResults, answers]);

  const activeQuestion = QUESTIONS[currentStep];

  return (
    <div className="w-full bg-surface-container-low/60 rounded-3xl border border-surface-container-high/80 p-6 sm:p-10 lg:p-12 shadow-sm">
      {/* Quiz Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider mb-3">
          <span className="material-symbols-outlined text-sm">psychology</span>
          <span>60-Second Matchmaker</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-3">
          Unsure where to start? Let us match you.
        </h2>
        <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
          Planning should feel exciting, not overwhelming. Answer 4 quick questions to see the curated blueprints that truly fit your family or travel style.
        </p>
      </div>

      {!showResults ? (
        <div>
          {/* Progress Bar */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="flex justify-between items-center text-xs font-bold text-outline mb-2 uppercase tracking-wider">
              <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div
                className="bg-secondary h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Active Question Title */}
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl font-bold text-primary mb-1">
              {activeQuestion.title}
            </h3>
            <p className="font-sans text-xs text-on-surface-variant">
              {activeQuestion.subtitle}
            </p>
          </div>

          {/* Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
            {activeQuestion.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectOption(activeQuestion.id, option.id)}
                className="group p-5 rounded-2xl bg-surface-container-lowest hover:bg-secondary/5 border border-surface-container-high hover:border-secondary transition-all text-left flex items-start gap-4 shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-container-low group-hover:bg-secondary group-hover:text-on-secondary text-secondary flex items-center justify-center shrink-0 transition-colors">
                  <span className="material-symbols-outlined text-2xl">{option.icon}</span>
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-primary group-hover:text-secondary transition-colors mb-1">
                    {option.label}
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    {option.sublabel}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Back Step */}
          {currentStep > 0 && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="inline-flex items-center gap-1 text-xs text-outline hover:text-primary font-semibold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to previous question</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results View */
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-surface-container-high">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Curated Recommendation
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-0.5">
                Here are your Top {matches.length} Matched Escapes
              </h3>
            </div>
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-high/60 hover:bg-surface-container-high text-xs font-bold text-on-surface-variant transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              <span>Retake Quiz</span>
            </button>
          </div>

          {/* Matched Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matches.map(({ pkg, matchReason }, index) => {
              const formattedPrice = formatPrice(pkg.startingPrice);

              return (
                <div
                  key={pkg.id}
                  className="bg-surface-container-lowest rounded-3xl border border-surface-container-high/80 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={pkg.heroImage}
                        alt={pkg.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-secondary text-on-secondary px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs">
                        {index === 0 ? '★ Best Overall Match' : `Top Pick #${index + 1}`}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-primary/80 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                        {pkg.durationDays > 0 ? `${pkg.durationDays}D / ${pkg.durationNights}N` : 'Custom Duration'}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1">
                        {pkg.style} Style
                      </span>
                      <h4 className="font-serif text-xl font-bold text-primary mb-2">
                        {pkg.title}
                      </h4>
                      <p className="font-sans text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                        {pkg.description}
                      </p>

                      {/* Honest Match Reason Box */}
                      <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-3 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block mb-0.5">
                          Why this fits your trip:
                        </span>
                        <p className="text-xs text-on-surface-variant font-medium">
                          {matchReason}
                        </p>
                      </div>

                      {/* Benchmark Price */}
                      <div className="pt-3 border-t border-surface-container-high flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-outline font-bold uppercase tracking-wider block">
                            Benchmark per person
                          </span>
                          <span className="font-serif text-xl font-bold text-primary">
                            {formattedPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 space-y-2">
                    <Link
                      href={`/holidays/${pkg.slug}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary/90 text-xs font-bold transition-colors"
                    >
                      <span>Explore Itinerary</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        openQuoteModal({
                          packageTitle: pkg.title,
                          destination: pkg.title,
                          budgetRange: formattedPrice,
                          travelStyle: pkg.style,
                          duration: pkg.durationDays > 0 ? `${pkg.durationDays}D / ${pkg.durationNights}N` : 'Custom Duration',
                          notes: `Matched via 60-Second Quiz: ${matchReason}`,
                        })
                      }
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>Get Custom Proposal</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
