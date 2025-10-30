import { OsAlternativesPageServer } from '@/features/public-site/screens/OsAlternativesPageServer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function OsAlternativePageRoute({ params }: PageProps) {
  const { slug } = await params;
  
  return <OsAlternativesPageServer slug={slug} />;
}