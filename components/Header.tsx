"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Subscription", href: "/subscription" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
];

export default function Header({ onLoginClick }: { onLoginClick?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, user, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#FAF1E6]/95 backdrop-blur-md shadow-sm border-b border-[#C7C0AE]/30"
          : "bg-[#FAF1E6]/80 backdrop-blur-sm border-b border-[#C7C0AE]/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex items-center bg-[#313131] px-3.5 py-2 rounded-lg transition-transform duration-300 group-hover:scale-[1.02] shadow-sm">
                <span className="font-extrabold text-2xl tracking-tighter text-white font-vietnam">P</span>
                <span className="font-extrabold text-2xl tracking-tighter text-[#FFA100] font-vietnam">W</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-wide text-[#313131] font-vietnam">
                  PROPERTIES <span className="text-[#FFA100]">WALLAH</span>
                </span>
                <span className="text-[8px] font-bold tracking-[0.2em] text-[#C7C0AE] mt-0.5 uppercase">
                  No Hype, Just Realty
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 group ${
                    isActive
                      ? "text-[#FFA100]"
                      : "text-[#313131]/75 hover:text-[#313131]"
                  }`}
                >
                  {link.label}
                  {/* Active / hover underline */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#FFA100] rounded-full transition-all duration-300 ${
                      isActive ? "w-4/5" : "w-0 group-hover:w-4/5"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {!loading && (
              isLoggedIn ? (
                <div className="flex items-center gap-3 relative group">
                  {/* User Icon Button */}
                  <div className="w-10 h-10 rounded-full border-2 border-[#C7C0AE]/50 bg-white flex items-center justify-center cursor-pointer group-hover:border-[#FFA100] transition-all duration-200 shadow-sm overflow-hidden">
                    <span className="font-extrabold text-base text-[#FFA100]">
                      {(user?.name || user?.firstName || "U")[0].toUpperCase()}
                    </span>
                  </div>

                  {/* Dropdown Card */}
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#C7C0AE]/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                    
                    {/* User Info Header */}
                    <div className="bg-[#313131] px-5 py-4 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#FFA100] flex items-center justify-center shrink-0 shadow-md">
                        <span className="font-extrabold text-lg text-white">
                          {(user?.name || user?.firstName || "U")[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-bold text-sm truncate">
                          {user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User"}
                        </p>
                        <p className="text-white/50 text-[11px] font-medium mt-0.5 truncate">
                          {user?.phone ? `+91 ${user.phone}` : user?.email || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div className="px-5 py-3 border-b border-[#C7C0AE]/20 flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        user?.role === "admin"
                          ? "bg-[#FFA100]/15 text-[#FFA100] border border-[#FFA100]/30"
                          : "bg-[#94A692]/15 text-[#94A692] border border-[#94A692]/30"
                      }`}>
                        {user?.role === "admin" ? "⚡ Admin" : "✓ Member"}
                      </span>
                      {user?.role === "admin" && (
                        <a href="/admin" className="text-[11px] font-bold text-[#313131]/60 hover:text-[#FFA100] transition-colors ml-auto">
                          Admin Panel →
                        </a>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="p-2">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-sm font-semibold text-[#313131] border border-[#313131]/20 rounded-lg hover:border-[#FFA100] hover:text-[#FFA100] transition-all duration-200"
                >
                  Login
                </button>
              )
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-md text-[#313131] hover:text-[#FFA100] focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } bg-[#FAF1E6] border-t border-[#C7C0AE]/20`}
      >
        <div className="px-4 pt-3 pb-5 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? "text-[#FFA100] bg-[#FFA100]/10"
                    : "text-[#313131]/80 hover:text-[#FFA100] hover:bg-[#C7C0AE]/10"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 bg-[#FFA100] rounded-full" />
                )}
              </Link>
            );
          })}

          <div className="pt-4 pb-1 border-t border-[#C7C0AE]/20 flex flex-col gap-2">
            {!loading && (
              isLoggedIn ? (
                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#313131]">
                    <span className="material-symbols-outlined">person</span>
                    <span>Hi, {user?.name?.split(' ')[0] || 'User'}</span>
                  </div>
                  <button
                    onClick={() => { setIsOpen(false); logout(); }}
                    className="block text-center px-5 py-3 rounded-lg text-base font-semibold border border-[#313131]/20 text-[#313131] hover:border-red-500 hover:text-red-500 transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setIsOpen(false); onLoginClick?.(); }}
                  className="block text-center px-5 py-3 rounded-lg text-base font-semibold border border-[#313131]/20 text-[#313131] hover:border-[#FFA100] hover:text-[#FFA100] transition-all"
                >
                  Login
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
