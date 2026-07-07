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
  metadataBase: new URL("https://opensource.builders"),
  title: {
    default: "opensource.builders - Find Open Source Alternatives",
    template: "%s | opensource.builders",
  },
  description:
    "Discover open source alternatives to popular proprietary software. Compare features, capabilities, and find the best open source tools for your needs.",
  keywords: [
    "open source",
    "alternatives",
    "free software",
    "FOSS",
    "open source alternatives",
    "software comparison",
  ],
  authors: [{ name: "opensource.builders" }],
  creator: "opensource.builders",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "opensource.builders",
    title: "opensource.builders - Find Open Source Alternatives",
    description:
      "Discover open source alternatives to popular proprietary software. Compare features, capabilities, and find the best open source tools for your needs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "opensource.builders - Find Open Source Alternatives",
    description:
      "Discover open source alternatives to popular proprietary software.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.svg" rel="icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
