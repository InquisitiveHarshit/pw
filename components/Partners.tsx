"use client";

import React from "react";

const partners = [
  "Godrej Properties", "DLF", "M3M", "Lodha", "Prestige Group", "Sobha", "TATA Housing", "Mahindra Lifespaces"
];

export default function Partners() {
  return (
    <section className="bg-[#FAF1E6] py-16 border-t border-[#C7C0AE]/20 font-sans overflow-hidden" id="partners">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#313131] font-vietnam text-center opacity-80 uppercase">
          Our Trusted Partners
        </h2>
      </div>

      {/* Marquee effect */}
      <div className="relative w-full flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 md:gap-16 py-4">
          {[...partners, ...partners, ...partners].map((partner, idx) => (
            <div 
              key={idx} 
              className="inline-flex items-center justify-center bg-white border border-[#C7C0AE]/30 px-8 py-4 rounded-xl shadow-sm opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-pointer"
            >
              <span className="text-xl font-black text-[#313131] font-vietnam tracking-tighter">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
}
