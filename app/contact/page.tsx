"use client";

import { useState } from "react";
import * as motion from "motion/react-client";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    // Simulate API call
    setTimeout(() => setFormStatus("success"), 1500);
  };

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
            Get in <span className="text-[#FFA100]">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#FAF1E6]/80 max-w-2xl mx-auto font-light">
            Have questions about group buying or a specific property? Our team is here to help you every step of the way.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 border border-[#C7C0AE]/40 shadow-sm"
          >
            <h2 className="text-3xl font-extrabold text-[#313131] mb-8 font-vietnam">Contact Information</h2>
            
            <div className="space-y-8 font-medium">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#FAF1E6] text-[#FFA100] rounded-xl flex items-center justify-center shrink-0 mt-1">
                  <span className="text-xl">📍</span>
                </div>
                <div className="ml-6">
                  <h4 className="text-lg font-bold text-[#313131] mb-1 font-vietnam">Our Office</h4>
                  <p className="text-[#313131]/70 leading-relaxed">
                    123 Real Estate Tower, Sector 62<br />
                    Noida, Uttar Pradesh 201309<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#FAF1E6] text-[#FFA100] rounded-xl flex items-center justify-center shrink-0 mt-1">
                  <span className="text-xl">📞</span>
                </div>
                <div className="ml-6">
                  <h4 className="text-lg font-bold text-[#313131] mb-1 font-vietnam">Phone</h4>
                  <p className="text-[#313131]/70 mb-1">+91 98765 43210</p>
                  <p className="text-sm text-[#313131]/50">Mon-Fri from 9am to 6pm IST</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#FAF1E6] text-[#FFA100] rounded-xl flex items-center justify-center shrink-0 mt-1">
                  <span className="text-xl">✉️</span>
                </div>
                <div className="ml-6">
                  <h4 className="text-lg font-bold text-[#313131] mb-1 font-vietnam">Email</h4>
                  <p className="text-[#313131]/70 mb-1">support@propertieswallah.com</p>
                  <p className="text-sm text-[#313131]/50">We aim to reply within 24 hours.</p>
                </div>
              </div>
            </div>

            {/* Mock Map Area */}
            <div className="mt-12 h-48 bg-[#FAF1E6] rounded-2xl border border-[#C7C0AE]/40 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#c7c0ae 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <span className="text-[#313131]/60 font-bold relative z-10 flex items-center gap-2 font-vietnam">
                <span>🗺️</span> Interactive Map view
              </span>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 border border-[#C7C0AE]/40 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFA100]/10 rounded-bl-full -z-0" />
            
            <h2 className="text-3xl font-extrabold text-[#313131] mb-2 relative z-10 font-vietnam">Send a Message</h2>
            <p className="text-[#313131]/70 font-medium mb-8 relative z-10">Fill out the form below and we'll get back to you.</p>
            
            {formStatus === "success" ? (
              <div className="bg-[#94A692]/10 border border-[#94A692]/30 text-[#313131] rounded-2xl p-6 text-center h-full flex flex-col justify-center">
                <div className="text-5xl mb-4 text-[#94A692]">✓</div>
                <h3 className="text-2xl font-bold mb-2 font-vietnam text-[#313131]">Message Sent!</h3>
                <p className="text-[#313131]/80 font-medium mb-8">Thank you for reaching out. Our team will contact you shortly.</p>
                <button 
                  onClick={() => setFormStatus("idle")}
                  className="mt-4 text-[#313131] border border-[#313131]/20 font-bold hover:border-[#FFA100] px-6 py-3 rounded-xl transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10 font-medium text-[#313131]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">First Name</label>
                    <input type="text" required className="w-full bg-[#FAF1E6] border border-[#C7C0AE]/40 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFA100] focus:bg-white transition-colors" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Last Name</label>
                    <input type="text" required className="w-full bg-[#FAF1E6] border border-[#C7C0AE]/40 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFA100] focus:bg-white transition-colors" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2">Email Address</label>
                  <input type="email" required className="w-full bg-[#FAF1E6] border border-[#C7C0AE]/40 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFA100] focus:bg-white transition-colors" placeholder="john@example.com" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2">Phone Number</label>
                  <input type="tel" className="w-full bg-[#FAF1E6] border border-[#C7C0AE]/40 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFA100] focus:bg-white transition-colors" placeholder="+91 98765 43210" />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Message</label>
                  <textarea required rows={4} className="w-full bg-[#FAF1E6] border border-[#C7C0AE]/40 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFA100] focus:bg-white transition-colors resize-none" placeholder="How can we help you?"></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={formStatus === "submitting"}
                  className="w-full bg-[#313131] hover:bg-[#FFA100] hover:text-[#313131] text-white font-extrabold py-4 rounded-xl transition-all shadow-md hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2 font-vietnam"
                >
                  {formStatus === "submitting" ? (
                    <>Sending...</>
                  ) : (
                    <>Send Message <span className="font-sans">→</span></>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
