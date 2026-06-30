"use client";

import { useEffect, useState, Fragment } from "react";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  joinedGroups: { _id: string; property?: { title?: string }; status: string }[];
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  // New User State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: "", email: "", password: "", phone: "", role: "admin" });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  const getHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("pw_token") : null;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${BASE}/users?limit=100`, { headers: getHeaders() });
        const data = await res.json();
        setUsers(data.data || []);
        setTotal(data.total || 0);
      } catch {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    try {
      const res = await fetch(`${BASE}/users`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newUserData),
      });
      const data = await res.json();
      if (!data.success) {
        setAddError(data.message || "Failed to create user.");
      } else {
        setShowAddModal(false);
        setNewUserData({ name: "", email: "", password: "", phone: "", role: "admin" });
        // Automatically add to list
        setUsers(prev => [data.data, ...prev]);
        setTotal(prev => prev + 1);
      }
    } catch (err) {
      setAddError("An error occurred while creating the user.");
    } finally {
      setAddLoading(false);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#313131] font-vietnam">Registered Users</h2>
          <p className="text-sm text-[#313131]/50 mt-1">{total} user{total !== 1 ? "s" : ""} on the platform</p>
        </div>
        {/* Search */}
        <div className="relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#313131]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="pl-9 pr-4 py-2.5 border border-[#C7C0AE]/50 rounded-xl text-sm focus:outline-none focus:border-[#FFA100] transition-colors w-64"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#FFA100] hover:bg-[#FF8C00] text-white text-sm font-bold rounded-xl transition-colors"
        >
          + Add User/Admin
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-semibold text-red-600">⚠️ {error}</div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#C7C0AE]/30 h-16 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#C7C0AE]/30 p-12 text-center">
          <p className="text-4xl mb-3">👤</p>
          <p className="font-bold text-[#313131]">{search ? "No users match your search" : "No users yet"}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#C7C0AE]/30 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF1E6]/60">
              <tr>
                {["User", "Email", "Phone", "Role", "Groups Joined", "Registered", "Details"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-[#313131]/50 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C7C0AE]/10">
              {filtered.map((user) => (
                <Fragment key={user._id}>
                  <tr key={user._id} className="hover:bg-[#FAF1E6]/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FFA100]/20 flex items-center justify-center text-sm font-extrabold text-[#FFA100]">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-[#313131]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#313131]/60">{user.email}</td>
                    <td className="px-5 py-4 text-[#313131]/60">{user.phone || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        user.role === "admin"
                          ? "bg-[#FFA100]/20 text-[#FFA100]"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#313131]/60 text-center">
                      {user.joinedGroups?.length || 0}
                    </td>
                    <td className="px-5 py-4 text-[#313131]/40 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      {(user.joinedGroups?.length || 0) > 0 && (
                        <button
                          onClick={() => setExpanded(expanded === user._id ? null : user._id)}
                          className="text-xs font-bold text-[#FFA100] hover:underline"
                        >
                          {expanded === user._id ? "Hide ▲" : "Groups ▼"}
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Expanded group details */}
                  {expanded === user._id && (
                    <tr key={`${user._id}-expanded`}>
                      <td colSpan={7} className="px-5 pb-4 pt-0 bg-[#FAF1E6]/30">
                        <div className="ml-11">
                          <p className="text-xs font-bold text-[#313131]/50 uppercase tracking-wider mb-2">Group Memberships</p>
                          <div className="space-y-1.5">
                            {user.joinedGroups?.map((g) => (
                              <div key={g._id} className="flex items-center gap-3 text-sm">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  g.status === "complete" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                }`}>
                                  {g.status}
                                </span>
                                <span className="text-[#313131]/70">{g.property?.title || g._id}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
      
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-[#C7C0AE]/30 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-[#313131]/40 hover:text-[#313131] transition-colors"
            >
              ✕
            </button>
            <h3 className="text-xl font-extrabold text-[#313131] mb-5 font-vietnam">Add New User</h3>
            {addError && (
              <div className="mb-4 bg-red-50 text-red-600 text-sm font-semibold p-3 rounded-xl border border-red-200">
                ⚠️ {addError}
              </div>
            )}
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#313131]/60 uppercase tracking-wider mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#C7C0AE]/50 text-sm focus:outline-none focus:border-[#FFA100] transition-colors"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#313131]/60 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#C7C0AE]/50 text-sm focus:outline-none focus:border-[#FFA100] transition-colors"
                  placeholder="e.g. rahul@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#313131]/60 uppercase tracking-wider mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#C7C0AE]/50 text-sm focus:outline-none focus:border-[#FFA100] transition-colors"
                  placeholder="Min 6 characters"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#313131]/60 uppercase tracking-wider mb-1.5">Phone (Optional)</label>
                <input
                  type="text"
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#C7C0AE]/50 text-sm focus:outline-none focus:border-[#FFA100] transition-colors"
                  placeholder="e.g. +91 9998887776"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#313131]/60 uppercase tracking-wider mb-1.5">Role</label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#C7C0AE]/50 text-sm focus:outline-none focus:border-[#FFA100] transition-colors bg-white"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={addLoading}
                  className="w-full py-3 bg-[#FFA100] hover:bg-[#FF8C00] text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addLoading ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
