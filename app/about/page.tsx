import * as motion from "motion/react-client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF1E6] pb-20 font-sans">
      {/* Hero Section */}
      <section className="relative bg-[#313131] text-white pt-32 pb-24 px-4 md:px-8 overflow-hidden">
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
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 font-vietnam">
            Redefining <span className="text-[#94A692]">Real Estate</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#FAF1E6]/80 max-w-3xl mx-auto font-light">
            Properties Wallah is India's first platform dedicated to empowering buyers through the power of group purchasing.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-extrabold text-[#313131] mb-6 font-vietnam">Our Mission</h2>
            <p className="text-lg text-[#313131]/80 font-medium mb-6 leading-relaxed">
              For decades, the real estate market has heavily favored developers and builders, leaving individual buyers with little negotiating power. At Properties Wallah, we believe that unity is strength.
            </p>
            <p className="text-lg text-[#313131]/80 font-medium leading-relaxed">
              By pooling buyers together into structured groups, we unlock massive bulk-buy discounts, ensuring that everyday people can purchase their dream homes at wholesale prices. We handle the negotiations, the paperwork, and the legal checks—you just enjoy the savings.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-white border border-[#C7C0AE]/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-4xl mb-4">👥</span>
              <h4 className="text-3xl font-extrabold text-[#313131] mb-1 font-vietnam">5k+</h4>
              <p className="text-[#FFA100] font-bold uppercase tracking-wider text-sm">Happy Buyers</p>
            </div>
            <div className="bg-white border border-[#C7C0AE]/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm mt-8">
              <span className="text-4xl mb-4">🏢</span>
              <h4 className="text-3xl font-extrabold text-[#313131] mb-1 font-vietnam">120+</h4>
              <p className="text-[#94A692] font-bold uppercase tracking-wider text-sm">Projects</p>
            </div>
            <div className="bg-white border border-[#C7C0AE]/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm -mt-8">
              <span className="text-4xl mb-4">💰</span>
              <h4 className="text-3xl font-extrabold text-[#313131] mb-1 font-vietnam">₹50Cr+</h4>
              <p className="text-[#FFA100] font-bold uppercase tracking-wider text-sm">Savings</p>
            </div>
            <div className="bg-white border border-[#C7C0AE]/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-4xl mb-4">🤝</span>
              <h4 className="text-3xl font-extrabold text-[#313131] mb-1 font-vietnam">100%</h4>
              <p className="text-[#94A692] font-bold uppercase tracking-wider text-sm">Transparency</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-20 border-y border-[#C7C0AE]/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#313131] mb-4 font-vietnam">How Group Buying Works</h2>
            <p className="text-xl text-[#313131]/70 max-w-2xl mx-auto font-medium">A simple, transparent process designed to get you the best possible price.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[1px] bg-[#C7C0AE]/40 -z-0" />
            
            {[
              { step: "01", title: "Join a Group", desc: "Find a property you love and join its dedicated buying group for a small, refundable deposit." },
              { step: "02", title: "We Negotiate", desc: "Once the group hits its target size, our experts negotiate a massive bulk discount with the builder." },
              { step: "03", title: "You Save Big", desc: "We finalize the paperwork. You purchase your new home at the discounted group rate!" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#FAF1E6] relative z-10 p-8 rounded-3xl border border-[#C7C0AE]/30 text-center"
              >
                <div className="w-16 h-16 bg-[#313131] text-[#FFA100] rounded-2xl flex items-center justify-center text-xl font-extrabold mx-auto mb-6 shadow-md font-vietnam">
                  {item.step}
                </div>
                <h3 className="text-2xl font-extrabold text-[#313131] mb-3 font-vietnam">{item.title}</h3>
                <p className="text-[#313131]/70 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join the Movement */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-24 text-center">
        <h2 className="text-4xl font-extrabold text-[#313131] mb-6 font-vietnam">Ready to change how you buy?</h2>
        <p className="text-xl text-[#313131]/70 font-medium mb-10">Join thousands of smart buyers who have already saved millions.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/properties" className="bg-[#313131] hover:bg-[#FFA100] hover:text-[#313131] text-white px-8 py-4 rounded-xl font-extrabold text-lg transition-colors w-full sm:w-auto shadow-md font-vietnam">
            Browse Properties
          </a>
          <a href="/contact" className="bg-transparent hover:bg-[#313131]/5 text-[#313131] border border-[#313131]/20 px-8 py-4 rounded-xl font-extrabold text-lg transition-colors w-full sm:w-auto font-vietnam">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
