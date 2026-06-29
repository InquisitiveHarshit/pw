"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProperty, getPropertyGroups, type Property } from "@/lib/api/properties";

type GroupMember = {
  user?: { name?: string; email?: string; phone?: string };
  interestedBHK?: string;
  budget?: number;
  message?: string;
  joinedAt: string;
};

type Group = {
  _id: string;
  status: "forming" | "complete";
  members: GroupMember[];
  createdAt: string;
};

export default function PropertyGroupsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof id !== "string") return;
    const fetchData = async () => {
      try {
        const [propRes, groupRes] = await Promise.all([
          getProperty(id),
          getPropertyGroups(id),
        ]);
        setProperty(propRes.data);
        setGroups(groupRes.data as Group[]);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const totalMembers = groups.reduce((sum, g) => sum + g.members.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link
          href="/admin/properties"
          className="w-10 h-10 rounded-xl bg-white border border-[#C7C0AE]/40 flex items-center justify-center text-[#313131]/60 hover:text-[#313131] hover:bg-[#FAF1E6] transition-colors shadow-sm"
        >
          ←
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-[#313131] font-vietnam">
            {loading ? "Loading…" : `Groups for "${property?.title ?? "Property"}"`}
          </h2>
          <p className="text-sm text-[#313131]/50 mt-1">
            {groups.length} group{groups.length !== 1 ? "s" : ""} · {totalMembers} total member{totalMembers !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Property Summary Card */}
      {property && (
        <div className="bg-white rounded-2xl border border-[#C7C0AE]/30 shadow-sm p-5 flex items-center gap-5 flex-wrap">
          <div className="w-14 h-14 rounded-xl bg-[#FAF1E6] flex items-center justify-center text-2xl shrink-0">🏠</div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-[#313131] font-vietnam truncate">{property.title}</p>
            <p className="text-sm text-[#313131]/50 mt-0.5">{property.location}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <p className="font-extrabold text-[#313131]">₹{property.price?.toLocaleString("en-IN")}</p>
              <p className="text-xs text-[#313131]/40">Price</p>
            </div>
            <div className="text-center">
              <p className="font-extrabold text-[#313131]">{property.filledSlots ?? 0}/{property.totalSlots ?? "?"}</p>
              <p className="text-xs text-[#313131]/40">Slots</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              property.status === "open" ? "bg-emerald-100 text-emerald-700" :
              property.status === "full" ? "bg-red-100 text-red-700" :
              "bg-gray-100 text-gray-600"
            }`}>
              {property.status}
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-semibold text-red-600">⚠️ {error}</div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#C7C0AE]/30 h-32 animate-pulse" />
          ))}
        </div>
      )}

      {/* No groups */}
      {!loading && groups.length === 0 && !error && (
        <div className="bg-white rounded-2xl border border-[#C7C0AE]/30 p-12 text-center">
          <p className="text-4xl mb-3">👥</p>
          <p className="font-bold text-[#313131]">No groups yet for this property</p>
          <p className="text-sm text-[#313131]/50 mt-1">Groups are created when users join this property.</p>
        </div>
      )}

      {/* Groups */}
      {!loading && groups.map((group, idx) => (
        <div key={group._id} className="bg-white rounded-2xl border border-[#C7C0AE]/30 shadow-sm overflow-hidden">
          {/* Group header */}
          <div className="px-6 py-4 border-b border-[#C7C0AE]/20 flex items-center justify-between flex-wrap gap-3 bg-[#FAF1E6]/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFA100]/20 flex items-center justify-center text-sm font-extrabold text-[#FFA100]">
                {idx + 1}
              </div>
              <div>
                <p className="font-extrabold text-[#313131] font-vietnam">Group #{idx + 1}</p>
                <p className="text-xs text-[#313131]/40 mt-0.5">
                  Created {new Date(group.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                group.status === "complete" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}>
                {group.status === "complete" ? "✅ Complete" : "⏳ Forming"}
              </span>
              <span className="text-sm font-semibold text-[#313131]/60">
                {group.members.length} member{group.members.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Members table */}
          {group.members.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF1E6]/30">
                  <tr>
                    {["#", "Name", "Email", "Phone", "BHK Interest", "Budget", "Message", "Joined"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold text-[#313131]/50 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C7C0AE]/10">
                  {group.members.map((m, mIdx) => (
                    <tr key={mIdx} className="hover:bg-[#FAF1E6]/20 transition-colors">
                      <td className="px-5 py-3 text-[#313131]/40 font-semibold text-xs">{mIdx + 1}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#FFA100]/20 flex items-center justify-center text-xs font-extrabold text-[#FFA100] shrink-0">
                            {m.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                          </div>
                          <span className="font-semibold text-[#313131]">{m.user?.name ?? "—"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[#313131]/60">{m.user?.email ?? "—"}</td>
                      <td className="px-5 py-3 text-[#313131]/60">{m.user?.phone ?? "—"}</td>
                      <td className="px-5 py-3 text-[#313131]/70">{m.interestedBHK ?? "—"}</td>
                      <td className="px-5 py-3 text-[#313131]/70">
                        {m.budget ? `₹${m.budget.toLocaleString("en-IN")}` : "—"}
                      </td>
                      <td className="px-5 py-3 text-[#313131]/50 max-w-[180px] truncate" title={m.message}>
                        {m.message || "—"}
                      </td>
                      <td className="px-5 py-3 text-[#313131]/40 text-xs whitespace-nowrap">
                        {new Date(m.joinedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-6 py-5 text-sm text-[#313131]/40 italic">No members have joined this group yet.</p>
          )}
        </div>
      ))}
    </div>
  );
}
