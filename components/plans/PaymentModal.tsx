"use client";
import React, { useState } from 'react';

export default function PaymentModal({ isOpen, onClose, onUpgradeSuccess }: { isOpen: boolean, onClose: () => void, onUpgradeSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Call the API endpoint
      const token = localStorage.getItem("token") || ""; // fallback
      const res = await fetch("http://localhost:5000/api/users/upgrade-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onUpgradeSuccess();
          onClose();
          setSuccess(false); // reset
        }, 2000);
      } else {
        alert(data.message || "Payment failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error upgrading plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">X</button>
        
        {!success ? (
          <>
            <h2 className="text-3xl font-bold mb-2 text-[#2E281F] text-center">Upgrade Your Plan</h2>
            <p className="mb-8 text-[#5A503D] text-center">Join more groups and save bigger on properties.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Plan (Current) */}
              <div className="border border-gray-200 rounded-2xl p-6 opacity-60">
                <h3 className="text-xl font-bold mb-2">Free Tier</h3>
                <p className="text-gray-500 mb-4">You are currently here.</p>
                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li>✓ Join up to 2 groups</li>
                  <li>✓ Basic property insights</li>
                </ul>
                <div className="text-2xl font-bold">₹0</div>
              </div>

              {/* Premium Plan */}
              <div className="border-2 border-[#FFA100] rounded-2xl p-6 shadow-lg relative bg-[#FAF1E6]/30">
                <div className="absolute top-0 right-0 bg-[#FFA100] text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">RECOMMENDED</div>
                <h3 className="text-xl font-bold mb-2">Premium Member</h3>
                <p className="text-[#5A503D] mb-4">Unlock ultimate saving power.</p>
                <ul className="space-y-2 mb-6 text-sm text-[#2E281F]">
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Join +10 more groups</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Priority access to new deals</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Premium developer support</li>
                </ul>
                <div className="text-3xl font-bold mb-4">₹999<span className="text-sm font-normal text-gray-500">/year</span></div>
                
                <button 
                  onClick={handlePayment} 
                  disabled={loading}
                  className="w-full bg-[#2E281F] text-white font-semibold py-3 rounded-xl hover:bg-black transition-colors"
                >
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-green-500 text-4xl">✓</span>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-[#2E281F]">Payment Successful!</h2>
            <p className="text-[#5A503D]">You are now a Premium Member. Your group limit has been increased by 10.</p>
          </div>
        )}
      </div>
    </div>
  );
}
