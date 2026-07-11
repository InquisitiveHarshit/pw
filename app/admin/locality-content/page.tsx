"use client";

import { useEffect, useRef, useState } from "react";
import { getLocalities, updateLocality, type Locality } from "@/lib/api/localities";
import { getCloudinarySignature } from "@/lib/cloudinary";

async function uploadToCloudinary(file: File): Promise<string> {
  const { timestamp, signature, apiKey, cloudName } = await getCloudinarySignature();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload image");
  const data = await res.json();
  return data.secure_url;
}

export default function LocalityContentPage() {
  const [allLocalities, setAllLocalities] = useState<Locality[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // New Locality Form State
  const [selectedLocalityId, setSelectedLocalityId] = useState("");
  const [newImage, setNewImage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const newFileInputRef = useRef<HTMLInputElement>(null);

  // Per-locality state for those already on homepage: { [id]: { image, uploading, saving } }
  const [state, setState] = useState<
    Record<string, { image: string; uploading: boolean; saving: boolean }>
  >({});

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchLocalities = () => {
    getLocalities().then((res) => {
      if (res.success) {
        setAllLocalities(res.data);
        const init: Record<string, { image: string; uploading: boolean; saving: boolean }> = {};
        res.data.forEach((loc) => {
          if (loc.showOnHomepage) {
            init[loc._id] = { image: loc.image || "", uploading: false, saving: false };
          }
        });
        setState(init);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchLocalities();
  }, []);

  const homepageLocalities = allLocalities.filter((loc) => loc.showOnHomepage);
  const availableLocalities = allLocalities.filter((loc) => !loc.showOnHomepage);

  const filtered = homepageLocalities.filter(
    (loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      (loc.city || "").toLowerCase().includes(search.toLowerCase())
  );

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const setField = (id: string, field: string, value: string | boolean) => {
    setState((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleFileUpload = async (id: string, file: File) => {
    setField(id, "uploading", true);
    try {
      const url = await uploadToCloudinary(file);
      setField(id, "image", url);
    } catch {
      showToast("Failed to upload image.", "error");
    } finally {
      setField(id, "uploading", false);
    }
  };

  const handleNewFileUpload = async (file: File) => {
    try {
      const url = await uploadToCloudinary(file);
      setNewImage(url);
    } catch {
      showToast("Failed to upload image.", "error");
    }
  };

  const handleAddToHomepage = async () => {
    if (!selectedLocalityId) return showToast("Select a locality first", "error");
    
    setIsAdding(true);
    try {
      await updateLocality(selectedLocalityId, { showOnHomepage: true, image: newImage });
      showToast("Added to homepage!", "success");
      setSelectedLocalityId("");
      setNewImage("");
      fetchLocalities();
    } catch (err: any) {
      showToast(err.message || "Failed to add.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFromHomepage = async (id: string) => {
    if (!confirm("Remove this locality from the homepage?")) return;
    try {
      await updateLocality(id, { showOnHomepage: false });
      showToast("Removed from homepage!", "success");
      fetchLocalities();
    } catch (err: any) {
      showToast(err.message || "Failed to remove.", "error");
    }
  };

  const handleSave = async (id: string) => {
    setField(id, "saving", true);
    try {
      const image = state[id]?.image || "";
      await updateLocality(id, { image });
      setAllLocalities((prev) =>
        prev.map((loc) => (loc._id === id ? { ...loc, image } : loc))
      );
      showToast("Image saved!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save.", "error");
    } finally {
      setField(id, "saving", false);
    }
  };

  const inputCls =
    "w-full px-3 py-2 bg-[#FAF1E6]/40 border border-[#C7C0AE]/40 rounded-xl text-sm text-[#313131] placeholder-[#313131]/30 focus:outline-none focus:border-[#FFA100] transition-colors";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold text-white ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-extrabold text-[#313131] font-vietnam">
          Homepage Localities
        </h2>
        <p className="text-sm text-[#313131]/50 mt-1">
          Select which localities should appear on the homepage and manage their images.
        </p>
      </div>

      {/* Add New Locality to Homepage */}
      <div className="bg-white p-6 rounded-2xl border border-[#C7C0AE]/30 shadow-sm space-y-4">
        <h3 className="font-bold text-[#313131] text-lg">Add Locality to Homepage</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs font-black text-[#313131]/70 uppercase tracking-wider">Select Locality</label>
            <select
              className={inputCls + " cursor-pointer"}
              value={selectedLocalityId}
              onChange={(e) => setSelectedLocalityId(e.target.value)}
            >
              <option value="">-- Choose Locality --</option>
              {availableLocalities.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name} {loc.city ? `(${loc.city})` : ""}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-black text-[#313131]/70 uppercase tracking-wider">Image URL (Optional)</label>
            <div className="flex gap-2">
              <input
                className={inputCls}
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Paste URL or upload ->"
              />
              <button
                type="button"
                onClick={() => newFileInputRef.current?.click()}
                className="px-3 py-2 bg-[#FAF1E6] border border-[#C7C0AE]/40 rounded-xl hover:bg-[#FFA100] transition-colors"
                title="Upload Image"
              >
                📸
              </button>
              <input
                ref={newFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleNewFileUpload(file);
                  e.target.value = "";
                }}
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleAddToHomepage}
              disabled={isAdding || !selectedLocalityId}
              className="w-full px-6 py-2.5 bg-[#313131] text-white font-bold rounded-xl hover:bg-[#FFA100] hover:text-[#313131] transition-colors disabled:opacity-50"
            >
              {isAdding ? "Adding..." : "+ Add to Homepage"}
            </button>
          </div>
        </div>
      </div>

      <hr className="border-[#C7C0AE]/30" />

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#C7C0AE]/30 shadow-sm">
        <input
          className={inputCls}
          placeholder="Search homepage localities…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#313131]/40 font-medium">
          Loading localities…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[#313131]/40 font-medium">
          No localities explicitly added to the homepage yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((loc) => {
            const s = state[loc._id] || { image: "", uploading: false, saving: false };
            const changed = s.image !== (loc.image || "");

            return (
              <div
                key={loc._id}
                className="bg-white rounded-2xl border border-[#C7C0AE]/30 shadow-sm overflow-hidden"
              >
                {/* Image preview / upload zone */}
                <div
                  onClick={() =>
                    !s.uploading && fileRefs.current[loc._id]?.click()
                  }
                  className="relative h-44 bg-[#FAF1E6] cursor-pointer group overflow-hidden"
                >
                  {s.image ? (
                    <>
                      <img
                        src={s.image}
                        alt={loc.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-bold bg-black/40 px-3 py-1.5 rounded-full">
                          🔄 Change Image
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-[#313131]/30">
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <span className="text-xs font-bold">Click to upload image</span>
                    </div>
                  )}
                  {s.uploading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#FFA100] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <input
                  ref={(el) => {
                    fileRefs.current[loc._id] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(loc._id, file);
                    e.target.value = "";
                  }}
                />

                {/* Info + URL input */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-[#313131]">{loc.name}</p>
                      <p className="text-xs text-[#313131]/50">
                        {[loc.city, loc.state].filter(Boolean).join(", ")}
                        {loc.activeGroups
                          ? ` · ${loc.activeGroups} active groups`
                          : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromHomepage(loc._id)}
                      className="text-[10px] text-red-500 hover:text-red-700 font-bold px-2 py-1 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                    >
                      Remove from Homepage
                    </button>
                  </div>

                  <input
                    className={inputCls + " text-[11px]"}
                    value={s.image}
                    onChange={(e) => setField(loc._id, "image", e.target.value)}
                    placeholder="Or paste image URL directly"
                  />

                  <div className="flex gap-2">
                    {s.image && (
                      <button
                        type="button"
                        onClick={() => setField(loc._id, "image", "")}
                        className="text-[11px] text-red-400 hover:text-red-600 font-semibold"
                      >
                        ✕ Remove
                      </button>
                    )}
                    <button
                      onClick={() => handleSave(loc._id)}
                      disabled={s.saving || s.uploading || !changed}
                      className="ml-auto px-4 py-1.5 bg-[#313131] text-white text-xs font-bold rounded-xl hover:bg-[#FFA100] hover:text-[#313131] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {s.saving ? "Saving…" : "Save Image"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
