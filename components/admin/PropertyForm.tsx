"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  saveProperty,
  updateProperty,
  AMENITIES_OPTIONS,
  type Property,
  type Configuration,
} from "@/lib/propertyStore";

type FormProps = {
  initial?: Property;
  mode: "create" | "edit";
};

const EMPTY_CONFIG: Configuration = { type: "", carpetArea: "", startingPrice: "" };

const PROPERTY_TYPES = ["Apartment", "Villa", "Plot"] as const;
const STATUSES = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "soldOut", label: "Sold Out" },
] as const;

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

// Input styles
const inputCls = "w-full px-4 py-2.5 bg-[#FAF1E6]/40 border border-[#C7C0AE]/40 rounded-xl text-sm text-[#313131] placeholder-[#313131]/30 focus:outline-none focus:border-[#FFA100] transition-colors";
const selectCls = `${inputCls} cursor-pointer`;
const textareaCls = `${inputCls} resize-none`;

export default function PropertyForm({ initial, mode }: FormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  // ── Form State ──────────────────────────────────────────
  const [projectName, setProjectName] = useState(initial?.projectName ?? "");
  const [developerName, setDeveloperName] = useState(initial?.developerName ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [sector, setSector] = useState(initial?.sector ?? "");
  const [area, setArea] = useState(initial?.area ?? "");
  const [mapsLink, setMapsLink] = useState(initial?.mapsLink ?? "");
  const [reraNumber, setReraNumber] = useState(initial?.reraNumber ?? "");
  const [propertyType, setPropertyType] = useState<Property["propertyType"]>(initial?.propertyType ?? "Apartment");
  const [configs, setConfigs] = useState<Configuration[]>(
    initial?.configurations?.length ? initial.configurations : [{ ...EMPTY_CONFIG }]
  );
  const [possessionDate, setPossessionDate] = useState(initial?.possessionDate ?? "");
  const [totalUnits, setTotalUnits] = useState(initial?.totalUnits?.toString() ?? "");
  const [floors, setFloors] = useState(initial?.floors?.toString() ?? "");
  const [groupSlots, setGroupSlots] = useState(initial?.groupSlots?.toString() ?? "");
  const [slotsFilled, setSlotsFilled] = useState(initial?.slotsFilled?.toString() ?? "0");
  const [membershipFee, setMembershipFee] = useState(initial?.membershipFee?.toString() ?? "");
  const [heroImage, setHeroImage] = useState(initial?.heroImage ?? "");
  const [heroPreview, setHeroPreview] = useState(initial?.heroImage ?? "");
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities ?? []);
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [aboutDeveloper, setAboutDeveloper] = useState(initial?.aboutDeveloper ?? "");
  const [locationHighlights, setLocationHighlights] = useState(initial?.locationHighlights ?? "");
  const [status, setStatus] = useState<Property["status"]>(initial?.status ?? "active");
  const [isBestPrice, setIsBestPrice] = useState(initial?.isBestPrice ?? false);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [promotionalTag, setPromotionalTag] = useState(initial?.promotionalTag ?? "");

  // ── Configuration Helpers ────────────────────────────────
  const updateConfig = (index: number, field: keyof Configuration, value: string) => {
    setConfigs((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };
  const addConfig = () => setConfigs((prev) => [...prev, { ...EMPTY_CONFIG }]);
  const removeConfig = (index: number) => setConfigs((prev) => prev.filter((_, i) => i !== index));

  // ── Image Upload ─────────────────────────────────────────
  const handleHeroImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setHeroImage(result);
      setHeroPreview(result);
    };
    reader.readAsDataURL(file);
  };

  // ── Amenities Toggle ─────────────────────────────────────
  const toggleAmenity = (a: string) => {
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  // ── Validation ───────────────────────────────────────────
  const validate = () => {
    if (!projectName.trim()) return "Project name is required.";
    if (!developerName.trim()) return "Developer name is required.";
    if (!city.trim()) return "City is required.";
    if (!reraNumber.trim()) return "RERA number is required.";
    if (configs.some((c) => !c.type.trim() || !c.startingPrice.trim())) return "All configurations need a type and starting price.";
    if (!groupSlots || Number(groupSlots) < 1) return "Group slots must be at least 1.";
    if (!membershipFee || Number(membershipFee) < 0) return "Membership fee is required.";
    return null;
  };

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setToast({ msg: error, type: "error" });
      setTimeout(() => setToast(null), 4000);
      return;
    }

    setSaving(true);
    const data = {
      projectName: projectName.trim(),
      developerName: developerName.trim(),
      city: city.trim(),
      sector: sector.trim(),
      area: area.trim(),
      mapsLink: mapsLink.trim(),
      reraNumber: reraNumber.trim(),
      propertyType,
      configurations: configs.filter((c) => c.type.trim()),
      possessionDate,
      totalUnits: Number(totalUnits) || 0,
      floors: Number(floors) || 0,
      groupSlots: Number(groupSlots),
      slotsFilled: Number(slotsFilled) || 0,
      membershipFee: Number(membershipFee),
      heroImage: heroImage || "/property_villa.png",
      gallery: heroImage ? [heroImage] : ["/property_villa.png"],
      amenities,
      tagline: tagline.trim(),
      description: description.trim(),
      aboutDeveloper: aboutDeveloper.trim(),
      locationHighlights: locationHighlights.trim(),
      status,
      isBestPrice,
      isFeatured,
      promotionalTag: promotionalTag.trim(),
    };

    try {
      if (mode === "create") {
        saveProperty(data);
      } else if (initial) {
        updateProperty(initial.id, data);
      }
      setToast({ msg: mode === "create" ? "Property created!" : "Property updated!", type: "success" });
      setTimeout(() => router.push("/admin/properties"), 1200);
    } catch {
      setToast({ msg: "Something went wrong. Please try again.", type: "error" });
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

      {/* ── 1. Basic Info ── */}
      <Section title="Basic Information" icon="📋">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Project Name" required>
            <input className={inputCls} value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. County Presidentia" />
          </Field>
          <Field label="Developer / Builder Name" required>
            <input className={inputCls} value={developerName} onChange={(e) => setDeveloperName(e.target.value)} placeholder="e.g. County Group" />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="City" required>
            <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Noida" />
          </Field>
          <Field label="Sector / Sub-Area">
            <input className={inputCls} value={sector} onChange={(e) => setSector(e.target.value)} placeholder="e.g. Sector 102" />
          </Field>
          <Field label="Area / State">
            <input className={inputCls} value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Uttar Pradesh" />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Google Maps Link">
            <input className={inputCls} type="url" value={mapsLink} onChange={(e) => setMapsLink(e.target.value)} placeholder="https://maps.google.com/..." />
          </Field>
          <Field label="RERA Number" required>
            <input className={inputCls} value={reraNumber} onChange={(e) => setReraNumber(e.target.value)} placeholder="e.g. UPRERAPRJ12345" />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <Field label="Property Type" required>
            <select className={selectCls} value={propertyType} onChange={(e) => setPropertyType(e.target.value as Property["propertyType"])}>
              {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Possession Date">
            <input className={inputCls} type="date" value={possessionDate} onChange={(e) => setPossessionDate(e.target.value)} />
          </Field>
          <Field label="Total Units">
            <input className={inputCls} type="number" min="1" value={totalUnits} onChange={(e) => setTotalUnits(e.target.value)} placeholder="e.g. 480" />
          </Field>
          <Field label="Floors">
            <input className={inputCls} type="number" min="1" value={floors} onChange={(e) => setFloors(e.target.value)} placeholder="e.g. 32" />
          </Field>
        </div>
      </Section>

      {/* ── 2. Configurations (Pricing) ── */}
      <Section title="Configurations & Pricing" icon="💰">
        <div className="space-y-3">
          {configs.map((config, i) => (
            <div key={i} className="flex items-end gap-3 p-4 bg-[#FAF1E6]/40 rounded-xl border border-[#C7C0AE]/20">
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-black text-[#313131]/60 uppercase tracking-wider mb-1.5">
                  Type <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputCls}
                  value={config.type}
                  onChange={(e) => updateConfig(i, "type", e.target.value)}
                  placeholder="e.g. 2BHK"
                />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-black text-[#313131]/60 uppercase tracking-wider mb-1.5">Carpet Area</label>
                <input
                  className={inputCls}
                  value={config.carpetArea}
                  onChange={(e) => updateConfig(i, "carpetArea", e.target.value)}
                  placeholder="e.g. 1288 sqft"
                />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-black text-[#313131]/60 uppercase tracking-wider mb-1.5">
                  Starting Price <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputCls}
                  value={config.startingPrice}
                  onChange={(e) => updateConfig(i, "startingPrice", e.target.value)}
                  placeholder="e.g. ₹2.52 Cr"
                />
              </div>
              {configs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeConfig(i)}
                  className="shrink-0 w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer mb-0.5"
                  title="Remove configuration"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addConfig}
          className="w-full py-2.5 border-2 border-dashed border-[#C7C0AE]/60 hover:border-[#FFA100] hover:text-[#FFA100] text-[#313131]/50 text-sm font-bold rounded-xl transition-all cursor-pointer"
        >
          + Add Configuration
        </button>
      </Section>

      {/* ── 3. Group Buying ── */}
      <Section title="Group Buying Settings" icon="👥">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Max Group Slots" required hint="Maximum number of buyers allowed in this group">
            <input className={inputCls} type="number" min="1" value={groupSlots} onChange={(e) => setGroupSlots(e.target.value)} placeholder="e.g. 10" />
          </Field>
          <Field label="Slots Filled (Current)" hint="Number of buyers who have already joined">
            <input className={inputCls} type="number" min="0" value={slotsFilled} onChange={(e) => setSlotsFilled(e.target.value)} placeholder="e.g. 4" />
          </Field>
          <Field label="Membership Fee (₹)" required hint="Amount charged to join this group">
            <input className={inputCls} type="number" min="0" value={membershipFee} onChange={(e) => setMembershipFee(e.target.value)} placeholder="e.g. 5000" />
          </Field>
        </div>
      </Section>

      {/* ── 4. Media ── */}
      <Section title="Images & Media" icon="📸">
        <Field label="Hero Image" hint="This is the main image shown on listing cards and the property detail page">
          <div className="flex items-start gap-5">
            <div
              className="w-40 h-32 rounded-xl border-2 border-dashed border-[#C7C0AE]/50 overflow-hidden bg-[#FAF1E6]/50 cursor-pointer hover:border-[#FFA100] transition-colors flex items-center justify-center shrink-0"
              onClick={() => heroInputRef.current?.click()}
            >
              {heroPreview ? (
                <img src={heroPreview} alt="Hero preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-[#313131]/40">
                  <div className="text-3xl mb-1">🖼️</div>
                  <p className="text-[10px] font-bold">Click to upload</p>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <button
                type="button"
                onClick={() => heroInputRef.current?.click()}
                className="px-4 py-2 bg-[#313131] hover:bg-[#FFA100] hover:text-[#313131] text-white text-sm font-bold rounded-lg transition-all cursor-pointer"
              >
                Choose Image
              </button>
              <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroImage} />
              <p className="text-xs text-[#313131]/40">Or enter an image URL below:</p>
              <input
                className={inputCls}
                value={heroImage.startsWith("data:") ? "" : heroImage}
                onChange={(e) => { setHeroImage(e.target.value); setHeroPreview(e.target.value); }}
                placeholder="/property_villa.png or https://..."
              />
            </div>
          </div>
        </Field>
      </Section>

      {/* ── 5. Details ── */}
      <Section title="Property Details" icon="📝">
        <Field label="Short Tagline" hint="Shown on listing cards. Max 100 characters.">
          <input className={inputCls} value={tagline} maxLength={100} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. Premium living in the heart of Noida" />
        </Field>
        <Field label="Project Description">
          <textarea className={textareaCls} rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Full project description shown on the property detail page..." />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="About Developer">
            <textarea className={textareaCls} rows={3} value={aboutDeveloper} onChange={(e) => setAboutDeveloper(e.target.value)} placeholder="Brief paragraph about the developer and their track record..." />
          </Field>
          <Field label="Location Highlights">
            <textarea className={textareaCls} rows={3} value={locationHighlights} onChange={(e) => setLocationHighlights(e.target.value)} placeholder="e.g. 2 min from Metro | 5 min from Expressway | Near DPS School" />
          </Field>
        </div>
      </Section>

      {/* ── 6. Amenities ── */}
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

      {/* ── 7. Admin Controls ── */}
      <Section title="Admin Controls & Visibility" icon="⚙️">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Status" required>
            <select className={selectCls} value={status} onChange={(e) => setStatus(e.target.value as Property["status"])}>
              {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Promotional Tag" hint='e.g. "Selling Fast", "Limited Units", "New Launch"'>
            <input className={inputCls} value={promotionalTag} onChange={(e) => setPromotionalTag(e.target.value)} placeholder="e.g. Selling Fast" />
          </Field>
        </div>

        {/* Toggle Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Best Price Badge */}
          <div className="flex items-center justify-between p-4 bg-[#FAF1E6]/60 rounded-xl border border-[#C7C0AE]/20">
            <div>
              <p className="text-sm font-bold text-[#313131]">🏷️ Best Price Badge</p>
              <p className="text-[11px] text-[#313131]/50 mt-0.5">Show a "Best Price" badge on the listing card</p>
            </div>
            <button
              type="button"
              onClick={() => setIsBestPrice(!isBestPrice)}
              className={`w-12 h-7 rounded-full transition-all duration-300 cursor-pointer relative shrink-0 ${
                isBestPrice ? "bg-[#94A692]" : "bg-[#C7C0AE]/40"
              }`}
            >
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${
                isBestPrice ? "left-5" : "left-0.5"
              }`} />
            </button>
          </div>

          {/* Featured */}
          <div className="flex items-center justify-between p-4 bg-[#FAF1E6]/60 rounded-xl border border-[#C7C0AE]/20">
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

      {/* ── Submit ── */}
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
        {mode === "edit" && (
          <p className="text-xs text-[#313131]/40 ml-auto">Changes are saved to browser storage (Phase 1)</p>
        )}
      </div>
    </form>
  );
}
