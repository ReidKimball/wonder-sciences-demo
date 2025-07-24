/**
 * @file layout.tsx
 * @description This file defines the root layout for the Next.js application, including global fonts and metadata.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Vercel's Geist font for sans-serif and mono
import "./globals.css"; // Global stylesheet

// Initialize the Geist Sans font with its CSS variable
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Initialize the Geist Mono font with its CSS variable
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * @constant {Metadata}
 * @description Default metadata for the application.
 */
export const metadata: Metadata = {
  title: "Wonder Sciences AI Demo",
  description: "A demo application for Wonder Sciences AI chat.",
};

/**
 * RootLayout component that wraps the entire application.
 * @param {object} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The root HTML structure of the application.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
