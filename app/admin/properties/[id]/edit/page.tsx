"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyForm from "@/components/admin/PropertyForm";
import { getProperty, type Property } from "@/lib/api/properties";

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      if (typeof id !== "string") return;
      try {
        const res = await getProperty(id);
        setProperty(res.data);
      } catch {
        setError("Property not found.");
        setTimeout(() => router.push("/admin/properties"), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#C7C0AE]/30 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 font-semibold">
        ⚠️ {error} Redirecting…
      </div>
    );
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
          <p className="text-sm text-[#313131]/50 mt-1">
            Editing: <span className="font-bold text-[#313131]">{property.title}</span>
          </p>
        </div>
      </div>

      <PropertyForm mode="edit" initial={property} />
    </div>
  );
}
