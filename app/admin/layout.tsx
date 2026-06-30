"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Dashboard",   href: "/admin",          icon: "⊞" },
  { label: "Properties",  href: "/admin/properties", icon: "🏠" },
  { label: "Add Property",href: "/admin/properties/new", icon: "+" },
  { label: "Groups",      href: "/admin/groups",    icon: "👥" },
  { label: "Blogs",       href: "/admin/blogs",     icon: "📝" },
  { label: "Users",       href: "/admin/users",     icon: "👤" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Skip sidebar on the login page
  const isLoginPage = pathname === "/admin/login";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    
    const token = localStorage.getItem("pw_token");
    const userStr = localStorage.getItem("pw_user");
    let isAdmin = false;
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === "admin") isAdmin = true;
      } catch (e) {}
    }

    if (!token || !isAdmin) {
      router.replace("/admin/login");
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem("pw_token");
    localStorage.removeItem("pw_user");
    router.replace("/admin/login");
  };

  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center font-vietnam flex-col gap-4">
        <div className="w-8 h-8 border-4 border-[#FFA100] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-[#313131]">Loading Admin Panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F5F4F0] font-vietnam">
      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="w-64 shrink-0 bg-[#313131] flex flex-col shadow-xl">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex items-center bg-[#FFA100] px-2.5 py-1 rounded-lg">
              <span className="font-extrabold text-lg tracking-tighter text-[#313131]">P</span>
              <span className="font-extrabold text-lg tracking-tighter text-white">W</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-black tracking-wide text-white">
                PROPERTIES <span className="text-[#FFA100]">WALLAH</span>
              </span>
              <span className="text-[8px] font-bold tracking-[0.15em] text-white/40 mt-0.5 uppercase">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#FFA100] text-[#313131] shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer links */}
        <div className="px-3 py-5 border-t border-white/10 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white hover:text-white bg-red-500/20 hover:bg-red-500/40 transition-all text-left"
          >
            <span>⎋</span> Logout
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <span>←</span> Back to Website
          </Link>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-[#C7C0AE]/30 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-lg font-extrabold text-[#313131] font-vietnam">Admin Panel</h1>
            <p className="text-xs text-[#313131]/50 mt-0.5">Properties Wallah — Control Centre</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live Data
            </span>
            <Link
              href="/admin/properties/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#313131] hover:bg-[#FFA100] hover:text-[#313131] text-white text-sm font-bold rounded-lg transition-all duration-200 shadow-sm"
            >
              + Add Property
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
