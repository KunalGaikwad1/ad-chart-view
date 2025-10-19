import { useEffect } from "react";
import { firebaseSignOut } from "@/firebase/client";

export function useSessionCheck() {
  useEffect(() => {
    const checkSession = async () => {
      const email = localStorage.getItem("userEmail");
      const token = localStorage.getItem("sessionToken");
      if (!email || !token) return;

      const res = await fetch("/api/users/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sessionToken: token }),
      });
      const data = await res.json();

      if (!data.valid) {
        alert(
          "You have been logged out because your account was used on another device."
        );
        await firebaseSignOut();
        localStorage.clear();
        window.location.href = "/login";
      }
    };

    checkSession();

    // 🔁 Recheck every 30 seconds (optional)
    const interval = setInterval(checkSession, 30000);
    return () => clearInterval(interval);
  }, []);
}
