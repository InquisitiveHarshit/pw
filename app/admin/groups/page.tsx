"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllGroups, type Group } from "@/lib/api/groups";

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAllGroups();
        setGroups(res.data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load groups.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#C7C0AE]/30 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 font-semibold">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#313131] font-vietnam">Buying Groups</h2>
          <p className="text-sm text-[#313131]/50 mt-1">
            {groups.length} group{groups.length !== 1 ? "s" : ""} formed across all properties
          </p>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#C7C0AE]/30 p-12 text-center">
          <p className="text-4xl mb-3">👥</p>
          <p className="font-bold text-[#313131]">No groups yet</p>
          <p className="text-sm text-[#313131]/50 mt-1">Groups are created when users join a property.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group._id}
              className="bg-white rounded-2xl border border-[#C7C0AE]/30 shadow-sm overflow-hidden"
            >
              {/* Group header */}
              <div className="px-6 py-4 border-b border-[#C7C0AE]/20 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF1E6] flex items-center justify-center text-lg">🏠</div>
                  <div>
                    <p className="font-extrabold text-[#313131] font-vietnam">
                      {group.property?.title || "Unknown Property"}
                    </p>
                    <p className="text-xs text-[#313131]/50 mt-0.5">
                      {group.property?.location} · ₹{group.property?.price?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    group.status === "complete"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {group.status === "complete" ? "✅ Complete" : "⏳ Forming"}
                  </span>
                  <span className="text-sm font-bold text-[#313131]/60">
                    {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Members table */}
              {group.members.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#FAF1E6]/60">
                      <tr>
                        {["Member", "Email", "Phone", "BHK Interest", "Budget", "Joined"].map((h) => (
                          <th key={h} className="px-5 py-2.5 text-left text-xs font-bold text-[#313131]/50 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C7C0AE]/10">
                      {group.members.map((m, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF1E6]/30 transition-colors">
                          <td className="px-5 py-3 font-semibold text-[#313131]">
                            {m.user?.name || "—"}
                          </td>
                          <td className="px-5 py-3 text-[#313131]/60">{m.user?.email || "—"}</td>
                          <td className="px-5 py-3 text-[#313131]/60">{m.user?.phone || "—"}</td>
                          <td className="px-5 py-3 text-[#313131]/60">{m.interestedBHK || "—"}</td>
                          <td className="px-5 py-3 text-[#313131]/60">
                            {m.budget ? `₹${m.budget.toLocaleString("en-IN")}` : "—"}
                          </td>
                          <td className="px-5 py-3 text-[#313131]/40 text-xs">
                            {new Date(m.joinedAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="px-6 py-4 text-sm text-[#313131]/40">No members yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
