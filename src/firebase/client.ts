// src/firebase/client.ts
"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  PhoneAuthProvider,
  linkWithCredential,
  RecaptchaVerifier,
  User,
  Unsubscribe,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Google Sign-In using Popup
 */
export async function signInWithGooglePopup() {
  return signInWithPopup(auth, googleProvider);
}

/**
 * Create or reuse a reCAPTCHA verifier (only client-side)
 */
export function getOrCreateRecaptcha(verifierId = "recaptcha-container") {
  if (typeof window === "undefined") {
    throw new Error("RecaptchaVerifier can only be initialized in the browser");
  }

  if ((window as any).recaptchaVerifier) {
    return (window as any).recaptchaVerifier as RecaptchaVerifier;
  }

  const verifier = new RecaptchaVerifier(auth, verifierId, {
    size: "invisible",
    callback: (response: any) => {
      console.log("Recaptcha solved automatically:", response);
    },
  });

  (window as any).recaptchaVerifier = verifier;
  return verifier;
}

/**
 * Send OTP to the given phone number
 */
export async function sendPhoneOtp(phoneNumber: string) {
  const appVerifier = getOrCreateRecaptcha();
  const provider = new PhoneAuthProvider(auth);

  // Ensure proper E.164 format
  if (!phoneNumber.startsWith("+")) {
    phoneNumber = `+91${phoneNumber}`; // default India
  }

  const verificationId = await provider.verifyPhoneNumber(
    phoneNumber,
    appVerifier
  );
  return verificationId;
}

/**
 * Confirm OTP and link to the current user
 * Handles "provider-already-linked" error gracefully
 */
export async function confirmOtpAndLink(verificationId: string, code: string) {
  const credential = PhoneAuthProvider.credential(verificationId, code);
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user to link phone to.");

  // ✅ Only link if not already linked
  if (user.phoneNumber) {
    console.log("Phone number already linked:", user.phoneNumber);
    return user;
  }

  try {
    const result = await linkWithCredential(user, credential);
    return result;
  } catch (err: any) {
    if (err.code === "auth/provider-already-linked") {
      console.log("Phone already linked, skipping...");
      return user;
    }
    throw err;
  }
}

/**
 * Auth State Listener
 */
export function onAuthChanged(cb: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, cb);
}

/**
 * Sign Out
 */
export function firebaseSignOut() {
  return signOut(auth);
}
