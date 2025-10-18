"use client";
import React, { useState } from "react";

export default function PhoneModal({
  onSendOtp,
  onConfirmOtp,
  onClose,
}: {
  onSendOtp: (phone: string) => Promise<boolean>;
  onConfirmOtp: (code: string) => Promise<void>;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);

  async function handleSend() {
    if (!phone) return alert("Enter phone in E.164 format, e.g. +919876543210");
    const ok = await onSendOtp(phone);
    if (ok) setVerificationSent(true);
  }

  async function handleConfirm() {
    if (!code) return alert("Enter OTP code");
    await onConfirmOtp(code);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-3">Verify Phone</h3>
        {!verificationSent ? (
          <>
            <label className="block mb-2 text-sm">Phone number (E.164):</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="+919876543210"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSend}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                Send OTP
              </button>
              <button onClick={onClose} className="px-3 py-2 border rounded">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <label className="block mb-2 text-sm">Enter OTP:</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="123456"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleConfirm}
                className="px-3 py-2 bg-green-600 text-white rounded"
              >
                Confirm
              </button>
              <button onClick={onClose} className="px-3 py-2 border rounded">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
