import { LandingPage } from "@/features/landing/screens/LandingPage";

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function HomePage({ searchParams }: PageProps) {
  return <LandingPage searchParams={searchParams} />
}
