"use client";

import React from "react";

const benefits = [
  {
    title: "Direct Bulk Discounts",
    description: "By pooling buyers together, we bypass middleman commissions and pass the 8-15% bulk discount directly to you.",
    icon: "💰"
  },
  {
    title: "Verified Developers",
    description: "Every project on Properties Wallah undergoes a strict 50-point legal and financial audit before listing.",
    icon: "✅"
  },
  {
    title: "Zero Brokerage",
    description: "You don't pay us a dime. Our fee is structured with the developer for bringing them bulk business.",
    icon: "🚫"
  },
  {
    title: "Transparent Process",
    description: "Watch your group size grow in real-time. The more buyers join, the bigger the discount tier unlocked.",
    icon: "📊"
  }
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-20 border-t border-[#C7C0AE]/20 font-sans" id="why-choose-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#313131] font-vietnam">
            Why Choose Properties Wallah?
          </h2>
          <p className="text-base text-[#313131]/60 mt-4 font-medium">
            We are revolutionizing real estate in India by bringing the power of wholesale buying to retail home buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, idx) => (
            <div 
              key={idx}
              className="bg-[#FAF1E6] p-8 rounded-3xl border border-[#C7C0AE]/30 hover:border-[#FFA100]/50 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold text-[#313131] font-vietnam mb-3">
                {benefit.title}
              </h3>
              <p className="text-sm text-[#313131]/70 leading-relaxed font-medium">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
