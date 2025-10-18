"use client";
import React, { useEffect, useState } from "react";
import {
  signInWithGooglePopup,
  auth,
  sendPhoneOtp,
  confirmOtpAndLink,
  onAuthChanged,
} from "../../firebase/client";
import { useRouter } from "next/navigation";
import { getIdToken } from "firebase/auth";
import PhoneModal from "@/components/PhoneModal";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  useEffect(() => onAuthChanged(setUser), []);

  async function startGoogleLogin() {
    try {
      const result = await signInWithGooglePopup();
      // user is signed in with Google at this point
      setShowPhoneModal(true);
    } catch (err) {
      console.error("Google sign-in error:", err);
      alert("Google sign-in failed.");
    }
  }

  async function handleSendOtp(phone: string) {
    try {
      const vId = await sendPhoneOtp(phone);
      setVerificationId(vId);
      return true;
    } catch (err) {
      console.error("send otp error", err);
      alert(
        "Failed to send OTP. Make sure reCAPTCHA is set up and phone number is correct."
      );
      return false;
    }
  }

  async function handleConfirmOtp(code: string) {
    if (!verificationId) throw new Error("No verificationId");
    try {
      const linkResult = await confirmOtpAndLink(verificationId, code);
      // phone successfully linked; now create server session and upsert user into MongoDB
      const idToken = await getIdToken(auth.currentUser!, true);
      // call server to create session and upsert user
      const res = await fetch("/api/users/upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Server upsert failed");
      const payload = await res.json();
      // server will set a cookie for session; check if admin
      if (payload.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("confirm otp error", err);
      alert("OTP confirmation failed: " + (err.message || err));
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white/90 rounded shadow max-w-md">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <button
          onClick={startGoogleLogin}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Sign in with Google
        </button>

        <p className="mt-4 text-sm text-gray-600">
          After Google sign-in you&apos;ll be asked to verify your phone via
          OTP.
        </p>
      </div>

      {showPhoneModal && (
        <PhoneModal
          onSendOtp={handleSendOtp}
          onConfirmOtp={handleConfirmOtp}
          onClose={() => setShowPhoneModal(false)}
        />
      )}
    </main>
  );
}
