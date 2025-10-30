import { AlternativesPageServer } from '@/features/public-site/screens/AlternativesPageServer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AlternativePageRoute({ params }: PageProps) {
  const { slug } = await params;
  
  return <AlternativesPageServer slug={slug} />;
}