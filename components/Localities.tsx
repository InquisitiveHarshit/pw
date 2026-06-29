"use client";

import React from "react";

const localities = [
  { name: "Noida Expressway", projects: 42, image: "/property_condo.png" },
  { name: "Gurgaon Sector 65", projects: 28, image: "/property_apartment.png" },
  { name: "Greater Noida West", projects: 85, image: "/property_villa.png" },
  { name: "Yamuna Expressway", projects: 15, image: "/property_condo.png" },
];

export default function Localities() {
  return (
    <section className="bg-[#FAF1E6] py-16 border-t border-[#C7C0AE]/20 font-sans" id="localities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#313131] font-vietnam">
              Explore by Localities
            </h2>
            <p className="text-sm text-[#313131]/60 mt-1 font-medium">
              Find group buying opportunities in the most sought-after neighborhoods.
            </p>
          </div>
          <a
            href="#all-localities"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#313131]/10 rounded-full text-xs font-bold text-[#313131] hover:bg-[#313131] hover:text-[#FAF1E6] transition-all duration-300 shadow-sm cursor-pointer font-vietnam"
          >
            view all ↗
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {localities.map((loc, idx) => (
            <div 
              key={idx}
              className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-md"
            >
              <img 
                src={loc.image} 
                alt={loc.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { (e.target as HTMLImageElement).src = "/property_apartment.png"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <h3 className="text-xl font-bold text-white font-vietnam mb-1">
                  {loc.name}
                </h3>
                <p className="text-xs font-medium text-white/80 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full inline-block">
                  {loc.projects} Active Groups
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
