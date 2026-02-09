import { fetchAllProprietaryApps, fetchAllOpenSourceApps, fetchAllCapabilities, fetchAllCategories } from "@/features/public-site/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [proprietaryApps, openSourceApps, capabilities, categories] = await Promise.all([
      fetchAllProprietaryApps(),
      fetchAllOpenSourceApps(),
      fetchAllCapabilities(),
      fetchAllCategories(),
    ]);

    let content = "# Opensource.Builders LLM Guide\n\n";
    content += "Find open-source alternatives to popular software, compare features side-by-side, and find code references.\n\n";

    content += "## Ethos\n";
    content += "Our mission is to make open-source software the default choice for builders. We curate high-quality open-source projects that serve as viable alternatives to proprietary platforms like Shopify, Toast, and others. We focus on 'vertical' open source - building deep, feature-complete alternatives for specific industries.\n\n";

    content += "## Industries (Verticals)\n";
    categories.forEach(cat => {
      content += `### ${cat.name}\n`;
      content += `${cat.description}\n`;
      content += `URL: https://opensource.builders/categories/${cat.slug}\n\n`;
    });

    content += "## Proprietary Applications & Their Alternatives\n";
    proprietaryApps.forEach(app => {
      content += `### ${app.name}\n`;
      content += `${app.description}\n`;
      content += `URL: https://opensource.builders/alternatives/${app.slug}\n\n`;
    });

    content += "## Featured Open Source Projects\n";
    openSourceApps.forEach(app => {
      content += `### ${app.name}\n`;
      content += `${app.description}\n`;
      content += `License: ${app.license}\n`;
      content += `Repository: ${app.repositoryUrl}\n`;
      content += `URL: https://opensource.builders/os-alternatives/${app.slug}\n\n`;
    });

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error generating llms.txt:", error);
    return new NextResponse("Error generating LLM guide", { status: 500 });
  }
}
