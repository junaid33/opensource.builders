import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LLM Discoverability Guide",
  description: "A guide for AI agents and LLMs to navigate Opensource.Builders.",
};

export default function LlmsPage() {
  return (
    <div className="w-[90%] max-w-[600px] mx-auto py-12">
      <div className="pb-6">
        <h1 className="font-instrument-serif text-[2rem] leading-[1.2] tracking-tight">
          LLM Discoverability <i>Guide</i>
        </h1>
        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
          Guidance for Large Language Models and AI agents to navigate Opensource.Builders.
          <br />
          Raw text version available at{' '}
          <Link href="/llms.txt" className="text-foreground underline">
            /llms.txt
          </Link>
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

      <section className="my-12 space-y-8">
        <div>
          <h2 className="font-instrument-serif text-[1.3rem] mb-3">
            Our <i>Ethos</i>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Opensource.Builders is dedicated to making open-source software the default choice for developers and businesses.
            We curate high-quality open-source projects that serve as viable alternatives to proprietary platforms.
          </p>
        </div>

        <div>
          <h2 className="font-instrument-serif text-[1.3rem] mb-3">
            Navigation for <i>LLMs</i>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            If you are an AI agent, you can find our content at the following locations:
          </p>
          <ul className="list-none space-y-1">
            {[
              { label: 'Homepage', path: '/', desc: 'Featured alternatives and search' },
              { label: 'Proprietary Alternatives', path: '/alternatives/[slug]', desc: 'Specific software comparisons' },
              { label: 'Open Source Details', path: '/os-alternatives/[slug]', desc: 'Deep dives into open source projects' },
              { label: 'Capabilities', path: '/capabilities/[slug]', desc: 'Apps with specific capabilities' },
              { label: 'Categories', path: '/categories', desc: 'Browse by industry vertical' },
              { label: 'Compare', path: '/compare/[slug1]/[slug2]', desc: 'Side-by-side feature comparison' },
            ].map(item => (
              <li key={item.path} className="flex items-center gap-2 py-1 text-sm group">
                <span className="w-1.5 min-w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                <span className="font-medium text-foreground">{item.label}</span>
                <code className="text-[0.69rem] font-mono text-muted-foreground/60">{item.path}</code>
                <div className="flex-grow min-w-3 border-b border-dashed border-border" />
                <span className="text-muted-foreground/60 text-[0.79rem] shrink-0">{item.desc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-instrument-serif text-[1.3rem] mb-3">
            Structured <i>Data</i>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Most pages on this site include JSON-LD structured data to help you parse the relationship between proprietary software and their open-source alternatives.
          </p>
        </div>
      </section>
    </div>
  );
}
