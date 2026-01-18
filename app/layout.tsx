import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
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
        className={`${inter.variable} ${instrumentSerif.variable} font-inter antialiased`}
      >
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
