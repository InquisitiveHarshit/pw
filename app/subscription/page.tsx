import * as motion from "motion/react-client";

export default function SubscriptionPage() {
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
            Join <span className="text-[#FFA100]">PW Premium</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#FAF1E6]/80 max-w-2xl mx-auto font-light">
            Unlock exclusive early access to high-demand properties, waived group-booking fees, and dedicated legal support.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Basic Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 border border-[#C7C0AE]/40 shadow-sm flex flex-col"
          >
            <h3 className="text-2xl font-bold text-[#313131] mb-2 font-vietnam">Free Explorer</h3>
            <p className="text-[#313131]/70 mb-6 font-medium">Perfect for browsing and joining open groups.</p>
            <div className="text-5xl font-extrabold text-[#313131] mb-8 font-vietnam">₹0<span className="text-lg text-[#313131]/50 font-medium font-sans">/forever</span></div>
            <ul className="space-y-4 mb-8 flex-1 font-medium">
              <li className="flex items-center text-[#313131]/80"><span className="text-[#94A692] mr-3 font-bold">✔</span> Access all property listings</li>
              <li className="flex items-center text-[#313131]/80"><span className="text-[#94A692] mr-3 font-bold">✔</span> Join open buying groups</li>
              <li className="flex items-center text-[#313131]/80"><span className="text-[#94A692] mr-3 font-bold">✔</span> Basic email alerts</li>
            </ul>
            <button className="w-full bg-[#FAF1E6] hover:bg-[#C7C0AE]/30 text-[#313131] font-bold py-4 rounded-2xl transition-colors font-vietnam border border-[#C7C0AE]/30">
              Current Plan
            </button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-[#313131] rounded-3xl p-8 border border-[#313131] shadow-2xl flex flex-col relative transform lg:-translate-y-4"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-[#FFA100] rounded-t-3xl" />
            <div className="absolute top-4 right-4 bg-[#FFA100]/20 text-[#FFA100] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-vietnam">Most Popular</div>
            
            <h3 className="text-2xl font-bold text-white mb-2 font-vietnam">PW Insider</h3>
            <p className="text-[#FAF1E6]/70 mb-6 font-medium">For serious buyers ready to lock in the best deals.</p>
            <div className="text-5xl font-extrabold text-white mb-8 font-vietnam">₹999<span className="text-lg text-[#FAF1E6]/50 font-medium font-sans">/year</span></div>
            <ul className="space-y-4 mb-8 flex-1 font-medium">
              <li className="flex items-center text-[#FAF1E6]/90"><span className="text-[#FFA100] mr-3 font-bold">✔</span> 48-hour early access to deals</li>
              <li className="flex items-center text-[#FAF1E6]/90"><span className="text-[#FFA100] mr-3 font-bold">✔</span> Priority slot booking</li>
              <li className="flex items-center text-[#FAF1E6]/90"><span className="text-[#FFA100] mr-3 font-bold">✔</span> Waived platform fee (save up to ₹50k)</li>
              <li className="flex items-center text-[#FAF1E6]/90"><span className="text-[#FFA100] mr-3 font-bold">✔</span> Dedicated relationship manager</li>
            </ul>
            <button className="w-full bg-[#FFA100] hover:bg-white text-[#313131] font-extrabold py-4 rounded-2xl transition-all shadow-lg shadow-[#FFA100]/20 hover:shadow-[#FFA100]/40 font-vietnam">
              Upgrade Now
            </button>
          </motion.div>

          {/* Investor Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 border border-[#C7C0AE]/40 shadow-sm flex flex-col"
          >
            <h3 className="text-2xl font-bold text-[#313131] mb-2 font-vietnam">Pro Investor</h3>
            <p className="text-[#313131]/70 mb-6 font-medium">Designed for bulk buyers and real estate investors.</p>
            <div className="text-5xl font-extrabold text-[#313131] mb-8 font-vietnam">₹4,999<span className="text-lg text-[#313131]/50 font-medium font-sans">/year</span></div>
            <ul className="space-y-4 mb-8 flex-1 font-medium">
              <li className="flex items-center text-[#313131]/80"><span className="text-[#94A692] mr-3 font-bold">✔</span> Everything in Insider</li>
              <li className="flex items-center text-[#313131]/80"><span className="text-[#94A692] mr-3 font-bold">✔</span> Start your own buying groups</li>
              <li className="flex items-center text-[#313131]/80"><span className="text-[#94A692] mr-3 font-bold">✔</span> Free legal & compliance check</li>
              <li className="flex items-center text-[#313131]/80"><span className="text-[#94A692] mr-3 font-bold">✔</span> VIP invites to developer meets</li>
            </ul>
            <button className="w-full bg-[#FAF1E6] hover:bg-[#313131] hover:text-white text-[#313131] border border-[#313131]/20 font-bold py-4 rounded-2xl transition-colors font-vietnam">
              Contact Sales
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
