#!/usr/bin/env npx tsx

/**
 * Adds open source alternatives to existing proprietary tools (FIXED VERSION)
 */

const API_URL = 'http://localhost:3000/api/graphql';
const COOKIE = 'keystonejs-session=Fe26.2**8a2fcd4c2d9bc939b3cc28542a639b12c3eed0dec1b526e75b32e45de1ba2d8b*X3g_cQT7ez1wbclLVAB39g*gaS3FK0DuGfWV42jt1Pa8ujisYL9EritA00LfPcDTECHbR5JxxO26FmZZoL7MOfEZeIn5AkZx4W7rwS56cTZ_g*1782354848471*ae958af088017c959dac0dfe5bdf20cce674a03e729e836ce769439915752092*TYzuBn3xln_F7Sk4YAtb_2Qi5yakckgcb5AalHb8Ho0';

interface AlternativeData {
  proprietarySlug: string;
  openSourceAlternatives: {
    name: string;
    slug: string;
    description: string;
    repositoryUrl: string;
    websiteUrl?: string;
    similarityScore: string;
    comparisonNotes: string;
  }[];
}

// Alternatives to add
const ALTERNATIVES_TO_ADD: AlternativeData[] = [
  {
    proprietarySlug: 'chatgpt',
    openSourceAlternatives: [
      {
        name: 'Ollama',
        slug: 'ollama',
        description: 'Get up and running with Llama 2, Mistral, and other large language models locally',
        repositoryUrl: 'https://github.com/ollama/ollama',
        websiteUrl: 'https://ollama.ai',
        similarityScore: "0.85",
        comparisonNotes: 'Local LLM runtime that can run various models like Llama 2, Mistral, and others offline'
      },
      {
        name: 'Text Generation WebUI',
        slug: 'text-generation-webui',
        description: 'A gradio web UI for running Large Language Models like LLaMA, llama.cpp, GPT-J, Pythia, OPT, and GALACTICA',
        repositoryUrl: 'https://github.com/oobabooga/text-generation-webui',
        similarityScore: "0.80",
        comparisonNotes: 'Web interface for running various open source LLMs with chat functionality'
      }
    ]
  },
  {
    proprietarySlug: 'google-drive',
    openSourceAlternatives: [
      {
        name: 'Nextcloud',
        slug: 'nextcloud',
        description: 'A safe home for all your data',
        repositoryUrl: 'https://github.com/nextcloud/server',
        websiteUrl: 'https://nextcloud.com',
        similarityScore: "0.90",
        comparisonNotes: 'Full-featured cloud storage and collaboration platform with file sync, sharing, and office integration'
      }
    ]
  },
  {
    proprietarySlug: 'freshbooks',
    openSourceAlternatives: [
      {
        name: 'Akaunting',
        slug: 'akaunting',
        description: 'Free and Online Accounting Software',
        repositoryUrl: 'https://github.com/akaunting/akaunting',
        websiteUrl: 'https://akaunting.com',
        similarityScore: "0.85",
        comparisonNotes: 'Modern accounting software with invoicing, expense tracking, and financial reporting'
      }
    ]
  },
  {
    proprietarySlug: 'obsidian',
    openSourceAlternatives: [
      {
        name: 'Joplin',
        slug: 'joplin',
        description: 'An open source note taking and to-do application with synchronization capabilities',
        repositoryUrl: 'https://github.com/laurent22/joplin',
        websiteUrl: 'https://joplinapp.org',
        similarityScore: "0.82",
        comparisonNotes: 'Cross-platform note-taking with markdown support, encryption, and synchronization'
      },
      {
        name: 'Trilium Notes',
        slug: 'trilium-notes',
        description: 'Build your personal knowledge base with Trilium Notes',
        repositoryUrl: 'https://github.com/zadam/trilium',
        websiteUrl: 'https://github.com/zadam/trilium',
        similarityScore: "0.85",
        comparisonNotes: 'Hierarchical note-taking with advanced linking, scripting, and customization capabilities'
      }
    ]
  },
  {
    proprietarySlug: 'postman',
    openSourceAlternatives: [
      {
        name: 'Insomnia',
        slug: 'insomnia',
        description: 'The open-source, cross-platform API client for GraphQL, REST, and gRPC',
        repositoryUrl: 'https://github.com/Kong/insomnia',
        websiteUrl: 'https://insomnia.rest',
        similarityScore: "0.88",
        comparisonNotes: 'Professional API client with GraphQL, REST, and gRPC support, environment management'
      }
    ]
  },
  {
    proprietarySlug: 'quickbooks',
    openSourceAlternatives: [
      {
        name: 'Invoice Ninja',
        slug: 'invoice-ninja',
        description: 'Invoices, Expenses and Tasks built with Laravel and Flutter',
        repositoryUrl: 'https://github.com/invoiceninja/invoiceninja',
        websiteUrl: 'https://invoiceninja.com',
        similarityScore: "0.80",
        comparisonNotes: 'Comprehensive business management with invoicing, expense tracking, and project management'
      }
    ]
  },
  {
    proprietarySlug: 'teamviewer',
    openSourceAlternatives: [
      {
        name: 'Apache Guacamole',
        slug: 'apache-guacamole',
        description: 'Apache Guacamole is a clientless remote desktop gateway',
        repositoryUrl: 'https://github.com/apache/guacamole-server',
        websiteUrl: 'https://guacamole.apache.org',
        similarityScore: "0.75",
        comparisonNotes: 'Web-based remote desktop gateway supporting VNC, RDP, and SSH protocols'
      }
    ]
  },
  {
    proprietarySlug: 'zoom',
    openSourceAlternatives: [
      {
        name: 'BigBlueButton',
        slug: 'bigbluebutton',
        description: 'Complete open source web conferencing system',
        repositoryUrl: 'https://github.com/bigbluebutton/bigbluebutton',
        websiteUrl: 'https://bigbluebutton.org',
        similarityScore: "0.80",
        comparisonNotes: 'Educational-focused web conferencing with whiteboard, breakout rooms, and recording'
      }
    ]
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

async function createOpenSourceTool(toolData: any) {
  const mutation = `
    mutation CreateTool($data: ToolCreateInput!) {
      createTool(data: $data) {
        id
        name
        slug
      }
    }
  `;

  // Find appropriate category (use Development Tools as default)
  const categoriesData = await makeGraphQLRequest(`
    query {
      categories(where: { name: { contains: "Development" } }) {
        id
        name
      }
    }
  `);

  let categoryId = categoriesData.categories[0]?.id;
  
  if (!categoryId) {
    // Fallback to any category
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

async function addAlternatives() {
  console.log('🔗 Adding alternatives to existing tools...\n');

  let createdTools = 0;
  let createdAlternatives = 0;

  for (const alternative of ALTERNATIVES_TO_ADD) {
    try {
      console.log(`\n📋 Processing alternatives for ${alternative.proprietarySlug}...`);

      // Find the proprietary tool
      const proprietaryTool = await findTool(alternative.proprietarySlug);
      if (!proprietaryTool) {
        console.log(`❌ Proprietary tool "${alternative.proprietarySlug}" not found`);
        continue;
      }

      console.log(`✅ Found proprietary tool: ${proprietaryTool.name}`);

      // Process each open source alternative
      for (const osAlt of alternative.openSourceAlternatives) {
        try {
          // Check if the open source tool already exists
          let openSourceTool = await findTool(osAlt.slug);
          
          if (!openSourceTool) {
            console.log(`  ➕ Creating open source tool: ${osAlt.name}...`);
            const result = await createOpenSourceTool(osAlt);
            openSourceTool = { id: result.createTool.id, name: result.createTool.name };
            createdTools++;
          } else {
            console.log(`  ✅ Open source tool already exists: ${openSourceTool.name}`);
          }

          // Check if alternative relationship already exists
          const existingAlternative = await makeGraphQLRequest(`
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
            proprietaryId: proprietaryTool.id, 
            openSourceId: openSourceTool.id 
          });

          if (existingAlternative.alternatives.length === 0) {
            console.log(`  🔗 Creating alternative relationship...`);
            const result = await createAlternative(
              proprietaryTool.id, 
              openSourceTool.id, 
              osAlt.similarityScore, 
              osAlt.comparisonNotes
            );
            console.log(`  ✅ Created alternative: ${result.createAlternative.openSourceTool.name} (${result.createAlternative.similarityScore})`);
            createdAlternatives++;
          } else {
            console.log(`  ✅ Alternative relationship already exists`);
          }

          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 200));

        } catch (error) {
          console.log(`  ❌ Failed to process ${osAlt.name}:`, error);
        }
      }

    } catch (error) {
      console.log(`❌ Failed to process ${alternative.proprietarySlug}:`, error);
    }
  }

  console.log(`\n🎉 Summary:`);
  console.log(`   Created ${createdTools} new open source tools`);
  console.log(`   Created ${createdAlternatives} new alternative relationships`);
}

// Run the script
addAlternatives();