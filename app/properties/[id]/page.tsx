"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProperty, type Property } from "@/lib/api/properties";
import { joinGroup } from "@/lib/api/groups";
import LoginFlow from "@/components/auth/LoginFlow";
import PaymentModal from "@/components/plans/PaymentModal";

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
      // request helper throws on !res.ok, but if it doesn't:
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
      // If request helper throws an error with status
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
          if (num) disc = unit.price.replace(num.toString(), (num * 0.9).toString()); // Simple approx formatting
        }
        return {
          type: unit.bhk ? `${unit.bhk}` : unit.propertyType || "Layout",
          carpetArea: unit.area ? `${unit.area}` : "TBD",
          startingPrice: unit.price || "Price on Request",
          discountPrice: disc || unit.price || "Price on Request",
        };
      })
    : [
        {
          type: (property as any).bhk ? `${(property as any).bhk} BHK` : "Layout",
          carpetArea: (property as any).area ? `${(property as any).area} sqft` : "TBD",
          startingPrice: priceFormatted,
          discountPrice: priceFormatted,
        }
      ];

  const amenities = property.amenities || [];
  const locationHighlights = property.locationHighlights || "Near City Center | Close to Metro Station | Premium Connectivity";
  const description = property.description;
  const aboutDeveloper = property.aboutDeveloper || `Developed by ${developerName}. Bringing premium living to you.`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-[#313131]">
      
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
              <span>≡ƒû╝∩╕Å All Photos & Videos</span>
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
                  <span className="text-white text-lg">Γû╢</span>
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
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </button>
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">{sector}, {city}</p>
                </div>
              </div>
              <button className="w-full sm:w-auto px-6 py-2.5 bg-[#0078DB] hover:bg-[#0060B0] text-white font-bold rounded text-sm transition-colors shadow-sm">
                View Number
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {property.promotionalTag && (
                <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold rounded flex items-center gap-1">
                  ≡ƒöÑ {property.promotionalTag}
                </span>
              )}
              {property.reraNumber ? (
                <span className="px-3 py-1 bg-teal-500 text-white text-[10px] font-bold uppercase rounded flex items-center gap-1">
                  Γ£ô RERA: {property.reraNumber}
                </span>
              ) : (
                <span className="px-3 py-1 bg-teal-500 text-white text-[10px] font-bold uppercase rounded flex items-center gap-1">
                  Γ£ô RERA
                </span>
              )}
              <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold rounded">
                No Brokerage
              </span>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold rounded">
                EMI Starts ₹50K
              </span>
              <span className="px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-bold rounded">
                Top Facilities
              </span>
            </div>

            {/* Construction Status */}
            <div className="bg-[#F0F7FF] border border-[#D0E3F5] rounded-xl p-4 flex justify-between items-center mt-4">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Construction Status</p>
                <p className="text-base font-extrabold text-[#004A8F] mt-0.5">
                  {statusStr}
                </p>
                {property.possessionDate && (
                  <p className="text-xs text-gray-600 mt-1">Possession in {new Date(property.possessionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric'})}</p>
                )}
              </div>
              <button className="text-[#0078DB]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            </div>

            {/* Price Overview */}
            <div className="pt-6">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mb-2">Γé╣</div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold">{configurations[0]?.startingPrice}</span>
                    <span className="text-xs font-semibold text-[#0078DB]">+ Charges</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Price Range</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">{configurations.map(c => c.type).join(", ")}</p>
                </div>
                {property.brochureUrl ? (
                  <a
                    href={property.brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 border-2 border-[#0078DB] text-[#0078DB] hover:bg-[#0078DB]/5 font-bold rounded flex items-center justify-center gap-2 text-sm transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download Brochure
                  </a>
                ) : (
                  <button
                    disabled
                    title="No brochure available"
                    className="w-full sm:w-auto px-5 py-2.5 border-2 border-gray-200 text-gray-400 font-bold rounded flex items-center justify-center gap-2 text-sm cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Brochure Not Available
                  </button>
                )}
              </div>

              {/* Price Tabs Mock */}
              <div className="flex gap-2 mt-4">
                {configurations.map((config, idx) => (
                  <div key={idx} className={`px-4 py-3 border rounded-lg cursor-pointer ${idx === 0 ? "border-[#0078DB] bg-[#F4F9FF]" : "border-gray-200"}`}>
                    <p className="text-sm font-bold">{config.type}</p>
                    <p className="text-[10px] text-gray-500 mt-1">Carpet Area</p>
                    <p className="text-xs font-semibold">{config.carpetArea}</p>
                    <p className="text-sm font-bold mt-2">{config.startingPrice} <span className="text-[10px] text-[#0078DB] font-normal">+ Charges</span></p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floor Plans & Pricing */}
            <div className="pt-8">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-extrabold text-gray-900">Floor Plans & Pricing</h2>
              </div>
              
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {configurations.map((config, idx) => (
                  <button key={idx} className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border ${idx === 0 ? "bg-[#F4F9FF] border-[#0078DB] text-[#0078DB]" : "border-gray-300 text-gray-600"}`}>
                    {config.type}
                  </button>
                ))}
              </div>

              <div className="text-xs text-gray-500 mb-2">1 Floor Plan Available</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {configurations.map((config, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 bg-white">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <span className="font-bold text-sm">{config.carpetArea}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 pl-4">Carpet Area | {config.type}</p>
                      
                      <div className="h-32 my-4 bg-gray-50 rounded flex items-center justify-center p-2 relative">
                        <img src="/floorplan_mock.webp" alt="Floorplan" className="max-h-full object-contain opacity-80 mix-blend-multiply" onError={(e) => { (e.target as HTMLImageElement).src = "/property_apartment.png"; }} />
                      </div>
                      
                      <div className="font-extrabold text-base">{config.startingPrice}</div>
                      
                      <div className="mt-3 bg-gray-50 p-2 rounded text-[10px] text-gray-600">
                        <p>{statusStr}</p>
                        <p>{new Date(possessionDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit'})} possession</p>
                      </div>
                      
                      <button className="mt-4 w-full text-center text-[#0078DB] font-bold text-xs py-2 hover:bg-gray-50 flex items-center justify-center gap-1 border-t border-gray-100">
                        Request Callback <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sellers */}
            <div className="pt-8">
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-extrabold text-gray-900">Sellers you may contact for more details</h2>
                <a href="#" className="text-xs font-bold text-[#0078DB] hover:underline">View All Sellers</a>
              </div>
              
              <div className="w-64 bg-gray-900 rounded-xl overflow-hidden relative shadow-lg">
                <div className="absolute top-2 left-2 bg-[#FFA100] text-black text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 z-10">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  Property Advisor
                </div>
                
                <div className="h-32 bg-black/40 relative">
                  <img src={heroImage} className="w-full h-full object-cover opacity-50" alt="Background" onError={(e) => { (e.target as HTMLImageElement).src = "/property_condo.png"; }} />
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                     <p className="text-yellow-400 text-[10px] font-bold mb-1">Our Expertise</p>
                     <p className="text-white font-bold text-sm leading-tight">{locationHighlights.split("|")[0]}</p>
                     <div className="w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center mt-3">
                       <span className="text-white text-xs">Γû╢</span>
                     </div>
                  </div>
                </div>
                
                <div className="bg-[#1A2642] p-4 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden border border-gray-600">
                      <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Broker" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{developerName.toUpperCase()}</p>
                      <p className="text-[10px] text-gray-400">Verified Partner</p>
                    </div>
                  </div>
                  <button className="w-full bg-white text-[#1A2642] hover:bg-gray-100 font-bold text-sm py-2 rounded transition-colors">
                    View Number
                  </button>
                </div>
              </div>
            </div>

            {/* Top Facilities */}
            <div className="pt-8">
              <div className="flex justify-between items-end mb-2">
                <h2 className="text-xl font-extrabold text-gray-900">Top Facilities</h2>
                <a href="#" className="text-xs font-bold text-[#0078DB] hover:underline">View All ({amenities.length})</a>
              </div>
              <p className="text-xs text-gray-500 mb-6">{projectName} presents an exclusive opportunity to own a stunning home...</p>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {amenities.slice(0, 6).map((amenity, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-lg text-[#0078DB]">
                      {/* Using generic emojis as icons for now */}
                      {amenity.includes("Pool") ? "≡ƒÅè" : 
                       amenity.includes("Gym") ? "≡ƒÅï∩╕Å" : 
                       amenity.includes("Club") ? "≡ƒÅ¢∩╕Å" : 
                       amenity.includes("Security") ? "≡ƒ¢í∩╕Å" : 
                       amenity.includes("Parking") ? "≡ƒÜù" : "Γ£¿"}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-700 leading-tight">{amenity}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-xs font-bold text-gray-900 border-b-2 border-gray-900 pb-0.5 hover:text-[#0078DB] hover:border-[#0078DB] transition-colors">
                View Facility Photos ΓåÆ
              </button>
            </div>

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
                      ≡ƒÅó
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
              <button className="mt-2 text-xs font-bold text-[#0078DB] hover:underline">
                Read more
              </button>
            </div>

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
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#313131]">Secured & Encrypted</span>
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
