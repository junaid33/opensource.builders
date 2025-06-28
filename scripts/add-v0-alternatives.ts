#!/usr/bin/env npx tsx

/**
 * Script to add V0 by Vercel and its open source alternatives
 * Usage: npx tsx scripts/add-v0-alternatives.ts
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

// V0 by Vercel (proprietary tool)
const v0Tool: ToolData = {
  name: "V0 by Vercel",
  slug: "v0",
  description: "AI-powered React component generator that creates copy-and-paste friendly React code based on shadcn/ui from simple text prompts",
  isOpenSource: false,
  websiteUrl: "https://v0.dev"
};

// Open source alternatives to V0
const v0Alternatives: ToolData[] = [
  {
    name: "Onlook",
    slug: "onlook",
    description: "The Cursor for Designers - An open-source visual-first code editor for Next.js + TailwindCSS with AI chat for component creation",
    isOpenSource: true,
    repositoryUrl: "https://github.com/onlook-dev/onlook",
    websiteUrl: "https://onlook.dev",
    githubStars: 19498,
    license: "Apache 2.0"
  },
  {
    name: "OpenUI",
    slug: "openui",
    description: "Describe UI using imagination, see it rendered live. Multi-model support with framework flexibility for React, Vue, Svelte, HTML",
    isOpenSource: true,
    repositoryUrl: "https://github.com/wandb/openui",
    websiteUrl: "https://github.com/wandb/openui",
    githubStars: 21531,
    license: "Apache 2.0"
  },
  {
    name: "screenshot-to-code",
    slug: "screenshot-to-code",
    description: "Convert screenshots and designs to clean code (HTML/Tailwind/React/Vue) using AI models like Claude Sonnet and GPT-4o",
    isOpenSource: true,
    repositoryUrl: "https://github.com/abi/screenshot-to-code",
    websiteUrl: "https://github.com/abi/screenshot-to-code",
    githubStars: 70275,
    license: "MIT"
  },
  {
    name: "bolt.diy",
    slug: "bolt-diy",
    description: "Community-driven fork of bolt.new with multiple LLM support for full-stack app development with AI assistance",
    isOpenSource: true,
    repositoryUrl: "https://github.com/stackblitz-labs/bolt.diy",
    websiteUrl: "https://github.com/stackblitz-labs/bolt.diy",
    githubStars: 16546,
    license: "MIT"
  },
  {
    name: "bolt.new",
    slug: "bolt-new",
    description: "AI-powered full-stack web development agent with WebContainers for in-browser development environment",
    isOpenSource: true,
    repositoryUrl: "https://github.com/stackblitz/bolt.new",
    websiteUrl: "https://bolt.new",
    githubStars: 15121,
    license: "MIT"
  },
  {
    name: "Dyad",
    slug: "dyad",
    description: "Free, local, open-source AI app builder that runs completely locally with privacy-focused approach and BYOK for AI models",
    isOpenSource: true,
    repositoryUrl: "https://github.com/dyad-sh/dyad",
    websiteUrl: "https://dyad.sh",
    githubStars: 1498,
    license: "Apache 2.0"
  },
  {
    name: "Webcrumbs Frontend AI",
    slug: "webcrumbs-frontend-ai",
    description: "Build, reuse and share JavaScript plugins with AI assistance. Multi-framework support with image-to-code conversion",
    isOpenSource: true,
    repositoryUrl: "https://github.com/webcrumbs-community/webcrumbs",
    websiteUrl: "https://webcrumbs.org",
    githubStars: 1769,
    license: "AGPL 3.0"
  },
  {
    name: "OpenV0",
    slug: "openv0",
    description: "AI generated UI components with modular component generation pipeline and multi-pass generation process",
    isOpenSource: true,
    repositoryUrl: "https://github.com/raidendotai/openv0",
    websiteUrl: "https://github.com/raidendotai/openv0",
    githubStars: 3880,
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
    console.log('🚀 Starting V0 and alternatives import...');

    // Get Development Tools category
    const categoryResult = await client.request(GET_CATEGORY_QUERY);
    const developmentCategory = categoryResult.categories[0];
    
    if (!developmentCategory) {
      throw new Error('Development Tools category not found');
    }
    
    console.log(`✅ Found category: ${developmentCategory.name} (${developmentCategory.id})`);

    // Step 1: Create V0 by Vercel (proprietary tool)
    console.log('\n📝 Creating V0 by Vercel...');
    
    let v0ToolRecord = await checkIfToolExists(v0Tool.slug);
    
    if (!v0ToolRecord) {
      try {
        v0ToolRecord = await createTool(v0Tool, developmentCategory.id);
        console.log(`✅ Created V0 by Vercel: ${v0ToolRecord.name} (${v0ToolRecord.id})`);
      } catch (error) {
        console.error(`❌ Failed to create V0 by Vercel:`, error);
        return;
      }
    } else {
      console.log(`✅ V0 by Vercel already exists: ${v0ToolRecord.name} (${v0ToolRecord.id})`);
    }

    // Step 2: Create open source alternatives
    console.log('\n📝 Creating open source alternatives...');
    const createdAlternatives = [];
    
    for (const toolData of v0Alternatives) {
      console.log(`📝 Processing ${toolData.name}...`);
      
      try {
        let existingTool = await checkIfToolExists(toolData.slug);
        
        if (!existingTool) {
          const newTool = await createTool(toolData, developmentCategory.id);
          createdAlternatives.push(newTool);
          console.log(`✅ Created ${newTool.name} (${newTool.id})`);
        } else {
          createdAlternatives.push(existingTool);
          console.log(`✅ ${existingTool.name} already exists (${existingTool.id})`);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Failed to create ${toolData.name}:`, error);
      }
    }

    // Step 3: Create alternative relationships
    console.log('\n🔗 Creating alternative relationships...');
    
    const similarityScores = {
      "onlook": 85,
      "openui": 80,
      "screenshot-to-code": 70,
      "bolt-diy": 75,
      "bolt-new": 75,
      "dyad": 75,
      "webcrumbs-frontend-ai": 70,
      "openv0": 80
    };

    for (const tool of createdAlternatives) {
      try {
        console.log(`📝 Linking ${tool.name} as alternative to V0...`);
        
        const similarityScore = similarityScores[tool.slug] || 75;
        const alternativeData = {
          proprietaryTool: { connect: { id: v0ToolRecord.id } },
          openSourceTool: { connect: { id: tool.id } },
          similarityScore: similarityScore.toString(),
          comparisonNotes: `Open source alternative to V0 with AI-powered UI generation capabilities`
        };

        const result = await client.request(CREATE_ALTERNATIVE_MUTATION, { data: alternativeData });
        console.log(`✅ Created alternative relationship: V0 ↔ ${tool.name} (${similarityScore}% similarity)`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Failed to create alternative relationship for ${tool.name}:`, error);
      }
    }

    console.log(`\n🎉 Successfully imported V0 and ${createdAlternatives.length} alternatives!`);
    console.log('\nCreated/verified tools:');
    console.log(`  - ${v0Tool.name} (proprietary)`);
    createdAlternatives.forEach(tool => console.log(`  - ${tool.name} (${tool.slug})`));

    console.log('\n📊 Summary:');
    console.log('✅ V0 by Vercel added as proprietary tool');
    console.log(`✅ ${createdAlternatives.length} open source alternatives processed`);
    console.log('✅ Alternative relationships created');
    console.log('\n🎯 These tools cover: AI-powered UI generation, component creation, design-to-code, and visual development workflows');

  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}