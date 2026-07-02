"use client";

import { useEffect, useState } from "react";
import { getLocalities, createLocality, deleteLocality, type Locality } from "@/lib/api/localities";

export default function AdminLocalitiesPage() {
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [activeProjects, setActiveProjects] = useState("");
  const [activeGroups, setActiveGroups] = useState("");

  const fetchLocalities = async () => {
    try {
      const res = await getLocalities();
      if (res.success) {
        setLocalities(res.data);
      } else {
        setError("Failed to fetch localities.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalities();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      const res = await createLocality({
        name: name.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        activeProjects: activeProjects ? Number(activeProjects) : 0,
        activeGroups: activeGroups ? Number(activeGroups) : 0,
      });
      if (res.success) {
        setName("");
        setCity("");
        setState("");
        setPincode("");
        setActiveProjects("");
        setActiveGroups("");
        fetchLocalities();
      }
    } catch (err: any) {
      setError(err.message || "Failed to create locality");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this locality?")) return;
    try {
      await deleteLocality(id);
      fetchLocalities();
    } catch (err: any) {
      setError(err.message || "Failed to delete locality");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#313131] font-vietnam">Manage Localities</h2>
          <p className="text-sm text-[#313131]/50 mt-1">Add and manage localities for properties.</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl font-medium">{error}</div>}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#C7C0AE]/30">
        <h3 className="font-bold text-[#313131] mb-4 text-lg">Add New Locality</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-black text-[#313131]/70 uppercase tracking-wider">Locality Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sector 56, Gurugram"
              className="w-full px-4 py-2.5 bg-[#FAF1E6]/40 border border-[#C7C0AE]/40 rounded-xl text-sm text-[#313131] placeholder-[#313131]/30 focus:outline-none focus:border-[#FFA100] transition-colors"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black text-[#313131]/70 uppercase tracking-wider">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Gurugram"
              className="w-full px-4 py-2.5 bg-[#FAF1E6]/40 border border-[#C7C0AE]/40 rounded-xl text-sm text-[#313131] placeholder-[#313131]/30 focus:outline-none focus:border-[#FFA100] transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black text-[#313131]/70 uppercase tracking-wider">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Haryana"
              className="w-full px-4 py-2.5 bg-[#FAF1E6]/40 border border-[#C7C0AE]/40 rounded-xl text-sm text-[#313131] placeholder-[#313131]/30 focus:outline-none focus:border-[#FFA100] transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black text-[#313131]/70 uppercase tracking-wider">Pincode</label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="e.g. 122011"
              className="w-full px-4 py-2.5 bg-[#FAF1E6]/40 border border-[#C7C0AE]/40 rounded-xl text-sm text-[#313131] placeholder-[#313131]/30 focus:outline-none focus:border-[#FFA100] transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black text-[#313131]/70 uppercase tracking-wider">Active Projects</label>
            <input
              type="number"
              value={activeProjects}
              onChange={(e) => setActiveProjects(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2.5 bg-[#FAF1E6]/40 border border-[#C7C0AE]/40 rounded-xl text-sm text-[#313131] placeholder-[#313131]/30 focus:outline-none focus:border-[#FFA100] transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black text-[#313131]/70 uppercase tracking-wider">Active Groups</label>
            <input
              type="number"
              value={activeGroups}
              onChange={(e) => setActiveGroups(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2.5 bg-[#FAF1E6]/40 border border-[#C7C0AE]/40 rounded-xl text-sm text-[#313131] placeholder-[#313131]/30 focus:outline-none focus:border-[#FFA100] transition-colors"
            />
          </div>
          <div className="md:col-span-4 mt-2">
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2.5 bg-[#313131] text-white font-bold rounded-xl hover:bg-[#FFA100] hover:text-[#313131] transition-colors disabled:opacity-50"
            >
              {creating ? "Adding..." : "Add Locality"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#C7C0AE]/30 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#313131]/50">Loading localities...</div>
        ) : localities.length === 0 ? (
          <div className="p-8 text-center text-[#313131]/50">No localities found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF1E6]/60 border-b border-[#C7C0AE]/20">
                  <th className="px-6 py-4 text-xs font-black text-[#313131]/70 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-black text-[#313131]/70 uppercase tracking-wider">City/State/Pin</th>
                  <th className="px-6 py-4 text-xs font-black text-[#313131]/70 uppercase tracking-wider">Active Projects</th>
                  <th className="px-6 py-4 text-xs font-black text-[#313131]/70 uppercase tracking-wider">Active Groups</th>
                  <th className="px-6 py-4 text-xs font-black text-[#313131]/70 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {localities.map((loc) => (
                  <tr key={loc._id} className="border-b border-[#C7C0AE]/10 hover:bg-[#FAF1E6]/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#313131]">{loc.name}</td>
                    <td className="px-6 py-4 text-sm text-[#313131]/70">
                      {loc.city && <span>{loc.city}, </span>}
                      {loc.state && <span>{loc.state} </span>}
                      {loc.pincode && <span>{loc.pincode}</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#313131]/70">{loc.activeProjects}</td>
                    <td className="px-6 py-4 text-sm text-[#313131]/70">{loc.activeGroups}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(loc._id)}
                        className="text-red-500 hover:text-red-700 font-bold text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
