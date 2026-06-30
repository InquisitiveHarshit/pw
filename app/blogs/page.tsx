import Link from "next/link";
import * as motion from "motion/react-client";

function BlogCard({ blog }: { blog: any }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl border border-[#C7C0AE]/40 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
    >
      <div className="h-56 bg-[#FAF1E6] overflow-hidden relative">
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#C7C0AE]/20">
            <span className="text-[#313131]/50 font-medium font-vietnam">Blog Image</span>
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-xs text-[#313131]/60 font-bold mb-3 uppercase tracking-wider font-vietnam">
          <span>{blog.author?.name || "PW Editor"}</span>
          <time dateTime={blog.createdAt}>
            {new Date(blog.createdAt || Date.now()).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>
        <h3 className="text-xl font-bold text-[#313131] mb-2 line-clamp-2 hover:text-[#FFA100] transition-colors font-vietnam">
          <Link href={`/blogs/${blog._id}`}>{blog.title}</Link>
        </h3>
        <p className="text-[#313131]/70 text-sm mb-6 line-clamp-3 flex-1">
          {blog.excerpt || (blog.content?.replace(/<[^>]*>/g, "")?.substring(0, 150)) || "Read the full article to learn more about the latest real estate trends and group buying opportunities."}
        </p>
        <Link
          href={`/blogs/${blog._id}`}
          className="inline-flex items-center text-[#313131] font-bold hover:text-[#FFA100] mt-auto group/link"
        >
          Read Article
          <span className="ml-1 group-hover/link:translate-x-1 transition-transform text-[#FFA100]">→</span>
        </Link>
      </div>
    </motion.article>
  );
}

export default async function BlogsPage() {
  let blogs = [];
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${BASE_URL}/blogs`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      blogs = json.data || [];
    }
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
  }

  return (
    <div className="min-h-screen bg-[#FAF1E6] pb-20 font-sans">
      {/* Hero Section */}
      <section className="relative bg-[#313131] text-white pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C7C0AE" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 font-vietnam">
            Insights & <span className="text-[#94A692]">Stories</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#FAF1E6]/80 max-w-2xl mx-auto font-light">
            Stay updated with the latest in real estate, market trends, and group buying tips.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 -mt-8 relative z-20">
        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#C7C0AE]/40 shadow-sm">
            <h3 className="text-2xl font-bold text-[#313131] mb-2 font-vietnam">No Articles Yet</h3>
            <p className="text-[#313131]/70">We're cooking up some great content. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog: any) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-16 text-center border-t border-[#C7C0AE]/30 mt-8">
        <h2 className="text-3xl font-extrabold text-[#313131] mb-4 font-vietnam">Never Miss an Update</h2>
        <p className="text-[#313131]/70 mb-8 max-w-xl mx-auto">Get the latest market insights and exclusive group buying opportunities delivered straight to your inbox.</p>
        <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 bg-white border border-[#C7C0AE]/50 px-5 py-4 rounded-xl focus:outline-none focus:border-[#FFA100] text-[#313131] font-medium transition-colors"
            required
          />
          <button
            type="submit"
            className="bg-[#313131] hover:bg-[#FFA100] text-white hover:text-[#313131] px-8 py-4 rounded-xl font-bold transition-colors font-vietnam"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
