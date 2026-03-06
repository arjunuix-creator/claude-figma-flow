import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finova – Fintech Expense Dashboard",
  description:
    "A modern fintech dashboard for tracking expenses, visualizing spending analytics, and managing financial data.",
  openGraph: {
    title: "Finova – Fintech Expense Dashboard",
    description:
      "Modern fintech dashboard built with Next.js, Supabase, and AI-assisted development.",
    url: "https://fintech-demo-arjun.vercel.app",
    siteName: "Finova",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Finova Fintech Dashboard",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finova – Fintech Dashboard",
    description:
      "Expense tracking dashboard with analytics and financial insights.",
    images: ["/og-image.png"],
  },
};

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
