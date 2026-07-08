"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProperties, type Property } from "@/lib/api/properties";

interface DisplayProperty extends Property {
  id: string; // Add id mapping for backward compatibility in the component
  projectName: string;
  city: string;
  sector: string;
  bhkDetails: string;
  developerPrice: string;
  groupPrice: string;
  discountPct: string;
  buyersJoinedText: string;
  subAlertText: string;
  ctaMemberText: string;
  recentViews: number;
  avatars: string[];
  activeDot: number;
  promotionalTag?: string;
  heroImage: string;
  slotsFilled: number;
}

export default function FastSellingProperties() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [properties, setProperties] = useState<DisplayProperty[]>([]);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await getProperties({ limit: 10 });
        const storeProps = res.data.filter(p => p.isFeatured && p.status === "open");
        
        // Map to display properties
        const displayProps = storeProps.map(p => {
          const type = p.type || "Apartment";
          const areaRaw = p.area || "0";
          const areaNum = typeof areaRaw === "string" ? parseFloat(areaRaw) : areaRaw;
          const bhkDetails = p.bhk ? `${p.bhk} BHK | ${areaNum > 0 ? areaNum + ' Sqft' : ''}` : type;

          const toNum = (s: any) => {
            if (!s) return Infinity;
            if (typeof s === "number") return s;
            const match = String(s).replace(/[₹,\s]/g, '').match(/([\d.]+)\s*(?:Cr|L|K)?/i);
            if (!match) return Infinity;
            const n = parseFloat(match[1]);
            const u = String(s).toLowerCase();
            if (u.includes('cr')) return n * 1e7;
            if (u.includes('l')) return n * 1e5;
            if (u.includes('k')) return n * 1e3;
            return n;
          };
        
          const formatCurrency = (val: number) => {
            if (val === Infinity || isNaN(val) || val === 0) return "Price on Request";
            if (val >= 1e7) return `₹${(val / 1e7).toFixed(2).replace(/\.00$/, '')} Cr`;
            if (val >= 1e5) return `₹${(val / 1e5).toFixed(2).replace(/\.00$/, '')} L`;
            if (val >= 1e3) return `₹${(val / 1e3).toFixed(2).replace(/\.00$/, '')} K`;
            return `₹${val}`;
          };

          let minPrice = Infinity;
          let minDiscountPrice = Infinity;

          if (p.units && p.units.length > 0) {
            p.units.forEach(unit => {
              const priceVal = toNum(unit.price);
              if (priceVal < minPrice) {
                minPrice = priceVal;
                const discountVal = toNum(unit.discountPrice);
                minDiscountPrice = discountVal !== Infinity ? discountVal : priceVal;
              }
            });
          }

          if (minPrice === Infinity) {
            minPrice = toNum((p as any).price);
            minDiscountPrice = minPrice;
          }

          const developerPrice = formatCurrency(minPrice);
          const groupPrice = formatCurrency(minDiscountPrice);
          const discountAmt = minPrice - minDiscountPrice;
          const discountPct = discountAmt > 0 && minPrice !== Infinity
            ? `Save ${Math.round((discountAmt / minPrice) * 100)}%`
            : "Group Buy Deal";
          
          const filled = p.filledSlots || 0;
          const avatars = ["Santosh", "Tushar", "Nikhlesh", "Vivek", "Arpit", "Bharat"].slice(0, filled);

          return {
            ...p,
            id: p._id,
            projectName: p.title,
            city: p.location,
            sector: p.sector || "",
            bhkDetails,
            developerPrice,
            groupPrice, 
            discountPct,
            buyersJoinedText: filled > 0 ? `▲ ${filled} joined recently` : "Be the first to join!",
            subAlertText: filled > 0 ? `${filled} families are purchasing!` : "Start group buying in this project.",
            ctaMemberText: `You? Become ${filled + 1}th member`,
            recentViews: Math.floor(Math.random() * 1000) + 500,
            avatars,
            activeDot: 0,
            heroImage: p.images?.[0] || "/property_villa.png",
            promotionalTag: p.promotionalTag || (p.isFeatured ? "Selling Fast" : undefined),
            slotsFilled: filled,
          };
        });

        setProperties(displayProps);
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const toggleLike = (id: string) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const cardWidth = 380;
      const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const changeActiveDot = (propertyId: string, index: number) => {
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === propertyId ? { ...prop, activeDot: index } : prop
      )
    );
  };

  if (loading) return <div className="py-16 text-center">Loading properties...</div>;
  if (properties.length === 0) return null;

  return (
    <section className="bg-white py-16 border-t border-[#C7C0AE]/20 font-sans" id="projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#313131] font-vietnam">
              Featured Properties
            </h2>
            <p className="text-sm text-[#313131]/60 mt-1 font-medium">
              High demand group buys nearing developer target thresholds.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="#all-properties"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#313131]/10 rounded-full text-xs font-bold text-[#313131] hover:bg-[#313131] hover:text-[#FAF1E6] hover:border-[#313131] transition-all duration-300 shadow-sm cursor-pointer font-vietnam"
            >
              view all ↗
            </a>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleScroll("left")}
                className="w-10 h-10 rounded-full border border-[#313131]/20 flex items-center justify-center text-[#313131] hover:bg-[#313131] hover:text-white transition-all cursor-pointer shadow-sm"
              >
                ←
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="w-10 h-10 rounded-full border border-[#313131]/20 flex items-center justify-center text-[#313131] hover:bg-[#313131] hover:text-white transition-all cursor-pointer shadow-sm"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {properties.map((prop) => (
            <div
              key={prop.id}
              onClick={() => router.push(`/properties/${prop.id}`)}
              className="cursor-pointer w-[360px] sm:w-[380px] shrink-0 bg-[#FAF1E6] text-[#313131] rounded-[28px] border border-[#C7C0AE]/30 shadow-xl overflow-hidden snap-start flex flex-col justify-between transition-transform duration-300 hover:scale-[1.01]"
            >
              <div className="relative h-[220px] w-full overflow-hidden bg-zinc-800">
                <img
                  src={prop.heroImage}
                  alt={prop.projectName}
                  className="w-full h-full object-cover select-none"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/property_villa.png"; }}
                />
                
                {prop.promotionalTag && (
                  <div className="absolute top-4 left-4 bg-emerald-600/90 backdrop-blur-sm border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <span className="text-[10px] text-white font-extrabold tracking-wider uppercase font-vietnam flex items-center gap-1">
                      <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      {prop.promotionalTag}
                    </span>
                  </div>
                )}

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(prop.id); }}
                    className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                  >
                    <span className="text-sm">{liked[prop.id] ? "❤️" : "🤍"}</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); alert("Added to comparison list"); }}
                    className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 text-xs font-bold hover:text-black cursor-pointer"
                  >
                    ⇄
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(window.location.origin + `/properties/${prop.id}`);
                      alert("Link copied to clipboard!");
                    }}
                    className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 text-xs hover:text-black cursor-pointer"
                  >
                    🔗
                  </button>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {[0, 1, 2].map((dotIndex) => (
                    <button
                      key={dotIndex}
                      onClick={(e) => { e.stopPropagation(); changeActiveDot(prop.id, dotIndex); }}
                      className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                        prop.activeDot === dotIndex ? "bg-white scale-110" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold font-vietnam leading-tight tracking-tight text-[#313131]">
                      {prop.projectName}
                    </h3>
                    <p className="text-xs text-[#313131]/70 font-medium">
                      {prop.city}{prop.sector ? `, ${prop.sector}` : ''}
                    </p>
                    <p className="text-[11px] text-[#313131]/80 font-bold uppercase tracking-wider">
                      {prop.bhkDetails}
                    </p>
                  </div>
                  
                  <a
                    href="tel:+91999999999"
                    onClick={(e) => e.stopPropagation()}
                    className="w-10 h-10 rounded-full bg-[#FFA100] hover:bg-[#FFA100]/90 flex items-center justify-center text-[#313131] transition-transform active:scale-95 shadow-md shrink-0 cursor-pointer"
                  >
                    📞
                  </a>
                </div>

                <div className="bg-white text-[#313131] rounded-xl p-3.5 border border-[#C7C0AE]/30 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#313131]/60 uppercase tracking-wider">
                    <span>👥 Group Buying in Progress</span>
                    <a href="#how" onClick={(e) => e.stopPropagation()} className="text-[#FFA100] lowercase font-semibold underline hover:text-[#313131]">
                      Why group buying? 🛈
                    </a>
                  </div>

                  <div className="space-y-1">
                    {prop.slotsFilled > 0 ? (
                      <>
                        <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 font-vietnam">
                          <span>{prop.buyersJoinedText}</span>
                        </div>
                        <p className="text-[11px] font-medium text-[#313131]/80">
                          {prop.subAlertText}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs font-semibold text-[#FFA100]/95 font-vietnam">
                        {prop.buyersJoinedText} <span className="text-[#313131]/80 block font-normal text-[11px] mt-0.5">{prop.subAlertText}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-[#313131]/10">
                    <div className="flex -space-x-2.5 overflow-hidden">
                      {prop.avatars.slice(0, 4).map((name, i) => (
                        <div
                          key={i}
                          className="inline-block h-7 w-7 rounded-full ring-2 ring-[#FAF1E6] bg-[#313131] text-white flex items-center justify-center text-[9px] font-black"
                          title={name}
                        >
                          {name.split(" ").map((w) => w[0]).join("")}
                        </div>
                      ))}
                    </div>

                    <div className="flex-grow border-t-2 border-dashed border-[#C7C0AE] h-0.5 mx-1" />

                    <button 
                      onClick={(e) => { e.stopPropagation(); alert(`Starting Group Buy flow for ${prop.projectName}`); }}
                      className="flex items-center gap-1 bg-white hover:bg-[#FFA100]/10 border border-dashed border-[#FFA100] rounded-full px-2.5 py-1 transition-all active:scale-95 cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 bg-[#FFA100] rounded-full animate-ping" />
                      <span className="text-[9px] font-extrabold text-[#FFA100] uppercase tracking-wider font-vietnam">
                        {prop.ctaMemberText.split("? ")[1] || prop.ctaMemberText}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-1">
                  <div>
                    <span className="block text-[10px] text-[#313131]/60 font-bold uppercase tracking-wider">
                      Developer Solo Price
                    </span>
                    <span className="text-sm font-semibold line-through text-[#313131]/50">
                      {prop.developerPrice}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <span className="inline-block text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-extrabold mb-1 uppercase tracking-wider">
                      {prop.discountPct}
                    </span>
                    <div className="flex items-baseline gap-1 text-[#FFA100] font-vietnam">
                      <span className="text-[10px] font-bold text-[#313131]/70">Group buy:</span>
                      <span className="text-2xl font-black text-[#313131]">{prop.groupPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); alert(`Direct Booking Solo at ${prop.developerPrice} unlocked!`); }}
                    className="py-3 px-2 border-2 border-[#FFA100] bg-transparent text-[#FFA100] hover:bg-[#FFA100] hover:text-[#313131] font-bold text-xs rounded-xl transition-all duration-300 cursor-pointer text-center font-vietnam shadow-sm active:scale-98"
                  >
                    Book Solo
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); alert(`Joining the active group buy for ${prop.projectName}! Discount will be locked.`); }}
                    className="py-3 px-2 bg-[#FFA100] hover:bg-[#FFA100]/90 text-[#313131] font-bold text-xs rounded-xl transition-all duration-300 cursor-pointer text-center font-vietnam shadow-md active:scale-98"
                  >
                    Group Purchase
                  </button>
                </div>

                <div className="text-[10px] text-[#313131]/60 text-center italic pt-1">
                  {prop.recentViews} property seekers viewed this project today
                </div>

              </div>

            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
