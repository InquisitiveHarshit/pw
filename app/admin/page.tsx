"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProperties, type Property } from "@/lib/propertyStore";

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    setProperties(getProperties());
  }, []);

  const total = properties.length;
  const active = properties.filter((p) => p.status === "active").length;
  const featured = properties.filter((p) => p.isFeatured).length;
  const bestPrice = properties.filter((p) => p.isBestPrice).length;
  const totalSlots = properties.reduce((s, p) => s + p.groupSlots, 0);
  const filledSlots = properties.reduce((s, p) => s + p.slotsFilled, 0);

  const stats = [
    { label: "Total Properties", value: total, icon: "🏠", color: "bg-blue-50 border-blue-200 text-blue-700" },
    { label: "Active Listings", value: active, icon: "✅", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { label: "Featured on Home", value: featured, icon: "⭐", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
    { label: "Best Price Badge", value: bestPrice, icon: "🏷️", color: "bg-orange-50 border-orange-200 text-orange-700" },
    { label: "Group Slots Filled", value: `${filledSlots} / ${totalSlots}`, icon: "👥", color: "bg-purple-50 border-purple-200 text-purple-700" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#313131] font-vietnam">Dashboard Overview</h2>
        <p className="text-sm text-[#313131]/50 mt-1">
          Quick summary of all properties on the platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white border rounded-2xl p-5 flex flex-col gap-2 shadow-sm ${stat.color.split(" ").slice(1).join(" ")}`}
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-extrabold text-[#313131] font-vietnam">{stat.value}</p>
            <p className="text-xs font-semibold text-[#313131]/60">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/properties/new"
          className="group bg-[#313131] hover:bg-[#FFA100] text-white hover:text-[#313131] rounded-2xl p-6 flex items-center gap-5 shadow-md transition-all duration-300"
        >
          <div className="w-14 h-14 rounded-xl bg-[#FFA100] group-hover:bg-[#313131] flex items-center justify-center text-2xl transition-colors duration-300">
            +
          </div>
          <div>
            <p className="font-extrabold text-lg font-vietnam">Add New Property</p>
            <p className="text-sm opacity-70 mt-0.5">Create a new listing with all project details</p>
          </div>
        </Link>

        <Link
          href="/admin/properties"
          className="group bg-white hover:bg-[#FAF1E6] border border-[#C7C0AE]/40 rounded-2xl p-6 flex items-center gap-5 shadow-sm transition-all duration-300"
        >
          <div className="w-14 h-14 rounded-xl bg-[#FAF1E6] flex items-center justify-center text-2xl">
            🏠
          </div>
          <div>
            <p className="font-extrabold text-lg text-[#313131] font-vietnam">Manage Properties</p>
            <p className="text-sm text-[#313131]/50 mt-0.5">View, edit, delete, or toggle property status</p>
          </div>
        </Link>
      </div>

      {/* Recent Properties Table */}
      <div className="bg-white rounded-2xl border border-[#C7C0AE]/30 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#C7C0AE]/20 flex items-center justify-between">
          <h3 className="font-extrabold text-[#313131] font-vietnam">Recent Properties</h3>
          <Link href="/admin/properties" className="text-xs text-[#FFA100] font-bold hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF1E6]/60">
              <tr>
                {["Project", "Location", "Status", "Slots", "Featured", "Best Price"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-[#313131]/60 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C7C0AE]/10">
              {properties.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF1E6]/30 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-[#313131]">{p.projectName}</p>
                    <p className="text-[11px] text-[#313131]/50">{p.developerName}</p>
                  </td>
                  <td className="px-5 py-4 text-[#313131]/70">{p.city}, {p.sector}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      p.status === "active" ? "bg-emerald-100 text-emerald-700" :
                      p.status === "soldOut" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {p.status === "soldOut" ? "Sold Out" : p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#313131]/70">{p.slotsFilled}/{p.groupSlots}</td>
                  <td className="px-5 py-4">
                    <span className={`text-lg ${p.isFeatured ? "opacity-100" : "opacity-20"}`}>⭐</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-lg ${p.isBestPrice ? "opacity-100" : "opacity-20"}`}>🏷️</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
