"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#313131] text-white border-t border-[#C7C0AE]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Logo & Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center">
              <Image 
                src="/header1-logo.png" 
                alt="Properties Wallah Logo" 
                width={250} 
                height={100} 
                className="h-24 w-auto"
              />
            </div>
            
            <p className="text-[#C7C0AE] text-sm max-w-sm leading-relaxed">
              India&apos;s pioneering group-buying platform for residential and commercial real estate. Buy together, unlock developer bulk discounts, and keep 100% of the savings.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              {["twitter", "facebook", "instagram", "linkedin"].map((platform) => (
                <a
                  key={platform}
                  href={`#${platform}`}
                  className="w-10 h-10 rounded-lg bg-[#FAF1E6]/5 border border-[#C7C0AE]/20 flex items-center justify-center text-[#C7C0AE] hover:text-[#FFA100] hover:bg-[#FAF1E6]/10 hover:border-[#FFA100]/30 transition-all duration-300"
                  aria-label={`Follow us on ${platform}`}
                >
                  <span className="sr-only">{platform}</span>
                  <div className="capitalize text-xs font-semibold">{platform.slice(0, 2)}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-[#FFA100] uppercase font-vietnam">Platform</h3>
            <ul className="space-y-2 text-sm text-[#C7C0AE]">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
              </li>
              <li>
                <a href="#active-groups" className="hover:text-white transition-colors">Active Groups</a>
              </li>
              <li>
                <a href="#projects" className="hover:text-white transition-colors">Featured Projects</a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-white transition-colors">Savings Calculator</a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-[#FFA100] uppercase font-vietnam">Resources</h3>
            <ul className="space-y-2 text-sm text-[#C7C0AE]">
              <li>
                <a href="#blog" className="hover:text-white transition-colors">Real Estate Blog</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">FAQ & Support</a>
              </li>
              <li>
                <a href="#developer" className="hover:text-white transition-colors">For Developers</a>
              </li>
              <li>
                <a href="#legal" className="hover:text-white transition-colors">Indian RERA Guides</a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-[#FFA100] uppercase font-vietnam">Stay Updated</h3>
            <p className="text-[#C7C0AE] text-sm leading-relaxed">
              Get notified when new group buys start in your target city. No spam, only direct real estate deals.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full bg-[#FAF1E6]/5 border border-[#C7C0AE]/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#C7C0AE]/50 focus:outline-none focus:border-[#FFA100] transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#FFA100] hover:bg-[#ffa100]/90 text-[#313131] font-semibold py-2.5 px-4 rounded-lg text-sm transition-all duration-300 shadow-sm cursor-pointer"
              >
                {subscribed ? "Subscribed! ✓" : "Subscribe to Alerts"}
              </button>
            </form>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-16 pt-8 border-t border-[#C7C0AE]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#C7C0AE]">
            &copy; {new Date().getFullYear()} Properties Wallah. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-[#C7C0AE]">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#rera" className="hover:text-white transition-colors">RERA Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
