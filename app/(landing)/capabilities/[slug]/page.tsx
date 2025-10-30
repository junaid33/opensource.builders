import { CapabilitiesPageServer } from '@/features/public-site/screens/CapabilitiesPageServer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CapabilitiesPageRoute({ params }: PageProps) {
  const { slug } = await params;
  
  return <CapabilitiesPageServer slug={slug} />;
}