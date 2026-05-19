import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Syne, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { ChatWidget } from "@/components/ChatWidget";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Navbar } from "@/components/Navbar";
import { GlobalUI } from "@/components/GlobalUI";
import { TransitionProvider } from "@/context/TransitionContext";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://adyantnexa.com"),
  title: "Adyant Nexa | Digital Operating System for the Future",
  description:
    "Adyant Nexa is your Digital OS — Ultra-fast cinematic web architecture, neural-marketing with AI-driven ROI precision, and bespoke AI tools for business automation.",
  keywords:
    "digital agency india, neural marketing, AI tools, next.js agency, meta ads india, web architecture, adyant nexa",
  icons: {
    icon: [
      { url: "/Favicon transparent.png", sizes: "32x32", type: "image/png" },
      { url: "/Favicon transparent.png", sizes: "16x16", type: "image/png" }
    ],
    shortcut: "/Favicon transparent.png",
    apple: "/Favicon transparent.png",
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/Favicon transparent.png",
      },
    ],
  },
  openGraph: {
    title: "Adyant Nexa | Digital Operating System for the Future",
    description:
      "High-Performance Web Architecture. Neural-Marketing. Custom AI Tools.",
    type: "website",
    images: [
      {
        url: "/Fb &Insta.png",
        width: 1080,
        height: 1080,
        alt: "Adyant Nexa — Digital Operating System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adyant Nexa | Digital Operating System for the Future",
    description: "High-Performance Web Architecture. Neural-Marketing. Custom AI Tools.",
    images: ["/Fb &Insta.png"],
  },
};

import { ClientWrapper } from "@/components/ClientWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          <TransitionProvider>
            <GlobalUI />
            <ClientWrapper>{children}</ClientWrapper>
          </TransitionProvider>
        </ErrorBoundary>
        <GoogleAnalytics gaId="G-TKCBJ0Z6QL" />
      </body>
    </html>
  );
}
