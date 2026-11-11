import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Syne, Inter, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
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
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://adyantnexa.com"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Adyant Nexa | Autonomous AI Sales Engine & Digital Operating System",
    template: "%s | Adyant Nexa",
  },
  description:
    "Adyant Nexa is your Digital OS — Autonomous AI sales engines and high-performance web architecture. Qualify Dubai property buyers in 90 seconds, eliminate midnight lead loss, and scale conversion velocity.",
  keywords:
    "dubai real estate ai, autonomous sales agent, whatsapp bant qualification, meta ads dubai, digital operating system, adyant nexa",
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
    title: "Adyant Nexa | Autonomous AI Sales Engine & Digital Operating System",
    description:
      "Autonomous AI sales engines and high-performance web architecture. Qualify Dubai property buyers in 90 seconds and eliminate midnight lead loss.",
    url: "https://adyantnexa.com",
    siteName: "Adyant Nexa",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/Fb%20%26Insta.png",
        width: 1080,
        height: 1080,
        alt: "Adyant Nexa — Digital Operating System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adyant Nexa | Autonomous AI Sales Engine & Digital Operating System",
    description: "Autonomous AI sales engines and high-performance web architecture. Qualify Dubai property buyers in 90 seconds.",
    images: ["/Fb%20%26Insta.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://adyantnexa.com/#organization",
      "name": "Adyant Nexa",
      "url": "https://adyantnexa.com",
      "logo": "https://adyantnexa.com/Favicon%20transparent.png",
      "description": "Autonomous AI Sales Engines and High-Performance Digital Architecture.",
      "sameAs": [
        "https://www.instagram.com/adyantnexa"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://adyantnexa.com/#website",
      "url": "https://adyantnexa.com",
      "name": "Adyant Nexa",
      "publisher": {
        "@id": "https://adyantnexa.com/#organization"
      }
    }
  ]
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
      className={`${syne.variable} ${inter.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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
