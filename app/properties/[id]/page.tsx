"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProperty, type Property } from "@/lib/api/properties";
import { joinGroup } from "@/lib/api/groups";
import LoginFlow from "@/components/auth/LoginFlow";
import PaymentModal from "@/components/plans/PaymentModal";
import { LuWaves, LuDumbbell, LuBuilding, LuShieldCheck, LuCar, LuSparkles, LuBuilding2, LuImage, LuPlay, LuArrowRight } from "react-icons/lu";

// Helper to format price (if needed for older data)
const formatPrice = (price?: number | string) => {
  if (!price) return "Price on Request";
  if (typeof price === "string") return price;
  return `₹${(price / 10000000).toFixed(2)} Cr`;
};

export default function PropertyDetailsPage() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [activeBhk, setActiveBhk] = useState<string>("All");
  const [selectedUnit, setSelectedUnit] = useState<number>(0);

  useEffect(() => {
    const fetchProperty = async () => {
      if (params.id) {
        try {
          const res = await getProperty(params.id as string);
          if (res.success && res.data) {
            setProperty(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch property", error);
        }
      }
      setLoading(false);
    };
    fetchProperty();
  }, [params.id]);

  const handleJoinGroup = async () => {
    setJoining(true);
    try {
      if (!property) return;
      const res = await joinGroup({ propertyId: property._id, interestedBHK: "3BHK" });
      if (res.success) {
        alert("Successfully joined the group!");
        setProperty((prev) => prev ? { ...prev, filledSlots: (prev.filledSlots || 0) + 1 } : prev);
      } else {
        if (res.message?.includes("maximum") || res.message?.includes("upgrade") || (res as any).errorCode === "UPGRADE_REQUIRED") {
          setShowPayment(true);
        } else {
          alert(res.message || "Failed to join group.");
        }
      }
    } catch (error: any) {
      if (error?.status === 403 || error?.message?.includes("maximum") || error?.message?.includes("upgrade") || error?.message?.includes("403")) {
        setShowPayment(true);
      } else if (error?.status === 401 || error?.message?.includes("401")) {
        setShowLogin(true);
      } else {
        alert("Error joining group: " + error?.message);
      }
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF1E6] font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFA100]"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF1E6] font-sans">
        <h1 className="text-3xl font-extrabold text-[#313131]">Property Not Found</h1>
        <p className="text-[#313131]/60 mt-2">The property you are looking for does not exist or has been removed.</p>
        <a href="/" className="mt-6 px-6 py-3 bg-[#313131] text-white rounded-xl hover:bg-[#FFA100] hover:text-[#313131] transition-all font-bold">
          Go Back Home
        </a>
      </div>
    );
  }

  // Derived values for the UI
  const projectName = property.title;
  const heroImage = property.images?.[0] || "/property_apartment.png";
  const gallery = property.images || [];
  const city = property.location;
  const sector = property.sector || "Premium Location"; 
  const developerName = property.developerName || property.postedBy?.name || "Developer";
  const statusStr = property.status === "open" ? "Under Construction" : "Ready to Move";
  const possessionDate = property.possessionDate || property.createdAt;
  const priceFormatted = property.units?.[0]?.price || formatPrice((property as any).price);
  
  // Create a configuration array from the backend property units
  const configurations = property.units?.length > 0 
    ? property.units.map(unit => {
        let disc = unit.discountPrice;
        if (!disc && unit.price && unit.price !== "Price on Request") {
          const num = Number(unit.price.replace(/[^0-9.]/g, ''));
          if (num) disc = unit.price.replace(num.toString(), (num * 0.9).toString());
        }
        return {
          type: unit.bhkCategory || unit.bhk ? `${unit.bhkCategory || unit.bhk}` : unit.propertyType || "Layout",
          bhkCategory: unit.bhkCategory || "Other",
          carpetArea: unit.area ? `${unit.area}` : "TBD",
          startingPrice: unit.price || "Price on Request",
          discountPrice: disc || unit.price || "Price on Request",
          image: unit.image || null,
        };
      })
    : [
        {
          type: (property as any).bhk ? `${(property as any).bhk} BHK` : "Layout",
          bhkCategory: "Other",
          carpetArea: (property as any).area ? `${(property as any).area} sqft` : "TBD",
          startingPrice: priceFormatted,
          discountPrice: priceFormatted,
          image: null,
        }
      ];

  // BHK filter chips: prefer admin-defined bhkCategories (saved in DB), fall back to deriving from units
  const bhkCategories: string[] = (property.bhkCategories && property.bhkCategories.length > 0)
    ? property.bhkCategories
    : Array.from(new Set(configurations.map(c => c.bhkCategory).filter(Boolean)));
  const filteredConfigurations = activeBhk === "All"
    ? configurations
    : configurations.filter(c => c.bhkCategory === activeBhk);

  // Compute savings %
  const getSavings = (startingPrice: string, discountPrice: string) => {
    if (startingPrice === discountPrice || !discountPrice) return null;
    const toNum = (s: string) => {
      const match = s.replace(/[₹,\s]/g, '').match(/([\d.]+)\s*(?:Cr|L|K)?/i);
      if (!match) return null;
      const n = parseFloat(match[1]);
      const u = s.toLowerCase();
      if (u.includes('cr')) return n * 1e7;
      if (u.includes('l')) return n * 1e5;
      if (u.includes('k')) return n * 1e3;
      return n;
    };
    const orig = toNum(startingPrice);
    const disc = toNum(discountPrice);
    if (!orig || !disc || disc >= orig) return null;
    const pct = Math.round(((orig - disc) / orig) * 100);
    return `Save ${pct}%`;
  };

  const amenities = property.amenities || [];
  const locationHighlights = property.locationHighlights || "Near City Center | Close to Metro Station | Premium Connectivity";
  const description = property.description;
  const aboutDeveloper = property.aboutDeveloper || `Developed by ${developerName}. Bringing premium living to you.`;

  const possDate = possessionDate
    ? new Date(possessionDate).toLocaleDateString("en-IN", { month: "short", year: "2-digit" })
    : "TBD";

  return (
    <div className="min-h-screen bg-[#FAF1E6] pb-20 font-sans text-[#313131]">
      
      {/* HEADER GALLERY SECTION */}
      <section className="w-full max-w-7xl mx-auto md:p-4">
        <div className="flex flex-col md:flex-row gap-2 h-auto md:h-[400px] overflow-hidden md:rounded-2xl">
          {/* Main Image */}
          <div className="w-full md:w-2/3 h-[250px] md:h-full relative group cursor-pointer">
            <img 
              src={heroImage} 
              alt={projectName} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).src = "/property_apartment.png"; }}
            />
            <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-sm">
              <LuImage />
              <span>All Photos &amp; Videos</span>
            </div>
          </div>
          
          {/* Side Images */}
          <div className="w-full md:w-1/3 flex flex-row md:flex-col gap-2 h-[120px] md:h-full">
            <div className="w-1/2 md:w-full h-full relative group cursor-pointer overflow-hidden">
              <img 
                src={gallery[1] || heroImage} 
                alt={`${projectName} Video`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = "/property_condo.png"; }}
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                  <LuPlay className="text-white text-xl" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold">Videos</div>
            </div>
            <div className="w-1/2 md:w-full h-full relative group cursor-pointer overflow-hidden">
              <img 
                src={gallery[2] || heroImage} 
                alt={`${projectName} Outdoors`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = "/property_villa.png"; }}
              />
              <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold">Outdoors</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* MAIN CONTENT COLUMN */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Breadcrumb */}
            <div className="text-[10px] text-gray-500 font-medium tracking-wide">
              Home &gt; Projects in {city} &gt; {sector} &gt; {projectName}
            </div>

            {/* Title Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-lg bg-[#FAF1E6] border border-[#C7C0AE]/30 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-[#FFA100]">{developerName[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                    {projectName}
                  </h1>
                  <p className="text-sm text-[#313131]/60 mt-0.5">{city}{sector ? `, ${sector}` : ""}</p>
                </div>
              </div>
            </div>

            {/* ===== FLOOR PLANS & PRICING ===== */}
            {configurations.length > 0 && (
              <div className="pt-2">
                {/* Section heading and Brochure */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Floor Plans &amp; Pricing</h2>
                  {property.brochureUrl && (
                    <a
                      href={property.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 text-gray-700 rounded-lg px-4 py-2 font-semibold text-sm transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Brochure
                    </a>
                  )}
                </div>

                {/* BHK Filter Chips — only show when there are 2+ distinct categories */}
                {bhkCategories.length > 1 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {bhkCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveBhk(activeBhk === cat ? "All" : cat);
                          setSelectedUnit(0);
                        }}
                        className={`px-5 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
                          activeBhk === cat
                            ? "border-blue-500 text-blue-600 bg-blue-50"
                            : "border-gray-300 text-gray-700 bg-white hover:border-blue-400 hover:text-blue-500"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                {/* Floor plan count */}
                <p className="text-sm text-gray-500 mb-4">
                  {filteredConfigurations.length} Floor Plan{filteredConfigurations.length !== 1 ? "s" : ""} Available
                </p>

                {/* Unit Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredConfigurations.map((config, idx) => {
                    const hasDiff =
                      config.startingPrice !== config.discountPrice &&
                      !!config.discountPrice &&
                      config.discountPrice !== "Price on Request";
                    const savings = getSavings(config.startingPrice, config.discountPrice);

                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
                      >
                        {/* Card top: area + BHK label */}
                        <div className="p-4 pb-2">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                            <span className="text-xl font-bold text-gray-900">{config.carpetArea}</span>
                          </div>
                          <p className="text-xs text-gray-500 ml-4">Carpet Area | {config.type}</p>
                        </div>

                        {/* Image */}
                        <div className="mx-4 mb-3 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center h-40">
                          {config.image ? (
                            <img
                              src={config.image}
                              alt={`${config.type} floor plan`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/property_apartment.png";
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-300 gap-1">
                              <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              >
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M3 9h18M9 9v12M9 15h6" />
                              </svg>
                              <span className="text-[10px] font-medium">Floor Plan</span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="px-4 pb-3">
                          {hasDiff && (
                            <p className="text-xs text-gray-400 line-through mb-0.5">
                              {config.startingPrice}
                            </p>
                          )}
                          <p className="text-2xl font-bold text-gray-900">
                            {hasDiff ? config.discountPrice : config.startingPrice}
                          </p>
                          {savings && (
                            <span className="inline-block mt-1 bg-green-50 text-green-600 text-[10.5px] font-semibold px-2 py-0.5 rounded">
                              {savings}
                            </span>
                          )}
                        </div>

                        {/* Status box */}
                        <div className="mx-4 mb-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                          <p className="text-xs text-gray-500 font-medium">{statusStr}</p>
                          <p className="text-xs text-gray-500">{possDate} possession</p>
                        </div>

                        {/* Request Callback */}
                        <button
                          onClick={handleJoinGroup}
                          disabled={joining}
                          className="mx-4 mb-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-60"
                        >
                          {joining ? "Processing..." : "Request Callback"}
                          {!joining && (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.94 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Location Advantages */}
            <div className="pt-8">
              <div className="flex justify-between items-end mb-2">
                <h2 className="text-xl font-extrabold text-gray-900">Location Advantages</h2>
                <a href="#" className="text-xs font-bold text-[#0078DB] hover:underline">View All</a>
              </div>
              <p className="text-xs text-gray-500 mb-6">{city} is one of the prime locations to buy a home...</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {locationHighlights.split("|").map((highlight, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <LuBuilding2 size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800 line-clamp-1">{highlight.trim()}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{(2.5 + idx * 1.5).toFixed(1)} km</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Project */}
            <div className="pt-8 pb-8">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4">More about {projectName}</h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-4">
                <p>{description}</p>
                <p>{aboutDeveloper}</p>
              </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="pt-8 pb-4">
                <h2 className="text-xl font-extrabold text-gray-900 mb-5">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm group"
                    >
                      {/* Animated arrow */}
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0 text-[#FFA100]"
                        style={{
                          animation: `arrowBounce 1.4s ease-in-out infinite`,
                          animationDelay: `${(idx * 0.15) % 1.4}s`,
                        }}
                      >
                        <path
                          d="M3 9h12M10 4l5 5-5 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm font-semibold text-gray-800 leading-tight">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Keyframe injected inline — tiny, no extra CSS file needed */}
                <style>{`
                  @keyframes arrowBounce {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(5px); }
                  }
                `}</style>
              </div>
            )}

          </div>


            {/* Sticky Sidebar (Right) */}
            <aside className="lg:col-span-4 h-fit sticky top-28 mt-8 lg:mt-0">
              <div className="bg-white p-6 sm:p-8 rounded-lg text-[#313131] space-y-8 shadow-[0_4px_20px_rgba(49,49,49,0.04)] border border-[#C7C0AE]/30">
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#313131]">Join the Group</h3>
                  <p className="text-[#313131]/70 text-sm font-medium">Secure institutional-grade pricing by joining the current collective of verified investors.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-[#94A692]">{property.filledSlots || 0} people have joined</span>
                  </div>
                  <p className="text-xs text-[#313131]/50 italic">Group closes soon</p>
                </div>
                <div className="bg-[#FAF1E6]/50 p-4 rounded-lg border border-[#C7C0AE]/20 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#313131]/70">Estimated Saving</span>
                    <span className="text-[#FFA100] font-bold text-lg">
                      {configurations[0]?.startingPrice !== configurations[0]?.discountPrice ? 
                        `Exclusive %` : "Group Buy Rate"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#313131]/70">Status</span>
                    <span className="text-[#313131] text-sm font-bold capitalize">{property.status}</span>
                  </div>
                </div>
                <button 
                  onClick={handleJoinGroup}
                  disabled={joining}
                  className="w-full bg-[#FFA100] text-white py-4 rounded-lg text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-[#FFA100]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {joining ? "Processing..." : "Join Buying Group"}
                </button>
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-[#C7C0AE]/20 opacity-60">
                  <span className="material-symbols-outlined text-sm text-[#313131]">verified_user</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#313131]">Secured &amp; Encrypted</span>
                </div>
              </div>

              {/* Developer Quick View */}
              <div className="mt-8 bg-white p-6 rounded-lg shadow-[0_4px_20px_rgba(49,49,49,0.04)] border border-[#C7C0AE]/20">
                <p className="text-[10px] text-[#313131]/70 uppercase tracking-widest mb-4 font-bold">Project By</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-[#FAF1E6] flex items-center justify-center border border-[#C7C0AE]">
                    <span className="material-symbols-outlined text-[#313131]">apartment</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#313131] truncate">{developerName}</p>
                    <p className="text-xs text-[#313131]/60 mt-1 truncate">Top Tier • Assured Delivery</p>
                  </div>
                </div>
              </div>
            </aside>

        </div>
      </div>

        {/* Footer Section */}
        <footer className="mt-24 border-t border-[#C7C0AE]/20 bg-[#FAF1E6]/50 py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-4 md:px-12">
            <div className="bg-[#94A692]/5 p-8 md:p-12 rounded-lg border border-[#94A692]/10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center border border-[#C7C0AE] shadow-sm mb-6">
                  <span className="font-serif text-[#313131] text-2xl font-bold">{developerName[0]?.toUpperCase()}</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#313131] mb-4">{developerName} Bio</h3>
                <p className="text-[#313131]/80 leading-relaxed mb-6 text-sm sm:text-base line-clamp-3 sm:line-clamp-none">{aboutDeveloper}</p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-2 border border-[#313131] rounded-lg text-sm font-bold text-[#313131] hover:bg-[#313131] hover:text-white transition-all">View All Projects</button>
                  <button className="px-6 py-2 border border-[#313131] rounded-lg text-sm font-bold text-[#313131] hover:bg-[#313131] hover:text-white transition-all">Developer Profile</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-[#C7C0AE]/20 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-[#313131]">10M+</p>
                  <p className="text-[10px] sm:text-xs font-bold text-[#313131]/70 mt-1">Sq.Ft Delivered</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-[#C7C0AE]/20 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-[#313131]">4.7/5</p>
                  <p className="text-[10px] sm:text-xs font-bold text-[#313131]/70 mt-1">Investor Rating</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-[#C7C0AE]/20 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-[#313131]">5k+</p>
                  <p className="text-[10px] sm:text-xs font-bold text-[#313131]/70 mt-1">Happy Residents</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-[#C7C0AE]/20 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-[#313131]">A+</p>
                  <p className="text-[10px] sm:text-xs font-bold text-[#313131]/70 mt-1">Credit Rating</p>
                </div>
              </div>
            </div>
            
            <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
              <span className="font-serif text-[#313131] text-xl font-bold tracking-tight">Properties Wallah</span>
              <nav className="flex flex-wrap justify-center gap-6 sm:gap-8 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#313131]">
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Contact</a>
              </nav>
              <p className="text-[10px] sm:text-xs font-bold text-[#313131]">© 2026 Properties Wallah. All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      

      {/* Modals */}
      <LoginFlow isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        onUpgradeSuccess={() => alert("Your group limit has been upgraded! You can now join.")} 
      />
    </div>
  );
}
