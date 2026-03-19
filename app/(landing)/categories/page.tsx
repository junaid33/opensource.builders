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
    <div className="w-[90%] max-w-[600px] mx-auto py-12">
      <div className="pb-6">
        <h1 className="font-instrument-serif text-[2rem] leading-[1.2] tracking-tight">
          Categories
        </h1>
        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
          Explore open source alternatives organized by vertical and industry.
        </p>
      </div>

      {/* Spacer */}
      <div
        className="flex items-center w-full h-3"
        style={{
          backgroundImage: 'repeating-linear-gradient(315deg, var(--color-border) 0, var(--color-border) 1px, transparent 0, transparent 50%)',
          backgroundSize: '10px 10px',
          maskImage: 'linear-gradient(90deg, #000, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, #000, transparent)',
        }}
      />

      <ul className="mt-9 list-none [&:has(>li:hover)_li:not(:hover)]:opacity-50">
        {categories.map((category) => (
          <li key={category.id} className="transition-opacity duration-200">
            <Link
              href={`/categories/${category.slug}`}
              className="flex items-center gap-2 py-1.5 no-underline group"
            >
              <span
                className="w-1.5 min-w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: category.color || '#71717a' }}
              />
              <span className="font-medium text-foreground group-hover:underline shrink truncate">
                {category.name}
              </span>
              {category.description && (
                <span className="text-muted-foreground/60 truncate shrink hidden sm:inline">
                  • {category.description}
                </span>
              )}
              <div className="flex-grow min-w-3 border-b border-dashed border-border transition-colors group-hover:border-border/60" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
