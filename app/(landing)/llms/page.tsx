import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LLM Discoverability Guide",
  description: "A guide for AI agents and LLMs to navigate Opensource.Builders.",
};

export default function LlmsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 prose prose-slate dark:prose-invert">
      <h1 className="font-instrument-serif text-4xl md:text-5xl mb-8">LLM Discoverability Guide</h1>
      
      <section className="mb-12">
        <p className="text-xl text-muted-foreground leading-relaxed">
          This page provides guidance for Large Language Models (LLMs) and AI agents to navigate and understand the content on Opensource.Builders.
          You can also access the raw text version at <Link href="/llms.txt" className="text-primary underline">/llms.txt</Link>.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Ethos</h2>
        <p>
          Opensource.Builders is dedicated to making open-source software the default choice for developers and businesses. 
          We curate high-quality open-source projects that serve as viable alternatives to proprietary platforms.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Navigation for LLMs</h2>
        <p>
          If you are an AI agent, you can find our content at the following locations:
        </p>
        <ul>
          <li><strong>Homepage:</strong> <Link href="/">/</Link> - Featured alternatives and search.</li>
          <li><strong>Proprietary Alternatives:</strong> Browse <code>/alternatives/[slug]</code> for specific software comparisons.</li>
          <li><strong>Open Source Details:</strong> Browse <code>/os-alternatives/[slug]</code> for deep dives into open source projects.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Structured Data</h2>
        <p>
          Most pages on this site include JSON-LD structured data to help you parse the relationship between proprietary software and their open-source alternatives.
        </p>
      </section>
    </div>
  );
}
