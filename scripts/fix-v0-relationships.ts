#!/usr/bin/env npx tsx

/**
 * Fix V0 alternative relationships
 * Usage: npx tsx scripts/fix-v0-relationships.ts
 */

import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('http://localhost:3003/api/graphql', {
  headers: {
    Cookie: `keystonejs-session=${process.env.KEYSTONE_SESSION || 'Fe26.2**f01b43b5a809c74981b635dc8690e89b725b1dafc82b9001b4cd2986d18b446a*jR97gvVwTXthvz8BKLVUwg*11ecm4NkfrXx7ke9ttZ97Vb_jkdq6ILQD_sf0J_Mh1EUZ_Jfvp4Ntx15ONkHn2qFRgZ2u9v8v91H1zpjxdJJSg*1781930136593*1ac5010e49cc94bea22c3e2c01bd4b0c79ab48e39dad7b0f3819b2153a4823aa*R1uGMlKaUxHp8cLTsMSuKS5URMauAhe-cKr9KEq3-Aw'}`
  }
});

const CREATE_ALTERNATIVE_MUTATION = `
  mutation CreateAlternative($data: AlternativeCreateInput!) {
    createAlternative(data: $data) {
      id
      proprietaryTool { name }
      openSourceTool { name }
    }
  }
`;

const GET_TOOLS_QUERY = `
  query {
    v0: tools(where: { slug: { equals: "v0" } }) {
      id
      name
      slug
    }
    onlook: tools(where: { slug: { equals: "onlook" } }) {
      id
      name
      slug
    }
    openui: tools(where: { slug: { equals: "openui" } }) {
      id
      name
      slug
    }
    screenshotToCode: tools(where: { slug: { equals: "screenshot-to-code" } }) {
      id
      name
      slug
    }
    boltDiy: tools(where: { slug: { equals: "bolt-diy" } }) {
      id
      name
      slug
    }
    boltNew: tools(where: { slug: { equals: "bolt-new" } }) {
      id
      name
      slug
    }
    dyad: tools(where: { slug: { equals: "dyad" } }) {
      id
      name
      slug
    }
    webcrumbs: tools(where: { slug: { equals: "webcrumbs-frontend-ai" } }) {
      id
      name
      slug
    }
    openv0: tools(where: { slug: { equals: "openv0" } }) {
      id
      name
      slug
    }
  }
`;

async function main() {
  try {
    console.log('🔗 Creating V0 alternative relationships...');

    // Get all tools
    const toolsResult = await client.request(GET_TOOLS_QUERY);
    
    const v0Tool = toolsResult.v0[0];
    if (!v0Tool) {
      throw new Error('V0 tool not found');
    }
    
    console.log(`✅ Found V0: ${v0Tool.name} (${v0Tool.id})`);

    const alternatives = [
      { tool: toolsResult.onlook[0], score: "0.85" },
      { tool: toolsResult.openui[0], score: "0.80" },
      { tool: toolsResult.screenshotToCode[0], score: "0.70" },
      { tool: toolsResult.boltDiy[0], score: "0.75" },
      { tool: toolsResult.boltNew[0], score: "0.75" },
      { tool: toolsResult.dyad[0], score: "0.75" },
      { tool: toolsResult.webcrumbs[0], score: "0.70" },
      { tool: toolsResult.openv0[0], score: "0.80" }
    ];

    for (const { tool, score } of alternatives) {
      if (!tool) {
        console.log(`❌ Tool not found, skipping...`);
        continue;
      }

      try {
        console.log(`📝 Linking ${tool.name} as alternative to V0...`);
        
        const alternativeData = {
          proprietaryTool: { connect: { id: v0Tool.id } },
          openSourceTool: { connect: { id: tool.id } },
          similarityScore: score,
          comparisonNotes: `Open source alternative to V0 with AI-powered UI generation capabilities`
        };

        const result = await client.request(CREATE_ALTERNATIVE_MUTATION, { data: alternativeData });
        console.log(`✅ Created alternative relationship: V0 ↔ ${tool.name} (${Math.round(parseFloat(score) * 100)}% similarity)`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Failed to create alternative relationship for ${tool.name}:`, error.message);
      }
    }

    console.log('\n🎉 V0 alternative relationships completed!');

  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}