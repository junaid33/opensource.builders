import { Metadata } from "next";
import { fetchCategoryDetails } from "@/features/public-site/lib/data";
import { Container } from "@/features/public-site/components/shared";
import { CategoryPageClient } from "@/features/public-site/screens/CategoryPageClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await fetchCategoryDetails(slug);
    const title = `Open Source Alternatives for ${category.name}`;
    const description = category.description || `Discover the best open source alternatives for ${category.name} software.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
    };
  } catch {
    return { title: "Category Not Found" };
  }
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let category;
  try {
    category = await fetchCategoryDetails(slug);
  } catch (e) {
    notFound();
  }

  return (
    <Container>
      <CategoryPageClient category={category} />
    </Container>
  );
}
