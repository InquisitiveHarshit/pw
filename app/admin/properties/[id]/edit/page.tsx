"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyForm from "@/components/admin/PropertyForm";
import { getPropertyById, type Property } from "@/lib/propertyStore";

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id === "string") {
      const p = getPropertyById(id);
      if (p) {
        setProperty(p);
      } else {
        router.push("/admin/properties"); // Redirect if not found
      }
    }
    setLoading(false);
  }, [id, router]);

  if (loading) {
    return <div className="p-8 text-center text-[#313131]/50 font-semibold animate-pulse">Loading property data...</div>;
  }

  if (!property) return null;

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
          <h2 className="text-2xl font-extrabold text-[#313131] font-vietnam">Edit Property</h2>
          <p className="text-sm text-[#313131]/50 mt-1">Editing details for: <span className="font-bold text-[#313131]">{property.projectName}</span></p>
        </div>
      </div>
      
      <PropertyForm mode="edit" initial={property} />
    </div>
  );
}
