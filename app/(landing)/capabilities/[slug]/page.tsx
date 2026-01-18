import { Metadata } from 'next';
import { CapabilitiesPageServer } from '@/features/public-site/screens/CapabilitiesPageServer';
import { fetchCapabilityApplications } from '@/features/public-site/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const { capability, openSourceApplications, proprietaryApplications } = await fetchCapabilityApplications(slug);
    const totalApps = openSourceApplications.length + proprietaryApplications.length;
    
    const title = `${capability.name} - Apps with this Capability`;
    const description = `Explore ${totalApps} applications that offer ${capability.name}. ${capability.description || ''} Compare open source and proprietary options.`;
    
    return {
      title,
      description,
      keywords: [
        capability.name,
        capability.category || 'software',
        'open source',
        'capabilities',
        'features',
        ...openSourceApplications.slice(0, 3).map(app => app.name),
      ],
      openGraph: {
        title,
        description,
        url: `/capabilities/${slug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: `/capabilities/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Capability',
      description: 'Explore applications with this capability.',
    };
  }
}

export default async function CapabilitiesPageRoute({ params }: PageProps) {
  const { slug } = await params;
  
  return <CapabilitiesPageServer slug={slug} />;
}