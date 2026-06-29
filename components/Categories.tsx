"use client";

import React from "react";

const categories = [
  { name: "Agricultural", icon: "🌾", count: "120+ Properties" },
  { name: "Plot", icon: "🗺️", count: "450+ Properties" },
  { name: "Flat", icon: "🏢", count: "890+ Properties" },
  { name: "Office Space", icon: "💼", count: "320+ Properties" },
  { name: "Warehouse", icon: "🏭", count: "150+ Properties" },
];

export default function Categories() {
  return (
    <section className="bg-[#FAF1E6] py-16 border-t border-[#C7C0AE]/20 font-sans" id="categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#313131] font-vietnam">
            Explore by Category
          </h2>
          <p className="text-sm text-[#313131]/60 mt-2 font-medium max-w-2xl mx-auto">
            Find the perfect property type that fits your investment or residential needs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-[#C7C0AE]/30 p-6 flex flex-col items-center justify-center text-center cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 bg-[#FAF1E6] rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-[#FFA100] transition-colors duration-300 shadow-sm border border-[#C7C0AE]/20 group-hover:border-[#FFA100]">
                {cat.icon}
              </div>
              <h3 className="text-lg font-bold text-[#313131] font-vietnam group-hover:text-[#FFA100] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-[#C7C0AE] font-medium mt-1">
                {cat.count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
