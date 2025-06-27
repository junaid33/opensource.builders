import type { Metadata } from "next";
import { Inter, Audiowide, Silkscreen } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap'
});

const handwriting = Audiowide({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: '400',
  display: 'swap'
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: '400',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Open Source Builders - Find Open Source Alternatives",
  description: "Discover open source alternatives to popular proprietary software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${handwriting.variable} ${silkscreen.variable} font-inter antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
