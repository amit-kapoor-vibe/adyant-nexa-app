import type { Metadata } from "next";
import { Syne, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { ChatWidget } from "@/components/ChatWidget";

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
    icon: "/Favicon transparent.png",
    apple: "/Favicon transparent.png",
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
        <CustomCursor />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
