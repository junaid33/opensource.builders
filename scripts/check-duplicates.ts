import fetch from 'node-fetch';

const GRAPHQL_ENDPOINT = 'http://localhost:3003/api/graphql';
const COOKIE = 'keystonejs-session=Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw';

async function queryGraphQL(query: string) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': COOKIE,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async function checkForDuplicates() {
  try {
    console.log('🔍 Checking for duplicate tools...\n');

    // Get all tools with their names
    const toolsQuery = `
      query {
        tools {
          id
          name
          slug
        }
      }
    `;

    const toolsResult = await queryGraphQL(toolsQuery);
    const tools = toolsResult.data?.tools || [];

    // Group tools by name (case-insensitive)
    const toolsByName = new Map<string, any[]>();
    
    tools.forEach((tool: any) => {
      const normalizedName = tool.name.toLowerCase().trim();
      if (!toolsByName.has(normalizedName)) {
        toolsByName.set(normalizedName, []);
      }
      toolsByName.get(normalizedName)!.push(tool);
    });

    // Find duplicates
    const duplicates = Array.from(toolsByName.entries())
      .filter(([name, toolList]) => toolList.length > 1)
      .map(([name, toolList]) => ({ name, tools: toolList }));

    if (duplicates.length === 0) {
      console.log('✅ No duplicate tools found! All tools have unique names.');
      return;
    }

    console.log(`❌ Found ${duplicates.length} sets of duplicate tools:\n`);

    duplicates.forEach(({ name, tools }, index) => {
      console.log(`${index + 1}. "${name}" (${tools.length} duplicates):`);
      tools.forEach((tool: any) => {
        console.log(`   - ID: ${tool.id}, Name: "${tool.name}", Slug: "${tool.slug}"`);
      });
      console.log('');
    });

    // Also check categories
    console.log('🔍 Checking for duplicate categories...\n');

    const categoriesQuery = `
      query {
        categories {
          id
          name
          slug
        }
      }
    `;

    const categoriesResult = await queryGraphQL(categoriesQuery);
    const categories = categoriesResult.data?.categories || [];

    // Group categories by name (case-insensitive)
    const categoriesByName = new Map<string, any[]>();
    
    categories.forEach((category: any) => {
      const normalizedName = category.name.toLowerCase().trim();
      if (!categoriesByName.has(normalizedName)) {
        categoriesByName.set(normalizedName, []);
      }
      categoriesByName.get(normalizedName)!.push(category);
    });

    // Find duplicates
    const categoryDuplicates = Array.from(categoriesByName.entries())
      .filter(([name, categoryList]) => categoryList.length > 1)
      .map(([name, categoryList]) => ({ name, categories: categoryList }));

    if (categoryDuplicates.length === 0) {
      console.log('✅ No duplicate categories found! All categories have unique names.');
    } else {
      console.log(`❌ Found ${categoryDuplicates.length} sets of duplicate categories:\n`);

      categoryDuplicates.forEach(({ name, categories }, index) => {
        console.log(`${index + 1}. "${name}" (${categories.length} duplicates):`);
        categories.forEach((category: any) => {
          console.log(`   - ID: ${category.id}, Name: "${category.name}", Slug: "${category.slug}"`);
        });
        console.log('');
      });
    }

    // Check for duplicate slugs (which should be unique)
    console.log('🔍 Checking for duplicate slugs...\n');

    const toolsBySlugs = new Map<string, any[]>();
    tools.forEach((tool: any) => {
      const slug = tool.slug.toLowerCase().trim();
      if (!toolsBySlugs.has(slug)) {
        toolsBySlugs.set(slug, []);
      }
      toolsBySlugs.get(slug)!.push(tool);
    });

    const slugDuplicates = Array.from(toolsBySlugs.entries())
      .filter(([slug, toolList]) => toolList.length > 1)
      .map(([slug, toolList]) => ({ slug, tools: toolList }));

    if (slugDuplicates.length === 0) {
      console.log('✅ No duplicate slugs found! All tool slugs are unique.');
    } else {
      console.log(`❌ Found ${slugDuplicates.length} sets of duplicate slugs:\n`);

      slugDuplicates.forEach(({ slug, tools }, index) => {
        console.log(`${index + 1}. Slug "${slug}" (${tools.length} duplicates):`);
        tools.forEach((tool: any) => {
          console.log(`   - ID: ${tool.id}, Name: "${tool.name}"`);
        });
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error checking for duplicates:', error);
  }
}

async function main() {
  await checkForDuplicates();
}

main();