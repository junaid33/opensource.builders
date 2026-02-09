import { Metadata } from "next";
import { fetchAllCategories } from "@/features/public-site/lib/data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Software Categories | Opensource.Builders",
  description: "Browse open source alternatives by industry and software category.",
};

export default async function CategoriesPage() {
  const categories = await fetchAllCategories();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-instrument-serif text-5xl md:text-6xl mb-8">Categories</h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
        Explore open source alternatives organized by vertical and industry. 
        Find the right tools for your specific business needs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/categories/${category.slug}`}
            className="group p-8 rounded-2xl border border-border hover:border-primary/50 hover:bg-accent/50 transition-all"
          >
            <div 
              className="size-12 rounded-xl mb-6 flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              {category.icon || "📂"}
            </div>
            <h2 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
              {category.name}
            </h2>
            <p className="text-muted-foreground line-clamp-2">
              {category.description || `Open source alternatives for ${category.name}.`}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
