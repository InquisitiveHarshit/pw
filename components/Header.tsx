"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF1E6]/80 backdrop-blur-md border-b border-[#C7C0AE]/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
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

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-[#313131]/80 hover:text-[#FFA100] transition-colors duration-200">
              How it Works
            </a>
            <a href="#active-groups" className="text-sm font-medium text-[#313131]/80 hover:text-[#FFA100] transition-colors duration-200">
              Active Groups
            </a>
            <a href="#projects" className="text-sm font-medium text-[#313131]/80 hover:text-[#FFA100] transition-colors duration-200">
              Featured Projects
            </a>
            <a href="#faq" className="text-sm font-medium text-[#313131]/80 hover:text-[#FFA100] transition-colors duration-200">
              FAQ
            </a>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <a
              href="#join"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#313131] text-white hover:bg-[#FFA100] hover:text-[#313131] transition-all duration-300 shadow-sm cursor-pointer"
            >
              Start a Group
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-[#313131] hover:text-[#FFA100] focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 width-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 width-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#FAF1E6] border-b border-[#C7C0AE]/20" id="mobile-menu">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <a
              href="#how-it-works"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-[#313131]/80 hover:text-[#FFA100] hover:bg-[#C7C0AE]/10 transition-colors"
            >
              How it Works
            </a>
            <a
              href="#active-groups"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-[#313131]/80 hover:text-[#FFA100] hover:bg-[#C7C0AE]/10 transition-colors"
            >
              Active Groups
            </a>
            <a
              href="#projects"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-[#313131]/80 hover:text-[#FFA100] hover:bg-[#C7C0AE]/10 transition-colors"
            >
              Featured Projects
            </a>
            <a
              href="#faq"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-[#313131]/80 hover:text-[#FFA100] hover:bg-[#C7C0AE]/10 transition-colors"
            >
              FAQ
            </a>
            <div className="pt-4 pb-2 border-t border-[#C7C0AE]/20">
              <a
                href="#join"
                onClick={() => setIsOpen(false)}
                className="block text-center w-full px-5 py-3 rounded-lg text-base font-semibold bg-[#313131] text-white hover:bg-[#FFA100] hover:text-[#313131] transition-all"
              >
                Start a Group
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
