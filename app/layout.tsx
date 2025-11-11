import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Football Hub",
  description: "Football data management system with Next.js and MongoDB",
  keywords: ["football", "soccer", "data management", "analytics", "Next.js", "MongoDB"],
  authors: [{ name: "Ashbourn D'Cunha" }],
  creator: "Ashbourn D'Cunha",
  publisher: "Football Hub",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Football Hub - Advanced Football Data Management",
    description: "Comprehensive football data management system with player analytics, transfer market insights, match results, and advanced search capabilities built with Next.js and MongoDB.",
    url: "/",
    siteName: "Football Hub",
    images: [
      {
        url: "/favicon.ico",
        width: 32,
        height: 32,
        alt: "Football Hub Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Football Hub - Advanced Football Data Management",
    description: "Comprehensive football data management system with player analytics, transfer market insights, match results, and advanced search capabilities.",
    images: ["/favicon.ico"],
    creator: "@your-twitter-handle", // Replace with your actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
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
        <Navbar />
        {children}
      </body>
    </html>
  );
}
