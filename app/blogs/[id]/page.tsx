import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/* ─── Types ────────────────────────────────────────────────────────────────── */

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  author?: { name: string; email?: string };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ─── Data Fetcher ─────────────────────────────────────────────────────────── */

async function getBlog(id: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${BASE}/blogs/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

async function getRecentBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BASE}/blogs?limit=4`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

/* ─── SEO Metadata ─────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlog(id);
  if (!blog) return { title: "Blog Not Found — Properties Wallah" };
  return {
    title: `${blog.title} — Properties Wallah`,
    description: blog.excerpt || blog.content?.substring(0, 150),
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.content?.substring(0, 150),
      ...(blog.coverImage ? { images: [{ url: blog.coverImage }] } : {}),
    },
  };
}

/* ─── Helpers ───────────────────────────────────────────────────────────────── */

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readingTime(content: string): number {
  // Strip HTML tags for word count
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [blog, recentBlogs] = await Promise.all([getBlog(id), getRecentBlogs()]);

  if (!blog) notFound();

  const related = recentBlogs.filter((b) => b._id !== blog._id).slice(0, 3);
  const mins = readingTime(blog.content || "");

  return (
    <div className="min-h-screen bg-[#FAF1E6] font-vietnam pb-20">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#313131] text-white pt-28 pb-16 px-4 relative overflow-hidden">
        {/* subtle grid overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C7C0AE" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/50 font-medium mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-white transition-colors">Insights</Link>
            <span>/</span>
            <span className="text-white/80 truncate max-w-xs">{blog.title}</span>
          </nav>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#FFA100]/20 border border-[#FFA100]/30 text-[#FFA100] text-[10px] font-black uppercase tracking-widest rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-6">
            {blog.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              {/* Author avatar placeholder */}
              <div className="w-8 h-8 rounded-full bg-[#FFA100] flex items-center justify-center text-[#313131] font-black text-xs">
                {(blog.author?.name || "P")[0].toUpperCase()}
              </div>
              <span className="font-semibold text-white/80">
                {blog.author?.name || "PW Editorial Team"}
              </span>
            </div>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>{mins} min read</span>
          </div>
        </div>
      </section>

      {/* ── Cover Image ────────────────────────────────────────────────────── */}
      {blog.coverImage && (
        <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-20">
          <div className="rounded-2xl overflow-hidden shadow-2xl aspect-video">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ── Main Layout ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ── Article Body ────────────────────────────────────────────────── */}
          <article className="lg:col-span-8">

            {/* Excerpt callout */}
            {blog.excerpt && (
              <div className="bg-white border-l-4 border-[#FFA100] rounded-r-2xl px-6 py-5 mb-8 shadow-sm">
                <p className="text-[#313131]/80 text-base leading-relaxed italic font-medium">
                  {blog.excerpt}
                </p>
              </div>
            )}

            {/* Content — render as rich HTML if it contains tags, else plain text */}
            <div
              className="
                bg-white rounded-2xl border border-[#C7C0AE]/30 shadow-sm px-8 py-10
                prose-headings:font-extrabold prose-headings:font-vietnam prose-headings:text-[#313131]
                [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-[#313131] [&_h1]:mb-5 [&_h1]:mt-2 [&_h1]:leading-tight
                [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-[#313131] [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-[#C7C0AE]/30
                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#313131] [&_h3]:mb-3 [&_h3]:mt-7
                [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-[#313131]/80 [&_h4]:mb-2 [&_h4]:mt-5
                [&_p]:text-[#313131]/75 [&_p]:leading-relaxed [&_p]:mb-5 [&_p]:text-[15px]
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:text-[#313131]/75 [&_ul]:text-[15px]
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:text-[#313131]/75 [&_ol]:text-[15px]
                [&_li]:mb-2 [&_li]:leading-relaxed
                [&_strong]:text-[#313131] [&_strong]:font-bold
                [&_em]:text-[#313131]/60 [&_em]:italic
                [&_a]:text-[#FFA100] [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-[#313131] [&_a]:transition-colors
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#FFA100] [&_blockquote]:bg-[#FFA100]/5 [&_blockquote]:pl-5 [&_blockquote]:pr-4 [&_blockquote]:py-3 [&_blockquote]:rounded-r-xl [&_blockquote]:text-[#313131]/70 [&_blockquote]:italic [&_blockquote]:my-6
                [&_code]:bg-[#F5F4F0] [&_code]:text-[#313131] [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                [&_pre]:bg-[#313131] [&_pre]:text-[#FAF1E6] [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:text-sm
                [&_hr]:border-[#C7C0AE]/40 [&_hr]:my-8
                [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse [&_table]:my-6
                [&_th]:bg-[#FAF1E6] [&_th]:border [&_th]:border-[#C7C0AE]/40 [&_th]:px-4 [&_th]:py-2.5 [&_th]:font-bold [&_th]:text-[#313131] [&_th]:text-left
                [&_td]:border [&_td]:border-[#C7C0AE]/30 [&_td]:px-4 [&_td]:py-2 [&_td]:text-[#313131]/70
                [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-6 [&_img]:shadow-md
              "
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags footer */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#313131]/40 uppercase tracking-wider mr-1">
                  Tagged:
                </span>
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white border border-[#C7C0AE]/40 text-[#313131]/60 text-xs font-semibold rounded-full hover:border-[#FFA100] hover:text-[#313131] transition-all cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author card */}
            <div className="mt-10 bg-white border border-[#C7C0AE]/30 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#FFA100] flex items-center justify-center text-[#313131] font-black text-xl shrink-0">
                {(blog.author?.name || "P")[0].toUpperCase()}
              </div>
              <div>
                <p className="font-extrabold text-[#313131] font-vietnam">
                  {blog.author?.name || "PW Editorial Team"}
                </p>
                <p className="text-sm text-[#313131]/50 mt-0.5">
                  Real estate insights, group buying trends & investment strategies.
                </p>
              </div>
            </div>

            {/* Back / CTA */}
            <div className="mt-10 flex items-center gap-4">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-[#C7C0AE]/40 text-[#313131] font-bold text-sm rounded-xl hover:border-[#313131] transition-all"
              >
                ← Back to Insights
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#313131] hover:bg-[#FFA100] hover:text-[#313131] text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-sm"
              >
                Browse Properties →
              </Link>
            </div>
          </article>

          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <aside className="lg:col-span-4 space-y-6">

            {/* Recent articles */}
            {related.length > 0 && (
              <div className="bg-white border border-[#C7C0AE]/30 rounded-2xl p-6 shadow-sm">
                <h3 className="font-extrabold text-[#313131] font-vietnam mb-5 text-base uppercase tracking-wide">
                  More Insights
                </h3>
                <div className="space-y-5">
                  {related.map((b) => (
                    <Link
                      key={b._id}
                      href={`/blogs/${b._id}`}
                      className="flex gap-4 group"
                    >
                      {/* Thumbnail placeholder */}
                      <div className="w-16 h-16 rounded-xl bg-[#FAF1E6] shrink-0 overflow-hidden border border-[#C7C0AE]/20">
                        {b.coverImage ? (
                          <img
                            src={b.coverImage}
                            alt={b.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            📰
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#313131] line-clamp-2 group-hover:text-[#FFA100] transition-colors leading-tight">
                          {b.title}
                        </p>
                        <p className="text-[10px] text-[#313131]/40 mt-1 font-medium">
                          {formatDate(b.createdAt)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/blogs"
                  className="mt-5 flex items-center justify-center gap-1 text-xs font-bold text-[#FFA100] hover:text-[#313131] transition-colors border-t border-[#C7C0AE]/20 pt-5"
                >
                  View All Articles →
                </Link>
              </div>
            )}

            {/* CTA card */}
            <div className="bg-[#313131] text-white rounded-2xl p-6 shadow-xl">
              <div className="w-10 h-10 bg-[#FFA100] rounded-xl flex items-center justify-center text-[#313131] text-xl font-black mb-4">
                🏘️
              </div>
              <h3 className="font-extrabold text-lg font-vietnam mb-2">
                Buy Together, Save More
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                Join a group to unlock bigger discounts on premium properties across India.
              </p>
              <Link
                href="/properties"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-[#FFA100] hover:bg-white hover:text-[#313131] text-[#313131] font-extrabold text-sm rounded-xl transition-all duration-200"
              >
                Browse Properties →
              </Link>
            </div>

            {/* Article info card */}
            <div className="bg-white border border-[#C7C0AE]/30 rounded-2xl p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#313131]/40">
                Article Info
              </h4>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#313131]/50">Published</span>
                  <span className="font-semibold text-[#313131]">{formatDate(blog.createdAt)}</span>
                </div>
                {blog.updatedAt !== blog.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-[#313131]/50">Updated</span>
                    <span className="font-semibold text-[#313131]">{formatDate(blog.updatedAt)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#313131]/50">Read time</span>
                  <span className="font-semibold text-[#313131]">{mins} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#313131]/50">Author</span>
                  <span className="font-semibold text-[#313131]">
                    {blog.author?.name || "PW Team"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
