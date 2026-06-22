"use client";

import React, { useState, useEffect } from "react";

export default function Hero() {
  const [feedIndex, setFeedIndex] = useState(0);

  // Feed animation
  const feedNotifications = [
    "Rahul P. joined Gurgaon Active Group (Group saved ₹48L so far)",
    "Sneha M. unlocked 8% Tier for Bangalore Heights Group",
    "Karan S. started a new group buy at DLF Phase V",
    "Preeti J. joined Mumbai Ocean View Group (Save 10% unlocked)",
    "Properties Wallah secured a new 12% bulk deal in Noida Sec 150",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedIndex((prev) => (prev + 1) % feedNotifications.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center bg-[#FAF1E6] py-12 md:py-20 overflow-hidden font-sans">

      {/* Subtle Background Textures */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#313131" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column - Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-left">

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#313131] leading-[1.05] font-vietnam">
              Buy together. <br />
              <span className="text-[#94A692]">Save more.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-[#313131]/80 max-w-xl leading-relaxed">
              Properties Wallah brings group-buying leverage to Indian real estate.
              By grouping verified buyers together, we unlock direct bulk developer discounts.
              <strong> Stop buying alone.</strong> India buys together, India saves together.
            </p>

            {/* Secondary Value Props - Horizontal Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg border-t border-[#C7C0AE]/30 pt-6">
              <div>
                <h4 className="font-bold text-base text-[#313131] flex items-center gap-2">
                  <span className="text-[#FFA100]">➔</span> Pay less, together
                </h4>
                <p className="text-xs text-[#313131]/70 mt-1">
                  More buyers in a project unlocks bigger discounts directly from developers.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-base text-[#313131] flex items-center gap-2">
                  <span className="text-[#FFA100]">➔</span> Bulk buys the discount
                </h4>
                <p className="text-xs text-[#313131]/70 mt-1">
                  We skip the middleman markups. The developer saves marketing costs; you keep the discount.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold bg-[#313131] text-white hover:bg-[#FFA100] hover:text-[#313131] transition-all duration-300 shadow-md cursor-pointer text-center"
              >
                Explore Active Groups
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-6 py-4 text-base font-semibold text-[#313131] hover:text-[#FFA100] transition-colors group cursor-pointer text-center"
              >
                How it works
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Live activity ticker */}
            <div className="h-8 overflow-hidden relative border-t border-[#C7C0AE]/20 pt-2 flex items-center gap-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-xs text-[#313131]/60 italic transition-all duration-500 transform font-vietnam">
                Live: {feedNotifications[feedIndex]}
              </p>
            </div>

          </div>

          {/* Right Column - Banner Image */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative mt-10 lg:mt-0">
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-[#C7C0AE]/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-shadow duration-500">
              <img 
                src="/banner-image.webp" 
                alt="Properties Wallah Banner" 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
