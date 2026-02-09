import { Metadata } from "next";
import { fetchAllProprietaryApps, fetchAllOpenSourceApps, fetchAllCapabilities } from "@/features/public-site/lib/data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LLM Discoverability Guide",
  description: "A machine-readable guide to open-source alternatives for AI agents and LLMs.",
};

export default async function LlmsPage() {
  const [proprietaryApps, openSourceApps, capabilities] = await Promise.all([
    fetchAllProprietaryApps(),
    fetchAllOpenSourceApps(),
    fetchAllCapabilities(),
  ]);

  const categories = Array.from(new Set(capabilities.map(c => c.category).filter(Boolean)));

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 prose prose-slate dark:prose-invert">
      <h1 className="font-instrument-serif text-4xl md:text-5xl mb-8">LLM Discoverability Guide</h1>
      
      <section className="mb-12">
        <p className="text-xl text-muted-foreground leading-relaxed">
          This page provides a structured overview of Opensource.Builders content, optimized for both human reading and Large Language Model (LLM) consumption. 
          You can also access the raw text version at <Link href="/llms.txt" className="text-primary underline">/llms.txt</Link>.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Ethos</h2>
        <p>
          Opensource.Builders is dedicated to making open-source software the default choice for developers and businesses. 
          We curate high-quality open-source projects that serve as viable alternatives to proprietary platforms, 
          focusing on "vertical" open source—building deep, feature-complete alternatives for specific industries like retail, hospitality, and more.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span key={cat as string} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
              {cat as string}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Proprietary Applications & Alternatives</h2>
        <div className="grid gap-6">
          {proprietaryApps.map((app) => (
            <div key={app.id} className="border border-border p-6 rounded-xl hover:bg-accent/50 transition-colors">
              <h3 className="text-xl font-medium mb-2">
                <Link href={`/alternatives/${app.slug}`} className="hover:underline">
                  {app.name}
                </Link>
              </h3>
              <p className="text-muted-foreground mb-4">{app.description}</p>
              <Link 
                href={`/alternatives/${app.slug}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                View Alternatives →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Open Source Projects</h2>
        <div className="grid gap-6">
          {openSourceApps.map((app) => (
            <div key={app.id} className="border border-border p-6 rounded-xl hover:bg-accent/50 transition-colors">
              <h3 className="text-xl font-medium mb-2">
                <Link href={`/os-alternatives/${app.slug}`} className="hover:underline">
                  {app.name}
                </Link>
              </h3>
              <p className="text-muted-foreground mb-2">{app.description}</p>
              <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                <span>License: {app.license}</span>
                {app.githubStars && <span>⭐ {app.githubStars.toLocaleString()}</span>}
              </div>
              <div className="flex gap-4">
                <Link 
                  href={`/os-alternatives/${app.slug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View Details →
                </Link>
                {app.repositoryUrl && (
                  <a 
                    href={app.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-muted-foreground hover:underline"
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
