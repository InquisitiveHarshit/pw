"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  createProperty,
  updateProperty,
  type Property,
} from "@/lib/api/properties";

type FormProps = {
  initial?: Property;
  mode: "create" | "edit";
};

const PROPERTY_TYPES = ["apartment", "villa", "plot", "commercial", "other"] as const;
const STATUSES = [
  { value: "open", label: "Open" },
  { value: "full", label: "Full" },
  { value: "closed", label: "Closed" },
] as const;

export const AMENITIES_OPTIONS = [
  "Swimming Pool",
  "Gymnasium",
  "Clubhouse",
  "24/7 Security",
  "Power Backup",
  "EV Charging",
  "Landscaped Gardens",
  "Jogging Track",
  "Parking",
  "Kids Play Area",
  "Lift / Elevator",
  "CCTV Surveillance",
  "Intercom",
  "Indoor Games Room",
  "Yoga / Meditation Area",
];

// Section wrapper
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#C7C0AE]/30 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-[#FAF1E6]/60 border-b border-[#C7C0AE]/20 flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <h3 className="font-extrabold text-[#313131] font-vietnam">{title}</h3>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

// Field wrapper
function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-black text-[#313131]/70 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[#313131]/40">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full px-4 py-2.5 bg-[#FAF1E6]/40 border border-[#C7C0AE]/40 rounded-xl text-sm text-[#313131] placeholder-[#313131]/30 focus:outline-none focus:border-[#FFA100] transition-colors";
const selectCls = `${inputCls} cursor-pointer`;
const textareaCls = `${inputCls} resize-none`;

// Reusable image upload slot component (safe to use hooks inside since it's a real component)
function ImageSlot({ label, hint, value, onChange }: { label: string; hint: string; value: string; onChange: (val: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const readFile = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  return (
    <div className="space-y-2">
      <p className="text-xs font-black text-[#313131]/70 uppercase tracking-wider">{label}</p>
      <p className="text-[11px] text-[#313131]/40">{hint}</p>
      <div
        onClick={() => inputRef.current?.click()}
        className="w-full h-36 rounded-xl border-2 border-dashed border-[#C7C0AE]/50 overflow-hidden bg-[#FAF1E6]/50 cursor-pointer hover:border-[#FFA100] hover:bg-[#FAF1E6] transition-all flex items-center justify-center relative group"
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <span className="text-white text-2xl">🔄</span>
              <span className="text-white text-[10px] font-bold">Click to change</span>
            </div>
          </>
        ) : (
          <div className="text-center text-[#313131]/40 p-4">
            <div className="text-3xl mb-1">🖼️</div>
            <p className="text-[10px] font-bold">Click to upload</p>
            <p className="text-[9px] mt-0.5">JPG, PNG, WEBP</p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) onChange(await readFile(file));
        }}
      />
      <input
        className={inputCls + " text-[11px]"}
        value={value.startsWith("data:") ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
      />
      {value && (
        <button type="button" onClick={() => onChange("")} className="text-[10px] text-red-400 hover:text-red-600 font-semibold">
          ✕ Remove image
        </button>
      )}
    </div>
  );
}

export default function PropertyForm({ initial, mode }: FormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Form State
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [propertyType, setPropertyType] = useState(initial?.type ?? "apartment");
  const [bhk, setBhk] = useState(initial?.bhk?.toString() ?? "");
  const [area, setArea] = useState(initial?.area?.toString() ?? "");
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities ?? []);
  const [totalSlots, setTotalSlots] = useState(initial?.totalSlots?.toString() ?? "10");
  const [filledSlots, setFilledSlots] = useState(initial?.filledSlots?.toString() ?? "0");
  const [status, setStatus] = useState(initial?.status ?? "open");
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [heroImage, setHeroImage] = useState(initial?.images?.[0] ?? "");
  const [image2, setImage2] = useState(initial?.images?.[1] ?? "");
  const [image3, setImage3] = useState(initial?.images?.[2] ?? "");
  const [brochureUrl, setBrochureUrl] = useState(initial?.brochureUrl ?? "");
  
  // New Configurable Fields
  const [developerName, setDeveloperName] = useState(initial?.developerName ?? "");
  const [aboutDeveloper, setAboutDeveloper] = useState(initial?.aboutDeveloper ?? "");
  const [sector, setSector] = useState(initial?.sector ?? "");
  const [possessionDate, setPossessionDate] = useState(
    initial?.possessionDate ? new Date(initial.possessionDate).toISOString().split('T')[0] : ""
  );
  const [locationHighlights, setLocationHighlights] = useState(initial?.locationHighlights ?? "");
  const [promotionalTag, setPromotionalTag] = useState(initial?.promotionalTag ?? "");

  const toggleAmenity = (a: string) => {
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  const brochureInputRef = useRef<HTMLInputElement>(null);
  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const validate = () => {
    if (!title.trim()) return "Title is required.";
    if (!description.trim()) return "Description is required.";
    if (!location.trim()) return "Location is required.";
    if (!price || Number(price) <= 0) return "Valid price is required.";
    if (!totalSlots || Number(totalSlots) < 1) return "Total slots must be at least 1.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setToast({ msg: error, type: "error" });
      setTimeout(() => setToast(null), 4000);
      return;
    }

    setSaving(true);
    const data: Partial<Property> = {
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      price: Number(price),
      type: propertyType,
      bhk: bhk ? Number(bhk) : undefined,
      area: area ? Number(area) : undefined,
      amenities,
      totalSlots: Number(totalSlots),
      filledSlots: Number(filledSlots),
      status: status as Property["status"],
      isFeatured,
      images: [heroImage, image2, image3].filter((img) => img.trim() !== ""),
      developerName: developerName.trim(),
      aboutDeveloper: aboutDeveloper.trim(),
      sector: sector.trim(),
      possessionDate: possessionDate,
      locationHighlights: locationHighlights.trim(),
      promotionalTag: promotionalTag.trim(),
      brochureUrl: brochureUrl.trim(),
    };

    try {
      if (mode === "create") {
        await createProperty(data);
      } else if (initial) {
        await updateProperty(initial._id, data);
      }
      setToast({ msg: mode === "create" ? "Property created!" : "Property updated!", type: "success" });
      setTimeout(() => router.push("/admin/properties"), 1200);
    } catch (err: any) {
      setToast({ msg: err.message || "Something went wrong.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold text-white ${
          toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
        }`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* Basic Info */}
      <Section title="Basic Information" icon="📋">
        <Field label="Property Title" required>
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Sunrise Heights — 3 BHK Apartments" />
        </Field>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Location" required>
            <input className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Sector 56, Gurugram" />
          </Field>
          <Field label="Price (₹)" required>
            <input className={inputCls} type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 8500000" />
          </Field>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Property Type" required>
            <select className={selectCls} value={propertyType} onChange={(e) => setPropertyType(e.target.value as "apartment" | "villa" | "plot" | "commercial" | "other")}>
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </Field>
          <Field label="BHK">
            <input className={inputCls} type="number" min="1" value={bhk} onChange={(e) => setBhk(e.target.value)} placeholder="e.g. 3" />
          </Field>
          <Field label="Area (sq ft)">
            <input className={inputCls} type="number" min="1" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. 1450" />
          </Field>
        </div>

        <Field label="Description" required>
          <textarea className={textareaCls} rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Full property description..." />
        </Field>
      </Section>

      {/* Additional Details */}
      <Section title="Additional Details" icon="📄">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Developer Name">
            <input className={inputCls} value={developerName} onChange={(e) => setDeveloperName(e.target.value)} placeholder="e.g. DLF, Godrej Properties" />
          </Field>
          <Field label="Sector / Micro-location">
            <input className={inputCls} value={sector} onChange={(e) => setSector(e.target.value)} placeholder="e.g. Sector 56, Electronic City" />
          </Field>
        </div>
        
        <Field label="About Developer">
          <textarea className={textareaCls} rows={2} value={aboutDeveloper} onChange={(e) => setAboutDeveloper(e.target.value)} placeholder="Brief description of the developer..." />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Possession Date">
            <input className={inputCls} type="date" value={possessionDate} onChange={(e) => setPossessionDate(e.target.value)} />
          </Field>
          <Field label="Promotional Tag" hint="e.g. Selling Fast, No Brokerage, Pre-launch">
            <input className={inputCls} value={promotionalTag} onChange={(e) => setPromotionalTag(e.target.value)} placeholder="e.g. Selling Fast" />
          </Field>
        </div>

        <Field label="Location Highlights" hint="Pipe (|) separated list of highlights. e.g. Near Mall | 5 mins from Metro">
          <input className={inputCls} value={locationHighlights} onChange={(e) => setLocationHighlights(e.target.value)} placeholder="Near Mall | 5 mins from Metro" />
        </Field>
      </Section>

      {/* Group Buying Settings */}
      <Section title="Group Buying Settings" icon="👥">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Total Slots" required hint="Maximum buyers allowed in this property's group">
            <input className={inputCls} type="number" min="1" value={totalSlots} onChange={(e) => setTotalSlots(e.target.value)} />
          </Field>
          <Field label="Filled Slots" hint="Buyers who have already joined">
            <input className={inputCls} type="number" min="0" value={filledSlots} onChange={(e) => setFilledSlots(e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* Media */}
      <Section title="Images & Media" icon="📸">
        <p className="text-xs text-[#313131]/50 -mt-1">Upload images or paste a URL. First image is the main hero shown on listing cards.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ImageSlot
            label="Hero Image (Main)"
            hint="Big left image on property page"
            value={heroImage}
            onChange={setHeroImage}
          />
          <ImageSlot
            label="Side Image 1"
            hint="Top-right thumbnail (video/exterior)"
            value={image2}
            onChange={setImage2}
          />
          <ImageSlot
            label="Side Image 2"
            hint="Bottom-right thumbnail (outdoors)"
            value={image3}
            onChange={setImage3}
          />
        </div>

        {/* Brochure */}
        <div className="mt-6 pt-6 border-t border-[#C7C0AE]/20">
          <p className="text-xs font-black text-[#313131]/70 uppercase tracking-wider mb-1">Brochure (PDF)</p>
          <p className="text-[11px] text-[#313131]/40 mb-3">Upload a PDF file or paste a URL. This will power the "Download Brochure" button on the property page.</p>
          <div className="flex items-center gap-4">
            <div
              onClick={() => brochureInputRef.current?.click()}
              className="flex items-center gap-3 px-5 py-3 bg-[#FAF1E6]/60 border-2 border-dashed border-[#C7C0AE]/50 rounded-xl cursor-pointer hover:border-[#FFA100] hover:bg-[#FAF1E6] transition-all shrink-0"
            >
              <span className="text-2xl">📄</span>
              <div>
                <p className="text-xs font-bold text-[#313131]">Upload PDF</p>
                <p className="text-[10px] text-[#313131]/50">
                  {brochureUrl ? (
                    <span className="text-emerald-600 font-semibold">✓ File selected</span>
                  ) : "Click to choose"}
                </p>
              </div>
            </div>
            <input
              ref={brochureInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) setBrochureUrl(await readFileAsDataUrl(file));
              }}
            />
            <div className="flex-1">
              <input
                className={inputCls}
                value={brochureUrl.startsWith("data:") ? "" : brochureUrl}
                onChange={(e) => setBrochureUrl(e.target.value)}
                placeholder="Or paste PDF URL (e.g. https://example.com/brochure.pdf)"
              />
              {brochureUrl && (
                <button type="button" onClick={() => setBrochureUrl("")} className="text-[10px] text-red-400 hover:text-red-600 font-semibold mt-1">
                  ✕ Remove brochure
                </button>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Amenities */}
      <Section title="Amenities" icon="🏊">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {AMENITIES_OPTIONS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer border ${
                amenities.includes(a)
                  ? "bg-[#313131] text-white border-[#313131] shadow-sm"
                  : "bg-[#FAF1E6]/40 text-[#313131]/70 border-[#C7C0AE]/40 hover:border-[#313131]/40"
              }`}
            >
              {amenities.includes(a) ? "✓ " : ""}{a}
            </button>
          ))}
        </div>
      </Section>

      {/* Admin Controls */}
      <Section title="Admin Controls & Visibility" icon="⚙️">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Status" required>
            <select className={selectCls} value={status} onChange={(e) => setStatus(e.target.value as "open" | "full" | "closed")}>
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          
          <div className="flex items-center justify-between p-4 bg-[#FAF1E6]/60 rounded-xl border border-[#C7C0AE]/20 mt-6">
            <div>
              <p className="text-sm font-bold text-[#313131]">⭐ Featured on Homepage</p>
              <p className="text-[11px] text-[#313131]/50 mt-0.5">Show this property in the homepage Featured grid</p>
            </div>
            <button
              type="button"
              onClick={() => setIsFeatured(!isFeatured)}
              className={`w-12 h-7 rounded-full transition-all duration-300 cursor-pointer relative shrink-0 ${
                isFeatured ? "bg-[#FFA100]" : "bg-[#C7C0AE]/40"
              }`}
            >
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${
                isFeatured ? "left-5" : "left-0.5"
              }`} />
            </button>
          </div>
        </div>
      </Section>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 bg-[#313131] hover:bg-[#FFA100] hover:text-[#313131] text-white font-extrabold text-sm rounded-xl transition-all duration-300 shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed font-vietnam"
        >
          {saving ? "Saving…" : mode === "create" ? "Create Property" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/properties")}
          className="px-6 py-3.5 border border-[#C7C0AE]/40 hover:bg-[#FAF1E6] text-[#313131] font-bold text-sm rounded-xl transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
