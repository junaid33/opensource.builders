import { Metadata } from "next";
import { fetchCategoryDetails } from "@/features/public-site/lib/data";
import Link from "next/link";
import ToolIcon from "@/components/ToolIcon";
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
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div 
          className="size-16 rounded-2xl mb-6 flex items-center justify-center text-4xl"
          style={{ backgroundColor: `${category.color}20`, color: category.color }}
        >
          {category.icon || "📂"}
        </div>
        <h1 className="font-instrument-serif text-5xl md:text-6xl mb-6">
          Open source alternatives for {category.name}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          {category.description || `Browse curated open source alternatives to popular ${category.name} software.`}
        </p>
      </div>

      <div className="grid gap-8">
        {category.proprietaryApplications.map((app: any) => (
          <div key={app.id} className="p-8 rounded-2xl border border-border">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="flex items-center gap-4 mb-4">
                  <ToolIcon
                    name={app.name}
                    simpleIconSlug={app.simpleIconSlug}
                    simpleIconColor={app.simpleIconColor}
                    size={48}
                  />
                  <h2 className="text-2xl font-bold">{app.name}</h2>
                </div>
                <p className="text-muted-foreground mb-6">{app.description}</p>
                <Link 
                  href={`/alternatives/${app.slug}`}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  View all alternatives →
                </Link>
              </div>
              
              <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-border pt-8 md:pt-0 md:pl-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
                  Featured Open Source Alternatives
                </h3>
                <div className="grid gap-6">
                  {app.openSourceAlternatives.map((alt: any) => (
                    <Link 
                      key={alt.id}
                      href={`/os-alternatives/${alt.slug}`}
                      className="group flex items-center justify-between p-4 rounded-xl hover:bg-accent/50 transition-colors"
                    >
                      <div>
                        <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {alt.name}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          {alt.githubStars && <span>⭐ {alt.githubStars.toLocaleString()}</span>}
                          {alt.license && <span>{alt.license}</span>}
                        </div>
                      </div>
                      <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details →
                      </span>
                    </Link>
                  ))}
                  {app.openSourceAlternatives.length === 0 && (
                    <p className="text-muted-foreground italic">No open source alternatives listed yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {category.proprietaryApplications.length === 0 && (
          <div className="text-center py-20 bg-accent/20 rounded-3xl border border-dashed border-border">
            <p className="text-xl text-muted-foreground">We are still curating alternatives for this category.</p>
            <Link href="/" className="text-primary font-medium hover:underline mt-4 inline-block">
              Go back home →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
