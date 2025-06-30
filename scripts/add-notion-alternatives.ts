#!/usr/bin/env npx tsx

/**
 * Add AFFiNE and Typst as Notion alternatives
 */

const API_URL = 'http://localhost:3000/api/graphql';
const COOKIE = 'keystonejs-session=Fe26.2**8a2fcd4c2d9bc939b3cc28542a639b12c3eed0dec1b526e75b32e45de1ba2d8b*X3g_cQT7ez1wbclLVAB39g*gaS3FK0DuGfWV42jt1Pa8ujisYL9EritA00LfPcDTECHbR5JxxO26FmZZoL7MOfEZeIn5AkZx4W7rwS56cTZ_g*1782354848471*ae958af088017c959dac0dfe5bdf20cce674a03e729e836ce769439915752092*TYzuBn3xln_F7Sk4YAtb_2Qi5yakckgcb5AalHb8Ho0';

interface NewAlternative {
  name: string;
  slug: string;
  description: string;
  repositoryUrl: string;
  websiteUrl?: string;
  similarityScore: string;
  comparisonNotes: string;
}

const NOTION_ALTERNATIVES: NewAlternative[] = [
  {
    name: 'AFFiNE',
    slug: 'affine',
    description: 'A next-gen knowledge base that brings planning, sorting and creating all together',
    repositoryUrl: 'https://github.com/toeverything/AFFiNE',
    websiteUrl: 'https://affine.pro',
    similarityScore: '0.88',
    comparisonNotes: 'Modern block-based editor with privacy-first approach, local-first architecture, and collaborative features similar to Notion'
  },
  {
    name: 'Typst',
    slug: 'typst',
    description: 'A new markup-based typesetting system that is powerful and easy to learn',
    repositoryUrl: 'https://github.com/typst/typst',
    websiteUrl: 'https://typst.app',
    similarityScore: '0.70',
    comparisonNotes: 'Scientific document creation tool with real-time collaboration, more focused on academic/technical writing than general note-taking'
  }
];

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
    const text = await response.text();
    console.log('HTTP Error Response:', text);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    console.log('GraphQL Errors:', JSON.stringify(data.errors, null, 2));
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

async function findTool(slug: string) {
  const data = await makeGraphQLRequest(`
    query FindTool($slug: String!) {
      tools(where: { slug: { equals: $slug } }) {
        id
        name
        slug
        isOpenSource
      }
    }
  `, { slug });

  return data.tools[0] || null;
}

async function createOpenSourceTool(toolData: NewAlternative) {
  const mutation = `
    mutation CreateTool($data: ToolCreateInput!) {
      createTool(data: $data) {
        id
        name
        slug
      }
    }
  `;

  // Find appropriate category (Notes & Knowledge Management)
  const categoriesData = await makeGraphQLRequest(`
    query {
      categories(where: { name: { contains: "Knowledge" } }) {
        id
        name
      }
    }
  `);

  let categoryId = categoriesData.categories[0]?.id;
  
  if (!categoryId) {
    // Fallback to any category containing "Note"
    const noteCategories = await makeGraphQLRequest(`
      query {
        categories(where: { name: { contains: "Note" } }) {
          id
          name
        }
      }
    `);
    categoryId = noteCategories.categories[0]?.id;
  }

  if (!categoryId) {
    // Final fallback to first available category
    const allCategories = await makeGraphQLRequest(`
      query {
        categories {
          id
          name
        }
      }
    `);
    categoryId = allCategories.categories[0]?.id;
  }

  const variables = {
    data: {
      name: toolData.name,
      slug: toolData.slug,
      description: toolData.description,
      isOpenSource: true,
      repositoryUrl: toolData.repositoryUrl,
      websiteUrl: toolData.websiteUrl,
      category: {
        connect: { id: categoryId }
      }
    }
  };

  return await makeGraphQLRequest(mutation, variables);
}

async function createAlternative(proprietaryToolId: string, openSourceToolId: string, similarityScore: string, comparisonNotes: string) {
  const mutation = `
    mutation CreateAlternative($data: AlternativeCreateInput!) {
      createAlternative(data: $data) {
        id
        proprietaryTool { name }
        openSourceTool { name }
        similarityScore
        comparisonNotes
      }
    }
  `;

  const variables = {
    data: {
      proprietaryTool: { connect: { id: proprietaryToolId } },
      openSourceTool: { connect: { id: openSourceToolId } },
      similarityScore,
      comparisonNotes
    }
  };

  return await makeGraphQLRequest(mutation, variables);
}

async function checkExistingAlternative(proprietaryToolId: string, openSourceToolId: string) {
  const data = await makeGraphQLRequest(`
    query CheckAlternative($proprietaryId: ID!, $openSourceId: ID!) {
      alternatives(where: { 
        AND: [
          { proprietaryTool: { id: { equals: $proprietaryId } } }
          { openSourceTool: { id: { equals: $openSourceId } } }
        ]
      }) {
        id
      }
    }
  `, { 
    proprietaryId: proprietaryToolId, 
    openSourceId: openSourceToolId 
  });

  return data.alternatives.length > 0;
}

async function addNotionAlternatives() {
  console.log('📝 Adding AFFiNE and Typst as Notion alternatives...\n');

  try {
    // Find Notion
    const notion = await findTool('notion');
    if (!notion) {
      console.log('❌ Notion not found in database');
      return;
    }

    console.log(`✅ Found Notion: ${notion.name} (${notion.id})`);

    let createdTools = 0;
    let createdAlternatives = 0;

    for (const altData of NOTION_ALTERNATIVES) {
      try {
        console.log(`\n📋 Processing ${altData.name}...`);

        // Check if tool already exists
        let openSourceTool = await findTool(altData.slug);
        
        if (!openSourceTool) {
          console.log(`  ➕ Creating ${altData.name}...`);
          const result = await createOpenSourceTool(altData);
          openSourceTool = { 
            id: result.createTool.id, 
            name: result.createTool.name,
            slug: result.createTool.slug 
          };
          console.log(`  ✅ Created tool: ${openSourceTool.name}`);
          createdTools++;
        } else {
          console.log(`  ✅ Tool already exists: ${openSourceTool.name}`);
        }

        // Check if alternative relationship already exists
        const exists = await checkExistingAlternative(notion.id, openSourceTool.id);
        
        if (!exists) {
          console.log(`  🔗 Creating alternative relationship...`);
          const result = await createAlternative(
            notion.id,
            openSourceTool.id,
            altData.similarityScore,
            altData.comparisonNotes
          );
          console.log(`  ✅ Created alternative: ${result.createAlternative.openSourceTool.name} (${result.createAlternative.similarityScore})`);
          createdAlternatives++;
        } else {
          console.log(`  ✅ Alternative relationship already exists`);
        }

        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.log(`  ❌ Failed to process ${altData.name}:`, error);
      }
    }

    console.log(`\n🎉 Summary:`);
    console.log(`   Created ${createdTools} new tools`);
    console.log(`   Created ${createdAlternatives} new alternative relationships`);

    // Verify final state
    console.log(`\n📋 Verification:`);
    const notionAlts = await makeGraphQLRequest(`
      query {
        alternatives(where: { proprietaryTool: { slug: { equals: "notion" } } }) {
          id
          openSourceTool { 
            name 
            slug 
          }
          similarityScore
        }
      }
    `);

    console.log(`   Notion now has ${notionAlts.alternatives.length} alternatives:`);
    notionAlts.alternatives.forEach((alt: any) => {
      console.log(`   • ${alt.openSourceTool.name} (${alt.similarityScore})`);
    });

  } catch (error) {
    console.error('❌ Error adding Notion alternatives:', error);
  }
}

// Run the script
addNotionAlternatives();