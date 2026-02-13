import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OsAlternativesPageServer } from '@/features/public-site/screens/OsAlternativesPageServer';
import { fetchOsAlternatives, isExpectedOsAlternativesError } from '@/features/public-site/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const { openSourceApp, proprietaryApp } = await fetchOsAlternatives(slug);
    
    const title = `${openSourceApp.name} - Open Source Alternative to ${proprietaryApp.name}`;
    const description = `${openSourceApp.name} is a free and open source alternative to ${proprietaryApp.name}. ${openSourceApp.githubStars ? `${openSourceApp.githubStars.toLocaleString()} GitHub stars.` : ''} ${openSourceApp.license ? `Licensed under ${openSourceApp.license}.` : ''}`;
    
    return {
      title,
      description,
      keywords: [
        openSourceApp.name,
        proprietaryApp.name,
        `${proprietaryApp.name} alternative`,
        `open source ${proprietaryApp.name}`,
        openSourceApp.license || 'open source',
        'free software',
      ],
      openGraph: {
        title,
        description,
        url: `/os-alternatives/${slug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: `/os-alternatives/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Open Source Application',
      description: 'Explore this open source application and its features.',
    };
  }
}

export default async function OsAlternativePageRoute({ params }: PageProps) {
  const { slug } = await params;

  let osAlternativesData: Awaited<ReturnType<typeof fetchOsAlternatives>>;

  try {
    osAlternativesData = await fetchOsAlternatives(slug);
  } catch (error) {
    if (isExpectedOsAlternativesError(error)) {
      notFound();
    }

    throw error;
  }

  const { openSourceApp, proprietaryApp } = osAlternativesData;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": openSourceApp.name,
    "description": openSourceApp.description,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "url": `https://opensource.builders/os-alternatives/${slug}`,
    "softwareRequirements": "Open Source",
    "license": openSourceApp.license,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "isAlternativeTo": {
      "@type": "SoftwareApplication",
      "name": proprietaryApp.name,
      "url": `https://opensource.builders/alternatives/${proprietaryApp.slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OsAlternativesPageServer slug={slug} />
    </>
  );
}