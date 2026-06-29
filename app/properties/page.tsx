import Link from "next/link";
import * as motion from "motion/react-client";

// Reusable animated property card
function PropertyCard({ property }: { property: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group rounded-2xl border border-[#C7C0AE]/40 bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative h-60 bg-[#FAF1E6] overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#C7C0AE]/20">
            <span className="text-[#313131]/50 font-medium font-vietnam">No Image Available</span>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#313131] shadow-sm font-vietnam">
          {property.type || "Apartment"}
        </div>
        <div className="absolute bottom-4 right-4 bg-[#313131]/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm font-vietnam">
          {property.status === "full" ? "Sold Out" : "Filling Fast"}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#313131] mb-2 truncate font-vietnam">{property.title}</h3>
        <p className="text-[#313131]/70 text-sm mb-4 line-clamp-2">{property.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-[#313131]/80 mb-6 font-medium">
          <span className="flex items-center gap-1.5 bg-[#FAF1E6] px-2.5 py-1 rounded-md">
            📍 {property.location}
          </span>
          <span className="flex items-center gap-1.5 bg-[#FAF1E6] px-2.5 py-1 rounded-md">
            🛏️ {property.bhk} BHK
          </span>
          <span className="flex items-center gap-1.5 bg-[#FAF1E6] px-2.5 py-1 rounded-md">
            📐 {property.area} sqft
          </span>
        </div>
        
        <div className="flex items-center justify-between border-t border-[#C7C0AE]/30 pt-4">
          <div>
            <p className="text-xs text-[#313131]/60 font-bold uppercase tracking-wider mb-1 font-vietnam">Group Price</p>
            <p className="text-2xl font-extrabold text-[#FFA100]">
              ₹{(property.price / 100000).toFixed(2)}L
            </p>
          </div>
          <Link
            href={`/properties/${property._id}`}
            className="bg-[#313131] hover:bg-[#FFA100] hover:text-[#313131] text-white px-5 py-2.5 rounded-xl font-bold transition-colors font-vietnam"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default async function PropertiesPage() {
  let properties = [];
  try {
    const res = await fetch("http://localhost:5000/api/properties", {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      properties = json.data || [];
    }
  } catch (err) {
    console.error("Failed to fetch properties:", err);
  }

  return (
    <div className="min-h-screen bg-[#FAF1E6] pb-20 font-sans">
      {/* Hero Section */}
      <section className="relative bg-[#313131] text-white pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C7C0AE" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 font-vietnam">
            Discover <span className="text-[#FFA100]">Properties</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#FAF1E6]/80 max-w-2xl mx-auto font-light">
            Find your dream home and join a buying group to unlock exclusive discounts.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 -mt-8 relative z-20">
        {/* Filters Mockup */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#C7C0AE]/40 flex flex-wrap gap-4 mb-12 items-center justify-between">
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 font-medium">
            <select className="bg-[#FAF1E6] border border-[#C7C0AE]/50 text-[#313131] text-sm rounded-xl focus:ring-[#FFA100] focus:border-[#FFA100] block p-3 min-w-[140px] outline-none">
              <option>All Locations</option>
              <option>Noida</option>
              <option>Gurgaon</option>
            </select>
            <select className="bg-[#FAF1E6] border border-[#C7C0AE]/50 text-[#313131] text-sm rounded-xl focus:ring-[#FFA100] focus:border-[#FFA100] block p-3 min-w-[140px] outline-none">
              <option>Any Type</option>
              <option>Apartment</option>
              <option>Villa</option>
            </select>
            <select className="bg-[#FAF1E6] border border-[#C7C0AE]/50 text-[#313131] text-sm rounded-xl focus:ring-[#FFA100] focus:border-[#FFA100] block p-3 min-w-[140px] outline-none">
              <option>All Prices</option>
              <option>Under 50L</option>
              <option>50L - 1Cr</option>
            </select>
          </div>
          <button className="bg-[#313131] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#FFA100] hover:text-[#313131] transition-colors w-full md:w-auto font-vietnam">
            Search
          </button>
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#C7C0AE]/40 shadow-sm">
            <h3 className="text-2xl font-bold text-[#313131] mb-2 font-vietnam">No Properties Found</h3>
            <p className="text-[#313131]/70">Check back later or adjust your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property: any) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
