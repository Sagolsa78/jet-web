'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'Can you cater to specific Indian dietary requirements like pure vegetarian or Jain food?',
    answer:
      'Absolutely. When crafting your itinerary, we select hotels known for generous breakfast varieties, pre-scout Indian dining partners, and provide your private chauffeur with vetted restaurant recommendations along every transit route. We also pre-coordinate Jain preparation rules with private luxury resorts.',
  },
  {
    question: 'How does Jeto Vacations differ from standard group tour packages?',
    answer:
      'Unlike group tours, every Jeto journey is fully private and customised. You travel at your own pace, choose your own hotels, and have a dedicated trip designer who understands your family dynamics, dietary needs, and comfort preferences.',
  },
  {
    question: 'Are flights and visas included in the holiday proposals?',
    answer:
      'Flights are quoted separately so you have the flexibility to use miles or book directly. Our team handles complete visa documentation support, including application assistance, document checklists, and appointment scheduling.',
  },
  {
    question: 'What happens if we need to reschedule our trip due to an emergency?',
    answer:
      "We understand plans can change. Our team works closely with hotel and service partners to accommodate date changes. Rescheduling terms depend on each supplier's policy, and we always negotiate the best possible outcome for you.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-10">
      <div className="mb-12 text-center">
        <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.2em] text-secondary">
          Common Questions
        </span>
        <h2 className="font-serif text-[40px] font-semibold leading-[48px] tracking-[-0.01em] text-primary">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={faq.question} className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
            <button
              type="button"
              className="flex w-full items-center justify-between text-left"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              <h4 className="pr-4 font-serif text-[22px] font-semibold leading-[30px] text-primary">
                {faq.question}
              </h4>
              <span className={`material-symbols-outlined shrink-0 transition-transform ${openIndex === index ? 'text-secondary' : 'text-outline'}`}>
                {openIndex === index ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
            </button>
            {openIndex === index && (
              <div className="mt-4 border-t border-surface-container-high pt-4">
                <p className="text-base leading-relaxed text-on-surface-variant">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
