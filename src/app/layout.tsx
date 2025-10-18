import "./globals.css";
import React from "react";

export const metadata = {
  title: "Next Firebase Auth Example",
  description: "Google-only sign-in with phone OTP linking and MongoDB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="recaptcha-container" />{" "}
        {/* required for invisible reCAPTCHA */}
        {children}
      </body>
    </html>
  );
}
