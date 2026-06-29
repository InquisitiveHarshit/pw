"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProperties, deleteProperty, type Property } from "@/lib/api/properties";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProperties = async () => {
    try {
      const res = await getProperties({ limit: 100 });
      setProperties(res.data);
      setTotal(res.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      setDeleteConfirm(null);
      showToast("Property deleted successfully.");
    } catch (e: any) {
      showToast(e.message || "Failed to delete.");
    }
  };

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status: string) => {
    if (status === "open") return "bg-emerald-100 text-emerald-700";
    if (status === "full") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#313131] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold">
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#313131] font-vietnam">All Properties</h2>
          <p className="text-sm text-[#313131]/50 mt-1">{total} listing{total !== 1 ? "s" : ""} total</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#313131] hover:bg-[#FFA100] hover:text-[#313131] text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-sm"
        >
          + Add Property
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#313131]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by title or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-[#C7C0AE]/40 rounded-xl text-sm text-[#313131] placeholder-[#313131]/40 focus:outline-none focus:border-[#FFA100] transition-colors shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#C7C0AE]/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF1E6]/80 border-b border-[#C7C0AE]/20">
              <tr>
                {["Property", "Location", "Price", "Type / BHK", "Slots", "Status", "Featured", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-[11px] font-black text-[#313131]/60 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C7C0AE]/10">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-5 py-4">
                      <div className="h-5 bg-[#FAF1E6] rounded animate-pulse w-full" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
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
                  <tr key={p._id} className="hover:bg-[#FAF1E6]/20 transition-colors group">
                    {/* Title */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-12 h-12 object-cover rounded-lg border border-[#C7C0AE]/20 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#FAF1E6] flex items-center justify-center text-xl shrink-0">🏠</div>
                        )}
                        <div>
                          <p className="font-bold text-[#313131] max-w-[180px] truncate">{p.title}</p>
                          <p className="text-[11px] text-[#313131]/40 mt-0.5">
                            {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4 text-[#313131]/70 max-w-[140px] truncate">{p.location}</td>

                    {/* Price */}
                    <td className="px-5 py-4 font-semibold text-[#313131] whitespace-nowrap">
                      ₹{p.price?.toLocaleString("en-IN")}
                    </td>

                    {/* Type / BHK */}
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 bg-[#313131]/8 text-[#313131] text-[10px] font-bold rounded border border-[#C7C0AE]/30 capitalize">
                        {p.type}
                      </span>
                      {p.bhk && (
                        <span className="ml-1 px-2 py-0.5 bg-[#FFA100]/10 text-[#FFA100] text-[10px] font-bold rounded border border-[#FFA100]/20">
                          {p.bhk} BHK
                        </span>
                      )}
                    </td>

                    {/* Slots */}
                    <td className="px-5 py-4">
                      {p.totalSlots !== undefined ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1 text-xs font-bold text-[#313131]">
                            <span className="text-[#FFA100]">{p.filledSlots ?? 0}</span>
                            <span className="text-[#313131]/40">/</span>
                            <span>{p.totalSlots}</span>
                          </div>
                          <div className="w-20 h-1.5 bg-[#FAF1E6] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#94A692] rounded-full"
                              style={{ width: `${Math.min(((p.filledSlots ?? 0) / p.totalSlots) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : <span className="text-[#313131]/30">—</span>}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>

                    {/* Featured */}
                    <td className="px-5 py-4 text-center">
                      <span className={`text-lg ${p.isFeatured ? "opacity-100" : "opacity-15"}`}>⭐</span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/properties/${p._id}/edit`}
                          className="px-3 py-1.5 bg-[#313131] hover:bg-[#FFA100] hover:text-[#313131] text-white text-[11px] font-bold rounded-lg transition-all"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(p._id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-[11px] font-bold rounded-lg transition-all cursor-pointer border border-red-200 hover:border-red-600"
                        >
                          Delete
                        </button>
                        <Link
                          href={`/admin/properties/${p._id}/groups`}
                          className="px-3 py-1.5 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-600 text-[11px] font-bold rounded-lg transition-all border border-purple-200 hover:border-purple-600"
                        >
                          Groups
                        </Link>
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
