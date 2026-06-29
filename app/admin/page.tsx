"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Stats = {
  totalProperties: number;
  openProperties: number;
  fullProperties: number;
  totalGroups: number;
  totalUsers: number;
  totalBlogs: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("pw_token") : null;
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const [propRes, groupRes, userRes, blogRes] = await Promise.all([
          fetch(`${BASE}/properties?limit=1000`, { headers }),
          fetch(`${BASE}/groups`, { headers }),
          fetch(`${BASE}/users`, { headers }),
          fetch(`${BASE}/blogs?limit=1000`, { headers }),
        ]);

        const [propData, groupData, userData, blogData] = await Promise.all([
          propRes.json(),
          groupRes.json(),
          userRes.json(),
          blogRes.json(),
        ]);

        const properties = propData.data || [];
        setStats({
          totalProperties: propData.total || 0,
          openProperties: properties.filter((p: { status: string }) => p.status === "open").length,
          fullProperties: properties.filter((p: { status: string }) => p.status === "full").length,
          totalGroups: groupData.total || 0,
          totalUsers: userData.total || 0,
          totalBlogs: blogData.total || 0,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        { label: "Total Properties", value: stats.totalProperties, icon: "🏠", color: "blue" },
        { label: "Open for Groups",  value: stats.openProperties,  icon: "✅", color: "emerald" },
        { label: "Groups Formed",    value: stats.totalGroups,     icon: "👥", color: "purple" },
        { label: "Registered Users", value: stats.totalUsers,      icon: "👤", color: "orange" },
        { label: "Blog Posts",       value: stats.totalBlogs,      icon: "📝", color: "rose" },
      ]
    : [];

  const colorMap: Record<string, string> = {
    blue:    "bg-blue-50 border-blue-200 text-blue-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    purple:  "bg-purple-50 border-purple-200 text-purple-700",
    orange:  "bg-orange-50 border-orange-200 text-orange-700",
    rose:    "bg-rose-50 border-rose-200 text-rose-700",
  };

  const quickActions = [
    { label: "Add New Property", sub: "Create a listing with all project details", href: "/admin/properties/new", icon: "+", dark: true },
    { label: "Manage Properties", sub: "View, edit, or delete property listings", href: "/admin/properties", icon: "🏠", dark: false },
    { label: "View All Groups",  sub: "See buying groups and their members", href: "/admin/groups", icon: "👥", dark: false },
    { label: "Write a Blog",     sub: "Publish articles and market insights", href: "/admin/blogs/new", icon: "📝", dark: false },
    { label: "View Users",       sub: "Browse all registered user accounts", href: "/admin/users", icon: "👤", dark: false },
  ];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#313131] font-vietnam">Dashboard Overview</h2>
        <p className="text-sm text-[#313131]/50 mt-1">Live snapshot of the Properties Wallah platform.</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#C7C0AE]/30 rounded-2xl p-5 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className={`bg-white border rounded-2xl p-5 flex flex-col gap-2 shadow-sm ${colorMap[s.color]}`}>
              <span className="text-2xl">{s.icon}</span>
              <p className="text-2xl font-extrabold text-[#313131] font-vietnam">{s.value}</p>
              <p className="text-xs font-semibold text-[#313131]/60">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-[#313131]/50 uppercase tracking-widest mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`group rounded-2xl p-6 flex items-center gap-4 shadow-sm transition-all duration-300 ${
                a.dark
                  ? "bg-[#313131] hover:bg-[#FFA100] text-white hover:text-[#313131]"
                  : "bg-white hover:bg-[#FAF1E6] border border-[#C7C0AE]/30 text-[#313131]"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-colors duration-300 ${
                a.dark ? "bg-[#FFA100] group-hover:bg-[#313131]" : "bg-[#FAF1E6]"
              }`}>
                {a.icon}
              </div>
              <div>
                <p className="font-extrabold text-sm font-vietnam">{a.label}</p>
                <p className={`text-xs mt-0.5 ${a.dark ? "opacity-60" : "text-[#313131]/50"}`}>{a.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
