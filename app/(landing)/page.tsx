import { StorefrontHomePage } from "@/features/storefront/screens/StorefrontHomePage";
import { LandingPage } from "@/features/landing/screens/LandingPage";
interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HomePage({ searchParams }: PageProps) {
  return <LandingPage searchParams={searchParams} />
}
