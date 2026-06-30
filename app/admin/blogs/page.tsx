"use client";

import { useEffect, useState } from "react";
import GoogleDocsPasteModal from "@/components/admin/GoogleDocsPasteModal";
import { parseGoogleDocsHtml } from "@/lib/utils/htmlParser";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Blog = {
  _id: string;
  title: string;
  excerpt?: string;
  author?: { name: string };
  isPublished: boolean;
  createdAt: string;
  tags?: string[];
};

type BlogForm = {
  title: string;
  content: string;
  excerpt: string;
  tags: string;
  isPublished: boolean;
};

const emptyForm: BlogForm = {
  title: "",
  content: "",
  excerpt: "",
  tags: "",
  isPublished: true,
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── Paste Modal ────────────────────────────────────────────────────────────
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

  const getHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("pw_token") : null;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${BASE}/blogs?limit=100`, { headers: getHeaders() });
      const data = await res.json();
      setBlogs(data.data || []);
    } catch {
      setError("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  /* ── Google Docs parse handler ──────────────────────────────────────────── */
  const handleGoogleDocsParse = (html: string) => {
    const parsed = parseGoogleDocsHtml(html);

    setForm((prev) => ({
      ...prev,
      ...(parsed.title    ? { title:   parsed.title }   : {}),
      ...(parsed.excerpt  ? { excerpt: parsed.excerpt }  : {}),
      ...(parsed.content  ? { content: parsed.content }  : {}),
      ...(parsed.tags     ? { tags:    parsed.tags }     : {}),
    }));

    setSuccess("✅ Content parsed! Review the fields below and publish when ready.");
    setTimeout(() => setSuccess(""), 5000);
  };

  /* ── CRUD ───────────────────────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const url = editId ? `${BASE}/blogs/${editId}` : `${BASE}/blogs`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setSuccess(editId ? "Blog updated!" : "Blog published!");
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchBlogs();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save blog.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      await fetch(`${BASE}/blogs/${id}`, { method: "DELETE", headers: getHeaders() });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch {
      alert("Failed to delete.");
    }
  };

  const handleEdit = (blog: Blog & { content?: string }) => {
    setForm({
      title: blog.title,
      content: blog.content || "",
      excerpt: blog.excerpt || "",
      tags: (blog.tags || []).join(", "),
      isPublished: blog.isPublished,
    });
    setEditId(blog._id);
    setShowForm(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-[#313131] font-vietnam">Blog Management</h2>
            <p className="text-sm text-[#313131]/50 mt-1">
              {blogs.length} post{blogs.length !== 1 ? "s" : ""} published
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* ── Paste from Google Docs button ── */}
            <button
              onClick={() => {
                setShowForm(true);
                setEditId(null);
                setForm(emptyForm);
                setIsPasteModalOpen(true);
              }}
              className="px-5 py-2.5 bg-[#FAF1E6] border border-[#FFA100]/40 hover:bg-[#FFA100] hover:border-[#FFA100] text-[#313131] text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <span>📄</span> Paste from Google Docs
            </button>

            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditId(null);
                setForm(emptyForm);
              }}
              className="px-5 py-2.5 bg-[#313131] hover:bg-[#FFA100] hover:text-[#313131] text-white text-sm font-bold rounded-xl transition-all duration-200"
            >
              {showForm ? "✕ Cancel" : "+ New Blog Post"}
            </button>
          </div>
        </div>

        {/* Feedback */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-semibold text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* Blog Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-[#C7C0AE]/30 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-[#313131] font-vietnam">
                {editId ? "Edit Blog Post" : "Write New Blog Post"}
              </h3>
              {/* Quick paste shortcut inside form */}
              {!editId && (
                <button
                  type="button"
                  onClick={() => setIsPasteModalOpen(true)}
                  className="text-xs font-bold text-[#FFA100] hover:text-[#313131] border border-[#FFA100]/30 hover:border-[#313131]/20 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                >
                  📄 Fill from HTML paste
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#313131]/50 uppercase tracking-wider mb-1.5">
                  Title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-[#C7C0AE]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFA100] transition-colors"
                  placeholder="e.g. Why Group Buying is the Future of Real Estate"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#313131]/50 uppercase tracking-wider mb-1.5">
                  Excerpt (short summary)
                </label>
                <input
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full border border-[#C7C0AE]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFA100] transition-colors"
                  placeholder="1–2 sentence summary shown on listing page"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#313131]/50 uppercase tracking-wider mb-1.5">
                  Content *
                </label>
                <textarea
                  required
                  rows={10}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full border border-[#C7C0AE]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFA100] transition-colors resize-none font-mono text-xs leading-relaxed"
                  placeholder="Write your blog post content here… (HTML is supported)"
                />
                {form.content && (
                  <p className="text-[10px] text-[#313131]/30 mt-1">
                    {form.content.length.toLocaleString()} characters
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#313131]/50 uppercase tracking-wider mb-1.5">
                    Tags (comma separated)
                  </label>
                  <input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full border border-[#C7C0AE]/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFA100] transition-colors"
                    placeholder="investment, real estate, 2025"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                        form.isPublished ? "bg-[#FFA100]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          form.isPublished ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </div>
                    <span className="text-sm font-semibold text-[#313131]">
                      {form.isPublished ? "Published" : "Draft"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#313131] hover:bg-[#FFA100] hover:text-[#313131] text-white text-sm font-bold rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  {saving ? "Saving…" : editId ? "Update Post" : "Publish Post"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setForm(emptyForm); setEditId(null); }}
                  className="px-6 py-2.5 border border-[#C7C0AE]/50 text-[#313131]/60 text-sm font-semibold rounded-xl hover:border-[#313131]/30 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Blog List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#C7C0AE]/30 h-20 animate-pulse" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#C7C0AE]/30 p-12 text-center">
            <p className="text-4xl mb-3">📝</p>
            <p className="font-bold text-[#313131]">No blogs yet</p>
            <p className="text-sm text-[#313131]/50 mt-1">
              Click &quot;+ New Blog Post&quot; or &quot;Paste from Google Docs&quot; to publish your first article.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#C7C0AE]/30 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#FAF1E6]/60">
                <tr>
                  {["Title", "Author", "Tags", "Status", "Published On", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-[#313131]/50 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C7C0AE]/10">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-[#FAF1E6]/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#313131] max-w-xs truncate">{blog.title}</p>
                      {blog.excerpt && (
                        <p className="text-[11px] text-[#313131]/40 mt-0.5 truncate max-w-xs">{blog.excerpt}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[#313131]/60">{blog.author?.name || "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(blog.tags || []).slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-[#FAF1E6] text-[#313131]/60 text-[10px] font-semibold rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          blog.isPublished
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#313131]/40 text-xs">
                      {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(blog as Blog & { content?: string })}
                          className="px-3 py-1.5 text-xs font-bold border border-[#C7C0AE]/50 rounded-lg hover:border-[#FFA100] hover:text-[#FFA100] transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="px-3 py-1.5 text-xs font-bold border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Google Docs Paste Modal ──────────────────────────────────────────── */}
      <GoogleDocsPasteModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onParse={handleGoogleDocsParse}
      />
    </>
  );
}
