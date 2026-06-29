"use client";

import React, { useState } from "react";

const faqs = [
  {
    question: "How does group buying work in real estate?",
    answer: "We pool together individual home buyers interested in the same project. Once a specific number of buyers (the group size) is reached, we negotiate directly with the developer to secure a bulk discount. You get the same property but at a much lower wholesale price."
  },
  {
    question: "Is there any brokerage fee involved?",
    answer: "No! Properties Wallah charges zero brokerage from the buyers. We are paid by the developer for bringing them a bulk group of verified buyers, reducing their marketing and sales costs."
  },
  {
    question: "What happens if a group doesn't reach the target size?",
    answer: "Every group has a timeline. If the target size isn't met, we still negotiate a proportional discount based on the final group size, which is always better than standard retail pricing. You are never obligated to buy if the final discount isn't satisfactory to you."
  },
  {
    question: "Are these projects verified and RERA approved?",
    answer: "Absolutely. We only list projects from reputed developers that are 100% RERA registered. Every project undergoes our strict 50-point legal and financial audit before being listed for group buying."
  },
  {
    question: "How do I join an active group?",
    answer: "Simply browse our active groups or featured projects, and click 'Join Group'. You'll need to pay a fully refundable Expression of Interest (EOI) token to lock your spot in the group and secure your position for the discount."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#FAF1E6] py-20 border-t border-[#C7C0AE]/20 font-sans" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#313131] font-vietnam">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-[#313131]/60 mt-4 font-medium">
            Everything you need to know about how Properties Wallah saves you money.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-[#C7C0AE]/30 overflow-hidden shadow-sm transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
              >
                <span className="font-bold text-[#313131] font-vietnam pr-4">
                  {faq.question}
                </span>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${openIndex === idx ? 'bg-[#313131] text-white rotate-180' : 'bg-[#FAF1E6] text-[#313131]'}`}>
                  ↓
                </span>
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === idx ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-sm text-[#313131]/70 leading-relaxed font-medium pt-2 border-t border-[#C7C0AE]/20">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
