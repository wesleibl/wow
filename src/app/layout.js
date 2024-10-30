"use client";
import "./globals.css";
import { TokenWrapper } from "@/context/TokenContext";

export default function RootLayout({ children }) {
  return (
    <TokenWrapper>
      <html lang="en">
        <body>{children}</body>
      </html>
    </TokenWrapper>
  );
}
