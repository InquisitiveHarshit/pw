"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginFlow from "@/components/auth/LoginFlow";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      {!isAdminRoute && <Header onLoginClick={() => setShowLoginModal(true)} />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminRoute && <Footer />}

      <LoginFlow isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
