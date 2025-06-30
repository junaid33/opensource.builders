#!/usr/bin/env npx tsx

/**
 * Adds open source alternatives to existing proprietary tools
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
    similarityScore: number;
    notes: string;
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
        similarityScore: 85,
        notes: 'Local LLM runtime that can run various models like Llama 2, Mistral, and others offline'
      },
      {
        name: 'Text Generation WebUI',
        slug: 'text-generation-webui',
        description: 'A gradio web UI for running Large Language Models like LLaMA, llama.cpp, GPT-J, Pythia, OPT, and GALACTICA',
        repositoryUrl: 'https://github.com/oobabooga/text-generation-webui',
        similarityScore: 80,
        notes: 'Web interface for running various open source LLMs with chat functionality'
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
        similarityScore: 90,
        notes: 'Full-featured cloud storage and collaboration platform with file sync, sharing, and office integration'
      },
      {
        name: 'Seafile',
        slug: 'seafile',
        description: 'High performance file syncing and sharing, with also Markdown WYSIWYG editing, Wiki, file label and other knowledge management features',
        repositoryUrl: 'https://github.com/haiwen/seafile',
        similarityScore: 85,
        notes: 'Enterprise-grade file sync and share solution with strong security and performance'
      }
    ]
  },
  {
    proprietarySlug: 'freshbooks',
    openSourceAlternatives: [
      {
        name: 'Invoice Ninja',
        slug: 'invoice-ninja',
        description: 'Invoices, Expenses and Tasks built with Laravel and Flutter',
        repositoryUrl: 'https://github.com/invoiceninja/invoiceninja',
        similarityScore: 90,
        notes: 'Comprehensive invoicing and billing solution with time tracking, expense management, and client portal'
      },
      {
        name: 'Akaunting',
        slug: 'akaunting',
        description: 'Free and Online Accounting Software',
        repositoryUrl: 'https://github.com/akaunting/akaunting',
        similarityScore: 85,
        notes: 'Modern accounting software with invoicing, expense tracking, and financial reporting'
      }
    ]
  },
  {
    proprietarySlug: 'obsidian',
    openSourceAlternatives: [
      {
        name: 'Logseq',
        slug: 'logseq',
        description: 'A privacy-first, open-source platform for knowledge management and collaboration',
        repositoryUrl: 'https://github.com/logseq/logseq',
        similarityScore: 88,
        notes: 'Block-based note-taking with bi-directional linking, local-first approach'
      },
      {
        name: 'Joplin',
        slug: 'joplin',
        description: 'An open source note taking and to-do application with synchronization capabilities',
        repositoryUrl: 'https://github.com/laurent22/joplin',
        similarityScore: 82,
        notes: 'Cross-platform note-taking with markdown support, encryption, and synchronization'
      },
      {
        name: 'Trilium Notes',
        slug: 'trilium-notes',
        description: 'Build your personal knowledge base with Trilium Notes',
        repositoryUrl: 'https://github.com/zadam/trilium',
        similarityScore: 85,
        notes: 'Hierarchical note-taking with advanced linking, scripting, and customization capabilities'
      }
    ]
  },
  {
    proprietarySlug: 'postman',
    openSourceAlternatives: [
      {
        name: 'Hoppscotch',
        slug: 'hoppscotch',
        description: 'Open source API development ecosystem',
        repositoryUrl: 'https://github.com/hoppscotch/hoppscotch',
        similarityScore: 92,
        notes: 'Modern API testing tool with real-time collaboration, GraphQL support, and WebSocket testing'
      },
      {
        name: 'Insomnia',
        slug: 'insomnia',
        description: 'The open-source, cross-platform API client for GraphQL, REST, and gRPC',
        repositoryUrl: 'https://github.com/Kong/insomnia',
        similarityScore: 88,
        notes: 'Professional API client with GraphQL, REST, and gRPC support, environment management'
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
        similarityScore: 80,
        notes: 'Comprehensive business management with invoicing, expense tracking, and project management'
      },
      {
        name: 'Akaunting',
        slug: 'akaunting',
        description: 'Free and Online Accounting Software',
        repositoryUrl: 'https://github.com/akaunting/akaunting',
        similarityScore: 85,
        notes: 'Full accounting solution with double-entry bookkeeping, financial reporting, and multi-currency support'
      }
    ]
  },
  {
    proprietarySlug: 'teamviewer',
    openSourceAlternatives: [
      {
        name: 'RustDesk',
        slug: 'rustdesk',
        description: 'An open-source remote desktop, and alternative to TeamViewer',
        repositoryUrl: 'https://github.com/rustdesk/rustdesk',
        similarityScore: 90,
        notes: 'Full-featured remote desktop solution with self-hosted server option, cross-platform support'
      },
      {
        name: 'Apache Guacamole',
        slug: 'apache-guacamole',
        description: 'Apache Guacamole is a clientless remote desktop gateway',
        repositoryUrl: 'https://github.com/apache/guacamole-server',
        similarityScore: 75,
        notes: 'Web-based remote desktop gateway supporting VNC, RDP, and SSH protocols'
      }
    ]
  },
  {
    proprietarySlug: 'zoom',
    openSourceAlternatives: [
      {
        name: 'Jitsi Meet',
        slug: 'jitsi-meet',
        description: 'Jitsi Meet - Secure, Simple and Scalable Video Conferences',
        repositoryUrl: 'https://github.com/jitsi/jitsi-meet',
        similarityScore: 85,
        notes: 'Open source video conferencing with screen sharing, recording, and no account required'
      },
      {
        name: 'BigBlueButton',
        slug: 'bigbluebutton',
        description: 'Complete open source web conferencing system',
        repositoryUrl: 'https://github.com/bigbluebutton/bigbluebutton',
        similarityScore: 80,
        notes: 'Educational-focused web conferencing with whiteboard, breakout rooms, and recording'
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
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
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

  // Find appropriate category (for now, use a default one)
  const categoriesData = await makeGraphQLRequest(`
    query {
      categories {
        id
        name
      }
    }
  `);

  const defaultCategory = categoriesData.categories[0]; // Use first category as default

  const variables = {
    data: {
      name: toolData.name,
      slug: toolData.slug,
      description: toolData.description,
      isOpenSource: true,
      repositoryUrl: toolData.repositoryUrl,
      category: {
        connect: { id: defaultCategory.id }
      }
    }
  };

  return await makeGraphQLRequest(mutation, variables);
}

async function createAlternative(proprietaryToolId: string, openSourceToolId: string, similarityScore: number, notes: string) {
  const mutation = `
    mutation CreateAlternative($data: AlternativeCreateInput!) {
      createAlternative(data: $data) {
        id
        proprietaryTool { name }
        openSourceTool { name }
      }
    }
  `;

  const variables = {
    data: {
      proprietaryTool: { connect: { id: proprietaryToolId } },
      openSourceTool: { connect: { id: openSourceToolId } },
      similarityScore,
      notes
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
            await createAlternative(proprietaryTool.id, openSourceTool.id, osAlt.similarityScore, osAlt.notes);
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