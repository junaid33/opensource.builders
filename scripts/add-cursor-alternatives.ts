#!/usr/bin/env npx tsx

/**
 * Script to add open source alternatives for Cursor AI code editor
 * Usage: npx tsx scripts/add-cursor-alternatives.ts
 */

import { GraphQLClient } from 'graphql-request';

// Initialize GraphQL client
const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    Cookie: `keystonejs-session=${process.env.KEYSTONE_SESSION || 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'}`
  }
});

interface ToolData {
  name: string;
  slug: string;
  description: string;
  isOpenSource: boolean;
  repositoryUrl?: string;
  websiteUrl?: string;
  githubStars?: number;
}

const cursorAlternatives: ToolData[] = [
  {
    name: "Roo Code",
    slug: "roo-code", 
    description: "Open source AI-powered code editor focused on developer productivity and intelligent code assistance",
    isOpenSource: true,
    repositoryUrl: "https://github.com/roo-dev/roo-code"
  },
  {
    name: "Cline",
    slug: "cline",
    description: "Autonomous AI coding assistant that can edit files, run terminal commands, and use browser automation",
    isOpenSource: true,
    repositoryUrl: "https://github.com/clinebot/cline"
  },
  {
    name: "KiloCode", 
    slug: "kilo-code",
    description: "Lightweight AI-enhanced code editor with smart completions and refactoring capabilities",
    isOpenSource: true,
    repositoryUrl: "https://github.com/kilo-editor/kilo-code"
  },
  {
    name: "Plandex",
    slug: "plandex", 
    description: "AI-powered coding assistant that helps plan, generate, and refactor code across large codebases",
    isOpenSource: true,
    repositoryUrl: "https://github.com/plandex-ai/plandex"
  },
  {
    name: "Gemini CLI",
    slug: "gemini-cli",
    description: "Command-line AI coding assistant powered by Google's Gemini for code generation and analysis", 
    isOpenSource: true,
    repositoryUrl: "https://github.com/google-gemini/gemini-cli"
  },
  {
    name: "Void Editor",
    slug: "void-editor",
    description: "Modern AI-enhanced code editor with intelligent suggestions and collaborative features",
    isOpenSource: true,
    repositoryUrl: "https://github.com/void-org/void-editor"
  }
];

const CREATE_TOOL_MUTATION = `
  mutation CreateTool($data: ToolCreateInput!) {
    createTool(data: $data) {
      id
      name
      slug
    }
  }
`;

const CREATE_ALTERNATIVE_MUTATION = `
  mutation CreateAlternative($data: AlternativeCreateInput!) {
    createAlternative(data: $data) {
      id
      proprietaryTool { name }
      openSourceTool { name }
    }
  }
`;

const GET_CURSOR_QUERY = `
  query {
    tools(where: { slug: { equals: "cursor" } }) {
      id
      name
      slug
    }
  }
`;

const GET_CATEGORY_QUERY = `
  query {
    categories(where: { name: { equals: "Development Tools" } }) {
      id
      name
    }
  }
`;

async function main() {
  try {
    console.log('🚀 Starting Cursor alternatives import...');

    // Get Development Tools category
    const categoryResult = await client.request(GET_CATEGORY_QUERY);
    const developmentCategory = categoryResult.categories[0];
    
    if (!developmentCategory) {
      throw new Error('Development Tools category not found');
    }
    
    console.log(`✅ Found category: ${developmentCategory.name} (${developmentCategory.id})`);

    // Get Cursor tool
    const cursorResult = await client.request(GET_CURSOR_QUERY);
    const cursorTool = cursorResult.tools[0];
    
    if (!cursorTool) {
      throw new Error('Cursor tool not found. Please create it first.');
    }
    
    console.log(`✅ Found Cursor tool: ${cursorTool.name} (${cursorTool.id})`);

    // Create each alternative tool
    const createdTools = [];
    
    for (const toolData of cursorAlternatives) {
      console.log(`📝 Creating ${toolData.name}...`);
      
      try {
        const toolInput = {
          ...toolData,
          category: {
            connect: { id: developmentCategory.id }
          }
        };

        const result = await client.request(CREATE_TOOL_MUTATION, { data: toolInput });
        createdTools.push(result.createTool);
        console.log(`✅ Created ${result.createTool.name} (${result.createTool.id})`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Failed to create ${toolData.name}:`, error);
      }
    }

    // Create alternative relationships
    console.log('\n🔗 Creating alternative relationships...');
    
    for (const tool of createdTools) {
      try {
        console.log(`📝 Linking ${tool.name} as alternative to Cursor...`);
        
        const alternativeData = {
          proprietaryTool: { connect: { id: cursorTool.id } },
          openSourceTool: { connect: { id: tool.id } },
          similarityScore: 85, // Default similarity score
          notes: `Open source alternative to Cursor with AI-powered coding features`
        };

        const result = await client.request(CREATE_ALTERNATIVE_MUTATION, { data: alternativeData });
        console.log(`✅ Created alternative relationship: ${result.createAlternative.proprietaryTool.name} ↔ ${result.createAlternative.openSourceTool.name}`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Failed to create alternative relationship for ${tool.name}:`, error);
      }
    }

    console.log(`\n🎉 Successfully imported ${createdTools.length} Cursor alternatives!`);
    console.log('\nCreated tools:');
    createdTools.forEach(tool => console.log(`  - ${tool.name} (${tool.slug})`));

  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}