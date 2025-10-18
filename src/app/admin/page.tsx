"use client";
import React, { useEffect, useState } from "react";
import { onAuthChanged, firebaseSignOut } from "../../firebase/client";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  useEffect(() => onAuthChanged(setUser), []);
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg p-8 bg-white/80 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        {user ? (
          <>
            <p>Welcome Admin: {user.email}</p>
            <button
              onClick={() => {
                firebaseSignOut();
                router.push("/login");
              }}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Sign out
            </button>
          </>
        ) : (
          <p>
            Please login as admin{" "}
            <a href="/login" className="text-blue-600">
              here
            </a>
            .
          </p>
        )}
      </div>
    </main>
  );
}
