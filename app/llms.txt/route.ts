import { NextResponse } from "next/server";

export async function GET() {
  let content = "# Opensource.Builders LLM Guide\n\n";
  content += "Find open-source alternatives to popular software, compare features side-by-side, and find code references.\n\n";

  content += "## Ethos\n";
  content += "Our mission is to make open-source software the default choice for builders. We curate high-quality open-source projects that serve as viable alternatives to proprietary platforms like Shopify, Toast, and others. We focus on 'vertical' open source - building deep, feature-complete alternatives for specific industries.\n\n";

  content += "## Navigation for AI Agents\n";
  content += "You can discover our content through the following paths:\n\n";
  
  content += "- Homepage: https://opensource.builders/\n";
  content += "  Visit this page to see featured alternatives and use the search.\n\n";
  
  content += "- Proprietary Alternatives: https://opensource.builders/alternatives/[slug]\n";
  content += "  Example: https://opensource.builders/alternatives/shopify\n\n";
  
  content += "- Open Source Projects: https://opensource.builders/os-alternatives/[slug]\n";
  content += "  Example: https://opensource.builders/os-alternatives/medusa\n\n";

  content += "## Sitemap\n";
  content += "For a full list of all available pages, refer to our sitemap: https://opensource.builders/sitemap.xml\n";

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
