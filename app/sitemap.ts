import { MetadataRoute } from 'next';
import { makeGraphQLRequest } from '@/features/public-site/lib/graphql/client';

const BASE_URL = 'https://opensource.builders';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/ethos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/llms`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  try {
    // Fetch all proprietary applications
    const proprietaryData = await makeGraphQLRequest<{
      proprietaryApplications: { slug: string; updatedAt?: string }[];
    }>(`
      query {
        proprietaryApplications(orderBy: { name: asc }) {
          slug
          updatedAt
        }
      }
    `);

    const alternativePages: MetadataRoute.Sitemap = proprietaryData.proprietaryApplications.map(
      (app) => ({
        url: `${BASE_URL}/alternatives/${app.slug}`,
        lastModified: app.updatedAt ? new Date(app.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    );

    // Fetch all open source applications
    const osData = await makeGraphQLRequest<{
      openSourceApplications: {
        slug: string;
        updatedAt?: string;
        primaryAlternativeTo?: { id: string } | null;
      }[];
    }>(`
      query {
        openSourceApplications(orderBy: { name: asc }) {
          slug
          updatedAt
          primaryAlternativeTo {
            id
          }
        }
      }
    `);

    const osPages: MetadataRoute.Sitemap = osData.openSourceApplications
      .filter((app) => Boolean(app.primaryAlternativeTo))
      .map((app) => ({
        url: `${BASE_URL}/os-alternatives/${app.slug}`,
        lastModified: app.updatedAt ? new Date(app.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    // Fetch all capabilities
    const capabilitiesData = await makeGraphQLRequest<{
      capabilities: { slug: string; updatedAt?: string }[];
    }>(`
      query {
        capabilities(orderBy: { name: asc }) {
          slug
          updatedAt
        }
      }
    `);

    const capabilityPages: MetadataRoute.Sitemap = capabilitiesData.capabilities.map(
      (cap) => ({
        url: `${BASE_URL}/capabilities/${cap.slug}`,
        lastModified: cap.updatedAt ? new Date(cap.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })
    );

    // Fetch all categories
    const categoriesData = await makeGraphQLRequest<{
      categories: { slug: string; createdAt?: string }[];
    }>(`
      query {
        categories(orderBy: { name: asc }) {
          slug
          createdAt
        }
      }
    `);

    const categoryPages: MetadataRoute.Sitemap = categoriesData.categories.map(
      (cat) => ({
        url: `${BASE_URL}/categories/${cat.slug}`,
        lastModified: cat.createdAt ? new Date(cat.createdAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9, // Higher priority for verticals
      })
    );

    return [...staticPages, ...alternativePages, ...osPages, ...capabilityPages, ...categoryPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
