import { Metadata } from 'next';
import { AlternativesPageServer } from '@/features/public-site/screens/AlternativesPageServer';
import { fetchAlternatives } from '@/features/public-site/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const proprietaryApp = await fetchAlternatives(slug);
    const alternativeCount = proprietaryApp.openSourceAlternatives?.length || 0;
    
    const title = `Open Source Alternatives to ${proprietaryApp.name}`;
    const description = `Discover ${alternativeCount} open source alternatives to ${proprietaryApp.name}. Compare features, capabilities, and find the best free and open source replacement.`;
    
    return {
      title,
      description,
      keywords: [
        proprietaryApp.name,
        `${proprietaryApp.name} alternative`,
        `open source ${proprietaryApp.name}`,
        'open source',
        'free software',
        ...proprietaryApp.openSourceAlternatives?.slice(0, 5).map(alt => alt.name) || [],
      ],
      openGraph: {
        title,
        description,
        url: `/alternatives/${slug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: `/alternatives/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Open Source Alternatives',
      description: 'Find open source alternatives to proprietary software.',
    };
  }
}

export default async function AlternativePageRoute({ params }: PageProps) {
  const { slug } = await params;
  
  return <AlternativesPageServer slug={slug} />;
}