"use client";

import React, { useEffect, useState } from "react";
import { getLocalities, type Locality } from "@/lib/api/localities";

const FALLBACK_IMAGES = [
  "/property_apartment.png",
  "/property_condo.png",
  "/property_villa.png",
  "/property_apartment.png",
];

export default function Localities() {
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocalities()
      .then((res) => {
        if (res.success) {
          // Show up to 8 localities; prioritise ones with images
          const sorted = [...res.data].sort((a, b) =>
            (b.image ? 1 : 0) - (a.image ? 1 : 0)
          );
          setLocalities(sorted.slice(0, 8));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-[#FAF1E6] py-16 border-t border-[#C7C0AE]/20 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-[#C7C0AE]/20 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no localities in DB yet, show nothing (or a message)
  if (localities.length === 0) return null;

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
              key={loc._id}
              className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-md"
            >
              <img
                src={loc.image || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                alt={loc.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 p-5 w-full">
                <h3 className="text-xl font-bold text-white font-vietnam mb-1">
                  {loc.name}
                </h3>
                {loc.city && (
                  <p className="text-[10px] font-medium text-white/70 mb-1">{loc.city}</p>
                )}
                <p className="text-xs font-medium text-white/80 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full inline-block">
                  {loc.activeGroups ?? 0} Active Groups
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
