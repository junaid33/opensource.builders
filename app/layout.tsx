import type { Metadata } from "next";
import { Inter, Nothing_You_Could_Do } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap'
});

const handwriting = Nothing_You_Could_Do({
  variable: "--font-handwriting",
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
        className={`${inter.variable} ${handwriting.variable} font-inter antialiased bg-white text-gray-800`}
      >
        {children}
      </body>
    </html>
  );
}
