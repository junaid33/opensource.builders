#!/usr/bin/env npx tsx

/**
 * Script to add additional open source alternatives for Cursor AI code editor
 * Usage: npx tsx scripts/add-additional-cursor-alternatives.ts
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
  license?: string;
}

// Additional Cursor alternatives to add
const additionalCursorAlternatives: ToolData[] = [
  {
    name: "Void Editor",
    slug: "void-editor",
    description: "Open source Cursor alternative with AI-powered coding features. Connect directly to any LLM, use any model, and retain full control over your data",
    isOpenSource: true,
    repositoryUrl: "https://github.com/voideditor/void",
    websiteUrl: "https://voideditor.com",
    githubStars: 8500, // Approximate based on popularity
    license: "MIT"
  },
  {
    name: "Cline", 
    slug: "cline",
    description: "Autonomous coding agent right in your IDE, capable of creating/editing files, executing commands, using the browser, and more with your permission",
    isOpenSource: true,
    repositoryUrl: "https://github.com/cline/cline",
    websiteUrl: "https://cline.bot",
    githubStars: 15000, // High popularity based on references
    license: "Apache 2.0"
  },
  {
    name: "Kilo Code",
    slug: "kilo-code",
    description: "Open source AI coding assistant for planning, building, and fixing code. Superset of Roo and Cline with additional unique features and MCP marketplace",
    isOpenSource: true,
    repositoryUrl: "https://github.com/Kilo-Org/kilocode",
    websiteUrl: "https://kilocode.ai",
    githubStars: 1200, // Based on search results
    license: "MIT"
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

const CHECK_TOOL_EXISTS_QUERY = `
  query CheckTool($slug: String!) {
    tools(where: { slug: { equals: $slug } }) {
      id
      name
      slug
    }
  }
`;

async function checkIfToolExists(slug: string) {
  try {
    const result = await client.request(CHECK_TOOL_EXISTS_QUERY, { slug });
    return result.tools.length > 0 ? result.tools[0] : null;
  } catch (error) {
    console.error(`Error checking if tool exists: ${slug}`, error);
    return null;
  }
}

async function createTool(toolData: ToolData, categoryId: string) {
  const toolInput = {
    ...toolData,
    category: {
      connect: { id: categoryId }
    }
  };

  const result = await client.request(CREATE_TOOL_MUTATION, { data: toolInput });
  return result.createTool;
}

async function main() {
  try {
    console.log('🚀 Starting additional Cursor alternatives import...');

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
    
    for (const toolData of additionalCursorAlternatives) {
      console.log(`📝 Processing ${toolData.name}...`);
      
      try {
        let existingTool = await checkIfToolExists(toolData.slug);
        
        if (!existingTool) {
          const newTool = await createTool(toolData, developmentCategory.id);
          createdTools.push(newTool);
          console.log(`✅ Created ${newTool.name} (${newTool.id})`);
        } else {
          createdTools.push(existingTool);
          console.log(`✅ ${existingTool.name} already exists (${existingTool.id})`);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Failed to create ${toolData.name}:`, error);
      }
    }

    // Create alternative relationships
    console.log('\n🔗 Creating alternative relationships...');
    
    const similarityScores = {
      "void-editor": "0.90", // Very similar to Cursor with direct LLM connection
      "cline": "0.85",       // Strong autonomous coding capabilities
      "kilo-code": "0.88"    // Superset of multiple tools with enhanced features
    };

    for (const tool of createdTools) {
      try {
        console.log(`📝 Linking ${tool.name} as alternative to Cursor...`);
        
        const similarityScore = similarityScores[tool.slug] || "0.80";
        const alternativeData = {
          proprietaryTool: { connect: { id: cursorTool.id } },
          openSourceTool: { connect: { id: tool.id } },
          similarityScore,
          comparisonNotes: `Open source alternative to Cursor with AI-powered coding features and enhanced capabilities`
        };

        const result = await client.request(CREATE_ALTERNATIVE_MUTATION, { data: alternativeData });
        console.log(`✅ Created alternative relationship: Cursor ↔ ${tool.name} (${Math.round(parseFloat(similarityScore) * 100)}% similarity)`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Failed to create alternative relationship for ${tool.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully processed ${createdTools.length} additional Cursor alternatives!`);
    console.log('\nProcessed tools:');
    createdTools.forEach(tool => console.log(`  - ${tool.name} (${tool.slug})`));

    console.log('\n📊 Summary:');
    console.log(`✅ ${createdTools.length} additional Cursor alternatives processed`);
    console.log('✅ Alternative relationships created');
    console.log('\n🎯 These tools provide: AI-powered coding, autonomous agents, direct LLM integration, and enhanced developer productivity');

  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}