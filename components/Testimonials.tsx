"use client";

import React from "react";

const testimonials = [
  {
    name: "Vikram S.",
    role: "IT Professional",
    location: "Gurgaon",
    savings: "₹ 18 Lakhs",
    quote: "I was looking to buy a 3BHK in Gurgaon. Properties Wallah grouped me with 8 other buyers, and the developer gave us a flat 12% discount. Unbelievable savings for just waiting a week!",
    avatar: "VS"
  },
  {
    name: "Neha & Rahul",
    role: "First Time Buyers",
    location: "Noida Extension",
    savings: "₹ 9.5 Lakhs",
    quote: "The transparency is what won us over. We could see the group growing in real-time. Once the 5-buyer tier was hit, our discount locked in. Best way to buy real estate.",
    avatar: "N&R"
  },
  {
    name: "Amit Desai",
    role: "Investor",
    location: "Bangalore",
    savings: "₹ 24 Lakhs",
    quote: "As an investor, entry price is everything. Buying as a group allowed me to get pre-launch bulk rates on a single unit. It drastically improved my ROI.",
    avatar: "AD"
  }
];

export default function Testimonials() {
  return (
    <section className="bg-white py-20 border-t border-[#C7C0AE]/20 font-sans" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#313131] font-vietnam">
            Real Buyers. <span className="text-[#94A692]">Real Savings.</span>
          </h2>
          <p className="text-base text-[#313131]/60 mt-4 font-medium">
            Hear from families and investors who stopped buying alone and started saving together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <div 
              key={idx}
              className="bg-[#FAF1E6] rounded-3xl p-8 relative border border-[#C7C0AE]/30 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="absolute -top-6 left-8 bg-[#94A692] text-white px-4 py-2 rounded-full font-bold text-sm shadow-md font-vietnam flex items-center gap-1.5">
                <span>💰</span> Saved {test.savings}
              </div>
              
              <div className="mt-4 mb-6 text-4xl text-[#C7C0AE]/50 font-serif">"</div>
              
              <p className="text-sm text-[#313131]/80 leading-relaxed font-medium mb-8 italic">
                {test.quote}
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-[#313131] text-white flex items-center justify-center font-bold text-lg">
                  {test.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-[#313131] text-sm font-vietnam">{test.name}</h4>
                  <p className="text-[10px] text-[#313131]/60 uppercase tracking-wider font-bold">{test.role} • {test.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
