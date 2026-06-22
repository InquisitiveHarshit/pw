"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProperties, deleteProperty, updateProperty, type Property } from "@/lib/propertyStore";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setProperties(getProperties());
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (id: string) => {
    deleteProperty(id);
    setProperties(getProperties());
    setDeleteConfirm(null);
    showToast("Property deleted successfully.");
  };

  const handleToggle = (id: string, field: "isFeatured" | "isBestPrice" | "status") => {
    const prop = properties.find((p) => p.id === id);
    if (!prop) return;
    if (field === "status") {
      const nextStatus = prop.status === "active" ? "inactive" : "active";
      updateProperty(id, { status: nextStatus });
    } else {
      updateProperty(id, { [field]: !prop[field] });
    }
    setProperties(getProperties());
    showToast("Property updated.");
  };

  const filtered = properties.filter(
    (p) =>
      p.projectName.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.developerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#313131] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold animate-fade-in">
          ✓ {toast}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl space-y-5 text-center">
            <div className="text-4xl">🗑️</div>
            <h3 className="text-lg font-extrabold text-[#313131] font-vietnam">Delete Property?</h3>
            <p className="text-sm text-[#313131]/60">This action cannot be undone. The property will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-[#C7C0AE]/40 rounded-xl text-sm font-bold text-[#313131] hover:bg-[#FAF1E6] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#313131] font-vietnam">All Properties</h2>
          <p className="text-sm text-[#313131]/50 mt-1">{filtered.length} listing{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#313131] hover:bg-[#FFA100] hover:text-[#313131] text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-sm"
        >
          + Add Property
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#313131]/40 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search by name, city, or developer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-[#C7C0AE]/40 rounded-xl text-sm text-[#313131] placeholder-[#313131]/40 focus:outline-none focus:border-[#FFA100] transition-colors shadow-sm"
        />
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl border border-[#C7C0AE]/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF1E6]/80 border-b border-[#C7C0AE]/20">
              <tr>
                {["Property", "Location", "Configurations", "Group Slots", "Status", "Featured", "Best Price", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-[11px] font-black text-[#313131]/60 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C7C0AE]/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-[#313131]/40">
                    <div className="text-4xl mb-3">🏘️</div>
                    <p className="font-semibold">No properties found.</p>
                    <Link href="/admin/properties/new" className="text-[#FFA100] font-bold text-xs mt-2 inline-block hover:underline">
                      Add your first property →
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF1E6]/20 transition-colors group">
                    {/* Property */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.heroImage}
                          alt={p.projectName}
                          className="w-12 h-12 object-cover rounded-lg border border-[#C7C0AE]/20 shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/property_villa.png"; }}
                        />
                        <div>
                          <p className="font-bold text-[#313131]">{p.projectName}</p>
                          <p className="text-[11px] text-[#313131]/50">{p.developerName}</p>
                          {p.promotionalTag && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 bg-[#FFA100]/15 text-[#FFA100] text-[9px] font-black rounded uppercase tracking-wider">
                              {p.promotionalTag}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-semibold text-[#313131]">{p.city}</p>
                      <p className="text-[11px] text-[#313131]/50">{p.sector}</p>
                    </td>

                    {/* Configs */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {p.configurations.map((c, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-[#313131]/8 text-[#313131] text-[10px] font-bold rounded border border-[#C7C0AE]/30">
                            {c.type}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Group Slots */}
                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#313131]">
                          <span className="text-[#FFA100]">{p.slotsFilled}</span>
                          <span className="text-[#313131]/40">/</span>
                          <span>{p.groupSlots}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-[#FAF1E6] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#94A692] rounded-full transition-all"
                            style={{ width: `${Math.min((p.slotsFilled / p.groupSlots) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggle(p.id, "status")}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all hover:scale-105 ${
                          p.status === "active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" :
                          p.status === "soldOut" ? "bg-red-100 text-red-700 cursor-not-allowed" :
                          "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        disabled={p.status === "soldOut"}
                        title={p.status === "soldOut" ? "Sold out status cannot be changed here" : "Click to toggle"}
                      >
                        {p.status === "active" ? "● Active" : p.status === "soldOut" ? "Sold Out" : "○ Inactive"}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggle(p.id, "isFeatured")}
                        title={p.isFeatured ? "Remove from Featured" : "Mark as Featured"}
                        className={`w-10 h-6 rounded-full transition-all duration-300 cursor-pointer focus:outline-none relative ${
                          p.isFeatured ? "bg-[#FFA100]" : "bg-[#C7C0AE]/40"
                        }`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                          p.isFeatured ? "left-4" : "left-0.5"
                        }`} />
                      </button>
                    </td>

                    {/* Best Price Toggle */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggle(p.id, "isBestPrice")}
                        title={p.isBestPrice ? "Remove Best Price badge" : "Mark as Best Price"}
                        className={`w-10 h-6 rounded-full transition-all duration-300 cursor-pointer focus:outline-none relative ${
                          p.isBestPrice ? "bg-[#94A692]" : "bg-[#C7C0AE]/40"
                        }`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                          p.isBestPrice ? "left-4" : "left-0.5"
                        }`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/properties/${p.id}/edit`}
                          className="px-3 py-1.5 bg-[#313131] hover:bg-[#FFA100] hover:text-[#313131] text-white text-[11px] font-bold rounded-lg transition-all"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-[11px] font-bold rounded-lg transition-all cursor-pointer border border-red-200 hover:border-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
