"use client";
import React, { useState, useEffect } from "react";
import { phoneCheck, phoneLogin, phoneRegister } from "@/lib/api/auth";

const TOKEN_KEY = "pw_token";
const USER_KEY = "pw_user";

type Step = "phone" | "otp" | "name";

export default function LoginFlow({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  // Reset state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("phone");
      setPhone("");
      setOtp("");
      setFirstName("");
      setLastName("");
      setError("");
      setIsNewUser(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const storeAndClose = (userData: any) => {
    localStorage.setItem(TOKEN_KEY, userData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    // Trigger re-render in useAuth by dispatching a storage event
    window.dispatchEvent(new Event("storage"));
    onClose();
  };

  // ── Step 1: Send OTP ─────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone.trim().length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // For now just advance to OTP screen (dummy — no real OTP sent)
      setStep("otp");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.length < 4) {
      setError("Please enter the 4-digit OTP.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // DUMMY: any 4-digit OTP passes for now
      // Check if phone exists in DB
      console.log("Checking phone number:", phone.trim());
      const res = await phoneCheck(phone.trim());
      console.log("phoneCheck response:", res);
      
      if (res && res.exists) {
        // Existing user → login directly
        console.log("Existing user found, attempting login...");
        const loginRes = await phoneLogin(phone.trim());
        console.log("phoneLogin response:", loginRes);
        if (loginRes.success && loginRes.data) {
          storeAndClose(loginRes.data);
        } else {
          throw new Error("Login failed even though user exists.");
        }
      } else {
        // New user → collect name
        console.log("User not found, going to create profile step.");
        setIsNewUser(true);
        setStep("name");
      }
    } catch (err: any) {
      console.error("OTP Verification Error:", err);
      setError(err?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Collect name & register ─────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await phoneRegister({
        phone: phone.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      storeAndClose(res.data);
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-[#FAF1E6] rounded-2xl max-w-md w-full shadow-2xl relative border border-[#C7C0AE]/30 overflow-hidden">

        {/* Header Bar */}
        <div className="bg-[#313131] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/10 px-2.5 py-1.5 rounded-lg">
              <span className="font-extrabold text-lg tracking-tighter text-white">P</span>
              <span className="font-extrabold text-lg tracking-tighter text-[#FFA100]">W</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Properties Wallah</p>
              <p className="text-white/50 text-[10px] font-medium mt-0.5">
                {step === "phone" && "Enter your number to continue"}
                {step === "otp" && "Verify your number"}
                {step === "name" && "Almost there! Setup your profile"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 px-8 py-3 bg-[#313131]/5 border-b border-[#C7C0AE]/20">
          {(["phone", "otp", "name"] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s ? "bg-[#FFA100] flex-1" : 
                (["phone", "otp", "name"].indexOf(step) > i ? "bg-[#94A692] w-8" : "bg-[#C7C0AE]/40 w-8")
              }`}
            />
          ))}
        </div>

        <div className="p-8">
          {/* ── Step 1: Phone ── */}
          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-[#313131]">Login or Sign Up</h2>
                <p className="text-sm text-[#313131]/60 mt-1">
                  Enter your mobile number to get an OTP.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#313131]/70 mb-2 uppercase tracking-wider">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 py-3 border border-[#C7C0AE]/50 bg-white rounded-xl text-sm font-bold text-[#313131] shrink-0">
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                    maxLength={10}
                    required
                    autoFocus
                    className="w-full border border-[#C7C0AE]/50 bg-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA100] text-[#313131] tracking-widest placeholder:tracking-normal"
                  />
                </div>
              </div>

              {error && <p className="text-xs font-semibold text-red-500 bg-red-50 rounded-lg p-2.5 border border-red-200">{error}</p>}

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full bg-[#FFA100] text-[#313131] font-bold py-3.5 rounded-xl hover:bg-[#313131] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send OTP →"}
              </button>

              <p className="text-[11px] text-center text-[#313131]/40">
                By continuing, you agree to our Terms & Privacy Policy.
              </p>
            </form>
          )}

          {/* ── Step 2: OTP ── */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <button onClick={() => { setStep("phone"); setOtp(""); setError(""); }} className="text-xs font-bold text-[#FFA100] mb-3 flex items-center gap-1 hover:underline">
                  ← Change Number
                </button>
                <h2 className="text-2xl font-extrabold text-[#313131]">Enter OTP</h2>
                <p className="text-sm text-[#313131]/60 mt-1">
                  We sent a 4-digit code to <span className="font-bold text-[#313131]">+91 {phone}</span>
                  <span className="text-[10px] text-[#94A692] ml-1 font-bold">(dummy – enter any 4 digits)</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#313131]/70 mb-2 uppercase tracking-wider">OTP Code</label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="• • • •"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                  required
                  autoFocus
                  className="w-full border border-[#C7C0AE]/50 bg-white rounded-xl p-4 text-center tracking-[0.6em] text-2xl font-extrabold focus:outline-none focus:ring-2 focus:ring-[#FFA100] text-[#313131]"
                />
              </div>

              {error && <p className="text-xs font-semibold text-red-500 bg-red-50 rounded-lg p-2.5 border border-red-200">{error}</p>}

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full bg-[#313131] text-white font-bold py-3.5 rounded-xl hover:bg-[#FFA100] hover:text-[#313131] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify OTP →"}
              </button>
            </form>
          )}

          {/* ── Step 3: Name (new user only) ── */}
          {step === "name" && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-[#313131]">Create Your Profile</h2>
                <p className="text-sm text-[#313131]/60 mt-1">
                  Looks like you're new here! Tell us your name.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#313131]/70 mb-2 uppercase tracking-wider">First Name *</label>
                <input
                  type="text"
                  placeholder="Harshit"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setError(""); }}
                  required
                  autoFocus
                  className="w-full border border-[#C7C0AE]/50 bg-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA100] text-[#313131]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#313131]/70 mb-2 uppercase tracking-wider">Last Name</label>
                <input
                  type="text"
                  placeholder="Gaur"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-[#C7C0AE]/50 bg-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA100] text-[#313131]"
                />
              </div>

              {error && <p className="text-xs font-semibold text-red-500 bg-red-50 rounded-lg p-2.5 border border-red-200">{error}</p>}

              <button
                type="submit"
                disabled={loading || !firstName.trim()}
                className="w-full bg-[#FFA100] text-[#313131] font-bold py-3.5 rounded-xl hover:bg-[#313131] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Get Started →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
