import { Inter, Instrument_Serif, Syne } from 'next/font/google';
import PublicLayout from '@/features/public-site/layouts/public-layout';
import './public-site.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  display: 'swap',
});

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} ${instrumentSerif.variable} ${syne.variable} font-sans`}>
      <PublicLayout>
        {children}
      </PublicLayout>
    </div>
  );
}