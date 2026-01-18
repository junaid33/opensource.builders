import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchApplicationBySlug, ComparisonApplication } from '@/features/public-site/lib/data';
import { ComparisonPageClient } from '@/features/public-site/screens/ComparisonPage';

interface PageProps {
  params: Promise<{ slugs: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slugs } = await params;
  
  if (!slugs || slugs.length < 2) {
    return {
      title: 'Compare Applications',
      description: 'Compare features and capabilities between applications.',
    };
  }

  const [slug1, slug2] = slugs;
  
  try {
    const [app1, app2] = await Promise.all([
      fetchApplicationBySlug(slug1),
      fetchApplicationBySlug(slug2),
    ]);

    if (!app1 || !app2) {
      return {
        title: 'Compare Applications',
        description: 'Compare features and capabilities between applications.',
      };
    }

    const title = `${app1.name} vs ${app2.name} - Feature Comparison`;
    const description = `Compare ${app1.name} and ${app2.name} side by side. See which features and capabilities each application offers to find the best fit for your needs.`;

    return {
      title,
      description,
      keywords: [
        app1.name,
        app2.name,
        `${app1.name} vs ${app2.name}`,
        'comparison',
        'features',
        'open source',
        'alternatives',
      ],
      openGraph: {
        title,
        description,
        url: `/compare/${slug1}/${slug2}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: `/compare/${slug1}/${slug2}`,
      },
    };
  } catch {
    return {
      title: 'Compare Applications',
      description: 'Compare features and capabilities between applications.',
    };
  }
}

export default async function ComparePage({ params }: PageProps) {
  const { slugs } = await params;

  if (!slugs || slugs.length < 2) {
    notFound();
  }

  const [slug1, slug2] = slugs;

  const [app1, app2] = await Promise.all([
    fetchApplicationBySlug(slug1),
    fetchApplicationBySlug(slug2),
  ]);

  if (!app1 || !app2) {
    notFound();
  }

  return <ComparisonPageClient app1={app1} app2={app2} />;
}
