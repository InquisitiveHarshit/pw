"use client";

import React from "react";

const upcomingProjects = [
  {
    id: "up1",
    projectName: "Godrej Woodscapes",
    developer: "Godrej Properties",
    city: "Bangalore",
    sector: "Whitefield",
    type: "Premium Apartments",
    launchDate: "Oct 2026",
    expectedPrice: "₹ 1.2 Cr Onwards",
    image: "/property_apartment.png",
    status: "Pre-Launch",
  },
  {
    id: "up2",
    projectName: "M3M Capital",
    developer: "M3M Group",
    city: "Gurgaon",
    sector: "Sector 113",
    type: "Luxury Residences",
    launchDate: "Nov 2026",
    expectedPrice: "₹ 2.5 Cr Onwards",
    image: "/property_condo.png",
    status: "Coming Soon",
  },
  {
    id: "up3",
    projectName: "Lodha Amara",
    developer: "Macrotech Developers",
    city: "Thane",
    sector: "Kolshet Road",
    type: "1, 2 & 3 BHK",
    launchDate: "Dec 2026",
    expectedPrice: "₹ 85 L Onwards",
    image: "/property_villa.png",
    status: "EOI Open",
  }
];

export default function UpcomingProjects() {
  return (
    <section className="bg-white py-16 border-t border-[#C7C0AE]/20 font-sans" id="upcoming">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#313131] font-vietnam">
              Upcoming Projects
            </h2>
            <p className="text-sm text-[#313131]/60 mt-1 font-medium">
              Get early access and founder-member group discounts before the public launch.
            </p>
          </div>
          <a
            href="#all-upcoming"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 border border-[#313131]/10 rounded-full text-xs font-bold text-[#313131] hover:bg-[#313131] hover:text-white transition-all duration-300 shadow-sm cursor-pointer font-vietnam"
          >
            view all upcoming ↗
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingProjects.map((prop) => (
            <div
              key={prop.id}
              className="bg-[#FAF1E6] rounded-[24px] border border-[#C7C0AE]/30 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={prop.image}
                  alt={prop.projectName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/property_apartment.png"; }}
                />
                <div className="absolute top-4 left-4 bg-[#313131] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
                  {prop.status}
                </div>
              </div>
              <div className="p-6">
                <p className="text-[10px] text-[#FFA100] font-bold uppercase tracking-wider mb-1">
                  {prop.developer}
                </p>
                <h3 className="text-xl font-bold text-[#313131] font-vietnam mb-1 leading-tight">
                  {prop.projectName}
                </h3>
                <p className="text-xs text-[#313131]/60 font-medium mb-4">
                  {prop.sector}, {prop.city}
                </p>

                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#C7C0AE]/20 mb-5">
                  <div>
                    <p className="text-[10px] text-[#313131]/50 uppercase font-bold tracking-wider">Expected Price</p>
                    <p className="text-sm font-black text-[#313131]">{prop.expectedPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#313131]/50 uppercase font-bold tracking-wider">Launch</p>
                    <p className="text-sm font-bold text-[#94A692]">{prop.launchDate}</p>
                  </div>
                </div>

                <button className="w-full py-3 bg-[#313131] text-white hover:bg-[#FFA100] hover:text-[#313131] font-bold text-sm rounded-xl transition-colors shadow-sm font-vietnam">
                  Join Waitlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
