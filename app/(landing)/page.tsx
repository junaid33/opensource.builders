import type { Metadata } from "next";

import { LandingPage } from "@/features/public-site/screens/LandingPage";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <LandingPage />
}
