#!/usr/bin/env npx tsx

/**
 * Creates missing proprietary tools that we need for alternatives
 */

const API_URL = 'http://localhost:3000/api/graphql';
const COOKIE = 'keystonejs-session=Fe26.2**8a2fcd4c2d9bc939b3cc28542a639b12c3eed0dec1b526e75b32e45de1ba2d8b*X3g_cQT7ez1wbclLVAB39g*gaS3FK0DuGfWV42jt1Pa8ujisYL9EritA00LfPcDTECHbR5JxxO26FmZZoL7MOfEZeIn5AkZx4W7rwS56cTZ_g*1782354848471*ae958af088017c959dac0dfe5bdf20cce674a03e729e836ce769439915752092*TYzuBn3xln_F7Sk4YAtb_2Qi5yakckgcb5AalHb8Ho0';

interface ToolData {
  name: string;
  slug: string;
  description: string;
  websiteUrl: string;
  category: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
}

// Tools that are missing from the database
const MISSING_TOOLS: ToolData[] = [];

async function makeGraphQLRequest(query: string, variables?: any) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': COOKIE,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

async function getCategories() {
  const data = await makeGraphQLRequest(`
    query {
      categories {
        id
        name
      }
    }
  `);
  return data.categories;
}

async function createTool(toolData: ToolData, categoryId: string) {
  const mutation = `
    mutation CreateTool($data: ToolCreateInput!) {
      createTool(data: $data) {
        id
        name
        slug
      }
    }
  `;

  const variables = {
    data: {
      name: toolData.name,
      slug: toolData.slug,
      description: toolData.description,
      isOpenSource: false,
      websiteUrl: toolData.websiteUrl,
      simpleIconSlug: toolData.simpleIconSlug,
      simpleIconColor: toolData.simpleIconColor,
      category: {
        connect: { id: categoryId }
      }
    }
  };

  return await makeGraphQLRequest(mutation, variables);
}

async function addMissingTools() {
  console.log('🔨 Adding missing proprietary tools...\n');

  try {
    const categories = await getCategories();
    console.log(`Found ${categories.length} categories`);

    // Helper function to find category ID
    const findCategoryId = (categoryName: string) => {
      const category = categories.find((c: any) => 
        c.name.toLowerCase().includes(categoryName.toLowerCase())
      );
      return category?.id;
    };

    let createdCount = 0;

    for (const tool of MISSING_TOOLS) {
      try {
        const categoryId = findCategoryId(tool.category);
        if (!categoryId) {
          console.log(`❌ Category "${tool.category}" not found for ${tool.name}`);
          continue;
        }

        console.log(`➕ Creating ${tool.name}...`);
        const result = await createTool(tool, categoryId);
        console.log(`✅ Created ${result.createTool.name} (${result.createTool.slug})`);
        createdCount++;

        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`❌ Failed to create ${tool.name}:`, error);
      }
    }

    console.log(`\n🎉 Created ${createdCount} new tools!`);

    if (MISSING_TOOLS.length === 0) {
      console.log('✅ No missing tools found! All tools appear to exist in the database.');
    }

  } catch (error) {
    console.error('❌ Error adding missing tools:', error);
    process.exit(1);
  }
}

// Run the script
addMissingTools();