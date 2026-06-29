"use client";

import Link from "next/link";
import PropertyForm from "@/components/admin/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/properties"
          className="w-10 h-10 rounded-xl bg-white border border-[#C7C0AE]/40 flex items-center justify-center text-[#313131]/60 hover:text-[#313131] hover:bg-[#FAF1E6] transition-colors shadow-sm"
        >
          ←
        </Link>
        <div>
          <h2 className="text-2xl font-extrabold text-[#313131] font-vietnam">Add New Property</h2>
          <p className="text-sm text-[#313131]/50 mt-1">Fill out the details below to list a new property.</p>
        </div>
      </div>

      <PropertyForm mode="create" />
    </div>
  );
}
